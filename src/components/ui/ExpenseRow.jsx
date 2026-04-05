import { CAT_COLORS, CAT_ICONS } from "../../constants/data";
import { formatINR, formatDate } from "../../constants/utils";

export function ExpenseRow({ expense, totalSpent, onRemove, showPercent = false }) {
  const { id, description, amount, category, date } = expense;
  const color = CAT_COLORS[category] ?? "#6b7280";
  const icon = CAT_ICONS[category] ?? "📦";

  return (
    <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-white/[0.05] transition-all duration-200 group cursor-default">
      <div
        className="w-9 h-9 rounded-xl flex items-center justify-center text-lg shrink-0"
        style={{ background: `${color}20` }}
      >
        {icon}
      </div>

      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-slate-200 truncate">{description}</p>
        <div className="flex items-center gap-2 mt-0.5">
          <span
            className="text-[10px] px-1.5 py-0.5 rounded-full font-medium"
            style={{ background: `${color}18`, color }}
          >
            {category}
          </span>
          <span className="text-[10px] text-white/30">{formatDate(date)}</span>
        </div>
      </div>

      <div className="text-right shrink-0">
        <p className="text-sm font-bold text-white">{formatINR(amount)}</p>
        {showPercent && totalSpent > 0 && (
          <p className="text-[10px] text-white/25">
            {((amount / totalSpent) * 100).toFixed(1)}%
          </p>
        )}
      </div>

      {onRemove && (
        <button
          onClick={() => onRemove(id)}
          className="opacity-0 group-hover:opacity-100 text-red-400/50 hover:text-red-400 border border-red-500/20 hover:border-red-500/50 rounded-md px-1.5 py-0.5 text-[10px] transition-all duration-200 shrink-0"
        >
          ✕
        </button>
      )}
    </div>
  );
}
