import express from 'express';
import { analyzeWhaleInsight } from '../services/geminiService.js';

const router = express.Router();

// POST /api/sentiment/analyze
router.post('/analyze', async (req, res) => {
  try {
    const { whale, trade, ticker, sentiment } = req.body;
    if (!whale || !trade || !ticker) {
      return res.status(400).json({ success: false, message: 'whale, trade, and ticker are required' });
    }
    const insight = await analyzeWhaleInsight(whale, trade, ticker, sentiment || 'Neutral');
    res.json({ success: true, data: insight });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET /api/sentiment/cache/:key
router.get('/cache/:key', async (req, res) => {
  // Try MongoDB
  try {
    const { default: InsightCache } = await import('../models/InsightCache.js');
    const cached = await InsightCache.findOne({ cacheKey: req.params.key });
    return res.json({ success: true, exists: !!cached, data: cached || null });
  } catch {
    return res.json({ success: true, exists: false });
  }
});

export default router;
