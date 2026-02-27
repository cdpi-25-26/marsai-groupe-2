/**
 * Composant Videos (Gestion des Videos Admin)
 * Page administrateur pour afficher et gerer les videos du systeme.
 * Utilise TanStack Query pour la recuperation et le cache des donnees.
 */
import { useEffect, useMemo, useState } from "react";
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
import { getVotes, deleteVotesByMovie } from "../../api/votes.js";
import { VideoPreview } from "../../components/VideoPreview.jsx";
import TutorialBox from "../../components/TutorialBox.jsx";
import { useEffect as useEffectReact, useState as useStateReact } from "react";
import { loadTutorialSteps } from "../../utils/tutorialLoader.js";

export default function Movies() {
    const [tutorial, setTutorial] = useStateReact({ title: "Tutoriel", steps: [] });

    useEffectReact(() => {
      async function fetchTutorial() {
        try {
          const tutorialData = await loadTutorialSteps("/src/pages/admin/TutorialFilms.fr.md");
          setTutorial(tutorialData);
        } catch (err) {
          setTutorial({ title: "Tutoriel", steps: ["Impossible de charger le tutoriel."] });
        }
      }
      fetchTutorial();
    }, []);
  const queryClient = useQueryClient();
  const { isPending, isError, data, error } = useQuery({
    queryKey: ["listVideos"],
    queryFn: getVideos,
  });
  const { data: categoriesData } = useQuery({
    queryKey: ["categories"],
    queryFn: getCategories,
  });
  const { data: votesData } = useQuery({
    queryKey: ["votes"],
    queryFn: getVotes,
  });

  const categories = categoriesData?.data || [];
  const videos = data?.data || [];
  const filteredMovies = videos;

  const [categorySelection, setCategorySelection] = useState({});
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [activeFolder, setActiveFolder] = useState(null);
  const [adminComment, setAdminComment] = useState("");
  const [modalNotice, setModalNotice] = useState(null);
  const [firstVoteFilter, setFirstVoteFilter] = useState("all");
  const [selectedFirstVoteIds, setSelectedFirstVoteIds] = useState([]);
  const [selectedReviewIds, setSelectedReviewIds] = useState([]);
  const [selectedCandidateIds, setSelectedCandidateIds] = useState([]);
  const [selectedRefusedIds, setSelectedRefusedIds] = useState([]);
  const [candidateSourceFilter, setCandidateSourceFilter] = useState("all");

  useEffect(() => {
    if (!data?.data) return;
    const initialCategories = {};

    data.data.forEach((movie) => {
      initialCategories[movie.id_movie] = (movie.Categories || []).map(
        (category) => category.id_categorie
      );
    });

    setCategorySelection(initialCategories);
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
      alert("Erreur: suppression impossible. Vérifiez l'API.");
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
      alert(`Erreur: impossible de réémettre le film. ${message}`);
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

  const groupedMovies = useMemo(() => {
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

      // Films avec status "submitted" vont directement en firstVote
      firstVote.push({ movie, summary });
    });

    decision.sort((a, b) => (b.score || 0) - (a.score || 0));
    candidate.sort((a, b) => (b.summary?.average || 0) - (a.summary?.average || 0));

    return { firstVote, decision, candidate, awarded, refused };
  }, [filteredMovies, voteSummaryByMovie]);

  const decisionMovies = useMemo(() => {
    return [...groupedMovies.decision];
  }, [groupedMovies]);

  const getMovieSummary = (movieId) => voteSummaryByMovie[movieId];
  const hasAssignedJury = (movie) => (movie.Juries || []).length > 0;
  const hasVotesForMovie = (movie) => (getMovieSummary(movie.id_movie)?.count || 0) > 0;
  const hasSecondVoteForMovie = (movie) =>
    (getMovieSummary(movie.id_movie)?.votes || []).some((vote) => vote.modification_count > 0);

  const firstVoteMovies = useMemo(
    () => groupedMovies.firstVote.map(({ movie }) => movie),
    [groupedMovies]
  );

  const displayedFirstVoteMovies = useMemo(() => {
    if (firstVoteFilter === "with-jury") {
      return firstVoteMovies.filter((movie) => hasAssignedJury(movie));
    }
    return firstVoteMovies;
  }, [firstVoteMovies, firstVoteFilter]);

  const toggleSelection = (setter, selectedIds, id) => {
    if (selectedIds.includes(id)) {
      setter(selectedIds.filter((itemId) => itemId !== id));
    } else {
      setter([...selectedIds, id]);
    }
  };

  const selectAll = (setter, movies) => {
    setter(movies.map((movie) => movie.id_movie));
  };

  const clearSelection = (setter) => setter([]);

  const runBatch = async (ids, operation, successMessage) => {
    if (ids.length === 0) return;
    try {
      await Promise.all(ids.map((id) => operation(id)));
      await queryClient.invalidateQueries({ queryKey: ["listVideos"] });
      await queryClient.invalidateQueries({ queryKey: ["votes"] });
      setModalNotice(successMessage);
      // Aggiorna la vista candidati se promozione
      if (successMessage && successMessage.toLowerCase().includes("candidature")) {
        setActiveTab && setActiveTab("candidates");
      }
    } catch (error) {
      const message = error?.response?.data?.error || error?.message || "Erreur inconnue";
      alert(`Erreur: ${message}`);
    }
  };

  const getCandidateSource = (movie) => {
    const status = movie.selection_status || "submitted";
    const juryProposed = status === "candidate" || status === "finalist";
    const adminProposed = status === "selected" || ((movie.admin_comment || "").toLowerCase().includes("propos"));
    if (juryProposed && adminProposed) return "both";
    if (juryProposed) return "jury";
    if (adminProposed) return "admin";
    return "unknown";
  };

  const filteredCandidateMovies = useMemo(() => {
    const candidates = groupedMovies.candidate.map(({ movie }) => movie);
    if (candidateSourceFilter === "all") return candidates;
    return candidates.filter((movie) => getCandidateSource(movie) === candidateSourceFilter);
  }, [groupedMovies, candidateSourceFilter]);

  // Fonction renderMovieCard transformée en renderMovieRow pour l'affichage en liste
  const renderMovieRow = (movie, showActions = true, rank = null) => {
    const poster = getPoster(movie);
    const summary = voteSummaryByMovie[movie.id_movie];
    const avgScore = summary ? summary.average.toFixed(1) : "-";
    const awardCount = (movie.Awards || []).length;
    
    return (
      <div key={movie.id_movie} className="group relative bg-gradient-to-br from-white/[0.07] to-white/[0.02] backdrop-blur-2xl border border-white/10 rounded-lg hover:border-purple-500/30 transition-all duration-500 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 pointer-events-none" />
        
        <div className="relative flex items-center p-2">
          {/* Rank badge */}
          {rank !== null && (
            <div className="mr-1">
              <span className="flex items-center justify-center w-4 h-4 bg-gradient-to-br from-purple-600 to-pink-600 text-white text-[7px] font-bold rounded-full shadow-lg">
                {rank}
              </span>
            </div>
          )}
          
          {/* Thumbnail */}
          <button
            type="button"
            onClick={() => setSelectedMovie(movie)}
            className="relative flex-shrink-0 mr-2"
          >
            <div className="w-6 h-6 rounded bg-gradient-to-br from-gray-800 to-gray-900 border border-white/10 overflow-hidden">
              {poster ? (
                <img src={poster} alt={movie.title} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <svg className="w-3 h-3 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
              )}
            </div>
          </button>
          
          {/* Title */}
          <button
            type="button"
            onClick={() => setSelectedMovie(movie)}
            className="flex-1 text-left min-w-0 mr-2"
          >
            <h3 className="text-[11px] font-medium text-white group-hover:text-purple-300 transition-colors truncate">{movie.title}</h3>
          </button>
          
          {/* Categories */}
          <div className="flex items-center gap-1 mr-2 flex-wrap max-w-[120px]">
            {(movie.Categories || []).slice(0, 2).map((cat) => (
              <span
                key={cat.id_categorie}
                className="px-1 py-0.5 bg-purple-500/10 border border-purple-500/20 rounded-full text-[7px] text-purple-300 whitespace-nowrap"
              >
                {cat.name}
              </span>
            ))}
          </div>
          
          {/* Score and votes */}
          <div className="flex items-center gap-1.5 mr-2 text-[8px] text-white/40 min-w-[80px]">
            <span className="text-white/60 font-medium">{avgScore}</span>
            <span className="flex items-center gap-0.5 text-green-400">
              <span>👍</span> {summary?.YES || 0}
            </span>
            <span className="flex items-center gap-0.5 text-yellow-400">
              <span>🗣️</span> {summary?.["TO DISCUSS"] || 0}
            </span>
            <span className="flex items-center gap-0.5 text-red-400">
              <span>👎</span> {summary?.NO || 0}
            </span>
          </div>
          
          {/* Awards badge */}
          {awardCount > 0 && (
            <span className="px-1 py-0.5 bg-yellow-500/20 border border-yellow-500/30 rounded-full text-yellow-300 text-[7px] mr-2">
              🏆 {awardCount}
            </span>
          )}
          
          {/* Actions */}
          {showActions && (
            <div className="flex items-center gap-1 ml-auto">
              {movie.selection_status === "assigned" ? (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    if (window.confirm("Ouvrir le second vote pour ce film ?")) {
                      secondVoteMutation.mutate(movie.id_movie);
                    }
                  }}
                  className="px-1.5 py-0.5 bg-yellow-600/20 border border-yellow-500/30 text-yellow-300 text-[7px] rounded hover:bg-yellow-600/30 transition-colors"
                  title="Ouvrir le second vote"
                >
                  2e vote
                </button>
              ) : movie.selection_status === "to_discuss" ? (
                <span className="px-1.5 py-0.5 bg-purple-500/10 border border-purple-500/30 text-purple-300 text-[7px] rounded">
                  2e ouvert
                </span>
              ) : null}
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  statusMutation.mutate({ id: movie.id_movie, status: "refused" });
                }}
                className="px-1.5 py-0.5 bg-red-600/20 border border-red-500/30 text-red-300 text-[7px] rounded hover:bg-red-600/30 transition-colors"
                title="Refuser"
              >
                Refuser
              </button>
            </div>
          )}
        </div>
      </div>
    );
  };

  // État de chargement - affiche un message en attente des données
  if (isPending) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto mb-3"></div>
          <p className="text-sm text-gray-300">Chargement des films...</p>
        </div>
      </div>
    );
  }

  // État d'erreur - affiche le message d'erreur si la requête échoue
  if (isError) {
    return <div className="text-red-300 text-sm">Une erreur est survenue : {error.message}</div>;
  }

  // Affichage de la liste des vidéos ou message si aucune vidéo n'existe
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a0c0f] via-[#0c0e11] to-[#0d0f12] text-white pt-8 pb-12 px-4">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Header avec titre et description */}
        <div className="text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/5 backdrop-blur-sm border border-white/10 rounded-full mb-4">
            <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse" />
            <p className="text-xs uppercase tracking-wider text-white/60">Administration</p>
          </div>
          <h1 className="text-3xl md:text-4xl font-light bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent">
            Gestion des Films
          </h1>
          <p className="text-white/40 text-sm mt-2 max-w-2xl mx-auto">
            Gérez l'ensemble des films soumis, suivez leur progression à travers les différentes étapes de sélection et attribuez les récompenses.
          </p>
        </div>

        {/* Tutorial Box - liquid glass style */}
        <div className="group relative bg-gradient-to-br from-white/[0.07] to-white/[0.02] backdrop-blur-2xl border border-white/10 rounded-xl overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 pointer-events-none" />
          <TutorialBox title={tutorial.title} steps={tutorial.steps} defaultOpen={false} />
        </div>

        {filteredMovies.length > 0 ? (
          <>
            {!activeFolder ? (
              /* 5 Cards principales - Liquid glass design */
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mt-6">
                {/* Première votation */}
                <div
                  onClick={() => setActiveFolder("assigned")}
                  className="group relative bg-gradient-to-br from-white/[0.07] to-white/[0.02] backdrop-blur-2xl border border-white/10 rounded-xl p-5 hover:border-[#5EEAD4]/50 transition-all duration-500 cursor-pointer overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 pointer-events-none" />
                  <div className="absolute inset-0 bg-gradient-to-br from-[#5EEAD4]/5 via-transparent to-[#14B8A6]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
                  
                  <div className="relative flex flex-col items-center text-center">
                    <div className="mb-3">
                      <svg className="w-8 h-8 text-[#5EEAD4]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                      </svg>
                    </div>
                    <h3 className="text-sm font-medium text-white/90 mb-1 group-hover:text-[#5EEAD4] transition-colors">Première votation</h3>
                    <p className="text-[10px] text-white/40 mb-3 line-clamp-2">
                      Films en attente du premier vote
                    </p>
                    <div className="inline-flex items-center gap-1 px-2 py-1 bg-[#5EEAD4]/10 border border-[#5EEAD4]/30 rounded-full">
                      <span className="text-base font-bold text-white">{groupedMovies.firstVote.length}</span>
                      <span className="text-[8px] text-white/40">films</span>
                    </div>
                  </div>
                  
                  <div className="absolute top-0 right-0 w-20 h-20 overflow-hidden opacity-5 pointer-events-none">
                    <div className="absolute top-0 right-0 w-10 h-10 bg-gradient-to-br from-[#5EEAD4]/30 to-[#14B8A6]/30 rounded-full blur-3xl" />
                  </div>
                </div>

                {/* Seconde votation */}
                <div
                  onClick={() => setActiveFolder("review")}
                  className="group relative bg-gradient-to-br from-white/[0.07] to-white/[0.02] backdrop-blur-2xl border border-white/10 rounded-xl p-5 hover:border-purple-500/50 transition-all duration-500 cursor-pointer overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 pointer-events-none" />
                  <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 via-transparent to-pink-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
                  
                  <div className="relative flex flex-col items-center text-center">
                    <div className="mb-3">
                      <svg className="w-8 h-8 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <h3 className="text-sm font-medium text-white/90 mb-1 group-hover:text-purple-400 transition-colors">Seconde votation</h3>
                    <p className="text-[10px] text-white/40 mb-3 line-clamp-2">
                      Films en délibération
                    </p>
                    <div className="inline-flex items-center gap-1 px-2 py-1 bg-purple-500/10 border border-purple-500/30 rounded-full">
                      <span className="text-base font-bold text-white">{decisionMovies.length}</span>
                      <span className="text-[8px] text-white/40">films</span>
                    </div>
                  </div>
                  
                  <div className="absolute top-0 right-0 w-20 h-20 overflow-hidden opacity-5 pointer-events-none">
                    <div className="absolute top-0 right-0 w-10 h-10 bg-gradient-to-br from-purple-500/30 to-pink-500/30 rounded-full blur-3xl" />
                  </div>
                </div>

                {/* Candidats */}
                <div
                  onClick={() => {
                    setCandidateSourceFilter("all");
                    setActiveFolder("approved");
                  }}
                  className="group relative bg-gradient-to-br from-white/[0.07] to-white/[0.02] backdrop-blur-2xl border border-white/10 rounded-xl p-5 hover:border-pink-500/50 transition-all duration-500 cursor-pointer overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 pointer-events-none" />
                  <div className="absolute inset-0 bg-gradient-to-br from-pink-500/5 via-transparent to-orange-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
                  
                  <div className="relative flex flex-col items-center text-center">
                    <div className="mb-3">
                      <svg className="w-8 h-8 text-pink-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                      </svg>
                    </div>
                    <h3 className="text-sm font-medium text-white/90 mb-1 group-hover:text-pink-400 transition-colors">Candidats</h3>
                    <p className="text-[10px] text-white/40 mb-3 line-clamp-2">
                      Films en lice pour les prix
                    </p>
                    <div className="inline-flex items-center gap-1 px-2 py-1 bg-pink-500/10 border border-pink-500/30 rounded-full">
                      <span className="text-base font-bold text-white">{groupedMovies.candidate.length}</span>
                      <span className="text-[8px] text-white/40">films</span>
                    </div>
                  </div>
                  
                  <div className="absolute top-0 right-0 w-20 h-20 overflow-hidden opacity-5 pointer-events-none">
                    <div className="absolute top-0 right-0 w-10 h-10 bg-gradient-to-br from-pink-500/30 to-orange-500/30 rounded-full blur-3xl" />
                  </div>
                </div>

                {/* Refusés */}
                <div
                  onClick={() => setActiveFolder("refused")}
                  className="group relative bg-gradient-to-br from-white/[0.07] to-white/[0.02] backdrop-blur-2xl border border-white/10 rounded-xl p-5 hover:border-red-500/50 transition-all duration-500 cursor-pointer overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 pointer-events-none" />
                  <div className="absolute inset-0 bg-gradient-to-br from-red-500/5 via-transparent to-orange-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
                  
                  <div className="relative flex flex-col items-center text-center">
                    <div className="mb-3">
                      <svg className="w-8 h-8 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
                      </svg>
                    </div>
                    <h3 className="text-sm font-medium text-white/90 mb-1 group-hover:text-red-400 transition-colors">Refusés</h3>
                    <p className="text-[10px] text-white/40 mb-3 line-clamp-2">
                      Films non retenus
                    </p>
                    <div className="inline-flex items-center gap-1 px-2 py-1 bg-red-500/10 border border-red-500/30 rounded-full">
                      <span className="text-base font-bold text-white">{groupedMovies.refused.length}</span>
                      <span className="text-[8px] text-white/40">films</span>
                    </div>
                  </div>
                  
                  <div className="absolute top-0 right-0 w-20 h-20 overflow-hidden opacity-5 pointer-events-none">
                    <div className="absolute top-0 right-0 w-10 h-10 bg-gradient-to-br from-red-500/30 to-orange-500/30 rounded-full blur-3xl" />
                  </div>
                </div>

                {/* Films primés */}
                <div
                  onClick={() => setActiveFolder("awarded")}
                  className="group relative bg-gradient-to-br from-white/[0.07] to-white/[0.02] backdrop-blur-2xl border border-white/10 rounded-xl p-5 hover:border-yellow-500/50 transition-all duration-500 cursor-pointer overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 pointer-events-none" />
                  <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/5 via-transparent to-amber-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
                  
                  <div className="relative flex flex-col items-center text-center">
                    <div className="mb-3">
                      <svg className="w-8 h-8 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                      </svg>
                    </div>
                    <h3 className="text-sm font-medium text-white/90 mb-1 group-hover:text-yellow-400 transition-colors">Films primés</h3>
                    <p className="text-[10px] text-white/40 mb-3 line-clamp-2">
                      Lauréats et récompenses
                    </p>
                    <div className="inline-flex items-center gap-1 px-2 py-1 bg-yellow-500/10 border border-yellow-500/30 rounded-full">
                      <span className="text-base font-bold text-white">{groupedMovies.awarded.length}</span>
                      <span className="text-[8px] text-white/40">films</span>
                    </div>
                  </div>
                  
                  <div className="absolute top-0 right-0 w-20 h-20 overflow-hidden opacity-5 pointer-events-none">
                    <div className="absolute top-0 right-0 w-10 h-10 bg-gradient-to-br from-yellow-500/30 to-amber-500/30 rounded-full blur-3xl" />
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                {/* Header de la section active */}
                <div className="flex items-center justify-between">
                  <button
                    onClick={() => setActiveFolder(null)}
                    className="group relative flex items-center gap-2 px-4 py-2 bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg text-white/80 hover:text-white transition-all duration-200 overflow-hidden"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
                    <svg className="w-4 h-4 relative" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                    </svg>
                    <span className="relative text-sm">Retour</span>
                  </button>
                  
                  <h2 className="text-xl font-light text-white/90">
                    {activeFolder === "assigned" && "Première votation"}
                    {activeFolder === "review" && "Seconde votation"}
                    {activeFolder === "approved" && "Candidats à la récompense"}
                    {activeFolder === "refused" && "Films refusés"}
                    {activeFolder === "awarded" && "Films primés"}
                  </h2>
                  
                  <div className="w-24"></div>
                </div>

                {/* Section Première votation */}
                {activeFolder === "assigned" && (
                  displayedFirstVoteMovies.length === 0 ? (
                    <p className="text-center text-white/40 text-sm py-12">Aucun film disponible dans cette section.</p>
                  ) : (
                    <div className="space-y-4">
                      <div className="flex flex-wrap items-center gap-2">
                        <select
                          value={firstVoteFilter}
                          onChange={(event) => setFirstVoteFilter(event.target.value)}
                          className="bg-black/40 border border-white/10 text-white px-3 py-1.5 text-xs rounded-lg focus:outline-none focus:ring-1 focus:ring-purple-500/30"
                        >
                          <option value="all" className="bg-[#1a1c20]">Tous les films</option>
                          <option value="with-jury" className="bg-[#1a1c20]">Avec jury assigné</option>
                        </select>
                        
                        <button
                          type="button"
                          onClick={() => selectAll(setSelectedFirstVoteIds, displayedFirstVoteMovies)}
                          className="px-3 py-1.5 bg-white/5 border border-white/10 text-white/80 text-xs rounded-lg hover:bg-white/10 transition-colors"
                        >
                          Tout sélectionner
                        </button>
                        
                        <button
                          type="button"
                          onClick={() => clearSelection(setSelectedFirstVoteIds)}
                          className="px-3 py-1.5 bg-white/5 border border-white/10 text-white/80 text-xs rounded-lg hover:bg-white/10 transition-colors"
                        >
                          Désélectionner
                        </button>
                        
                        <button
                          type="button"
                          onClick={() => {
                            const eligible = displayedFirstVoteMovies.filter(
                              (movie) => selectedFirstVoteIds.includes(movie.id_movie) && movie.selection_status === "submitted" && hasAssignedJury(movie)
                            );
                            runBatch(
                              eligible.map((movie) => movie.id_movie),
                              (id) => updateMovieStatus(id, "assigned"),
                              "Première votation lancée pour les films sélectionnés."
                            );
                            clearSelection(setSelectedFirstVoteIds);
                          }}
                          className="px-3 py-1.5 bg-gradient-to-r from-[#5EEAD4]/80 to-[#14B8A6]/80 text-white text-xs rounded-lg hover:from-[#5EEAD4] hover:to-[#14B8A6] transition-colors"
                        >
                          Lancer la première votation
                        </button>
                        
                        <button
                          type="button"
                          onClick={() => {
                            const eligible = displayedFirstVoteMovies.filter(
                              (movie) => selectedFirstVoteIds.includes(movie.id_movie)
                            );
                            runBatch(
                              eligible.map((movie) => movie.id_movie),
                              (id) => updateMovieStatus(id, "refused"),
                              "Films refusés avec succès."
                            );
                            clearSelection(setSelectedFirstVoteIds);
                          }}
                          className="px-3 py-1.5 bg-gradient-to-r from-red-600/80 to-red-700/80 text-white text-xs rounded-lg hover:from-red-600 hover:to-red-700 transition-colors"
                        >
                          Refuser la sélection
                        </button>
                      </div>

                      {/* Liste des films - Affichage en lignes */}
                      <div className="space-y-1.5">
                        {displayedFirstVoteMovies.map((movie) => (
                          <div key={`first-${movie.id_movie}`} className="flex items-center gap-2 bg-black/40 border border-white/10 rounded-lg p-1.5 hover:bg-white/5 transition-colors">
                            <input
                              type="checkbox"
                              checked={selectedFirstVoteIds.includes(movie.id_movie)}
                              onChange={() => toggleSelection(setSelectedFirstVoteIds, selectedFirstVoteIds, movie.id_movie)}
                              className="w-3.5 h-3.5 rounded border-white/30 bg-transparent checked:bg-purple-500 checked:border-purple-500 cursor-pointer"
                            />
                            <div className="flex-1">
                              {renderMovieRow(movie, false)}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )
                )}

                {/* Section Seconde votation */}
                {activeFolder === "review" && (
                  decisionMovies.length === 0 ? (
                    <p className="text-center text-white/40 text-sm py-12">Aucun film en seconde votation.</p>
                  ) : (
                    <div className="space-y-4">
                      <div className="flex flex-wrap items-center gap-2">
                        <button
                          type="button"
                          onClick={() => selectAll(setSelectedReviewIds, decisionMovies.map(({ movie }) => movie))}
                          className="px-3 py-1.5 bg-white/5 border border-white/10 text-white/80 text-xs rounded-lg hover:bg-white/10 transition-colors"
                        >
                          Tout sélectionner
                        </button>
                        
                        <button
                          type="button"
                          onClick={() => clearSelection(setSelectedReviewIds)}
                          className="px-3 py-1.5 bg-white/5 border border-white/10 text-white/80 text-xs rounded-lg hover:bg-white/10 transition-colors"
                        >
                          Désélectionner
                        </button>
                        
                        <button
                          type="button"
                          onClick={() => {
                            const eligible = decisionMovies
                              .map(({ movie }) => movie)
                              .filter((movie) => selectedReviewIds.includes(movie.id_movie) && movie.selection_status === "assigned" && hasVotesForMovie(movie));
                            runBatch(
                              eligible.map((movie) => movie.id_movie),
                              (id) => updateMovieStatus(id, "to_discuss"),
                              "Seconde votation lancée pour les films sélectionnés."
                            );
                            clearSelection(setSelectedReviewIds);
                          }}
                          className="px-3 py-1.5 bg-gradient-to-r from-yellow-600/80 to-yellow-700/80 text-white text-xs rounded-lg hover:from-yellow-600 hover:to-yellow-700 transition-colors"
                        >
                          Lancer la seconde votation
                        </button>
                        
                        <button
                          type="button"
                          onClick={() => {
                            const eligible = decisionMovies
                              .map(({ movie }) => movie)
                              .filter((movie) => selectedReviewIds.includes(movie.id_movie) && movie.selection_status === "to_discuss" && hasSecondVoteForMovie(movie));
                            runBatch(
                              eligible.map((movie) => movie.id_movie),
                              (id) => updateMovieStatus(id, "selected"),
                              "Films proposés à la candidature avec succès."
                            );
                            clearSelection(setSelectedReviewIds);
                          }}
                          className="px-3 py-1.5 bg-gradient-to-r from-green-600/80 to-green-700/80 text-white text-xs rounded-lg hover:from-green-600 hover:to-green-700 transition-colors"
                        >
                          Promouvoir à la candidature
                        </button>
                        
                        <button
                          type="button"
                          onClick={() => {
                            const eligible = decisionMovies
                              .map(({ movie }) => movie)
                              .filter((movie) => selectedReviewIds.includes(movie.id_movie));
                            runBatch(
                              eligible.map((movie) => movie.id_movie),
                              (id) => updateMovieStatus(id, "refused"),
                              "Films refusés avec succès."
                            );
                            clearSelection(setSelectedReviewIds);
                          }}
                          className="px-3 py-1.5 bg-gradient-to-r from-red-600/80 to-red-700/80 text-white text-xs rounded-lg hover:from-red-600 hover:to-red-700 transition-colors"
                        >
                          Refuser la sélection
                        </button>
                      </div>

                      {/* Liste des films - Affichage en lignes */}
                      <div className="space-y-1.5">
                        {decisionMovies.map(({ movie }, index) => (
                          <div key={`review-${movie.id_movie}`} className="flex items-center gap-2 bg-black/40 border border-white/10 rounded-lg p-1.5 hover:bg-white/5 transition-colors">
                            <input
                              type="checkbox"
                              checked={selectedReviewIds.includes(movie.id_movie)}
                              onChange={() => toggleSelection(setSelectedReviewIds, selectedReviewIds, movie.id_movie)}
                              className="w-3.5 h-3.5 rounded border-white/30 bg-transparent checked:bg-purple-500 checked:border-purple-500 cursor-pointer"
                            />
                            <div className="flex-1">
                              {renderMovieRow(movie, true, index + 1)}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )
                )}

                {/* Section Candidats */}
                {activeFolder === "approved" && (
                  filteredCandidateMovies.length === 0 ? (
                    <div className="text-center text-white/40 text-sm py-12">
                      <p>Aucun film candidat trouvé.</p>
                      {groupedMovies.candidate.length > 0 && candidateSourceFilter !== "all" && (
                        <button
                          type="button"
                          onClick={() => setCandidateSourceFilter("all")}
                          className="mt-3 px-4 py-2 bg-white/5 border border-white/10 text-white/80 text-sm rounded-lg hover:bg-white/10 transition-colors"
                        >
                          Réinitialiser le filtre
                        </button>
                      )}
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div className="flex flex-wrap items-center gap-2">
                        <select
                          value={candidateSourceFilter}
                          onChange={(event) => setCandidateSourceFilter(event.target.value)}
                          className="bg-black/40 border border-white/10 text-white px-3 py-1.5 text-xs rounded-lg focus:outline-none focus:ring-1 focus:ring-purple-500/30"
                        >
                          <option value="all" className="bg-[#1a1c20]">Tous les candidats</option>
                          <option value="jury" className="bg-[#1a1c20]">Proposés par le jury</option>
                          <option value="admin" className="bg-[#1a1c20]">Proposés par l'admin</option>
                          <option value="both" className="bg-[#1a1c20]">Proposés par les deux</option>
                        </select>
                        
                        <button
                          type="button"
                          onClick={() => selectAll(setSelectedCandidateIds, filteredCandidateMovies)}
                          className="px-3 py-1.5 bg-white/5 border border-white/10 text-white/80 text-xs rounded-lg hover:bg-white/10 transition-colors"
                        >
                          Tout sélectionner
                        </button>
                        
                        <button
                          type="button"
                          onClick={() => clearSelection(setSelectedCandidateIds)}
                          className="px-3 py-1.5 bg-white/5 border border-white/10 text-white/80 text-xs rounded-lg hover:bg-white/10 transition-colors"
                        >
                          Désélectionner
                        </button>
                        
                        <button
                          type="button"
                          onClick={() => {
                            const eligible = filteredCandidateMovies.filter((movie) => selectedCandidateIds.includes(movie.id_movie));
                            runBatch(
                              eligible.map((movie) => movie.id_movie),
                              (id) => updateMovieStatus(id, "refused"),
                              "Films candidats refusés avec succès."
                            );
                            clearSelection(setSelectedCandidateIds);
                          }}
                          className="px-3 py-1.5 bg-gradient-to-r from-red-600/80 to-red-700/80 text-white text-xs rounded-lg hover:from-red-600 hover:to-red-700 transition-colors"
                        >
                          Refuser la sélection
                        </button>
                      </div>

                      {/* Liste des films candidats */}
                      <div className="space-y-1.5">
                        {filteredCandidateMovies.map((movie, index) => (
                          <div key={`candidate-${movie.id_movie}`} className="group relative bg-gradient-to-br from-white/[0.07] to-white/[0.02] backdrop-blur-2xl border border-white/10 rounded-lg hover:border-pink-500/30 transition-all duration-500 overflow-hidden">
                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 pointer-events-none" />
                            
                            <div className="relative flex items-center p-2">
                              <div className="flex items-center gap-2 flex-1">
                                <input
                                  type="checkbox"
                                  checked={selectedCandidateIds.includes(movie.id_movie)}
                                  onChange={() => toggleSelection(setSelectedCandidateIds, selectedCandidateIds, movie.id_movie)}
                                  className="w-3.5 h-3.5 rounded border-white/30 bg-transparent checked:bg-purple-500 checked:border-purple-500 cursor-pointer"
                                />
                                
                                <span className="px-1.5 py-0.5 bg-gradient-to-br from-pink-600 to-pink-500 text-white text-[8px] font-bold rounded-full">
                                  #{index + 1}
                                </span>
                                
                                <button
                                  type="button"
                                  onClick={() => setSelectedMovie(movie)}
                                  className="relative flex-shrink-0"
                                >
                                  <div className="w-6 h-6 rounded bg-gradient-to-br from-gray-800 to-gray-900 border border-white/10 overflow-hidden">
                                    {getPoster(movie) ? (
                                      <img src={getPoster(movie)} alt={movie.title} className="w-full h-full object-cover" />
                                    ) : (
                                      <div className="w-full h-full flex items-center justify-center">
                                        <svg className="w-3 h-3 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                        </svg>
                                      </div>
                                    )}
                                  </div>
                                </button>
                                
                                <button
                                  type="button"
                                  onClick={() => setSelectedMovie(movie)}
                                  className="text-left min-w-0 flex-1"
                                >
                                  <h3 className="text-[11px] font-medium text-white truncate">{movie.title}</h3>
                                </button>
                                
                                <div className="flex items-center gap-2 text-[8px] text-white/40">
                                  <span className="text-white/60">{voteSummaryByMovie[movie.id_movie]?.average.toFixed(1) || "-"}</span>
                                  <span className="text-green-400">👍 {voteSummaryByMovie[movie.id_movie]?.YES || 0}</span>
                                  <span className="text-yellow-400">🗣️ {voteSummaryByMovie[movie.id_movie]?.["TO DISCUSS"] || 0}</span>
                                  <span className="text-red-400">👎 {voteSummaryByMovie[movie.id_movie]?.NO || 0}</span>
                                </div>
                                
                                <div className="flex items-center gap-1 ml-auto">
                                  <span className="px-1.5 py-0.5 bg-gradient-to-br from-green-600/80 to-green-700/80 text-white text-[7px] rounded-full font-bold">
                                    {getCandidateSource(movie) === "both" ? "J+A" : getCandidateSource(movie) === "jury" ? "Jury" : "Admin"}
                                  </span>
                                  
                                  {(movie.Awards || []).length > 0 && (
                                    <span className="px-1.5 py-0.5 bg-gradient-to-br from-yellow-500/80 to-amber-500/80 text-black text-[7px] rounded-full font-bold">
                                      🏆 {(movie.Awards || []).length}
                                    </span>
                                  )}
                                  
                                  <button
                                    type="button"
                                    onClick={() => {
                                      statusMutation.mutate({ id: movie.id_movie, status: "refused" });
                                    }}
                                    className="px-1.5 py-0.5 bg-red-600/20 border border-red-500/30 text-red-300 text-[7px] rounded hover:bg-red-600/30 transition-colors"
                                  >
                                    Refuser
                                  </button>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )
                )}

                {/* Section Refusés */}
                {activeFolder === "refused" && (
                  groupedMovies.refused.length === 0 ? (
                    <p className="text-center text-white/40 text-sm py-12">Aucun film refusé.</p>
                  ) : (
                    <div className="space-y-4">
                      <div className="flex flex-wrap items-center gap-2">
                        <button
                          type="button"
                          onClick={() => selectAll(setSelectedRefusedIds, groupedMovies.refused.map(({ movie }) => movie))}
                          className="px-3 py-1.5 bg-white/5 border border-white/10 text-white/80 text-xs rounded-lg hover:bg-white/10 transition-colors"
                        >
                          Tout sélectionner
                        </button>
                        
                        <button
                          type="button"
                          onClick={() => clearSelection(setSelectedRefusedIds)}
                          className="px-3 py-1.5 bg-white/5 border border-white/10 text-white/80 text-xs rounded-lg hover:bg-white/10 transition-colors"
                        >
                          Désélectionner
                        </button>
                        
                        <button
                          type="button"
                          onClick={() => {
                            const ids = groupedMovies.refused
                              .map(({ movie }) => movie.id_movie)
                              .filter((id) => selectedRefusedIds.includes(id));
                            runBatch(
                              ids,
                              async (id) => {
                                await updateMovieStatus(id, "submitted");
                                await updateMovieJuries(id, []);
                              },
                              "Films réémis au jury avec succès."
                            );
                            clearSelection(setSelectedRefusedIds);
                          }}
                          className="px-3 py-1.5 bg-gradient-to-r from-[#5EEAD4]/80 to-[#14B8A6]/80 text-white text-xs rounded-lg hover:from-[#5EEAD4] hover:to-[#14B8A6] transition-colors"
                        >
                          Réémettre au jury
                        </button>
                        
                        <button
                          type="button"
                          onClick={() => {
                            const ids = groupedMovies.refused
                              .map(({ movie }) => movie.id_movie)
                              .filter((id) => selectedRefusedIds.includes(id));
                            runBatch(ids, (id) => deleteVotesByMovie(id), "Votes supprimés avec succès.");
                            clearSelection(setSelectedRefusedIds);
                          }}
                          className="px-3 py-1.5 bg-gradient-to-r from-yellow-600/80 to-yellow-700/80 text-white text-xs rounded-lg hover:from-yellow-600 hover:to-yellow-700 transition-colors"
                        >
                          Effacer les votes
                        </button>
                        
                        <button
                          type="button"
                          onClick={() => {
                            const ids = groupedMovies.refused
                              .map(({ movie }) => movie.id_movie)
                              .filter((id) => selectedRefusedIds.includes(id));
                            runBatch(ids, (id) => deleteMovie(id), "Films supprimés définitivement.");
                            clearSelection(setSelectedRefusedIds);
                          }}
                          className="px-3 py-1.5 bg-gradient-to-r from-red-600/80 to-red-700/80 text-white text-xs rounded-lg hover:from-red-600 hover:to-red-700 transition-colors"
                        >
                          Supprimer définitivement
                        </button>
                      </div>

                      {/* Liste des films refusés */}
                      <div className="space-y-1.5">
                        {groupedMovies.refused.map(({ movie }) => (
                          <div key={`refused-${movie.id_movie}`} className="group relative bg-gradient-to-br from-white/[0.07] to-white/[0.02] backdrop-blur-2xl border border-white/10 rounded-lg hover:border-red-500/30 transition-all duration-500 overflow-hidden">
                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 pointer-events-none" />
                            
                            <div className="relative flex items-center p-2">
                              <div className="flex items-center gap-2 flex-1">
                                <input
                                  type="checkbox"
                                  checked={selectedRefusedIds.includes(movie.id_movie)}
                                  onChange={() => toggleSelection(setSelectedRefusedIds, selectedRefusedIds, movie.id_movie)}
                                  className="w-3.5 h-3.5 rounded border-white/30 bg-transparent checked:bg-purple-500 checked:border-purple-500 cursor-pointer"
                                />
                                
                                <button
                                  type="button"
                                  onClick={() => setSelectedMovie(movie)}
                                  className="relative flex-shrink-0"
                                >
                                  <div className="w-6 h-6 rounded bg-gradient-to-br from-gray-800 to-gray-900 border border-white/10 overflow-hidden">
                                    {getPoster(movie) ? (
                                      <img src={getPoster(movie)} alt={movie.title} className="w-full h-full object-cover" />
                                    ) : (
                                      <div className="w-full h-full flex items-center justify-center">
                                        <svg className="w-3 h-3 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                        </svg>
                                      </div>
                                    )}
                                  </div>
                                </button>
                                
                                <button
                                  type="button"
                                  onClick={() => setSelectedMovie(movie)}
                                  className="text-left min-w-0 flex-1"
                                >
                                  <h3 className="text-[11px] font-medium text-white truncate">{movie.title}</h3>
                                </button>
                                
                                <div className="flex items-center gap-2 text-[8px] text-white/40">
                                  <span className="text-white/60">{voteSummaryByMovie[movie.id_movie]?.average.toFixed(1) || "-"}</span>
                                  <span className="text-green-400">👍 {voteSummaryByMovie[movie.id_movie]?.YES || 0}</span>
                                  <span className="text-yellow-400">🗣️ {voteSummaryByMovie[movie.id_movie]?.["TO DISCUSS"] || 0}</span>
                                  <span className="text-red-400">👎 {voteSummaryByMovie[movie.id_movie]?.NO || 0}</span>
                                </div>
                                
                                <div className="flex items-center gap-1 ml-auto">
                                  <button
                                    type="button"
                                    onClick={() => {
                                      if (window.confirm("Supprimer ce film définitivement ?")) {
                                        deleteMovieMutation.mutate(movie.id_movie);
                                      }
                                    }}
                                    className="px-1.5 py-0.5 bg-red-600/20 border border-red-500/30 text-red-300 text-[7px] rounded hover:bg-red-600/30 transition-colors"
                                  >
                                    Supprimer
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => {
                                      if (window.confirm("Réémettre ce film au jury ?")) {
                                        resetEvaluationMutation.mutate(movie.id_movie);
                                      }
                                    }}
                                    className="px-1.5 py-0.5 bg-yellow-600/20 border border-yellow-500/30 text-yellow-300 text-[7px] rounded hover:bg-yellow-600/30 transition-colors"
                                  >
                                    Réémettre
                                  </button>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )
                )}

                {/* Section Films primés */}
                {activeFolder === "awarded" && (
                  groupedMovies.awarded.length === 0 ? (
                    <p className="text-center text-white/40 text-sm py-12">Aucun film primé.</p>
                  ) : (
                    <div className="space-y-1.5">
                      {groupedMovies.awarded.map(({ movie }) => (
                        <div key={`awarded-${movie.id_movie}`} className="group relative bg-gradient-to-br from-yellow-500/5 to-amber-500/5 backdrop-blur-2xl border border-yellow-500/20 rounded-lg hover:border-yellow-500/40 transition-all duration-500 overflow-hidden">
                          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 pointer-events-none" />
                          
                          <div className="relative flex items-center p-2">
                            <div className="flex items-center gap-2 flex-1">
                              <button
                                type="button"
                                onClick={() => setSelectedMovie(movie)}
                                className="relative flex-shrink-0"
                              >
                                <div className="w-6 h-6 rounded bg-gradient-to-br from-gray-800 to-gray-900 border border-white/10 overflow-hidden">
                                  {getPoster(movie) ? (
                                    <img src={getPoster(movie)} alt={movie.title} className="w-full h-full object-cover" />
                                  ) : (
                                    <div className="w-full h-full flex items-center justify-center">
                                      <svg className="w-3 h-3 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                      </svg>
                                    </div>
                                  )}
                                </div>
                              </button>
                              
                              <button
                                type="button"
                                onClick={() => setSelectedMovie(movie)}
                                className="text-left min-w-0 flex-1"
                              >
                                <h3 className="text-[11px] font-medium text-white truncate">{movie.title}</h3>
                              </button>
                              
                              <div className="text-[9px] text-yellow-400">🏆 {(movie.Awards || []).length} prix</div>
                              
                              <button
                                type="button"
                                onClick={() => {
                                  statusMutation.mutate({ id: movie.id_movie, status: "refused" });
                                }}
                                className="px-1.5 py-0.5 bg-red-600/20 border border-red-500/30 text-red-300 text-[7px] rounded hover:bg-red-600/30 transition-colors ml-auto"
                              >
                                Refuser
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )
                )}
              </div>
            )}
          </>
        ) : (
          <div className="flex flex-col items-center justify-center py-20">
            <svg className="w-20 h-20 text-white/20 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 4v16M17 4v16M3 8h4m10 0h4M3 12h18M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z" />
            </svg>
            <p className="text-white/40 text-sm">Aucun film n'a été soumis pour le moment.</p>
          </div>
        )}

        {/* MODAL - Détail du film */}
        {selectedMovie && (
          <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-gradient-to-br from-[#1a1c20] to-[#0f1114] border border-white/10 rounded-xl w-full max-w-5xl max-h-[85vh] overflow-y-auto scrollbar-thin-dark shadow-2xl shadow-black/50">
              <div className="p-5">
                {/* Header compact */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-500/20 to-pink-500/20 border border-white/10 flex items-center justify-center flex-shrink-0">
                      <svg className="w-5 h-5 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 4v16M17 4v16M3 8h4m10 0h4M3 12h18M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z" />
                      </svg>
                    </div>
                    <div>
                      <h2 className="text-xl font-light bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent">
                        {selectedMovie.title}
                      </h2>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-[10px] text-white/40">ID: {selectedMovie.id_movie}</span>
                        <span className="w-1 h-1 bg-white/20 rounded-full" />
                        <span className={`text-[9px] px-2 py-0.5 rounded-full border ${
                          selectedMovie.selection_status === 'selected' 
                            ? 'bg-green-500/20 text-green-300 border-green-500/30' 
                            : selectedMovie.selection_status === 'refused'
                              ? 'bg-red-500/20 text-red-300 border-red-500/30'
                              : 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30'
                        }`}>
                          {selectedMovie.selection_status === 'selected' ? 'Sélectionné' : 
                           selectedMovie.selection_status === 'refused' ? 'Refusé' : 'En attente'}
                        </span>
                      </div>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setSelectedMovie(null)}
                    className="p-1.5 rounded-lg hover:bg-white/10 text-gray-400 hover:text-white transition-colors"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                {modalNotice && (
                  <div className="mb-3 p-2 bg-green-500/10 border border-green-500/30 rounded-lg text-green-300 text-xs">
                    {modalNotice}
                  </div>
                )}

                {/* Actions rapides compactes */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {(() => {
                    const status = selectedMovie.selection_status || "submitted";
                    const summary = voteSummaryByMovie[selectedMovie.id_movie];
                    const hasVotes = summary?.count > 0;
                    const hasSecondVote = (summary?.votes || []).some((vote) => vote.modification_count > 0);
                    const isCandidate = status === "candidate" || status === "selected" || status === "finalist";

                    return (
                      <div className="flex flex-wrap gap-1.5">
                        {status === "submitted" && (
                          <>
                            <button
                              type="button"
                              onClick={() => {
                                statusMutation.mutate({ id: selectedMovie.id_movie, status: "refused" });
                                setSelectedMovie(null);
                              }}
                              className="px-3 py-1.5 bg-gradient-to-r from-red-600/80 to-red-700/80 text-white text-[10px] rounded-lg hover:from-red-600 hover:to-red-700 transition-colors"
                            >
                              Refuser
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                if (window.confirm("Lancer la première votation pour ce film ?")) {
                                  statusMutation.mutate({ id: selectedMovie.id_movie, status: "assigned" });
                                  setSelectedMovie(null);
                                }
                              }}
                              className="px-3 py-1.5 bg-gradient-to-r from-[#5EEAD4]/80 to-[#14B8A6]/80 text-white text-[10px] rounded-lg hover:from-[#5EEAD4] hover:to-[#14B8A6] transition-colors"
                            >
                              Lancer 1ère votation
                            </button>
                          </>
                        )}

                        {status === "assigned" && hasVotes && (
                          <>
                            <button
                              type="button"
                              onClick={() => {
                                statusMutation.mutate({ id: selectedMovie.id_movie, status: "refused" });
                                setSelectedMovie(null);
                              }}
                              className="px-3 py-1.5 bg-gradient-to-r from-red-600/80 to-red-700/80 text-white text-[10px] rounded-lg hover:from-red-600 hover:to-red-700 transition-colors"
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
                              className="px-3 py-1.5 bg-gradient-to-r from-yellow-600/80 to-yellow-700/80 text-white text-[10px] rounded-lg hover:from-yellow-600 hover:to-yellow-700 transition-colors"
                            >
                              Ouvrir 2e vote
                            </button>
                          </>
                        )}

                        {status === "to_discuss" && (
                          <>
                            <button
                              type="button"
                              onClick={() => {
                                statusMutation.mutate({ id: selectedMovie.id_movie, status: "refused" });
                                setSelectedMovie(null);
                              }}
                              className="px-3 py-1.5 bg-gradient-to-r from-red-600/80 to-red-700/80 text-white text-[10px] rounded-lg hover:from-red-600 hover:to-red-700 transition-colors"
                            >
                              Refuser
                            </button>
                            {hasSecondVote && (
                              <button
                                type="button"
                                onClick={() => {
                                  statusMutation.mutate({ id: selectedMovie.id_movie, status: "selected" });
                                  setModalNotice("Film proposé à la candidature.");
                                  setSelectedMovie(null);
                                }}
                                className="px-3 py-1.5 bg-gradient-to-r from-green-600/80 to-green-700/80 text-white text-[10px] rounded-lg hover:from-green-600 hover:to-green-700 transition-colors"
                              >
                                Proposer à la candidature
                              </button>
                            )}
                          </>
                        )}

                        {isCandidate && (
                          <button
                            type="button"
                            onClick={() => {
                              statusMutation.mutate({ id: selectedMovie.id_movie, status: "refused" });
                              setSelectedMovie(null);
                            }}
                            className="px-3 py-1.5 bg-gradient-to-r from-red-600/80 to-red-700/80 text-white text-[10px] rounded-lg hover:from-red-600 hover:to-red-700 transition-colors"
                          >
                            Refuser
                          </button>
                        )}

                        {status === "awarded" && (
                          <button
                            type="button"
                            onClick={() => {
                              statusMutation.mutate({ id: selectedMovie.id_movie, status: "refused" });
                              setSelectedMovie(null);
                            }}
                            className="px-3 py-1.5 bg-gradient-to-r from-red-600/80 to-red-700/80 text-white text-[10px] rounded-lg hover:from-red-600 hover:to-red-700 transition-colors"
                          >
                            Refuser
                          </button>
                        )}

                        {status === "refused" && (
                          <>
                            <button
                              type="button"
                              onClick={() => {
                                if (window.confirm("Réémettre ce film au jury ?")) {
                                  resetEvaluationMutation.mutate(selectedMovie.id_movie);
                                  setSelectedMovie(null);
                                }
                              }}
                              className="px-3 py-1.5 bg-gradient-to-r from-yellow-600/80 to-yellow-700/80 text-white text-[10px] rounded-lg hover:from-yellow-600 hover:to-yellow-700 transition-colors"
                            >
                              Réémettre au jury
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                if (window.confirm("Supprimer ce film définitivement ?")) {
                                  deleteMovieMutation.mutate(selectedMovie.id_movie);
                                  setSelectedMovie(null);
                                }
                              }}
                              className="px-3 py-1.5 bg-gradient-to-r from-red-600/80 to-red-700/80 text-white text-[10px] rounded-lg hover:from-red-600 hover:to-red-700 transition-colors"
                            >
                              Supprimer
                            </button>
                          </>
                        )}
                      </div>
                    );
                  })()}
                </div>

                {/* Grille d'informations compacte - 4 colonnes */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 mb-4">
                  {/* Producteur */}
                  <div className="bg-black/40 border border-white/10 rounded-lg p-3">
                    <h3 className="text-[10px] font-medium text-white/40 uppercase tracking-wider mb-2">Producteur</h3>
                    <div className="space-y-1.5 text-xs">
                      <div>
                        <span className="text-white/40 text-[9px] block">Nom</span>
                        <span className="text-white text-[11px]">
                          {(selectedMovie.User || selectedMovie.Producer) ? 
                            `${(selectedMovie.User || selectedMovie.Producer).first_name} ${(selectedMovie.User || selectedMovie.Producer).last_name}` 
                            : "-"}
                        </span>
                      </div>
                      <div>
                        <span className="text-white/40 text-[9px] block">Email</span>
                        <span className="text-white text-[11px] break-all">
                          {(selectedMovie.User || selectedMovie.Producer)?.email || "-"}
                        </span>
                      </div>
                      <div>
                        <span className="text-white/40 text-[9px] block">Connu via</span>
                        <span className="text-white text-[11px]">
                          {(selectedMovie.User || selectedMovie.Producer)?.known_by_mars_ai || "-"}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* IA & Méthodologie */}
                  <div className="bg-black/40 border border-white/10 rounded-lg p-3">
                    <h3 className="text-[10px] font-medium text-white/40 uppercase tracking-wider mb-2">IA & Méthodologie</h3>
                    <div className="space-y-1.5 text-xs">
                      <div>
                        <span className="text-white/40 text-[9px] block">Classification</span>
                        <span className="text-white text-[11px]">{selectedMovie.production || "-"}</span>
                      </div>
                      <div>
                        <span className="text-white/40 text-[9px] block">Méthodologie</span>
                        <span className="text-white text-[11px]">{selectedMovie.workshop || "-"}</span>
                      </div>
                      <div>
                        <span className="text-white/40 text-[9px] block">Outils IA</span>
                        <span className="text-white text-[11px]">{selectedMovie.ai_tool || "-"}</span>
                      </div>
                    </div>
                  </div>

                  {/* Informations film */}
                  <div className="bg-black/40 border border-white/10 rounded-lg p-3">
                    <h3 className="text-[10px] font-medium text-white/40 uppercase tracking-wider mb-2">Informations</h3>
                    <div className="space-y-1.5 text-xs">
                      <div>
                        <span className="text-white/40 text-[9px] block">Durée</span>
                        <span className="text-white text-[11px]">{selectedMovie.duration ? `${selectedMovie.duration}s` : "-"}</span>
                      </div>
                      <div>
                        <span className="text-white/40 text-[9px] block">Langue</span>
                        <span className="text-white text-[11px]">{selectedMovie.main_language || "-"}</span>
                      </div>
                      <div>
                        <span className="text-white/40 text-[9px] block">Nationalité</span>
                        <span className="text-white text-[11px]">{selectedMovie.nationality || "-"}</span>
                      </div>
                    </div>
                  </div>

                  {/* Liens */}
                  <div className="bg-black/40 border border-white/10 rounded-lg p-3">
                    <h3 className="text-[10px] font-medium text-white/40 uppercase tracking-wider mb-2">Liens</h3>
                    <div className="space-y-1.5">
                      {getTrailer(selectedMovie) && (
                        <a
                          href={`${uploadBase}/${getTrailer(selectedMovie)}`}
                          target="_blank"
                          rel="noreferrer"
                          className="flex items-center gap-1.5 text-[11px] text-purple-400 hover:text-purple-300 transition-colors"
                        >
                          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                          </svg>
                          Bande-annonce
                        </a>
                      )}
                      {selectedMovie.youtube_link && (
                        <a
                          href={selectedMovie.youtube_link}
                          target="_blank"
                          rel="noreferrer"
                          className="flex items-center gap-1.5 text-[11px] text-red-400 hover:text-red-300 transition-colors"
                        >
                          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                          </svg>
                          YouTube
                        </a>
                      )}
                    </div>
                  </div>
                </div>

                {/* Synopsis - 2 colonnes */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
                  <div className="bg-black/40 border border-white/10 rounded-lg p-3">
                    <h3 className="text-[10px] font-medium text-white/40 uppercase tracking-wider mb-2">Synopsis (FR)</h3>
                    <p className="text-xs text-white/70 leading-relaxed line-clamp-3">
                      {selectedMovie.synopsis || selectedMovie.description || "Aucune description disponible."}
                    </p>
                  </div>
                  <div className="bg-black/40 border border-white/10 rounded-lg p-3">
                    <h3 className="text-[10px] font-medium text-white/40 uppercase tracking-wider mb-2">Synopsis (EN)</h3>
                    <p className="text-xs text-white/70 leading-relaxed line-clamp-3">
                      {selectedMovie.synopsis_anglais || "Aucune description disponible."}
                    </p>
                  </div>
                </div>

                {/* Vidéo compacte */}
                {(getTrailer(selectedMovie) || selectedMovie.youtube_link) && (
                  <div className="mb-4">
                    <h3 className="text-[10px] font-medium text-white/40 uppercase tracking-wider mb-2">Aperçu</h3>
                    <div className="aspect-video max-h-40 bg-black/60 border border-white/10 rounded-lg overflow-hidden">
                      {getTrailer(selectedMovie) ? (
                        <VideoPreview
                          title={selectedMovie.title}
                          src={`${uploadBase}/${getTrailer(selectedMovie)}`}
                          poster={getPoster(selectedMovie) || undefined}
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <a 
                            href={selectedMovie.youtube_link} 
                            target="_blank" 
                            rel="noreferrer"
                            className="text-xs text-purple-400 hover:text-purple-300"
                          >
                            Ouvrir sur YouTube
                          </a>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Images */}
                {[selectedMovie.picture1, selectedMovie.picture2, selectedMovie.picture3].filter(Boolean).length > 0 && (
                  <div className="mb-4">
                    <h3 className="text-[10px] font-medium text-white/40 uppercase tracking-wider mb-2">Images</h3>
                    <div className="grid grid-cols-3 gap-2">
                      {[selectedMovie.picture1, selectedMovie.picture2, selectedMovie.picture3].filter(Boolean).map((pic, idx) => (
                        <div key={`${selectedMovie.id_movie}-pic-${idx}`} className="aspect-video bg-black/60 border border-white/10 rounded-lg overflow-hidden h-16">
                          <img 
                            src={`${uploadBase}/${pic}`} 
                            alt={`Vignette ${idx + 1}`} 
                            className="w-full h-full object-cover" 
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Catégories et commentaire admin */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
                  {/* Catégories */}
                  <div className="bg-black/40 border border-white/10 rounded-lg p-3">
                    <h3 className="text-[10px] font-medium text-white/40 uppercase tracking-wider mb-2">Catégories</h3>
                    {categories.length === 0 ? (
                      <p className="text-xs text-white/40">Aucune catégorie.</p>
                    ) : (
                      <div className="flex gap-2">
                        <select
                          value={(categorySelection[selectedMovie.id_movie] || [""])[0] || ""}
                          onChange={(event) => {
                            const value = event.target.value;
                            setCategorySelection((prev) => ({
                              ...prev,
                              [selectedMovie.id_movie]: value ? [Number(value)] : []
                            }));
                          }}
                          className="flex-1 bg-black/60 border border-white/10 text-white px-2 py-1 text-xs rounded-lg focus:outline-none focus:ring-1 focus:ring-purple-500/30"
                        >
                          <option value="" className="bg-[#1a1c20]">Sélectionner</option>
                          {categories.map((category) => (
                            <option key={`${selectedMovie.id_movie}-cat-${category.id_categorie}`} value={category.id_categorie} className="bg-[#1a1c20]">
                              {category.name}
                            </option>
                          ))}
                        </select>
                        <button
                          type="button"
                          onClick={() => categoryMutation.mutate({
                            id: selectedMovie.id_movie,
                            categories: categorySelection[selectedMovie.id_movie] || []
                          })}
                          className="px-3 py-1 bg-white/5 border border-white/10 text-white/80 text-xs rounded-lg hover:bg-white/10"
                        >
                          OK
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Commentaire admin */}
                  <div className="bg-black/40 border border-white/10 rounded-lg p-3">
                    <h3 className="text-[10px] font-medium text-white/40 uppercase tracking-wider mb-2">Commentaire</h3>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={adminComment}
                        onChange={(event) => setAdminComment(event.target.value)}
                        placeholder="Ajouter un commentaire..."
                        className="flex-1 bg-black/60 border border-white/10 text-white px-2 py-1 text-xs rounded-lg focus:outline-none focus:ring-1 focus:ring-purple-500/30 placeholder:text-white/30"
                      />
                      <button
                        type="button"
                        onClick={() => updateMovieMutation.mutate({
                          id: selectedMovie.id_movie,
                          payload: { admin_comment: adminComment }
                        })}
                        className="px-3 py-1 bg-white/5 border border-white/10 text-white/80 text-xs rounded-lg hover:bg-white/10"
                      >
                        OK
                      </button>
                    </div>
                  </div>
                </div>

                {/* Votes */}
                {(voteSummaryByMovie[selectedMovie.id_movie]?.votes || []).length > 0 && (
                  <div className="bg-black/40 border border-white/10 rounded-lg p-3">
                    <h3 className="text-[10px] font-medium text-white/40 uppercase tracking-wider mb-2">Votes des jurys</h3>
                    
                    {/* Résumé compact */}
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <span className="text-[9px] text-white/40">Moyenne</span>
                        <p className="text-lg font-bold text-white">
                          {voteSummaryByMovie[selectedMovie.id_movie].average.toFixed(2)}
                        </p>
                      </div>
                      <div className="flex gap-3">
                        <div className="text-center">
                          <p className="text-sm font-bold text-green-400">{voteSummaryByMovie[selectedMovie.id_movie].YES}</p>
                          <p className="text-[9px] text-white/40">👍</p>
                        </div>
                        <div className="text-center">
                          <p className="text-sm font-bold text-yellow-400">{voteSummaryByMovie[selectedMovie.id_movie]["TO DISCUSS"]}</p>
                          <p className="text-[9px] text-white/40">🗣️</p>
                        </div>
                        <div className="text-center">
                          <p className="text-sm font-bold text-red-400">{voteSummaryByMovie[selectedMovie.id_movie].NO}</p>
                          <p className="text-[9px] text-white/40">👎</p>
                        </div>
                      </div>
                    </div>

                    {/* Détail compact */}
                    <div className="space-y-1 max-h-32 overflow-y-auto scrollbar-thin-dark text-xs">
                      {(voteSummaryByMovie[selectedMovie.id_movie]?.votes || []).map((vote) => {
                        const isModified = vote.modification_count > 0;
                        return (
                          <div key={`vote-${vote.id_vote}`} className="bg-black/60 border border-white/10 rounded p-2">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <span className="text-[10px] font-medium text-white">
                                  {vote.User ? `${vote.User.first_name} ${vote.User.last_name}` : `Jury #${vote.id_user}`}
                                </span>
                                {isModified && (
                                  <span className="px-1 py-0.5 bg-orange-500/20 text-orange-300 text-[8px] rounded-full border border-orange-500/30">
                                    2e vote
                                  </span>
                                )}
                              </div>
                              <span className="text-[10px] font-medium text-white">
                                {voteLabels[getVoteCategory(vote.note)] || vote.note}
                              </span>
                            </div>
                            {vote.commentaire && (
                              <p className="text-[9px] text-white/40 mt-1 line-clamp-1">{vote.commentaire}</p>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}