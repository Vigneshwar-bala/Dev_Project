import mongoose from 'mongoose';

const insightCacheSchema = new mongoose.Schema({
  cacheKey: {
    type: String,
    required: true,
    unique: true,
    index: true,
  },
  whaleName: { type: String, required: true },
  ticker:    { type: String, required: true, uppercase: true },
  date:      { type: String, required: true }, // YYYY-MM-DD — for daily grouping

  // Sentiment gauge fields
  score:     { type: Number, min: 0, max: 100, required: true },
  bias:      { type: String, enum: ['Bullish', 'Bearish', 'Neutral'], required: true },
  volatility:{ type: String, enum: ['Low', 'Medium', 'High'], required: true },
  liquidity: { type: String, enum: ['Deep', 'Moderate', 'Thin'], required: true },

  // ── The 3 factual insight fields ─────────────────────────────────────────
  stockBought: { type: String, required: true }, // WHAT they bought
  whyBought:   { type: String, required: true }, // WHY they bought it
  profitMade:  { type: String, required: true }, // WHAT profit they made
  profitGraph: { type: [Number], default: [] },  // Array of 6 data points for the profit graph over the last 6 months

  isFallback: { type: Boolean, default: false }, // true = Gemini was unavailable
  edgarVerified: { type: Boolean, default: false }, // true = real SEC 13F data was used

  createdAt: {
    type: Date,
    default: Date.now,
    // TTL index: MongoDB auto-deletes this document after 24 hours
    expires: 86400,
  },
});

const InsightCache = mongoose.model('InsightCache', insightCacheSchema);
export default InsightCache;
