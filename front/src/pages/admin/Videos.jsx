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
import { useEffect, useState, useMemo } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  getCategories,
  getVideos,
  updateMovie,
  updateMovieCategories,
  updateMovieJuries,
  updateMovieStatus
} from "../../api/videos.js";
import { getUsers } from "../../api/users.js";
import { getVotes } from "../../api/votes.js";
import { createAward, getAwards, deleteAward } from "../../api/awards.js";
import { VideoPreview } from "../../components/VideoPreview.jsx";

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

  const { data: votesData } = useQuery({
    queryKey: ["votes"],
    queryFn: getVotes,
  });

  const { data: awardsData } = useQuery({
    queryKey: ["awards"],
    queryFn: getAwards,
  });

  const categories = categoriesData?.data || [];
  const juries = useMemo(
    () => (usersData?.data || []).filter((user) => user.role === "JURY"),
    [usersData]
  );

  const [categorySelection, setCategorySelection] = useState({});
  const [jurySelection, setJurySelection] = useState({});
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [awardName, setAwardName] = useState("");
  const [awardMovieId, setAwardMovieId] = useState("");
  const [activeFolder, setActiveFolder] = useState(null);
  const [adminComment, setAdminComment] = useState("");

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

  useEffect(() => {
    if (!selectedMovie) return;
    setAdminComment(selectedMovie.admin_comment || "");
  }, [selectedMovie]);

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

  const updateMovieMutation = useMutation({
    mutationFn: ({ id, payload }) => updateMovie(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["listVideos"] });
    }
  });


  const awardMutation = useMutation({
    mutationFn: ({ id_movie, award_name }) => createAward(id_movie, award_name),
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: ["listVideos"] });
      queryClient.invalidateQueries({ queryKey: ["awards"] });
      setAwardName("");
      const newAward = res?.data?.newAward;
      if (newAward) {
        setSelectedMovie((prev) => {
          if (!prev || prev.id_movie !== newAward.id_movie) return prev;
          const current = prev.Awards || [];
          return { ...prev, Awards: [...current, newAward] };
        });
      }
    }
  });

  const deleteAwardMutation = useMutation({
    mutationFn: (id) => deleteAward(id),
    onSuccess: (_res, id) => {
      queryClient.invalidateQueries({ queryKey: ["listVideos"] });
      queryClient.invalidateQueries({ queryKey: ["awards"] });
      setSelectedMovie((prev) => {
        if (!prev) return prev;
        return { ...prev, Awards: (prev.Awards || []).filter((award) => award.id_award !== id) };
      });
    }
  });

  const uploadBase = "http://localhost:3000/uploads";
  const getPoster = (movie) => (
    movie.thumbnail
      ? `${uploadBase}/${movie.thumbnail}`
      : movie.display_picture
        ? `${uploadBase}/${movie.display_picture}`
        : movie.picture1
          ? `${uploadBase}/${movie.picture1}`
          : movie.picture2
            ? `${uploadBase}/${movie.picture2}`
            : movie.picture3
              ? `${uploadBase}/${movie.picture3}`
              : null
  );

  const getTrailer = (movie) => (
    movie.trailer
      || movie.trailer_video
      || movie.trailerVideo
      || movie.filmFile
      || movie.video
      || null
  );

  const votes = votesData?.data || [];
  const awards = awardsData?.data || [];

  const voteLabels = {
    YES: "Validé / J'aime / Bon 👍",
    "TO DISCUSS": "À discuter avec l'admin",
    NO: "Refusé / Je n'aime pas 👎"
  };

  const voteOrder = ["YES", "TO DISCUSS", "NO", "NONE"];

  const getVoteCategory = (note) => {
    if (note === "YES" || note === "TO DISCUSS" || note === "NO") return note;
    const value = parseFloat(note);
    if (Number.isNaN(value)) return "NONE";
    if (value >= 2.5) return "YES";
    if (value >= 1.5) return "TO DISCUSS";
    return "NO";
  };

  const awardsByMovie = useMemo(() => {
    return (data?.data || []).reduce((acc, movie) => {
      acc[movie.id_movie] = movie.Awards || [];
      return acc;
    }, {});
  }, [data]);

  const voteSummaryByMovie = useMemo(() => {
    return votes.reduce((acc, vote) => {
      if (!acc[vote.id_movie]) {
        acc[vote.id_movie] = { YES: 0, "TO DISCUSS": 0, NO: 0, votes: [], sum: 0, count: 0, average: 0 };
      }
      const category = getVoteCategory(vote.note);
      if (category !== "NONE") {
        acc[vote.id_movie][category] += 1;
      }
      const numeric = parseFloat(vote.note);
      if (!Number.isNaN(numeric)) {
        acc[vote.id_movie].sum += numeric;
        acc[vote.id_movie].count += 1;
      }
      acc[vote.id_movie].average = acc[vote.id_movie].count
        ? acc[vote.id_movie].sum / acc[vote.id_movie].count
        : 0;
      acc[vote.id_movie].votes.push(vote);
      return acc;
    }, {});
  }, [votes]);

  const getAverageCategory = (summary) => {
    if (!summary || summary.count === 0) return "NONE";
    if (summary.average >= 2.5) return "YES";
    if (summary.average >= 1.5) return "TO DISCUSS";
    return "NO";
  };

  const getScore = (summary) => {
    if (!summary || summary.count === 0) return 0;
    return summary.average;
  };

  const awardOptions = Array.from(new Set(awards.map((award) => award.award_name))).filter(Boolean);

  const filteredMovies = useMemo(() => {
    return data?.data || [];
  }, [data]);

  const groupedMovies = useMemo(() => {
    const approved = [];
    const refused = [];
    const voted = [];
    const assignJury = [];

    filteredMovies.forEach((movie) => {
      const status = movie.selection_status || "submitted";
      const summary = voteSummaryByMovie[movie.id_movie];
      const hasVotes = summary?.count > 0;
      const juriesCount = (movie.Juries || []).length;

      if (status === "selected") {
        approved.push({ movie, summary });
        return;
      }
      if (status === "refused") {
        refused.push({ movie, summary });
        return;
      }

      if (hasVotes) {
        voted.push({ movie, summary, score: getScore(summary) });
      }

      if (juriesCount === 0) {
        assignJury.push({ movie, summary });
      }
    });

    approved.sort((a, b) => (b.summary?.average || 0) - (a.summary?.average || 0));
    voted.sort((a, b) => (b.score || 0) - (a.score || 0));

    return { approved, refused, voted, assignJury };
  }, [filteredMovies, voteSummaryByMovie]);

  const reviewMovies = useMemo(() => {
    return [...groupedMovies.voted, ...groupedMovies.approved];
  }, [groupedMovies]);

  const renderVoteSummary = (summary) => {
    if (!summary) return <span className="text-xs text-gray-500">Aucun vote</span>;
    return (
      <div className="text-xs text-gray-400 flex flex-wrap gap-3">
        <span>👍 {summary.YES}</span>
        <span>🗣️ {summary["TO DISCUSS"]}</span>
        <span>👎 {summary.NO}</span>
      </div>
    );
  };

  const renderMovieCard = (movie, showActions = true) => {
    const poster = getPoster(movie);
    const summary = voteSummaryByMovie[movie.id_movie];
    const movieAwards = awardsByMovie[movie.id_movie] || [];
    const avgScore = summary ? summary.average.toFixed(1) : "-";
    
    return (
      <div key={movie.id_movie} className="bg-gray-950 border border-gray-800 rounded-lg overflow-hidden">
        <button
          type="button"
          onClick={() => setSelectedMovie(movie)}
          className="w-full text-left p-2 hover:bg-gray-900 transition flex gap-2 items-center"
        >
          <div className="w-16 h-16 flex-shrink-0 bg-gray-800 rounded overflow-hidden">
            {poster ? (
              <img src={poster} alt={movie.title} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-500 text-xs">?</div>
            )}
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-xs font-semibold text-white truncate">{movie.title}</h3>
            <div className="mt-0.5 flex items-center gap-2 text-[10px] text-gray-400">
              <span>Moy: <span className="text-white font-semibold">{avgScore}</span></span>
              <span>👍 {summary?.YES || 0}</span>
              <span>🗣️ {summary?.["TO DISCUSS"] || 0}</span>
              <span>👎 {summary?.NO || 0}</span>
            </div>
            {movieAwards.length > 0 && (
              <div className="mt-0.5 flex flex-wrap gap-1">
                {movieAwards.slice(0, 2).map((award) => (
                  <span key={`award-${award.id_award}`} className="text-[9px] bg-purple-900/40 text-purple-200 px-1 py-0.5 rounded">
                    {award.award_name}
                  </span>
                ))}
                {movieAwards.length > 2 && (
                  <span className="text-[9px] text-gray-500">+{movieAwards.length - 2}</span>
                )}
              </div>
            )}
          </div>
        </button>
        {showActions && (
          <div className="p-2 pt-0 flex gap-1.5">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                statusMutation.mutate({ id: movie.id_movie, status: "selected" });
              }}
              className="flex-1 px-2 py-1 bg-green-600/80 text-white rounded text-[10px] hover:bg-green-600"
            >
              Approuver
            </button>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                statusMutation.mutate({ id: movie.id_movie, status: "refused" });
              }}
              className="flex-1 px-2 py-1 bg-red-600/80 text-white rounded text-[10px] hover:bg-red-600"
            >
              Refuser
            </button>
          </div>
        )}
      </div>
    );
  };

  // État de chargement - affiche un message en attente des données
  if (isPending) {
    return <div className="text-gray-300">Chargement en cours...</div>;
  }

  // État d'erreur - affiche le message d'erreur si la requête échoue
  if (isError) {
    return <div className="text-red-300">Une erreur est survenue : {error.message}</div>;
  }

  // Affichage de la liste des vidéos ou message si aucune vidéo n'existe
  return (
    <div className="space-y-6">
      {filteredMovies.length > 0 ? (
        <>
          {!activeFolder ? (
            <div className="flex items-center justify-center min-h-[60vh]">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl w-full">
                <button
                  onClick={() => setActiveFolder("assign")}
                  className="bg-gray-900 rounded-2xl p-8 border-2 border-gray-800 hover:border-[#AD46FF] transition-all shadow-2xl group hover:shadow-[#AD46FF]/20"
                >
                  <div className="text-center">
                    <div className="mx-auto w-20 h-20 bg-gradient-to-br from-[#AD46FF] to-[#F6339A] rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-lg">
                      <svg className="w-10 h-10" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M2 6a2 2 0 012-2h6a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V6zM14.553 7.106A1 1 0 0014 8v4a1 1 0 00.553.894l2 1A1 1 0 0018 13V7a1 1 0 00-1.447-.894l-2 1z" />
                      </svg>
                    </div>
                    <h2 className="text-2xl font-bold text-white mb-2 group-hover:text-[#AD46FF] transition-colors">À assigner jury</h2>
                    <p className="text-gray-400 mb-4">Films soumis</p>
                    <div className="inline-block px-4 py-2 bg-gradient-to-r from-[#AD46FF] to-[#F6339A] text-white rounded-full font-bold text-xl shadow-lg">
                      {groupedMovies.assignJury.length}
                    </div>
                  </div>
                </button>

                <button
                  onClick={() => setActiveFolder("review")}
                  className="bg-gray-900 rounded-2xl p-8 border-2 border-gray-800 hover:border-[#AD46FF] transition-all shadow-2xl group hover:shadow-[#AD46FF]/20"
                >
                  <div className="text-center">
                    <div className="mx-auto w-20 h-20 bg-gradient-to-br from-purple-700 to-[#AD46FF] rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-lg">
                      <svg className="w-10 h-10" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <h2 className="text-2xl font-bold text-white mb-2 group-hover:text-[#AD46FF] transition-colors">En évaluation</h2>
                    <p className="text-gray-400 mb-4">Votés & approuvés</p>
                    <div className="inline-block px-4 py-2 bg-gradient-to-r from-purple-700 to-[#AD46FF] text-white rounded-full font-bold text-xl shadow-lg">
                      {reviewMovies.length}
                    </div>
                  </div>
                </button>

                <button
                  onClick={() => setActiveFolder("refused")}
                  className="bg-gray-900 rounded-2xl p-8 border-2 border-gray-800 hover:border-[#AD46FF] transition-all shadow-2xl group hover:shadow-[#F6339A]/20"
                >
                  <div className="text-center">
                    <div className="mx-auto w-20 h-20 bg-gradient-to-br from-[#F6339A] to-pink-700 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-lg">
                      <svg className="w-10 h-10" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    </div>
                    <h2 className="text-2xl font-bold text-white mb-2 group-hover:text-[#F6339A] transition-colors">Scartati / Refusés</h2>
                    <p className="text-gray-400 mb-4">Archivés</p>
                    <div className="inline-block px-4 py-2 bg-gradient-to-r from-[#F6339A] to-pink-700 text-white rounded-full font-bold text-xl shadow-lg">
                      {groupedMovies.refused.length}
                    </div>
                  </div>
                </button>
              </div>
            </div>
          ) : (
            <div>
              <div className="mb-6 flex items-center justify-between">
                <button
                  onClick={() => setActiveFolder(null)}
                  className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#AD46FF] to-[#F6339A] text-white rounded-lg hover:opacity-90 transition font-semibold"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                  </svg>
                  <span>Retour</span>
                </button>
                <h2 className="text-2xl font-bold text-white">
                  {activeFolder === "assign" && "Films à assigner"}
                  {activeFolder === "review" && "Films en évaluation"}
                  {activeFolder === "refused" && "Films scartati / refusés"}
                </h2>
                <div className="w-24"></div>
              </div>

              {activeFolder === "assign" && (
                groupedMovies.assignJury.length === 0 ? (
                  <p className="text-center text-gray-400 py-12">Aucun film à assigner.</p>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
                    {groupedMovies.assignJury.map(({ movie }) => renderMovieCard(movie))}
                  </div>
                )
              )}

              {activeFolder === "review" && (
                reviewMovies.length === 0 ? (
                  <p className="text-center text-gray-400 py-12">Aucun film en évaluation.</p>
                ) : (
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
                      {reviewMovies.map(({ movie }) => renderMovieCard(movie))}
                    </div>

                    <section className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
                      <h3 className="text-lg font-semibold text-white mb-4">CRUD Prix (films approuvés)</h3>
                      {groupedMovies.approved.length === 0 ? (
                        <p className="text-gray-400 text-sm">Aucun film approuvé pour attribuer un prix.</p>
                      ) : (
                        <div className="space-y-4">
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                            <select
                              value={awardMovieId}
                              onChange={(event) => setAwardMovieId(event.target.value)}
                              className="bg-gray-900 border border-gray-700 text-white px-3 py-2 rounded-lg text-sm"
                            >
                              <option value="">Sélectionner un film approuvé</option>
                              {groupedMovies.approved.map(({ movie }) => (
                                <option key={`approved-award-${movie.id_movie}`} value={movie.id_movie}>
                                  {movie.title}
                                </option>
                              ))}
                            </select>
                            <input
                              value={awardName}
                              onChange={(event) => setAwardName(event.target.value)}
                              list="award-names"
                              placeholder="Nom du prix"
                              className="bg-gray-900 border border-gray-700 text-white px-3 py-2 rounded-lg text-sm"
                            />
                            <button
                              type="button"
                              onClick={() => {
                                if (!awardMovieId || !awardName.trim()) return;
                                awardMutation.mutate({ id_movie: Number(awardMovieId), award_name: awardName.trim() });
                              }}
                              className="px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700"
                            >
                              Assigner le prix
                            </button>
                          </div>

                          {awardMovieId && (
                            <div className="flex flex-wrap gap-2">
                              {(awardsByMovie[Number(awardMovieId)] || []).length === 0 ? (
                                <span className="text-sm text-gray-400">Aucun prix attribué pour ce film.</span>
                              ) : (
                                (awardsByMovie[Number(awardMovieId)] || []).map((award) => (
                                  <button
                                    key={`award-chip-${award.id_award}`}
                                    type="button"
                                    onClick={() => deleteAwardMutation.mutate(award.id_award)}
                                    className="text-xs bg-purple-900/40 text-purple-200 px-2 py-1 rounded-full hover:bg-purple-900/70"
                                    title="Supprimer le prix"
                                  >
                                    {award.award_name} ✕
                                  </button>
                                ))
                              )}
                            </div>
                          )}
                        </div>
                      )}
                    </section>
                  </div>
                )
              )}

              {activeFolder === "refused" && (
                groupedMovies.refused.length === 0 ? (
                  <p className="text-center text-gray-400 py-12">Aucun film refusé.</p>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
                    {groupedMovies.refused.map(({ movie }) => renderMovieCard(movie, false))}
                  </div>
                )
              )}
            </div>
          )}
        </>
      ) : (
        <div className="text-gray-400">Aucune vidéo trouvée.</div>
      )}

      {selectedMovie && (
        <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4">
          <div className="bg-gray-950 border border-gray-800 rounded-2xl w-full max-w-5xl max-h-[85vh] overflow-hidden p-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-bold text-white">{selectedMovie.title}</h3>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    statusMutation.mutate({ id: selectedMovie.id_movie, status: "refused" });
                    setSelectedMovie(null);
                  }}
                  className="px-3 py-1.5 bg-red-600/80 text-white rounded-lg text-xs font-semibold hover:bg-red-600"
                >
                  Archiver / Refuser
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedMovie(null)}
                  className="text-gray-400 hover:text-white"
                >
                  ✕
                </button>
              </div>
            </div>

            <p className="text-gray-400 mt-1 text-sm line-clamp-2">{selectedMovie.synopsis || selectedMovie.description || "-"}</p>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-3">
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-3 text-xs text-gray-300">
                  <div><span className="text-gray-400">Durée:</span> {selectedMovie.duration ? `${selectedMovie.duration}s` : "-"}</div>
                  <div><span className="text-gray-400">Langue:</span> {selectedMovie.main_language || "-"}</div>
                  <div><span className="text-gray-400">Nationalité:</span> {selectedMovie.nationality || "-"}</div>
                  <div><span className="text-gray-400">Statut:</span> {selectedMovie.selection_status || "submitted"}</div>
                  <div><span className="text-gray-400">Producteur:</span> {(selectedMovie.User || selectedMovie.Producer) ? `${(selectedMovie.User || selectedMovie.Producer).first_name} ${(selectedMovie.User || selectedMovie.Producer).last_name}` : "-"}</div>
                  <div><span className="text-gray-400">Source:</span> {(selectedMovie.User || selectedMovie.Producer)?.known_by_mars_ai || "-"}</div>
                </div>

                <div className="flex flex-wrap gap-3 text-sm">
                  {getTrailer(selectedMovie) && (
                    <span className="text-xs text-gray-400">
                      Trailer : cliquez pour plein écran
                    </span>
                  )}
                  {typeof selectedMovie.subtitle === "string" && selectedMovie.subtitle.toLowerCase().endsWith(".srt") && (
                    <a
                      className="text-[#AD46FF] hover:text-[#F6339A] font-semibold"
                      href={`${uploadBase}/${selectedMovie.subtitle}`}
                      target="_blank"
                      rel="noreferrer"
                      download
                    >
                      Sous-titres
                    </a>
                  )}
                  {selectedMovie.youtube_link && (
                    <a
                      className="text-[#AD46FF] hover:text-[#F6339A] font-semibold"
                      href={selectedMovie.youtube_link}
                      target="_blank"
                      rel="noreferrer"
                    >
                      YouTube
                    </a>
                  )}
                </div>
              </div>

              {(getTrailer(selectedMovie) || selectedMovie.youtube_link) && (
                <div>
                  {getTrailer(selectedMovie) ? (
                    <VideoPreview
                      title={selectedMovie.title}
                      src={`${uploadBase}/${getTrailer(selectedMovie)}`}
                      poster={getPoster(selectedMovie) || undefined}
                      openMode="fullscreen"
                    />
                  ) : (
                    <a className="text-[#AD46FF] hover:text-[#F6339A]" href={selectedMovie.youtube_link} target="_blank" rel="noreferrer">
                      Ouvrir la vidéo
                    </a>
                  )}
                </div>
              )}
            </div>

            <div className="mt-3 border-t border-gray-800 pt-3 grid grid-cols-1 lg:grid-cols-2 gap-4">
              <div>
                <h4 className="text-sm uppercase text-gray-400 mb-3">Catégories</h4>
                {categories.length === 0 ? (
                  <p className="text-gray-500 text-sm">Aucune catégorie disponible.</p>
                ) : (
                  <select
                    value={(categorySelection[selectedMovie.id_movie] || [""])[0] || ""}
                    onChange={(event) => {
                      const value = event.target.value;
                      setCategorySelection((prev) => ({
                        ...prev,
                        [selectedMovie.id_movie]: value ? [Number(value)] : []
                      }));
                    }}
                    className="w-full bg-gray-800 border border-gray-700 text-white px-3 py-2 rounded-lg"
                  >
                    <option value="">Sélectionner une catégorie</option>
                    {categories.map((category) => (
                      <option key={`${selectedMovie.id_movie}-cat-${category.id_categorie}`} value={category.id_categorie}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                )}
                <button
                  type="button"
                  onClick={() => categoryMutation.mutate({
                    id: selectedMovie.id_movie,
                    categories: categorySelection[selectedMovie.id_movie] || []
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
                      const selected = (jurySelection[selectedMovie.id_movie] || []).includes(jury.id_user);
                      return (
                        <label key={`${selectedMovie.id_movie}-jury-${jury.id_user}`} className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            checked={selected}
                            onChange={() => {
                              setJurySelection((prev) => {
                                const current = prev[selectedMovie.id_movie] || [];
                                const exists = current.includes(jury.id_user);
                                const next = exists
                                  ? current.filter((id) => id !== jury.id_user)
                                  : [...current, jury.id_user];
                                return { ...prev, [selectedMovie.id_movie]: next };
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
                    id: selectedMovie.id_movie,
                    juryIds: jurySelection[selectedMovie.id_movie] || []
                  })}
                  className="mt-3 px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700"
                >
                  Enregistrer jurys
                </button>
              </div>
            </div>

            <div className="mt-3 border-t border-gray-800 pt-3">
              <h4 className="text-sm uppercase text-gray-400 mb-2">Commentaire admin</h4>
              <textarea
                value={adminComment}
                onChange={(event) => setAdminComment(event.target.value)}
                rows={3}
                placeholder="Ajouter un commentaire interne..."
                className="w-full bg-gray-800 border border-gray-700 text-white px-3 py-2 rounded-lg text-sm"
              />
              <div className="mt-2 flex justify-end">
                <button
                  type="button"
                  onClick={() => updateMovieMutation.mutate({
                    id: selectedMovie.id_movie,
                    payload: { admin_comment: adminComment }
                  })}
                  className="px-3 py-1.5 bg-gray-800 text-white rounded-lg hover:bg-gray-700 text-sm"
                >
                  Enregistrer commentaire
                </button>
              </div>
            </div>

            <div className="mt-4 border-t border-gray-800 pt-4">
              <h4 className="text-sm uppercase text-gray-400 mb-3">Votes du jury</h4>
              {(voteSummaryByMovie[selectedMovie.id_movie]?.votes || []).length === 0 ? (
                <p className="text-gray-500 text-sm">Aucun vote pour le moment.</p>
              ) : (
                <div className="space-y-3">
                  {(voteSummaryByMovie[selectedMovie.id_movie]?.votes || []).map((vote) => {
                    const isModified = vote.modification_count > 0;
                    const createdDate = new Date(vote.createdAt).toLocaleDateString('fr-FR');
                    const updatedDate = new Date(vote.updatedAt).toLocaleDateString('fr-FR');
                    
                    return (
                      <div key={`vote-${vote.id_vote}`} className="bg-gray-900 border border-gray-800 rounded-lg p-3">
                        <div className="flex items-center justify-between text-sm text-gray-300 mb-2">
                          <div className="flex items-center gap-2">
                            <span>{vote.User ? `${vote.User.first_name} ${vote.User.last_name}` : `Jury #${vote.id_user}`}</span>
                            {isModified && (
                              <span className="text-xs bg-orange-900/40 text-orange-200 px-2 py-0.5 rounded">
                                Modifié {vote.modification_count}×
                              </span>
                            )}
                          </div>
                          <span className="font-semibold text-white">{voteLabels[getVoteCategory(vote.note)] || vote.note}</span>
                        </div>
                        {vote.commentaire && <p className="text-sm text-gray-400 mt-2">{vote.commentaire}</p>}
                        <div className="mt-2 text-xs text-gray-500 flex gap-3">
                          <span>Créé: {createdDate}</span>
                          {isModified && <span>Modifié: {updatedDate}</span>}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            <div className="mt-6 border-t border-gray-800 pt-6">
              <h4 className="text-sm uppercase text-gray-400 mb-3">Prix</h4>
              <div className="flex flex-wrap gap-2 mb-3">
                {(selectedMovie.Awards || []).length === 0 ? (
                  <p className="text-gray-500 text-sm">Aucun prix attribué.</p>
                ) : (
                  selectedMovie.Awards.map((award) => (
                    <button
                      key={`award-${award.id_award}`}
                      type="button"
                      onClick={() => deleteAwardMutation.mutate(award.id_award)}
                      className="text-xs bg-purple-900/40 text-purple-200 px-2 py-1 rounded-full hover:bg-purple-900/70"
                      title="Supprimer le prix"
                    >
                      {award.award_name} ✕
                    </button>
                  ))
                )}
              </div>
              <div className="flex flex-wrap gap-3">
                <input
                  value={awardName}
                  onChange={(event) => setAwardName(event.target.value)}
                  list="award-names"
                  placeholder="Nom du prix"
                  className="bg-gray-900 border border-gray-700 text-white px-3 py-2 rounded-lg"
                />
                <datalist id="award-names">
                  {awardOptions.map((name) => (
                    <option key={`award-option-${name}`} value={name} />
                  ))}
                </datalist>
                <button
                  type="button"
                  onClick={() => {
                    if (!awardName.trim()) return;
                    awardMutation.mutate({ id_movie: selectedMovie.id_movie, award_name: awardName.trim() });
                  }}
                  className="px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700"
                >
                  Attribuer le prix
                </button>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-2 gap-3">
              {[selectedMovie.picture1, selectedMovie.picture2, selectedMovie.picture3].filter(Boolean).map((pic, idx) => (
                <div key={`${selectedMovie.id_movie}-pic-${idx}`} className="aspect-video bg-gray-800 rounded-lg overflow-hidden">
                  <img src={`${uploadBase}/${pic}`} alt="Vignette" className="w-full h-full object-cover" />
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

export default Videos;