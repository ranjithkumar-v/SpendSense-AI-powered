const TYPE_STYLES = {
  danger: "bg-red-500/10 border-red-500/30 text-red-300",
  warning: "bg-amber-500/10 border-amber-500/30 text-amber-200",
  tip: "bg-indigo-500/10 border-indigo-500/30 text-indigo-200",
};

export function AlertBanner({ alerts }) {
  if (!alerts.length) return null;
  return (
    <div className="flex flex-col gap-2 mb-4">
      {alerts.map((a, i) => (
        <div
          key={i}
          className={`border rounded-xl px-3.5 py-2.5 text-sm animate-[slideUp_0.3s_ease] ${TYPE_STYLES[a.type]}`}
        >
          {a.msg}
        </div>
      ))}
    </div>
  );
}
