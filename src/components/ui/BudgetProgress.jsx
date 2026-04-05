import { formatINR } from "../../constants/utils";

function barColor(pct) {
  if (pct >= 90) return "from-red-500 to-orange-500";
  if (pct >= 75) return "from-amber-400 to-orange-500";
  return "from-indigo-500 to-violet-500";
}

export function BudgetProgress({ totalSpent, budget, budgetPct }) {
  return (
    <div className="bg-white/[0.04] border border-white/[0.08] rounded-2xl p-4 mb-4">
      <div className="flex justify-between items-center mb-3">
        <span className="text-sm text-white/60">Monthly Budget</span>
        <span
          className={`text-sm font-semibold ${
            budgetPct >= 90
              ? "text-red-300"
              : budgetPct >= 75
              ? "text-amber-300"
              : "text-emerald-300"
          }`}
        >
          {budgetPct.toFixed(1)}%
        </span>
      </div>

      <div className="h-2 bg-white/[0.07] rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full bg-gradient-to-r ${barColor(budgetPct)} transition-all duration-1000 ease-out`}
          style={{ width: `${budgetPct}%` }}
        />
      </div>

      <div className="flex justify-between mt-2">
        <span className="text-[11px] text-white/25">₹0</span>
        <span className="text-[11px] text-white/40 font-medium">
          {formatINR(totalSpent)} / {formatINR(budget)}
        </span>
        <span className="text-[11px] text-white/25">{formatINR(budget)}</span>
      </div>
    </div>
  );
}
