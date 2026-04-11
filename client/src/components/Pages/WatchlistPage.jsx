import React from 'react';
import WatchlistPanel from '../Watchlist/WatchlistPanel';

export default function WatchlistPage() {
  return (
    <div className="flex-1 flex gap-4 min-h-0">
      <div className="flex-1 glass-panel rounded-3xl flex items-center justify-center">
         <div className="text-center animate-fade-in">
          <span className="material-symbols-outlined text-6xl text-primary mb-4 animate-[bounce_2s_infinite]">
            visibility
          </span>
          <h1 className="text-3xl font-headline font-light tracking-widest text-primary-fixed uppercase mb-2">
            Watchlist Hub
          </h1>
          <p className="text-on-surface-variant text-xs tracking-[0.1em] uppercase">
             Advanced charting view
          </p>
        </div>
      </div>
      <WatchlistPanel />
    </div>
  );
}
