export default function DashboardHero() {
  return (
    <div
      className="
        group
        relative
        bg-gradient-to-br from-gray-900/80 via-gray-900/60 to-gray-950/80
        backdrop-blur-xl
        border border-white/10 hover:border-blue-500/30
        rounded-xl
        min-h-[80px] h-auto
        flex flex-col xs:flex-row items-start xs:items-center justify-between
        p-4 xs:px-6 xs:py-0
        shadow-xl shadow-black/30
        hover:shadow-2xl hover:shadow-blue-500/20
        transition-all duration-500
        hover:scale-[1.01]
        overflow-hidden
      "
    >
      {/* Effet de brillance */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />

      {/* Partie gauche - Titre */}
      <div className="relative flex items-center gap-3 mb-2 xs:mb-0">
        <div className="relative">
          <div className="absolute inset-0 bg-blue-500/30 blur-lg rounded-full scale-0 group-hover:scale-150 transition-transform duration-700" />
          <span className="relative text-xl sm:text-2xl drop-shadow-lg group-hover:scale-110 transition-transform duration-300 inline-block">
            🌐
          </span>
        </div>
        <div>
          <h1 className="text-base sm:text-lg font-semibold text-white drop-shadow-sm">
            Overview
          </h1>
          <p className="text-[10px] text-white/40 uppercase tracking-wider">
            Festival MarsAI
          </p>
        </div>
      </div>

      {/* Partie droite - Stats */}
      <div className="relative flex items-center gap-3 sm:gap-4 ml-auto">
        <div className="text-right">
          <span className="text-[10px] sm:text-xs text-white/60">Édition</span>
          <p className="text-xs sm:text-sm font-medium text-white">2026</p>
        </div>
        <div className="h-4 sm:h-8 w-px bg-white/10" />
        <div className="text-right">
          <span className="text-[10px] sm:text-xs text-white/60">Statut</span>
          <p className="text-xs sm:text-sm font-medium text-green-400">Actif</p>
        </div>
      </div>

      {/* Badge décoratif */}
      <div className="absolute top-0 right-0 w-16 sm:w-20 h-16 sm:h-20 overflow-hidden opacity-5 group-hover:opacity-10 transition-opacity duration-500">
        <div className="absolute top-0 right-0 w-8 sm:w-10 h-8 sm:h-10 bg-gradient-to-br from-blue-500/30 to-purple-500/30 rounded-full blur-2xl" />
      </div>
    </div>
  );
}