/**
 * Composant Home (Accueil Publique)
 * Page d'accueil principale accessible à tous les utilisateurs (authentifiés ou non)
 * Affiche un message de bienvenue sur la plateforme du festival
 * @returns {JSX.Element} La page d'accueil avec le message de bienvenue
 */
import Button from "../../components/Button";
import "./Home.css";

/**
 * Fonction Home
 * Composant de la page d'accueil du festival
 * Importe le fichier CSS personnalisé Home.css pour le style
 * @returns {JSX.Element} Le contenu de la page d'accueil
 */
function Home() {
  return (
    <>
      {/* Titre de bienvenue sur la plateforme du festival */}
      Bienvenue sur la plateforme du festival !
    </>
  );
}

export default Home;
