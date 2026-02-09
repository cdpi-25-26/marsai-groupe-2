export default function DashboardHero() {
  return (
    <div className="relative
      bg-white/10
      backdrop-blur-2xl
      border border-white/20
      rounded-2xl
      h-36
      flex items-center justify-center
      shadow-xl">
      <div className="text-center space-y-3">
        <div className="text-3xl">🚀</div>
        <h1 className="text-2xl font-bold">Vue d'ensemble</h1>
        <p className="text-neutral-300">
          Indicateurs globaux du festival
        </p>
      </div>
    </div>
  );
}
