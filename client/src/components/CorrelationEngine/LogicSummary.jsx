import { LineChart, Line, ResponsiveContainer, YAxis } from 'recharts';

const SECTION_META = [
  {
    key: 'stockBought',
    icon: 'trending_up',
    label: 'Stock Bought',
    color: 'text-emerald-400',
    borderColor: 'border-emerald-500/30',
    bgColor: 'bg-emerald-500/5',
  },
  {
    key: 'whyBought',
    icon: 'psychology_alt',
    label: 'Why Bought',
    color: 'text-sky-400',
    borderColor: 'border-sky-500/30',
    bgColor: 'bg-sky-500/5',
  },
  {
    key: 'profitMade',
    icon: 'attach_money',
    label: 'Profit / Return',
    color: 'text-amber-400',
    borderColor: 'border-amber-500/30',
    bgColor: 'bg-amber-500/5',
  },
];

export default function LogicSummary({
  stockBought = '',
  whyBought = '',
  profitMade = '',
  profitGraph = [],
  whaleName = '',
  ticker = '',
  loading = false,
  fromCache = false,
  isFallback = false,
}) {
  // ── Loading skeleton ───────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="flex flex-col gap-3 animate-pulse">
        {SECTION_META.map((s) => (
          <div key={s.key} className="flex gap-3 items-start">
            <div className="w-6 h-6 rounded-full bg-surface-container-high dark:bg-[#333538] shrink-0 mt-0.5" />
            <div className="flex-1 space-y-1.5">
              <div className="h-2.5 bg-surface-container-high dark:bg-[#333538] rounded w-1/4" />
              <div className="h-3 bg-surface-container-high dark:bg-[#333538] rounded w-full" />
              <div className="h-3 bg-surface-container-high dark:bg-[#333538] rounded w-3/4" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  // ── Empty state ────────────────────────────────────────────────────────────
  if (!stockBought && !whyBought && !profitMade) {
    return (
      <div className="flex flex-col items-center justify-center h-full gap-3 text-center">
        <span className="material-symbols-outlined text-on-surface-variant/30 dark:text-[#b9cac4]/30 text-4xl">psychology</span>
        <p className="text-on-surface-variant/50 dark:text-[#b9cac4]/50 text-xs uppercase tracking-widest">
          Select a whale to activate analysis
        </p>
      </div>
    );
  }

  const data = { stockBought, whyBought, profitMade };
  const chartData = profitGraph.map((val, i) => ({ month: `M${i+1}`, value: val }));

  return (
    <div className="space-y-1 animate-slide-up">
      {/* ── Header ─────────────────────────────────────────────────────────── */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span
            className="material-symbols-outlined text-primary-fixed dark:text-[#00dfc1]"
            style={{ fontSize: '16px' }}
          >
            psychology
          </span>
          <span className="text-[11px] font-bold uppercase tracking-widest text-on-surface-variant dark:text-[#b9cac4]">
            Whale Intelligence
          </span>
          {whaleName && (
            <span className="text-[10px] bg-primary/10 dark:bg-[#26fedc]/10 text-primary dark:text-[#26fedc] px-2 py-0.5 rounded-full font-medium">
              {whaleName} · ${ticker}
            </span>
          )}
        </div>
        <div className="flex items-center gap-1.5">
          {isFallback && (
            <span className="text-[9px] text-amber-400/70 flex items-center gap-0.5">
              <span className="material-symbols-outlined" style={{ fontSize: '11px' }}>warning</span>
              API limit
            </span>
          )}
          {fromCache && (
            <span className="text-[9px] text-on-surface-variant/40 dark:text-[#b9cac4]/40 flex items-center gap-1">
              <span className="material-symbols-outlined" style={{ fontSize: '12px' }}>cached</span>
              Cached
            </span>
          )}
        </div>
      </div>

      {/* ── 3 Factual Insight Cards ─────────────────────────────────────────── */}
      <div className="flex flex-col gap-2.5">
        {SECTION_META.map((section) => (
          <div
            key={section.key}
            className={`rounded-2xl border px-4 py-3 ${section.borderColor} ${section.bgColor} transition-all group hover:scale-[1.01]`}
          >
            {/* Label row */}
            <div className="flex items-center gap-1.5 mb-1.5">
              <span
                className={`material-symbols-outlined ${section.color}`}
                style={{ fontSize: '14px' }}
              >
                {section.icon}
              </span>
              <span className={`text-[10px] font-bold uppercase tracking-widest ${section.color}`}>
                {section.label}
              </span>
            </div>
            {/* Content */}
            <p className="text-[12.5px] text-on-surface-variant dark:text-[#b9cac4] leading-relaxed group-hover:text-on-surface dark:group-hover:text-[#e2e2e6] transition-colors">
              {data[section.key]}
            </p>
            {section.key === 'profitMade' && profitGraph.length > 0 && (
              <div className="w-full mt-2" style={{ height: '64px', minWidth: '0' }}>
                <ResponsiveContainer width="99%" height="100%">
                  <LineChart data={chartData}>
                    <YAxis domain={['auto', 'auto']} hide />
                    <Line type="monotone" dataKey="value" stroke="#fbbf24" strokeWidth={2} dot={{ r: 2, fill: '#fbbf24' }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
