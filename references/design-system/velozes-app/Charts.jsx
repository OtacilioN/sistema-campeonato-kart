// Velozes app — lightweight inline-SVG charts (mobile, legible).
const RED = "#E10600";
const GRID = "#E2E2E6";
const MUTED = "#7A7A85";

function Sparkline({ data, width = 120, height = 56 }) {
  const max = Math.max(...data), min = Math.min(...data);
  const rng = max - min || 1;
  const pts = data.map((v, i) => {
    const x = (i / (data.length - 1)) * (width - 8) + 4;
    const y = height - 6 - ((v - min) / rng) * (height - 14);
    return [x, y];
  });
  const d = pts.map((p, i) => (i ? "L" : "M") + p[0].toFixed(1) + " " + p[1].toFixed(1)).join(" ");
  const last = pts[pts.length - 1];
  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
      <path d={d} fill="none" stroke={RED} strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx={last[0]} cy={last[1]} r="3.2" fill={RED} />
    </svg>
  );
}

// Evolution: ranking position (lower = better) — y inverted, labels 1º..20º
function EvolutionChart({ data, width = 380, height = 200 }) {
  const padL = 34, padR = 12, padT = 14, padB = 26;
  const w = width - padL - padR, h = height - padT - padB;
  const yTicks = [1, 5, 10, 15, 20];
  const yFor = (pos) => padT + ((pos - 1) / 19) * h; // 1 at top
  const xFor = (i) => padL + (i / (data.length - 1)) * w;
  const pts = data.map((v, i) => [xFor(i), yFor(v)]);
  const d = pts.map((p, i) => (i ? "L" : "M") + p[0].toFixed(1) + " " + p[1].toFixed(1)).join(" ");
  return (
    <svg width="100%" viewBox={`0 0 ${width} ${height}`} style={{ display: "block" }}>
      {yTicks.map((t) => (
        <g key={t}>
          <line x1={padL} y1={yFor(t)} x2={width - padR} y2={yFor(t)} stroke={GRID} strokeWidth="1" strokeDasharray="3 4" />
          <text x={padL - 8} y={yFor(t) + 4} textAnchor="end" fontSize="11" fontFamily="JetBrains Mono, monospace" fill={MUTED}>{t}º</text>
        </g>
      ))}
      <path d={d} fill="none" stroke={RED} strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" />
      {pts.map((p, i) => <circle key={i} cx={p[0]} cy={p[1]} r="3.4" fill="#fff" stroke={RED} strokeWidth="2" />)}
      {data.map((_, i) => (
        <text key={i} x={xFor(i)} y={height - 6} textAnchor="middle" fontSize="10" fontFamily="JetBrains Mono, monospace" fill={MUTED}>{i + 1}</text>
      ))}
    </svg>
  );
}

// Lap-by-lap: time per lap (seconds). Best lap highlighted in red.
function LapChart({ laps, width = 380, height = 200 }) {
  const padL = 34, padR = 14, padT = 14, padB = 26;
  const w = width - padL - padR, h = height - padT - padB;
  const max = Math.max(...laps), min = Math.min(...laps);
  const lo = Math.floor(min - 0.5), hi = Math.ceil(max + 0.5);
  const yFor = (v) => padT + (1 - (v - lo) / (hi - lo)) * h;
  const xFor = (i) => padL + (i / (laps.length - 1)) * w;
  const pts = laps.map((v, i) => [xFor(i), yFor(v)]);
  const d = pts.map((p, i) => (i ? "L" : "M") + p[0].toFixed(1) + " " + p[1].toFixed(1)).join(" ");
  const bestIdx = laps.indexOf(min);
  const ticks = [lo, lo + (hi - lo) / 3, lo + (2 * (hi - lo)) / 3, hi].map((v) => Math.round(v * 10) / 10);
  const xLabels = [1, 4, 7, 10, 13, 16, 18];
  return (
    <svg width="100%" viewBox={`0 0 ${width} ${height}`} style={{ display: "block" }}>
      {ticks.map((t) => (
        <g key={t}>
          <line x1={padL} y1={yFor(t)} x2={width - padR} y2={yFor(t)} stroke={GRID} strokeWidth="1" strokeDasharray="3 4" />
          <text x={padL - 6} y={yFor(t) + 4} textAnchor="end" fontSize="10" fontFamily="JetBrains Mono, monospace" fill={MUTED}>{t.toFixed(1)}</text>
        </g>
      ))}
      <line x1={padL} y1={yFor(min)} x2={width - padR} y2={yFor(min)} stroke={RED} strokeWidth="1" strokeDasharray="2 3" opacity="0.5" />
      <path d={d} fill="none" stroke="#55555F" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
      {pts.map((p, i) => (
        <circle key={i} cx={p[0]} cy={p[1]} r={i === bestIdx ? 4 : 2.6} fill={i === bestIdx ? RED : "#55555F"} stroke="#fff" strokeWidth={i === bestIdx ? 1.5 : 0} />
      ))}
      {xLabels.map((n) => (
        <text key={n} x={xFor(n - 1)} y={height - 6} textAnchor="middle" fontSize="10" fontFamily="JetBrains Mono, monospace" fill={MUTED}>{n}</text>
      ))}
    </svg>
  );
}

// Delta between consecutive laps — bars above/below zero (improve=green, worse=red)
function DeltaChart({ laps, width = 380, height = 150 }) {
  const padL = 34, padR = 14, padT = 12, padB = 26;
  const w = width - padL - padR, h = height - padT - padB;
  const deltas = laps.slice(1).map((v, i) => v - laps[i]);
  const maxAbs = Math.max(1.5, ...deltas.map((d) => Math.abs(d)));
  const zeroY = padT + h / 2;
  const barW = (w / deltas.length) * 0.6;
  const xFor = (i) => padL + (i + 0.5) * (w / deltas.length);
  const ticks = [-2, -1, 0, 1, 2];
  return (
    <svg width="100%" viewBox={`0 0 ${width} ${height}`} style={{ display: "block" }}>
      {ticks.map((t) => {
        const y = zeroY - (t / maxAbs) * (h / 2);
        return (
          <g key={t}>
            <line x1={padL} y1={y} x2={width - padR} y2={y} stroke={t === 0 ? "#C9C9D1" : GRID} strokeWidth="1" strokeDasharray={t === 0 ? "none" : "3 4"} />
            <text x={padL - 6} y={y + 4} textAnchor="end" fontSize="9.5" fontFamily="JetBrains Mono, monospace" fill={MUTED}>{t > 0 ? "+" + t : t}.0</text>
          </g>
        );
      })}
      {deltas.map((dv, i) => {
        const x = xFor(i);
        const barH = Math.abs(dv / maxAbs) * (h / 2);
        const y = dv <= 0 ? zeroY - barH : zeroY;
        const improve = dv < 0; // faster lap = improvement
        return <rect key={i} x={x - barW / 2} y={y} width={barW} height={Math.max(barH, 0.5)} rx="1.5" fill={improve ? "#16A34A" : "#DC2626"} opacity="0.78" />;
      })}
      {[1, 4, 7, 10, 13, 16, 18].map((n) => (
        <text key={n} x={xFor(n - 1)} y={height - 6} textAnchor="middle" fontSize="10" fontFamily="JetBrains Mono, monospace" fill={MUTED}>{n}</text>
      ))}
    </svg>
  );
}

Object.assign(window, { Sparkline, EvolutionChart, LapChart, DeltaChart });
