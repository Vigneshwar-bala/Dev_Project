import { useState, useEffect } from 'react';
import SentimentGauge from './SentimentGauge';
import LogicSummary from './LogicSummary';
import { analyzeSentiment } from '../../services/api';
import toast from 'react-hot-toast';

const DEFAULT_STATE = {
  score: 62,
  bias: 'Bullish',
  volatility: 'Low',
  liquidity: 'Deep',
  stockBought: '',
  whyBought: '',
  profitMade: '',
  profitGraph: [],
  whaleName: '',
  ticker: '',
  fromCache: false,
  isFallback: false,
};

export default function EnginePanel({ activeWhale }) {
  const [engineState, setEngineState] = useState(DEFAULT_STATE);
  const [analyzing, setAnalyzing] = useState(false);

  useEffect(() => {
    if (!activeWhale) return;

    let cancelled = false;
    setAnalyzing(true);

    analyzeSentiment({
      whale: { name: activeWhale.name, firm: activeWhale.firm },
      trade: activeWhale.trade,
      ticker: activeWhale.ticker,
      sentiment: activeWhale.sentiment,
    })
      .then((data) => {
        if (cancelled) return;
        setEngineState({
          score: data.score,
          bias: data.bias,
          volatility: data.volatility,
          liquidity: data.liquidity,
          stockBought: data.stockBought || '',
          whyBought: data.whyBought || '',
          profitMade: data.profitMade || '',
          profitGraph: data.profitGraph || [],
          whaleName: activeWhale.name,
          ticker: activeWhale.ticker,
          fromCache: data.fromCache,
          isFallback: data.isFallback || false,
        });
        if (data.fromCache) toast.success('⚡ Loaded from insight cache');
        else if (data.isFallback) toast('⚠️ Gemini API limit — showing fallback data', { icon: '⚠️' });
        else toast.success('🤖 Whale intelligence loaded');
      })
      .catch((err) => {
        if (!cancelled) {
          toast.error('Analysis failed — check server');
          console.error(err);
        }
      })
      .finally(() => { if (!cancelled) setAnalyzing(false); });

    return () => { cancelled = true; };
  }, [activeWhale?.id]);

  return (
    /*
     * section: flex column, fills available height, SCROLLABLE vertically
     * gap-3 between the two panels
     * overflow-y-auto + pb for breathing room
     */
    <section
      className="flex-1 flex flex-col gap-3 min-w-0 min-h-0 overflow-y-auto pb-4"
      style={{ scrollbarWidth: 'none' }}
    >

      {/* ── Gauge Panel — contains header + arc + metrics ── */}
      {/*   shrink-0 so it never compresses, always fully visible  */}
      <div className="glass-panel rounded-3xl px-6 pt-6 pb-4 flex flex-col items-center relative shrink-0">
        {/* background shimmer */}
        <div className="absolute inset-0 bg-gradient-to-b from-primary-fixed/5 dark:from-[#26fedc]/5 to-transparent pointer-events-none rounded-3xl" />

        <SentimentGauge
          score={engineState.score}
          bias={engineState.bias}
          volatility={engineState.volatility}
          liquidity={engineState.liquidity}
        />

        {/* Idle hint when no whale selected yet */}
        {!activeWhale && (
          <p className="text-on-surface-variant/30 dark:text-[#b9cac4]/30 text-[10px] uppercase tracking-[0.3em] animate-pulse-slow mt-2">
            ← Select a whale to activate Gemini analysis
          </p>
        )}
      </div>

      {/* ── Logic Panel — sticky below gauge, scrollable internally ── */}
      {/*   shrink-0 prevents this from being squashed                  */}
      <div className="glass-panel rounded-3xl px-5 py-4 shrink-0 overflow-y-auto"
        style={{ scrollbarWidth: 'none', maxHeight: '260px' }}
      >
        <LogicSummary
          stockBought={engineState.stockBought}
          whyBought={engineState.whyBought}
          profitMade={engineState.profitMade}
          profitGraph={engineState.profitGraph}
          whaleName={engineState.whaleName}
          ticker={engineState.ticker}
          loading={analyzing}
          fromCache={engineState.fromCache}
          isFallback={engineState.isFallback}
        />
      </div>
    </section>
  );
}
