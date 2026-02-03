import { Link } from "react-router";

/**
 * Composant Navbar (Barre de navigation)
 * Affiche il logo, il messaggio di benvenuto e il pulsante di disconnessione
 * Recupera il firstName da localStorage per il saluto personalizzato
 * Barra fissa in alto in tutte le pagine
 * @returns {JSX.Element} La barra di navigazione
 */
export default function Navbar() {
  // Récupérer le prénom de l'utilisateur authentifié depuis localStorage
  const firstName = localStorage.getItem("firstName");

  /**
   * Fonction de déconnexion (Logout)
   * Nettoie tous les données de session du localStorage
   * et recharge la page pour revenir à la page de connexion
   */
  function handleLogout() {
    // Supprimer toutes les données de session
    localStorage.removeItem("email");
    localStorage.removeItem("firstName");
    localStorage.removeItem("role");
    localStorage.removeItem("token");

    // Revenir à la page d'accueil publique
    window.location.href = "/";
  }

  return (
    <nav className="sticky top-0 z-50 bg-white shadow-md py-4 px-6 flex justify-between items-center">
      <div>
        <Link to="/" className="text-xl font-semibold text-sky-600">
          MarsAI
        </Link>
      </div>
      <div>
        {firstName ? (
          <>
            <span className="mr-4">Hello, {firstName}</span>
            <button onClick={handleLogout}>Logout</button>
          </>
        ) : (
          <Link to="/auth/login">Login</Link>
        )}
      </div>
    </nav>
  );
}
