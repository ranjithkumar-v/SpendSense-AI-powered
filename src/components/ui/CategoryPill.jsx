import { CATEGORIES, CAT_COLORS, CAT_ICONS } from "../../constants/data";

export function CategoryPill({ category, active, onClick }) {
  const color = CAT_COLORS[category];
  return (
    <button
      onClick={onClick}
      style={
        active && category !== "All"
          ? {
              background: `${color}22`,
              borderColor: `${color}88`,
              color: color,
            }
          : {}
      }
      className={`shrink-0 px-3 py-1 rounded-full text-[11px] font-medium border transition-all duration-200 cursor-pointer ${
        active && category === "All"
          ? "bg-indigo-500/20 border-indigo-500/50 text-indigo-400"
          : !active
          ? "bg-white/[0.04] border-white/[0.08] text-white/40 hover:bg-white/[0.08] hover:text-white/60"
          : ""
      }`}
    >
      {category === "All" ? "All" : `${CAT_ICONS[category]} ${category}`}
    </button>
  );
}

export function CategoryFilterBar({ active, onChange }) {
  return (
    <div className="flex gap-2 overflow-x-auto pb-2 mb-4 no-scrollbar">
      {["All", ...CATEGORIES].map((cat) => (
        <CategoryPill
          key={cat}
          category={cat}
          active={active === cat}
          onClick={() => onChange(cat)}
        />
      ))}
    </div>
  );
}
