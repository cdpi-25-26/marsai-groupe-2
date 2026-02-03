/**
 * Composant JuryHome (Accueil Jury)
 * Page d'accueil pour les membres du jury
 * Affiche: Message de bienvenue, espace réservé pour évaluation des films
 * @returns {JSX.Element} La page d'accueil du jury
 */
export default function JuryHome() {
  const firstName = localStorage.getItem("firstName");
  return (
    <div>
      <h1 className="text-2xl font-bold">Bienvenue au jury {firstName}</h1>
      <p>Voici votre espace réservé. Ici, vous pourrez voir les vidéos à évaluer ou d'autres fonctionnalités dédiées au jury.</p>
    </div>
  );
}
