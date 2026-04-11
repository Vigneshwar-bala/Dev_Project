export default function LogicSummary({ insights = [], whaleName = '', ticker = '', loading = false, fromCache = false }) {
  if (loading) {
    return (
      <div className="flex flex-col gap-3 animate-pulse">
        {[1, 2, 3].map(i => (
          <div key={i} className="flex gap-4 items-start">
            <span className="text-primary/30 font-mono text-sm">0{i}</span>
            <div className="flex-1 space-y-1.5">
              <div className="h-3 bg-surface-container-high rounded w-full" />
              <div className="h-3 bg-surface-container-high rounded w-4/5" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (!insights.length) {
    return (
      <div className="flex flex-col items-center justify-center h-full gap-3 text-center">
        <span className="material-symbols-outlined text-on-surface-variant/30 text-4xl">psychology</span>
        <p className="text-on-surface-variant/50 text-xs uppercase tracking-widest">
          Select a whale to activate Gemini analysis
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4 animate-slide-up">
      {/* Header */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-primary-fixed text-sm" style={{fontSize:'16px'}}>
            psychology
          </span>
          <span className="text-[11px] font-bold uppercase tracking-widest text-on-surface-variant">
            Gemini Logic
          </span>
          {whaleName && (
            <span className="text-[10px] bg-primary/10 text-primary px-2 py-0.5 rounded-full">
              {whaleName} · ${ticker}
            </span>
          )}
        </div>
        {fromCache && (
          <span className="text-[9px] text-on-surface-variant/40 flex items-center gap-1">
            <span className="material-symbols-outlined" style={{fontSize:'12px'}}>cached</span>
            Cached
          </span>
        )}
      </div>

      {/* Insights */}
      {insights.map((insight, i) => (
        <div key={i} className="flex gap-4 items-start group">
          <span className="text-primary-fixed/40 font-mono text-sm font-bold shrink-0">
            {String(i + 1).padStart(2, '0')}
          </span>
          <p className="text-sm text-on-surface-variant leading-relaxed group-hover:text-on-surface transition-colors">
            {insight}
          </p>
        </div>
      ))}
    </div>
  );
}
