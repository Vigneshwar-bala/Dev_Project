import WhaleCard from './WhaleCard';
import { WHALES } from '../../data/whales';

export default function WhalePanel({ activeWhale, onSelectWhale }) {
  return (
    <aside className="w-1/5 flex flex-col gap-3 overflow-y-auto no-scrollbar">
      {/* Panel Header */}
      <div className="flex items-center justify-between px-2 mb-1">
        <h2 className="font-headline text-xs font-bold tracking-widest text-primary-fixed uppercase">
          Whale Tracker
        </h2>
        <span
          className="material-symbols-outlined text-sm text-secondary animate-pulse-slow"
          style={{ fontVariationSettings: "'FILL' 1", fontSize: '18px' }}
        >
          bubble_chart
        </span>
      </div>

      {/* Whale Cards */}
      {WHALES.map((whale) => (
        <WhaleCard
          key={whale.id}
          whale={whale}
          isActive={activeWhale?.id === whale.id}
          onClick={onSelectWhale}
        />
      ))}

      {/* Footer hint */}
      <p className="text-[9px] text-on-surface-variant/40 text-center mt-2 uppercase tracking-widest">
        Click a whale to analyze
      </p>
    </aside>
  );
}
