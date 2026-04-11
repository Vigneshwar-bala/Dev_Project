import { NavLink } from 'react-router-dom';

const TICKERS = [
  '$BTC +2.4%', '$RELIANCE +1.8%', '$TSLA -1.2%', '$AAPL +0.8%', 'NIFTY50 HITS NEW ATH',
  'FED MEETING TOMORROW', '$HDFCBANK +0.5%', '$GOLD RALLIES ON WEAK DXY',
  '$NVDA +4.9%', '$TCS -0.3%', '$OXY BUFFETT ACCUMULATING', 'RBI KEEPS RATES UNCHANGED', 
  '$INFY +2.1%', 'WHALE MOVEMENT IN $ETH', '$AMZN -0.6%', 'BTC DOMINANCE 54%',
];

export default function Navbar() {
  return (
    <>
      {/* ── Top Navigation Bar ─────────────────────────── */}
      <header className="fixed top-0 w-full z-50 bg-slate-900/40 backdrop-blur-xl text-primary font-headline tracking-tight border-b border-outline-variant/15 shadow-[0_20px_40px_rgba(0,0,0,0.4)] flex justify-between items-center px-6 h-16">
        <div className="flex items-center gap-8">
          <span className="text-2xl font-light tracking-[0.2em] text-primary uppercase select-none">
            StockY
          </span>
          <nav className="hidden md:flex gap-6 items-center">
            <NavLink to="/" className={({ isActive }) => `text-xs uppercase tracking-widest cursor-pointer active:scale-95 transition-colors duration-300 ${isActive ? 'text-primary-fixed font-medium' : 'text-slate-400 hover:text-primary'}`}>Terminal</NavLink>
            <NavLink to="/markets" className={({ isActive }) => `text-xs uppercase tracking-widest cursor-pointer active:scale-95 transition-colors duration-300 ${isActive ? 'text-primary-fixed font-medium' : 'text-slate-400 hover:text-primary'}`}>Markets</NavLink>
            <NavLink to="/insights" className={({ isActive }) => `text-xs uppercase tracking-widest cursor-pointer active:scale-95 transition-colors duration-300 ${isActive ? 'text-primary-fixed font-medium' : 'text-slate-400 hover:text-primary'}`}>Insights</NavLink>
          </nav>
        </div>

        <div className="flex items-center gap-4">
          <div className="bg-surface-container-low px-4 py-1.5 rounded-full border border-outline-variant/10 flex items-center gap-2">
            <span className="material-symbols-outlined text-sm text-primary" style={{fontSize:'16px'}}>search</span>
            <input
              className="bg-transparent border-none outline-none focus:ring-0 text-xs w-40 text-on-surface-variant placeholder:text-on-surface-variant/50"
              placeholder="Search Markets..."
              type="text"
            />
          </div>
          <div className="flex gap-3">
            <span className="material-symbols-outlined cursor-pointer hover:text-primary-fixed transition-colors text-on-surface-variant" style={{fontSize:'20px'}}>notifications</span>
            <span className="material-symbols-outlined cursor-pointer hover:text-primary-fixed transition-colors text-on-surface-variant" style={{fontSize:'20px'}}>account_balance_wallet</span>
            <span className="material-symbols-outlined cursor-pointer hover:text-primary-fixed transition-colors text-on-surface-variant" style={{fontSize:'20px'}}>settings</span>
          </div>
          <div className="w-8 h-8 rounded-full bg-primary-fixed/20 border border-primary-fixed/30 flex items-center justify-center text-primary-fixed font-bold text-xs select-none">
            S
          </div>
        </div>
      </header>

      {/* ── News Ticker ────────────────────────────────── */}
      <div className="fixed top-16 w-full z-40 h-6 bg-surface-container-lowest overflow-hidden flex items-center border-b border-outline-variant/5">
        <div className="ticker-scroll flex whitespace-nowrap items-center gap-10 text-[10px] font-bold tracking-tighter text-on-surface-variant uppercase">
          {TICKERS.map((t, i) => (
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
