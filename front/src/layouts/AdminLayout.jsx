import { Outlet, useNavigate } from "react-router";

/**
 * AdminLayout (Layout Administrateur)
 * Template pour les pages d'administration
 * Contient: navbar, barre latérale, bouton logout
 * Accessible uniquement par les administrateurs
 * @returns {JSX.Element} Layout avec Outlet pour les pages enfants
 */
export default function AdminLayout() {
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
      <div>Barre de navigation</div>
      {isLogged && (
        <button onClick={handleLogout} style={{position:'absolute',top:10,right:10}}>Logout</button>
      )}
      <aside>Barre latérale</aside>
      <main>
        <Outlet />
      </main>
    </div>
  );
}
