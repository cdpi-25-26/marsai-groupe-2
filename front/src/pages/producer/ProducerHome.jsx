export default function ProducerHome() {
  const username = localStorage.getItem("username");
  return (
    <div>
      <h1 className="text-2xl font-bold">Bienvenue {username}</h1>
      <p>Voici votre espace réservé. Ici, vous pourrez voir vos vidéos, statistiques ou d'autres fonctionnalités dédiées aux producteurs.</p>
    </div>
  );
}
