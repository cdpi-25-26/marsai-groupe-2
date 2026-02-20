/**
 * Composant ProducerFilms
 * Affiche la liste des films soumis, le modal de détail, et l'édition des collaborateurs.
 * Props:
 * - movies: array — liste des films du producteur
 * - onMoviesUpdate: function(newMovies) — appelée après mise à jour des collaborateurs
 */

import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { VideoPreview } from "../../components/VideoPreview.jsx";
import { getMyMovies, updateMovieCollaborators } from "../../api/movies";

const uploadBase = "http://localhost:3000/uploads";

function getPoster(movie) {
  if (movie.thumbnail) return `${uploadBase}/${movie.thumbnail}`;
  if (movie.display_picture) return `${uploadBase}/${movie.display_picture}`;
  if (movie.picture1) return `${uploadBase}/${movie.picture1}`;
  return null;
}

export default function ProducerFilms({ movies, onMoviesUpdate }) {
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [editingMovieId, setEditingMovieId] = useState(null);
  const [collabDrafts, setCollabDrafts] = useState({});
  const [movieError, setMovieError] = useState(null);

  const updateCollaboratorsMutation = useMutation({
    mutationFn: ({ id, collaborators }) => updateMovieCollaborators(id, collaborators),
    onSuccess: async () => {
      try {
        const moviesRes = await getMyMovies();
        onMoviesUpdate(moviesRes.data || []);
      } catch {
        // ignore refresh errors
      }
      setEditingMovieId(null);
    },
    onError: () => {
      setMovieError("Erreur lors de la mise à jour des collaborateurs.");
    }
  });

  function startEditCollaborators(movie) {
    const existing = (movie.Collaborators || []).map((c) => ({
      first_name: c.first_name || "",
      last_name: c.last_name || "",
      email: c.email || "",
      job: c.job || ""
    }));
    setCollabDrafts((prev) => ({
      ...prev,
      [movie.id_movie]: existing.length ? existing : [{ first_name: "", last_name: "", email: "", job: "" }]
    }));
    setEditingMovieId(movie.id_movie);
  }

  function updateDraftField(movieId, index, field, value) {
    setCollabDrafts((prev) => {
      const list = [...(prev[movieId] || [])];
      if (!list[index]) return prev;
      list[index] = { ...list[index], [field]: value };
      return { ...prev, [movieId]: list };
    });
  }

  function addDraftCollaborator(movieId) {
    setCollabDrafts((prev) => ({
      ...prev,
      [movieId]: [...(prev[movieId] || []), { first_name: "", last_name: "", email: "", job: "" }]
    }));
  }

  function removeDraftCollaborator(movieId, index) {
    setCollabDrafts((prev) => {
      const list = [...(prev[movieId] || [])];
      list.splice(index, 1);
      return { ...prev, [movieId]: list };
    });
  }

  return (
    <section id="films" className="bg-gray-900 rounded-2xl p-8 border border-gray-800 shadow-2xl">
      <h2 className="text-2xl font-bold mb-6">Votre film soumis</h2>

      {movieError && (
        <div className="bg-red-900/30 border border-red-600 text-red-300 px-4 py-3 rounded-lg mb-4">{movieError}</div>
      )}

      {movies.length === 0 ? (
        <p className="text-gray-400">Aucun film soumis pour le moment.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
          {movies.map((movie) => {
            const poster = getPoster(movie);
            return (
              <button
                key={movie.id_movie}
                type="button"
                onClick={() => setSelectedMovie(movie)}
                className="text-left bg-gray-950 border border-gray-800 rounded-xl p-4 hover:border-gray-600 transition"
              >
                <div className="aspect-video bg-gray-800 rounded-lg overflow-hidden">
                  {poster ? (
                    <img src={poster} alt={movie.title} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-500 text-sm">Aucune vignette</div>
                  )}
                </div>
                <div className="mt-3">
                  <h3 className="text-lg font-semibold text-white">{movie.title}</h3>
                  <p className="text-sm text-gray-400 mt-1 line-clamp-2">{movie.synopsis || movie.description || "-"}</p>
                  <div className="mt-2 text-xs text-gray-400 flex flex-wrap gap-3">
                    <span>{movie.duration ? `${movie.duration}s` : "-"}</span>
                    <span>{movie.main_language || "-"}</span>
                    <span>{movie.nationality || "-"}</span>
                    <span>{movie.selection_status || "submitted"}</span>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      )}

      {/* ── Movie Detail Modal ── */}
      {selectedMovie && (
        <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4">
          <div className="bg-gray-950 border border-gray-800 rounded-2xl w-full max-w-5xl max-h-[90vh] overflow-y-auto p-6">
            <div className="flex items-center justify-between">
              <h3 className="text-2xl font-bold text-white">{selectedMovie.title}</h3>
              <button type="button" onClick={() => setSelectedMovie(null)} className="text-gray-400 hover:text-white">✕</button>
            </div>

            <p className="text-gray-400 mt-2">{selectedMovie.synopsis || selectedMovie.description || "-"}</p>

            <div className="grid grid-cols-2 gap-4 mt-4 text-sm text-gray-300">
              <div><span className="text-gray-400">Durée:</span> {selectedMovie.duration ? `${selectedMovie.duration}s` : "-"}</div>
              <div><span className="text-gray-400">Langue:</span> {selectedMovie.main_language || "-"}</div>
              <div><span className="text-gray-400">Nationalité:</span> {selectedMovie.nationality || "-"}</div>
              <div><span className="text-gray-400">Statut:</span> {selectedMovie.selection_status || "submitted"}</div>
              <div><span className="text-gray-400">Outils IA:</span> {selectedMovie.ai_tool || "-"}</div>
              <div><span className="text-gray-400">Méthodologie:</span> {selectedMovie.workshop || "-"}</div>
              <div><span className="text-gray-400">Production:</span> {selectedMovie.production || "-"}</div>
              <div>
                <span className="text-gray-400">Sous-titres:</span>{" "}
                {selectedMovie.subtitle ? (
                  <a className="text-[#AD46FF] hover:text-[#F6339A]" href={`${uploadBase}/${selectedMovie.subtitle}`} target="_blank" rel="noreferrer">Télécharger</a>
                ) : "-"}
              </div>
            </div>

            <div className="mt-4 flex flex-wrap gap-3">
              {selectedMovie.trailer && (
                <a className="text-[#AD46FF] hover:text-[#F6339A] font-semibold" href={`${uploadBase}/${selectedMovie.trailer}`} target="_blank" rel="noreferrer">Ouvrir la vidéo</a>
              )}
              {selectedMovie.youtube_link && (
                <a className="text-[#AD46FF] hover:text-[#F6339A] font-semibold" href={selectedMovie.youtube_link} target="_blank" rel="noreferrer">Voir sur YouTube</a>
              )}
            </div>

            {(selectedMovie.trailer || selectedMovie.youtube_link) && (
              <div className="mt-4">
                {selectedMovie.trailer ? (
                  <VideoPreview
                    title={selectedMovie.title}
                    src={`${uploadBase}/${selectedMovie.trailer}`}
                    poster={getPoster(selectedMovie) || undefined}
                  />
                ) : (
                  <a className="text-[#AD46FF] hover:text-[#F6339A]" href={selectedMovie.youtube_link} target="_blank" rel="noreferrer">Ouvrir la vidéo</a>
                )}
              </div>
            )}

            {/* ── Collaborateurs ── */}
            <div className="mt-6">
              <div className="flex items-center justify-between">
                <h4 className="text-sm uppercase text-gray-400">Collaborateurs</h4>
                <button type="button" onClick={() => startEditCollaborators(selectedMovie)} className="text-sm text-[#AD46FF] hover:text-[#F6339A]">Modifier</button>
              </div>

              {selectedMovie.Collaborators?.length ? (
                <ul className="mt-2 text-sm text-gray-300 space-y-1">
                  {selectedMovie.Collaborators.map((collab) => (
                    <li key={collab.id_collaborator}>
                      {collab.first_name} {collab.last_name} {collab.job ? `— ${collab.job}` : ""}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-gray-500 mt-2">Aucun collaborateur.</p>
              )}

              {editingMovieId === selectedMovie.id_movie && (
                <div className="mt-4 space-y-3">
                  {(collabDrafts[selectedMovie.id_movie] || []).map((collab, idx) => (
                    <div key={`${selectedMovie.id_movie}-collab-${idx}`} className="grid grid-cols-1 md:grid-cols-4 gap-3 bg-gray-900 border border-gray-800 p-3 rounded-lg">
                      <input type="text" placeholder="Prénom" value={collab.first_name}
                        onChange={(e) => updateDraftField(selectedMovie.id_movie, idx, "first_name", e.target.value)}
                        className="bg-gray-800 border border-gray-700 text-white px-3 py-2 rounded-lg" />
                      <input type="text" placeholder="Nom" value={collab.last_name}
                        onChange={(e) => updateDraftField(selectedMovie.id_movie, idx, "last_name", e.target.value)}
                        className="bg-gray-800 border border-gray-700 text-white px-3 py-2 rounded-lg" />
                      <input type="email" placeholder="Email" value={collab.email}
                        onChange={(e) => updateDraftField(selectedMovie.id_movie, idx, "email", e.target.value)}
                        className="bg-gray-800 border border-gray-700 text-white px-3 py-2 rounded-lg" />
                      <input type="text" placeholder="Rôle" value={collab.job}
                        onChange={(e) => updateDraftField(selectedMovie.id_movie, idx, "job", e.target.value)}
                        className="bg-gray-800 border border-gray-700 text-white px-3 py-2 rounded-lg" />
                      <div className="md:col-span-4 flex justify-end">
                        <button type="button" onClick={() => removeDraftCollaborator(selectedMovie.id_movie, idx)} className="text-red-400 hover:text-red-300 text-sm">Supprimer</button>
                      </div>
                    </div>
                  ))}
                  <div className="flex flex-wrap gap-3">
                    <button type="button" onClick={() => addDraftCollaborator(selectedMovie.id_movie)} className="px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700">
                      Ajouter un collaborateur
                    </button>
                    <button
                      type="button"
                      onClick={() => updateCollaboratorsMutation.mutate({ id: selectedMovie.id_movie, collaborators: collabDrafts[selectedMovie.id_movie] || [] })}
                      className="px-4 py-2 bg-[#AD46FF] text-white rounded-lg hover:opacity-90"
                    >
                      Enregistrer
                    </button>
                    <button type="button" onClick={() => setEditingMovieId(null)} className="px-4 py-2 border border-gray-700 rounded-lg">
                      Annuler
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </section>
  );
}