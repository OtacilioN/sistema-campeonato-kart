"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

type LapChartsProps = {
  laps: {
    lapNumber: number;
    lapTime: string;
    deltaBestLap: string | null;
  }[];
};

function timeToSeconds(value: string | null | undefined) {
  if (!value) return null;
  const parts = value.split(":");
  if (parts.length === 2) {
    const [minutes, seconds] = parts;
    return Number(minutes) * 60 + Number(seconds);
  }
  if (parts.length === 3) {
    const [hours, minutes, seconds] = parts;
    return Number(hours) * 3600 + Number(minutes) * 60 + Number(seconds);
  }
  return null;
}

function deltaToSeconds(value: string | null | undefined) {
  if (!value || value === "---") return 0;
  return Number(value.replace(",", ".").replace("+", ""));
}

function formatLapTime(value: unknown) {
  const seconds = Number(value);
  if (!Number.isFinite(seconds)) return "--:--.--";

  const totalCentiseconds = Math.max(0, Math.round(seconds * 100));
  const minutes = Math.floor(totalCentiseconds / 6000);
  const secondsPart = Math.floor((totalCentiseconds % 6000) / 100);
  const centiseconds = totalCentiseconds % 100;

  return `${minutes}:${String(secondsPart).padStart(2, "0")}.${String(centiseconds).padStart(2, "0")}`;
}

function formatDeltaTime(value: unknown) {
  const seconds = Number(value);
  if (!Number.isFinite(seconds)) return "0.00s";

  const sign = seconds > 0 ? "+" : seconds < 0 ? "-" : "";
  return `${sign}${Math.abs(seconds).toFixed(2)}s`;
}

export function LapCharts({ laps }: LapChartsProps) {
  const data = laps.map((lap, index) => {
    const seconds = timeToSeconds(lap.lapTime) ?? 0;
    const previous = index > 0 ? timeToSeconds(laps[index - 1].lapTime) ?? seconds : seconds;

    return {
      lap: lap.lapNumber,
      tempo: Number(seconds.toFixed(3)),
      variacao: Number((seconds - previous).toFixed(3)),
      melhor: Number(deltaToSeconds(lap.deltaBestLap).toFixed(3)),
    };
  });

  if (!data.length) return <p className="muted">Nenhuma volta extraída do lap-to-lap.</p>;

  return (
    <div className="chart-stack">
      <div className="chart-box">
        <div className="chart-title">Tempo por volta</div>
        <ResponsiveContainer width="100%" height={210}>
          <LineChart data={data} margin={{ top: 8, right: 12, bottom: 0, left: -18 }}>
            <CartesianGrid stroke="#e2e2e6" strokeDasharray="3 3" />
            <XAxis dataKey="lap" tickLine={false} axisLine={false} />
            <YAxis tickLine={false} axisLine={false} domain={["dataMin - 1", "dataMax + 1"]} tickFormatter={formatLapTime} width={56} />
            <Tooltip formatter={(value) => [formatLapTime(value), "Tempo"]} labelFormatter={(label) => `Volta ${label}`} />
            <Line type="monotone" dataKey="tempo" stroke="#e10600" strokeWidth={2.5} dot={{ r: 3 }} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="chart-box">
        <div className="chart-title">Variação entre voltas</div>
        <ResponsiveContainer width="100%" height={190}>
          <BarChart data={data} margin={{ top: 8, right: 12, bottom: 0, left: -18 }}>
            <CartesianGrid stroke="#e2e2e6" strokeDasharray="3 3" />
            <XAxis dataKey="lap" tickLine={false} axisLine={false} />
            <YAxis tickLine={false} axisLine={false} tickFormatter={formatDeltaTime} width={52} />
            <Tooltip formatter={(value) => [formatDeltaTime(value), "Variação"]} labelFormatter={(label) => `Volta ${label}`} />
            <Bar dataKey="variacao" fill="#070707" radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
