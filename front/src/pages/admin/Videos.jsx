/**
 * Composant Videos (Gestion des Vidéos Admin)
 * Page administrateur pour afficher et gérer les vidéos du système
 * Utilise TanStack Query pour la récupération et le cache des données
 * Fonctionnalités:
 * - Affichage d'une liste de toutes les vidéos
 * - Gestion des états de chargement et d'erreur
 * - Affichage du titre et description de chaque vidéo
 * @returns {JSX.Element} La liste des vidéos ou un message d'erreur/chargement
 */
import { useMemo, useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { getVideos, updateMovieStatus, assignMovieJury } from "../../api/videos.js";
import { getUsers } from "../../api/users.js";

/**
 * Fonction Videos
 * Récupère la liste de toutes les vidéos via l'API
 * Gère les états de chargement, succès et erreur
 * @returns {JSX.Element} Le contenu de la page selon l'état
 */
function Videos() {
  // Utilisation de TanStack Query pour gérer les données et les états de requête
  const { isPending, isError, data, error } = useQuery({
    queryKey: ["listVideos"],
    queryFn: getVideos,
  });

  const { data: usersData } = useQuery({
    queryKey: ["listUsers"],
    queryFn: getUsers,
  });

  const juryUsers = useMemo(() => {
    return (usersData?.data || []).filter((u) => u.role === "JURY");
  }, [usersData]);

  const [selectedJury, setSelectedJury] = useState({});

  const statusMutation = useMutation({
    mutationFn: ({ id, status }) => updateMovieStatus(id, status),
    onSuccess: () => {
      // Refresh list
      window.location.reload();
    }
  });

  const assignMutation = useMutation({
    mutationFn: ({ id, juryId }) => assignMovieJury(id, juryId),
    onSuccess: () => {
      window.location.reload();
    }
  });

  const uploadBase = "http://localhost:3000/uploads";

  // État de chargement - affiche un message en attente des données
  if (isPending) {
    return <div className="text-gray-300">Chargement en cours...</div>;
  }

  // État d'erreur - affiche le message d'erreur si la requête échoue
  if (isError) {
    return <div className="text-red-300">Une erreur est survenue : {error.message}</div>;
  }

  // Affichage de la liste des vidéos ou message si aucune vidéo n'existe
  return data.data.length > 0 ? (
    <div className="space-y-6">
      {data.data.map((movie) => (
        <div key={movie.id_movie} className="bg-gray-950 border border-gray-800 rounded-xl p-6">
          <div className="flex flex-col lg:flex-row gap-6">
            <div className="flex-1">
              <h3 className="text-2xl font-bold text-white">{movie.title}</h3>
              <p className="text-gray-400 mt-2">{movie.synopsis || movie.description || "-"}</p>
              <div className="grid grid-cols-2 gap-4 mt-4 text-sm text-gray-300">
                <div><span className="text-gray-400">Durée:</span> {movie.duration ? `${movie.duration}s` : "-"}</div>
                <div><span className="text-gray-400">Langue:</span> {movie.main_language || "-"}</div>
                <div><span className="text-gray-400">Nationalité:</span> {movie.nationality || "-"}</div>
                <div><span className="text-gray-400">Statut:</span> {movie.selection_status || "submitted"}</div>
                <div><span className="text-gray-400">Producteur:</span> {movie.User ? `${movie.User.first_name} ${movie.User.last_name}` : "-"}</div>
                <div><span className="text-gray-400">Jury assigné:</span> {movie.assignedJury ? `${movie.assignedJury.first_name} ${movie.assignedJury.last_name}` : "-"}</div>
              </div>

              <div className="mt-4 flex flex-wrap gap-3">
                {movie.trailer && (
                  <a
                    className="text-[#AD46FF] hover:text-[#F6339A] font-semibold"
                    href={`${uploadBase}/${movie.trailer}`}
                    target="_blank"
                    rel="noreferrer"
                  >
                    Télécharger la vidéo
                  </a>
                )}
                {movie.youtube_link && (
                  <a
                    className="text-[#AD46FF] hover:text-[#F6339A] font-semibold"
                    href={movie.youtube_link}
                    target="_blank"
                    rel="noreferrer"
                  >
                    Voir sur YouTube
                  </a>
                )}
              </div>

              {(movie.trailer || movie.youtube_link) && (
                <details className="mt-4">
                  <summary className="cursor-pointer text-gray-300 hover:text-white">Voir la vidéo</summary>
                  {movie.trailer ? (
                    <video className="mt-3 w-full rounded-lg" controls src={`${uploadBase}/${movie.trailer}`} />
                  ) : (
                    <div className="mt-3">
                      <a className="text-[#AD46FF] hover:text-[#F6339A]" href={movie.youtube_link} target="_blank" rel="noreferrer">
                        Ouvrir la vidéo
                      </a>
                    </div>
                  )}
                </details>
              )}

              <div className="mt-6 flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={() => statusMutation.mutate({ id: movie.id_movie, status: "selected" })}
                  className="px-4 py-2 bg-green-600/80 text-white rounded-lg hover:bg-green-600"
                >
                  Approuver
                </button>
                <button
                  type="button"
                  onClick={() => statusMutation.mutate({ id: movie.id_movie, status: "refused" })}
                  className="px-4 py-2 bg-red-600/80 text-white rounded-lg hover:bg-red-600"
                >
                  Refuser
                </button>
                <div className="flex items-center gap-2">
                  <select
                    value={selectedJury[movie.id_movie] || ""}
                    onChange={(e) => setSelectedJury((prev) => ({ ...prev, [movie.id_movie]: e.target.value }))}
                    className="bg-gray-800 border border-gray-700 text-white px-3 py-2 rounded-lg"
                  >
                    <option value="">Assigner un jury</option>
                    {juryUsers.map((jury) => (
                      <option key={jury.id_user} value={jury.id_user}>
                        {jury.first_name} {jury.last_name}
                      </option>
                    ))}
                  </select>
                  <button
                    type="button"
                    onClick={() => {
                      const juryId = selectedJury[movie.id_movie];
                      if (juryId) assignMutation.mutate({ id: movie.id_movie, juryId });
                    }}
                    className="px-4 py-2 bg-blue-600/80 text-white rounded-lg hover:bg-blue-600"
                  >
                    Assigner
                  </button>
                </div>
              </div>
            </div>

            <div className="flex-1">
              <div className="grid grid-cols-2 gap-3">
                {[movie.picture1, movie.picture2, movie.picture3].filter(Boolean).map((pic, idx) => (
                  <div key={`${movie.id_movie}-pic-${idx}`} className="aspect-video bg-gray-800 rounded-lg overflow-hidden">
                    <img src={`${uploadBase}/${pic}`} alt="Vignette" className="w-full h-full object-cover" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  ) : (
    <div className="text-gray-400">Aucune vidéo trouvée.</div>
  );
}

export default Videos;
