import { NavLink } from 'react-router-dom';

export default function Navbar({ isOpen, setOpen }) {
  return (
    <aside className={`fixed md:relative top-0 left-0 w-64 h-full bg-surface dark:bg-[#111316] border-r border-outline-variant dark:border-[#3a4a46] flex flex-col shrink-0 z-50 transition-all duration-300 ${isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}`}>
      {/* Logo/Brand Area */}
      <div className="h-16 flex items-center px-6 border-b border-outline-variant dark:border-[#3a4a46]">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-md bg-primary dark:bg-[#d7fff3] flex items-center justify-center text-on-primary dark:text-[#00382f] font-bold text-xs">
            S
          </div>
          <span className="text-sm font-bold text-on-surface dark:text-[#e2e2e6] tracking-tight">StockY App</span>
        </div>
      </div>

      {/* Navigation Links */}
      <div className="p-4 flex-1 flex flex-col gap-1 overflow-y-auto custom-scroll">
        <div className="text-[10px] font-bold uppercase tracking-wider text-on-surface-variant dark:text-[#b9cac4] mb-2 mt-2 px-3">
          Navigate
        </div>
        
        <NavLink to="/" className={({ isActive }) => `flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${isActive ? 'bg-primary dark:bg-[#26fedc]/10 text-on-primary dark:text-[#26fedc]' : 'text-on-surface dark:text-[#e2e2e6] hover:bg-surface-container-high dark:hover:bg-[#282a2d]'}`}>
          <span className="material-symbols-outlined" style={{fontSize: '18px'}}>dashboard</span>
          Terminal
        </NavLink>
        
        <NavLink to="/markets" className={({ isActive }) => `flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${isActive ? 'bg-primary dark:bg-[#26fedc]/10 text-on-primary dark:text-[#26fedc]' : 'text-on-surface dark:text-[#e2e2e6] hover:bg-surface-container-high dark:hover:bg-[#282a2d]'}`}>
          <span className="material-symbols-outlined" style={{fontSize: '18px'}}>monitoring</span>
          Markets
        </NavLink>
        
        <NavLink to="/ai" className={({ isActive }) => `flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${isActive ? 'bg-primary dark:bg-[#26fedc]/10 text-on-primary dark:text-[#26fedc]' : 'text-on-surface dark:text-[#e2e2e6] hover:bg-surface-container-high dark:hover:bg-[#282a2d]'}`}>
          <span className="material-symbols-outlined" style={{fontSize: '18px'}}>psychology</span>
          AI Config
        </NavLink>
        
        <NavLink to="/watchlist" className={({ isActive }) => `flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${isActive ? 'bg-primary dark:bg-[#26fedc]/10 text-on-primary dark:text-[#26fedc]' : 'text-on-surface dark:text-[#e2e2e6] hover:bg-surface-container-high dark:hover:bg-[#282a2d]'}`}>
          <span className="material-symbols-outlined" style={{fontSize: '18px'}}>list_alt</span>
          Watchlist
        </NavLink>
      </div>

      {/* Bottom links like the mockup */}
      <div className="p-4 border-t border-outline-variant dark:border-[#3a4a46] flex flex-col gap-1">
        <button className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-on-surface dark:text-[#e2e2e6] hover:bg-surface-container-high dark:hover:bg-[#282a2d] transition-colors">
          <span className="material-symbols-outlined" style={{fontSize: '18px'}}>help</span>
          Help Center
        </button>
      </div>
    </aside>
  );
}
