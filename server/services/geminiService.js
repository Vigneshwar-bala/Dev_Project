import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';
dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// ── In-memory cache (fallback when MongoDB is unavailable) ────────────────────
const memCache = new Map();

// ── Try to import Mongoose model (graceful — works without DB) ────────────────
let InsightCache = null;
try {
  const mod = await import('../models/InsightCache.js');
  InsightCache = mod.default;
} catch { /* DB not available */ }

// ── Get today's date string (YYYY-MM-DD) for daily cache scoping ────────────
const getTodayKey = () => new Date().toISOString().split('T')[0];

// ── Structured prompt — asks Gemini for 3 real factual points ────────────────
const buildPrompt = (whale, trade, ticker, sentiment) =>
  `You are a financial research assistant with access to real public SEC filings, 13F reports, and earnings data.

Whale investor: ${whale.name} at ${whale.firm}
Ticker: $${ticker}
Trade action: ${trade}
Market sentiment: ${sentiment}

Return ONLY valid JSON — no markdown, no explanation, no code fences.

Your response must be factual, grounded in real publicly reported data (SEC 13F filings, Bloomberg, Reuters, earnings calls). Do NOT fabricate numbers.

JSON format:
{
  "score": <integer 0-100, conviction score>,
  "bias": "<Bullish|Bearish|Neutral>",
  "volatility": "<Low|Medium|High>",
  "liquidity": "<Deep|Moderate|Thin>",
  "stockBought": "<One sentence: WHAT stock/position they bought or built — ticker, share count if publicly known, and approximate dollar value from 13F>",
  "whyBought": "<One sentence: WHY they bought it — their stated thesis, sector tailwind, or macro reason from public record>",
  "profitMade": "<One sentence: WHAT profit or return they made or are targeting — include % gain, time period, or exit price if known from public filings or news>"
}`;

// ── Minimal fallback — shows honest "data unavailable" instead of fake text ──
const buildFallbackInsight = (whale, ticker, sentiment) => {
  const isBullish = ['Accumulating', 'Conviction', 'Innovation Play'].includes(sentiment);
  return {
    score: isBullish ? 68 : 35,
    bias: isBullish ? 'Bullish' : 'Bearish',
    volatility: 'Medium',
    liquidity: 'Deep',
    stockBought: `Position data for ${whale.name}'s $${ticker} trade not available — check latest SEC 13F filing at sec.gov for exact share count.`,
    whyBought: `Specific thesis not retrievable at this time. Gemini API quota may be exhausted. Check CNBC, Bloomberg, or the firm's investor letters for rationale.`,
    profitMade: `Profit/return data unavailable. Review the stock's price history from the filing date to present using a charting tool.`,
    isFallback: true,
  };
};

// ── Main export ───────────────────────────────────────────────────────────────
export const analyzeWhaleInsight = async (whale, trade, ticker, sentiment) => {
  const today = getTodayKey();
  // Date-scoped cache key: resets every 24 hours naturally
  const cacheKey = `${whale.name.replace(/\s/g, '_')}_${ticker.toUpperCase()}_${today}`;

  // 1. Check MongoDB cache (TTL auto-deletes after 24h via the `expires` index)
  if (InsightCache) {
    try {
      const cached = await InsightCache.findOne({ cacheKey });
      if (cached) {
        console.log(`⚡ MongoDB Cache HIT [${cacheKey}]`);
        return { ...cached.toObject(), fromCache: true };
      }
    } catch { /* DB unavailable — continue to mem cache */ }
  }

  // 2. Check in-memory cache
  const memHit = memCache.get(cacheKey);
  if (memHit) {
    console.log(`⚡ Memory Cache HIT [${cacheKey}]`);
    return { ...memHit, fromCache: true };
  }

  // 3. Call Gemini
  console.log(`🤖 Calling Gemini for [${cacheKey}]`);
  let result = null;

  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash-latest' });
    const response = await model.generateContent(buildPrompt(whale, trade, ticker, sentiment));
    const text = response.response.text().trim();
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      const parsed = JSON.parse(jsonMatch[0]);
      if (
        parsed.score !== undefined &&
        parsed.bias &&
        parsed.stockBought &&
        parsed.whyBought &&
        parsed.profitMade
      ) {
        result = parsed;
        console.log(`✅ Gemini success for [${cacheKey}]`);
      }
    }
  } catch (err) {
    const reason = err.message?.includes('RESOURCE_EXHAUSTED') || err.message?.includes('quota')
      ? 'quota exceeded'
      : err.message?.slice(0, 80);
    console.warn(`⚠️  Gemini fallback [${cacheKey}]: ${reason}`);
  }

  // If Gemini failed, use honest fallback (no fake fabricated text)
  if (!result) result = buildFallbackInsight(whale, ticker, sentiment);

  // 4. Store result in both caches
  memCache.set(cacheKey, { ...result, fromCache: false });

  if (InsightCache) {
    try {
      await InsightCache.create({
        cacheKey,
        whaleName: whale.name,
        ticker: ticker.toUpperCase(),
        date: today,
        score: result.score,
        bias: result.bias,
        volatility: result.volatility,
        liquidity: result.liquidity,
        stockBought: result.stockBought,
        whyBought: result.whyBought,
        profitMade: result.profitMade,
        isFallback: result.isFallback || false,
      });
      console.log(`💾 Stored in MongoDB [${cacheKey}]`);
    } catch (e) {
      console.warn('⚠️  MongoDB store failed:', e.message);
    }
  }

  return { ...result, fromCache: false };
};
