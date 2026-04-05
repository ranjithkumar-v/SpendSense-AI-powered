import { useState } from "react";
import { CATEGORIES } from "../../constants/data";
import { AIBadge } from "../ui/AIBadge";

const today = new Date().toISOString().split("T")[0];

const EMPTY = { description: "", amount: "", category: "", date: today };

export function AddExpenseForm({ onAdd, categorize, categorizing }) {
  const [form, setForm] = useState(EMPTY);

  const set = (key, val) => setForm((p) => ({ ...p, [key]: val }));

  const handleDescBlur = async () => {
    if (form.description && !form.category) {
      const cat = await categorize(form.description);
      if (cat) set("category", cat);
    }
  };

  const handleSubmit = () => {
    if (!form.description || !form.amount) return;
    onAdd(form);
    setForm(EMPTY);
  };

  const inputCls =
    "w-full bg-white/[0.06] border border-white/[0.10] text-slate-200 rounded-xl px-3.5 py-2.5 text-sm outline-none focus:border-indigo-500/50 focus:ring-2 focus:ring-indigo-500/10 transition-all duration-200 placeholder:text-white/20";

  return (
    <div className="bg-gradient-to-br from-indigo-500/10 to-violet-500/5 border border-indigo-500/20 rounded-2xl p-4 mb-4 animate-[slideUp_0.3s_ease]">
      <div className="flex items-center gap-2 mb-4">
        <span className="text-sm font-semibold text-white">New Expense</span>
        <AIBadge loading={categorizing} />
        <span className="text-[11px] text-white/25 ml-1">
          AI auto-categorizes on blur
        </span>
      </div>

      <div className="grid grid-cols-2 gap-3 mb-3">
        <div>
          <label className="block text-[10px] uppercase tracking-wider text-white/35 mb-1.5">
            Description
          </label>
          <input
            className={inputCls}
            placeholder="e.g. Swiggy dinner"
            value={form.description}
            onChange={(e) => set("description", e.target.value)}
            onBlur={handleDescBlur}
          />
        </div>
        <div>
          <label className="block text-[10px] uppercase tracking-wider text-white/35 mb-1.5">
            Amount (₹)
          </label>
          <input
            className={inputCls}
            type="number"
            placeholder="0"
            value={form.amount}
            onChange={(e) => set("amount", e.target.value)}
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 mb-4">
        <div>
          <label className="block text-[10px] uppercase tracking-wider text-white/35 mb-1.5">
            Category {categorizing && <AIBadge loading />}
          </label>
          <select
            className={`${inputCls} appearance-none cursor-pointer`}
            value={form.category}
            onChange={(e) => set("category", e.target.value)}
          >
            <option value="">Select category</option>
            {CATEGORIES.map((c) => (
              <option key={c} value={c} className="bg-[#1a1b23]">
                {c}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-[10px] uppercase tracking-wider text-white/35 mb-1.5">
            Date
          </label>
          <input
            className={inputCls}
            type="date"
            value={form.date}
            onChange={(e) => set("date", e.target.value)}
          />
        </div>
      </div>

      <button
        onClick={handleSubmit}
        disabled={!form.description || !form.amount}
        className="w-full py-2.5 bg-gradient-to-r from-indigo-500 to-violet-600 text-white text-sm font-semibold rounded-xl cursor-pointer hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-200 shadow-lg shadow-indigo-500/20"
      >
        Add Expense
      </button>
    </div>
  );
}
