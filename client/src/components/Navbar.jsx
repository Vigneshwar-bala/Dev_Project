import { useState, useRef, useEffect } from 'react';
import { NavLink } from 'react-router-dom';

const TICKERS = [
  'GLOBAL MARKETS REACH RECORD HIGHS',
  'TECH STOCKS SURGE THIS WEEK',
  'FED SIGNALS POSSIBLE RATE CUTS',
  'INFLATION DATA BEATS EXPECTATIONS',
  'GOLD RALLIES ON WEAK DOLLAR',
  'NIFTY50 HITS NEW TIME HIGHS',
  'BITCOIN EXPLODES PAST NEW RESISTANCE',
  'OIL PRICES TUMBLE AMID CONCERNS',
  'RBI KEEPS LENDING RATES UNCHANGED',
  'WHALE MOVEMENT DETECTED IN ETHEREUM',
  'INVESTORS FLOCK TO SAFE ASSETS',
  'RETAIL SALES SHOW UNEXPECTED GROWTH',
  'EUROPEAN MARKETS CLOSE IN GREEN',
  'TECH GIANTS REPORT RECORD PROFITS'
];

export default function Navbar() {
  const [activeDropdown, setActiveDropdown] = useState(null); // 'notif', 'wallet', 'settings', 'profile'
  const navRef = useRef(null);

  const userStr = localStorage.getItem('stocky_user');
  const user = userStr ? JSON.parse(userStr) : {};
  const userInitial = user.name ? user.name.charAt(0).toUpperCase() : 'U';

  // Close dropdown if clicking outside
  useEffect(() => {
    function handleClickOutside(e) {
      if (navRef.current && !navRef.current.contains(e.target)) {
        setActiveDropdown(null);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const toggle = (menu) => {
    setActiveDropdown((prev) => (prev === menu ? null : menu));
  };

  return (
    <>
      <header 
        ref={navRef}
        className="fixed top-0 w-full z-50 bg-slate-900/40 backdrop-blur-xl text-primary font-headline tracking-tight border-b border-outline-variant/15 shadow-[0_20px_40px_rgba(0,0,0,0.4)] flex justify-between items-center px-6 h-16"
      >
        <div className="flex items-center gap-8">
          <span className="text-2xl font-light tracking-[0.2em] text-primary uppercase select-none">
            StockY
          </span>
          <nav className="hidden md:flex gap-6 items-center">
            <NavLink to="/" className={({ isActive }) => `text-xs uppercase tracking-widest cursor-pointer active:scale-95 transition-colors duration-300 ${isActive ? 'text-primary-fixed font-medium' : 'text-slate-400 hover:text-primary'}`}>Terminal</NavLink>
            <NavLink to="/markets" className={({ isActive }) => `text-xs uppercase tracking-widest cursor-pointer active:scale-95 transition-colors duration-300 ${isActive ? 'text-primary-fixed font-medium' : 'text-slate-400 hover:text-primary'}`}>Markets</NavLink>
            <NavLink to="/ai" className={({ isActive }) => `text-xs uppercase tracking-widest cursor-pointer active:scale-95 transition-colors duration-300 ${isActive ? 'text-primary-fixed font-medium' : 'text-slate-400 hover:text-primary'}`}>AI Config</NavLink>
          </nav>
        </div>

        <div className="flex items-center gap-4 relative">
          <div className="bg-surface-container-low px-4 py-1.5 rounded-full border border-outline-variant/10 flex items-center gap-2">
            <span className="material-symbols-outlined text-sm text-primary" style={{fontSize:'16px'}}>search</span>
            <input
              className="bg-transparent border-none outline-none focus:ring-0 text-xs w-40 text-on-surface-variant placeholder:text-on-surface-variant/50"
              placeholder="Search Markets..."
              type="text"
            />
          </div>
          
          <div className="flex gap-3 relative">

            <span 
              onClick={() => toggle('notif')}
              className={`material-symbols-outlined cursor-pointer transition-colors ${activeDropdown === 'notif' ? 'text-primary-fixed' : 'text-on-surface-variant hover:text-primary-fixed'}`} 
              style={{fontSize:'20px', fontVariationSettings: activeDropdown === 'notif' ? "'FILL' 1" : "'FILL' 0"}}
            >
              notifications
            </span>
            <span 
              onClick={() => toggle('wallet')}
              className={`material-symbols-outlined cursor-pointer transition-colors ${activeDropdown === 'wallet' ? 'text-primary-fixed' : 'text-on-surface-variant hover:text-primary-fixed'}`} 
              style={{fontSize:'20px', fontVariationSettings: activeDropdown === 'wallet' ? "'FILL' 1" : "'FILL' 0"}}
            >
              account_balance_wallet
            </span>
            <span 
              onClick={() => toggle('settings')}
              className={`material-symbols-outlined cursor-pointer transition-colors ${activeDropdown === 'settings' ? 'text-primary-fixed' : 'text-on-surface-variant hover:text-primary-fixed'}`} 
              style={{fontSize:'20px', fontVariationSettings: activeDropdown === 'settings' ? "'FILL' 1" : "'FILL' 0"}}
            >
              settings
            </span>

            {/* Dropdowns */}
            {activeDropdown === 'notif' && (
              <div className="absolute top-8 right-16 w-64 glass-panel rounded-2xl shadow-xl border border-outline-variant/20 p-4 animate-fade-in origin-top-right">
                <h3 className="text-xs font-bold text-on-surface uppercase tracking-widest mb-3">Alerts</h3>
                <div className="space-y-3">
                   <div className="flex gap-2">
                     <span className="material-symbols-outlined text-error text-sm mt-0.5" style={{fontVariationSettings:"'FILL' 1"}}>trending_down</span>
                     <div>
                       <p className="text-[11px] text-on-surface font-medium">BTC drops below <br/>$68k support</p>
                       <p className="text-[9px] text-on-surface-variant mt-0.5">2m ago</p>
                     </div>
                   </div>
                   <div className="flex gap-2">
                     <span className="material-symbols-outlined text-primary-fixed text-sm mt-0.5" style={{fontVariationSettings:"'FILL' 1"}}>psychology</span>
                     <div>
                       <p className="text-[11px] text-on-surface font-medium">Gemini correlation <br/>signal detected: NVDA</p>
                       <p className="text-[9px] text-on-surface-variant mt-0.5">14m ago</p>
                     </div>
                   </div>
                </div>
              </div>
            )}

            {activeDropdown === 'wallet' && (
              <div className="absolute top-8 right-8 w-60 glass-panel rounded-2xl shadow-xl border border-outline-variant/20 p-4 animate-fade-in origin-top-right">
                <h3 className="text-xs font-bold text-on-surface uppercase tracking-widest mb-3">Linked Accounts</h3>
                <div className="mb-4">
                  <p className="text-[10px] text-on-surface-variant uppercase tracking-wider mb-1">Total Balance</p>
                  <p className="text-2xl font-headline font-light text-primary-fixed">$142,504.00</p>
                </div>
                <div className="space-y-2 border-t border-outline-variant/20 pt-3">
                   <div className="flex justify-between items-center bg-surface-container-low p-2 rounded-lg">
                      <span className="text-[11px] font-medium text-on-surface">Binance</span>
                      <span className="text-[11px] font-mono text-primary">$42,100</span>
                   </div>
                   <div className="flex justify-between items-center bg-surface-container-low p-2 rounded-lg">
                      <span className="text-[11px] font-medium text-on-surface">Interactive Brokers</span>
                      <span className="text-[11px] font-mono text-primary">$100,404</span>
                   </div>
                </div>
              </div>
            )}

            {activeDropdown === 'settings' && (
              <div className="absolute top-8 right-0 w-56 glass-panel rounded-2xl shadow-xl border border-outline-variant/20 p-4 animate-fade-in origin-top-right flex flex-col gap-3">
                <h3 className="text-xs font-bold text-on-surface uppercase tracking-widest mb-1">Preferences</h3>
                <div className="flex justify-between items-center">
                  <span className="text-[11px] text-on-surface-variant">Dark Mode</span>
                  <div className="w-8 h-4 bg-primary-fixed rounded-full relative cursor-pointer">
                    <div className="absolute right-0.5 top-0.5 w-3 h-3 bg-slate-900 rounded-full" />
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-[11px] text-on-surface-variant">Live Alpha Vantage</span>
                  <div className="w-8 h-4 bg-primary-fixed rounded-full relative cursor-pointer">
                    <div className="absolute right-0.5 top-0.5 w-3 h-3 bg-slate-900 rounded-full" />
                  </div>
                </div>
                <div className="border-t border-outline-variant/10 pt-2 mt-1">
                  <NavLink to="/ai" onClick={() => setActiveDropdown(null)} className="flex items-center gap-2 text-[11px] text-primary hover:text-primary-fixed transition-colors">
                    <span className="material-symbols-outlined text-sm">psychology</span>
                    Configure AI Engine
                  </NavLink>
                </div>
              </div>
            )}

            {activeDropdown === 'profile' && (
              <div className="absolute top-12 right-0 w-64 glass-panel rounded-2xl shadow-xl border border-outline-variant/20 p-4 animate-fade-in origin-top-right flex flex-col gap-3 z-50">
                <div className="flex flex-col items-center mb-2 border-b border-outline-variant/10 pb-4">
                  <div className="w-14 h-14 rounded-full bg-primary-fixed/20 border border-primary-fixed/30 flex items-center justify-center text-primary-fixed font-bold text-2xl select-none mb-3 shadow-[0_0_15px_rgba(38,254,220,0.2)]">
                    {userInitial}
                  </div>
                  <h3 className="text-sm font-bold text-on-surface tracking-wide">{user.name || 'Terminal User'}</h3>
                  <p className="text-[10px] text-on-surface-variant font-mono mt-1">{user.email || 'user@stocky.ai'}</p>
                </div>
                <button 
                  onClick={() => {
                    localStorage.removeItem('stocky_token');
                    localStorage.removeItem('stocky_user');
                    window.location.reload();
                  }} 
                  className="flex items-center justify-center gap-2 text-xs font-semibold text-error hover:text-red-400 hover:bg-error/10 transition-colors w-full text-center p-2.5 rounded-lg border border-error/10"
                >
                  <span className="material-symbols-outlined text-[16px]">logout</span>
                  Disconnect Session
                </button>
              </div>
            )}
          </div>

          <div 
            onClick={() => toggle('profile')}
            className="w-10 h-10 rounded-full bg-primary-fixed/10 border border-primary-fixed/30 flex items-center justify-center text-primary-fixed font-bold text-sm select-none cursor-pointer hover:bg-primary-fixed/20 transition-colors relative"
          >
            {userInitial}
            <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-[#26fedc] rounded-full border-2 border-surface-container-lowest" />
          </div>
        </div>
      </header>

      {/* ── News Ticker ────────────────────────────────── */}
      <div className="fixed top-16 w-full z-40 h-6 bg-surface-container-lowest overflow-hidden flex items-center border-b border-outline-variant/5 pointer-events-none">
        <div className="animate-ticker w-max flex whitespace-nowrap items-center gap-10 text-[10px] font-bold tracking-tighter text-on-surface-variant uppercase pl-10">
          {[...TICKERS, ...TICKERS].map((t, i) => (
            <span key={i} className="flex items-center gap-2">
              <span className="w-1 h-1 rounded-full bg-primary-fixed/40 inline-block" />
              {t}
            </span>
          ))}
        </div>
      </div>
    </>
  );
}
