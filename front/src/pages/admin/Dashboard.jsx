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

import { useEffect, useState } from "react";
import dashboardApi from "../../api/dashboard";

export default function Dashboard() {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    dashboardApi
      .getAdminStats()
      .then(res => setStats(res.data))
      .catch(err => console.error(err));
  }, []);

  if (!stats) {
    return (
      <div className="flex items-center justify-center h-64 text-gray-400">
        Loading dashboard…
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Admin Dashboard</h1>

      {/* Stats cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <StatCard title="Users" value={stats.users} />
        <StatCard title="Movies" value={stats.movies} />
        <StatCard title="Jury Members" value={stats.jury} />
        <StatCard title="Votes" value={stats.votes} />
        <StatCard title="Awards" value={stats.awards} />
      </div>
    </div>
  );
}

/* Small local component */
function StatCard({ title, value }) {
  return (
    <div className="rounded-xl bg-neutral-900 p-4 text-white shadow">
      <p className="text-sm text-neutral-400">{title}</p>
      <p className="text-2xl font-semibold mt-1">{value}</p>
    </div>
  );
}
