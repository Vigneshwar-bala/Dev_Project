import { useState } from 'react';
import WhaleCard from './WhaleCard';
import { WHALES } from '../../data/whales';

const INVESTOR_SUGGESTIONS = [
  "Warren Buffett",
  "Elon Musk",
  "Michael Saylor",
  "Nancy Pelosi",
  "Cathie Wood",
  "Rakesh Jhunjhunwala",
  "Radhakishan Damani",
  "Ray Dalio",
  "Bill Ackman",
  "Retail Sentiment (Reddit)"
];

const INVESTOR_PORTFOLIOS = {
  "Warren Buffett": ["AAPL", "OXY", "BAC", "AXP", "CVX"],
  "Elon Musk": ["TSLA", "DOGE", "BTC"],
  "Michael Saylor": ["BTC", "MSTR"],
  "Nancy Pelosi": ["NVDA", "MSFT", "AAPL", "CRWD", "PANW"],
  "Cathie Wood": ["TSLA", "RBLX", "COIN", "U", "ZM"],
  "Rakesh Jhunjhunwala": ["RELIANCE", "TITAN", "TCHM", "STAR"],
  "Radhakishan Damani": ["DMART", "HDFCBANK", "INFY"],
  "Ray Dalio": ["IVV", "IEMG", "PG", "JNJ"],
  "Bill Ackman": ["CMG", "QSR", "HLT", "GOOGL"],
  "Retail Sentiment (Reddit)": ["GME", "AMC", "BB", "NOK", "PLTR"]
};

export default function WhalePanel({ activeWhale, onSelectWhale }) {
  const [customInvestor, setCustomInvestor] = useState('');
  const [customTicker, setCustomTicker] = useState('');

  const tickerOptions = customInvestor ? (INVESTOR_PORTFOLIOS[customInvestor] || []) : [];

  const handleCustomAnalyze = (e) => {
    e.preventDefault();
    if (!customInvestor.trim() || !customTicker.trim()) return;

    const customWhale = {
      id: `custom_${Date.now()}`,
      name: customInvestor,
      firm: 'Custom Inquiry',
      ticker: customTicker.toUpperCase(),
      trade: `Targeting ${customTicker.toUpperCase()}`,
      tradeLabel: 'User Inquiry',
      sentiment: 'Pending AI',
      sentimentColor: 'secondary',
      borderAccent: true,
      avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(customInvestor)}&background=0D1117&color=4ade80&rounded=true&bold=true`,
    };

    onSelectWhale(customWhale);
    setCustomInvestor('');
    setCustomTicker('');
  };

  return (
    <aside className="w-1/5 flex flex-col gap-3 overflow-y-auto no-scrollbar">
      {/* Panel Header */}
      <div className="flex items-center justify-between px-2 mb-1 shrink-0">
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

      {/* ── Custom Analysis Builder ── */}
      <form onSubmit={handleCustomAnalyze} className="glass-panel rounded-2xl p-3 border border-secondary/20 shadow-lg shrink-0 flex flex-col gap-2 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-16 h-16 bg-secondary/10 blur-xl rounded-full" />
        
        <p className="text-[9px] uppercase tracking-widest font-bold text-secondary flex items-center gap-1 mb-1">
          <span className="material-symbols-outlined text-[12px]">tune</span>
          Custom Scenario
        </p>

        <div className="flex flex-col gap-2 relative z-10">
          <select
            value={customInvestor}
            onChange={(e) => {
              setCustomInvestor(e.target.value);
              setCustomTicker(''); // reset ticker when investor changes
            }}
            className="w-full bg-surface-container/50 border border-outline-variant/10 rounded-lg px-3 py-1.5 text-[11px] text-on-surface focus:outline-none focus:border-secondary/50 transition-colors"
          >
            <option value="" disabled hidden>Select an Investor...</option>
            {INVESTOR_SUGGESTIONS.map(inv => (
              <option key={inv} value={inv} className="bg-surface-container-high">{inv}</option>
            ))}
          </select>

          <select
            value={customTicker}
            onChange={(e) => setCustomTicker(e.target.value.toUpperCase())}
            disabled={!customInvestor}
            className="w-full bg-surface-container/50 border border-outline-variant/10 rounded-lg px-3 py-1.5 text-[11px] font-mono text-on-surface uppercase focus:outline-none focus:border-secondary/50 transition-colors disabled:opacity-50"
          >
            <option value="" disabled hidden>Select Target Asset...</option>
            {tickerOptions.map(tic => (
              <option key={tic} value={tic} className="bg-surface-container-high">{tic}</option>
            ))}
          </select>

          <button 
            type="submit"
            disabled={!customInvestor.trim() || !customTicker.trim()}
            className="w-full mt-1 bg-secondary/10 hover:bg-secondary/20 text-secondary border border-secondary/20 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg py-1.5 text-[10px] font-bold uppercase tracking-widest transition-all active:scale-95 flex flex-row items-center justify-center gap-1.5"
          >
            <span className="material-symbols-outlined text-[14px]">psychology</span>
            Analyze
          </button>
        </div>
      </form>

      {/* Whale Cards */}
      <div className="flex flex-col gap-3">
        {WHALES.map((whale) => (
          <WhaleCard
            key={whale.id}
            whale={whale}
            isActive={activeWhale?.id === whale.id}
            onClick={onSelectWhale}
          />
        ))}
      </div>

      {/* Footer hint */}
      <p className="text-[9px] text-on-surface-variant/40 text-center mt-2 uppercase tracking-widest shrink-0">
        Select a profile to analyze
      </p>
    </aside>
  );
}
