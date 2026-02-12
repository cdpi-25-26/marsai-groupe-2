
import { useQuery } from "@tanstack/react-query";
import { getAdminStats } from "../../api/dashboard";  
import { getUsers } from "../../api/users";

import DashboardHero from "../../components/admin/DashboardHero.jsx";
import StatsGrid from "../../components/admin/StatsGrid.jsx";
import VotesChart from "../../components/admin/VotesChart.jsx";
import Users from "./Users.jsx";
import Videos from "./Videos.jsx";


export default function Dashboard() {
  const { data: stats, isLoading, error } = useQuery({
    queryKey: ["adminStats"],
    queryFn: getAdminStats,  // ✅ Use it directly - simpler!
  });

  const { data: users } = useQuery({
    queryKey: ["users"],
    queryFn: getUsers,
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-400">Loading statistics...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <p className="text-red-500 text-xl mb-2">❌ Error loading dashboard</p>
          <p className="text-gray-400">{error.message}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-10">
      <DashboardHero />
      <StatsGrid stats={stats} />
      <VotesChart votesData={stats?.votes} />

      <section className="space-y-4">
        <h2 className="text-xl font-bold">Gestion des utilisateurs</h2>
        <Users users={users} />
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-bold">Gestion des vidéos</h2>
        <Videos />
      </section>
    </div>
  );
}




