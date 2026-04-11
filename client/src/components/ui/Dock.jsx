import { NavLink } from 'react-router-dom';

const DOCK_ITEMS = [
  { icon: 'dashboard', to: '/', tooltip: 'Terminal' },
  { icon: 'query_stats', to: '/markets', tooltip: 'Markets' },
  { icon: 'bubble_chart', to: '/insights', tooltip: 'Insights' },
  { divider: true },
  { icon: 'psychology', to: '/ai', tooltip: 'AI Configuration (Soon)' },
  { icon: 'visibility', to: '/watchlist', tooltip: 'Watchlist (Soon)' },
];

export default function Dock() {
  return (
    <footer className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 flex flex-col items-center gap-3">
      {/* Dynamic Island Pill */}
      <div className="group relative">
        <div className="h-6 bg-surface-container-lowest border border-outline-variant/20 rounded-full flex items-center justify-center overflow-hidden transition-all duration-500 ease-[cubic-bezier(0.23,1,0.32,1)] backdrop-blur-3xl shadow-xl px-3 min-w-[24px] group-hover:min-w-[160px]">
          <div className="flex items-center gap-2 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <div className="w-2 h-2 rounded-full bg-primary-fixed animate-pulse" />
            <span className="text-[10px] font-bold tracking-[0.18em] text-primary-fixed uppercase">Core Stable</span>
          </div>
          <div className="absolute group-hover:opacity-0 w-1.5 h-1.5 rounded-full bg-primary/40 transition-opacity" />
        </div>
      </div>

      {/* Dock Bar */}
      <div className="bg-slate-900/60 backdrop-blur-2xl border border-outline-variant/15 p-2 rounded-full flex gap-1 shadow-2xl items-center">
        {DOCK_ITEMS.map((item, i) => {
          if (item.divider) return <div key={i} className="w-px h-5 bg-outline-variant/20 mx-1" />;
          return (
            <NavLink
              key={i}
              to={item.to}
              title={item.tooltip}
              className={({ isActive }) => `p-2.5 rounded-full transition-all hover:scale-110 active:scale-95 flex items-center justify-center ${
                isActive ? 'text-primary-fixed bg-primary-fixed/10' : 'text-slate-500 hover:text-primary'
              }`}
            >
              {({ isActive }) => (
                <span
                  className="material-symbols-outlined"
                  style={{
                    fontSize: '20px',
                    fontVariationSettings: isActive ? "'FILL' 1" : "'FILL' 0",
                  }}
                >
                  {item.icon}
                </span>
              )}
            </NavLink>
          );
        })}
      </div>
    </footer>
  );
}
