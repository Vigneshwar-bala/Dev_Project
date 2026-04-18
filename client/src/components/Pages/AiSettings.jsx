import React, { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import api from '../../services/api.js';

export default function AiSettings() {
  const [config, setConfig] = useState({
    scoreThreshold: 70,
    volatilityFilter: 'Medium',
    model: 'gpt-4o-mini',
    cacheTTL: 24,
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Load saved config
    api.get('/config').then(r => setConfig(r.data)).catch(() => {});
  }, []);

  const handleSave = async () => {
    setLoading(true);
    try {
      await api.post('/config', config);
      toast.success('AI config saved - active in real-time');
    } catch {
      toast.error('Save failed');
    } finally {
      setLoading(false);
    }
  };

  const handleResetCache = async () => {
    try {
      await api.delete('/sentiment/cache/purge');
      toast.success('Mongo cache reset - fresh analysis next');
    } catch {
      toast.error('Reset failed');
    }
  };

  return (
    <div className="flex-1 glass-panel rounded-3xl p-8 flex flex-col gap-8 min-h-0">
      <div className="flex items-center gap-4">
        <span className="material-symbols-outlined text-4xl text-primary">psychology</span>
        <h1 className="text-4xl font-headline font-light tracking-widest text-primary-fixed uppercase">
          AI Engine Control
        </h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Score Threshold */}
        <div className="space-y-4">
          <label className="text-sm font-semibold text-on-surface uppercase tracking-wide">Min Score Threshold</label>
          <input 
            type="range" 
            min="0" max="100" 
            value={config.scoreThreshold}
            onChange={(e) => setConfig({...config, scoreThreshold: Number(e.target.value)})}
            className="w-full h-2 bg-surface-container-low rounded-lg appearance-none cursor-pointer accent-primary-fixed"
          />
          <span className="text-2xl font-mono text-primary-fixed">{config.scoreThreshold}</span>
          <p className="text-xs text-on-surface-variant">Analysis score below this skipped (higher = stricter)</p>
        </div>

        {/* Volatility Filter */}
        <div className="space-y-4">
          <label className="text-sm font-semibold text-on-surface uppercase tracking-wide">Volatility Filter</label>
          <select 
            value={config.volatilityFilter}
            onChange={(e) => setConfig({...config, volatilityFilter: e.target.value})}
            className="w-full p-3 bg-surface-container-low border border-outline-variant/30 rounded-xl text-sm focus:border-primary-fixed/50 transition-colors"
          >
            <option>Low</option>
            <option>Medium</option>
            <option>High</option>
          </select>
          <p className="text-xs text-on-surface-variant">Filter insights by market volatility level</p>
        </div>
      </div>

      <div className="space-y-4 pt-4 border-t border-outline-variant/20">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <button
            onClick={handleSave}
            disabled={loading}
            className="flex-1 bg-primary-fixed/10 hover:bg-primary-fixed/20 border border-primary-fixed/30 text-primary-fixed font-semibold py-4 px-6 rounded-xl transition-all flex items-center justify-center gap-2 hover:shadow-[0_0_20px_rgba(38,254,220,0.2)] disabled:opacity-50"
          >
            <span className="material-symbols-outlined">save</span>
            {loading ? 'Saving...' : 'Apply Real-Time'}
          </button>
          <button
            onClick={handleResetCache}
            className="flex-1 bg-error/10 hover:bg-error/20 border border-error/30 text-error font-semibold py-4 px-6 rounded-xl transition-all flex items-center justify-center gap-2 hover:shadow-[0_0_20px_rgba(255,180,171,0.2)]"
          >
            <span className="material-symbols-outlined">delete_sweep</span>
            Reset Mongo Cache
          </button>
        </div>
        <div className="text-xs text-on-surface-variant p-4 bg-surface-container-low rounded-xl">
          <p>⚙️ Current Model: <span className="font-mono text-primary">{config.model}</span></p>
          <p>💾 Cache TTL: <span className="font-mono text-primary">{config.cacheTTL}h</span> (auto-purge)</p>
          <p className="mt-1">Changes apply instantly to new whale analysis.</p>
        </div>
      </div>
    </div>
  );
}

