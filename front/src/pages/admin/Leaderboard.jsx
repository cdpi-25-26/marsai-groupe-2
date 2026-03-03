/**
 * Composant Leaderboard (Gestion du système de votation)
 * Permet à l'admin de gérer les films à voter, votés, refusés, et à primer.
 * Filtres, actions de masse, commentaires, visualisation des votes et classement.
 */
import React, { useEffect, useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  getVideos,
  updateMovieStatus,
  updateMovie,
  deleteMovie
} from "../../api/videos";
import { getVotes } from "../../api/votes";
import { VideoPreview } from "../../components/VideoPreview";

function Leaderboard() {
  const queryClient = useQueryClient();
  const [filter, setFilter] = useState("");
  const [activeTab, setActiveTab] = useState("to_vote");
  const [selectedMovies, setSelectedMovies] = useState([]);
  const [comment, setComment] = useState("");
  const [message, setMessage] = useState("");
  const [showVotesModal, setShowVotesModal] = useState(false);
  const [movieToView, setMovieToView] = useState(null);
  const [commentByMovie, setCommentByMovie] = useState({});
  const uploadBase = "http://localhost:3000/uploads";

  // Fetch all movies
  const { data } = useQuery({
    queryKey: ["movies"],
    queryFn: getVideos,
  });
  const { data: votesData } = useQuery({
    queryKey: ["votes"],
    queryFn: getVotes,
  });

  const movies = data?.data || [];
  const votes = votesData?.data || [];

  // Pagination state (moved outside mutation)
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  useEffect(() => {
    setCurrentPage(1);
  }, [activeTab, filter]);

  // Group movies by status
  const grouped = useMemo(() => ({
    to_vote: movies.filter(m => m.selection_status === "assigned"),
    voted: movies.filter(m => ["to_discuss", "selected", "finalist"].includes(m.selection_status)),
    refused: movies.filter(m => m.selection_status === "refused"),
    candidate: movies.filter(m => m.selection_status === "candidate"),
    awarded: movies.filter(m => m.selection_status === "awarded"),
  }), [movies]);

  const votesByMovie = useMemo(() => {
    return votes.reduce((acc, vote) => {
      if (!acc[vote.id_movie]) acc[vote.id_movie] = [];
      acc[vote.id_movie].push(vote);
      return acc;
    }, {});
  }, [votes]);

  // Filtraggio
  const filteredMovies = useMemo(() => {
    return (grouped[activeTab] || []).filter((movie) =>
      movie.title.toLowerCase().includes(filter.toLowerCase())
    );
  }, [grouped, activeTab, filter]);

  // Mutations
  const statusMutation = useMutation({
    mutationFn: async ({ id, status }) => updateMovieStatus(id, status),
    onSuccess: () => {
      setMessage("Statut mis à jour");
      queryClient.invalidateQueries({ queryKey: ["movies"] });
      queryClient.invalidateQueries({ queryKey: ["listVideos"] });
      setSelectedMovies([]);
    },
    onError: () => setMessage("Erreur lors du changement de statut"),
  });
  const commentMutation = useMutation({
    mutationFn: async ({ id, comment }) => updateMovie(id, { admin_comment: comment }),
    onSuccess: () => {
      setMessage("Commentaire enregistré");
      queryClient.invalidateQueries({ queryKey: ["movies"] });
      queryClient.invalidateQueries({ queryKey: ["listVideos"] });
    },
    onError: () => setMessage("Erreur lors de l'enregistrement du commentaire"),
  });
  const deleteMutation = useMutation({
    mutationFn: async (id) => deleteMovie(id),
    onSuccess: () => {
      setMessage("Film supprimé");
      queryClient.invalidateQueries({ queryKey: ["movies"] });
      queryClient.invalidateQueries({ queryKey: ["listVideos"] });
    },
    onError: () => setMessage("Erreur lors de la suppression"),
  });

  // Actions
  function handleSelect(movie) {
    setSelectedMovies((prev) => prev.includes(movie.id_movie)
      ? prev.filter(id => id !== movie.id_movie)
      : [...prev, movie.id_movie]);
  }
  function handleBulkStatus(status) {
    selectedMovies.forEach(id => statusMutation.mutate({ id, status }));
  }

  function handleSetStatus(movie, status) {
    statusMutation.mutate({ id: movie.id_movie, status });
  }

  function handleComment(movie) {
    const value = (commentByMovie[movie.id_movie] || "").trim();
    if (!value) return;
    commentMutation.mutate({ id: movie.id_movie, comment: value });
    setCommentByMovie((prev) => ({ ...prev, [movie.id_movie]: "" }));
  }
  function handleDelete(movie) {
    if (window.confirm("Supprimer ce film ?")) deleteMutation.mutate(movie.id_movie);
  }
  function handleViewVotes(movie) {
    setMovieToView(movie);
    setShowVotesModal(true);
  }

  const paginatedMovies = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredMovies.slice(start, start + itemsPerPage);
  }, [filteredMovies, currentPage, itemsPerPage]);

  const totalPages = useMemo(() => {
    return Math.max(1, Math.ceil(filteredMovies.length / itemsPerPage));
  }, [filteredMovies.length, itemsPerPage]);

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  const selectedMovieVotes = useMemo(() => {
    if (!movieToView) return [];
    return votesByMovie[movieToView.id_movie] || [];
  }, [movieToView, votesByMovie]);

  function getPoster(movie) {
    if (!movie) return null;
    return movie.thumbnail || movie.display_picture || movie.picture1 || movie.picture2 || movie.picture3 || null;
  }

  function getTrailer(movie) {
    if (!movie) return null;
    return movie.trailer || movie.trailer_video || movie.trailerVideo || movie.filmFile || movie.video || null;
  }

  // Classement (top 10 par score moyen)
  const leaderboard = useMemo(() => {
    return [...movies]
      .filter(m => typeof m.average_score === "number")
      .sort((a, b) => b.average_score - a.average_score)
      .slice(0, 10);
  }, [movies]);

  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-3xl font-bold bg-gradient-to-r from-[#AD46FF] to-[#F6339A] bg-clip-text text-transparent">
          Système de Votation & Classement
        </h1>
        <p className="text-gray-400 mt-2">Suivi des films à voter, votés, refusés, candidats et primés.</p>
      </div>

      <div className="flex gap-2 border-b border-gray-800">
        <button
          onClick={() => setActiveTab("to_vote")}
          className={`px-4 py-2 font-semibold transition-colors ${
            activeTab === "to_vote"
              ? "text-[#AD46FF] border-b-2 border-[#AD46FF]"
              : "text-gray-400 hover:text-white"
          }`}
        >
          À Voter
        </button>
        <button
          onClick={() => setActiveTab("voted")}
          className={`px-4 py-2 font-semibold transition-colors ${
            activeTab === "voted"
              ? "text-[#AD46FF] border-b-2 border-[#AD46FF]"
              : "text-gray-400 hover:text-white"
          }`}
        >
          Votés
        </button>
        <button
          onClick={() => setActiveTab("refused")}
          className={`px-4 py-2 font-semibold transition-colors ${
            activeTab === "refused"
              ? "text-[#AD46FF] border-b-2 border-[#AD46FF]"
              : "text-gray-400 hover:text-white"
          }`}
        >
          Refusés
        </button>
        <button
          onClick={() => setActiveTab("candidate")}
          className={`px-4 py-2 font-semibold transition-colors ${
            activeTab === "candidate"
              ? "text-[#AD46FF] border-b-2 border-[#AD46FF]"
              : "text-gray-400 hover:text-white"
          }`}
        >
          Candidats
        </button>
        <button
          onClick={() => setActiveTab("awarded")}
          className={`px-4 py-2 font-semibold transition-colors ${
            activeTab === "awarded"
              ? "text-[#AD46FF] border-b-2 border-[#AD46FF]"
              : "text-gray-400 hover:text-white"
          }`}
        >
          Primés
        </button>
      </div>
      <div className="mb-4 flex gap-2 items-center">
        <input type="text" placeholder="Filtrer par titre..." value={filter} onChange={e => setFilter(e.target.value)} className="border px-2 py-1 rounded bg-gray-900 border-gray-700 text-white" />
        {selectedMovies.length > 0 && (
          <>
            <button onClick={() => handleBulkStatus("refused")} className="bg-red-500 text-white px-2 py-1 rounded">Refuser</button>
            <button onClick={() => handleBulkStatus("candidate")} className="bg-yellow-400 px-2 py-1 rounded">Candidater</button>
            <button onClick={() => handleBulkStatus("awarded")} className="bg-green-600 text-white px-2 py-1 rounded">Primer</button>
          </>
        )}
      </div>
      {message && <div className="mb-2 text-green-600">{message}</div>}
      {filteredMovies.length === 0 ? (
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-8 text-center text-gray-400">
          Aucun film dans cet onglet.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {paginatedMovies.map(movie => (
          <div key={movie.id_movie} className={`border border-gray-800 bg-gray-900/50 rounded p-3 relative ${selectedMovies.includes(movie.id_movie) ? 'ring-2 ring-blue-500' : ''}`}>
            <input type="checkbox" checked={selectedMovies.includes(movie.id_movie)} onChange={() => handleSelect(movie)} className="absolute top-2 left-2" />
            <div className="flex gap-3">
              <img src={getPoster(movie) ? `${uploadBase}/${getPoster(movie)}` : undefined} alt="Vignette" className="w-24 h-16 object-cover rounded bg-gray-800" />
              <div className="flex-1">
                <h2 className="font-bold text-lg">{movie.title}</h2>
                <p className="text-sm text-gray-400 line-clamp-2">{movie.synopsis}</p>
                <div className="flex gap-2 mt-2">
                  <button className="text-blue-600 underline text-xs" onClick={() => handleViewVotes(movie)}>Voir votes</button>
                  <button className="text-yellow-600 underline text-xs" onClick={() => handleSetStatus(movie, "candidate")}>Candidater</button>
                  <button className="text-green-600 underline text-xs" onClick={() => handleSetStatus(movie, "awarded")}>Primer</button>
                  <button className="text-purple-400 underline text-xs" onClick={() => handleSetStatus(movie, "to_discuss")}>Relancer vote</button>
                  <button className="text-red-600 underline text-xs" onClick={() => handleSetStatus(movie, "refused")}>Refuser</button>
                  <button className="text-gray-600 underline text-xs" onClick={() => handleDelete(movie)}>Supprimer</button>
                </div>
                <div className="mt-2">
                  <textarea
                    value={commentByMovie[movie.id_movie] || ""}
                    onChange={e => setCommentByMovie((prev) => ({ ...prev, [movie.id_movie]: e.target.value }))}
                    placeholder="Commentaire admin..."
                    className="border border-gray-700 bg-gray-950 text-gray-200 px-2 py-1 rounded w-full text-xs"
                  />
                  <button className="bg-blue-600 text-white px-2 py-1 rounded mt-1 text-xs" onClick={() => handleComment(movie)}>Enregistrer commentaire</button>
                </div>
              </div>
            </div>
          </div>
          ))}
        </div>
      )}
      <div className="mt-4 flex items-center justify-end gap-2">
        <button
          type="button"
          onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
          disabled={currentPage <= 1}
          className="px-3 py-1 rounded bg-gray-800 text-white disabled:opacity-40"
        >
          Prev
        </button>
        <span className="text-sm text-gray-400">{currentPage} / {totalPages}</span>
        <button
          type="button"
          onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
          disabled={currentPage >= totalPages}
          className="px-3 py-1 rounded bg-gray-800 text-white disabled:opacity-40"
        >
          Next
        </button>
      </div>
      {/* Classement Top 10 */}
      <div className="mt-8">
        <h2 className="text-xl font-bold mb-2">Classement des Meilleurs Films</h2>
        <ol className="list-decimal ml-6">
          {leaderboard.map((movie, idx) => (
            <li key={movie.id_movie} className="mb-1">
              <span className="font-bold">{idx + 1}. {movie.title}</span> — Score moyen: <span className="text-green-700 font-semibold">{movie.average_score}</span>
            </li>
          ))}
        </ol>
      </div>
      {/* Modal votes */}
      {showVotesModal && movieToView && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-950 border border-gray-800 rounded-2xl p-6 w-full max-w-5xl max-h-[92vh] overflow-auto">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-white">Votes pour {movieToView.title}</h2>
              <button className="px-3 py-1 bg-gray-800 text-gray-200 rounded hover:bg-gray-700" onClick={() => setShowVotesModal(false)}>Fermer</button>
            </div>

            <div className="grid grid-cols-12 gap-3">
              <div className="col-span-12 xl:col-span-7 bg-gray-900/60 border border-gray-800 rounded-lg p-3">
                <h4 className="text-xs uppercase text-gray-400 mb-2">Prévisualisation</h4>
                {(getTrailer(movieToView) || movieToView.youtube_link) ? (
                  <div className="aspect-video h-[230px]">
                    {getTrailer(movieToView) ? (
                      <VideoPreview
                        title={movieToView.title}
                        src={`${uploadBase}/${getTrailer(movieToView)}`}
                        poster={getPoster(movieToView) ? `${uploadBase}/${getPoster(movieToView)}` : undefined}
                        openMode="fullscreen"
                        modalPlacement="bottom"
                        modalTopOffsetClass="top-20 left-0 right-0 bottom-0"
                      />
                    ) : (
                      <a href={movieToView.youtube_link} target="_blank" rel="noreferrer" className="text-[#AD46FF] hover:text-[#F6339A]">
                        Ouvrir la vidéo YouTube
                      </a>
                    )}
                  </div>
                ) : (
                  <p className="text-gray-500">Aucune vidéo disponible.</p>
                )}
              </div>

              <div className="col-span-12 xl:col-span-5 bg-gray-900/60 border border-gray-800 rounded-lg p-3">
                <h4 className="text-xs uppercase text-gray-400 mb-2">Actions admin</h4>
                <div className="grid grid-cols-2 gap-2">
                  <button className="px-3 py-2 bg-yellow-600/80 text-white rounded hover:bg-yellow-600" onClick={() => handleSetStatus(movieToView, "candidate")}>Candidater</button>
                  <button className="px-3 py-2 bg-green-600/80 text-white rounded hover:bg-green-600" onClick={() => handleSetStatus(movieToView, "awarded")}>Primer</button>
                  <button className="px-3 py-2 bg-purple-700/80 text-white rounded hover:bg-purple-700" onClick={() => handleSetStatus(movieToView, "to_discuss")}>Relancer vote</button>
                  <button className="px-3 py-2 bg-red-600/80 text-white rounded hover:bg-red-600" onClick={() => handleSetStatus(movieToView, "refused")}>Refuser</button>
                </div>
              </div>

              <div className="col-span-12 bg-gray-900/60 border border-gray-800 rounded-lg p-3">
                <h4 className="text-xs uppercase text-gray-400 mb-2">Votations effectuées</h4>
                {selectedMovieVotes.length === 0 ? (
                  <p className="text-gray-500">Aucun vote pour ce film.</p>
                ) : (
                  <div className="space-y-2 max-h-64 overflow-auto pr-1">
                    {selectedMovieVotes.map((vote) => (
                      <div key={vote.id_vote} className="bg-gray-950 border border-gray-800 rounded-lg p-2">
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-gray-300">
                            {vote.User ? `${vote.User.first_name || ""} ${vote.User.last_name || ""}`.trim() : `Jury #${vote.id_user}`}
                          </span>
                          <span className="text-white font-semibold">Note: {vote.note}</span>
                        </div>
                        {vote.comments && <p className="text-[11px] text-gray-400 mt-1">{vote.comments}</p>}
                      </div>
                    ))}
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

export default Leaderboard;
