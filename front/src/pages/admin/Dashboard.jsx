import Users from "./Users.jsx";
import Videos from "./Videos.jsx";

/**
 * Composant Dashboard (Tableau de bord Admin)
 * Page principale pour les administrateurs
 * Affiche: Gestion des utilisateurs, Gestion des vidéos
 * @returns {JSX.Element} Le dashboard avec les composants admin
 */
function Dashboard() {
  return (
    <div className="bg-black text-white">
      <Users />
      <div className="max-w-6xl mx-auto px-4 pb-20">
        <div className="bg-gray-900 rounded-2xl p-8 border border-gray-800 shadow-2xl">
          <h2 className="text-3xl font-bold mb-6">Gestion des films</h2>
          <Videos />
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
