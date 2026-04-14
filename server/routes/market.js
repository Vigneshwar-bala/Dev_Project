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

import axios from 'axios';

// GET /api/market/search?q=... — Live Groww/Screener style ticker search via Yahoo Finance API
router.get('/search', async (req, res) => {
  const query = req.query.q;
  if (!query) return res.json({ success: true, data: [] });

  try {
    const { data } = await axios.get('https://query2.finance.yahoo.com/v1/finance/search', {
      params: { q: query, quotesCount: 8, newsCount: 0 }
    });

    const suggestions = data.quotes
      .filter((q) => q.isYahooFinance) // filter out noise
      .map((q) => ({
        ticker: q.symbol,
        name: q.shortname || q.longname || q.symbol,
        exchange: q.exchange || 'Unknown',
        assetType: q.quoteType === 'EQUITY' ? 'Stock' : q.quoteType === 'CRYPTOCURRENCY' ? 'Crypto' : 'ETF'
      }));

    res.json({ success: true, data: suggestions });
  } catch (err) {
    console.error('Search proxy error:', err.message);
    res.status(500).json({ success: false, message: 'Search failed' });
  }
});

export default router;
