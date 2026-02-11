export default function StatCard({ 
  icon, 
  label, 
  value, 
  subtitle, 
  details,
  progress,
}) {
  return (
    <div
      className="
        bg-gradient-to-br from-[#1a1c20]/60 to-[#0f1114]/60
        backdrop-blur-xl
        border border-white/10
        rounded-xl p-4
        shadow-xl shadow-black/30
        hover:shadow-2xl hover:shadow-blue-500/10
        transition-all duration-300
        hover:scale-[1.02]
        text-white
      "
    >
      {/* Header */}
      <div className="flex justify-between items-center mb-3">
        <span className="text-2xl drop-shadow-sm">{icon}</span>
        <span className="text-[10px] text-white/40 uppercase tracking-wide">
          {label}
        </span>
      </div>

      {/* Main Value */}
      <div className="space-y-1.5">
        <p className="text-2xl font-bold text-white drop-shadow-sm">
          {value}
        </p>

        {subtitle && (
          <p className="text-xs text-white/60">{subtitle}</p>
        )}

        {details && (
          <p className="text-[11px] text-white/40">{details}</p>
        )}

        {/* Progress Bar */}
        {progress !== undefined && (
          <div className="mt-3">
            <div className="w-full bg-white/5 h-1.5 rounded-full overflow-hidden border border-white/10">
              <div
                className="bg-gradient-to-r from-blue-500 to-blue-400 h-1.5 rounded-full transition-all duration-500"
                style={{ width: `${progress}%` }}
              />
            </div>
            <span className="text-[10px] text-white/40 mt-1 block">{progress}%</span>
          </div>
        )}
      </div>
    </div>
  );
}