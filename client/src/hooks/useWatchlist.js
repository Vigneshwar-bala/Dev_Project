import { useState, useEffect, useCallback } from 'react';
import { getWatchlist, addToWatchlist, removeFromWatchlist } from '../services/api';
import toast from 'react-hot-toast';

// Default tickers pre-loaded on first launch (seeded if DB is empty)
const DEFAULT_TICKERS = [
  { ticker: 'TSLA', name: 'Tesla, Inc.', exchange: 'NASDAQ', assetType: 'Stock' },
  { ticker: 'NVDA', name: 'Nvidia Corp.', exchange: 'NASDAQ', assetType: 'Stock' },
  { ticker: 'AAPL', name: 'Apple Inc.', exchange: 'NASDAQ', assetType: 'Stock' },
  { ticker: 'AMZN', name: 'Amazon.com', exchange: 'NASDAQ', assetType: 'Stock' },
  { ticker: 'BTC', name: 'Bitcoin', exchange: 'Coinbase', assetType: 'Crypto' },
];

export const useWatchlist = () => {
  const [watchlist, setWatchlist] = useState([]);
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);

  const fetchWatchlist = useCallback(async () => {
    try {
      setLoading(true);
      const data = await getWatchlist();

      // If DB is empty on first launch, seed default tickers
      if (data.length === 0) {
        for (const item of DEFAULT_TICKERS) {
          try { await addToWatchlist(item); } catch { /* skip dupes */ }
        }
        const seeded = await getWatchlist();
        setWatchlist(seeded);
      } else {
        setWatchlist(data);
      }
    } catch (err) {
      toast.error('Failed to load watchlist');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchWatchlist(); }, [fetchWatchlist]);

  const addTicker = async (item) => {
    try {
      setAdding(true);
      const newItem = await addToWatchlist(item);
      setWatchlist(prev => [newItem, ...prev]);
      toast.success(`${item.ticker.toUpperCase()} added to watchlist`);
      return true;
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to add ticker';
      toast.error(msg);
      return false;
    } finally {
      setAdding(false);
    }
  };

  const removeTicker = async (ticker) => {
    try {
      await removeFromWatchlist(ticker);
      setWatchlist(prev => prev.filter(i => i.ticker !== ticker));
      toast.success(`${ticker} removed`);
    } catch {
      toast.error('Failed to remove ticker');
    }
  };

  return { watchlist, loading, adding, addTicker, removeTicker, refresh: fetchWatchlist };
};
