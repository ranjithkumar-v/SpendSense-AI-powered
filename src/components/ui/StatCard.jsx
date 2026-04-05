export function StatCard({ label, value, sub, color = "text-indigo-400" }) {
  return (
    <div className="bg-white/[0.04] border border-white/[0.08] rounded-2xl p-4 text-center hover:border-white/20 transition-all duration-300">
      <p className="text-[10px] uppercase tracking-widest text-white/35 mb-1.5">{label}</p>
      <p className={`text-2xl font-bold tracking-tight ${color}`}>{value}</p>
      <p className="text-[11px] text-white/30 mt-1">{sub}</p>
    </div>
  );
}
