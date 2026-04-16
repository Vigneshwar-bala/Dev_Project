import { useEffect, useRef, useState } from 'react';

// ── Gauge geometry ────────────────────────────────────────────────────────────
// Arc = semicircle ∩ shape (arch over the top like a speedometer)
// sweep=1 in SVG = clockwise visually = goes OVER THE TOP ✓
const CX = 140;   // horizontal center
const CY = 140;   // arc base line (bottom of the arch)
const R = 112;   // radius
const SW = 24;    // stroke thickness

const LEFT_X = CX - R;   // 28
const RIGHT_X = CX + R;   // 252
const ARC_TOP = CY - R;   // 28  ← top of arch

// Arch path: left → UP over top → right (sweep=1 = clockwise in SVG = over top)
const TRACK = `M ${LEFT_X} ${CY} A ${R} ${R} 0 0 1 ${RIGHT_X} ${CY}`;

// ViewBox: wide enough for labels, tall enough to show arch top → base + label space + new space for text below pivot
const VW = 280;
const VH = CY + 60;    // Increased to make room for text below the pivot

// Tick positions: angle 0° = right, 180° = left (standard math, y flipped for SVG)
// score 0 → angle 180° (3 o'clock in standard = left of arch)
// score 100 → angle 0°  (left of standard = right of arch)
// In SVG arch (sweep=1): left anchor is at 180°, right is at 0°
// Tick x = CX + r*cos(angleDeg * PI/180)
// Tick y = CY - r*sin(angleDeg * PI/180)  ← minus because SVG y is down
const tickAngle = (score) => (180 - score * 1.8) * (Math.PI / 180);

// Color zones
const palette = (s) => {
  if (s >= 67) return { arc: '#3b82f6', num: '#60a5fa', needle: '#60a5fa' };   // blue   — bullish
  if (s >= 34) return { arc: '#f59e0b', num: '#fbbf24', needle: '#fbbf24' };   // yellow — neutral
  return { arc: '#ef4444', num: '#f87171', needle: '#f87171' };    // red    — bearish
};

export default function SentimentGauge({
  score = 50,
  bias = 'Neutral',
  volatility = 'Low',
  liquidity = 'Deep',
}) {
  const [animScore, setAnimScore] = useState(0);
  const rafRef = useRef(null);
  const fromRef = useRef(0);

  useEffect(() => {
    const from = fromRef.current;
    const to = score;
    const dur = 1000;
    let t0 = null;

    cancelAnimationFrame(rafRef.current);
    const tick = (ts) => {
      if (!t0) t0 = ts;
      const p = Math.min((ts - t0) / dur, 1);
      const e = 1 - Math.pow(1 - p, 3); // ease-out cubic
      setAnimScore(Math.round(from + (to - from) * e));
      if (p < 1) rafRef.current = requestAnimationFrame(tick);
      else fromRef.current = to;
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [score]);

  const c = palette(score);
  const biasColor = bias === 'Bullish' ? 'text-primary'
    : bias === 'Bearish' ? 'text-error'
      : 'text-secondary';
  const volColor = volatility === 'High' ? 'text-error'
    : volatility === 'Medium' ? 'text-secondary'
      : 'text-primary';

  return (
    <div className="flex flex-col items-center w-full mt-4">

      {/* ── Header ── */}
      <div className="text-center mb-6">
        <h1 className="text-2xl font-headline font-light tracking-tight text-primary mb-1">
          Correlation Engine
        </h1>
        <p className="text-on-surface-variant text-[10px] uppercase tracking-[0.3em]">
          Institutional Sentiment Index
        </p>
      </div>

      {/* ── SVG Gauge ── */}
      <div className="w-full max-w-[280px]">
        <svg
          viewBox={`0 0 ${VW} ${VH}`}
          width="100%"
          style={{ display: 'block', overflow: 'visible' }}
        >
          <defs>
            <filter id="gArc" x="-40%" y="-40%" width="180%" height="180%">
              <feGaussianBlur stdDeviation="1.5" result="b" />
              <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
            </filter>
            <filter id="gTxt" x="-30%" y="-30%" width="160%" height="160%">
              <feGaussianBlur stdDeviation="1" result="b" />
              <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
            </filter>
          </defs>

          {/* ── Background track ── */}
          <path d={TRACK} fill="none" stroke="#1f2937" strokeWidth={SW} strokeLinecap="round" />

          {/* ── Colored fill arc (pathLength=100 → score maps directly) ── */}
          <path
            d={TRACK}
            fill="none"
            stroke={c.arc}
            strokeWidth={SW}
            strokeLinecap="round"
            pathLength="100"
            strokeDasharray={`${Math.max(animScore, 0.3)} 100`}
            strokeDashoffset="0"
            filter="url(#gArc)"
            style={{ transition: 'stroke 0.6s ease' }}
          />

          {/* ── Tick marks at 0 / 25 / 50 / 75 / 100 ── */}
          {[0, 25, 50, 75, 100].map((t) => {
            const a = tickAngle(t);
            const rIn = R + SW / 2 + 3;
            const rOut = R + SW / 2 + 11;
            return (
              <line
                key={t}
                x1={CX + rIn * Math.cos(a)} y1={CY - rIn * Math.sin(a)}
                x2={CX + rOut * Math.cos(a)} y2={CY - rOut * Math.sin(a)}
                stroke="#374151" strokeWidth="1.5" strokeLinecap="round"
              />
            );
          })}

          {/* ── Needle Pivot + Polygon ── */}
          <g style={{ transform: `rotate(${(animScore - 50) * 1.8}deg)`, transformOrigin: `${CX}px ${CY}px` }}>
            <path d={`M ${CX-5} ${CY} L ${CX+5} ${CY} L ${CX} ${CY - R + SW/2 + 5} Z`} fill="#9ca3af" />
            <circle cx={CX} cy={CY} r="12" fill="#9ca3af" />
            <circle cx={CX} cy={CY} r="4" fill="#111827" />
          </g>

          {/* ── Score number — Shifted below the pivot to accommodate needle ── */}
          <text
            x={CX}
            y={CY + 36}
            textAnchor="middle" dominantBaseline="middle"
            fontSize="42" fontWeight="800" fontFamily="Inter, sans-serif"
            fill={c.num} filter="url(#gTxt)"
            style={{ transition: 'fill 0.6s ease' }}
          >
            {animScore}
          </text>

          {/* ── Bias label below score ── */}
          <text
            x={CX}
            y={CY + 56}
            textAnchor="middle" dominantBaseline="middle"
            fontSize="9" fontFamily="Inter, sans-serif"
            fill={c.num} opacity="0.55" letterSpacing="4"
            style={{ transition: 'fill 0.6s ease' }}
          >
            {bias.toUpperCase()}
          </text>

          {/* ── BEAR / BULL end labels ── */}
          <text x={LEFT_X} y={CY + 18} textAnchor="start" fontSize="8" fontFamily="Inter" fill="#4B5563">BEAR</text>
          <text x={RIGHT_X} y={CY + 18} textAnchor="end" fontSize="8" fontFamily="Inter" fill="#4B5563">BULL</text>
        </svg>
      </div>

      {/* ── Metrics row ── */}
      <div className="grid grid-cols-3 w-full mt-4 gap-2">
        <div className="text-center py-2 border-r border-outline-variant/10">
          <p className="text-[9px] text-on-surface-variant uppercase mb-1 tracking-widest">Market Bias</p>
          <p className={`text-sm font-headline font-bold ${biasColor}`}>{bias}</p>
        </div>
        <div className="text-center py-2 border-r border-outline-variant/10">
          <p className="text-[9px] text-on-surface-variant uppercase mb-1 tracking-widest">Volatility</p>
          <p className={`text-sm font-headline font-bold ${volColor}`}>{volatility}</p>
        </div>
        <div className="text-center py-2">
          <p className="text-[9px] text-on-surface-variant uppercase mb-1 tracking-widest">Liquidity</p>
          <p className="text-sm font-headline font-bold text-primary">{liquidity}</p>
        </div>
      </div>
    </div>
  );
}
