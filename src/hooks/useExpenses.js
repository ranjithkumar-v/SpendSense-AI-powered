import { useState, useMemo, useEffect } from "react";
import { SAMPLE_EXPENSES, DEFAULT_BUDGET, CATEGORIES, CAT_COLORS } from "../constants/data";
import { formatINR } from "../constants/utils";

export function useExpenses() {
  const [expenses, setExpenses] = useState(SAMPLE_EXPENSES);
  const [budget, setBudget] = useState(DEFAULT_BUDGET);
  const [alerts, setAlerts] = useState([]);

  const totalSpent = useMemo(
    () => expenses.reduce((sum, e) => sum + e.amount, 0),
    [expenses]
  );

  const remaining = budget - totalSpent;
  const budgetPct = Math.min((totalSpent / budget) * 100, 100);

  const categoryBreakdown = useMemo(() => {
    return CATEGORIES.map((cat) => {
      const value = expenses
        .filter((e) => e.category === cat)
        .reduce((sum, e) => sum + e.amount, 0);
      return { name: cat, value, color: CAT_COLORS[cat] };
    })
      .filter((d) => d.value > 0)
      .sort((a, b) => b.value - a.value);
  }, [expenses]);

  const topCategory = categoryBreakdown[0] || null;

  const addExpense = (exp) => {
    setExpenses((prev) => [
      { ...exp, id: Date.now(), amount: Number(exp.amount) },
      ...prev,
    ]);
  };

  const removeExpense = (id) => {
    setExpenses((prev) => prev.filter((e) => e.id !== id));
  };

  // Derive smart alerts whenever expenses or budget changes
  useEffect(() => {
    const next = [];

    if (budgetPct >= 90) {
      next.push({
        type: "danger",
        msg: `🚨 Only ${formatINR(remaining)} left — ${budgetPct.toFixed(0)}% of budget used`,
      });
    } else if (budgetPct >= 75) {
      next.push({
        type: "warning",
        msg: `⚠️ Budget at ${budgetPct.toFixed(0)}% — getting close to your limit`,
      });
    }

    const foodSpend = expenses
      .filter((e) => e.category === "Food & Dining")
      .reduce((s, e) => s + e.amount, 0);
    if (foodSpend > budget * 0.3) {
      next.push({
        type: "tip",
        msg: `💡 Reduce dining by ${formatINR(foodSpend - budget * 0.2)} to stay within budget`,
      });
    }

    const shopSpend = expenses
      .filter((e) => e.category === "Shopping")
      .reduce((s, e) => s + e.amount, 0);
    if (shopSpend > budget * 0.25) {
      next.push({
        type: "tip",
        msg: `💡 Shopping is at ${((shopSpend / budget) * 100).toFixed(0)}% of your budget — consider cutting back`,
      });
    }

    setAlerts(next);
  }, [expenses, budget, budgetPct, remaining]);

  return {
    expenses,
    budget,
    setBudget,
    alerts,
    totalSpent,
    remaining,
    budgetPct,
    categoryBreakdown,
    topCategory,
    addExpense,
    removeExpense,
  };
}
