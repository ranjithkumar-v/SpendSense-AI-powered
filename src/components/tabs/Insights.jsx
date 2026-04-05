import { formatINR } from "../../constants/utils";
import { CAT_ICONS } from "../../constants/data";

const INSIGHT_STYLES = {
  positive: "bg-emerald-500/10 border-emerald-500/25 text-emerald-300",
  warning: "bg-amber-500/10 border-amber-500/25 text-amber-200",
  tip: "bg-indigo-500/10 border-indigo-500/25 text-indigo-200",
};

function InsightCard({ icon, insight, type, index }) {
  return (
    <div
      className={`flex gap-3 items-start border rounded-2xl p-4 ${INSIGHT_STYLES[type] ?? INSIGHT_STYLES.tip}`}
      style={{ animationDelay: `${index * 100}ms` }}
    >
      <span className="text-2xl shrink-0 mt-0.5">{icon}</span>
      <p className="text-sm leading-relaxed">{insight}</p>
    </div>
  );
}

function MetricRow({ icon, label, value, sub }) {
  return (
    <div className="flex items-center gap-3 py-2.5 border-b border-white/[0.04] last:border-0">
      <div className="w-9 h-9 rounded-xl bg-white/[0.06] flex items-center justify-center text-base shrink-0">
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-[10px] uppercase tracking-wider text-white/30 mb-0.5">{label}</p>
        <p className="text-sm font-semibold text-white leading-none">{value}</p>
      </div>
      <p className="text-[11px] text-white/30 text-right shrink-0 max-w-[120px]">{sub}</p>
    </div>
  );
}

export function Insights({
  insights,
  insightsLoading,
  onGenerateInsights,
  totalSpent,
  budget,
  budgetPct,
  remaining,
  topCategory,
  expenses,
}) {
  return (
    <div className="animate-[slideUp_0.4s_ease] flex flex-col gap-4">
      {/* Hero CTA */}
      <div className="bg-gradient-to-br from-indigo-500/10 to-violet-500/5 border border-indigo-500/20 rounded-2xl p-6 text-center">
        <div className="text-4xl mb-3">🤖</div>
        <h2 className="text-base font-semibold text-white mb-1">AI Spending Analyst</h2>
        <p className="text-xs text-white/35 mb-5 leading-relaxed max-w-xs mx-auto">
          Powered by Claude — get personalized financial insights based on your actual spending patterns
        </p>
        <button
          onClick={onGenerateInsights}
          disabled={insightsLoading}
          className="inline-flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-indigo-500 to-violet-600 text-white text-sm font-semibold rounded-xl cursor-pointer hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg shadow-indigo-500/25 hover:scale-[1.02]"
        >
          {insightsLoading ? (
            <>
              <span className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              Analysing your spending...
            </>
          ) : (
            <>✨ Generate Insights</>
          )}
        </button>
      </div>

      {/* AI Insight Cards */}
      {insights.length > 0 && (
        <div className="flex flex-col gap-3 animate-[slideUp_0.4s_ease]">
          {insights.map((ins, i) => (
            <InsightCard key={i} {...ins} index={i} />
          ))}
        </div>
      )}

      {/* Spending Patterns */}
      <div className="bg-white/[0.04] border border-white/[0.08] rounded-2xl p-4">
        <p className="text-sm font-semibold text-white/70 mb-3">Spending Patterns</p>
        <MetricRow
          icon={topCategory ? CAT_ICONS[topCategory.name] : "📊"}
          label="Highest category"
          value={topCategory?.name ?? "—"}
          sub={topCategory ? formatINR(topCategory.value) : "—"}
        />
        <MetricRow
          icon="💳"
          label="Avg per transaction"
          value={formatINR(totalSpent / Math.max(expenses.length, 1))}
          sub={`${expenses.length} transactions`}
        />
        <MetricRow
          icon={budgetPct >= 75 ? "⚠️" : "✅"}
          label="Budget used"
          value={`${budgetPct.toFixed(1)}%`}
          sub={budgetPct >= 75 ? "High spending" : "On track"}
        />
        <MetricRow
          icon="📅"
          label="Days left in month"
          value="26"
          sub={`~${formatINR(Math.max(remaining, 0) / 26)}/day to stay on budget`}
        />
      </div>

      {/* MoM comparison */}
      <div className="bg-white/[0.04] border border-white/[0.08] rounded-2xl p-4">
        <p className="text-sm font-semibold text-white/70 mb-3">Month-over-Month</p>
        <div className="grid grid-cols-2 gap-3">
          {[
            { label: "vs Last Month", val: "+4.7%", positive: false },
            { label: "vs 3-month avg", val: "-8.2%", positive: true },
            { label: "Food spending", val: "+12%", positive: false },
            { label: "Transport", val: "-5%", positive: true },
          ].map((m) => (
            <div
              key={m.label}
              className="bg-white/[0.04] rounded-xl p-3"
            >
              <p className="text-[10px] text-white/30 mb-1.5">{m.label}</p>
              <p
                className={`text-xl font-bold ${
                  m.positive ? "text-emerald-400" : "text-red-400"
                }`}
              >
                {m.positive ? "↓" : "↑"} {m.val}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
