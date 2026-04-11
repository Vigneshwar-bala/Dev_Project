import express from 'express';
import { getStockQuote, getCryptoQuote } from '../services/alphaVantageService.js';

const router = express.Router();

// GET /api/market/quote/:ticker — Get stock quote
router.get('/quote/:ticker', async (req, res) => {
  try {
    const quote = await getStockQuote(req.params.ticker.toUpperCase());
    res.json({ success: true, data: quote });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET /api/market/crypto/:symbol — Get crypto price
router.get('/crypto/:symbol', async (req, res) => {
  try {
    const quote = await getCryptoQuote(req.params.symbol.toUpperCase());
    res.json({ success: true, data: quote });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

export default router;
