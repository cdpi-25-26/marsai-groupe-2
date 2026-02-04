/**
 * Composant Home (Accueil Publique)
 * Page d'accueil principale accessible à tous les utilisateurs (authentifiés ou non)
 * Affiche un message de bienvenue sur la plateforme du festival
 * @returns {JSX.Element} La page d'accueil avec le message de bienvenue
 */
import { Link } from "react-router";
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
      {/* Titre de bienvenue sur la plateforme du festival 
      Bienvenue sur la plateforme du festival !
      <div className="mt-4">
        <Link to="/auth/login">
          <Button>Se connecter</Button>
        </Link>
      </div>*/}
      <div className="relative w-full h-190 overflow-hidden"> 
        <video className="absolute top-0 left-0 w-full h-full object-cover" autoPlay loop muted playsInline > 
          <source src="./src/assets/videos/accueil_marsai.mp4" type="video/mp4" /> </video>

          {/* overlay sombre */} 
          <div className="absolute inset-0 bg-black/40 z-5"></div>
          </div>
    </>
  );
}

export default Home;
