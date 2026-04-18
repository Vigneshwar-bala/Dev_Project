/**
 * OpenRouter + EDGAR Hybrid Intelligence Service (Gemini Replacement)
 * ─────────────────────────────────────────────────────────────────────────────
 * Flow:
 *  1. Fetch REAL data from SEC EDGAR (13F filings, factual)
 *  2. Pass to OpenRouter (gpt-4o-mini) → structured JSON response
 *  3. Cache result (Mongo 24h TTL + in-memory)
 * ─────────────────────────────────────────────────────────────────────────────
 */

import axios from 'axios';
import dotenv from 'dotenv';
import { getWhaleEDGARData, formatValue } from './edgarService.js';

dotenv.config();

const OPENROUTER_URL = 'https://openrouter.ai/api/v1/chat/completions';
const MODEL = 'openai/gpt-4o-mini'; // Good limits, fast

// ── In-memory cache ───────────────────────────────────────────────────────────
const memCache = new Map();

// ── Mongoose model (graceful fallback) ──────────────────────────────────────
let InsightCache = null;
try {
  const mod = await import('../models/InsightCache.js');
  InsightCache = mod.default;
} catch {}

// ── Daily cache key ──────────────────────────────────────────────────────────
const getTodayKey = () => new Date().toISOString().split('T')[0];

// ── Grounded prompt (identical to Gemini) ────────────────────────────────────
const buildGroundedPrompt = (whale, trade, ticker, sentiment, edgarData) => {
  let factualContext = '';

  if (edgarData?.found) {
    const pos = edgarData.tickerPosition;
    const topStr = edgarData.topHoldings?.slice(0, 5)
      .map(h => `  - ${h.name}: ${formatValue(h.value)} (${h.shares?.toLocaleString()} shares)`)
      .join('\\n') || '  (not available)';

    factualContext = `
REAL SEC 13F FILING DATA (as of ${edgarData.filingDate})
Entity: ${edgarData.entityName} (CIK: ${edgarData.cik})
Filing: ${edgarData.filingUrl}

${pos
  ? `Target Position ($${ticker.toUpperCase()}):
  - Market Value: ${formatValue(pos.value)}
  - Shares Held: ${pos.shares?.toLocaleString() || 'see filing'}
  - This position IS confirmed in their 13F.`
  : `NOTE: $${ticker.toUpperCase()} was NOT found as a named holding in this 13F.`
}

Top 5 Holdings:
${topStr}`;

  } else {
    factualContext = `EDGAR DATA: ${edgarData?.reason || 'not available'}`;
  }

  return `You are a Wall Street analyst. Use the REAL SEC EDGAR data below.

WHALE: ${whale.name} (${whale.firm})
TRADE: ${trade}
TICKER: $${ticker.toUpperCase()}
SENTIMENT: ${sentiment}

${factualContext}

Return ONLY valid JSON:
{
  "score": <0-100>,
  "bias": "Bullish|Bearish|Neutral",
  "volatility": "Low|Medium|High",
  "liquidity": "Deep|Moderate|Thin",
  "stockBought": "<exact from EDGAR>",
  "whyBought": "<concise rationale>",
  "profitMade": "<estimated based on data>",
  "edgarVerified": true/false
}`;
};

// ── Fallback insight ─────────────────────────────────────────────────────────
const buildFallbackInsight = (whale, ticker, sentiment, edgarData) => ({
  score: sentiment.includes('Bull') ? 65 : 32,
  bias: sentiment.includes('Bull') ? 'Bullish' : 'Bearish',
  volatility: 'Medium',
  liquidity: 'Deep',
  edgarVerified: edgarData?.found || false,
  stockBought: edgarData?.tickerPosition ? `${formatValue(edgarData.tickerPosition.value)} worth of shares per 13F` : 'Not in latest 13F',
  whyBought: 'OpenRouter unavailable - see EDGAR filing for details',
  profitMade: 'Calculate from filing date price',
  isFallback: true,
});

// ── OpenRouter API call ──────────────────────────────────────────────────────
const callOpenRouter = async (prompt) => {
  const response = await axios.post(OPENROUTER_URL, {
    model: MODEL,
    messages: [{ role: 'user', content: prompt }],
    temperature: 0.1,
    max_tokens: 600,
  }, {
    headers: {
      'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
      'Content-Type': 'application/json',
      'HTTP-Referer': 'https://stocky.dev',
      'X-Title': 'StockY Terminal',
    },
    timeout: 15000,
  });

  const content = response.data.choices[0].message.content.trim();
  const jsonMatch = content.match(/\{[\s\S]*\}/);
  if (!jsonMatch) throw new Error('No JSON in response');

  const parsed = JSON.parse(jsonMatch[0]);
  if (parsed.score === undefined || !parsed.bias) throw new Error('Invalid JSON structure');

  return parsed;
};

// ── Main function ────────────────────────────────────────────────────────────
export const analyzeWhaleInsight = async (whale, trade, ticker, sentiment, userId) => {
  const today = getTodayKey();
  const cacheKey = `${whale.name.replace(/\s/g, '_')}_${ticker.toUpperCase()}_${today}`;

  // Get user config
  let userConfig = { scoreThreshold: 70, volatilityFilter: 'Medium' };
  if (userId && InsightCache) {
    try {
      const { default: User } = await import('../models/User.js');
      const user = await User.findById(userId).select('aiConfig');
      if (user?.aiConfig) {
        userConfig = user.aiConfig;
      }
    } catch {}
  }

  // Cache checks
  if (InsightCache) {
    try {
      const cached = await InsightCache.findOne({ cacheKey });
      if (cached && cached.score >= userConfig.scoreThreshold) {
        return { ...cached.toObject(), fromCache: true };
      }
    } catch {}
  }
  const memHit = memCache.get(cacheKey);
  if (memHit && memHit.score >= userConfig.scoreThreshold) {
    return { ...memHit, fromCache: true };
  }

  // EDGAR
  const edgarData = await getWhaleEDGARData(whale.name, ticker);

  // OpenRouter
  let result = null;
  try {
    const prompt = buildGroundedPrompt(whale, trade, ticker, sentiment, edgarData);
    result = await callOpenRouter(prompt);
    // Apply threshold
    if (result.score < userConfig.scoreThreshold) {
      return { score: result.score, bias: 'Filtered', fromCache: false, reason: `Below threshold (${userConfig.scoreThreshold})`, userConfig };
    }
    if (result.volatility !== userConfig.volatilityFilter) {
      return { score: result.score, bias: 'Filtered', fromCache: false, reason: `Volatility mismatch`, userConfig };
    }
    console.log(`✅ OpenRouter + config filter [${MODEL}]`);
  } catch (err) {
    console.warn(`⚠️ OpenRouter fallback: ${err.message.slice(0, 60)}`);
  }

  if (!result) result = buildFallbackInsight(whale, ticker, sentiment, edgarData);

  // Cache
  memCache.set(cacheKey, { ...result, fromCache: false });
  if (InsightCache) {
    try {
      await InsightCache.create({
        cacheKey, whaleName: whale.name, ticker: ticker.toUpperCase(), date: today,
        score: result.score, bias: result.bias, volatility: result.volatility, liquidity: result.liquidity,
        stockBought: result.stockBought, whyBought: result.whyBought, profitMade: result.profitMade,
        isFallback: !!result.isFallback, edgarVerified: !!result.edgarVerified,
      });
    } catch {}
  }

  return { ...result, fromCache: false, edgarData: edgarData, userConfig };
};


