import {
  LineChart,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ReponsiveContainer,
} from "recharts";

export default function ProgressChart({ data }) {
  return (
    <div className="w-full h-64 bg-slate-900 p-4 rounded-xl shadow-lg border border-slate-800">
      <h3 className="text-white font-semibold mb-4">Volume Over Time</h3>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <CartesianGrid
            strokeDasharray="3 3"
            stroke="#334155"
            vertical={false}
          />
          <XAxis
            dataKey="date"
            stroke="#94a3b8"
            fontSize={12}
            tickLine={false}
            axisLine={false}
          />
          <YAxis
            stroke="#94a3b8"
            fontSize={12}
            tickLine={false}
            axisLine={false}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: "#1e293b",
              border: "none",
              borderRadius: "8px",
              color: "#fff",
            }}
            itemStyle={{ color: "#38bdf8" }}
          />
          <Line
            type="monotone"
            dataKey="volume"
            stroke="#38bdf8"
            strokeWidth={3}
            dot={{ fill: "#38bdf8", strokeWidth: 2, r: 4 }}
            activeDot={{ r: 6 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
