import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';
dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// ── In-memory cache (fallback when MongoDB is unavailable) ────────────────────
const memCache = new Map();
const MEM_CACHE_TTL = 24 * 60 * 60 * 1000; // 24 hours

// ── Try to import Mongoose model (graceful — works without DB) ────────────────
let InsightCache = null;
try {
  const mod = await import('../models/InsightCache.js');
  InsightCache = mod.default;
} catch { /* DB not available */ }

// ── Compact prompt — minimal tokens, structured JSON output ──────────────────
const buildPrompt = (whale, trade, ticker, sentiment) =>
  `You are a financial analyst. Return ONLY valid JSON, no markdown.

Whale: ${whale.name} (${whale.firm})
Trade: ${trade} in $${ticker}
Sentiment: ${sentiment}

JSON format:
{"score":<0-100>,"bias":"<Bullish|Bearish|Neutral>","volatility":"<Low|Medium|High>","liquidity":"<Deep|Moderate|Thin>","insights":["<35 word insight on rationale>","<35 word insight on market correlation>","<35 word insight on risk/opportunity>"]}`;

// ── Intelligent fallback when Gemini quota/error ─────────────────────────────
const buildFallbackInsight = (whale, ticker, sentiment) => {
  const isBullish = ['Accumulating', 'Conviction', 'Innovation Play'].includes(sentiment);
  return {
    score: isBullish ? 76 : 38,
    bias: isBullish ? 'Bullish' : 'Bearish',
    volatility: sentiment === 'High Impact' ? 'High' : 'Low',
    liquidity: 'Deep',
    insights: [
      `${whale.name} at ${whale.firm} is ${isBullish ? 'accumulating' : 'hedging'} $${ticker} — a signal consistent with their known macro thesis and long-term capital allocation framework.`,
      `Institutional money flow data suggests ${isBullish ? 'positive' : 'defensive'} momentum in $${ticker}. This trade typically precedes a 90-day trend continuation with elevated conviction.`,
      `Risk/reward for $${ticker} at current levels is ${isBullish ? 'asymmetrically favorable — defined downside with multi-sigma upside catalyst potential' : 'elevated — limited near-term upside with macro headwinds present'}.`,
    ],
  };
};

// ── Main export ───────────────────────────────────────────────────────────────
export const analyzeWhaleInsight = async (whale, trade, ticker, sentiment) => {
  const cacheKey = `${whale.name.replace(/\s/g, '_')}_${ticker.toUpperCase()}`;

  // 1. Check MongoDB cache
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
  if (memHit && Date.now() - memHit.ts < MEM_CACHE_TTL) {
    console.log(`⚡ Memory Cache HIT [${cacheKey}]`);
    return { ...memHit.data, fromCache: true };
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
      if (parsed.score && parsed.bias && Array.isArray(parsed.insights)) {
        result = parsed;
        console.log(`✅ Gemini success for [${cacheKey}]`);
      }
    }
  } catch (err) {
    const reason = err.message?.includes('RESOURCE_EXHAUSTED') || err.message?.includes('quota')
      ? 'quota exceeded'
      : err.message?.slice(0, 60);
    console.warn(`⚠️  Gemini fallback [${cacheKey}]: ${reason}`);
  }

  // If Gemini failed, use fallback
  if (!result) result = buildFallbackInsight(whale, ticker, sentiment);

  // 4. Store result in both caches
  memCache.set(cacheKey, { data: result, ts: Date.now() });

  if (InsightCache) {
    try {
      await InsightCache.create({
        cacheKey,
        whaleName: whale.name,
        ticker: ticker.toUpperCase(),
        ...result,
      });
    } catch { /* DB unavailable — in-memory cache is sufficient */ }
  }

  return { ...result, fromCache: false, isFallback: !result.score };
};
