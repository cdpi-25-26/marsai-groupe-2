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
    <>
      <Users />
    </>
  );
}

export default Dashboard;
