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
  deleteMovie,
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
  const [activeFolder, setActiveFolder] = useState(null);
  const [adminComment, setAdminComment] = useState("");
  const [selectedAwardNames, setSelectedAwardNames] = useState([]);
  const [modalNotice, setModalNotice] = useState(null);

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
    setModalNotice(null);
  }, [selectedMovie]);

  useEffect(() => {
    if (!modalNotice) return;
    const timeoutId = setTimeout(() => setModalNotice(null), 4000);
    return () => clearTimeout(timeoutId);
  }, [modalNotice]);

  const statusMutation = useMutation({
    mutationFn: ({ id, status }) => updateMovieStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["listVideos"] });
      setModalNotice("Statut mis à jour.");
    }
  });

  const categoryMutation = useMutation({
    mutationFn: ({ id, categories }) => updateMovieCategories(id, categories),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["listVideos"] });
      setModalNotice("Catégories mises à jour.");
    }
  });

  const juryMutation = useMutation({
    mutationFn: ({ id, juryIds }) => updateMovieJuries(id, juryIds),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["listVideos"] });
      setModalNotice("Jurys mis à jour. Confirmez la 1ère votation.");
    }
  });

  const updateMovieMutation = useMutation({
    mutationFn: ({ id, payload }) => updateMovie(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["listVideos"] });
      setModalNotice("Commentaire enregistré.");
    }
  });

  const deleteMovieMutation = useMutation({
    mutationFn: (id) => deleteMovie(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["listVideos"] });
    },
    onError: (err) => {
      console.error("deleteMovie failed", err);
      alert("Erreur: suppression impossible. Verifiez l'API.");
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["listVideos"] });
    }
  });

  const resetEvaluationMutation = useMutation({
    mutationFn: async (id) => {
      await updateMovieStatus(id, "submitted");
      await updateMovieJuries(id, []);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["listVideos"] });
      queryClient.invalidateQueries({ queryKey: ["votes"] });
      setModalNotice("Film réémis en assignation.");
    },
    onError: (err) => {
      console.error("resetEvaluation failed", err);
      const message = err?.response?.data?.error || err?.message || "Erreur inconnue";
      alert(`Erreur: impossible de reemmettre le film. ${message}`);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["listVideos"] });
      queryClient.invalidateQueries({ queryKey: ["votes"] });
    }
  });

  const secondVoteMutation = useMutation({
    mutationFn: (id) => updateMovieStatus(id, "to_discuss"),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["listVideos"] });
      queryClient.invalidateQueries({ queryKey: ["votes"] });
      setModalNotice("Second vote ouvert.");
    },
    onError: (err) => {
      console.error("secondVote failed", err);
      const message = err?.response?.data?.error || err?.message || "Erreur inconnue";
      alert(`Erreur: impossible d'ouvrir le second vote. ${message}`);
    }
  });

  const awardMutation = useMutation({
    mutationFn: ({ id_movie, award_name }) => createAward(id_movie, award_name),
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: ["listVideos"] });
      queryClient.invalidateQueries({ queryKey: ["awards"] });
      setModalNotice("Prix attribué.");
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

  const handleAssignAwards = (movieId, names) => {
    if (!names.length) return;
    names.forEach((name) => {
      awardMutation.mutate({ id_movie: movieId, award_name: name });
    });
    setSelectedAwardNames([]);
  };

  const deleteAwardMutation = useMutation({
    mutationFn: (id) => deleteAward(id),
    onSuccess: (_res, id) => {
      queryClient.invalidateQueries({ queryKey: ["listVideos"] });
      queryClient.invalidateQueries({ queryKey: ["awards"] });
      setModalNotice("Prix supprimé.");
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

  const getVoteCategory = (note) => {
    if (note === "YES" || note === "TO DISCUSS" || note === "NO") return note;
    const value = parseFloat(note);
    if (Number.isNaN(value)) return "NONE";
    if (value >= 2.5) return "YES";
    if (value >= 1.5) return "TO DISCUSS";
    return "NO";
  };

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

  const awardOptions = useMemo(() => {
    return Array.from(new Set(awards.map((award) => award.award_name))).filter(Boolean);
  }, [awards]);

  const filteredMovies = useMemo(() => {
    return data?.data || [];
  }, [data]);

  const groupedMovies = useMemo(() => {
    const assignJury = [];
    const firstVote = [];
    const decision = [];
    const candidate = [];
    const awarded = [];
    const refused = [];

    filteredMovies.forEach((movie) => {
      const status = movie.selection_status || "submitted";
      const summary = voteSummaryByMovie[movie.id_movie];
      const hasVotes = summary?.count > 0;

      if (status === "refused") {
        refused.push({ movie, summary });
        return;
      }

      if (status === "awarded") {
        awarded.push({ movie, summary });
        return;
      }

      if (status === "candidate" || status === "selected" || status === "finalist") {
        candidate.push({ movie, summary });
        return;
      }

      if (status === "to_discuss") {
        decision.push({ movie, summary, score: getScore(summary) });
        return;
      }

      if (status === "assigned") {
        if (hasVotes) {
          decision.push({ movie, summary, score: getScore(summary) });
        } else {
          firstVote.push({ movie, summary });
        }
        return;
      }

      assignJury.push({ movie, summary });
    });

    decision.sort((a, b) => (b.score || 0) - (a.score || 0));
    candidate.sort((a, b) => (b.summary?.average || 0) - (a.summary?.average || 0));

    return { assignJury, firstVote, decision, candidate, awarded, refused };
  }, [filteredMovies, voteSummaryByMovie]);

  const decisionMovies = useMemo(() => {
    return [...groupedMovies.decision];
  }, [groupedMovies]);

  const renderMovieCard = (movie, showActions = true, rank = null) => {
    const poster = getPoster(movie);
    const summary = voteSummaryByMovie[movie.id_movie];
    const avgScore = summary ? summary.average.toFixed(1) : "-";
    const awardCount = (movie.Awards || []).length;
    
    return (
      <div key={movie.id_movie} className="bg-gray-950 border border-gray-800 rounded-lg overflow-hidden relative">
        {rank !== null && (
          <div className="absolute top-2 left-2 z-10">
            <span className="bg-gradient-to-r from-[#AD46FF] to-[#F6339A] text-white text-xs font-bold px-2 py-1 rounded-full shadow-lg">
              #{rank}
            </span>
          </div>
        )}
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
          </div>
        </button>
        {showActions && (
          <div className="p-2 pt-0 flex gap-1.5">
            {movie.selection_status === "assigned" ? (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  if (window.confirm("Ouvrir le second vote pour ce film ?")) {
                    secondVoteMutation.mutate(movie.id_movie);
                  }
                }}
                className="flex-1 px-2 py-1 bg-yellow-600/80 text-white rounded text-[10px] hover:bg-yellow-600"
              >
                Ouvrir 2e vote
              </button>
            ) : (
              <span className="flex-1 px-2 py-1 bg-gray-800 text-gray-300 rounded text-[10px] text-center">
                2e vote ouvert
              </span>
            )}
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
        {awardCount > 0 && (
          <div className="absolute top-2 right-2 z-10">
            <span className="bg-yellow-500/90 text-black text-[10px] px-2 py-0.5 rounded-full font-bold">
              🏆 {awardCount}
            </span>
          </div>
        )}
      </div>
    );
  };

  // État de chargement - affiche un message en attente des données
  if (isPending) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#AD46FF] mx-auto mb-4"></div>
          <p className="text-gray-300">Chargement en cours...</p>
        </div>
      </div>
    );
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
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-6 gap-5 max-w-7xl w-full">
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
                    <p className="text-gray-400 mb-4">Nouveaux films</p>
                    <div className="inline-block px-4 py-2 bg-gradient-to-r from-[#AD46FF] to-[#F6339A] text-white rounded-full font-bold text-xl shadow-lg">
                      {groupedMovies.assignJury.length}
                    </div>
                  </div>
                </button>

                <button
                  onClick={() => setActiveFolder("assigned")}
                  className="bg-gray-900 rounded-2xl p-8 border-2 border-gray-800 hover:border-[#5EEAD4] transition-all shadow-2xl group hover:shadow-[#5EEAD4]/20"
                >
                  <div className="text-center">
                    <div className="mx-auto w-20 h-20 bg-gradient-to-br from-[#5EEAD4] to-[#14B8A6] rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-lg">
                      <svg className="w-10 h-10" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M2 6a2 2 0 012-2h5l2 2h5a2 2 0 012 2v6a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" />
                      </svg>
                    </div>
                    <h2 className="text-2xl font-bold text-white mb-2 group-hover:text-[#5EEAD4] transition-colors">Première votation</h2>
                    <p className="text-gray-400 mb-4">En attente de vote jury</p>
                    <div className="inline-block px-4 py-2 bg-gradient-to-r from-[#5EEAD4] to-[#14B8A6] text-white rounded-full font-bold text-xl shadow-lg">
                      {groupedMovies.firstVote.length}
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
                    <h2 className="text-2xl font-bold text-white mb-2 group-hover:text-[#AD46FF] transition-colors">Décision 2e vote</h2>
                    <p className="text-gray-400 mb-4">Après 1ère votation</p>
                    <div className="inline-block px-4 py-2 bg-gradient-to-r from-purple-700 to-[#AD46FF] text-white rounded-full font-bold text-xl shadow-lg">
                      {decisionMovies.length}
                    </div>
                  </div>
                </button>

                <button
                  onClick={() => setActiveFolder("approved")}
                  className="bg-gray-900 rounded-2xl p-8 border-2 border-gray-800 hover:border-[#F6339A] transition-all shadow-2xl group hover:shadow-[#F6339A]/20"
                >
                  <div className="text-center">
                    <div className="mx-auto w-20 h-20 bg-gradient-to-br from-[#F6339A] to-pink-700 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-lg">
                      <svg className="w-10 h-10" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    </div>
                    <h2 className="text-2xl font-bold text-white mb-2 group-hover:text-[#F6339A] transition-colors">Candidats</h2>
                    <p className="text-gray-400 mb-4">Après 2e votation</p>
                    <div className="inline-block px-4 py-2 bg-gradient-to-r from-[#F6339A] to-pink-700 text-white rounded-full font-bold text-xl shadow-lg">
                      {groupedMovies.candidate.length}
                    </div>
                  </div>
                </button>

                <button
                  onClick={() => setActiveFolder("refused")}
                  className="bg-gray-900 rounded-2xl p-8 border-2 border-gray-800 hover:border-[#AD46FF] transition-all shadow-2xl group hover:shadow-[#F6339A]/20"
                >
                  <div className="text-center">
                    <div className="mx-auto w-20 h-20 bg-gradient-to-br from-red-700 to-red-500 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-lg">
                      <svg className="w-10 h-10" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M6 7a1 1 0 011-1h6a1 1 0 011 1v9a2 2 0 01-2 2H8a2 2 0 01-2-2V7z" />
                        <path d="M9 4a1 1 0 00-1 1v1h4V5a1 1 0 00-1-1H9z" />
                        <path d="M5 5a1 1 0 011-1h8a1 1 0 011 1v1H5V5z" />
                      </svg>
                    </div>
                    <h2 className="text-2xl font-bold text-white mb-2 group-hover:text-[#F6339A] transition-colors">Refusés</h2>
                    <p className="text-gray-400 mb-4">Films refusés</p>
                    <div className="inline-block px-4 py-2 bg-gradient-to-r from-red-700 to-red-500 text-white rounded-full font-bold text-xl shadow-lg">
                      {groupedMovies.refused.length}
                    </div>
                  </div>
                </button>

                <button
                  onClick={() => setActiveFolder("awarded")}
                  className="bg-gray-900 rounded-2xl p-8 border-2 border-gray-800 hover:border-[#5EEAD4] transition-all shadow-2xl group hover:shadow-[#5EEAD4]/20"
                >
                  <div className="text-center">
                    <div className="mx-auto w-20 h-20 bg-gradient-to-br from-[#5EEAD4] to-[#14B8A6] rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-lg">
                      <svg className="w-10 h-10" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    </div>
                    <h2 className="text-2xl font-bold text-white mb-2 group-hover:text-[#5EEAD4] transition-colors">Films premiés</h2>
                    <p className="text-gray-400 mb-4">Récompenses attribuées</p>
                    <div className="inline-block px-4 py-2 bg-gradient-to-r from-[#5EEAD4] to-[#14B8A6] text-white rounded-full font-bold text-xl shadow-lg">
                      {groupedMovies.awarded.length}
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
                  {activeFolder === "assigned" && "Première votation"}
                  {activeFolder === "review" && "Décision seconde votation"}
                  {activeFolder === "approved" && "Candidats à la récompense"}
                  {activeFolder === "refused" && "Films refusés"}
                  {activeFolder === "awarded" && "Films premiés"}
                </h2>
                <div className="w-24"></div>
              </div>

              {activeFolder === "assign" && (
                groupedMovies.assignJury.length === 0 ? (
                  <p className="text-center text-gray-400 py-12">Aucun film à assigner.</p>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
                    {groupedMovies.assignJury.map(({ movie }) => {
                      const poster = getPoster(movie);
                      const juriesCount = (movie.Juries || []).length;
                      return (
                        <div key={`assign-${movie.id_movie}`} className="bg-gray-950 border border-gray-800 rounded-lg overflow-hidden">
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
                                <span>Jurys: {juriesCount}</span>
                              </div>
                            </div>
                          </button>
                          <div className="p-2 pt-0 flex gap-1.5">
                            <button
                              type="button"
                              onClick={() => setSelectedMovie(movie)}
                              className="flex-1 px-2 py-1 bg-gray-800 text-white rounded text-[10px] hover:bg-gray-700"
                            >
                              Assigner jurys
                            </button>
                            <button
                              type="button"
                              disabled={juriesCount === 0}
                              onClick={() => {
                                if (window.confirm("Lancer la première votation pour ce film ?")) {
                                  statusMutation.mutate({ id: movie.id_movie, status: "assigned" });
                                }
                              }}
                              className="flex-1 px-2 py-1 bg-[#5EEAD4]/80 text-white rounded text-[10px] hover:bg-[#5EEAD4] disabled:opacity-50"
                            >
                              Confirmer vote
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )
              )}

              {activeFolder === "assigned" && (
                groupedMovies.firstVote.length === 0 ? (
                  <p className="text-center text-gray-400 py-12">Aucun film assigné.</p>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
                    {groupedMovies.firstVote.map(({ movie }) => renderMovieCard(movie, false))}
                  </div>
                )
              )}

              {activeFolder === "review" && (
                decisionMovies.length === 0 ? (
                  <p className="text-center text-gray-400 py-12">Aucun film en évaluation.</p>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
                    {decisionMovies.map(({ movie }, index) => renderMovieCard(movie, true, index + 1))}
                  </div>
                )
              )}

              {activeFolder === "approved" && (
                groupedMovies.candidate.length === 0 ? (
                  <p className="text-center text-gray-400 py-12">Aucun film approuvé.</p>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
                    {groupedMovies.candidate.map(({ movie }, index) => {
                      const poster = getPoster(movie);
                      const summary = voteSummaryByMovie[movie.id_movie];
                      const avgScore = summary ? summary.average.toFixed(1) : "-";
                      return (
                        <div key={`approved-${movie.id_movie}`} className="bg-gray-950 border border-gray-800 rounded-lg overflow-hidden relative">
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
                              <div className="flex items-center gap-2">
                                <span className="text-[10px] bg-gradient-to-r from-[#F6339A] to-pink-700 text-white px-2 py-0.5 rounded-full font-bold">#{index + 1}</span>
                                <h3 className="text-xs font-semibold text-white truncate">{movie.title}</h3>
                              </div>
                              <div className="mt-0.5 flex items-center gap-2 text-[10px] text-gray-400">
                                <span>Moy: <span className="text-white font-semibold">{avgScore}</span></span>
                                <span>👍 {summary?.YES || 0}</span>
                                <span>🗣️ {summary?.["TO DISCUSS"] || 0}</span>
                                <span>👎 {summary?.NO || 0}</span>
                              </div>
                            </div>
                          </button>
                          <div className="p-2 pt-0 flex gap-1.5">
                            <button
                              type="button"
                              onClick={() => {
                                statusMutation.mutate({ id: movie.id_movie, status: "awarded" });
                              }}
                              className="flex-1 px-2 py-1 bg-green-600/80 text-white rounded text-[10px] hover:bg-green-600"
                            >
                              Marquer premié
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                statusMutation.mutate({ id: movie.id_movie, status: "refused" });
                              }}
                              className="flex-1 px-2 py-1 bg-red-700/90 text-white rounded text-[10px] hover:bg-red-700"
                            >
                              Refuser
                            </button>
                          </div>
                          {(movie.Awards || []).length > 0 && (
                            <div className="absolute top-2 right-2 z-10">
                              <span className="bg-yellow-500/90 text-black text-[10px] px-2 py-0.5 rounded-full font-bold">
                                🏆 {(movie.Awards || []).length}
                              </span>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )
              )}

              {activeFolder === "refused" && (
                groupedMovies.refused.length === 0 ? (
                  <p className="text-center text-gray-400 py-12">Aucun film refusé.</p>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
                    {groupedMovies.refused.map(({ movie }) => {
                      const poster = getPoster(movie);
                      const summary = voteSummaryByMovie[movie.id_movie];
                      const avgScore = summary ? summary.average.toFixed(1) : "-";
                      return (
                        <div key={`refused-${movie.id_movie}`} className="bg-gray-950 border border-gray-800 rounded-lg overflow-hidden">
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
                            </div>
                          </button>
                          <div className="p-2 pt-0 flex gap-1.5">
                            <button
                              type="button"
                              onClick={() => {
                                if (window.confirm("Supprimer ce film definitivement ?")) {
                                  deleteMovieMutation.mutate(movie.id_movie);
                                }
                              }}
                              className="flex-1 px-2 py-1 bg-red-700/90 text-white rounded text-[10px] hover:bg-red-700"
                            >
                              Supprimer
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                if (window.confirm("Reemmettre ce film au jury et repartir de l'assignation ?")) {
                                  resetEvaluationMutation.mutate(movie.id_movie);
                                }
                              }}
                              className="flex-1 px-2 py-1 bg-yellow-600/80 text-white rounded text-[10px] hover:bg-yellow-600"
                            >
                              Reemmettre au jury
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )
              )}

              {activeFolder === "awarded" && (
                groupedMovies.awarded.length === 0 ? (
                  <p className="text-center text-gray-400 py-12">Aucun film premié.</p>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
                    {groupedMovies.awarded.map(({ movie }) => {
                      const poster = getPoster(movie);
                      return (
                        <div key={`awarded-${movie.id_movie}`} className="bg-gray-950 border border-gray-800 rounded-lg overflow-hidden relative">
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
                                <span>Prix: {(movie.Awards || []).length}</span>
                              </div>
                            </div>
                          </button>
                          <div className="p-2 pt-0 flex gap-1.5">
                            <button
                              type="button"
                              onClick={() => {
                                statusMutation.mutate({ id: movie.id_movie, status: "refused" });
                              }}
                              className="flex-1 px-2 py-1 bg-red-700/90 text-white rounded text-[10px] hover:bg-red-700"
                            >
                              Refuser
                            </button>
                          </div>
                          {(movie.Awards || []).length > 0 && (
                            <div className="absolute top-2 right-2 z-10">
                              <span className="bg-yellow-500/90 text-black text-[10px] px-2 py-0.5 rounded-full font-bold">
                                🏆 {(movie.Awards || []).length}
                              </span>
                            </div>
                          )}
                        </div>
                      );
                    })}
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
          <div className="bg-gray-950 border border-gray-800 rounded-2xl w-full max-w-7xl max-h-[92vh] overflow-hidden p-5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <h3 className="text-xl font-bold text-white">{selectedMovie.title}</h3>
                <span className="text-xs px-2 py-0.5 rounded-full bg-gray-800 text-gray-300">
                  {selectedMovie.selection_status || "submitted"}
                </span>
                {(selectedMovie.Awards || []).length > 0 && (
                  <span className="text-xs bg-yellow-500/90 text-black px-2 py-0.5 rounded-full font-bold">
                    🏆 {(selectedMovie.Awards || []).length}
                  </span>
                )}
              </div>
              <button
                type="button"
                onClick={() => setSelectedMovie(null)}
                className="text-gray-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            {modalNotice && (
              <div className="mt-3 bg-green-900/30 border border-green-600 text-green-300 px-3 py-2 rounded-lg text-xs">
                {modalNotice}
              </div>
            )}

            {(() => {
              const status = selectedMovie.selection_status || "submitted";
              const summary = voteSummaryByMovie[selectedMovie.id_movie];
              const hasVotes = summary?.count > 0;
              const juriesCount = (selectedMovie.Juries || []).length;
              const isCandidate = status === "candidate" || status === "selected" || status === "finalist";

              if (status === "submitted" && juriesCount > 0) {
                return (
                  <div className="mt-3 flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        if (window.confirm("Lancer la première votation pour ce film ?")) {
                          statusMutation.mutate({ id: selectedMovie.id_movie, status: "assigned" });
                          setSelectedMovie(null);
                        }
                      }}
                      className="px-3 py-1.5 bg-[#5EEAD4]/80 text-white rounded-lg text-xs font-semibold hover:bg-[#5EEAD4]"
                    >
                      Lancer 1ère votation
                    </button>
                  </div>
                );
              }

              if (status === "assigned" && hasVotes) {
                return (
                  <div className="mt-3 flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        statusMutation.mutate({ id: selectedMovie.id_movie, status: "refused" });
                        setSelectedMovie(null);
                      }}
                      className="px-3 py-1.5 bg-red-700/90 text-white rounded-lg text-xs font-semibold hover:bg-red-700"
                    >
                      Refuser
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        if (window.confirm("Ouvrir le second vote pour ce film ?")) {
                          secondVoteMutation.mutate(selectedMovie.id_movie);
                          setSelectedMovie(null);
                        }
                      }}
                      className="px-3 py-1.5 bg-yellow-600/80 text-white rounded-lg text-xs font-semibold hover:bg-yellow-600"
                    >
                      Ouvrir 2e vote
                    </button>
                  </div>
                );
              }

              if (status === "to_discuss") {
                return (
                  <div className="mt-3 flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        statusMutation.mutate({ id: selectedMovie.id_movie, status: "refused" });
                        setSelectedMovie(null);
                      }}
                      className="px-3 py-1.5 bg-red-700/90 text-white rounded-lg text-xs font-semibold hover:bg-red-700"
                    >
                      Refuser
                    </button>
                  </div>
                );
              }

              if (isCandidate) {
                return (
                  <div className="mt-3 flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        statusMutation.mutate({ id: selectedMovie.id_movie, status: "awarded" });
                        setSelectedMovie(null);
                      }}
                      className="px-3 py-1.5 bg-green-600/80 text-white rounded-lg text-xs font-semibold hover:bg-green-600"
                    >
                      Marquer premié
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        statusMutation.mutate({ id: selectedMovie.id_movie, status: "refused" });
                        setSelectedMovie(null);
                      }}
                      className="px-3 py-1.5 bg-red-700/90 text-white rounded-lg text-xs font-semibold hover:bg-red-700"
                    >
                      Refuser
                    </button>
                  </div>
                );
              }

              if (status === "awarded") {
                return (
                  <div className="mt-3 flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        statusMutation.mutate({ id: selectedMovie.id_movie, status: "refused" });
                        setSelectedMovie(null);
                      }}
                      className="px-3 py-1.5 bg-red-700/90 text-white rounded-lg text-xs font-semibold hover:bg-red-700"
                    >
                      Refuser
                    </button>
                  </div>
                );
              }

              return null;
            })()}

            {selectedMovie.selection_status === "refused" && (
              <div className="mt-3 flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => {
                    if (window.confirm("Reemmettre ce film au jury et repartir de l'assignation ?")) {
                      resetEvaluationMutation.mutate(selectedMovie.id_movie);
                      setSelectedMovie(null);
                    }
                  }}
                  className="px-3 py-1.5 bg-yellow-600/80 text-white rounded-lg text-xs font-semibold hover:bg-yellow-600"
                >
                  Reemmettre au jury
                </button>
                <button
                  type="button"
                  onClick={() => {
                    if (window.confirm("Supprimer ce film definitivement ?")) {
                      deleteMovieMutation.mutate(selectedMovie.id_movie);
                      setSelectedMovie(null);
                    }
                  }}
                  className="px-3 py-1.5 bg-red-700/90 text-white rounded-lg text-xs font-semibold hover:bg-red-700"
                >
                  Supprimer
                </button>
              </div>
            )}

            <div className="mt-3 grid grid-cols-12 gap-3 text-[11px]">
              <div className="col-span-12 xl:col-span-3 space-y-2">
                <div className="bg-gray-900/60 border border-gray-800 rounded-lg p-2">
                  <h4 className="text-xs uppercase text-gray-400 mb-1">Producteur</h4>
                  <div className="text-gray-300 grid grid-cols-2 gap-2">
                    <div><span className="text-gray-400">Nom:</span> {(selectedMovie.User || selectedMovie.Producer) ? `${(selectedMovie.User || selectedMovie.Producer).first_name} ${(selectedMovie.User || selectedMovie.Producer).last_name}` : "-"}</div>
                    <div><span className="text-gray-400">Email:</span> {(selectedMovie.User || selectedMovie.Producer)?.email || "-"}</div>
                    <div><span className="text-gray-400">Source:</span> {(selectedMovie.User || selectedMovie.Producer)?.known_by_mars_ai || "-"}</div>
                  </div>
                </div>
                <div className="bg-gray-900/60 border border-gray-800 rounded-lg p-2">
                  <h4 className="text-xs uppercase text-gray-400 mb-1">IA & Methodologie</h4>
                  <div className="text-gray-300 grid grid-cols-2 gap-2">
                    <div><span className="text-gray-400">Classification:</span> {selectedMovie.production || "-"}</div>
                    <div><span className="text-gray-400">Methodologie:</span> {selectedMovie.workshop || "-"}</div>
                    <div className="col-span-2"><span className="text-gray-400">Outil IA:</span> {selectedMovie.ai_tool || "-"}</div>
                  </div>
                </div>
                <div className="bg-gray-900/60 border border-gray-800 rounded-lg p-2">
                  <h4 className="text-xs uppercase text-gray-400 mb-1">Synopsis (FR)</h4>
                  <p className="text-gray-300 line-clamp-4">{selectedMovie.synopsis || selectedMovie.description || "-"}</p>
                </div>
                <div className="bg-gray-900/60 border border-gray-800 rounded-lg p-2">
                  <h4 className="text-xs uppercase text-gray-400 mb-1">Synopsis (EN)</h4>
                  <p className="text-gray-300 line-clamp-4">{selectedMovie.synopsis_anglais || "-"}</p>
                </div>
              </div>

              <div className="col-span-12 xl:col-span-3 space-y-2">
                <div className="bg-gray-900/60 border border-gray-800 rounded-lg p-2">
                  <h4 className="text-xs uppercase text-gray-400 mb-1">Infos film</h4>
                  <div className="grid grid-cols-2 gap-2 text-gray-300">
                    <div><span className="text-gray-400">Durée:</span> {selectedMovie.duration ? `${selectedMovie.duration}s` : "-"}</div>
                    <div><span className="text-gray-400">Langue:</span> {selectedMovie.main_language || "-"}</div>
                    <div><span className="text-gray-400">Nationalité:</span> {selectedMovie.nationality || "-"}</div>
                    <div><span className="text-gray-400">Statut:</span> {selectedMovie.selection_status || "submitted"}</div>
                    <div className="col-span-2"><span className="text-gray-400">Note jury:</span> {selectedMovie.jury_comment || "-"}</div>
                  </div>
                  <div className="mt-2 flex flex-wrap gap-2 text-[11px]">
                    {getTrailer(selectedMovie) && (
                      <span className="text-gray-400">Trailer plein ecran</span>
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

                <div className="bg-gray-900/60 border border-gray-800 rounded-lg p-2">
                  <h4 className="text-xs uppercase text-gray-400 mb-1">Media</h4>
                  {(getTrailer(selectedMovie) || selectedMovie.youtube_link) ? (
                    <div className="aspect-video h-[140px]">
                      {getTrailer(selectedMovie) ? (
                        <VideoPreview
                          title={selectedMovie.title}
                          src={`${uploadBase}/${getTrailer(selectedMovie)}`}
                          poster={getPoster(selectedMovie) || undefined}
                          openMode="fullscreen"
                        />
                      ) : (
                        <a className="text-[#AD46FF] hover:text-[#F6339A]" href={selectedMovie.youtube_link} target="_blank" rel="noreferrer">
                          Ouvrir la video
                        </a>
                      )}
                    </div>
                  ) : (
                    <p className="text-gray-500">Aucune video disponible.</p>
                  )}
                  <div className="mt-2 grid grid-cols-3 gap-2">
                    {[selectedMovie.picture1, selectedMovie.picture2, selectedMovie.picture3].filter(Boolean).map((pic, idx) => (
                      <div key={`${selectedMovie.id_movie}-pic-${idx}`} className="aspect-video h-14 bg-gray-800 rounded overflow-hidden">
                        <img src={`${uploadBase}/${pic}`} alt="Vignette" className="w-full h-full object-cover" />
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="col-span-12 xl:col-span-3 space-y-2">
                <div className="bg-gray-900/60 border border-gray-800 rounded-lg p-2">
                  <h4 className="text-xs uppercase text-gray-400 mb-2">Categories</h4>
                  {categories.length === 0 ? (
                    <p className="text-gray-500">Aucune categorie.</p>
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
                      className="w-full bg-gray-800 border border-gray-700 text-white px-2 py-1.5 rounded-lg"
                    >
                      <option value="">Selectionner une categorie</option>
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
                    className="mt-2 px-3 py-1.5 bg-gray-800 text-white rounded-lg hover:bg-gray-700"
                  >
                    Enregistrer categories
                  </button>
                </div>

                <div className="bg-gray-900/60 border border-gray-800 rounded-lg p-2">
                  <h4 className="text-xs uppercase text-gray-400 mb-2">Jurys</h4>
                  {juries.length === 0 ? (
                    <p className="text-gray-500">Aucun jury.</p>
                  ) : (
                    <div className="grid grid-cols-2 gap-2 text-[11px] text-gray-300">
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
                    className="mt-2 px-3 py-1.5 bg-gray-800 text-white rounded-lg hover:bg-gray-700"
                  >
                    Enregistrer jurys
                  </button>
                </div>

                <div className="bg-gray-900/60 border border-gray-800 rounded-lg p-2">
                  <h4 className="text-xs uppercase text-gray-400 mb-2">Commentaire admin</h4>
                  <textarea
                    value={adminComment}
                    onChange={(event) => setAdminComment(event.target.value)}
                    rows={2}
                    placeholder="Ajouter un commentaire interne..."
                    className="w-full bg-gray-800 border border-gray-700 text-white px-2 py-1.5 rounded-lg"
                  />
                  <div className="mt-2 flex justify-end">
                    <button
                      type="button"
                      onClick={() => updateMovieMutation.mutate({
                        id: selectedMovie.id_movie,
                        payload: { admin_comment: adminComment }
                      })}
                      className="px-3 py-1.5 bg-gray-800 text-white rounded-lg hover:bg-gray-700"
                    >
                      Enregistrer commentaire
                    </button>
                  </div>
                </div>
              </div>

              <div className="col-span-12 xl:col-span-3 space-y-2">
                <div className="bg-gray-900/60 border border-gray-800 rounded-lg p-2">
                  <h4 className="text-xs uppercase text-gray-400 mb-2">Evaluation & Classifica</h4>
              {(voteSummaryByMovie[selectedMovie.id_movie]?.votes || []).length === 0 ? (
                <p className="text-gray-500 text-sm">Aucun vote pour le moment.</p>
              ) : (
                <div className="space-y-2">
                  <div className="bg-gradient-to-r from-[#AD46FF]/20 to-[#F6339A]/20 border border-[#AD46FF] rounded-lg p-2">
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="text-[11px] text-gray-400 uppercase mb-1">Score moyen</p>
                        <p className="text-2xl font-bold text-white">
                          {voteSummaryByMovie[selectedMovie.id_movie].average.toFixed(2)}
                        </p>
                        <p className="text-[11px] text-gray-300">
                          {voteSummaryByMovie[selectedMovie.id_movie].count} vote{voteSummaryByMovie[selectedMovie.id_movie].count > 1 ? 's' : ''}
                        </p>
                        <p className="text-[11px] text-gray-400">
                          Seconde votation: {(voteSummaryByMovie[selectedMovie.id_movie].votes || []).filter((vote) => vote.modification_count > 0).length}
                        </p>
                      </div>
                      <div className="flex gap-3 text-[11px]">
                        <div className="text-center">
                          <p className="text-green-400 font-semibold text-lg">{voteSummaryByMovie[selectedMovie.id_movie].YES}</p>
                          <p className="text-gray-400">👍</p>
                        </div>
                        <div className="text-center">
                          <p className="text-yellow-400 font-semibold text-lg">{voteSummaryByMovie[selectedMovie.id_movie]["TO DISCUSS"]}</p>
                          <p className="text-gray-400">🗣️</p>
                        </div>
                        <div className="text-center">
                          <p className="text-red-400 font-semibold text-lg">{voteSummaryByMovie[selectedMovie.id_movie].NO}</p>
                          <p className="text-gray-400">👎</p>
                        </div>
                      </div>
                    </div>
                    {selectedMovie.selection_status !== "selected" && selectedMovie.selection_status !== "refused" && (
                      <div className="mt-2 flex gap-2">
                        <button
                          type="button"
                          onClick={() => {
                            statusMutation.mutate({ id: selectedMovie.id_movie, status: "selected" });
                            setSelectedMovie(null);
                          }}
                          className="px-3 py-1 bg-green-600 text-white rounded-lg hover:bg-green-700 font-semibold"
                        >
                          ✓ Approuver
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            statusMutation.mutate({ id: selectedMovie.id_movie, status: "refused" });
                            setSelectedMovie(null);
                          }}
                          className="px-3 py-1 bg-red-600 text-white rounded-lg hover:bg-red-700 font-semibold"
                        >
                          ✕ Refuser
                        </button>
                      </div>
                    )}
                  </div>

                  <div className="space-y-2">
                    <p className="text-xs text-gray-400 uppercase">Détail des votes</p>
                    <div className="grid grid-cols-1 gap-2">
                      {(voteSummaryByMovie[selectedMovie.id_movie]?.votes || []).map((vote) => {
                        const isModified = vote.modification_count > 0;
                        return (
                          <div key={`vote-${vote.id_vote}`} className="bg-gray-900 border border-gray-800 rounded-lg p-2">
                            <div className="flex items-center justify-between text-[11px] text-gray-300 mb-1">
                              <div className="flex items-center gap-2">
                                <span className="font-semibold">{vote.User ? `${vote.User.first_name} ${vote.User.last_name}` : `Jury #${vote.id_user}`}</span>
                                {isModified ? (
                                  <span className="text-[10px] bg-orange-900/40 text-orange-200 px-2 py-0.5 rounded">
                                    Vote 2 ({vote.modification_count}x)
                                  </span>
                                ) : (
                                  <span className="text-[10px] bg-gray-800 text-gray-300 px-2 py-0.5 rounded">
                                    Vote 1
                                  </span>
                                )}
                              </div>
                              <span className="font-semibold text-white">{voteLabels[getVoteCategory(vote.note)] || vote.note}</span>
                            </div>
                            {vote.commentaire && <p className="text-[11px] text-gray-400 line-clamp-2">{vote.commentaire}</p>}
                            {(vote.history || []).length > 0 && (
                              <div className="mt-2 border-t border-gray-800 pt-2">
                                <p className="text-[10px] uppercase text-gray-500 mb-1">Historique</p>
                                <div className="space-y-1">
                                  {vote.history.map((entry, index) => (
                                    <div key={`vote-history-${vote.id_vote}-${entry.id_vote_history || index}`} className="text-[11px] text-gray-400">
                                      <span className="text-gray-500">Vote {index + 1}:</span>{" "}
                                      <span className="text-gray-300">{voteLabels[getVoteCategory(entry.note)] || entry.note}</span>
                                      {entry.commentaire ? ` — ${entry.commentaire}` : ""}
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}
                </div>

                {(["candidate", "awarded", "selected", "finalist"].includes(selectedMovie.selection_status)) && (
                  <div className="bg-gray-900/60 border border-gray-800 rounded-lg p-2">
                    <h4 className="text-xs uppercase text-gray-400 mb-2">Prix</h4>
                    <div className="flex flex-wrap gap-2 mb-2">
                      {(selectedMovie.Awards || []).length === 0 ? (
                        <p className="text-gray-500">Aucun prix attribue.</p>
                      ) : (
                        selectedMovie.Awards.map((award) => (
                          <button
                            key={`award-${award.id_award}`}
                            type="button"
                            onClick={() => deleteAwardMutation.mutate(award.id_award)}
                            className="text-[11px] bg-purple-900/40 text-purple-200 px-2 py-1 rounded-full hover:bg-purple-900/70"
                            title="Supprimer le prix"
                          >
                            {award.award_name} ✕
                          </button>
                        ))
                      )}
                    </div>
                    <div className="flex flex-wrap gap-2 items-center">
                      <select
                        multiple
                        value={selectedAwardNames}
                        onChange={(event) => {
                          const values = Array.from(event.target.selectedOptions).map((opt) => opt.value);
                          setSelectedAwardNames(values);
                        }}
                        className="min-w-[200px] bg-gray-900 border border-gray-700 text-white px-2 py-1.5 rounded-lg"
                      >
                        {awardOptions
                          .filter((name) => !(selectedMovie.Awards || []).some((award) => award.award_name === name))
                          .map((name) => (
                            <option key={`award-option-${name}`} value={name}>{name}</option>
                          ))}
                      </select>
                      <button
                        type="button"
                        onClick={() => handleAssignAwards(selectedMovie.id_movie, selectedAwardNames)}
                        className="px-3 py-1.5 bg-gray-800 text-white rounded-lg hover:bg-gray-700"
                      >
                        Attribuer
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Videos;