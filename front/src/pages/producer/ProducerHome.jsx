
/**
 * Composant ProducerHome (Accueil Producteur)
 * Page permettant aux producteurs de voir et modifier leur profil complet
 * Fonctionnalités: 
 * - Affichage des informations utilisateur (18 champs optionnels)
 * - Mode édition pour modifier les informations
 * - Appel API getCurrentUser pour récupérer les données
 * - Validation et mise à jour via updateCurrentUser
 * @returns {JSX.Element} La page d'accueil du producteur avec formulaire de profil
 */

import { useEffect, useState } from "react";
import { VideoPreview } from "../../components/VideoPreview.jsx";
import { useMutation } from "@tanstack/react-query";
import { zodResolver } from "@hookform/resolvers/zod";
import { useFieldArray, useForm } from "react-hook-form";
import * as z from "zod";
import { getCurrentUser, updateCurrentUser } from "../../api/users";
import { createMovie, getMyMovies, updateMovieCollaborators } from "../../api/movies";

const movieSchema = z.object({
  filmTitleOriginal: z.string().min(1, "Le titre du film est requis"),
  durationSeconds: z.coerce
    .number()
    .int("La durée doit être un nombre entier")
    .min(1, "La durée est obligatoire")
    .max(120, "La durée maximale est de 120 secondes"),
  filmLanguage: z.string().optional(),
  releaseYear: z.string().optional(),
  nationality: z.string().optional(),
  translation: z.string().optional(),
  youtubeLink: z.string().optional(),
  synopsisOriginal: z.string().min(1, "Le synopsis est requis"),
  synopsisEnglish: z.string().optional(),
  aiClassification: z.string().optional(),
  aiStack: z.string().optional(),
  aiMethodology: z.string().optional(),
  collaborators: z
    .array(
      z.object({
        first_name: z.string().optional(),
        last_name: z.string().optional(),
        email: z.string().email("Email invalide").optional(),
        job: z.string().optional()
      })
    )
    .optional(),
  filmFile: z.any().optional(),
  thumbnail1: z.any().optional(),
  thumbnail2: z.any().optional(),
  thumbnail3: z.any().optional(),
  subtitlesSrt: z.any().optional()
});

export default function ProducerHome() {
  // État pour stocker les données utilisateur
  const [user, setUser] = useState(null);
  // État pour indiquer si les données sont en cours de chargement
  const [loading, setLoading] = useState(true);
  // État pour gérer les messages d'erreur
  const [error, setError] = useState(null);
  // État pour basculer entre mode lecture et mode édition
  const [editMode, setEditMode] = useState(false);
  // État pour stocker les données du formulaire d'édition
  const [form, setForm] = useState({});
  // État pour afficher les messages de succès
  const [success, setSuccess] = useState(null);
  // État pour stocker les films du producteur
  const [movies, setMovies] = useState([]);
  const [movieSuccess, setMovieSuccess] = useState(null);
  const [movieError, setMovieError] = useState(null);
  const [editingMovieId, setEditingMovieId] = useState(null);
  const [collabDrafts, setCollabDrafts] = useState({});
  const [filmFileName, setFilmFileName] = useState("Aucun fichier sélectionné");
  const [thumbnail1Name, setThumbnail1Name] = useState("Aucun fichier sélectionné");
  const [thumbnail2Name, setThumbnail2Name] = useState("Aucun fichier sélectionné");
  const [thumbnail3Name, setThumbnail3Name] = useState("Aucun fichier sélectionné");
  const [subtitlesName, setSubtitlesName] = useState("Aucun fichier sélectionné");

  const handleFileName = (event, setter) => {
    const file = event.target.files?.[0];
    setter(file ? file.name : "Aucun fichier sélectionné");
  };

  const {
    register: registerMovie,
    handleSubmit: handleSubmitMovie,
    reset: resetMovie,
    control: movieControl,
    formState: { errors: movieErrors }
  } = useForm({
    resolver: zodResolver(movieSchema)
  });

  const {
    fields: collaboratorFields,
    append: appendCollaborator,
    remove: removeCollaborator
  } = useFieldArray({
    control: movieControl,
    name: "collaborators"
  });

  const createMovieMutation = useMutation({
    mutationFn: async (data) => {
      const formData = new FormData();
      formData.append("filmTitleOriginal", data.filmTitleOriginal || "");
      formData.append("durationSeconds", data.durationSeconds || "");
      formData.append("filmLanguage", data.filmLanguage || "");
      formData.append("releaseYear", data.releaseYear || "");
      formData.append("nationality", data.nationality || "");
      formData.append("translation", data.translation || "");
      formData.append("youtubeLink", data.youtubeLink || "");
      formData.append("synopsisOriginal", data.synopsisOriginal || "");
      formData.append("synopsisEnglish", data.synopsisEnglish || "");
      formData.append("aiClassification", data.aiClassification || "");
      formData.append("aiStack", data.aiStack || "");
      formData.append("aiMethodology", data.aiMethodology || "");

      if (data.collaborators?.length) {
        const normalized = data.collaborators.filter(
          (collab) => collab?.first_name || collab?.last_name || collab?.email
        );
        formData.append("collaborators", JSON.stringify(normalized));
      }


      if (data.filmFile?.[0]) formData.append("filmFile", data.filmFile[0]);
      if (data.thumbnail1?.[0]) formData.append("thumbnail1", data.thumbnail1[0]);
      if (data.thumbnail2?.[0]) formData.append("thumbnail2", data.thumbnail2[0]);
      if (data.thumbnail3?.[0]) formData.append("thumbnail3", data.thumbnail3[0]);
      if (data.subtitlesSrt?.[0]) formData.append("subtitlesSrt", data.subtitlesSrt[0]);

      return await createMovie(formData);
    },
    onSuccess: async () => {
      setMovieError(null);
      setMovieSuccess("Film soumis avec succès.");
      resetMovie();
      setFilmFileName("Aucun fichier sélectionné");
      setThumbnail1Name("Aucun fichier sélectionné");
      setThumbnail2Name("Aucun fichier sélectionné");
      setThumbnail3Name("Aucun fichier sélectionné");
      setSubtitlesName("Aucun fichier sélectionné");
      try {
        const moviesRes = await getMyMovies();
        setMovies(moviesRes.data || []);
      } catch {
        // ignore refresh errors
      }
    },
    onError: (err) => {
      setMovieSuccess(null);
      setMovieError(
        err?.response?.data?.error
        || err?.message
        || "Erreur lors de la soumission du film."
      );
    }
  });

  const updateCollaboratorsMutation = useMutation({
    mutationFn: ({ id, collaborators }) => updateMovieCollaborators(id, collaborators),
    onSuccess: async () => {
      try {
        const moviesRes = await getMyMovies();
        setMovies(moviesRes.data || []);
      } catch {
        // ignore refresh errors
      }
      setEditingMovieId(null);
    },
    onError: () => {
      setMovieError("Erreur lors de la mise à jour des collaborateurs.");
    }
  });

  function onSubmitMovie(data) {
    return createMovieMutation.mutate(data);
  }

  /**
   * Effect - Récupère les données utilisateur au chargement du composant
   * Vérifie que l'utilisateur est authentifié avant de faire l'appel API
   */
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      setError("Non authentifié");
      setLoading(false);
      return;
    }
    Promise.all([getCurrentUser(), getMyMovies()])
      .then(([userRes, moviesRes]) => {
        setUser(userRes.data);
        setForm(userRes.data);
        setMovies(moviesRes.data || []);
        setLoading(false);
      })
      .catch(() => {
        setError("Erreur lors de la récupération des données utilisateur");
        setLoading(false);
      });
  }, []);


  if (loading) return <div className="min-h-screen bg-black text-white flex items-center justify-center">Chargement...</div>;
  if (error) return <div className="min-h-screen bg-black text-white flex items-center justify-center">{error}</div>;
  if (!user) return <div className="min-h-screen bg-black text-white flex items-center justify-center">Utilisateur introuvable</div>;

  const uploadBase = "http://localhost:3000/uploads";

  /**
   * Fonction handleEditChange
   * Met à jour le state form lors de chaque modification de champ
   * @param {Event} e - L'événement du champ modifié
   */
  function handleEditChange(e) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  /**
   * Fonction handleSave
   * Envoie les données modifiées au serveur via updateCurrentUser
   * Supprime les champs email et role car ils ne peuvent pas être modifiés
   * Met à jour le localStorage avec le nouveau prénom
   * @param {Event} e - L'événement du formulaire
   */
  async function handleSave(e) {
    e.preventDefault();
    setSuccess(null);
    try {
      const toSend = { ...form };
      // Les champs email et role sont protégés et ne doivent pas être modifiés par l'utilisateur
      delete toSend.email;
      delete toSend.role;
      const res = await updateCurrentUser(toSend);
      setUser(res.data);
      setEditMode(false);
      setSuccess("Profil mis à jour avec succès.");
      // Mise à jour du prénom dans le localStorage pour l'affichage dans la navbar
      if (res.data.first_name) localStorage.setItem("firstName", res.data.first_name);
    } catch (err) {
      setError("Erreur lors de la mise à jour du profil");
    }
  }

  function startEditCollaborators(movie) {
    const existing = (movie.Collaborators || []).map((collab) => ({
      first_name: collab.first_name || "",
      last_name: collab.last_name || "",
      email: collab.email || "",
      job: collab.job || ""
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
      [movieId]: [
        ...(prev[movieId] || []),
        { first_name: "", last_name: "", email: "", job: "" }
      ]
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
    <div className="min-h-screen bg-black text-white font-light pt-28 pb-20 px-4 md:pt-32">
      <div className="max-w-6xl mx-auto space-y-10">
        <div className="text-center">
          <h1 className="text-4xl font-bold">Espace Producteur</h1>
          <p className="text-gray-400 mt-2">Bienvenue {user.first_name} {user.last_name}</p>
        </div>

        <section className="bg-gray-900 rounded-2xl p-8 border border-gray-800 shadow-2xl">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold">Vos informations personnelles</h2>
            {!editMode && (
              <button
                className="bg-gradient-to-r from-[#AD46FF] to-[#F6339A] text-white px-4 py-2 rounded-lg font-semibold"
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
          <div className="text-center mb-8">
            <p className="text-sm uppercase tracking-widest text-gray-400">Film</p>
            <h2 className="text-3xl font-bold mt-2">Soumettre un film</h2>
            <p className="text-gray-400 text-base mt-2">
              Ajoutez votre film, vos vignettes et vos sous-titres. Tous les champs marqués d'une étoile (*) sont obligatoires.
            </p>
          </div>

          <form onSubmit={handleSubmitMovie(onSubmitMovie)} className="space-y-10">
            <section>
              <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                <span className="text-[#AD46FF]">●</span> Identité du Film
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex flex-col">
                  <label htmlFor="filmTitleOriginal" className="text-white font-semibold mb-2 text-sm uppercase">
                    Titre original *
                  </label>
                  <input
                    id="filmTitleOriginal"
                    type="text"
                    placeholder="TITRE ORIGINAL"
                    {...registerMovie("filmTitleOriginal")}
                    className="bg-gray-800 border border-gray-700 text-white px-4 py-3 rounded-lg focus:outline-none focus:border-[#AD46FF] transition"
                  />
                  {movieErrors.filmTitleOriginal && (
                    <p className="text-red-400 text-sm mt-1">{movieErrors.filmTitleOriginal.message}</p>
                  )}
                </div>

                <div className="flex flex-col">
                  <label htmlFor="durationSeconds" className="text-white font-semibold mb-2 text-sm uppercase">
                    Durée exacte (en secondes) *
                  </label>
                  <input
                    id="durationSeconds"
                    type="number"
                    placeholder="EX: 60"
                    {...registerMovie("durationSeconds")}
                    max={120}
                    className="bg-gray-800 border border-gray-700 text-white px-4 py-3 rounded-lg focus:outline-none focus:border-[#AD46FF] transition"
                  />
                  <p className="text-xs text-gray-400 mt-2">Durée maximale : 2 minutes (120 secondes).</p>
                  {movieErrors.durationSeconds && (
                    <p className="text-red-400 text-sm mt-1">{movieErrors.durationSeconds.message}</p>
                  )}
                </div>

                <div className="flex flex-col">
                  <label htmlFor="filmLanguage" className="text-white font-semibold mb-2 text-sm uppercase">
                    Langue parlée / principale du film
                  </label>
                  <input
                    id="filmLanguage"
                    type="text"
                    placeholder="LANGUE"
                    {...registerMovie("filmLanguage")}
                    className="bg-gray-800 border border-gray-700 text-white px-4 py-3 rounded-lg focus:outline-none focus:border-[#AD46FF] transition"
                  />
                </div>

                <div className="flex flex-col">
                  <label htmlFor="releaseYear" className="text-white font-semibold mb-2 text-sm uppercase">
                    Année de sortie
                  </label>
                  <input
                    id="releaseYear"
                    type="number"
                    placeholder="2026"
                    {...registerMovie("releaseYear")}
                    className="bg-gray-800 border border-gray-700 text-white px-4 py-3 rounded-lg focus:outline-none focus:border-[#AD46FF] transition"
                  />
                </div>

                <div className="flex flex-col">
                  <label htmlFor="nationality" className="text-white font-semibold mb-2 text-sm uppercase">
                    Nationalité
                  </label>
                  <input
                    id="nationality"
                    type="text"
                    placeholder="NATIONALITÉ"
                    {...registerMovie("nationality")}
                    className="bg-gray-800 border border-gray-700 text-white px-4 py-3 rounded-lg focus:outline-none focus:border-[#AD46FF] transition"
                  />
                </div>

                <div className="flex flex-col">
                  <label htmlFor="translation" className="text-white font-semibold mb-2 text-sm uppercase">
                    Traduction du titre
                  </label>
                  <input
                    id="translation"
                    type="text"
                    placeholder="TRADUCTION"
                    {...registerMovie("translation")}
                    className="bg-gray-800 border border-gray-700 text-white px-4 py-3 rounded-lg focus:outline-none focus:border-[#AD46FF] transition"
                  />
                </div>

                <div className="flex flex-col">
                  <label htmlFor="youtubeLink" className="text-white font-semibold mb-2 text-sm uppercase">
                    Lien YouTube (public / non-répertorié)
                  </label>
                  <input
                    id="youtubeLink"
                    type="text"
                    placeholder="HTTPS://WWW.YOUTUBE.COM/WATCH?V=..."
                    {...registerMovie("youtubeLink")}
                    className="bg-gray-800 border border-gray-700 text-white px-4 py-3 rounded-lg focus:outline-none focus:border-[#AD46FF] transition"
                  />
                </div>

                <div className="flex flex-col md:col-span-2">
                  <label htmlFor="synopsisOriginal" className="text-white font-semibold mb-2 text-sm uppercase">
                    Synopsis langue originale * (max. 300 caractères)
                  </label>
                  <textarea
                    id="synopsisOriginal"
                    rows="4"
                    placeholder="RÉSUMEZ L'INTENTION DE VOTRE FILM ET L'HISTOIRE QU'IL RACONTE EN QUELQUES LIGNES..."
                    {...registerMovie("synopsisOriginal")}
                    maxLength={300}
                    className="bg-gray-800 border border-gray-700 text-white px-4 py-3 rounded-lg focus:outline-none focus:border-[#AD46FF] transition resize-none"
                  />
                  {movieErrors.synopsisOriginal && (
                    <p className="text-red-400 text-sm mt-1">{movieErrors.synopsisOriginal.message}</p>
                  )}
                </div>

                <div className="flex flex-col md:col-span-2">
                  <label htmlFor="synopsisEnglish" className="text-white font-semibold mb-2 text-sm uppercase">
                    Synopsis anglais (max. 300 caractères)
                  </label>
                  <textarea
                    id="synopsisEnglish"
                    rows="4"
                    placeholder="RÉSUMEZ L'INTENTION DE VOTRE FILM ET L'HISTOIRE QU'IL RACONTE EN QUELQUES LIGNES..."
                    {...registerMovie("synopsisEnglish")}
                    maxLength={300}
                    className="bg-gray-800 border border-gray-700 text-white px-4 py-3 rounded-lg focus:outline-none focus:border-[#AD46FF] transition resize-none"
                  />
                </div>
              </div>
            </section>

            <section>
              <h3 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
                <span className="text-[#F6339A]">●</span> Déclaration Usage de l'IA
              </h3>
              <p className="text-gray-400 mb-6">
                MARS.A.I exige une transparence totale sur l'utilisation de l'Intelligence Artificielle. Sélectionnez tous les outils génératifs sollicités dans votre processus créatif.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex flex-col md:col-span-2">
                  <label className="text-white font-semibold mb-2 text-sm uppercase">
                    Classification de l'Œuvre : Choix exclusif entre :
                  </label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <label className="flex items-center gap-3 bg-gray-800 border border-gray-700 rounded-lg px-4 py-3">
                      <input type="radio" value="integrale" {...registerMovie("aiClassification")} />
                      <span>Génération intégrale (100% IA)</span>
                    </label>
                    <label className="flex items-center gap-3 bg-gray-800 border border-gray-700 rounded-lg px-4 py-3">
                      <input type="radio" value="hybride" {...registerMovie("aiClassification")} />
                      <span>Production hybride (Prises de vues réelles + apports IA)</span>
                    </label>
                  </div>
                </div>

                <div className="flex flex-col">
                  <label htmlFor="aiStack" className="text-white font-semibold mb-2 text-sm uppercase">
                    Stack Technologique
                  </label>
                  <textarea
                    id="aiStack"
                    rows="3"
                    maxLength={500}
                    {...registerMovie("aiStack")}
                    placeholder="LISTEZ LES OUTILS UTILISÉS (EX: MIDJOURNEY POUR LES VISUELS, ELEVENLABS POUR LES VOIX, RUNWAY POUR L'ANIMATION...)"
                    className="bg-gray-800 border border-gray-700 text-white px-4 py-3 rounded-lg focus:outline-none focus:border-[#AD46FF] transition resize-none"
                  />
                </div>

                <div className="flex flex-col">
                  <label htmlFor="aiMethodology" className="text-white font-semibold mb-2 text-sm uppercase">
                    Méthodologie Créative
                  </label>
                  <textarea
                    id="aiMethodology"
                    rows="3"
                    maxLength={500}
                    {...registerMovie("aiMethodology")}
                    placeholder="DÉCRIVEZ L'INTERACTION ENTRE L'HUMAIN ET LA MACHINE DANS CE PROCESSUS.."
                    className="bg-gray-800 border border-gray-700 text-white px-4 py-3 rounded-lg focus:outline-none focus:border-[#AD46FF] transition resize-none"
                  />
                </div>
              </div>
            </section>

            <section>
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold text-white flex items-center gap-2">
                  <span className="text-[#AD46FF]">●</span> Collaborateurs
                </h3>
                <button
                  type="button"
                  onClick={() => appendCollaborator({ first_name: "", last_name: "", email: "", job: "" })}
                  className="px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700"
                >
                  Ajouter un collaborateur
                </button>
              </div>

              {collaboratorFields.length === 0 && (
                <p className="text-gray-400">Aucun collaborateur ajouté.</p>
              )}

              <div className="space-y-4">
                {collaboratorFields.map((field, index) => (
                  <div key={field.id} className="grid grid-cols-1 md:grid-cols-4 gap-4 bg-gray-950 border border-gray-800 p-4 rounded-xl">
                    <div className="flex flex-col">
                      <label className="text-sm uppercase text-gray-400 mb-1">Prénom</label>
                      <input
                        type="text"
                        {...registerMovie(`collaborators.${index}.first_name`)}
                        className="bg-gray-800 border border-gray-700 text-white px-3 py-2 rounded-lg"
                      />
                    </div>
                    <div className="flex flex-col">
                      <label className="text-sm uppercase text-gray-400 mb-1">Nom</label>
                      <input
                        type="text"
                        {...registerMovie(`collaborators.${index}.last_name`)}
                        className="bg-gray-800 border border-gray-700 text-white px-3 py-2 rounded-lg"
                      />
                    </div>
                    <div className="flex flex-col">
                      <label className="text-sm uppercase text-gray-400 mb-1">Email</label>
                      <input
                        type="email"
                        {...registerMovie(`collaborators.${index}.email`)}
                        className="bg-gray-800 border border-gray-700 text-white px-3 py-2 rounded-lg"
                      />
                    </div>
                    <div className="flex flex-col">
                      <label className="text-sm uppercase text-gray-400 mb-1">Rôle</label>
                      <input
                        type="text"
                        {...registerMovie(`collaborators.${index}.job`)}
                        className="bg-gray-800 border border-gray-700 text-white px-3 py-2 rounded-lg"
                      />
                    </div>
                    <div className="md:col-span-4 flex justify-end">
                      <button
                        type="button"
                        onClick={() => removeCollaborator(index)}
                        className="text-red-400 hover:text-red-300 text-sm"
                      >
                        Supprimer
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </section>


            <section>
              <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                <span className="text-[#AD46FF]">●</span> Fichiers
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex flex-col md:col-span-2">
                  <label htmlFor="filmFile" className="text-white font-semibold mb-2 text-sm uppercase">
                    Fichier du film
                  </label>
                  {(() => {
                    const { onChange, ...rest } = registerMovie("filmFile");
                    return (
                      <input
                        id="filmFile"
                        type="file"
                        {...rest}
                        className="sr-only"
                        onChange={(event) => {
                          onChange(event);
                          handleFileName(event, setFilmFileName);
                        }}
                      />
                    );
                  })()}
                  <div className="flex items-center gap-3 bg-gray-800 border border-gray-700 rounded-lg px-4 py-3">
                    <label htmlFor="filmFile" className="cursor-pointer text-white font-semibold">
                      Choisir un fichier
                    </label>
                    <span className="text-gray-400">— {filmFileName}</span>
                  </div>
                </div>

                <div className="flex flex-col">
                  <label htmlFor="thumbnail1" className="text-white font-semibold mb-2 text-sm uppercase">
                    Vignette 1 (16:9)
                  </label>
                  {(() => {
                    const { onChange, ...rest } = registerMovie("thumbnail1");
                    return (
                      <input
                        id="thumbnail1"
                        type="file"
                        {...rest}
                        className="sr-only"
                        onChange={(event) => {
                          onChange(event);
                          handleFileName(event, setThumbnail1Name);
                        }}
                      />
                    );
                  })()}
                  <div className="flex items-center gap-3 bg-gray-800 border border-gray-700 rounded-lg px-4 py-3">
                    <label htmlFor="thumbnail1" className="cursor-pointer text-white font-semibold">
                      Choisir un fichier
                    </label>
                    <span className="text-gray-400">— {thumbnail1Name}</span>
                  </div>
                </div>

                <div className="flex flex-col">
                  <label htmlFor="thumbnail2" className="text-white font-semibold mb-2 text-sm uppercase">
                    Vignette 2 (16:9)
                  </label>
                  {(() => {
                    const { onChange, ...rest } = registerMovie("thumbnail2");
                    return (
                      <input
                        id="thumbnail2"
                        type="file"
                        {...rest}
                        className="sr-only"
                        onChange={(event) => {
                          onChange(event);
                          handleFileName(event, setThumbnail2Name);
                        }}
                      />
                    );
                  })()}
                  <div className="flex items-center gap-3 bg-gray-800 border border-gray-700 rounded-lg px-4 py-3">
                    <label htmlFor="thumbnail2" className="cursor-pointer text-white font-semibold">
                      Choisir un fichier
                    </label>
                    <span className="text-gray-400">— {thumbnail2Name}</span>
                  </div>
                </div>

                <div className="flex flex-col">
                  <label htmlFor="thumbnail3" className="text-white font-semibold mb-2 text-sm uppercase">
                    Vignette 3 (16:9)
                  </label>
                  {(() => {
                    const { onChange, ...rest } = registerMovie("thumbnail3");
                    return (
                      <input
                        id="thumbnail3"
                        type="file"
                        {...rest}
                        className="sr-only"
                        onChange={(event) => {
                          onChange(event);
                          handleFileName(event, setThumbnail3Name);
                        }}
                      />
                    );
                  })()}
                  <div className="flex items-center gap-3 bg-gray-800 border border-gray-700 rounded-lg px-4 py-3">
                    <label htmlFor="thumbnail3" className="cursor-pointer text-white font-semibold">
                      Choisir un fichier
                    </label>
                    <span className="text-gray-400">— {thumbnail3Name}</span>
                  </div>
                </div>

                <div className="flex flex-col md:col-span-2">
                  <label htmlFor="subtitlesSrt" className="text-white font-semibold mb-2 text-sm uppercase">
                    Fichier de sous-titres (.srt)
                  </label>
                  {(() => {
                    const { onChange, ...rest } = registerMovie("subtitlesSrt");
                    return (
                      <input
                        id="subtitlesSrt"
                        type="file"
                        accept=".srt"
                        {...rest}
                        className="sr-only"
                        onChange={(event) => {
                          onChange(event);
                          handleFileName(event, setSubtitlesName);
                        }}
                      />
                    );
                  })()}
                  <div className="flex items-center gap-3 bg-gray-800 border border-gray-700 rounded-lg px-4 py-3">
                    <label htmlFor="subtitlesSrt" className="cursor-pointer text-white font-semibold">
                      Choisir un fichier
                    </label>
                    <span className="text-gray-400">— {subtitlesName}</span>
                  </div>
                </div>
              </div>
            </section>

            <div className="flex flex-col gap-4 pt-2">
              <button
                type="submit"
                disabled={createMovieMutation.isPending}
                className="w-full bg-gradient-to-r from-[#AD46FF] to-[#F6339A] text-white font-bold py-4 rounded-lg uppercase hover:opacity-90 transition disabled:opacity-50"
              >
                {createMovieMutation.isPending ? "Soumission en cours..." : "Soumettre le film"}
              </button>
            </div>

            {movieSuccess && (
              <div className="bg-green-900/30 border border-green-600 text-green-300 px-4 py-3 rounded-lg">
                {movieSuccess}
              </div>
            )}

            {movieError && (
              <div className="bg-red-900/30 border border-red-600 text-red-300 px-4 py-3 rounded-lg">
                {movieError}
              </div>
            )}
          </form>
        </section>

        <section className="bg-gray-900 rounded-2xl p-8 border border-gray-800 shadow-2xl">
          <h2 className="text-2xl font-bold mb-6">Votre film soumis</h2>
          {movies.length === 0 ? (
            <p className="text-gray-400">Aucun film soumis pour le moment.</p>
          ) : (
            movies.map(movie => (
              <div key={movie.id_movie} className="border border-gray-800 rounded-xl p-6 bg-gray-950">
                <div className="flex flex-col lg:flex-row gap-6">
                  <div className="flex-1">
                    <h3 className="text-2xl font-bold text-white">{movie.title}</h3>
                    <p className="text-gray-400 mt-2">{movie.synopsis || movie.description || "-"}</p>
                    <div className="grid grid-cols-2 gap-4 mt-4 text-sm text-gray-300">
                      <div><span className="text-gray-400">Durée:</span> {movie.duration ? `${movie.duration}s` : "-"}</div>
                      <div><span className="text-gray-400">Langue:</span> {movie.main_language || "-"}</div>
                      <div><span className="text-gray-400">Nationalité:</span> {movie.nationality || "-"}</div>
                      <div><span className="text-gray-400">Statut:</span> {movie.selection_status || "submitted"}</div>
                      <div><span className="text-gray-400">Outils IA:</span> {movie.ai_tool || "-"}</div>
                      <div><span className="text-gray-400">Méthodologie:</span> {movie.workshop || "-"}</div>
                      <div><span className="text-gray-400">Production:</span> {movie.production || "-"}</div>
                      <div><span className="text-gray-400">Sous-titres:</span> {movie.subtitle ? (
                        <a className="text-[#AD46FF] hover:text-[#F6339A]" href={`${uploadBase}/${movie.subtitle}`} target="_blank" rel="noreferrer">Télécharger</a>
                      ) : "-"}</div>
                    </div>

                    <div className="mt-4">
                      <div className="flex items-center justify-between">
                        <h4 className="text-sm uppercase text-gray-400">Collaborateurs</h4>
                        <button
                          type="button"
                          onClick={() => startEditCollaborators(movie)}
                          className="text-sm text-[#AD46FF] hover:text-[#F6339A]"
                        >
                          Modifier
                        </button>
                      </div>
                      {movie.Collaborators?.length ? (
                        <ul className="mt-2 text-sm text-gray-300 space-y-1">
                          {movie.Collaborators.map((collab) => (
                            <li key={collab.id_collaborator}>
                              {collab.first_name} {collab.last_name} {collab.job ? `— ${collab.job}` : ""}
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <p className="text-sm text-gray-500 mt-2">Aucun collaborateur.</p>
                      )}

                      {editingMovieId === movie.id_movie && (
                        <div className="mt-4 space-y-3">
                          {(collabDrafts[movie.id_movie] || []).map((collab, idx) => (
                            <div key={`${movie.id_movie}-collab-${idx}`} className="grid grid-cols-1 md:grid-cols-4 gap-3 bg-gray-900 border border-gray-800 p-3 rounded-lg">
                              <input
                                type="text"
                                placeholder="Prénom"
                                value={collab.first_name}
                                onChange={(e) => updateDraftField(movie.id_movie, idx, "first_name", e.target.value)}
                                className="bg-gray-800 border border-gray-700 text-white px-3 py-2 rounded-lg"
                              />
                              <input
                                type="text"
                                placeholder="Nom"
                                value={collab.last_name}
                                onChange={(e) => updateDraftField(movie.id_movie, idx, "last_name", e.target.value)}
                                className="bg-gray-800 border border-gray-700 text-white px-3 py-2 rounded-lg"
                              />
                              <input
                                type="email"
                                placeholder="Email"
                                value={collab.email}
                                onChange={(e) => updateDraftField(movie.id_movie, idx, "email", e.target.value)}
                                className="bg-gray-800 border border-gray-700 text-white px-3 py-2 rounded-lg"
                              />
                              <input
                                type="text"
                                placeholder="Rôle"
                                value={collab.job}
                                onChange={(e) => updateDraftField(movie.id_movie, idx, "job", e.target.value)}
                                className="bg-gray-800 border border-gray-700 text-white px-3 py-2 rounded-lg"
                              />
                              <div className="md:col-span-4 flex justify-end">
                                <button
                                  type="button"
                                  onClick={() => removeDraftCollaborator(movie.id_movie, idx)}
                                  className="text-red-400 hover:text-red-300 text-sm"
                                >
                                  Supprimer
                                </button>
                              </div>
                            </div>
                          ))}
                          <div className="flex flex-wrap gap-3">
                            <button
                              type="button"
                              onClick={() => addDraftCollaborator(movie.id_movie)}
                              className="px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700"
                            >
                              Ajouter un collaborateur
                            </button>
                            <button
                              type="button"
                              onClick={() => updateCollaboratorsMutation.mutate({
                                id: movie.id_movie,
                                collaborators: collabDrafts[movie.id_movie] || []
                              })}
                              className="px-4 py-2 bg-[#AD46FF] text-white rounded-lg hover:opacity-90"
                            >
                              Enregistrer
                            </button>
                            <button
                              type="button"
                              onClick={() => setEditingMovieId(null)}
                              className="px-4 py-2 border border-gray-700 rounded-lg"
                            >
                              Annuler
                            </button>
                          </div>
                        </div>
                      )}
                    </div>

                    {movie.trailer && (
                      <div className="mt-4">
                        <VideoPreview
                          title={movie.title}
                          src={`${uploadBase}/${movie.trailer}`}
                          poster={
                            movie.thumbnail
                              ? `${uploadBase}/${movie.thumbnail}`
                              : movie.display_picture
                                ? `${uploadBase}/${movie.display_picture}`
                                : movie.picture1
                                  ? `${uploadBase}/${movie.picture1}`
                                  : undefined
                          }
                        />
                      </div>
                    )}
                    {!movie.trailer && movie.youtube_link && (
                      <div className="mt-4">
                        <a className="text-[#AD46FF] hover:text-[#F6339A] font-semibold" href={movie.youtube_link} target="_blank" rel="noreferrer">
                          Voir sur YouTube
                        </a>
                      </div>
                    )}
                    {movie.trailer && (
                      <div className="mt-3">
                        <a
                          className="text-[#AD46FF] hover:text-[#F6339A] font-semibold"
                          href={`${uploadBase}/${movie.trailer}`}
                          target="_blank"
                          rel="noreferrer"
                        >
                          Ouvrir la vidéo
                        </a>
                      </div>
                    )}
                    {!movie.trailer && !movie.youtube_link && (
                      <div className="mt-3 text-sm text-amber-300">
                        Vidéo non disponible (trailer: {String(movie.trailer || "-")}, youtube: {String(movie.youtube_link || "-")}).
                      </div>
                    )}
                  </div>

                  <div className="flex-1">
                    <div className="grid grid-cols-2 gap-3">
                      {[movie.picture1, movie.picture2, movie.picture3].filter(Boolean).map((pic, idx) => (
                        <div key={`${movie.id_movie}-pic-${idx}`} className="aspect-video bg-gray-800 rounded-lg overflow-hidden">
                          <img src={`${uploadBase}/${pic}`} alt="Vignette" className="w-full h-full object-cover" />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </section>
      </div>
    </div>
  );
}
