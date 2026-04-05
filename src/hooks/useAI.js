// import { useState, useCallback } from "react";
// import { CATEGORIES } from "../constants/data";
// import { formatINR } from "../constants/utils";

// const API_URL = "https://api.anthropic.com/v1/messages";
// const MODEL = "claude-sonnet-4-20250514";

// async function callClaude(prompt, maxTokens = 100) {
//   const res = await fetch(API_URL, {
//     method: "POST",
//     headers: { "Content-Type": "application/json" },
//     body: JSON.stringify({
//       model: MODEL,
//       max_tokens: maxTokens,
//       messages: [{ role: "user", content: prompt }],
//     }),
//   });
//   const data = await res.json();
//   return data.content?.[0]?.text?.trim() ?? "";
// }

// export function useAI() {
//   const [categorizing, setCategorizing] = useState(false);
//   const [insightsLoading, setInsightsLoading] = useState(false);
//   const [insights, setInsights] = useState([]);

//   const categorize = useCallback(async (description) => {
//     if (!description || description.length < 3) return "";
//     setCategorizing(true);
//     try {
//       const prompt = `Categorize this expense for an Indian user into exactly one of these categories: ${CATEGORIES.join(
//         ", "
//       )}. Expense: "${description}". Reply with ONLY the category name, nothing else.`;
//       const result = await callClaude(prompt, 20);
//       return CATEGORIES.includes(result) ? result : "Other";
//     } catch {
//       return "Other";
//     } finally {
//       setCategorizing(false);
//     }
//   }, []);

//   const generateInsights = useCallback(
//     async ({ budget, totalSpent, remaining, categoryBreakdown }) => {
//       setInsightsLoading(true);
//       try {
//         const summary = categoryBreakdown
//           .map((c) => `${c.name}: ${formatINR(c.value)}`)
//           .join(", ");
//         const prompt = `You are a personal finance advisor for an Indian user. Monthly budget: ${formatINR(
//           budget
//         )}. Total spent: ${formatINR(totalSpent)}. Remaining: ${formatINR(
//           remaining
//         )}. Spending breakdown: ${summary}.

// Give exactly 3 short, actionable, specific spending insights. Reply ONLY with a JSON array, no markdown, no extra text:
// [{"icon":"emoji","insight":"text with specific ₹ amounts","type":"tip|warning|positive"}]`;

//         const raw = await callClaude(prompt, 500);
//         const clean = raw.replace(/```json|```/g, "").trim();
//         const parsed = JSON.parse(clean);
//         setInsights(parsed);
//       } catch {
//         // Graceful fallback with real data
//         setInsights([
//           {
//             icon: "📊",
//             insight: `You've used ${((totalSpent / budget) * 100).toFixed(
//               0
//             )}% of your ${formatINR(budget)} budget this month`,
//             type: "tip",
//           },
//           {
//             icon: "🍽️",
//             insight: `Food & dining is your top spend at ${formatINR(
//               categoryBreakdown[0]?.value ?? 0
//             )} — try cooking at home 2 extra days/week to save ~₹800`,
//             type: "warning",
//           },
//           {
//             icon: remaining > 0 ? "✅" : "🔴",
//             insight:
//               remaining > 0
//                 ? `Great! ${formatINR(remaining)} remaining — you're on track to finish under budget`
//                 : `You're ${formatINR(Math.abs(remaining))} over budget this month`,
//             type: remaining > 0 ? "positive" : "warning",
//           },
//         ]);
//       } finally {
//         setInsightsLoading(false);
//       }
//     },
//     []
//   );

//   return { categorize, categorizing, generateInsights, insightsLoading, insights };
// }

// Updated version with Vite proxy and error handling
import { useState, useCallback } from "react";
import { CATEGORIES } from "../constants/data";
import { formatINR } from "../constants/utils";

// Vite proxy rewrites /api/claude → https://api.anthropic.com/v1/messages
// See vite.config.js → server.proxy
const API_URL = "/api/claude";
const API_KEY = import.meta.env.VITE_ANTHROPIC_API_KEY;
const MODEL = "claude-sonnet-4-20250514";

// ─── Core fetch wrapper ────────────────────────────────────────────────────────

async function callClaude(prompt, maxTokens = 100) {
  const res = await fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": API_KEY,
      "anthropic-version": "2023-06-01",
      "anthropic-dangerous-direct-browser-access": "true",
    },
    body: JSON.stringify({
      model: MODEL,
      max_tokens: maxTokens,
      messages: [{ role: "user", content: prompt }],
    }),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err?.error?.message ?? `HTTP ${res.status}`);
  }

  const data = await res.json();
  return data.content?.[0]?.text?.trim() ?? "";
}

// ─── Prompt builders ───────────────────────────────────────────────────────────

function buildCategorizePrompt(description) {
  return `Categorize this expense for an Indian user into exactly one of these categories: ${CATEGORIES.join(
    ", ",
  )}. Expense: "${description}". Reply with ONLY the category name, nothing else.`;
}

function buildInsightsPrompt({
  budget,
  totalSpent,
  remaining,
  categoryBreakdown,
}) {
  const summary = categoryBreakdown
    .map((c) => `${c.name}: ${formatINR(c.value)}`)
    .join(", ");

  return `You are a personal finance advisor for an Indian user.
Monthly budget: ${formatINR(budget)}.
Total spent: ${formatINR(totalSpent)}.
Remaining: ${formatINR(remaining)}.
Spending breakdown: ${summary}.

Give exactly 3 short, actionable, specific spending insights.
Reply ONLY with a JSON array — no markdown, no extra text:
[{"icon":"emoji","insight":"text with specific ₹ amounts","type":"tip|warning|positive"}]`;
}

// ─── Fallback insights (used when API call fails) ──────────────────────────────

function getFallbackInsights({
  budget,
  totalSpent,
  remaining,
  categoryBreakdown,
}) {
  const topCat = categoryBreakdown[0];
  return [
    {
      icon: "📊",
      insight: `You've used ${((totalSpent / budget) * 100).toFixed(0)}% of your ${formatINR(budget)} budget this month`,
      type: "tip",
    },
    {
      icon: topCat ? "🛍️" : "💳",
      insight: topCat
        ? `${topCat.name} is your top spend at ${formatINR(topCat.value)} — see if you can trim it next month`
        : "Track your categories to spot where you can cut back",
      type: "warning",
    },
    {
      icon: remaining > 0 ? "✅" : "🔴",
      insight:
        remaining > 0
          ? `${formatINR(remaining)} remaining — you're on pace to finish under budget`
          : `You're ${formatINR(Math.abs(remaining))} over budget this month`,
      type: remaining > 0 ? "positive" : "warning",
    },
  ];
}

// ─── Hook ──────────────────────────────────────────────────────────────────────

export function useAI() {
  const [categorizing, setCategorizing] = useState(false);
  const [insightsLoading, setInsightsLoading] = useState(false);
  const [insights, setInsights] = useState([]);
  const [error, setError] = useState(null);

  const categorize = useCallback(async (description) => {
    if (!description || description.length < 3) return "";
    setCategorizing(true);
    setError(null);
    try {
      const prompt = buildCategorizePrompt(description);
      const result = await callClaude(prompt, 20);
      return CATEGORIES.includes(result) ? result : "Other";
    } catch (e) {
      console.error("[useAI] categorize:", e.message);
      return "Other";
    } finally {
      setCategorizing(false);
    }
  }, []);

  const generateInsights = useCallback(async (spendingData) => {
    setInsightsLoading(true);
    setError(null);
    try {
      const prompt = buildInsightsPrompt(spendingData);
      const raw = await callClaude(prompt, 500);
      const clean = raw.replace(/```json|```/g, "").trim();
      setInsights(JSON.parse(clean));
    } catch (e) {
      console.error("[useAI] generateInsights:", e.message);
      setError(e.message);
      setInsights(getFallbackInsights(spendingData));
    } finally {
      setInsightsLoading(false);
    }
  }, []);

  return {
    categorize,
    categorizing,
    generateInsights,
    insightsLoading,
    insights,
    error,
  };
}
