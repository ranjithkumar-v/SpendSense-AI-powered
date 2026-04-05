import { useState } from "react";
import { BUDGET_PRESETS, CAT_COLORS, CAT_ICONS } from "../../constants/data";
import { formatINR } from "../../constants/utils";

export function Budget({ budget, setBudget, budgetPct, categoryBreakdown, alerts, totalSpent }) {
  const [input, setInput] = useState(String(budget));

  const handleSet = () => {
    const val = Number(input);
    if (val > 0) setBudget(val);
  };

  const inputCls =
    "w-full bg-white/[0.06] border border-white/[0.10] text-slate-200 rounded-xl px-3.5 py-2.5 text-sm outline-none focus:border-indigo-500/50 focus:ring-2 focus:ring-indigo-500/10 transition-all duration-200 placeholder:text-white/20";

  return (
    <div className="animate-[slideUp_0.4s_ease] flex flex-col gap-4">
      {/* Set Budget Card */}
      <div className="bg-gradient-to-br from-indigo-500/10 to-violet-500/5 border border-indigo-500/20 rounded-2xl p-4">
        <p className="text-sm font-semibold text-white/70 mb-4">Set Monthly Budget</p>

        <div className="flex gap-2 mb-3">
          <div className="flex-1">
            <label className="block text-[10px] uppercase tracking-wider text-white/35 mb-1.5">
              Monthly Budget (₹)
            </label>
            <input
              className={inputCls}
              type="number"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onBlur={handleSet}
              onKeyDown={(e) => e.key === "Enter" && handleSet()}
            />
          </div>
          <div className="flex items-end">
            <button
              onClick={handleSet}
              className="px-4 py-2.5 bg-gradient-to-r from-indigo-500 to-violet-600 text-white text-sm font-semibold rounded-xl cursor-pointer hover:opacity-90 transition-all duration-200 shadow-lg shadow-indigo-500/20"
            >
              Set
            </button>
          </div>
        </div>

        {/* Presets */}
        <div className="flex gap-2 flex-wrap">
          {BUDGET_PRESETS.map((v) => (
            <button
              key={v}
              onClick={() => { setBudget(v); setInput(String(v)); }}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all duration-200 cursor-pointer ${
                budget === v
                  ? "bg-indigo-500/25 border-indigo-500/50 text-indigo-300"
                  : "bg-white/[0.04] border-white/[0.08] text-white/35 hover:text-white/60"
              }`}
            >
              {formatINR(v)}
            </button>
          ))}
        </div>
      </div>

      {/* Category Breakdown */}
      <div className="bg-white/[0.04] border border-white/[0.08] rounded-2xl p-4">
        <p className="text-sm font-semibold text-white/70 mb-4">Spending by Category</p>
        <div className="flex flex-col gap-3">
          {categoryBreakdown.map((cat) => {
            const catBudgetPct = (cat.value / budget) * 100;
            const isOver = catBudgetPct > 30;
            return (
              <div key={cat.name}>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs text-white/60">
                    {CAT_ICONS[cat.name]} {cat.name}
                  </span>
                  <div className="flex items-center gap-2">
                    <span
                      className={`text-xs font-semibold ${
                        isOver ? "text-red-400" : "text-emerald-400"
                      }`}
                    >
                      {formatINR(cat.value)}
                    </span>
                    <span className="text-[10px] text-white/25">
                      {catBudgetPct.toFixed(0)}%
                    </span>
                  </div>
                </div>
                <div className="h-1.5 bg-white/[0.07] rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-700 ease-out"
                    style={{
                      width: `${Math.min(catBudgetPct, 100)}%`,
                      background: isOver ? "#ef4444" : cat.color,
                    }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Smart Suggestions */}
      <div className="bg-white/[0.04] border border-white/[0.08] rounded-2xl p-4">
        <p className="text-sm font-semibold text-white/70 mb-3">Smart Suggestions</p>
        {alerts.length === 0 ? (
          <div className="flex items-center gap-2 text-emerald-400 text-sm py-4 justify-center">
            <span>✅</span>
            <span>Budget looks healthy — keep it up!</span>
          </div>
        ) : (
          <div className="flex flex-col gap-2">
            {alerts.map((a, i) => (
              <div
                key={i}
                className={`border rounded-xl px-3.5 py-2.5 text-sm ${
                  a.type === "danger"
                    ? "bg-red-500/10 border-red-500/25 text-red-300"
                    : a.type === "warning"
                    ? "bg-amber-500/10 border-amber-500/25 text-amber-200"
                    : "bg-indigo-500/10 border-indigo-500/25 text-indigo-200"
                }`}
              >
                {a.msg}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
