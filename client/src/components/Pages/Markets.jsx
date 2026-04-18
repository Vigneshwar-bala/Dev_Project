import React, { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { getStockQuote, getCryptoQuote, searchTickers } from '../../services/api.js';

const INDICES = [
  { symbol: 'SPX', name: 'S&amp;P 500', quote: 5478.13, change: 1.45, spark: [100, 102, 105, 103, 107] },
  { symbol: 'NDX', name: 'Nasdaq 100', quote: 19832.5, change: 2.12, spark: [98, 101, 104, 106, 102] },
  { symbol: 'NIFTY', name: 'Nifty 50', quote: 24358.15, change: -0.23, spark: [102, 101, 100, 99, 98] },
  { symbol: 'BTC', name: 'Bitcoin', quote: 68234, change: 3.87, spark: [95, 98, 102, 105, 108] },
  { symbol: 'GOLD', name: 'Gold (oz)', quote: 2387.5, change: 0.89, spark: [99, 100, 101, 102, 101] },
];

const MOCK_MOVERS = [
  { ticker: 'NVDA', price: 124.56, change: 4.23, vol: '85M' },
  { ticker: 'TSLA', price: 248.91, change: -1.45, vol: '112M' },
  { ticker: 'AAPL', price: 227.45, change: 0.67, vol: '62M' },
  { ticker: 'MSFT', price: 416.78, change: 2.18, vol: '45M' },
  { ticker: 'AMD', price: 158.23, change: 3.45, vol: '78M' },
  { ticker: 'SMCI', price: 892.34, change: -2.67, vol: '34M' },
  { ticker: 'AVGO', price: 1712.90, change: 5.12, vol: '29M' },
];

export default function Markets() {
  const [indices, setIndices] = useState(INDICES);
  const [movers, setMovers] = useState(MOCK_MOVERS);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);

  const fetchQuotes = async () => {
    try {
      const updates = await Promise.all([
        getStockQuote('SPY'), // Proxy for SPX
        getStockQuote('QQQ'), // Proxy for NDX
        getCryptoQuote('BTCUSD'),
      ]);
      // Update indices with real data (mock for demo)
      setIndices(prev => prev.map((idx, i) => i < 3 ? { ...idx, quote: updates[i]?.price || idx.quote } : idx));
    } catch {
      toast('Market data fallback - using latest snapshot');
    }
  };

  useEffect(() => {
    fetchQuotes();
    const interval = setInterval(fetchQuotes, 30000);
    return () => clearInterval(interval);
  }, []);

  const handleSearch = async () => {
    if (!searchQuery) return;
    try {
      const results = await searchTickers(searchQuery);
      setSearchResults(results.slice(0, 5));
    } catch {
      setSearchResults([{ ticker: 'AAPL', name: 'Fallback Result' }]);
    }
  };

  const changeColor = (pct) => pct >= 0 ? 'bg-gradient-to-r from-primary/20 to-primary-fixed/20 text-primary-fixed border-primary-fixed/30' : 'bg-gradient-to-r from-error/20 to-[#ffb4ab]/20 text-error border-error/30';

  return (
    <div className="flex-1 glass-panel rounded-3xl p-8 flex flex-col md:flex-row gap-8 min-h-0 overflow-hidden">
      <div className="flex-1 min-h-0">
        <div className="flex items-center gap-4 mb-8">
          <span className="material-symbols-outlined text-4xl text-primary">query_stats</span>
          <h1 className="text-4xl font-headline font-light tracking-widest text-primary-fixed uppercase">
            Global Indices
          </h1>
        </div>

        <div className="space-y-4">
          {indices.map((index, i) => (
            <div key={i} className="glass-panel p-6 rounded-2xl flex items-center justify-between">
              <div>
                <div className="flex items-baseline gap-2 mb-1">
                  <h2 className="text-xl font-bold text-on-surface">{index.name}</h2>
                  <span className="text-sm text-on-surface-variant font-mono">({index.symbol})</span>
                </div>
                <p className="text-3xl font-headline font-light text-primary-fixed">{index.quote.toLocaleString()}</p>
              </div>
              <div className="text-right">
                <p className={`text-lg font-mono font-semibold ${index.change >= 0 ? 'text-primary-fixed' : 'text-error'}`}>
                  {index.change >= 0 ? '+' : ''}{index.change}%
                </p>
                <div className="w-20 h-2 bg-surface-container-high rounded-full mt-2 overflow-hidden">
                  <div className={`h-full rounded-full ${index.change >= 0 ? 'bg-primary-fixed' : 'bg-error'}`} style={{ width: `${Math.abs(index.change) * 8}%` }} />
                </div>
              </div>
              {/* Sparkline */}
              <div className="w-20 h-4 bg-surface-container-low rounded overflow-hidden ml-4 flex items-end">
                {index.spark.map((p, j) => (
                  <div key={j} className="flex-1 bg-gradient-to-t from-primary-fixed/40 to-primary" style={{ height: `${p}%` }} />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="flex-1 min-h-0 border-l border-outline-variant/20 pl-8">
        <div className="flex items-center gap-4 mb-6">
          <h2 className="text-2xl font-bold text-on-surface">Top Movers</h2>
          <div className="flex-1 relative">
            <input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search tickers..."
              className="w-full bg-surface-container-low px-4 py-2 rounded-xl border border-outline-variant/30 text-sm placeholder:text-on-surface-variant focus:outline-none focus:border-primary-fixed/50 transition-colors"
            />
            <span className="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 text-on-surface-variant" style={{fontSize: '18px'}}>search</span>
          </div>
          {searchResults.length > 0 && (
            <div className="absolute right-0 top-full mt-1 w-64 glass-panel rounded-2xl shadow-xl border p-3">
              {searchResults.map((r, i) => (
                <div key={i} className="text-sm py-1 hover:bg-primary-fixed/10 rounded cursor-pointer">{r.ticker || r.symbol} - {r.name}</div>
              ))}
            </div>
          )}
        </div>

        <div className="space-y-3 overflow-y-auto max-h-full">
          {movers.map((mover, i) => (
            <div key={i} className={`glass-panel p-4 rounded-xl flex items-center justify-between hover:shadow-lg transition-all ${changeColor(mover.change)}`}>
              <div className="flex items-center gap-3">
                <span className={`w-3 h-10 rounded-lg ${mover.change >= 0 ? 'bg-primary-fixed' : 'bg-error'} shadow-lg`} />
                <div>
                  <p className="font-bold text-lg text-on-surface">{mover.ticker}</p>
                  <p className="text-sm text-on-surface-variant">${mover.price}</p>
                </div>
              </div>
              <div className="text-right">
                <p className={`text-lg font-semibold ${mover.change >= 0 ? 'text-primary-fixed' : 'text-error'}`}>
                  {mover.change >= 0 ? '+' : ''}{mover.change}%
                </p>
                <p className="text-xs text-on-surface-variant">{mover.vol}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

