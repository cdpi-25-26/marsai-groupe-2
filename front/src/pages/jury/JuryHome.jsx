/**
 * Composant JuryHome (Accueil Jury)
 * Page d'accueil pour les membres du jury
 * Permet de consulter et modifier le profil
 * @returns {JSX.Element} La page d'accueil du jury
 */
import { useEffect, useState } from "react";
import { getCurrentUser } from "../../api/users";
import { getAssignedMovies, promoteMovieToCandidateByJury } from "../../api/videos";
import { getMyVotes, submitMyVote } from "../../api/votes";
import { VideoPreview } from "../../components/VideoPreview.jsx";
import TutorialBox from "../../components/TutorialBox.jsx";

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
  const [voteNotice, setVoteNotice] = useState(null);
  const [modalNotice, setModalNotice] = useState(null);
  const [voteLoading, setVoteLoading] = useState(false);
  const [hasWatched, setHasWatched] = useState(false);
  const [confirmedWatched, setConfirmedWatched] = useState(false);
  const [activeFolder, setActiveFolder] = useState(null); // null, 'assigned', 'voted', 'approved'
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

  useEffect(() => {
    localStorage.setItem("juryArchivedMovies", JSON.stringify(archivedMovieIds));
  }, [archivedMovieIds]);

  useEffect(() => {
    if (!voteNotice) return;
    const timeoutId = setTimeout(() => setVoteNotice(null), 4000);
    return () => clearTimeout(timeoutId);
  }, [voteNotice]);

  useEffect(() => {
    if (!modalNotice) return;
    const timeoutId = setTimeout(() => setModalNotice(null), 4000);
    return () => clearTimeout(timeoutId);
  }, [modalNotice]);

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
      setVoteFeedback(null);
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

  async function refreshAssignedMovies() {
    try {
      const res = await getAssignedMovies();
      setAssignedMovies(res.data || []);
    } catch {
      // ignore refresh errors
    }
  }

  async function handleVoteSubmit(e) {
    e.preventDefault();
    if (!selectedMovie) return;
    setVoteFeedback(null);
    setVoteLoading(true);
    try {
      const existingVote = votesByMovie[selectedMovie.id_movie];
        const isSecondVoteOpen = selectedMovie.selection_status === "to_discuss";
      if (existingVote && !isSecondVoteOpen) {
        setVoteFeedback("Le second vote n'est pas encore ouvert pour ce film.");
        return;
      }
      const res = await submitMyVote(selectedMovie.id_movie, voteForm);
      const vote = res.data?.vote;
      if (vote) {
        setArchivedMovieIds((prev) => (prev.includes(vote.id_movie) ? prev : [...prev, vote.id_movie]));
      }
      const refreshedVotes = await getMyVotes();
      const mapped = (refreshedVotes.data || []).reduce((acc, item) => {
        acc[item.id_movie] = item;
        return acc;
      }, {});
      setVotesByMovie(mapped);
      setVoteFeedback("Vote enregistré.");
      setVoteNotice("Vote enregistré avec succès.");
      setModalNotice("Vote enregistré avec succès.");
      await refreshAssignedMovies();
    } catch (err) {
      const message = err?.response?.data?.error || "Erreur lors de l'enregistrement du vote.";
      setVoteFeedback(message);
    } finally {
      setVoteLoading(false);
    }
  }

  async function handlePromoteCandidate() {
    if (!selectedMovie) return;
    try {
      const message = window.prompt("Message pour l'admin (optionnel):", "");
      await promoteMovieToCandidateByJury(selectedMovie.id_movie, message || "");
      setModalNotice("Film promu à la candidature.");
      await refreshAssignedMovies();
      setSelectedMovie(null);
    } catch (err) {
      const message = err?.response?.data?.error || "Impossible de promouvoir le film.";
      setVoteFeedback(message);
    }
  }

  const selectedVote = selectedMovie ? votesByMovie[selectedMovie.id_movie] : null;
  const isSecondVoteOpen = selectedMovie
    ? selectedMovie.selection_status === "to_discuss"
    : false;
  const canEditVote = selectedMovie ? !selectedVote || isSecondVoteOpen : false;
  const voteAllowed = selectedMovie
    ? (getTrailer(selectedMovie) ? hasWatched : confirmedWatched) && canEditVote
    : false;
  const canPromoteCandidate = isSecondVoteOpen && selectedVote && (selectedVote.modification_count || 0) > 0;

  const voteLabels = {
    1: "Refusé",
    2: "À discuter",
    3: "Validé"
  };
  const getVoteLabel = (note) => voteLabels[Number(note)] || note;

  const awaitingVoteMovies = assignedMovies.filter((movie) => {
    const status = movie.selection_status || "submitted";
    const vote = votesByMovie[movie.id_movie];
    if (status === "assigned") return !vote;
    if (status === "to_discuss") return !vote || (vote?.modification_count || 0) === 0;
    return false;
  });

  const votedMovies = assignedMovies.filter((movie) => {
    const status = movie.selection_status || "submitted";
    const vote = votesByMovie[movie.id_movie];
    if (status === "assigned") return Boolean(vote);
    if (status === "to_discuss") return Boolean(vote) && (vote.modification_count || 0) > 0;
    return false;
  });

  const candidateMovies = assignedMovies.filter((movie) => (
    ["candidate", "selected", "finalist"].includes(movie.selection_status)
  ));

  return (
    <div className="min-h-screen bg-black text-white font-light pt-28 pb-20 px-4 md:pt-32">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-[#AD46FF]">Espace Jury</h1>
          <p className="text-gray-400 mt-2">Bienvenue {user.first_name} {user.last_name}</p>
        </div>
        <div className="mb-8">
          <TutorialBox
            title="Tutoriel — Parcours Jury"
            steps={["Ouvrez le dossier À voter pour traiter les films assignés.","Regardez la vidéo (ou confirmez il visionnage) prima di votare.","Inserisci voto e commento poi salva.","Durante la seconda votazione aggiorna il voto se l'admin l'ha aperta.","Dopo il secondo voto puoi proporre un film come candidato."]}
          />
        </div>
        {/* Notices and feedback */}
        {voteNotice && (
          <div className="mb-4 p-3 bg-green-700/80 text-white rounded text-center animate-fade-in">
            {voteNotice}
          </div>
        )}
        {modalNotice && (
          <div className="mb-4 p-3 bg-blue-700/80 text-white rounded text-center animate-fade-in">
            {modalNotice}
          </div>
        )}
        {moviesError && (
          <div className="mb-4 p-3 bg-red-700/80 text-white rounded text-center animate-fade-in">
            {moviesError}
          </div>
        )}

        {/* Folder navigation */}
        <div className="flex flex-wrap gap-4 justify-center mb-8">
          <button
            className={`px-6 py-2 rounded-full border-2 ${activeFolder === 'assigned' ? 'bg-[#AD46FF] border-[#AD46FF] text-white' : 'border-gray-600 text-gray-300 hover:bg-[#AD46FF]/20'}`}
            onClick={() => setActiveFolder('assigned')}
          >À voter ({awaitingVoteMovies.length})</button>
          <button
            className={`px-6 py-2 rounded-full border-2 ${activeFolder === 'voted' ? 'bg-[#AD46FF] border-[#AD46FF] text-white' : 'border-gray-600 text-gray-300 hover:bg-[#AD46FF]/20'}`}
            onClick={() => setActiveFolder('voted')}
          >Votés ({votedMovies.length})</button>
          <button
            className={`px-6 py-2 rounded-full border-2 ${activeFolder === 'approved' ? 'bg-[#AD46FF] border-[#AD46FF] text-white' : 'border-gray-600 text-gray-300 hover:bg-[#AD46FF]/20'}`}
            onClick={() => setActiveFolder('approved')}
          >Candidats ({candidateMovies.length})</button>
        </div>

        {/* Movie grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {(activeFolder === 'voted' ? votedMovies : activeFolder === 'approved' ? candidateMovies : awaitingVoteMovies).map((movie) => (
            <div
              key={movie.id_movie}
              className={`bg-gray-900 rounded-lg shadow-lg p-4 flex flex-col items-center border-2 ${selectedMovie?.id_movie === movie.id_movie ? 'border-[#AD46FF]' : 'border-transparent'} cursor-pointer hover:border-[#AD46FF]/60`}
              onClick={() => setSelectedMovie(movie)}
            >
              <img
                src={getPoster(movie) || '/placeholder.jpg'}
                alt={movie.title}
                className="w-full h-48 object-cover rounded mb-3"
                style={{ maxWidth: 320 }}
              />
              <h3 className="text-lg font-bold text-[#AD46FF] mb-1">{movie.title}</h3>
              <p className="text-gray-400 text-sm mb-2">{movie.duration} min</p>
              <p className="text-gray-400 text-xs mb-2">{movie.nationality} | {movie.main_language}</p>
              <p className="text-gray-300 text-xs mb-2">Statut: <span className="font-semibold">{movie.selection_status}</span></p>
              {votesByMovie[movie.id_movie] && (
                <div className="text-green-400 text-xs">Vote: {getVoteLabel(votesByMovie[movie.id_movie].note)}</div>
              )}
            </div>
          ))}
        </div>

        {/* Vote modal */}
        {selectedMovie && (
          <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
            <div className="bg-gray-900 rounded-lg shadow-lg p-8 w-full max-w-lg relative">
              <button
                className="absolute top-2 right-2 text-gray-400 hover:text-white text-2xl"
                onClick={() => setSelectedMovie(null)}
                aria-label="Fermer"
              >×</button>
              <h2 className="text-2xl font-bold text-[#AD46FF] mb-2">{selectedMovie.title}</h2>
              <VideoPreview src={getTrailer(selectedMovie)} />
              <form onSubmit={handleVoteSubmit} className="mt-4 space-y-4">
                <div>
                  <label className="block mb-1">Note (1-10)</label>
                  <input
                    type="range"
                    min="1"
                    max="10"
                    name="note"
                    value={voteForm.note}
                    onChange={handleVoteChange}
                    className="w-full"
                    disabled={!canEditVote || voteLoading}
                  />
                  <div className="text-center text-2xl font-bold">{voteForm.note}/10</div>
                </div>
                <div>
                  <label className="block mb-1">Commentaire</label>
                  <textarea
                    name="commentaire"
                    value={voteForm.commentaire}
                    onChange={handleVoteChange}
                    rows="3"
                    className="w-full p-2 bg-gray-800 rounded"
                    placeholder="Votre avis..."
                    disabled={!canEditVote || voteLoading}
                  />
                </div>
                {getTrailer(selectedMovie) && (
                  <div className="flex items-center gap-2 mb-2">
                    <input
                      type="checkbox"
                      checked={hasWatched}
                      onChange={() => setHasWatched((v) => !v)}
                      id="hasWatched"
                      disabled={!canEditVote || voteLoading}
                    />
                    <label htmlFor="hasWatched">J'ai regardé la vidéo</label>
                  </div>
                )}
                {!getTrailer(selectedMovie) && (
                  <div className="flex items-center gap-2 mb-2">
                    <input
                      type="checkbox"
                      checked={confirmedWatched}
                      onChange={() => setConfirmedWatched((v) => !v)}
                      id="confirmedWatched"
                      disabled={!canEditVote || voteLoading}
                    />
                    <label htmlFor="confirmedWatched">Je confirme avoir visionné le film</label>
                  </div>
                )}
                {voteFeedback && (
                  <div className="text-red-400 text-sm mb-2">{voteFeedback}</div>
                )}
                <button
                  type="submit"
                  className="bg-[#AD46FF] px-6 py-2 rounded text-white font-bold hover:bg-[#AD46FF]/80 w-full"
                  disabled={!voteAllowed || voteLoading}
                >
                  {voteLoading ? 'Enregistrement...' : 'Enregistrer le vote'}
                </button>
              </form>
              {canPromoteCandidate && (
                <button
                  className="mt-4 bg-green-600 px-6 py-2 rounded text-white font-bold hover:bg-green-700 w-full"
                  onClick={handlePromoteCandidate}
                  disabled={voteLoading}
                >
                  Proposer comme candidat
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

