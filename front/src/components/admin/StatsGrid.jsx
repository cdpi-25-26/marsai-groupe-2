/** English */

// import StatCard from "./StatCard";

// export default function StatsGrid({ stats }) {
//   if (!stats) {
//     return (
//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
//         {[1, 2, 3, 4].map(i => (
//           <div
//             key={i}
//             className="
//               bg-white/5
//               backdrop-blur-xl
//               border border-white/10
//               rounded-xl p-4
//               shadow-lg shadow-black/20
//               animate-pulse
//             "
//           >
//             <div className="h-16"></div>
//           </div>
//         ))}
//       </div>
//     );
//   }

//   return (
//     <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
//       <StatCard
//         icon="👥"
//         label="Total Users"
//         value={stats.users?.total || 0}
//         subtitle={`${stats.users?.newToday || 0} new today`}
//         details={`${stats.users?.jury || 0} jury members`}
//       />

//       <StatCard
//         icon="🎬"
//         label="Total Films"
//         value={stats.movies?.total || 0}
//         subtitle={`${stats.movies?.evaluated || 0} evaluated`}
//         details={`${stats.movies?.selected || 0} selected`}
//       />

//       <StatCard
//         icon="⭐"
//         label="Total Votes"
//         value={stats.votes?.total || 0}
//         subtitle="Cast by jury"
//         details={
//           stats.votes?.total > 0
//             ? `Avg: ${(stats.votes.total / (stats.movies?.total || 1)).toFixed(1)}/film`
//             : "No votes yet"
//         }
//       />

//       <StatCard
//         icon="🏆"
//         label="Awards"
//         value={stats.awards?.assigned || 0}
//         subtitle={`of ${stats.awards?.total || 0} total`}
//         details={
//           stats.awards?.pending > 0
//             ? `${stats.awards.pending} pending`
//             : "All assigned"
//         }
//       />
//     </div>
//   );
// }

import StatCard from "./StatCard";

export default function StatsGrid({ stats }) {
  /* ===============================
     LOADING STATE
  =============================== */
  if (!stats) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="
              bg-white/5 
              backdrop-blur-xl 
              border border-white/10 
              rounded-xl p-4 
              shadow-lg shadow-black/20 
              animate-pulse
            "
          >
            <div className="h-16"></div>
          </div>
        ))}
      </div>
    );
  }

  /* ===============================
     STATS GRID
  =============================== */
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* Utilisateurs */}
      <StatCard
        icon="👥"
        label="Utilisateurs totaux"
        value={stats.users?.total || 0}
        subtitle={`${stats.users?.newToday || 0} nouveaux aujourd’hui`}
        details={`${stats.users?.jury || 0} membres du jury`}
      />

      {/* Films */}
      <StatCard
        icon="🎬"
        label="Films totaux"
        value={stats.movies?.total || 0}
        subtitle={`${stats.movies?.evaluated || 0} évalués`}
        details={`${stats.movies?.selected || 0} sélectionnés`}
      />

      {/* Votes */}
      <StatCard
        icon="⭐"
        label="Votes totaux"
        value={stats.votes?.total || 0}
        subtitle="Attribués par le jury"
        details={
          stats.votes?.total > 0
            ? `Moy. : ${(
                stats.votes.total / (stats.movies?.total || 1)
              ).toFixed(1)} / film`
            : "Aucun vote pour le moment"
        }
      />

      {/* Récompenses */}
      <StatCard
        icon="🏆"
        label="Récompenses"
        value={stats.awards?.assigned || 0}
        subtitle={`sur ${stats.awards?.total || 0} au total`}
        details={
          stats.awards?.pending > 0
            ? `${stats.awards.pending} en attente`
            : "Toutes attribuées"
        }
      />
    </div>
  );
}
