import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
import { formatINR } from "../../constants/utils";

function CustomTooltip({ active, payload }) {
  if (!active || !payload?.length) return null;
  const d = payload[0];
  return (
    <div className="bg-[#1a1b2e] border border-white/10 rounded-xl px-3 py-2 text-xs shadow-xl">
      <p className="text-white/60 mb-0.5">{d.name}</p>
      <p className="text-white font-bold">{formatINR(d.value)}</p>
      <p className="text-white/40">{d.payload.pct}%</p>
    </div>
  );
}

export function DonutChart({ data }) {
  const total = data.reduce((s, d) => s + d.value, 0);
  const withPct = data.map((d) => ({
    ...d,
    pct: total > 0 ? ((d.value / total) * 100).toFixed(1) : "0",
  }));

  return (
    <div className="flex flex-col gap-4">
      <div className="relative h-44">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={withPct}
              cx="50%"
              cy="50%"
              innerRadius="58%"
              outerRadius="80%"
              paddingAngle={2}
              dataKey="value"
              startAngle={90}
              endAngle={-270}
              stroke="none"
            >
              {withPct.map((entry, i) => (
                <Cell key={i} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
          </PieChart>
        </ResponsiveContainer>

        {/* Center label */}
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <span className="text-lg font-bold text-white leading-none">
            {formatINR(total)}
          </span>
          <span className="text-[10px] text-white/35 mt-1">total spent</span>
        </div>
      </div>

      {/* Legend */}
      <div className="flex flex-col gap-1.5">
        {withPct.slice(0, 5).map((d) => (
          <div key={d.name} className="flex items-center gap-2">
            <div
              className="w-2 h-2 rounded-sm shrink-0"
              style={{ background: d.color }}
            />
            <span className="text-[11px] text-white/50 flex-1 truncate">{d.name}</span>
            <span className="text-[11px] font-semibold text-white/80">
              {formatINR(d.value)}
            </span>
            <span className="text-[10px] text-white/30 w-8 text-right">{d.pct}%</span>
          </div>
        ))}
      </div>
    </div>
  );
}
