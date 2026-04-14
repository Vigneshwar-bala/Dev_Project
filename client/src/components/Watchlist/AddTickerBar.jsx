import { useState, useEffect } from 'react';
import { searchTickers } from '../../services/api';

export default function AddTickerBar({ onAdd, adding }) {
  const [input, setInput] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isSearching, setIsSearching] = useState(false);

  // Debounced Search Effect
  useEffect(() => {
    if (!input.trim() || input.trim().length < 2) {
      setSuggestions([]);
      return;
    }

    const timer = setTimeout(async () => {
      setIsSearching(true);
      try {
        const results = await searchTickers(input.trim());
        setSuggestions(results);
      } catch (err) {
        console.error('Failed to search tickers', err);
        setSuggestions([]);
      } finally {
        setIsSearching(false);
      }
    }, 400); // 400ms debounce

    return () => clearTimeout(timer);
  }, [input]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    // Default basic add if they just hit enter before a match loads
    const ticker = input.trim().toUpperCase();
    const success = await onAdd({ ticker, name: ticker, exchange: 'Unknown', assetType: 'Stock' });
    if (success) {
      setInput('');
      setSuggestions([]);
    }
    setShowSuggestions(false);
  };

  const handleSuggestionClick = async (item) => {
    setInput(item.ticker);
    setShowSuggestions(false);
    
    // The backend uses item.ticker to get the quote (e.g. TCS.NS)
    const success = await onAdd({ 
      ticker: item.ticker, 
      name: item.name, 
      exchange: item.exchange, 
      assetType: item.assetType 
    });
    
    if (success) {
      setInput('');
      setSuggestions([]);
    }
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
          placeholder="Search Markets globally... (e.g. TCS, AAPL)"
          type="text"
          disabled={adding}
          autoComplete="off"
        />
        <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant" style={{ fontSize: '14px' }}>
          search
        </span>
        {(adding || isSearching) && (
          <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-primary-fixed animate-spin" style={{ fontSize: '14px' }}>
            progress_activity
          </span>
        )}
      </form>

      {/* Live Suggestions Dropdown */}
      {showSuggestions && input.length >= 2 && (
        <div className="absolute z-20 top-full left-0 right-0 mt-2 bg-surface-container-high/90 backdrop-blur-xl border border-outline-variant/20 rounded-2xl overflow-hidden shadow-[0_10px_40px_rgba(0,0,0,0.5)]">
          {isSearching && suggestions.length === 0 ? (
            <div className="px-4 py-3 text-xs text-on-surface-variant/60 flex items-center gap-2">
               <span className="material-symbols-outlined animate-pulse text-sm">satellite_alt</span>
               Scanning global exchanges...
            </div>
          ) : suggestions.length > 0 ? (
            <div className="max-h-60 overflow-y-auto no-scrollbar py-1">
              {suggestions.map((item) => (
                <button
                  key={`${item.ticker}-${item.exchange}`}
                  onMouseDown={() => handleSuggestionClick(item)}
                  className="w-full flex items-center justify-between px-4 py-2 hover:bg-surface-container-highest text-left transition-colors border-b border-white/5 last:border-0"
                >
                  <div className="flex-1 min-w-0 pr-4">
                    <div className="flex items-center gap-2">
                      <p className="text-xs font-bold text-on-surface truncate">{item.ticker}</p>
                      <span className="px-1.5 py-0.5 rounded bg-primary-fixed/10 text-primary-fixed text-[8px] uppercase tracking-widest">{item.assetType}</span>
                    </div>
                    <p className="text-[10px] text-on-surface-variant truncate mt-0.5">{item.name}</p>
                  </div>
                  <span className="text-[9px] text-on-surface-variant/40 uppercase font-mono tracking-widest bg-surface-container p-1 rounded">
                    {item.exchange}
                  </span>
                </button>
              ))}
            </div>
          ) : (
            <div className="px-4 py-3 text-xs text-on-surface-variant/60">
              No direct matches found. Press enter to add manually.
            </div>
          )}
        </div>
      )}
    </div>
  );
}
