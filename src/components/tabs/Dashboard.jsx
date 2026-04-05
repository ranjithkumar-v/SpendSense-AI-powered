import { StatCard } from "../ui/StatCard";
import { BudgetProgress } from "../ui/BudgetProgress";
import { ExpenseRow } from "../ui/ExpenseRow";
import { DonutChart } from "../charts/DonutChart";
import { TrendBarChart } from "../charts/TrendBarChart";
import { useCountUp } from "../../hooks/useCountUp";
import { formatINR } from "../../constants/utils";
import { MONTHLY_TREND } from "../../constants/data";

export function Dashboard({
  expenses,
  totalSpent,
  budget,
  budgetPct,
  remaining,
  categoryBreakdown,
}) {
  const animTotal = useCountUp(totalSpent);
  const animBudget = useCountUp(budget);

  return (
    <div className="animate-[slideUp_0.4s_ease]">
      {/* Stat cards */}
      {/* <div className="grid grid-cols-3 gap-3 mb-4"> */}
      <div className="grid grid-cols-3 gap-4 mb-4">
        <StatCard
          label="Total Spent"
          value={formatINR(animTotal)}
          sub={`of ${formatINR(animBudget)}`}
          color="text-indigo-400"
        />
        <StatCard
          label="Remaining"
          value={formatINR(Math.max(remaining, 0))}
          sub={remaining < 0 ? "over budget" : "available"}
          color={remaining < 0 ? "text-red-400" : "text-emerald-400"}
        />
        <StatCard
          label="Transactions"
          value={expenses.length}
          sub="this month"
          color="text-amber-400"
        />
      </div>

      {/* Budget progress bar */}
      <BudgetProgress
        totalSpent={totalSpent}
        budget={budget}
        budgetPct={budgetPct}
      />

      {/* Charts row */}
      <div className="grid grid-cols-2 gap-4 mb-4">
      {/* <div className="grid grid-cols-2 xl:grid-cols-3 gap-4 mb-4"> */}
        <div className="bg-white/[0.04] border border-white/[0.08] rounded-2xl p-4">
          <p className="text-[12px] font-medium text-white/60 mb-3">
            Category Breakdown
          </p>
          <DonutChart data={categoryBreakdown} />
        </div>

        <div className="bg-white/[0.04] border border-white/[0.08] rounded-2xl p-4">
          <p className="text-[12px] font-medium text-white/60 mb-1">
            Monthly Trend
          </p>
          <TrendBarChart data={MONTHLY_TREND} />
        </div>
      </div>

      {/* Recent expenses */}
      <div className="bg-white/[0.04] border border-white/[0.08] rounded-2xl p-3">
        <p className="text-[12px] font-medium text-white/60 mb-2 px-1">
          Recent Expenses
        </p>
        {expenses.slice(0, 5).map((e) => (
          <ExpenseRow key={e.id} expense={e} totalSpent={totalSpent} />
        ))}
      </div>
    </div>
  );
}
