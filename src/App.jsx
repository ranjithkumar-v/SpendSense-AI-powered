import { useState } from "react";
import { Header } from "./components/layout/Header";
import { TabBar } from "./components/layout/TabBar";
import { AlertBanner } from "./components/ui/AlertBanner";
import { AddExpenseForm } from "./components/ui/AddExpenseForm";
import { Dashboard } from "./components/tabs/Dashboard";
import { Expenses } from "./components/tabs/Expenses";
import { Budget } from "./components/tabs/Budget";
import { Insights } from "./components/tabs/Insights";
import { useExpenses } from "./hooks/useExpenses";
import { useAI } from "./hooks/useAI";

export default function App() {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [showAddForm, setShowAddForm] = useState(false);

  const {
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
  } = useExpenses();

  const {
    categorize,
    categorizing,
    generateInsights,
    insightsLoading,
    insights,
  } = useAI();

  const handleAddExpense = (form) => {
    addExpense(form);
    setShowAddForm(false);
  };

  const handleGenerateInsights = () => {
    generateInsights({ budget, totalSpent, remaining, categoryBreakdown });
  };

  return (
    <div className="min-h-screen bg-[#0a0b0f] text-slate-200 font-sans antialiased">
      {/* Subtle ambient glow */}
      <div
        className="fixed inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 80% 50% at 50% -10%, rgba(99,102,241,0.08) 0%, transparent 70%)",
        }}
      />

      <div className="relative max-w-6xl mx-auto px-4 pb-12 pt-2">
      {/* <div className="relative w-full px-6 pb-12 pt-2"> */}
        <Header
          onAddExpense={() => setShowAddForm((p) => !p)}
          addOpen={showAddForm}
        />

        <AlertBanner alerts={alerts} />

        {showAddForm && (
          <AddExpenseForm
            onAdd={handleAddExpense}
            categorize={categorize}
            categorizing={categorizing}
          />
        )}

        <TabBar active={activeTab} onChange={setActiveTab} />

        {activeTab === "dashboard" && (
          <Dashboard
            expenses={expenses}
            totalSpent={totalSpent}
            budget={budget}
            budgetPct={budgetPct}
            remaining={remaining}
            categoryBreakdown={categoryBreakdown}
          />
        )}

        {activeTab === "expenses" && (
          <Expenses
            expenses={expenses}
            totalSpent={totalSpent}
            onRemove={removeExpense}
          />
        )}

        {activeTab === "budget" && (
          <Budget
            budget={budget}
            setBudget={setBudget}
            budgetPct={budgetPct}
            categoryBreakdown={categoryBreakdown}
            alerts={alerts}
            totalSpent={totalSpent}
          />
        )}

        {activeTab === "insights" && (
          <Insights
            insights={insights}
            insightsLoading={insightsLoading}
            onGenerateInsights={handleGenerateInsights}
            totalSpent={totalSpent}
            budget={budget}
            budgetPct={budgetPct}
            remaining={remaining}
            topCategory={topCategory}
            expenses={expenses}
          />
        )}
      </div>
    </div>
  );
}
