export default function TickerItem({ item, onRemove }) {
  const isPositive = parseFloat(item.changePercent) >= 0;
  const changeColor = isPositive ? 'text-primary' : 'text-error';
  const sign = isPositive ? '+' : '';

  const bgColor = item.assetType === 'Crypto'
    ? 'bg-primary/10 text-primary'
    : item.sentimentColor === 'secondary'
    ? 'bg-secondary/10 text-secondary'
    : 'bg-surface-container-high text-primary';

  return (
    <div className="flex items-center justify-between p-3 rounded-2xl hover:bg-surface-container-low cursor-pointer transition-all group animate-fade-in">
      <div className="flex items-center gap-3">
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-[10px] ${bgColor}`}>
          {item.ticker.length > 4 ? item.ticker.slice(0, 4) : item.ticker}
        </div>
        <div>
          <p className="text-xs font-bold text-on-surface leading-tight">{item.name}</p>
          <p className="text-[10px] text-on-surface-variant">{item.exchange}</p>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <div className="text-right">
          <p className="text-xs font-headline font-bold text-on-surface">
            {item.price ? `$${parseFloat(item.price).toLocaleString()}` : '—'}
          </p>
          <p className={`text-[10px] font-medium ${changeColor}`}>
            {item.changePercent ? `${sign}${parseFloat(item.changePercent).toFixed(2)}%` : '—'}
          </p>
        </div>

        {/* Remove button — visible on hover */}
        <button
          onClick={(e) => { e.stopPropagation(); onRemove(item.ticker); }}
          className="opacity-0 group-hover:opacity-100 transition-opacity ml-1 text-on-surface-variant/40 hover:text-error"
        >
          <span className="material-symbols-outlined" style={{ fontSize: '14px' }}>close</span>
        </button>
      </div>
    </div>
  );
}
