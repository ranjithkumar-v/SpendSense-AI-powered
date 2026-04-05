import { useState } from "react";
import { CategoryFilterBar } from "../ui/CategoryPill";
import { ExpenseRow } from "../ui/ExpenseRow";

export function Expenses({ expenses, totalSpent, onRemove }) {
  const [filter, setFilter] = useState("All");

  const filtered =
    filter === "All" ? expenses : expenses.filter((e) => e.category === filter);

  return (
    <div className="animate-[slideUp_0.4s_ease]">
      <CategoryFilterBar active={filter} onChange={setFilter} />

      <div className="bg-white/[0.04] border border-white/[0.08] rounded-2xl p-2">
        {filtered.length === 0 ? (
          <p className="text-center text-white/25 text-sm py-10">
            No expenses found
          </p>
        ) : (
          filtered.map((e) => (
            <ExpenseRow
              key={e.id}
              expense={e}
              totalSpent={totalSpent}
              onRemove={onRemove}
              showPercent
            />
          ))
        )}
      </div>
    </div>
  );
}
