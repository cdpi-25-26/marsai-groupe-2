/**
 * Composant Home (Accueil Publique)
 * Page d'accueil principale accessible à tous les utilisateurs (authentifiés ou non)
 * Affiche un message de bienvenue sur la plateforme du festival
 * @returns {JSX.Element} La page d'accueil avec le message de bienvenue
 */
import { Link } from "react-router";
import Button from "../../components/Button";
import Hero from "../../components/home/Hero";
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
      {/* Titre de bienvenue sur la plateforme du festival 
      Bienvenue sur la plateforme du festival !
      <div className="mt-4">
        <Link to="/auth/login">
          <Button>Se connecter</Button>
        </Link>
      </div>*/}
      <Hero />
    </>
  );
}

export default Home;
