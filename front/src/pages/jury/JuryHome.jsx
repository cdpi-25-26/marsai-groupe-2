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
        {/* Qui va il resto del codice: avvisi, selezione cartelle, griglia film, modale, ecc. Assicurati che tutto sia dentro questo <div> */}
      </div>
    </div>
  );
}

