import React, { useState } from 'react';
import AddTickerBar from '../Watchlist/AddTickerBar'; // For the generic search bar

const INDICES = [
  { name: 'NIFTY 50', val: '24,050.60', change: '+275.50', pos: true },
  { name: 'SENSEX', val: '77,550.25', change: '+918.60', pos: true },
  { name: 'Nifty Bank', val: '55,912.75', change: '+1,091.05', pos: true },
  { name: 'Nifty IT', val: '31,030.60', change: '-605.60', pos: false },
];

const STOCKS = [
  { symbol: 'BSE:RELIANCE', name: 'Reliance Industries Ltd', price: '₹2,985.40', change: '+1.50%', pos: true, icon: 'RIL' },
  { symbol: 'NSE:M&M', name: 'Mahindra And Mahindra Ltd', price: '₹3,266.00', change: '+3.13%', pos: true, icon: 'M&M' },
  { symbol: 'NSE:SBIN', name: 'State Bank of India', price: '₹1,066.00', change: '+2.41%', pos: true, icon: 'SBI' },
  { symbol: 'NSE:TCS', name: 'Tata Consultancy Services', price: '₹3,890.15', change: '-0.30%', pos: false, icon: 'TCS' },
  { symbol: 'NASDAQ:NVDA', name: 'Nvidia Corp.', price: '$188.63', change: '+2.57%', pos: true, icon: 'NVD' },
  { symbol: 'NASDAQ:AAPL', name: 'Apple Inc.', price: '$173.50', change: '+0.42%', pos: true, icon: 'AAPL' },
];

export default function WatchlistPage() {
  const [selectedSymbol, setSelectedSymbol] = useState('BSE:RELIANCE');

  return (
    <div className="flex-1 flex flex-col min-h-0 gap-4 overflow-y-auto no-scrollbar">
      
      {/* ── Top Navigation & Indices Row ───────────────────────────────── */}
      <div className="flex items-center gap-4 shrink-0 px-1 pt-1 overflow-x-auto no-scrollbar">
        <div className="flex items-center gap-4 text-[10px] uppercase tracking-widest font-bold text-on-surface-variant shrink-0">
          <span className="flex items-center gap-1"><span className="material-symbols-outlined text-[14px]">compare_arrows</span> Compare Markets</span>
          <span className="cursor-pointer hover:text-primary transition-colors">US</span>
          <span className="cursor-pointer hover:text-primary transition-colors">Europe</span>
          <span className="text-primary-fixed border-b border-primary-fixed pb-1 cursor-pointer">India</span>
          <span className="cursor-pointer hover:text-primary transition-colors">Crypto</span>
        </div>
        
        <div className="w-px h-6 bg-outline-variant/20 shrink-0 mx-2" />

        <div className="flex gap-3 shrink-0 uppercase tracking-widest">
          {INDICES.map((idx, i) => (
            <div key={i} className="glass-panel border-outline-variant/10 px-3 py-1.5 rounded-xl flex items-center gap-3">
              <span className={`material-symbols-outlined text-[14px] ${idx.pos ? 'text-primary' : 'text-error'}`}>
                {idx.pos ? 'arrow_upward' : 'arrow_downward'}
              </span>
              <div>
                <p className="text-[9px] font-bold text-on-surface">{idx.name}</p>
                <div className="flex gap-2 items-center">
                  <span className="text-[10px] text-on-surface-variant font-mono">{idx.val}</span>
                  <span className={`text-[9px] font-bold ${idx.pos ? 'text-primary' : 'text-error'}`}>{idx.change}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Search Bar Section ─────────────────────────────────────────── */}
      <div className="flex justify-center shrink-0 mt-2">
        <div className="w-full max-w-2xl relative">
          {/* We reuse the AddTickerBar logic, but we map its onAdd to set the selected chart */}
          <AddTickerBar 
            adding={false} 
            onAdd={(item) => {
               // When they search and add, display it on the massive chart graph
               // item.exchange logic: If they search Indian stock via Yahoo, it might be NSE/BSE. 
               // TradingView prefix format is EXCHANGE:TICKER. Usually Yahoo gives "TCS.NS". 
               // We format it explicitly for the chart.
               const isIndian = item.ticker.endsWith('.NS') || item.ticker.endsWith('.BO');
               const formattedSymbol = isIndian 
                 ? item.ticker.endsWith('.NS') ? `NSE:${item.ticker.replace('.NS', '')}` : `BSE:${item.ticker.replace('.BO', '')}` 
                 : `NASDAQ:${item.ticker}`;
                 
               setSelectedSymbol(formattedSymbol);
               return true; // trick AddTickerBar to reset
            }} 
          />
        </div>
      </div>

      {/* ── Main Layout (2 Columns) ────────────────────────────────────── */}
      <div className="flex-1 flex flex-col lg:flex-row gap-6 min-h-0 mt-2">
        
        {/* Left Column: Interests List */}
        <div className="lg:w-1/3 flex flex-col gap-4 overflow-y-auto no-scrollbar shrink-0">
          <div className="glass-panel rounded-3xl p-5 border border-outline-variant/10">
            <h2 className="text-xs font-bold tracking-widest text-on-surface uppercase mb-4 flex items-center gap-2">
              You may be interested in
              <span className="material-symbols-outlined text-[14px] text-on-surface-variant">info</span>
            </h2>
            
            <div className="flex flex-col gap-1">
              {STOCKS.map((stock) => (
                <div 
                  key={stock.symbol} 
                  onClick={() => setSelectedSymbol(stock.symbol)}
                  className={`flex items-center justify-between p-3 rounded-2xl cursor-pointer hover:bg-surface-container-highest transition-colors border border-transparent ${selectedSymbol === stock.symbol ? 'bg-surface-container-high border-primary-fixed/30' : ''}`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-surface-container-low border border-outline-variant/10 flex items-center justify-center text-[8px] font-bold text-primary tracking-widest uppercase">
                      {stock.icon}
                    </div>
                    <div>
                      <p className="text-[11px] font-bold text-on-surface line-clamp-1">{stock.name}</p>
                      <p className="text-[9px] text-on-surface-variant font-mono uppercase bg-surface-container w-fit px-1 rounded mt-0.5">{stock.symbol.split(':')[1]}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <p className="text-[11px] font-headline text-on-surface">{stock.price}</p>
                      <p className={`text-[10px] font-bold flex items-center justify-end gap-0.5 ${stock.pos ? 'text-primary' : 'text-error'}`}>
                        {stock.pos ? '↑' : '↓'} {stock.change}
                      </p>
                    </div>
                    <span className="material-symbols-outlined text-on-surface-variant/50 hover:text-primary transition-colors" style={{fontSize: '18px'}}>add_circle</span>
                  </div>
                </div>
              ))}
            </div>
            
          </div>
        </div>

        {/* Right Column: Interactive Graph & Trends */}
        <div className="flex-1 flex flex-col gap-4 min-h-0">
          {/* Live Chart iframe */}
          <div className="flex-1 glass-panel rounded-3xl overflow-hidden border border-outline-variant/10 min-h-[400px]">
            <iframe
              src={`https://s.tradingview.com/widgetembed/?frameElementId=tradingview_1&symbol=${selectedSymbol}&interval=D&hidesidetoolbar=1&symboledit=1&saveimage=0&toolbarbg=1a2022&studies=%5B%5D&theme=dark&style=1&timezone=Asia%2FKolkata&studies_overrides=%7B%7D&overrides=%7B%7D&enabled_features=%5B%5D&disabled_features=%5B%5D&locale=en&utm_source=localhost&utm_medium=widget&utm_campaign=chart`}
              className="w-full h-full border-none"
              title="TradingView Real-time Chart"
            />
          </div>
          
          {/* Small Widgets Row */}
          <div className="flex gap-4 shrink-0">
             <div className="flex-1 glass-panel rounded-3xl p-5 border border-outline-variant/10">
                <h3 className="text-xs font-bold tracking-widest uppercase text-on-surface mb-3">Market Trends</h3>
                <div className="flex flex-wrap gap-2">
                  <span className="text-[9px] uppercase tracking-widest px-3 py-1.5 rounded-full bg-surface-container border border-outline-variant/10 text-on-surface-variant flex items-center gap-1 hover:text-primary cursor-pointer"><span className="material-symbols-outlined text-[12px]">show_chart</span> Indexes</span>
                  <span className="text-[9px] uppercase tracking-widest px-3 py-1.5 rounded-full bg-surface-container border border-outline-variant/10 text-on-surface-variant flex items-center gap-1 hover:text-primary cursor-pointer"><span className="material-symbols-outlined text-[12px]">leaderboard</span> Most Active</span>
                  <span className="text-[9px] uppercase tracking-widest px-3 py-1.5 rounded-full bg-surface-container border border-outline-variant/10 text-primary flex items-center gap-1 hover:bg-primary/10 cursor-pointer"><span className="material-symbols-outlined text-[12px]">trending_up</span> Gainers</span>
                  <span className="text-[9px] uppercase tracking-widest px-3 py-1.5 rounded-full bg-surface-container border border-outline-variant/10 text-error flex items-center gap-1 hover:bg-error/10 cursor-pointer"><span className="material-symbols-outlined text-[12px]">trending_down</span> Losers</span>
                </div>
             </div>
          </div>

        </div>

      </div>
    </div>
  );
}
