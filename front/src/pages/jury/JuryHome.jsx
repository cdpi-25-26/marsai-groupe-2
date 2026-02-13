/**
 * Composant JuryHome (Accueil Jury)
 * Page d'accueil pour les membres du jury
 * Permet de consulter et modifier le profil
 * @returns {JSX.Element} La page d'accueil du jury
 */
import { useEffect, useState } from "react";
import { getCurrentUser, updateCurrentUser } from "../../api/users";
import { getAssignedMovies } from "../../api/videos";
import { getMyVotes, submitMyVote } from "../../api/votes";
import { VideoPreview } from "../../components/VideoPreview.jsx";

export default function JuryHome() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [form, setForm] = useState({});
  const [success, setSuccess] = useState(null);
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

  const getVoteLabel = (note) => {
    const value = parseFloat(note);
    if (Number.isNaN(value)) return "Vote inconnu";
    if (value >= 2.5) return "Validé / J'aime / Bon 👍";
    if (value >= 1.5) return "À discuter avec l'admin";
    return "Refusé / Je n'aime pas 👎";
  };

  const toggleArchive = (id) => {
    const normalizedId = Number(id);
    if (!Number.isFinite(normalizedId)) return;
    setArchivedMovieIds((prev) => {
      if (prev.includes(normalizedId)) return prev.filter((item) => item !== normalizedId);
      return [...prev, normalizedId];
    });
  };
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
        setForm(res.data);
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

  useEffect(() => {
    if (!selectedMovie) return;
    const existingVote = votesByMovie[selectedMovie.id_movie];
    setVoteForm({
      note: existingVote?.note || "",
      commentaire: existingVote?.commentaire || ""
    });
    setVoteFeedback(null);
    setHasWatched(Boolean(existingVote));
    setConfirmedWatched(false);
  }, [selectedMovie, votesByMovie]);

  if (loading) return <div className="min-h-screen bg-black text-white flex items-center justify-center">Chargement...</div>;
  if (error) return <div className="min-h-screen bg-black text-white flex items-center justify-center">{error}</div>;
  if (!user) return <div className="min-h-screen bg-black text-white flex items-center justify-center">Utilisateur introuvable</div>;

  function handleEditChange(e) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  async function handleSave(e) {
    e.preventDefault();
    setSuccess(null);
    try {
      const toSend = { ...form };
      delete toSend.email;
      delete toSend.role;
      const res = await updateCurrentUser(toSend);
      setUser(res.data);
      setEditMode(false);
      setSuccess("Profil mis à jour avec succès.");
      if (res.data.first_name) localStorage.setItem("firstName", res.data.first_name);
    } catch (err) {
      setError("Erreur lors de la mise à jour du profil");
    }
  }

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

  const unvotedAssignedMovies = assignedMovies.filter(
    (movie) => !archivedMovieIds.includes(movie.id_movie) && !votesByMovie[movie.id_movie]
  );
  const archivedMovies = assignedMovies.filter((movie) => archivedMovieIds.includes(movie.id_movie));

  return (
    <div className="min-h-screen bg-black text-white font-light pt-28 pb-20 px-4 md:pt-32">
      <div className="max-w-5xl mx-auto space-y-10">
        <div className="text-center">
          <h1 className="text-4xl font-bold">Espace Jury</h1>
          <p className="text-gray-400 mt-2">Bienvenue {user.first_name} {user.last_name}</p>
        </div>

        <section className="bg-gray-900 rounded-2xl p-8 border border-gray-800 shadow-2xl">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold">Vos informations personnelles</h2>
            {!editMode && (
              <button
                className="bg-gradient-to-r from-[#AD46FF] to-[#F6339A] text-white px-4 py-2 rounded-lg font-semibold hover:opacity-90 transition"
                onClick={() => setEditMode(true)}
              >
                Modifier
              </button>
            )}
          </div>

          {success && <div className="text-green-400 mb-4">{success}</div>}

          {editMode ? (
            <form onSubmit={handleSave} className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex flex-col">
                <label className="text-sm uppercase text-gray-400 mb-1">Prénom</label>
                <input name="first_name" value={form.first_name || ""} onChange={handleEditChange} required className="bg-gray-800 border border-gray-700 text-white px-4 py-3 rounded-lg" />
              </div>
              <div className="flex flex-col">
                <label className="text-sm uppercase text-gray-400 mb-1">Nom</label>
                <input name="last_name" value={form.last_name || ""} onChange={handleEditChange} required className="bg-gray-800 border border-gray-700 text-white px-4 py-3 rounded-lg" />
              </div>
              <div className="flex flex-col">
                <label className="text-sm uppercase text-gray-400 mb-1">Téléphone</label>
                <input name="phone" value={form.phone || ""} onChange={handleEditChange} className="bg-gray-800 border border-gray-700 text-white px-4 py-3 rounded-lg" />
              </div>
              <div className="flex flex-col">
                <label className="text-sm uppercase text-gray-400 mb-1">Mobile</label>
                <input name="mobile" value={form.mobile || ""} onChange={handleEditChange} className="bg-gray-800 border border-gray-700 text-white px-4 py-3 rounded-lg" />
              </div>
              <div className="flex flex-col">
                <label className="text-sm uppercase text-gray-400 mb-1">Date de naissance</label>
                <input name="birth_date" type="date" value={form.birth_date ? form.birth_date.substring(0,10) : ""} onChange={handleEditChange} className="bg-gray-800 border border-gray-700 text-white px-4 py-3 rounded-lg" />
              </div>
              <div className="flex flex-col">
                <label className="text-sm uppercase text-gray-400 mb-1">Rue</label>
                <input name="street" value={form.street || ""} onChange={handleEditChange} className="bg-gray-800 border border-gray-700 text-white px-4 py-3 rounded-lg" />
              </div>
              <div className="flex flex-col">
                <label className="text-sm uppercase text-gray-400 mb-1">Code postal</label>
                <input name="postal_code" value={form.postal_code || ""} onChange={handleEditChange} className="bg-gray-800 border border-gray-700 text-white px-4 py-3 rounded-lg" />
              </div>
              <div className="flex flex-col">
                <label className="text-sm uppercase text-gray-400 mb-1">Ville</label>
                <input name="city" value={form.city || ""} onChange={handleEditChange} className="bg-gray-800 border border-gray-700 text-white px-4 py-3 rounded-lg" />
              </div>
              <div className="flex flex-col">
                <label className="text-sm uppercase text-gray-400 mb-1">Pays</label>
                <input name="country" value={form.country || ""} onChange={handleEditChange} className="bg-gray-800 border border-gray-700 text-white px-4 py-3 rounded-lg" />
              </div>
              <div className="flex flex-col md:col-span-2">
                <label className="text-sm uppercase text-gray-400 mb-1">Biographie</label>
                <textarea name="biography" value={form.biography || ""} onChange={handleEditChange} className="bg-gray-800 border border-gray-700 text-white px-4 py-3 rounded-lg" />
              </div>
              <div className="flex flex-col">
                <label className="text-sm uppercase text-gray-400 mb-1">Profession</label>
                <select name="job" value={form.job || ""} onChange={handleEditChange} className="bg-gray-800 border border-gray-700 text-white px-4 py-3 rounded-lg">
                  <option value="">-</option>
                  <option value="PRODUCER">Producteur</option>
                  <option value="ACTOR">Acteur</option>
                  <option value="DIRECTOR">Réalisateur</option>
                  <option value="WRITER">Scénariste</option>
                  <option value="OTHER">Autre</option>
                </select>
              </div>
              <div className="flex flex-col">
                <label className="text-sm uppercase text-gray-400 mb-1">Portfolio</label>
                <input name="portfolio" value={form.portfolio || ""} onChange={handleEditChange} className="bg-gray-800 border border-gray-700 text-white px-4 py-3 rounded-lg" />
              </div>
              <div className="flex flex-col">
                <label className="text-sm uppercase text-gray-400 mb-1">YouTube</label>
                <input name="youtube" value={form.youtube || ""} onChange={handleEditChange} className="bg-gray-800 border border-gray-700 text-white px-4 py-3 rounded-lg" />
              </div>
              <div className="flex flex-col">
                <label className="text-sm uppercase text-gray-400 mb-1">Instagram</label>
                <input name="instagram" value={form.instagram || ""} onChange={handleEditChange} className="bg-gray-800 border border-gray-700 text-white px-4 py-3 rounded-lg" />
              </div>
              <div className="flex flex-col">
                <label className="text-sm uppercase text-gray-400 mb-1">LinkedIn</label>
                <input name="linkedin" value={form.linkedin || ""} onChange={handleEditChange} className="bg-gray-800 border border-gray-700 text-white px-4 py-3 rounded-lg" />
              </div>
              <div className="flex flex-col">
                <label className="text-sm uppercase text-gray-400 mb-1">Facebook</label>
                <input name="facebook" value={form.facebook || ""} onChange={handleEditChange} className="bg-gray-800 border border-gray-700 text-white px-4 py-3 rounded-lg" />
              </div>
              <div className="flex flex-col">
                <label className="text-sm uppercase text-gray-400 mb-1">TikTok</label>
                <input name="tiktok" value={form.tiktok || ""} onChange={handleEditChange} className="bg-gray-800 border border-gray-700 text-white px-4 py-3 rounded-lg" />
              </div>
              <div className="flex flex-col">
                <label className="text-sm uppercase text-gray-400 mb-1">Connu par MarsAI ?</label>
                <select name="known_by_mars_ai" value={form.known_by_mars_ai || ""} onChange={handleEditChange} className="bg-gray-800 border border-gray-700 text-white px-4 py-3 rounded-lg">
                  <option value="">-</option>
                  <option value="YES">Oui</option>
                  <option value="NO">Non</option>
                </select>
              </div>
              <div className="flex flex-col md:col-span-2">
                <label className="text-sm uppercase text-gray-400 mb-1">Mot de passe (changer uniquement si nécessaire)</label>
                <input name="password" type="password" value={form.password || ""} onChange={handleEditChange} autoComplete="new-password" className="bg-gray-800 border border-gray-700 text-white px-4 py-3 rounded-lg" />
              </div>
              <div className="md:col-span-2 flex gap-3">
                <button type="submit" className="bg-gradient-to-r from-[#AD46FF] to-[#F6339A] text-white px-4 py-2 rounded-lg font-semibold">Enregistrer</button>
                <button type="button" className="border border-gray-700 px-4 py-2 rounded-lg" onClick={() => { setEditMode(false); setForm(user); setSuccess(null); }}>Annuler</button>
              </div>
            </form>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-300">
              <div><span className="text-gray-400">Email:</span> {user.email}</div>
              <div><span className="text-gray-400">Téléphone:</span> {user.phone || "-"}</div>
              <div><span className="text-gray-400">Mobile:</span> {user.mobile || "-"}</div>
              <div><span className="text-gray-400">Date de naissance:</span> {user.birth_date ? user.birth_date.substring(0,10) : "-"}</div>
              <div className="md:col-span-2"><span className="text-gray-400">Adresse:</span> {user.street || "-"}, {user.postal_code || "-"} {user.city || "-"}, {user.country || "-"}</div>
              <div className="md:col-span-2"><span className="text-gray-400">Biographie:</span> {user.biography || "-"}</div>
              <div><span className="text-gray-400">Profession:</span> {user.job || "-"}</div>
              <div><span className="text-gray-400">Portfolio:</span> {user.portfolio || "-"}</div>
              <div><span className="text-gray-400">YouTube:</span> {user.youtube || "-"}</div>
              <div><span className="text-gray-400">Instagram:</span> {user.instagram || "-"}</div>
              <div><span className="text-gray-400">LinkedIn:</span> {user.linkedin || "-"}</div>
              <div><span className="text-gray-400">Facebook:</span> {user.facebook || "-"}</div>
              <div><span className="text-gray-400">TikTok:</span> {user.tiktok || "-"}</div>
              <div><span className="text-gray-400">Connu par MarsAI:</span> {user.known_by_mars_ai || "-"}</div>
            </div>
          )}
        </section>

        <section className="bg-gray-900 rounded-2xl p-8 border border-gray-800 shadow-2xl">
          <h2 className="text-2xl font-bold mb-6">Films assignés et encore à voter</h2>
          {moviesError && <p className="text-red-400 mb-4">{moviesError}</p>}
          {unvotedAssignedMovies.length === 0 ? (
            <p className="text-gray-400">Aucun film assigné à voter pour le moment.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
              {unvotedAssignedMovies.map((movie) => {
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
                      {votesByMovie[movie.id_movie] && (
                        <div className="mt-2 flex items-center gap-2">
                          <span className="text-xs bg-blue-900/40 text-blue-200 px-2 py-1 rounded">
                            Déjà voté
                          </span>
                          {votesByMovie[movie.id_movie].modification_count > 0 && (
                            <span className="text-xs bg-orange-900/40 text-orange-200 px-2 py-1 rounded">
                              Modifié {votesByMovie[movie.id_movie].modification_count}×
                            </span>
                          )}
                          {movie.selection_status === 'selected' && (
                            <span className="text-xs bg-green-900/40 text-green-200 px-2 py-1 rounded">
                              Peut être modifié
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
          <h2 className="text-2xl font-bold mb-6">Films archivés</h2>
          {archivedMovies.length === 0 ? (
            <p className="text-gray-400">Aucun film archivé pour le moment.</p>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-4 xl:grid-cols-6 gap-4">
              {archivedMovies.map((movie) => {
                const poster = getPoster(movie);
                return (
                  <button
                    key={`archived-${movie.id_movie}`}
                    type="button"
                    onClick={() => setSelectedMovie(movie)}
                    className="bg-gray-950 border border-gray-800 rounded-lg overflow-hidden hover:border-gray-600 transition"
                    title={movie.title}
                  >
                    <div className="aspect-video bg-gray-800">
                      {poster ? (
                        <img src={poster} alt={movie.title} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-500 text-xs">Aucune vignette</div>
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
                      {selectedMovie.selection_status === 'selected' && (
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
                    <label className="text-sm uppercase text-gray-400 mb-1">Commentaires</label>
                    <textarea
                      name="commentaire"
                      value={voteForm.commentaire}
                      onChange={handleVoteChange}
                      disabled={!voteAllowed}
                      className="bg-gray-900 border border-gray-800 text-white px-4 py-3 rounded-lg"
                      rows={4}
                      required
                      placeholder="Commentaire obligatoire - Expliquez votre choix"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={voteLoading || !voteAllowed}
                    className="bg-gradient-to-r from-[#AD46FF] to-[#F6339A] text-white px-4 py-2 rounded-lg font-semibold disabled:opacity-50"
                  >
                    {voteLoading ? "Enregistrement..." : "Enregistrer le vote"}
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

