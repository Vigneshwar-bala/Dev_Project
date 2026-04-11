import React from 'react';

export default function Insights() {
  return (
    <div className="flex-1 glass-panel rounded-3xl flex items-center justify-center min-h-0">
      <div className="text-center animate-fade-in">
        <span className="material-symbols-outlined text-6xl text-primary mb-4 animate-pulse-slow">
          bubble_chart
        </span>
        <h1 className="text-4xl font-headline font-light tracking-widest text-primary-fixed uppercase mb-2">
          Deep Insights
        </h1>
        <p className="text-on-surface-variant text-sm tracking-[0.2em] uppercase">
          AI sentiment cluster visualization coming soon
        </p>
      </div>
    </div>
  );
}
