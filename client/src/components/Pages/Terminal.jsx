import React, { useState, useEffect } from 'react';
import WhalePanel from '../WhaleTracker/WhalePanel';
import EnginePanel from '../CorrelationEngine/EnginePanel';
import WatchlistPanel from '../Watchlist/WatchlistPanel';

export default function Terminal() {
  const [activeWhale, setActiveWhale] = useState(null);
  const [layoutView, setLayoutView] = useState(() => localStorage.getItem('stocky_layout') || 'grid');

  useEffect(() => {
    localStorage.setItem('stocky_layout', layoutView);
  }, [layoutView]);

  return (
    <div className="flex flex-col w-full h-full gap-4">
      {/* Header controls for Terminal customization */}
      <div className="flex justify-between items-center mb-2 px-2">
        <h1 className="text-xl font-bold tracking-tight text-on-surface dark:text-[#e2e2e6]">Terminal</h1>
        <div className="flex gap-2 bg-surface dark:bg-[#1e2023] border border-outline-variant dark:border-[#3a4a46] rounded-lg p-1">
          <button 
             onClick={() => setLayoutView('grid')}
             className={`px-3 py-1 rounded-md text-xs font-semibold tracking-wide uppercase transition ${layoutView === 'grid' ? 'bg-primary dark:bg-[#26fedc] text-on-primary dark:text-[#0c0e11] shadow shadow-primary/20 dark:shadow-none' : 'text-on-surface dark:text-[#e2e2e6] hover:bg-surface-container dark:hover:bg-[#282a2d]'}`}
          >
             Grid
          </button>
          <button 
             onClick={() => setLayoutView('stack')}
             className={`px-3 py-1 rounded-md text-xs font-semibold tracking-wide uppercase transition ${layoutView === 'stack' ? 'bg-primary dark:bg-[#26fedc] text-on-primary dark:text-[#0c0e11] shadow shadow-primary/20 dark:shadow-none' : 'text-on-surface dark:text-[#e2e2e6] hover:bg-surface-container dark:hover:bg-[#282a2d]'}`}
          >
             Stack
          </button>
        </div>
      </div>

      {/* Main Responsive Container */}
      <div className={`flex-1 md:flex-row flex flex-col gap-6 overflow-y-auto md:overflow-hidden pb-8 md:pb-0 min-h-0 ${layoutView === 'grid' ? 'md:grid md:grid-cols-12 md:h-full' : 'md:h-full'}`}>
        
        {/* Left Column - Whale Panel */}
        <div className={`${layoutView === 'grid' ? 'md:col-span-3 lg:col-span-3' : 'md:w-[260px] lg:w-[320px]'} shrink-0 mb-6 md:mb-0 h-full flex flex-col min-h-0`}>
          <WhalePanel activeWhale={activeWhale} onSelectWhale={setActiveWhale} />
        </div>
        
        {/* Center/Engine Panel */}
        <div className={`${layoutView === 'grid' ? 'md:col-span-6 lg:col-span-6' : 'flex-1'} min-w-0 flex flex-col mb-6 md:mb-0 gap-6 h-full min-h-0`}>
          <EnginePanel activeWhale={activeWhale} />
        </div>

        {/* Right Watchlist Panel */}
        <div className={`${layoutView === 'grid' ? 'md:col-span-3 lg:col-span-3' : 'md:w-[260px] lg:w-[300px]'} shrink-0 h-full flex flex-col min-h-0`}>
          <WatchlistPanel />
        </div>
      </div>
    </div>
  );
}
