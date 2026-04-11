import React from 'react';

export default function AiSettings() {
  return (
    <div className="flex-1 glass-panel rounded-3xl flex items-center justify-center min-h-0">
      <div className="text-center animate-fade-in max-w-sm">
        <span className="material-symbols-outlined text-6xl text-primary mb-4 animate-pulse-slow">
          psychology
        </span>
        <h1 className="text-3xl font-headline font-light tracking-widest text-primary-fixed uppercase mb-2">
          AI Configuration
        </h1>
        <p className="text-on-surface-variant text-xs tracking-[0.1em] uppercase mb-6 leading-relaxed">
          Configure Gemini 1.5 Flash sentiment thresholds and correlation strength logic.
        </p>
        <button className="px-6 py-2 rounded-full border border-primary-fixed/30 text-primary-fixed text-xs uppercase tracking-widest hover:bg-primary-fixed/10 transition-colors">
          Coming Soon
        </button>
      </div>
    </div>
  );
}
