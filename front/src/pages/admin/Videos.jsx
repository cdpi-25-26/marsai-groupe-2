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
import { useEffect, useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  getCategories,
  getVideos,
  deleteMovie,
  updateMovieCategories,
  updateMovieJuries,
  updateMovieStatus
} from "../../api/videos.js";
import { getUsers } from "../../api/users.js";
import { MediaPlayer, MediaProvider } from "@vidstack/react";
import { defaultLayoutIcons, DefaultVideoLayout } from "@vidstack/react/player/layouts/default";
import "@vidstack/react/player/styles/default/theme.css";
import "@vidstack/react/player/styles/default/layouts/video.css";

/**
 * Fonction Videos
 * Récupère la liste de toutes les vidéos via l'API
 * Gère les états de chargement, succès et erreur
 * @returns {JSX.Element} Le contenu de la page selon l'état
 */
function Videos() {
  const queryClient = useQueryClient();
  // Utilisation de TanStack Query pour gérer les données et les états de requête
  const { isPending, isError, data, error } = useQuery({
    queryKey: ["listVideos"],
    queryFn: getVideos,
  });

  const { data: categoriesData } = useQuery({
    queryKey: ["categories"],
    queryFn: getCategories,
  });

  const { data: usersData } = useQuery({
    queryKey: ["users"],
    queryFn: getUsers,
  });

  const categories = categoriesData?.data || [];
  const juries = useMemo(
    () => (usersData?.data || []).filter((user) => user.role === "JURY"),
    [usersData]
  );

  const [categorySelection, setCategorySelection] = useState({});
  const [jurySelection, setJurySelection] = useState({});

  useEffect(() => {
    if (!data?.data) return;
    const initialCategories = {};
    const initialJuries = {};

    data.data.forEach((movie) => {
      initialCategories[movie.id_movie] = (movie.Categories || []).map(
        (category) => category.id_categorie
      );
      initialJuries[movie.id_movie] = (movie.Juries || []).map(
        (jury) => jury.id_user
      );
    });

    setCategorySelection(initialCategories);
    setJurySelection(initialJuries);
  }, [data]);

  const statusMutation = useMutation({
    mutationFn: ({ id, status }) => updateMovieStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["listVideos"] });
    }
  });

  const categoryMutation = useMutation({
    mutationFn: ({ id, categories }) => updateMovieCategories(id, categories),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["listVideos"] });
    }
  });

  const juryMutation = useMutation({
    mutationFn: ({ id, juryIds }) => updateMovieJuries(id, juryIds),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["listVideos"] });
    }
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => deleteMovie(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["listVideos"] });
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
              </div>

              <div className="mt-4 flex flex-wrap gap-3">
                {movie.trailer && (
                  <a
                    className="text-[#AD46FF] hover:text-[#F6339A] font-semibold"
                    href={`${uploadBase}/${movie.trailer}`}
                    target="_blank"
                    rel="noreferrer"
                  >
                    Ouvrir la vidéo
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
                    <MediaPlayer
                      className="mt-3 w-full rounded-lg aspect-video bg-black"
                      title={movie.title}
                      src={{
                        src: `${uploadBase}/${movie.trailer}`,
                        type: "video/mp4"
                      }}
                    >
                      <MediaProvider />
                      <DefaultVideoLayout icons={defaultLayoutIcons} />
                    </MediaPlayer>
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
                <button
                  type="button"
                  onClick={() => {
                    if (window.confirm("Supprimer définitivement ce film ?")) {
                      deleteMutation.mutate(movie.id_movie);
                    }
                  }}
                  className="px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700"
                >
                  Supprimer
                </button>
              </div>

              <div className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div>
                  <h4 className="text-sm uppercase text-gray-400 mb-3">Catégories</h4>
                  {categories.length === 0 ? (
                    <p className="text-gray-500 text-sm">Aucune catégorie disponible.</p>
                  ) : (
                    <div className="grid grid-cols-2 gap-2 text-sm text-gray-300">
                      {categories.map((category) => {
                        const selected = (categorySelection[movie.id_movie] || []).includes(category.id_categorie);
                        return (
                          <label key={`${movie.id_movie}-cat-${category.id_categorie}`} className="flex items-center gap-2">
                            <input
                              type="checkbox"
                              checked={selected}
                              onChange={() => {
                                setCategorySelection((prev) => {
                                  const current = prev[movie.id_movie] || [];
                                  const exists = current.includes(category.id_categorie);
                                  const next = exists
                                    ? current.filter((id) => id !== category.id_categorie)
                                    : [...current, category.id_categorie];
                                  return { ...prev, [movie.id_movie]: next };
                                });
                              }}
                              className="accent-[#AD46FF]"
                            />
                            {category.name}
                          </label>
                        );
                      })}
                    </div>
                  )}
                  <button
                    type="button"
                    onClick={() => categoryMutation.mutate({
                      id: movie.id_movie,
                      categories: categorySelection[movie.id_movie] || []
                    })}
                    className="mt-3 px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700"
                  >
                    Enregistrer catégories
                  </button>
                </div>

                <div>
                  <h4 className="text-sm uppercase text-gray-400 mb-3">Assigner jurys</h4>
                  {juries.length === 0 ? (
                    <p className="text-gray-500 text-sm">Aucun jury disponible.</p>
                  ) : (
                    <div className="grid grid-cols-2 gap-2 text-sm text-gray-300">
                      {juries.map((jury) => {
                        const selected = (jurySelection[movie.id_movie] || []).includes(jury.id_user);
                        return (
                          <label key={`${movie.id_movie}-jury-${jury.id_user}`} className="flex items-center gap-2">
                            <input
                              type="checkbox"
                              checked={selected}
                              onChange={() => {
                                setJurySelection((prev) => {
                                  const current = prev[movie.id_movie] || [];
                                  const exists = current.includes(jury.id_user);
                                  const next = exists
                                    ? current.filter((id) => id !== jury.id_user)
                                    : [...current, jury.id_user];
                                  return { ...prev, [movie.id_movie]: next };
                                });
                              }}
                              className="accent-[#AD46FF]"
                            />
                            {jury.first_name} {jury.last_name}
                          </label>
                        );
                      })}
                    </div>
                  )}
                  <button
                    type="button"
                    onClick={() => juryMutation.mutate({
                      id: movie.id_movie,
                      juryIds: jurySelection[movie.id_movie] || []
                    })}
                    className="mt-3 px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700"
                  >
                    Enregistrer jurys
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
