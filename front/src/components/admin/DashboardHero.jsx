export default function DashboardHero() {
  return (
    <div className="relative bg-gradient-to-r from-blue-900 via-indigo-900 to-purple-900 rounded-2xl h-56 flex items-center justify-center">
      <div className="text-center space-y-3">
        <div className="text-5xl">🚀</div>
        <h1 className="text-3xl font-bold">Vue d'ensemble</h1>
        <p className="text-neutral-300">
          Indicateurs globaux du festival
        </p>
      </div>
    </div>
  );
}
