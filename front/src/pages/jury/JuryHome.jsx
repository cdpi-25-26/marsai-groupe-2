export default function JuryHome() {
  const username = localStorage.getItem("username");
  return (
    <div>
      <h1 className="text-2xl font-bold">Bienvenue Jury {username}</h1>
      <p>Voici votre espace réservé. Ici, vous pourrez voir les vidéos à évaluer ou d'autres fonctionnalités dédiées au jury.</p>
    </div>
  );
}
