import express from 'express';
import { getStockQuote, getCryptoQuote } from '../services/alphaVantageService.js';

const router = express.Router();

// ── In-memory watchlist (fallback when MongoDB is down) ───────────────────────
let memWatchlist = [
  { ticker: 'TSLA', name: 'Tesla, Inc.', exchange: 'NASDAQ', assetType: 'Stock', _id: 'tsla', addedAt: new Date() },
  { ticker: 'NVDA', name: 'Nvidia Corp.', exchange: 'NASDAQ', assetType: 'Stock', _id: 'nvda', addedAt: new Date() },
  { ticker: 'AAPL', name: 'Apple Inc.', exchange: 'NASDAQ', assetType: 'Stock', _id: 'aapl', addedAt: new Date() },
  { ticker: 'AMZN', name: 'Amazon.com', exchange: 'NASDAQ', assetType: 'Stock', _id: 'amzn', addedAt: new Date() },
  { ticker: 'BTC', name: 'Bitcoin', exchange: 'Coinbase', assetType: 'Crypto', _id: 'btc', addedAt: new Date() },
];

// ── Try to import Mongoose model (graceful) ───────────────────────────────────
let Watchlist = null;
try {
  const mod = await import('../models/Watchlist.js');
  Watchlist = mod.default;
} catch { /* DB not available */ }

const enrichWithPrice = async (item) => {
  try {
    const quote = item.assetType === 'Crypto'
      ? await getCryptoQuote(item.ticker)
      : await getStockQuote(item.ticker);
    return { ...item, ...quote };
  } catch {
    return item;
  }
};

// GET /api/watchlist
router.get('/', async (req, res) => {
  try {
    let items;

    if (Watchlist) {
      try {
        items = await Watchlist.find().sort({ addedAt: -1 }).lean();
      } catch {
        items = memWatchlist;
      }
    } else {
      items = memWatchlist;
    }

    // Enrich all items with live prices in parallel
    const enriched = await Promise.all(items.map(enrichWithPrice));
    res.json({ success: true, data: enriched });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// POST /api/watchlist
router.post('/', async (req, res) => {
  try {
    const { ticker, name, exchange, assetType } = req.body;
    if (!ticker || !name) {
      return res.status(400).json({ success: false, message: 'ticker and name are required' });
    }

    const t = ticker.toUpperCase();

    if (Watchlist) {
      try {
        const exists = await Watchlist.findOne({ ticker: t });
        if (exists) return res.status(409).json({ success: false, message: `${t} already in watchlist` });

        const item = await Watchlist.create({ ticker: t, name, exchange: exchange || 'NASDAQ', assetType: assetType || 'Stock' });
        const enriched = await enrichWithPrice(item.toObject());
        return res.status(201).json({ success: true, data: enriched });
      } catch { /* fall through to mem */ }
    }

    // In-memory fallback
    if (memWatchlist.find(i => i.ticker === t)) {
      return res.status(409).json({ success: false, message: `${t} already in watchlist` });
    }
    const newItem = { ticker: t, name, exchange: exchange || 'NASDAQ', assetType: assetType || 'Stock', _id: t.toLowerCase(), addedAt: new Date() };
    memWatchlist.unshift(newItem);
    const enriched = await enrichWithPrice(newItem);
    res.status(201).json({ success: true, data: enriched });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// DELETE /api/watchlist/:ticker
router.delete('/:ticker', async (req, res) => {
  try {
    const t = req.params.ticker.toUpperCase();

    if (Watchlist) {
      try {
        const deleted = await Watchlist.findOneAndDelete({ ticker: t });
        if (deleted) return res.json({ success: true, message: `${t} removed` });
      } catch { /* fall through to mem */ }
    }

    // In-memory fallback
    const before = memWatchlist.length;
    memWatchlist = memWatchlist.filter(i => i.ticker !== t);
    if (memWatchlist.length === before) {
      return res.status(404).json({ success: false, message: 'Ticker not found' });
    }
    res.json({ success: true, message: `${t} removed` });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

export default router;
