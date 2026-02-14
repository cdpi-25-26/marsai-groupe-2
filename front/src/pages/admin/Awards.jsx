/**
 * Composant Awards (Gestion des Prix)
 * Page administrateur pour créer, modifier et gérer les prix du festival
 * @returns {JSX.Element} La page de gestion des prix
 */
import { useState, useMemo } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getAwards, createAward, deleteAward } from "../../api/awards.js";
import { getVideos } from "../../api/videos.js";

function Awards() {
  const queryClient = useQueryClient();
  const [awardName, setAwardName] = useState("");
  const [selectedMovieId, setSelectedMovieId] = useState("");
  const [feedback, setFeedback] = useState(null);
  const [filterMovie, setFilterMovie] = useState("");

  const { data: awardsData, isPending: awardsLoading, isError: awardsError } = useQuery({
    queryKey: ["awards"],
    queryFn: getAwards,
  });

  const { data: moviesData } = useQuery({
    queryKey: ["listVideos"],
    queryFn: getVideos,
  });

  const awards = awardsData?.data || [];
  const movies = moviesData?.data || [];

  // Film approuvés uniquement
  const approvedMovies = useMemo(() => {
    return movies.filter((movie) => movie.selection_status === "selected");
  }, [movies]);

  // Grouper les prix par film
  const awardsByMovie = useMemo(() => {
    const grouped = {};
    awards.forEach((award) => {
      if (!grouped[award.id_movie]) {
        grouped[award.id_movie] = [];
      }
      grouped[award.id_movie].push(award);
    });
    return grouped;
  }, [awards]);

  // Liste des noms de prix uniques pour suggestions
  const awardNames = useMemo(() => {
    return Array.from(new Set(awards.map((award) => award.award_name))).filter(Boolean);
  }, [awards]);

  const createAwardMutation = useMutation({
    mutationFn: ({ id_movie, award_name }) => createAward(id_movie, award_name),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["awards"] });
      queryClient.invalidateQueries({ queryKey: ["listVideos"] });
      setAwardName("");
      setSelectedMovieId("");
      setFeedback({ type: "success", message: "Prix attribué avec succès" });
      setTimeout(() => setFeedback(null), 3000);
    },
    onError: () => {
      setFeedback({ type: "error", message: "Erreur lors de l'attribution du prix" });
      setTimeout(() => setFeedback(null), 3000);
    },
  });

  const deleteAwardMutation = useMutation({
    mutationFn: (id) => deleteAward(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["awards"] });
      queryClient.invalidateQueries({ queryKey: ["listVideos"] });
      setFeedback({ type: "success", message: "Prix supprimé avec succès" });
      setTimeout(() => setFeedback(null), 3000);
    },
    onError: () => {
      setFeedback({ type: "error", message: "Erreur lors de la suppression du prix" });
      setTimeout(() => setFeedback(null), 3000);
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!awardName.trim() || !selectedMovieId) return;

    createAwardMutation.mutate({
      id_movie: Number(selectedMovieId),
      award_name: awardName.trim(),
    });
  };

  const handleDeleteAward = (award) => {
    const movie = movies.find((m) => m.id_movie === award.id_movie);
    const movieTitle = movie ? movie.title : `Film #${award.id_movie}`;
    if (window.confirm(`Supprimer le prix "${award.award_name}" pour "${movieTitle}" ?`)) {
      deleteAwardMutation.mutate(award.id_award);
    }
  };

  // Filtrer les films affichés
  const filteredMovies = useMemo(() => {
    if (!filterMovie) return approvedMovies;
    return approvedMovies.filter((movie) =>
      movie.title.toLowerCase().includes(filterMovie.toLowerCase())
    );
  }, [approvedMovies, filterMovie]);

  if (awardsLoading) {
    return (
      <div className="min-h-screen bg-[#0d0f12] text-white p-8">
        <div className="text-gray-300">Chargement en cours...</div>
      </div>
    );
  }

  if (awardsError) {
    return (
      <div className="min-h-screen bg-[#0d0f12] text-white p-8">
        <div className="text-red-300">Une erreur est survenue lors du chargement des prix</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0d0f12] text-white p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-[#AD46FF] to-[#F6339A] bg-clip-text text-transparent">
            Gestion des Prix
          </h1>
          <p className="text-gray-400 mt-2">
            Attribuez et gérez les prix pour les films approuvés du festival
          </p>
        </div>

        {/* Feedback */}
        {feedback && (
          <div
            className={`mb-6 px-4 py-3 rounded-lg border ${
              feedback.type === "success"
                ? "bg-green-900/30 border-green-600 text-green-300"
                : "bg-red-900/30 border-red-600 text-red-300"
            }`}
          >
            {feedback.message}
          </div>
        )}

        {/* Form */}
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">Attribuer un nouveau prix</h2>
          {approvedMovies.length === 0 ? (
            <p className="text-gray-400">Aucun film approuvé disponible pour attribuer un prix.</p>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-400 mb-2">Film approuvé</label>
                  <select
                    value={selectedMovieId}
                    onChange={(e) => setSelectedMovieId(e.target.value)}
                    className="w-full bg-gray-950 border border-gray-700 text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#AD46FF]"
                  >
                    <option value="">Sélectionner un film</option>
                    {approvedMovies.map((movie) => (
                      <option key={movie.id_movie} value={movie.id_movie}>
                        {movie.title}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-2">Nom du prix</label>
                  <input
                    type="text"
                    value={awardName}
                    onChange={(e) => setAwardName(e.target.value)}
                    list="award-names-list"
                    placeholder="Ex: Meilleur Film, Grand Prix..."
                    className="w-full bg-gray-950 border border-gray-700 text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#AD46FF]"
                  />
                  <datalist id="award-names-list">
                    {awardNames.map((name, idx) => (
                      <option key={idx} value={name} />
                    ))}
                  </datalist>
                </div>
              </div>
              <button
                type="submit"
                disabled={!awardName.trim() || !selectedMovieId}
                className="px-6 py-2 bg-gradient-to-r from-[#AD46FF] to-[#F6339A] text-white rounded-lg hover:opacity-90 transition font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Attribuer le prix
              </button>
            </form>
          )}
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-4">
            <p className="text-gray-400 text-sm">Total des prix</p>
            <p className="text-3xl font-bold text-white mt-1">{awards.length}</p>
          </div>
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-4">
            <p className="text-gray-400 text-sm">Films primés</p>
            <p className="text-3xl font-bold text-white mt-1">
              {Object.keys(awardsByMovie).length}
            </p>
          </div>
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-4">
            <p className="text-gray-400 text-sm">Films approuvés</p>
            <p className="text-3xl font-bold text-white mt-1">{approvedMovies.length}</p>
          </div>
        </div>

        {/* Filter */}
        <div className="mb-4">
          <input
            type="text"
            value={filterMovie}
            onChange={(e) => setFilterMovie(e.target.value)}
            placeholder="Filtrer par titre de film..."
            className="w-full md:w-64 bg-gray-950 border border-gray-700 text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#AD46FF]"
          />
        </div>

        {/* List */}
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
          <h2 className="text-xl font-semibold mb-4">Prix attribués par film</h2>
          {awards.length === 0 ? (
            <p className="text-gray-400 text-center py-8">Aucun prix attribué pour le moment.</p>
          ) : (
            <div className="space-y-4">
              {filteredMovies.map((movie) => {
                const movieAwards = awardsByMovie[movie.id_movie] || [];
                if (movieAwards.length === 0) return null;

                return (
                  <div
                    key={movie.id_movie}
                    className="bg-gray-950 border border-gray-800 rounded-lg p-4"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="text-white font-semibold text-lg">{movie.title}</h3>
                        <p className="text-xs text-gray-400 mt-1">
                          {movie.duration}s • {movie.main_language || "-"}
                        </p>
                      </div>
                      <span className="bg-gradient-to-r from-[#AD46FF] to-[#F6339A] text-white text-xs font-bold px-3 py-1 rounded-full">
                        {movieAwards.length} prix
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {movieAwards.map((award) => (
                        <button
                          key={award.id_award}
                          onClick={() => handleDeleteAward(award)}
                          className="bg-purple-900/40 text-purple-200 px-3 py-1.5 rounded-lg hover:bg-purple-900/70 transition text-sm flex items-center gap-2"
                          title="Cliquer pour supprimer"
                        >
                          <span>🏆 {award.award_name}</span>
                          <span className="text-xs opacity-70">✕</span>
                        </button>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Awards;
