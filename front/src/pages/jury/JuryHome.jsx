/**
 * Composant JuryHome (Accueil Jury)
 * Page d'accueil pour les membres du jury
 * Permet de consulter et modifier le profil
 * @returns {JSX.Element} La page d'accueil du jury
 */
import { useEffect, useState } from "react";
import { getCurrentUser } from "../../api/users";
import { getAssignedMovies } from "../../api/videos";
import { getMyVotes, submitMyVote } from "../../api/votes";
import { VideoPreview } from "../../components/VideoPreview.jsx";

export default function JuryHome() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [assignedMovies, setAssignedMovies] = useState([]);
  const [moviesError, setMoviesError] = useState(null);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [votesByMovie, setVotesByMovie] = useState({});
  const [voteForm, setVoteForm] = useState({ note: "", commentaire: "" });
  const [voteFeedback, setVoteFeedback] = useState(null);
  const [voteLoading, setVoteLoading] = useState(false);
  const [hasWatched, setHasWatched] = useState(false);
  const [confirmedWatched, setConfirmedWatched] = useState(false);
  const [archivedMovieIds, setArchivedMovieIds] = useState(() => {
    try {
      const raw = JSON.parse(localStorage.getItem("juryArchivedMovies") || "[]");
      if (!Array.isArray(raw)) return [];
      const normalized = raw
        .map((id) => Number(id))
        .filter((id) => Number.isFinite(id));
      return Array.from(new Set(normalized));
    } catch (err) {
      return [];
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
          : null
  );

  useEffect(() => {
    localStorage.setItem("juryArchivedMovies", JSON.stringify(archivedMovieIds));
  }, [archivedMovieIds]);

  useEffect(() => {
    if (selectedMovie) {
      const existingVote = votesByMovie[selectedMovie.id_movie];
      if (existingVote) {
        setVoteForm({
          note: String(existingVote.note),
          commentaire: existingVote.commentaire || ""
        });
      } else {
        setVoteForm({ note: "", commentaire: "" });
      }
      setHasWatched(false);
      setConfirmedWatched(false);
    }
  }, [selectedMovie, votesByMovie]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      setError("Non authentifié");
      setLoading(false);
      return;
    }
    getCurrentUser()
      .then(res => {
        setUser(res.data);
        setLoading(false);
      })
      .catch(() => {
        setError("Erreur lors de la récupération des données utilisateur");
        setLoading(false);
      });

    getAssignedMovies()
      .then((res) => {
        setAssignedMovies(res.data || []);
      })
      .catch(() => {
        setMoviesError("Erreur lors du chargement des films assignés.");
      });

    getMyVotes()
      .then((res) => {
        const mapped = (res.data || []).reduce((acc, vote) => {
          acc[vote.id_movie] = vote;
          return acc;
        }, {});
        setVotesByMovie(mapped);
      })
      .catch(() => {
        setVoteFeedback("Erreur lors du chargement des votes.");
      });
  }, []);

  if (loading) return <div className="min-h-screen bg-black text-white flex items-center justify-center">Chargement...</div>;
  if (error) return <div className="min-h-screen bg-black text-white flex items-center justify-center">{error}</div>;
  if (!user) return <div className="min-h-screen bg-black text-white flex items-center justify-center">Utilisateur introuvable</div>;

  function handleVoteChange(e) {
    const { name, value } = e.target;
    setVoteForm((prev) => ({ ...prev, [name]: value }));
  }

  async function handleVoteSubmit(e) {
    e.preventDefault();
    if (!selectedMovie) return;
    setVoteFeedback(null);
    setVoteLoading(true);
    try {
      const res = await submitMyVote(selectedMovie.id_movie, voteForm);
      const vote = res.data?.vote;
      if (vote) {
        setVotesByMovie((prev) => ({ ...prev, [vote.id_movie]: vote }));
        setArchivedMovieIds((prev) => (prev.includes(vote.id_movie) ? prev : [...prev, vote.id_movie]));
        setSelectedMovie(null);
      }
      setVoteFeedback("Vote enregistré.");
    } catch (err) {
      setVoteFeedback("Erreur lors de l'enregistrement du vote.");
    } finally {
      setVoteLoading(false);
    }
  }

  const voteAllowed = selectedMovie
    ? selectedMovie.trailer
      ? hasWatched
      : confirmedWatched
    : false;

  const awaitingVoteMovies = assignedMovies.filter(
    (movie) => !votesByMovie[movie.id_movie]
  );
  const votedAwaitingApprovalMovies = assignedMovies.filter(
    (movie) => votesByMovie[movie.id_movie] && movie.selection_status !== "selected"
  );
  const approvedAwaitingSecondVoteMovies = assignedMovies.filter(
    (movie) => votesByMovie[movie.id_movie] && movie.selection_status === "selected"
  );

  return (
    <div className="min-h-screen bg-black text-white font-light pt-28 pb-20 px-4 md:pt-32">
      <div className="max-w-5xl mx-auto space-y-10">
        <div className="text-center">
          <h1 className="text-4xl font-bold">Espace Jury</h1>
          <p className="text-gray-400 mt-2">Bienvenue {user.first_name} {user.last_name}</p>
        </div>

        <section className="bg-gray-900 rounded-2xl p-8 border border-gray-800 shadow-2xl">
          <h2 className="text-2xl font-bold mb-6">1. Films assignés en attente de vote</h2>
          {moviesError && <p className="text-red-400 mb-4">{moviesError}</p>}
          {awaitingVoteMovies.length === 0 ? (
            <p className="text-gray-400">Aucun film en attente de vote pour le moment.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
              {awaitingVoteMovies.map((movie) => {
                const poster = getPoster(movie);
                return (
                  <button
                    key={`awaiting-${movie.id_movie}`}
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
        </section>

        <section className="bg-gray-900 rounded-2xl p-8 border border-gray-800 shadow-2xl">
          <h2 className="text-2xl font-bold mb-6">2. Films déjà votés en attente d'approbation pour la deuxieme phase</h2>
          {votedAwaitingApprovalMovies.length === 0 ? (
            <p className="text-gray-400">Aucun film en attente d'approbation pour le moment.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
              {votedAwaitingApprovalMovies.map((movie) => {
                const poster = getPoster(movie);
                const vote = votesByMovie[movie.id_movie];
                return (
                  <button
                    key={`voted-${movie.id_movie}`}
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
                      {vote && (
                        <div className="mt-2 flex items-center gap-2">
                          <span className="text-xs bg-blue-900/40 text-blue-200 px-2 py-1 rounded">
                            Déjà voté
                          </span>
                          {vote.modification_count > 0 && (
                            <span className="text-xs bg-orange-900/40 text-orange-200 px-2 py-1 rounded">
                              Modifié {vote.modification_count}×
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </section>

        <section className="bg-gray-900 rounded-2xl p-8 border border-gray-800 shadow-2xl">
          <h2 className="text-2xl font-bold mb-6">3. Films approuvés en attente de seconde votation et prix</h2>
          {approvedAwaitingSecondVoteMovies.length === 0 ? (
            <p className="text-gray-400">Aucun film approuvé pour le moment.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
              {approvedAwaitingSecondVoteMovies.map((movie) => {
                const poster = getPoster(movie);
                const vote = votesByMovie[movie.id_movie];
                return (
                  <button
                    key={`approved-${movie.id_movie}`}
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
                      {vote && (
                        <div className="mt-2 flex items-center gap-2">
                          <span className="text-xs bg-green-900/40 text-green-200 px-2 py-1 rounded">
                            Approuvé
                          </span>
                          {vote.modification_count > 0 && (
                            <span className="text-xs bg-orange-900/40 text-orange-200 px-2 py-1 rounded">
                              Modifié {vote.modification_count}×
                            </span>
                          )}
                        </div>
                      )}
                      {vote && (
                        <div className="mt-2 text-xs text-gray-300">
                          <div className="font-semibold text-gray-200">Voto precedente:</div>
                          <div className="text-gray-400">Nota: {vote.note}</div>
                          {vote.commentaire && (
                            <div className="text-gray-400 line-clamp-2">Commento: {vote.commentaire}</div>
                          )}
                        </div>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </section>


        {selectedMovie && (
          <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4">
            <div className="bg-gray-950 border border-gray-800 rounded-2xl w-full max-w-5xl max-h-[90vh] overflow-y-auto p-6">
              <div className="flex items-center justify-between">
                <h3 className="text-2xl font-bold text-white">{selectedMovie.title}</h3>
                <button
                  type="button"
                  onClick={() => setSelectedMovie(null)}
                  className="text-gray-400 hover:text-white"
                >
                  ✕
                </button>
              </div>

              <p className="text-gray-400 mt-2">{selectedMovie.synopsis || selectedMovie.description || "-"}</p>

              <div className="grid grid-cols-2 gap-4 mt-4 text-sm text-gray-300">
                <div><span className="text-gray-400">Durée:</span> {selectedMovie.duration ? `${selectedMovie.duration}s` : "-"}</div>
                <div><span className="text-gray-400">Langue:</span> {selectedMovie.main_language || "-"}</div>
                <div><span className="text-gray-400">Nationalité:</span> {selectedMovie.nationality || "-"}</div>
                <div><span className="text-gray-400">Statut:</span> {selectedMovie.selection_status || "submitted"}</div>
              </div>

              <div className="mt-4 flex flex-wrap gap-3">
                {selectedMovie.trailer && (
                  <a
                    className="text-[#AD46FF] hover:text-[#F6339A] font-semibold"
                    href={`${uploadBase}/${selectedMovie.trailer}`}
                    target="_blank"
                    rel="noreferrer"
                  >
                    Ouvrir la vidéo
                  </a>
                )}
                {typeof selectedMovie.subtitle === "string" && selectedMovie.subtitle.toLowerCase().endsWith(".srt") && (
                  <a
                    className="text-[#AD46FF] hover:text-[#F6339A] font-semibold"
                    href={`${uploadBase}/${selectedMovie.subtitle}`}
                    target="_blank"
                    rel="noreferrer"
                    download
                  >
                    Télécharger les sous-titres
                  </a>
                )}
                {selectedMovie.youtube_link && (
                  <a
                    className="text-[#AD46FF] hover:text-[#F6339A] font-semibold"
                    href={selectedMovie.youtube_link}
                    target="_blank"
                    rel="noreferrer"
                  >
                    Voir sur YouTube
                  </a>
                )}
              </div>

              {(selectedMovie.trailer || selectedMovie.youtube_link) && (
                <div className="mt-4">
                  {selectedMovie.trailer ? (
                    <VideoPreview
                      title={selectedMovie.title}
                      src={`${uploadBase}/${selectedMovie.trailer}`}
                      poster={getPoster(selectedMovie) || undefined}
                      onEnded={() => setHasWatched(true)}
                    />
                  ) : (
                    <a className="text-[#AD46FF] hover:text-[#F6339A]" href={selectedMovie.youtube_link} target="_blank" rel="noreferrer">
                      Ouvrir la vidéo
                    </a>
                  )}
                </div>
              )}

              <div className="mt-6 border border-gray-800 rounded-xl bg-gray-900/60 p-4 text-sm text-gray-300">
                <h4 className="text-white font-semibold mb-2">Informations de vote</h4>
                <ul className="list-disc list-inside space-y-1">
                  <li>Regardez le film en entier avant de voter.</li>
                  <li>Le commentaire est obligatoire et doit justifier votre décision.</li>
                  <li>Vous pouvez modifier votre vote tant que nécessaire.</li>
                  <li>Votre vote influence la moyenne du film (préféré, à discuter, refusé).</li>
                  <li>Après vote, vous pouvez archiver le film pour organiser votre liste.</li>
                </ul>
              </div>
              <div className="mt-6 border-t border-gray-800 pt-6">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="text-lg font-semibold text-white">Votre vote</h4>
                  {votesByMovie[selectedMovie.id_movie] && (
                    <div className="flex items-center gap-2">
                      <span className="text-xs bg-blue-900/40 text-blue-200 px-2 py-1 rounded">
                        Déjà voté
                      </span>
                      {votesByMovie[selectedMovie.id_movie].modification_count > 0 && (
                        <span className="text-xs bg-orange-900/40 text-orange-200 px-2 py-1 rounded">
                          Modifié {votesByMovie[selectedMovie.id_movie].modification_count}×
                        </span>
                      )}
                      {selectedMovie.selection_status === "selected" && (
                        <span className="text-xs bg-green-900/40 text-green-200 px-2 py-1 rounded">
                          ✓ Modifiable
                        </span>
                      )}
                    </div>
                  )}
                </div>

                {selectedMovie.trailer ? (
                  <p className="text-sm text-gray-400 mb-3">
                    Vous devez visionner le film en entier avant de voter.
                  </p>
                ) : (
                  <label className="flex items-center gap-2 text-sm text-gray-400 mb-3">
                    <input
                      type="checkbox"
                      checked={confirmedWatched}
                      onChange={(event) => setConfirmedWatched(event.target.checked)}
                      className="accent-[#AD46FF]"
                    />
                    Je confirme avoir visionné le film en entier.
                  </label>
                )}

                {voteFeedback && <p className="text-sm text-gray-300 mb-3">{voteFeedback}</p>}

                <form onSubmit={handleVoteSubmit} className="space-y-4">
                  <div className="flex flex-col gap-2">
                    <label className="text-sm uppercase text-gray-400">Décision</label>
                    <div className="flex flex-wrap gap-4">
                      <label className="flex items-center gap-2 text-gray-300">
                        <input
                          type="radio"
                          name="note"
                          value="3"
                          checked={voteForm.note === "3" || voteForm.note === 3}
                          onChange={handleVoteChange}
                          required
                          disabled={!voteAllowed}
                        />
                        Validé / J'aime / Bon 👍
                      </label>
                      <label className="flex items-center gap-2 text-gray-300">
                        <input
                          type="radio"
                          name="note"
                          value="2"
                          checked={voteForm.note === "2" || voteForm.note === 2}
                          onChange={handleVoteChange}
                          required
                          disabled={!voteAllowed}
                        />
                        À discuter avec l'admin
                      </label>
                      <label className="flex items-center gap-2 text-gray-300">
                        <input
                          type="radio"
                          name="note"
                          value="1"
                          checked={voteForm.note === "1" || voteForm.note === 1}
                          onChange={handleVoteChange}
                          required
                          disabled={!voteAllowed}
                        />
                        Refusé / Je n'aime pas 👎
                      </label>
                    </div>
                  </div>
                  <div className="flex flex-col">
                    <label className="text-sm uppercase text-gray-400">Commentaire</label>
                    <textarea
                      name="commentaire"
                      value={voteForm.commentaire}
                      onChange={handleVoteChange}
                      required
                      rows={4}
                      disabled={!voteAllowed}
                      className="bg-gray-800 border border-gray-700 text-white px-4 py-3 rounded-lg"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={!voteAllowed || voteLoading}
                    className="bg-gradient-to-r from-[#AD46FF] to-[#F6339A] text-white px-4 py-2 rounded-lg font-semibold disabled:opacity-50"
                  >
                    {voteLoading ? "Envoi..." : "Enregistrer le vote"}
                  </button>
                </form>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

