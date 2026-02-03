
import { Outlet, useNavigate } from "react-router";
import Navbar from "../components/Navbar";

/**
 * PublicLayout (Layout Public)
 * Template pour les pages accessibles à tous
 * Contient: Navbar, bouton logout (si connecté), footer
 * Accessible par tous les utilisateurs (authentifiés ou non)
 * @returns {JSX.Element} Layout avec Navbar, Outlet et footer
 */
export default function PublicLayout() {
  const navigate = useNavigate();
  
  /**
   * Fonction de déconnexion (Logout)
   * Nettoie le localStorage et redirige vers la page de connexion
   */
  const handleLogout = () => {
    localStorage.removeItem("email");
    localStorage.removeItem("firstName");
    localStorage.removeItem("role");
    localStorage.removeItem("token");
    navigate("/auth/login");
  };
  
  // Vérifier si l'utilisateur est connecté
  const isLogged = !!localStorage.getItem("email");
  return (
    <div>
      <Navbar />
      {isLogged && (
        <button onClick={handleLogout} style={{position:'absolute',top:10,right:10}}>Se déconnecter</button>
      )}
      <main>
        <Outlet />
      </main>
      <footer>Pied de page</footer>
    </div>
  );
}
