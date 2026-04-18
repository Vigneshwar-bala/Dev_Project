import React, { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { analyzeSentiment } from '../../services/api.js';
import { WHALES } from '../../data/whales.js';

const SECTORS = [
  { id: 'tech', name: 'Technology', icon: 'memory', color: 'primary', metrics: ['P/E 28.4', 'Vol 2.1%', 'AI Score 87'] },
  { id: 'energy', name: 'Energy', icon: 'bolt', color: 'secondary', metrics: ['P/E 12.7', 'Vol 3.8%', 'AI Score 62'] },
  { id: 'finance', name: 'Finance', icon: 'account_balance', color: 'primary', metrics: ['P/E 15.2', 'Vol 1.9%', 'AI Score 74'] },
  { id: 'crypto', name: 'Crypto', icon: 'currency_bitcoin', color: 'secondary', metrics: ['P/E N/A', 'Vol 5.4%', 'AI Score 91'] },
];

export default function Insights() {
  const [loading, setLoading] = useState(false);

  const handleDeepDive = async (sectorId) => {
    setLoading(true);
    try {
      const whale = WHALES[0]; // Buffett for demo
      const payload = { sector: sectorId.toUpperCase(), whaleName: whale.name, tickers: ['NVDA', 'MSFT'] };
      const result = await analyzeSentiment(payload);
      toast.success(`AI Insight: ${result.bias?.toUpperCase()} bias for ${sectorId.toUpperCase()} sector`);
    } catch (error) {
      toast.error('AI analysis fallback: Sector showing neutral momentum');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex-1 glass-panel rounded-3xl p-8 flex flex-col gap-8 min-h-0 overflow-y-auto">
      <div className="flex items-center gap-4">
        <span className="material-symbols-outlined text-4xl text-primary">bubble_chart</span>
        <h1 className="text-4xl font-headline font-light tracking-widest text-primary-fixed uppercase">
          AI Sector Radar
        </h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {SECTORS.map((sector) => (
          <div key={sector.id} className="glass-panel p-6 rounded-2xl border border-outline-variant/30 hover:shadow-[0_20px_40px_rgba(38,254,220,0.1)] transition-all duration-500 hover:-translate-y-1">
            <div className="flex items-center gap-3 mb-6">
              <span className="material-symbols-outlined text-2xl" style={{ color: `var(--color-${sector.color})` }}>
                {sector.icon}
              </span>
              <h2 className="text-xl font-bold text-on-surface">{sector.name}</h2>
            </div>

            {/* SVG Gauge */}
            <svg viewBox="0 0 120 120" className="w-24 h-24 mx-auto mb-6">
              <circle cx="60" cy="60" r="52" fill="none" stroke="#1a1c1f" strokeWidth="8" />
              <circle cx="60" cy="60" r="52" fill="none" stroke={`url(#grad-${sector.id})`} strokeWidth="8" strokeLinecap="round" strokeDasharray="327" strokeDashoffset={327 - (sector.metrics[2].split(' ')[1] * 3.27)} />
              <defs>
                <linearGradient id={`grad-${sector.id}`} x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor={`var(--color-${sector.color})`} />
                  <stop offset="100%" stopColor={`var(--color-${sector.color}-fixed)`} />
                </linearGradient>
              </defs>
              <text x="60" y="65" textAnchor="middle" className="text-2xl font-bold fill-primary-fixed" fontFamily="Inter">{sector.metrics[2].split(' ')[1]}</text>
              <text x="60" y="42" textAnchor="middle" className="text-sm fill-on-surface-variant" fontSize="10" fontFamily="Inter">AI Score</text>
            </svg>

            {/* Metrics Table */}
            <div className="space-y-2 mb-6">
              {sector.metrics.map((metric, i) => (
                <div key={i} className="flex justify-between text-sm">
                  <span className="text-on-surface-variant">{metric.split(' ')[0]}</span>
                  <span className="font-mono text-primary font-semibold">{metric.split(' ')[1]}</span>
                </div>
              ))}
            </div>

            <button
              onClick={() => handleDeepDive(sector.id)}
              disabled={loading}
              className="w-full bg-primary-fixed/10 hover:bg-primary-fixed/20 border border-primary-fixed/30 text-primary-fixed font-semibold py-3 px-6 rounded-xl transition-all duration-300 flex items-center justify-center gap-2 hover:shadow-[0_0_20px_rgba(38,254,220,0.3)] disabled:opacity-50"
            >
              <span className="material-symbols-outlined text-sm">psychology</span>
              {loading ? 'Analyzing...' : 'Deep Dive AI'}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

