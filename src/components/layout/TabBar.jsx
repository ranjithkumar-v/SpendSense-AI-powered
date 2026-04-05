const TABS = [
  { id: "dashboard", label: "Dashboard", icon: "📊" },
  { id: "expenses", label: "Expenses", icon: "💳" },
  { id: "budget", label: "Budget", icon: "🎯" },
  { id: "insights", label: "AI Insights", icon: "🤖" },
];

export function TabBar({ active, onChange }) {
  return (
    <nav className="flex gap-1.5 mb-5 overflow-x-auto pb-0.5 no-scrollbar">
      {TABS.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onChange(tab.id)}
          className={`shrink-0 flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-[13px] font-medium border transition-all duration-200 cursor-pointer ${
            active === tab.id
              ? "bg-indigo-500/20 border-indigo-500/40 text-indigo-300"
              : "bg-transparent border-transparent text-white/35 hover:text-white/60 hover:bg-white/[0.04]"
          }`}
        >
          <span className="text-sm">{tab.icon}</span>
          {tab.label}
        </button>
      ))}
    </nav>
  );
}
