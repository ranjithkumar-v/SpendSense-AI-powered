export function Header({ onAddExpense, addOpen }) {
  return (
    <header className="flex items-center justify-between mb-6 pt-2">
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center text-lg shadow-lg shadow-indigo-500/20">
          💰
        </div>
        <div>
          <h1 className="text-[17px] font-bold text-white tracking-tight leading-none">
            SpendSense
          </h1>
          <p className="text-[10px] text-white/30 mt-0.5">AI Expense Tracker</p>
        </div>
      </div>

      <button
        onClick={onAddExpense}
        className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200 cursor-pointer ${
          addOpen
            ? "bg-white/[0.06] border border-white/10 text-white/50 hover:text-white/70"
            : "bg-gradient-to-r from-indigo-500 to-violet-600 text-white shadow-lg shadow-indigo-500/25 hover:scale-[1.03] hover:shadow-indigo-500/40"
        }`}
      >
        <span className="text-base leading-none">{addOpen ? "×" : "+"}</span>
        {addOpen ? "Cancel" : "Add Expense"}
      </button>
    </header>
  );
}
