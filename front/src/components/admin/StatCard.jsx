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
        group
        bg-gradient-to-br from-white/[0.07] to-white/[0.02]
        backdrop-blur-2xl
        border border-white/10 hover:border-blue-500/30
        rounded-xl sm:rounded-2xl p-3 sm:p-4
        shadow-2xl shadow-black/40
        hover:shadow-3xl hover:shadow-blue-500/20
        transition-all duration-500
        hover:scale-[1.02] hover:-translate-y-1
        text-white
        relative
        overflow-hidden
      "
    >
      {/* Effet de brillance au survol */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
      
      {/* Effet de lueur en arrière-plan */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 bg-gradient-to-br from-blue-500/10 via-transparent to-purple-500/10 blur-xl transition-opacity duration-700" />

      {/* Header - plus compact */}
      <div className="flex justify-between items-start mb-2 sm:mb-3">
        <div className="relative">
          <div className="absolute inset-0 bg-blue-500/30 blur-lg rounded-full scale-0 group-hover:scale-150 transition-transform duration-700" />
          <span className="relative text-lg sm:text-xl drop-shadow-lg group-hover:scale-110 transition-transform duration-300 inline-block">
            {icon}
          </span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-1 h-1 bg-green-400/60 rounded-full animate-pulse" />
          <span className="px-1.5 py-0.5 text-[8px] font-mono text-white/40 uppercase tracking-wider">
            {label}
          </span>
        </div>
      </div>

      {/* Main Value - espacement réduit */}
      <div className="space-y-2">
        <div className="flex items-end gap-1.5 flex-wrap">
          <p className="text-xl sm:text-2xl font-light bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent drop-shadow-lg">
            {value}
          </p>
          {subtitle && (
            <span className="text-[10px] text-blue-300/80 mb-0.5 font-light break-words max-w-[150px] sm:max-w-none">{subtitle}</span>
          )}
        </div>

        {details && (
          <div className="flex items-center gap-1.5 text-[10px] text-white/50 border-t border-white/5 pt-2 mt-1 flex-wrap">
            <svg className="w-3 h-3 text-blue-400/60 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
            </svg>
            <span className="break-words">{details}</span>
          </div>
        )}

        {/* Progress Bar */}
        {progress !== undefined && (
          <div className="mt-2 pt-2 border-t border-white/5">
            <div className="flex justify-between items-center mb-1">
              <span className="text-[9px] text-white/40 uppercase tracking-wider">Progression</span>
              <span className="text-[10px] font-medium text-blue-300/90">{progress}%</span>
            </div>
            <div className="relative">
              <div className="w-full bg-white/5 h-1 rounded-full overflow-hidden border border-white/5">
                <div
                  className="h-full rounded-full relative transition-all duration-700"
                  style={{ 
                    width: `${progress}%`,
                    background: 'linear-gradient(90deg, #3b82f6, #93c5fd, #3b82f6)',
                    backgroundSize: '200% 100%',
                  }}
                >
                  {/* Effet de brillance sur la barre de progression */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Badge décoratif */}
      <div className="absolute top-0 right-0 w-12 sm:w-16 h-12 sm:h-16 overflow-hidden opacity-10 group-hover:opacity-20 transition-opacity duration-500">
        <div className="absolute top-0 right-0 w-6 sm:w-8 h-6 sm:h-8 bg-gradient-to-br from-blue-500/30 to-purple-500/30 rounded-full blur-2xl" />
      </div>
    </div>
  );
}