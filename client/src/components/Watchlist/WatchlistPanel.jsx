import TickerItem from './TickerItem';
import AddTickerBar from './AddTickerBar';
import { useWatchlist } from '../../hooks/useWatchlist';

export default function WatchlistPanel() {
  const { watchlist, loading, adding, addTicker, removeTicker } = useWatchlist();

  const totalPositive = watchlist.filter(i => parseFloat(i.changePercent) >= 0).length;
  const totalNegative = watchlist.length - totalPositive;

  return (
    <aside className="w-full h-full glass-panel rounded-3xl flex flex-col overflow-hidden pb-1">
      {/* Header */}
      <div className="p-5 border-b border-outline-variant/10 dark:border-[#3a4a46]/50 shrink-0">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-xs font-bold tracking-widest uppercase text-on-surface dark:text-[#e2e2e6]">
              Global Watchlist
            </h2>
            <p className="text-[9px] text-on-surface-variant mt-0.5">
              <span className="text-primary">{totalPositive}↑</span>
              {' · '}
              <span className="text-error">{totalNegative}↓</span>
              {' · '}
              {watchlist.length} tracked
            </p>
          </div>
          <span className="material-symbols-outlined text-on-surface-variant text-sm cursor-pointer hover:text-primary-fixed transition-colors" style={{ fontSize: '18px' }}>
            add_circle
          </span>
        </div>
        <AddTickerBar onAdd={addTicker} adding={adding} />
      </div>

      {/* Ticker List */}
      <div className="flex-1 overflow-y-auto no-scrollbar p-2">
        {loading ? (
          // Skeleton loader
          <div className="space-y-1 p-2 animate-pulse">
            {[1, 2, 3, 4, 5].map(i => (
              <div key={i} className="flex items-center gap-3 p-3">
                <div className="w-10 h-10 rounded-xl bg-surface-container-high dark:bg-[#333538]" />
                <div className="flex-1 space-y-1.5">
                  <div className="h-2.5 bg-surface-container-high dark:bg-[#333538] rounded w-24" />
                  <div className="h-2 bg-surface-container-high dark:bg-[#333538] rounded w-16" />
                </div>
                <div className="space-y-1.5 text-right">
                  <div className="h-2.5 bg-surface-container-high dark:bg-[#333538] rounded w-14 ml-auto" />
                  <div className="h-2 bg-surface-container-high dark:bg-[#333538] rounded w-10 ml-auto" />
                </div>
              </div>
            ))}
          </div>
        ) : watchlist.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full gap-3 opacity-50">
            <span className="material-symbols-outlined text-3xl">playlist_add</span>
            <p className="text-xs text-on-surface-variant text-center">Add tickers to start tracking</p>
          </div>
        ) : (
          <div className="space-y-0.5">
            {watchlist.map((item) => (
              <TickerItem key={item.ticker} item={item} onRemove={removeTicker} />
            ))}
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="p-3 border-t border-outline-variant/10 dark:border-[#3a4a46]/50 shrink-0">
        <p className="text-[9px] text-on-surface-variant/30 text-center uppercase tracking-widest">
          Synced with MongoDB Atlas
        </p>
      </div>
    </aside>
  );
}
