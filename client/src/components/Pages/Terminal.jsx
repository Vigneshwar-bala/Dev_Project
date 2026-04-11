import React from 'react';
import WhalePanel from '../WhaleTracker/WhalePanel';
import EnginePanel from '../CorrelationEngine/EnginePanel';
import WatchlistPanel from '../Watchlist/WatchlistPanel';

export default function Terminal({ activeWhale, setActiveWhale }) {
  return (
    <>
      <WhalePanel activeWhale={activeWhale} onSelectWhale={setActiveWhale} />
      <div className="flex-1 min-h-0 flex flex-col">
        <EnginePanel activeWhale={activeWhale} />
      </div>
      <WatchlistPanel />
    </>
  );
}
