export default function WhaleCard({ whale, isActive, onClick }) {
  const isSecondary = whale.sentimentColor === 'secondary';

  return (
    <div
      onClick={() => onClick(whale)}
      className={`glass-panel p-4 rounded-3xl transition-all group cursor-pointer animate-fade-in
        ${isActive
          ? 'border border-primary-fixed/40 bg-surface-container-high glow-primary shadow-lg'
          : `hover:bg-surface-container-high ${whale.borderAccent ? 'border-l-2 border-secondary/40' : ''}`
        }`}
    >
      {/* Header */}
      <div className="flex items-center gap-3 mb-4">
        <div className="relative">
          <img
            src={whale.avatar}
            alt={whale.name}
            className="w-10 h-10 rounded-2xl grayscale group-hover:grayscale-0 transition-all object-cover"
            onError={(e) => {
              e.target.style.display = 'none';
              e.target.nextSibling.style.display = 'flex';
            }}
          />
          <div
            className="w-10 h-10 rounded-2xl bg-primary-fixed/10 items-center justify-center text-primary-fixed font-bold text-sm hidden"
          >
            {whale.name[0]}
          </div>
          {isActive && (
            <span className="absolute -top-1 -right-1 w-3 h-3 bg-primary-fixed rounded-full border-2 border-background animate-pulse" />
          )}
        </div>
        <div>
          <p className="text-sm font-bold text-on-surface">{whale.name}</p>
          <p className="text-[10px] text-on-surface-variant uppercase tracking-wider">{whale.firm}</p>
        </div>
      </div>

      {/* Trade Info */}
      <div className="flex justify-between items-end">
        <div>
          <p className="text-[10px] text-on-surface-variant mb-1">{whale.tradeLabel}</p>
          <p className={`text-xs font-headline font-bold ${isSecondary ? 'text-secondary' : 'text-primary'}`}>
            {whale.trade}
          </p>
        </div>
        <div className="text-right">
          <p className="text-[10px] text-on-surface-variant mb-1">Sentiment</p>
          <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium
            ${isSecondary
              ? 'bg-secondary/10 text-secondary'
              : 'bg-primary/10 text-primary'}`}>
            {whale.sentiment}
          </span>
        </div>
      </div>

      {/* Active indicator */}
      {isActive && (
        <div className="mt-3 pt-3 border-t border-outline-variant/20 flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-primary-fixed animate-pulse" />
          <span className="text-[9px] text-primary-fixed uppercase tracking-widest font-bold">Analyzing...</span>
        </div>
      )}
    </div>
  );
}
