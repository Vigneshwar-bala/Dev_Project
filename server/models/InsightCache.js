import mongoose from 'mongoose';

const insightCacheSchema = new mongoose.Schema({
  cacheKey: {
    type: String,
    required: true,
    unique: true,
    index: true,
  },
  whaleName: { type: String, required: true },
  ticker: { type: String, required: true, uppercase: true },
  score: { type: Number, min: 0, max: 100, required: true },
  bias: { type: String, enum: ['Bullish', 'Bearish', 'Neutral'], required: true },
  volatility: { type: String, enum: ['Low', 'Medium', 'High'], required: true },
  liquidity: { type: String, enum: ['Deep', 'Moderate', 'Thin'], required: true },
  insights: [{ type: String }],
  createdAt: {
    type: Date,
    default: Date.now,
    // TTL index: auto-delete after 24 hours to keep Gemini API usage minimal
    expires: 86400,
  },
});

const InsightCache = mongoose.model('InsightCache', insightCacheSchema);
export default InsightCache;
