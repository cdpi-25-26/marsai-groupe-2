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
    import GlassTableBody from "../../components/admin/GlassTableBody.jsx";
    import Pagination from "../../components/admin/Pagination.jsx";

function Leaderboard() {
  const queryClient = useQueryClient();
  const [filter, setFilter] = useState("");
  const [activeTab, setActiveTab] = useState("to_vote");
  const [selectedMovies, setSelectedMovies] = useState([]);
  const [comment, setComment] = useState("");
  const [message, setMessage] = useState("");
  const [showVotesModal, setShowVotesModal] = useState(false);
  const [movieToView, setMovieToView] = useState(null);

  // Fetch all movies
  const { data, refetch } = useQuery({
    queryKey: ["movies"],
    queryFn: getVideos,
  });
  const movies = data?.data || [];

  // Pagination state (moved outside mutation)
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // Group movies by status
  const grouped = useMemo(() => ({
    to_vote: movies.filter(m => m.selection_status === "assigned"),
    voted: movies.filter(m => m.selection_status === "voted"),
    refused: movies.filter(m => m.selection_status === "refused"),
    awarded: movies.filter(m => m.selection_status === "awarded"),
  }), [movies]);

  // Filtraggio
  const filteredMovies = useMemo(() => {
    return (grouped[activeTab] || []).filter((movie) =>
      movie.title.toLowerCase().includes(filter.toLowerCase())
    );
  }, [grouped, activeTab, filter]);

  // Mutations
  const statusMutation = useMutation({
    mutationFn: async ({ id, status }) => updateMovieStatus(id, status),
    onSuccess: () => { setMessage("Statut mis à jour"); refetch(); setSelectedMovies([]); },
    onError: () => setMessage("Erreur lors du changement de statut"),
  });
  const commentMutation = useMutation({
    mutationFn: async ({ id, comment }) => updateMovie(id, { admin_comment: comment }),
    onSuccess: () => { setMessage("Commentaire enregistré"); refetch(); },
    onError: () => setMessage("Erreur lors de l'enregistrement du commentaire"),
  });
  const deleteMutation = useMutation({
    mutationFn: async (id) => deleteMovie(id),
    onSuccess: () => { setMessage("Film supprimé"); refetch(); },
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
  function handleComment(movie) {
      // Pagination
      const paginatedMovies = useMemo(() => {
        const start = (currentPage - 1) * itemsPerPage;
        return filteredMovies.slice(start, start + itemsPerPage);
      }, [filteredMovies, currentPage, itemsPerPage]);

      const totalPages = useMemo(() => {
        return Math.max(1, Math.ceil(filteredMovies.length / itemsPerPage));
      }, [filteredMovies.length, itemsPerPage]);
    commentMutation.mutate({ id: movie.id_movie, comment });
    setComment("");
  }
  function handleDelete(movie) {
    if (window.confirm("Supprimer ce film ?")) deleteMutation.mutate(movie.id_movie);
  }
  function handleViewVotes(movie) {
    setMovieToView(movie);
    setShowVotesModal(true);
  }

  // Classement (top 10 par score moyen)
  const leaderboard = useMemo(() => {
    return [...movies]
      .filter(m => typeof m.average_score === "number")
      .sort((a, b) => b.average_score - a.average_score)
      .slice(0, 10);
  }, [movies]);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Système de Votation & Classement</h1>
      <div className="flex gap-2 mb-4">
        <button onClick={() => setActiveTab("to_vote")} className={activeTab === "to_vote" ? "font-bold" : ""}>À Voter</button>
        <button onClick={() => setActiveTab("voted")} className={activeTab === "voted" ? "font-bold" : ""}>Votés</button>
        <button onClick={() => setActiveTab("refused")} className={activeTab === "refused" ? "font-bold" : ""}>Refusés</button>
        <button onClick={() => setActiveTab("candidate")} className={activeTab === "candidate" ? "font-bold" : ""}>Candidats</button>
        <button onClick={() => setActiveTab("awarded")} className={activeTab === "awarded" ? "font-bold" : ""}>Primés</button>
      </div>
      <div className="mb-4 flex gap-2 items-center">
        <input type="text" placeholder="Filtrer par titre..." value={filter} onChange={e => setFilter(e.target.value)} className="border px-2 py-1 rounded" />
        {selectedMovies.length > 0 && (
          <>
            <button onClick={() => handleBulkStatus("refused")} className="bg-red-500 text-white px-2 py-1 rounded">Refuser</button>
            <button onClick={() => handleBulkStatus("candidate")} className="bg-yellow-400 px-2 py-1 rounded">Candidater</button>
            <button onClick={() => handleBulkStatus("awarded")} className="bg-green-600 text-white px-2 py-1 rounded">Primer</button>
          </>
        )}
      </div>
      {message && <div className="mb-2 text-green-600">{message}</div>}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredMovies.map(movie => (
          <div key={movie.id_movie} className={`border rounded p-3 relative ${selectedMovies.includes(movie.id_movie) ? 'ring-2 ring-blue-500' : ''}`}>
            <input type="checkbox" checked={selectedMovies.includes(movie.id_movie)} onChange={() => handleSelect(movie)} className="absolute top-2 left-2" />
            <div className="flex gap-3">
              <img src={movie.picture1 ? `/uploads/${movie.picture1}` : undefined} alt="Vignette" className="w-24 h-16 object-cover rounded bg-gray-200" />
              <div className="flex-1">
                <h2 className="font-bold text-lg">{movie.title}</h2>
                <p className="text-sm text-gray-600 line-clamp-2">{movie.synopsis}</p>
                <div className="flex gap-2 mt-2">
                  <button className="text-blue-600 underline text-xs" onClick={() => handleViewVotes(movie)}>Voir votes</button>
                  <button className="text-yellow-600 underline text-xs" onClick={() => handleBulkStatus("candidate")}>Candidater</button>
                  <button className="text-green-600 underline text-xs" onClick={() => handleBulkStatus("awarded")}>Primer</button>
                  <button className="text-red-600 underline text-xs" onClick={() => handleBulkStatus("refused")}>Refuser</button>
                  <button className="text-gray-600 underline text-xs" onClick={() => handleDelete(movie)}>Supprimer</button>
                </div>
                <div className="mt-2">
                  <textarea value={comment} onChange={e => setComment(e.target.value)} placeholder="Commentaire admin..." className="border px-2 py-1 rounded w-full text-xs" />
                  <button className="bg-blue-600 text-white px-2 py-1 rounded mt-1 text-xs" onClick={() => handleComment(movie)}>Enregistrer commentaire</button>
                </div>
              </div>
            </div>
          </div>
        ))}
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
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded shadow-lg w-full max-w-lg">
            <h2 className="text-xl font-bold mb-4">Votes pour {movieToView.title}</h2>
            {/* TODO: Afficher les détails des votes ici */}
            <button className="mt-4 px-4 py-2 bg-gray-300 rounded" onClick={() => setShowVotesModal(false)}>Fermer</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Leaderboard;
