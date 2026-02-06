import StatCard from "./StatCard.jsx";

/**
 * Admin Dashboard Stats Grid
 */
export default function StatsGrid({ stats }) {
  /* ===============================
     SAFETY FALLBACK
  =============================== */
  if (!stats) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <p>Loading statistics...</p>
      </div>
    );
  }

  /* ===============================
     DATA MAPPING
  =============================== */
  const data = [
    {
      icon: "👥",
      label: "Utilisateurs",
      value: stats.users?.total ?? 0,
      subtitle: `+${stats.users?.newToday ?? 0} aujourd’hui`
    },
    {
      icon: "🎬",
      label: "Films",
      value: stats.movies?.total ?? 0,
      subtitle: `${stats.movies?.evaluated ?? 0} évalués`
    },
    {
      icon: "🗳️",
      label: "Votes",
      value: stats.votes?.total ?? 0,
      subtitle: "Total des votes"
    },
    {
      icon: "🏆",
      label: "Récompenses",
      value: stats.awards?.assigned ?? 0,
      subtitle: `${stats.awards?.total ?? 0} au total`
    },
    {
      icon: "🎭",
      label: "Jurys",
      value: stats.users?.jury ?? 0,
      subtitle: "Membres du jury"
    },
    {
      icon: "📂",
      label: "Catégories",
      value: stats.categories?.total ?? 0,
      subtitle: "Catégories actives"
    }
  ];

  /* ===============================
     RENDER
  =============================== */
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {data.map((stat, i) => (
        <StatCard key={i} {...stat} />
      ))}
    </div>
  );
}
