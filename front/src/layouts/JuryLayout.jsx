import { Outlet, useNavigate } from "react-router";
import Navbar from "../components/Navbar";

/**
 * JuryLayout (Layout Jury)
 * Template pour les pages du jury d'évaluation des films
 * Contient: Navbar, bouton logout
 * Accessible uniquement par les membres du jury
 * @returns {JSX.Element} Layout avec Navbar et Outlet pour les pages enfants
 */
export default function JuryLayout() {
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
    window.location.href = "/auth/login";
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
    </div>
  );
}
