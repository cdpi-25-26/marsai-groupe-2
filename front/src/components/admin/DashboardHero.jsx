export default function DashboardHero() {
  return (
    <div
      className="
        relative
        bg-gradient-to-br from-[#1a1c20]/60 to-[#0f1114]/60
        backdrop-blur-xl
        border border-white/10
        rounded-xl
        h-28
        flex items-center justify-center
        shadow-xl shadow-black/30
        hover:shadow-2xl hover:shadow-blue-500/10
        transition-all duration-300
      "
    >
      <div className="text-center space-y-1.5">
        <div className="text-2xl drop-shadow-sm">🚀</div>

        <h1 className="text-xl font-semibold text-white drop-shadow-sm">
          Vue d'ensemble
        </h1>

        <p className="text-xs text-white/50">
          Indicateurs globaux du festival
        </p>
      </div>
    </div>
  );
}
  
