export default function VoteDistribution({ distribution, total }) {
  const yes = distribution?.yes || 0;
  const no = distribution?.no || 0;
  const toDiscuss = distribution?.toDiscuss || 0;

  const pct = (n) => total > 0 ? Math.round((n / total) * 100) : 0;

  const items = [
    { label: "YES", count: yes, pct: pct(yes), color: "from-green-500 to-emerald-400", text: "text-green-400", bg: "bg-green-500/10 border-green-500/20" },
    { label: "NO", count: no, pct: pct(no), color: "from-red-500 to-rose-400", text: "text-red-400", bg: "bg-red-500/10 border-red-500/20" },
    { label: "TO DISCUSS", count: toDiscuss, pct: pct(toDiscuss), color: "from-yellow-500 to-amber-400", text: "text-yellow-400", bg: "bg-yellow-500/10 border-yellow-500/20" },
  ];

  return (
    <div
      className="
        group
        relative
        bg-gradient-to-br from-white/[0.07] to-white/[0.02]
        backdrop-blur-2xl
        border border-white/10 hover:border-blue-500/30
        rounded-xl sm:rounded-2xl
        p-4 sm:p-6
        shadow-2xl shadow-black/40
        hover:shadow-3xl hover:shadow-blue-500/20
        transition-all duration-500
        overflow-hidden
        h-full
      "
    >
      {/* Shine */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />

      {/* Header */}
      <div className="relative flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6">
        <div className="relative w-6 h-6 sm:w-8 sm:h-8 rounded-lg bg-gradient-to-br from-blue-500/20 to-purple-500/20 border border-white/10 flex items-center justify-center">
          <svg className="w-3 h-3 sm:w-4 sm:h-4 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <div>
          <h3 className="text-sm sm:text-base font-light bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent">
            Répartition des votes
          </h3>
          <p className="text-[9px] sm:text-[10px] text-white/40 mt-0.5">{total} votes au total</p>
        </div>
      </div>

      {/* Empty state */}
      {total === 0 ? (
        <div className="flex flex-col items-center justify-center h-32 gap-3">
          <span className="text-3xl opacity-30">🗳️</span>
          <p className="text-xs text-white/30">Aucun vote pour le moment</p>
        </div>
      ) : (
        <div className="relative space-y-4">
          {items.map((item) => (
            <div key={item.label} className="space-y-1.5">
              <div className="flex justify-between items-center">
                <span className={`text-[10px] sm:text-xs font-mono font-medium ${item.text}`}>
                  {item.label}
                </span>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] sm:text-xs text-white/60">{item.count}</span>
                  <span className={`text-[9px] sm:text-[10px] px-1.5 py-0.5 rounded border ${item.bg} ${item.text} font-mono`}>
                    {item.pct}%
                  </span>
                </div>
              </div>
              <div className="w-full bg-white/5 h-1.5 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full bg-gradient-to-r ${item.color} transition-all duration-700`}
                  style={{ width: `${item.pct}%` }}
                />
              </div>
            </div>
          ))}

          {/* Jury participation */}
        </div>
      )}

      {/* Decorative */}
      <div className="absolute top-0 right-0 w-16 h-16 overflow-hidden opacity-5">
        <div className="absolute top-0 right-0 w-8 h-8 bg-gradient-to-br from-blue-500/30 to-purple-500/30 rounded-full blur-2xl" />
      </div>
    </div>
  );
}