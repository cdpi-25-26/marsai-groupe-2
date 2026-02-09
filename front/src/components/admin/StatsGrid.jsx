// import StatCard from "./StatCard.jsx";

// /**
//  * Admin Dashboard Stats Grid
//  */
// export default function StatsGrid({ stats }) {
//   /* ===============================
//      SAFETY FALLBACK
//   =============================== */
//   if (!stats) {
//     return (
//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
//         <p>Loading statistics...</p>
//       </div>
//     );
//   }

//   /* ===============================
//      DATA MAPPING
//   =============================== */
//   const data = [
//     {
//       icon: "👥",
//       label: "Utilisateurs",
//       value: stats.users?.total ?? 0,
//       subtitle: `+${stats.users?.newToday ?? 0} aujourd’hui`
//     },
//     {
//       icon: "🎬",
//       label: "Films",
//       value: stats.movies?.total ?? 0,
//       subtitle: `${stats.movies?.evaluated ?? 0} évalués`
//     },
//     {
//       icon: "🗳️",
//       label: "Votes",
//       value: stats.votes?.total ?? 0,
//       subtitle: "Total des votes"
//     },
//     {
//       icon: "🏆",
//       label: "Récompenses",
//       value: stats.awards?.assigned ?? 0,
//       subtitle: `${stats.awards?.total ?? 0} au total`
//     },
//     {
//       icon: "🎭",
//       label: "Jurys",
//       value: stats.users?.jury ?? 0,
//       subtitle: "Membres du jury"
//     },
//     {
//       icon: "📂",
//       label: "Catégories",
//       value: stats.categories?.total ?? 0,
//       subtitle: "Catégories actives"
//     }
//   ];

//   /* ===============================
//      RENDER
//   =============================== */
//   return (
//     <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
//       {data.map((stat, i) => (
//         <StatCard key={i} {...stat} />
//       ))}
//     </div>
//   );
// }



import StatCard from './StatCard';

export default function StatsGrid({ stats }) {
  // Guard clause for loading state
  if (!stats) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[1, 2, 3, 4].map(i => (
          <div key={i} className="bg-neutral-900 rounded-2xl p-6 border border-neutral-800 animate-pulse">
            <div className="h-20"></div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* Users Card */}
      <StatCard
        icon="👥"
        label="Total Users"
        value={stats.users?.total || 0}
        subtitle={`${stats.users?.newToday || 0} new today`}
        details={`${stats.users?.jury || 0} jury members`}
        // bgColor="from-blue-900 to-blue-800"
      />

      {/* Movies Card */}
      <StatCard
        icon="🎬"
        label="Total Films"
        value={stats.movies?.total || 0}
        subtitle={`${stats.movies?.evaluated || 0} evaluated`}
        details={`${stats.movies?.selected || 0} selected`}
        // bgColor="from-purple-900 to-purple-800"
      />

      {/* Votes Card */}
      <StatCard
        icon="⭐"
        label="Total Votes"
        value={stats.votes?.total || 0}
        subtitle="Cast by jury"
        details={stats.votes?.total > 0 
          ? `Avg: ${(stats.votes.total / (stats.movies?.total || 1)).toFixed(1)}/film`
          : 'No votes yet'
        }
        // bgColor="from-green-900 to-green-800"
      />

      {/* Awards Card */}
      <StatCard
        icon="🏆"
        label="Awards"
        value={stats.awards?.assigned || 0}
        subtitle={`of ${stats.awards?.total || 0} total`}
        details={stats.awards?.pending > 0 
          ? `${stats.awards.pending} pending`
          : 'All assigned'
        }
        // bgColor="from-yellow-900 to-yellow-800"
      />
    </div>
  );
}