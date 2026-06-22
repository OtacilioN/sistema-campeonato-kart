"use client";

import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

type PilotEvolutionChartProps = {
  entries: {
    batteryNumber: number;
    finalPoints: number;
    discarded: boolean;
  }[];
};

function formatPoints(value: unknown) {
  const points = Number(value);
  if (!Number.isFinite(points)) return "0 pts";
  return `${points.toLocaleString("pt-BR", { maximumFractionDigits: 1 })} pts`;
}

export function PilotEvolutionChart({ entries }: PilotEvolutionChartProps) {
  const data = [...entries]
    .sort((a, b) => a.batteryNumber - b.batteryNumber)
    .map((entry) => ({
      bateria: `B${entry.batteryNumber}`,
      batteryNumber: entry.batteryNumber,
      pontos: entry.finalPoints,
      status: entry.discarded ? "Descarte" : "Conta no ranking",
    }));

  if (!data.length) {
    return <p className="muted">Sem resultados confirmados para montar a evolução.</p>;
  }

  return (
    <div className="chart-box evolution-chart-box">
      <ResponsiveContainer width="100%" height={210}>
        <LineChart data={data} margin={{ top: 8, right: 12, bottom: 0, left: -8 }}>
          <CartesianGrid stroke="#e2e2e6" strokeDasharray="3 3" />
          <XAxis dataKey="bateria" tickLine={false} axisLine={false} />
          <YAxis tickLine={false} axisLine={false} allowDecimals={false} domain={[0, "dataMax + 2"]} width={36} />
          <Tooltip
            formatter={(value, _name, item) => [formatPoints(value), item.payload?.status ?? "Pontos"]}
            labelFormatter={(label) => `Bateria ${String(label).replace("B", "")}`}
          />
          <Legend verticalAlign="top" height={28} iconType="line" />
          <Line
            type="monotone"
            dataKey="pontos"
            name="Pontos"
            stroke="#e10600"
            strokeWidth={2.5}
            dot={{ r: 3 }}
            activeDot={{ r: 5 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
