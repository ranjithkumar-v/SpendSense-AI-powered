export function AIBadge({ loading = false }) {
  return (
    <span className="inline-flex items-center gap-1 bg-indigo-500/10 border border-indigo-500/30 rounded-full px-2 py-0.5 text-[10px] text-indigo-400 font-medium">
      <span
        className={`w-1.5 h-1.5 rounded-full ${
          loading
            ? "bg-amber-400 shadow-[0_0_6px_#f59e0b] animate-pulse"
            : "bg-indigo-500 shadow-[0_0_6px_#6366f1]"
        }`}
      />
      {loading ? "Thinking..." : "AI"}
    </span>
  );
}
