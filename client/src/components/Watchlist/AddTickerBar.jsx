import { useState } from 'react';

// Common tickers for quick-add suggestions
const SUGGESTIONS = {
  MSFT: { name: 'Microsoft Corp.', exchange: 'NASDAQ', assetType: 'Stock' },
  GOOGL: { name: 'Alphabet Inc.', exchange: 'NASDAQ', assetType: 'Stock' },
  META: { name: 'Meta Platforms', exchange: 'NASDAQ', assetType: 'Stock' },
  OXY: { name: 'Occidental Petroleum', exchange: 'NYSE', assetType: 'Stock' },
  GLD: { name: 'SPDR Gold ETF', exchange: 'NYSE', assetType: 'ETF' },
  ETH: { name: 'Ethereum', exchange: 'Coinbase', assetType: 'Crypto' },
  SPY: { name: 'S&P 500 ETF', exchange: 'NYSE', assetType: 'ETF' },
  QQQ: { name: 'Invesco QQQ', exchange: 'NASDAQ', assetType: 'ETF' },
};

export default function AddTickerBar({ onAdd, adding }) {
  const [input, setInput] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);

  const filteredSuggestions = input.length > 0
    ? Object.entries(SUGGESTIONS).filter(([ticker]) =>
        ticker.toLowerCase().startsWith(input.toLowerCase())
      )
    : [];

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const ticker = input.trim().toUpperCase();
    const meta = SUGGESTIONS[ticker] || {
      name: ticker,
      exchange: 'NASDAQ',
      assetType: 'Stock',
    };

    const success = await onAdd({ ticker, ...meta });
    if (success) setInput('');
    setShowSuggestions(false);
  };

  const handleSuggestionClick = async (ticker, meta) => {
    setInput(ticker);
    setShowSuggestions(false);
    const success = await onAdd({ ticker, ...meta });
    if (success) setInput('');
  };

  return (
    <div className="relative">
      <form onSubmit={handleSubmit}>
        <input
          value={input}
          onChange={(e) => { setInput(e.target.value); setShowSuggestions(true); }}
          onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
          onFocus={() => input && setShowSuggestions(true)}
          className="w-full bg-surface-container-lowest border border-outline-variant/10 rounded-2xl py-2.5 px-10 text-xs focus:ring-1 focus:ring-primary-fixed/50 transition-all text-on-surface placeholder:text-on-surface-variant/40 outline-none"
          placeholder="Add Ticker... (e.g. MSFT)"
          type="text"
          disabled={adding}
        />
        <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant" style={{ fontSize: '14px' }}>
          search
        </span>
        {adding && (
          <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-primary-fixed animate-spin" style={{ fontSize: '14px' }}>
            progress_activity
          </span>
        )}
      </form>

      {/* Suggestions dropdown */}
      {showSuggestions && filteredSuggestions.length > 0 && (
        <div className="absolute z-20 top-full left-0 right-0 mt-1 bg-surface-container-high border border-outline-variant/20 rounded-2xl overflow-hidden shadow-xl">
          {filteredSuggestions.map(([ticker, meta]) => (
            <button
              key={ticker}
              onMouseDown={() => handleSuggestionClick(ticker, meta)}
              className="w-full flex items-center justify-between px-4 py-2.5 hover:bg-surface-container-highest text-left transition-colors"
            >
              <div>
                <p className="text-xs font-bold text-on-surface">{ticker}</p>
                <p className="text-[10px] text-on-surface-variant">{meta.name}</p>
              </div>
              <span className="text-[9px] text-on-surface-variant/50 uppercase">{meta.assetType}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
