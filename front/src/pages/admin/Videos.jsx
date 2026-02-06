// /**
//  * Composant Videos (Gestion des Vidéos Admin)
//  * Page administrateur pour afficher et gérer les vidéos du système
//  * Utilise TanStack Query pour la récupération et le cache des données
//  * Fonctionnalités:
//  * - Affichage d'une liste de toutes les vidéos
//  * - Gestion des états de chargement et d'erreur
//  * - Affichage du titre et description de chaque vidéo
//  * @returns {JSX.Element} La liste des vidéos ou un message d'erreur/chargement
//  */
// import { useQuery } from "@tanstack/react-query";
// import { getVideos } from "../../api/videos.js";

// /**
//  * Fonction Videos
//  * Récupère la liste de toutes les vidéos via l'API
//  * Gère les états de chargement, succès et erreur
//  * @returns {JSX.Element} Le contenu de la page selon l'état
//  */
// function Videos() {
//   // Utilisation de TanStack Query pour gérer les données et les états de requête
//   const { isPending, isError, data, error } = useQuery({
//     queryKey: ["listVideos"],
//     queryFn: getVideos,
//   });

//   // État de chargement - affiche un message en attente des données
//   if (isPending) {
//     return <div>Chargement en cours...</div>;
//   }

//   // État d'erreur - affiche le message d'erreur si la requête échoue
//   if (isError) {
//     return <div>Une erreur est survenue : {error.message}</div>;
//   }

//   // Affichage de la liste des vidéos ou message si aucune vidéo n'existe
//   return data.data.length > 0 ? (
//     data.data.map((video) => (
//       <div key={video.id}>
//         <h2>{video.title}</h2>
//         <p>{video.description}</p>
//       </div>
//     ))
//   ) : (
//     <div>Aucune vidéo trouvée.</div>
//   );
// }

// export default Videos;


import { useQuery } from "@tanstack/react-query";
import { getVideos } from "../../api/videos.js";

function Videos() {
  const { isPending, isError, data, error } = useQuery({
    queryKey: ["listVideos"],
    queryFn: getVideos,
  });

  if (isPending) {
    return <div>Chargement en cours...</div>;
  }

  if (isError) {
    return <div>Une erreur est survenue : {error.message}</div>;
  }

  const videos = data?.data || [];

  return (
    <div className="space-y-4">
      {videos.length > 0 ? (
        videos.map((video) => (
          <div
            key={video.id}
            className="p-4 border rounded-xl bg-neutral-900"
          >
            <h2 className="font-bold">{video.title}</h2>
            <p className="text-sm text-neutral-400">
              {video.description}
            </p>
          </div>
        ))
      ) : (
        <div>Aucune vidéo trouvée.</div>
      )}
    </div>
  );
}

export default Videos;
