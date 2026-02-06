// import Users from "./Users.jsx";
// import Videos from "./Videos.jsx";

// /**
//  * Composant Dashboard (Tableau de bord Admin)
//  * Page principale pour les administrateurs
//  * Affiche: Gestion des utilisateurs, Gestion des vidéos
//  * @returns {JSX.Element} Le dashboard avec les composants admin
//  */
// function Dashboard() {
//   return (
//     <>
//       <Users />
//     </>
//   );
// }

// export default Dashboard;


// import { useState } from "react";
// import { useQuery } from "@tanstack/react-query";

// // import dashboardApi from "../../api/dashboard";
// import { getUsers } from "../../api/users";

// // 🔹 Old admin modules
// import Users from "./Users.jsx";
// import Videos from "./Videos.jsx";

// /**
//  * Dashboard Admin - Hybrid Version
//  * Combines MarsAI analytics + legacy admin modules
//  */
// export default function Dashboard() {
//   const [timeRange, setTimeRange] = useState("7 derniers jours");

//   /**
//    * ==============================
//    * Fetch Stats
//    * ==============================
//    */
//   const { data: stats, isLoading } = useQuery({
//     queryKey: ["adminStats"],
//     queryFn: async () => {
//       try {
//         const res = await dashboardApi.getAdminStats();
//         return res.data;
//       } catch {
//         // Mock fallback
//         return {
//           filmsEvalues: 482,
//           progressionJury: 80.3,
//           jugesQuota: { current: 8, total: 12 },
//           paysRepresentes: 124,
//           topZone: "EUROPE",
//           tauxOccupation: 86,
//           comptesActifs: 182,
//           nouveauxAujourdhui: 8,
//         };
//       }
//     },
//   });

//   /**
//    * Fetch Users Count
//    */
//   const { data: users } = useQuery({
//     queryKey: ["users"],
//     queryFn: getUsers,
//   });

//   /**
//    * Mock chart data
//    */
//   const votesTrend = [
//     { day: "Lun", votes: 45 },
//     { day: "Mar", votes: 52 },
//     { day: "Mer", votes: 49 },
//     { day: "Jeu", votes: 63 },
//     { day: "Ven", votes: 58 },
//     { day: "Sam", votes: 72 },
//     { day: "Dim", votes: 89 },
//   ];

//   if (isLoading) {
//     return (
//       <div className="flex items-center justify-center h-full">
//         Chargement...
//       </div>
//     );
//   }

//   return (
//     <div className="space-y-10">
//       {/* ================= HERO ================= */}
//       <div className="relative bg-gradient-to-r from-blue-900 via-indigo-900 to-purple-900 rounded-2xl h-56 flex items-center justify-center">
//         <div className="text-center space-y-3">
//           <div className="text-5xl">🚀</div>
//           <h1 className="text-3xl font-bold">Vue d'ensemble</h1>
//           <p className="text-neutral-300">
//             Indicateurs globaux du festival
//           </p>
//         </div>
//       </div>

//       {/* ================= STATS ================= */}
//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
//         <StatCard
//           icon="🎬"
//           label="Films évalués"
//           value={stats.filmsEvalues}
//           subtitle="Progression jury"
//           progress={stats.progressionJury}
//         />

//         <StatCard
//           icon="⭐"
//           label="Juges quota"
//           value={`${stats.jugesQuota.current}/${stats.jugesQuota.total}`}
//           subtitle="Quota complété"
//         />

//         <StatCard
//           icon="🌍"
//           label="Pays"
//           value={stats.paysRepresentes}
//           subtitle={`Top zone: ${stats.topZone}`}
//         />

//         <StatCard
//           icon="👥"
//           label="Comptes actifs"
//           value={stats.comptesActifs}
//           subtitle={`+${stats.nouveauxAujourdhui} aujourd’hui`}
//         />
//       </div>

//       {/* ================= CHART ================= */}
//       <div className="bg-neutral-900 rounded-2xl p-6 border border-neutral-800">
//         <div className="flex justify-between mb-4">
//           <h3 className="font-semibold">Votes</h3>

//           <select
//             value={timeRange}
//             onChange={(e) => setTimeRange(e.target.value)}
//             className="bg-neutral-800 px-3 py-1 rounded"
//           >
//             <option>7 derniers jours</option>
//             <option>30 derniers jours</option>
//           </select>
//         </div>

//         <div className="flex items-end space-x-4 h-40">
//           {votesTrend.map((d, i) => (
//             <div key={i} className="flex flex-col items-center flex-1">
//               <div
//                 className="bg-blue-600 w-full rounded-t"
//                 style={{ height: `${d.votes * 2}px` }}
//               />
//               <span className="text-xs mt-2 text-neutral-400">
//                 {d.day}
//               </span>
//             </div>
//           ))}
//         </div>
//       </div>

//       {/* ================= ADMIN MODULES ================= */}

//       {/* Users Management */}
//       <section className="space-y-4">
//         <h2 className="text-xl font-bold">Gestion des utilisateurs</h2>

//         <div className="bg-neutral-900 rounded-2xl p-6 border border-neutral-800">
//           <Users />
//         </div>
//       </section>

//       {/* Videos Management */}
//       <section className="space-y-4">
//         <h2 className="text-xl font-bold">Gestion des vidéos</h2>

//         <div className="bg-neutral-900 rounded-2xl p-6 border border-neutral-800">
//           <Videos />
//         </div>
//       </section>
//     </div>
//   );
// }

// /**
//  * Reusable Stat Card
//  */
// function StatCard({ icon, label, value, subtitle, progress }) {
//   return (
//     <div className="bg-neutral-900 rounded-2xl p-6 border border-neutral-800">
//       <div className="flex justify-between mb-3">
//         <span className="text-2xl">{icon}</span>
//         <span className="text-xs text-neutral-400 uppercase">
//           {label}
//         </span>
//       </div>

//       <div className="space-y-2">
//         <p className="text-3xl font-bold">{value}</p>
//         <p className="text-sm text-neutral-400">{subtitle}</p>

//         {progress !== undefined && (
//           <div className="w-full bg-neutral-800 h-2 rounded-full">
//             <div
//               className="bg-blue-600 h-2 rounded-full"
//               style={{ width: `${progress}%` }}
//             />
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }



import { useQuery } from "@tanstack/react-query";
// import dashboardApi from "../../api/dashboard";
import { getUsers } from "../../api/users";

import DashboardHero from "../../components/admin/DashboardHero.jsx";
import StatsGrid from "../../components/admin/StatsGrid.jsx";
import VotesChart from "../../components/admin/VotesChart.jsx";
import Users from "./Users.jsx";
import Videos from "./Videos.jsx";

export default function Dashboard() {
  const { data: stats, isLoading } = useQuery({
    queryKey: ["adminStats"],
    queryFn: async () => {
      const res = await dashboardApi.getAdminStats();
      return res.data;
    },
  });

  const { data: users } = useQuery({
    queryKey: ["users"],
    queryFn: getUsers,
  });

  if (isLoading) return <div>Chargement...</div>;

  return (
    <div className="space-y-10">
      <DashboardHero />
      <StatsGrid stats={stats} />
      <VotesChart />

      <Users users={users} />
      <Videos />
    </div>
  );
}
