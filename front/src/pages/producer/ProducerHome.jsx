/**
 * Composant ProducerHome (Accueil Producteur)
 * Page permettant aux producteurs de voir et modifier leur profil complet
 */

import { useEffect, useState } from "react";
import { VideoPreview } from "../../components/VideoPreview.jsx";
import { useMutation, useQuery } from "@tanstack/react-query";
import { zodResolver } from "@hookform/resolvers/zod";
<<<<<<< HEAD
import { useFieldArray, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
=======
import { useFieldArray, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
>>>>>>> origin/page-program
import * as z from "zod";
import { getCurrentUser, updateCurrentUser } from "../../api/users";
import { createMovie, getMyMovies, updateMovieCollaborators } from "../../api/movies";
import { getCategories } from "../../api/videos.js";

const movieSchema = z.object({
  filmTitleOriginal: z.string().min(1, "validation.filmTitleRequired"),
  durationSeconds: z.coerce
    .number()
    .int("validation.durationSeconds.integer")
    .min(1, "validation.durationSeconds.min")
    .max(120, "validation.durationSeconds.max"),
  filmLanguage: z.string().optional(),
  releaseYear: z.string().optional(),
  nationality: z.string().optional(),
  translation: z.string().optional(),
  youtubeLink: z.string().optional(),
  synopsisOriginal: z.string().min(1, "validation.synopsisRequired"),
  synopsisEnglish: z.string().optional(),
  aiClassification: z.string().min(1, "La classification IA est obligatoire"),
  aiStack: z.string().optional(),
  aiMethodology: z.string().optional(),
  categoryId: z.string().min(1, "La catégorie est obligatoire"),
  knownByMarsAi: z.string().optional(),
  collaborators: z
    .array(
      z.object({
        first_name: z.string().optional(),
        last_name: z.string().optional(),
        email: z.string().email("validation.invalidEmail").optional(),
        job: z.string().optional()
      })
    )
    .optional(),
  filmFile: z.any().optional(),
  thumbnail1: z.any().optional(),
  thumbnail2: z.any().optional(),
  thumbnail3: z.any().optional(),
  subtitlesSrt: z.any().optional(),
  acceptTerms: z.boolean().refine(val => val === true, {
    message: "Vous devez accepter les conditions de participation"
  })
});

export default function ProducerHome() {
  const { t } = useTranslation();

  // États utilisateur / UI
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [form, setForm] = useState({});
  const [success, setSuccess] = useState(null);

  // Films
  const [movies, setMovies] = useState([]);
  const [movieSuccess, setMovieSuccess] = useState(null);
  const [movieError, setMovieError] = useState(null);
  const [editingMovieId, setEditingMovieId] = useState(null);
  const [collabDrafts, setCollabDrafts] = useState({});
  const [filmFileName, setFilmFileName] = useState(t('common.noFileSelected'));
  const [thumbnail1Name, setThumbnail1Name] = useState(t('common.noFileSelected'));
  const [thumbnail2Name, setThumbnail2Name] = useState(t('common.noFileSelected'));
  const [thumbnail3Name, setThumbnail3Name] = useState(t('common.noFileSelected'));
  const [subtitlesName, setSubtitlesName] = useState(t('common.noFileSelected'));
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [formStep, setFormStep] = useState(1);
  const [submittedSuccess, setSubmittedSuccess] = useState(false);
  const [showCollaboratorsModal, setShowCollaboratorsModal] = useState(false);
  const [showTermsModal, setShowTermsModal] = useState(false);

  const handleFileName = (event, setter) => {
    const file = event.target.files?.[0];
    setter(file ? file.name : t('common.noFileSelected'));
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

  // Watch form fields for validation
  const filmTitleOriginal = useWatch({ control: movieControl, name: "filmTitleOriginal" });
  const durationSeconds = useWatch({ control: movieControl, name: "durationSeconds" });
  const synopsisOriginal = useWatch({ control: movieControl, name: "synopsisOriginal" });
  const acceptRules = useWatch({ control: movieControl, name: "acceptRules" });
  const aiClassification = useWatch({ control: movieControl, name: "aiClassification" });
  const categoryId = useWatch({ control: movieControl, name: "categoryId" });
  const acceptTerms = useWatch({ control: movieControl, name: "acceptTerms" });

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

      if (data.knownByMarsAi) {
        formData.append("knownByMarsAi", data.knownByMarsAi);
      }

      if (data.categoryId) {
        formData.append("categories", JSON.stringify([Number(data.categoryId)]));
      }

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
<<<<<<< HEAD
      setMovieSuccess(t('forms.producer.filmSubmission.success', 'Film submitted successfully'));
=======
      setMovieSuccess(t('forms.producer.filmSubmission.success', 'Film submitted successfully'));
>>>>>>> origin/page-program
      resetMovie();
      setFilmFileName(t('common.noFileSelected'));
      setThumbnail1Name(t('common.noFileSelected'));
      setThumbnail2Name(t('common.noFileSelected'));
      setThumbnail3Name(t('common.noFileSelected'));
      setSubtitlesName(t('common.noFileSelected'));
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
        || t('forms.producer.filmSubmission.error', 'Error submitting film')
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
      setMovieError(t('forms.producer.filmSubmission.collaboratorUpdateError', 'Error updating collaborators'));
    }
  });

  function onSubmitMovie(data) {
    return createMovieMutation.mutate(data);
  }

<<<<<<< HEAD
  // Validation functions
  const isStep1Valid = () => {
    return (
      filmTitleOriginal && 
      filmTitleOriginal.trim().length > 0 &&
      durationSeconds && 
      durationSeconds > 0 && 
      durationSeconds <= 120 &&
      synopsisOriginal && 
      synopsisOriginal.trim().length > 0
    );
  };

  const isStep2Valid = () => {
    return (
      acceptRules === true &&
      aiClassification && 
      aiClassification.trim().length > 0 &&
      categoryId && 
      categoryId.toString().trim().length > 0
    );
  };

  const handleNextStep = () => {
    if (!isStep1Valid()) {
      alert("⚠️ Veuillez compléter tous les champs obligatoires de l'étape 1:\n- Titre original\n- Durée (en secondes)\n- Synopsis");
      return;
    }
    setFormStep(2);
  };

  const handlePreviousStep = () => {
    setFormStep(1);
  };

  const handleResetForm = () => {
    setSubmittedSuccess(false);
    setFormStep(1);
    setMovieSuccess(null); // Nascondere il messaggio di successo
    setMovieError(null); // Nascondere eventuali errori
    resetMovie();
    setFilmFileName("Aucun fichier sélectionné");
    setThumbnail1Name("Aucun fichier sélectionné");
    setThumbnail2Name("Aucun fichier sélectionné");
    setThumbnail3Name("Aucun fichier sélectionné");
    setSubtitlesName("Aucun fichier sélectionné");
  };

  /**
   * Effect - Récupère les données utilisateur au chargement du composant
   * Vérifie que l'utilisateur est authentifié avant de faire l'appel API
   */
=======
  // Récupération user + films + catégories
>>>>>>> origin/page-program
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      setError(t('common.errorNotAuthenticated', 'Not authenticated'));
      setLoading(false);
      return;
    }

    Promise.all([getCurrentUser(), getMyMovies(), getCategories()])
      .then(([userRes, moviesRes, categoriesRes]) => {
        setUser(userRes.data);
<<<<<<< HEAD
        setForm(userRes.data);
        const userMovies = moviesRes.data || [];
        setMovies(userMovies);
        // Se l'utilisateur a déjà soumis des films, afficher la liste
        setSubmittedSuccess(userMovies.length > 0);
=======
        setForm(userRes.data || {});
        setMovies(moviesRes.data || []);
        setCategories(categoriesRes?.data || []);
>>>>>>> origin/page-program
        setLoading(false);
      })
      .catch(() => {
        setError(t('forms.producer.profile.errorUpdate', 'Error fetching data'));
        setLoading(false);
      });
  }, []);

  // categories state
  const [categories, setCategories] = useState([]);

  // Update profile mutation
  const updateProfileMutation = useMutation({
    mutationFn: (payload) => updateCurrentUser(payload),
    onSuccess: (res) => {
      setSuccess(t('forms.producer.profile.successUpdate', 'Profile updated successfully'));
      setUser(res.data);
      setForm(res.data);
      setEditMode(false);
    },
    onError: () => {
      setError(t('forms.producer.profile.errorUpdate', 'Error updating profile'));
    }
  });

<<<<<<< HEAD
  const categories = categoriesData?.data || [];


  if (loading) return <div className="min-h-screen bg-black text-white flex items-center justify-center">Chargement...</div>;
  if (error) return <div className="min-h-screen bg-black text-white flex items-center justify-center">{error}</div>;
  if (!user) return <div className="min-h-screen bg-black text-white flex items-center justify-center">Utilisateur introuvable</div>;

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

  /**
   * Fonction handleEditChange
   * Met à jour le state form lors de chaque modification de champ
   * @param {Event} e - L'événement du champ modifié
   */
  function handleEditChange(e) {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value
    }));
  }
  /**
   * Fonction handleSave
   * Envoie les données modifiées au serveur via updateCurrentUser
   * Supprime les champs email et role car ils ne peuvent pas être modifiés
   * Met à jour le localStorage avec le nouveau prénom
   * @param {Event} e - L'événement du formulaire
   */
  async function handleSave(e) {
=======
  function handleProfileSubmit(e) {
>>>>>>> origin/page-program
    e.preventDefault();
    updateProfileMutation.mutate(form);
  }

  // helpers to update form state
  const setFormField = (name, value) => setForm((prev) => ({ ...prev, [name]: value }));

  if (loading) {
    return <div>{t('common.loading', 'Loading...')}</div>;
  }

  if (error) {
    return <div className="text-red-400">{error}</div>;
  }

  return (
    <div className="min-h-screen bg-black text-white font-light pt-28 pb-20 px-4 md:pt-32">
<<<<<<< HEAD
      <div className="max-w-6xl mx-auto space-y-10">

        {submittedSuccess ? (
          <section className="bg-gray-900 rounded-2xl p-8 border border-gray-800 shadow-2xl">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-[#AD46FF] mb-2">Succès ! 🎬</h2>
              <p className="text-gray-300">{movieSuccess || "Votre film a été soumis avec succès au festival."}</p>
            </div>

            {movies.length > 0 && (
              <div className="mb-8">
                <h3 className="text-xl font-bold text-white mb-6">Mes films soumis</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {movies.map((movie) => (
                    <div
                      key={movie.id_movie}
                      onClick={() => setSelectedMovie(movie)}
                      className="bg-gray-950 border border-gray-800 rounded-xl overflow-hidden hover:border-[#AD46FF] transition cursor-pointer group"
                    >
                      {getPoster(movie) && (
                        <div className="relative overflow-hidden h-40 bg-gray-800">
                          <img
                            src={getPoster(movie)}
                            alt={movie.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition"
                          />
                        </div>
                      )}
                      <div className="p-4">
                        <h4 className="text-white font-semibold truncate group-hover:text-[#AD46FF] transition">
                          {movie.title || movie.filmTitleOriginal}
                        </h4>
                        <p className="text-gray-400 text-sm mt-2 line-clamp-2">
                          {movie.synopsis || movie.synopsisOriginal || "Pas de synopsis"}
                        </p>
                        <div className="mt-3 space-y-1 text-xs text-gray-500">
                          <div><span className="text-gray-400">Durée:</span> {movie.duration || movie.durationSeconds}s</div>
                          <div><span className="text-gray-400">Langue:</span> {movie.main_language || movie.filmLanguage || "-"}</div>
                          <div><span className="text-gray-400">Nationalité:</span> {movie.nationality || "-"}</div>
                          <div className="pt-2 flex items-center gap-2">
                            <span className="text-gray-400">Statut:</span>
                            <span className={`inline-block px-2 py-1 rounded text-white text-xs font-semibold ${
                              movie.selection_status === "selected" ? "bg-green-600" :
                              movie.selection_status === "refused" ? "bg-red-600" :
                              "bg-yellow-600"
                            }`}>
                              {movie.selection_status === "selected" ? "Approuvé" :
                               movie.selection_status === "refused" ? "Refusé" :
                               "En attente"}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="flex justify-center">
              <button
                onClick={handleResetForm}
                className="px-6 py-3 bg-gradient-to-r from-[#AD46FF] to-[#F6339A] text-white font-bold rounded-lg uppercase hover:opacity-90 transition"
              >
                Soumettre un nouveau film
              </button>
            </div>
          </section>
        ) : (
          <section className="bg-gray-900 rounded-2xl p-8 border border-gray-800 shadow-2xl">
            <div className="mb-8">
              <div className="flex items-center justify-center gap-4">
                <div className={`flex items-center justify-center w-10 h-10 rounded-full font-bold ${
                  formStep >= 1 ? "bg-[#AD46FF] text-white" : "bg-gray-700 text-gray-400"
                }`}>
                  1
                </div>
                <div className={`flex-1 h-1 ${formStep >= 2 ? "bg-[#AD46FF]" : "bg-gray-700"}`}></div>
                <div className={`flex items-center justify-center w-10 h-10 rounded-full font-bold ${
                  formStep >= 2 ? "bg-[#AD46FF] text-white" : "bg-gray-700 text-gray-400"
                }`}>
                  2
                </div>
              </div>
              <div className="flex justify-between mt-3 text-sm">
                <span className={formStep >= 1 ? "text-white font-semibold" : "text-gray-400"}>Données du film</span>
                <span className={formStep >= 2 ? "text-white font-semibold" : "text-gray-400"}>IA, Fichiers & Collaborateurs</span>
              </div>
            </div>

            <form onSubmit={handleSubmitMovie(onSubmitMovie)} className="space-y-8 pb-24 sm:pb-0">
              {formStep === 1 && (
                <section className="space-y-3">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <div className="flex flex-col">
                      <label htmlFor="filmTitleOriginal" className="text-white font-semibold mb-1 text-xs uppercase">
                        Titre original *
                      </label>
                      <input
                        id="filmTitleOriginal"
                        type="text"
                        placeholder="TITRE ORIGINAL"
                    {...registerMovie("filmTitleOriginal")}
                    className="bg-gray-800 border border-gray-700 text-white px-2 py-1.5 rounded-lg focus:outline-none focus:border-[#AD46FF] transition text-sm"
                  />
                  {movieErrors.filmTitleOriginal && (
                    <p className="text-red-400 text-sm mt-1">{movieErrors.filmTitleOriginal.message}</p>
                  )}
                </div>

                <div className="flex flex-col">
                  <label htmlFor="durationSeconds" className="text-white font-semibold mb-1 text-xs uppercase">
                    Durée (sec) *
                  </label>
                  <input
                    id="durationSeconds"
                    type="number"
                    placeholder="60"
                    {...registerMovie("durationSeconds")}
                    max={120}
                    className="bg-gray-800 border border-gray-700 text-white px-2 py-1.5 rounded-lg focus:outline-none focus:border-[#AD46FF] transition text-sm"
                  />
                  <p className="text-xs text-gray-300 mt-0.5">Max 120s</p>
                  {movieErrors.durationSeconds && (
                    <p className="text-red-400 text-sm mt-1">{movieErrors.durationSeconds.message}</p>
                  )}
                </div>

                <div className="flex flex-col">
                  <label htmlFor="filmLanguage" className="text-white font-semibold mb-1 text-xs uppercase">
                    Langue
                  </label>
                  <input
                    id="filmLanguage"
                    type="text"
                    placeholder="Français"
                    {...registerMovie("filmLanguage")}
                    className="bg-gray-800 border border-gray-700 text-white px-2 py-1.5 rounded-lg focus:outline-none focus:border-[#AD46FF] transition text-sm"
                  />
                </div>

                <div className="flex flex-col">
                  <label htmlFor="releaseYear" className="text-white font-semibold mb-1 text-xs uppercase">
                    Année
                  </label>
                  <input
                    id="releaseYear"
                    type="number"
                    placeholder="2026"
                    {...registerMovie("releaseYear")}
                    className="bg-gray-800 border border-gray-700 text-white px-2 py-1.5 rounded-lg focus:outline-none focus:border-[#AD46FF] transition text-sm"
                  />
                </div>

                <div className="flex flex-col">
                  <label htmlFor="nationality" className="text-white font-semibold mb-1 text-xs uppercase">
                    Nationalité
                  </label>
                  <input
                    id="nationality"
                    type="text"
                    placeholder="France"
                    {...registerMovie("nationality")}
                    className="bg-gray-800 border border-gray-700 text-white px-2 py-1.5 rounded-lg focus:outline-none focus:border-[#AD46FF] transition text-sm"
                  />
                </div>

                <div className="flex flex-col">
                  <label htmlFor="knownByMarsAi" className="text-white font-semibold mb-1 text-xs uppercase">
                    Comment connu ?
                  </label>
                  <select
                    id="knownByMarsAi"
                    {...registerMovie("knownByMarsAi")}
                    className="bg-gray-800 border border-gray-700 text-white px-2 py-1.5 rounded-lg focus:outline-none focus:border-[#AD46FF] transition text-sm"
                  >
                    <option value="">Sélectionner</option>
                    <option value="Par un ami">Par un ami</option>
                    <option value="Vu une publicité du festival">Vu une publicité du festival</option>
                    <option value="Via le site internet ou application de l'IA">Via le site internet ou application de l'IA</option>
                  </select>
                </div>

                <div className="flex flex-col">
                  <label htmlFor="categoryId" className="text-white font-semibold mb-1 text-xs uppercase">
                    Catégorie
                  </label>
                  <select
                    id="categoryId"
                    {...registerMovie("categoryId")}
                    className={`bg-gray-800 border text-white px-2 py-1.5 rounded-lg focus:outline-none focus:border-[#AD46FF] transition text-sm ${
                      movieErrors.categoryId ? "border-red-500 bg-red-950/20" : "border-gray-700"
                    }`}
                  >
                    <option value="">Sélectionner une catégorie</option>
                    {categories.map((category) => (
                      <option key={category.id_categorie} value={category.id_categorie}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                  {movieErrors.categoryId && (
                    <p className="text-red-400 text-sm mt-1">{movieErrors.categoryId.message}</p>
                  )}
                </div>

                <div className="flex flex-col">
                  <label htmlFor="translation" className="text-white font-semibold mb-1 text-xs uppercase">
                    Traduction titre
                  </label>
                  <input
                    id="translation"
                    type="text"
                    placeholder="English"
                    {...registerMovie("translation")}
                    className="bg-gray-800 border border-gray-700 text-white px-2 py-1.5 rounded-lg focus:outline-none focus:border-[#AD46FF] transition text-sm"
                  />
                </div>

                <div className="flex flex-col md:col-span-2">
                  <label htmlFor="youtubeLink" className="text-white font-semibold mb-1 text-xs uppercase">
                    Lien YouTube
                  </label>
                  <input
                    id="youtubeLink"
                    type="text"
                    placeholder="https://youtube.com/watch?v=..."
                    {...registerMovie("youtubeLink")}
                    className="bg-gray-800 border border-gray-700 text-white px-2 py-1.5 rounded-lg focus:outline-none focus:border-[#AD46FF] transition text-sm"
                  />
                </div>

                <div className="flex flex-col md:col-span-3">
                  <label htmlFor="synopsisOriginal" className="text-white font-semibold mb-1 text-xs uppercase">
                    Synopsis original * (300 char max)
                  </label>
                  <textarea
                    id="synopsisOriginal"
                    rows="2"
                    placeholder="Résumez votre film en quelques lignes..."
                    {...registerMovie("synopsisOriginal")}
                    maxLength={300}
                    className="bg-gray-800 border border-gray-700 text-white px-2 py-1.5 rounded-lg focus:outline-none focus:border-[#AD46FF] transition resize-none text-sm"
                  />
                  {movieErrors.synopsisOriginal && (
                    <p className="text-red-400 text-sm mt-1">{movieErrors.synopsisOriginal.message}</p>
                  )}
                </div>

                <div className="flex flex-col md:col-span-3">
                  <label htmlFor="synopsisEnglish" className="text-white font-semibold mb-1 text-xs uppercase">
                    Synopsis anglais (300 char max)
                  </label>
                  <textarea
                    id="synopsisEnglish"
                    rows="2"
                    placeholder="Summary in English..."
                    {...registerMovie("synopsisEnglish")}
                    maxLength={300}
                    className="bg-gray-800 border border-gray-700 text-white px-2 py-1.5 rounded-lg focus:outline-none focus:border-[#AD46FF] transition resize-none text-sm"
                  />
                </div>
              </div>
            </section>
            )}

            {formStep === 2 && (
              <>
            <section className="space-y-2">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                <div className="flex flex-col md:col-span-3">
                  <label className="text-white font-semibold mb-1 text-xs uppercase">
                    Classification IA *
                  </label>
                  <div className={`grid grid-cols-1 md:grid-cols-2 gap-2 border rounded-lg p-2 ${
                    movieErrors.aiClassification
                      ? "border-red-500 bg-red-950/20"
                      : "border-transparent"
                  }`}>
                    <label className="flex items-center gap-2 bg-gray-800 border border-gray-700 rounded-lg px-2 py-1.5 cursor-pointer">
                      <input type="radio" value="integrale" {...registerMovie("aiClassification")} className="cursor-pointer" />
                      <span className="text-sm">100% IA</span>
                    </label>
                    <label className="flex items-center gap-2 bg-gray-800 border border-gray-700 rounded-lg px-2 py-1.5 cursor-pointer">
                      <input type="radio" value="hybride" {...registerMovie("aiClassification")} className="cursor-pointer" />
                      <span className="text-sm">Hybride (Réel + IA)</span>
                    </label>
                  </div>
                  {movieErrors.aiClassification && (
                    <p className="text-red-400 text-sm mt-2">{movieErrors.aiClassification.message}</p>
                  )}
                </div>

                <div className="flex flex-col md:col-span-3">
                  <label htmlFor="aiStack" className="text-white font-semibold mb-1 text-xs uppercase">
                    Stack Technologique
                  </label>
                  <textarea
                    id="aiStack"
                    rows="2"
                    maxLength={500}
                    {...registerMovie("aiStack")}
                    placeholder="Listez les outils IA utilisés (ex: Midjourney, Runway, ElevenLabs...)"
                    className="bg-gray-800 border border-gray-700 text-white px-2 py-1.5 rounded-lg focus:outline-none focus:border-[#AD46FF] transition resize-none text-sm"
                  />
                </div>

                <div className="flex flex-col md:col-span-3">
                  <label htmlFor="aiMethodology" className="text-white font-semibold mb-1 text-xs uppercase">
                    Méthodologie Créative
                  </label>
                  <textarea
                    id="aiMethodology"
                    rows="2"
                    maxLength={500}
                    {...registerMovie("aiMethodology")}
                    placeholder="Décrivez l'interaction humain-machine dans le processus créatif..."
                    className="bg-gray-800 border border-gray-700 text-white px-2 py-1.5 rounded-lg focus:outline-none focus:border-[#AD46FF] transition resize-none text-sm"
                  />
                </div>
                <div className="flex flex-col md:col-span-3">
                  <label className="text-white font-semibold mb-1 text-xs uppercase">
                    Collaborateurs ({collaboratorFields.length})
                  </label>
                  <button
                    type="button"
                    onClick={() => setShowCollaboratorsModal(true)}
                    className="bg-gray-800 border border-gray-700 text-white px-2 py-1.5 rounded-lg hover:bg-gray-700 transition text-sm text-left"
                  >
                    {collaboratorFields.length === 0 ? "Gérer les collaborateurs" : `${collaboratorFields.length} collaborateur(s) ajouté(s) - Cliquez pour modifier`}
                  </button>
                </div>
              </div>
            </section>

            <section className="space-y-2">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                <div className="flex flex-col md:col-span-3">
                  <label htmlFor="filmFile" className="text-white font-semibold mb-1 text-xs uppercase">
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
                  <div className="flex items-center gap-2 bg-gray-800 border border-gray-700 rounded-lg px-2 py-1.5">
                    <label htmlFor="filmFile" className="cursor-pointer text-white font-semibold text-sm">
                      Choisir
                    </label>
                    <span className="text-gray-400 text-sm truncate">{filmFileName}</span>
                  </div>
                </div>

                <div className="flex flex-col">
                  <label htmlFor="thumbnail1" className="text-white font-semibold mb-1 text-xs uppercase">
                    Vignette 1
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
                  <div className="flex items-center gap-2 bg-gray-800 border border-gray-700 rounded-lg px-2 py-1.5">
                    <label htmlFor="thumbnail1" className="cursor-pointer text-white font-semibold text-sm">
                      Choisir
                    </label>
                    <span className="text-gray-400 text-xs truncate">{thumbnail1Name}</span>
                  </div>
                </div>

                <div className="flex flex-col">
                  <label htmlFor="thumbnail2" className="text-white font-semibold mb-1 text-xs uppercase">
                    Vignette 2
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
                  <div className="flex items-center gap-2 bg-gray-800 border border-gray-700 rounded-lg px-2 py-1.5">
                    <label htmlFor="thumbnail2" className="cursor-pointer text-white font-semibold text-sm">
                      Choisir
                    </label>
                    <span className="text-gray-400 text-xs truncate">{thumbnail2Name}</span>
                  </div>
                </div>

                <div className="flex flex-col">
                  <label htmlFor="thumbnail3" className="text-white font-semibold mb-1 text-xs uppercase">
                    Vignette 3
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
                  <div className="flex items-center gap-2 bg-gray-800 border border-gray-700 rounded-lg px-2 py-1.5">
                    <label htmlFor="thumbnail3" className="cursor-pointer text-white font-semibold text-sm">
                      Choisir
                    </label>
                    <span className="text-gray-400 text-xs truncate">{thumbnail3Name}</span>
                  </div>
                </div>

                <div className="flex flex-col md:col-span-3">
                  <label htmlFor="subtitlesSrt" className="text-white font-semibold mb-1 text-xs uppercase">
                    Sous-titres (.srt)
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
                  <div className="flex items-center gap-2 bg-gray-800 border border-gray-700 rounded-lg px-2 py-1.5">
                    <label htmlFor="subtitlesSrt" className="cursor-pointer text-white font-semibold text-sm">
                      Choisir
                    </label>
                    <span className="text-gray-400 text-sm truncate">{subtitlesName}</span>
                  </div>
                </div>
              </div>
            </section>

            <div className="flex items-center gap-2 bg-gray-800 border border-gray-700 rounded-lg px-2 py-1.5">
              <input
                id="acceptTerms"
                type="checkbox"
                {...registerMovie("acceptTerms")}
                className="w-4 h-4 cursor-pointer"
              />
              <label htmlFor="acceptTerms" className="text-white text-xs cursor-pointer flex-1">
                J'accepte les{" "}
                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    setShowTermsModal(true);
                  }}
                  className="text-[#AD46FF] hover:text-[#F6339A] underline font-semibold"
                >
                  conditions de participation
                </button>
              </label>
            </div>

            {movieErrors.acceptTerms && (
              <p className="text-red-400 text-sm">{movieErrors.acceptTerms.message}</p>
            )}
              </>
            )}

            <div className="flex flex-col gap-4 pt-2 mobile-form-footer">
              {formStep === 1 && (
                <button
                  type="button"
                  onClick={handleNextStep}
                  className="w-full bg-gradient-to-r from-[#AD46FF] to-[#F6339A] text-white font-bold py-4 rounded-lg uppercase hover:opacity-90 transition"
                >
                  Suivant
                </button>
              )}
              {formStep === 2 && (
                <>
                  <button
                    type="button"
                    onClick={handlePreviousStep}
                    className="w-full border border-gray-600 text-white font-bold py-4 rounded-lg uppercase hover:bg-gray-800 transition"
                  >
                    Retour
                  </button>
                  <button
                    type="submit"
                    disabled={createMovieMutation.isPending || !acceptTerms}
                    className="w-full bg-gradient-to-r from-[#AD46FF] to-[#F6339A] text-white font-bold py-4 rounded-lg uppercase hover:opacity-90 transition disabled:opacity-50"
                  >
                    {createMovieMutation.isPending ? "Soumission en cours..." : "Soumettre"}
                  </button>
                </>
              )}
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
        )}

        {showCollaboratorsModal && (
          <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4 mobile-modal-overlay">
            <div className="bg-gray-950 border border-gray-800 rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto p-6 mobile-modal-panel">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-white">Gérer les collaborateurs</h3>
                <button
                  type="button"
                  onClick={() => setShowCollaboratorsModal(false)}
                  className="text-gray-400 hover:text-white text-2xl"
                >
                  ✕
                </button>
              </div>

              <div className="mb-4">
                <button
                  type="button"
                  onClick={() => appendCollaborator({ first_name: "", last_name: "", email: "", job: "" })}
                  className="px-4 py-2 bg-[#AD46FF] text-white rounded-lg hover:opacity-90 transition"
                >
                  + Ajouter un collaborateur
                </button>
              </div>

              {collaboratorFields.length === 0 && (
                <p className="text-gray-400 text-center py-8">Aucun collaborateur ajouté.</p>
              )}

              <div className="space-y-3">
                {collaboratorFields.map((field, index) => (
                  <div key={field.id} className="grid grid-cols-1 md:grid-cols-4 gap-3 bg-gray-900 border border-gray-800 p-3 rounded-xl">
                    <div className="flex flex-col">
                      <label className="text-xs uppercase text-gray-400 mb-1">Prénom</label>
                      <input
                        type="text"
                        {...registerMovie(`collaborators.${index}.first_name`)}
                        className="bg-gray-800 border border-gray-700 text-white px-2 py-1.5 rounded-lg text-sm"
                        placeholder="Prénom"
                      />
                    </div>
                    <div className="flex flex-col">
                      <label className="text-xs uppercase text-gray-400 mb-1">Nom</label>
                      <input
                        type="text"
                        {...registerMovie(`collaborators.${index}.last_name`)}
                        className="bg-gray-800 border border-gray-700 text-white px-2 py-1.5 rounded-lg text-sm"
                        placeholder="Nom"
                      />
                    </div>
                    <div className="flex flex-col">
                      <label className="text-xs uppercase text-gray-400 mb-1">Email</label>
                      <input
                        type="email"
                        {...registerMovie(`collaborators.${index}.email`)}
                        className="bg-gray-800 border border-gray-700 text-white px-2 py-1.5 rounded-lg text-sm"
                        placeholder="email@example.com"
                      />
                    </div>
                    <div className="flex flex-col">
                      <label className="text-xs uppercase text-gray-400 mb-1">Rôle</label>
                      <input
                        type="text"
                        {...registerMovie(`collaborators.${index}.job`)}
                        className="bg-gray-800 border border-gray-700 text-white px-2 py-1.5 rounded-lg text-sm"
                        placeholder="Réalisateur, Acteur..."
                      />
                    </div>
                    <div className="md:col-span-4 flex justify-end">
                      <button
                        type="button"
                        onClick={() => removeCollaborator(index)}
                        className="text-red-400 hover:text-red-300 text-sm"
                      >
                        ✕ Supprimer
=======
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold">{t('forms.producer.profile.title')}</h1>
          <p className="text-gray-400 mt-2">{t('forms.producer.profile.subtitle', 'Manage your producer profile and submit films')}</p>
        </div>

        <div className="bg-gray-900 rounded-2xl p-6 border border-gray-800 shadow-2xl">
          <form onSubmit={handleProfileSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold mb-1">{t('forms.register.labels.firstName')}</label>
                <input
                  value={form.firstName || ""}
                  onChange={(e) => setFormField('firstName', e.target.value)}
                  placeholder={t('forms.register.placeholders.firstName')}
                  className="w-full bg-gray-800 border border-gray-700 text-white px-4 py-2 rounded-lg"
                />
                {updateProfileMutation.isError && <p className="text-red-400 text-sm mt-1">{t('forms.producer.profile.errorUpdate')}</p>}
              </div>

              <div>
                <label className="block text-sm font-semibold mb-1">{t('forms.register.labels.lastName')}</label>
                <input
                  value={form.lastName || ""}
                  onChange={(e) => setFormField('lastName', e.target.value)}
                  placeholder={t('forms.register.placeholders.lastName')}
                  className="w-full bg-gray-800 border border-gray-700 text-white px-4 py-2 rounded-lg"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold mb-1">{t('forms.register.labels.email')}</label>
                <input
                  value={form.email || ""}
                  onChange={(e) => setFormField('email', e.target.value)}
                  placeholder={t('forms.register.placeholders.email')}
                  className="w-full bg-gray-800 border border-gray-700 text-white px-4 py-2 rounded-lg"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold mb-1">{t('forms.register.labels.phone')}</label>
                <input
                  value={form.phone || ""}
                  onChange={(e) => setFormField('phone', e.target.value)}
                  placeholder={t('forms.register.placeholders.phone')}
                  className="w-full bg-gray-800 border border-gray-700 text-white px-4 py-2 rounded-lg"
                />
              </div>

              {/* autres champs profil (city, postalCode, country, biography, etc.) */}
              <div>
                <label className="block text-sm font-semibold mb-1">{t('forms.register.labels.city')}</label>
                <input
                  value={form.city || ""}
                  onChange={(e) => setFormField('city', e.target.value)}
                  placeholder={t('forms.register.placeholders.city')}
                  className="w-full bg-gray-800 border border-gray-700 text-white px-4 py-2 rounded-lg"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold mb-1">{t('forms.register.labels.postalCode')}</label>
                <input
                  value={form.postalCode || ""}
                  onChange={(e) => setFormField('postalCode', e.target.value)}
                  placeholder={t('forms.register.placeholders.postalCode')}
                  className="w-full bg-gray-800 border border-gray-700 text-white px-4 py-2 rounded-lg"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-semibold mb-1">{t('forms.register.labels.biography')}</label>
                <textarea
                  value={form.biography || ""}
                  onChange={(e) => setFormField('biography', e.target.value)}
                  placeholder={t('forms.register.placeholders.biography')}
                  rows={4}
                  className="w-full bg-gray-800 border border-gray-700 text-white px-4 py-2 rounded-lg resize-none"
                />
              </div>
            </div>

            <div className="flex gap-4">
              <button
                type="submit"
                className="bg-linear-to-r from-[#AD46FF] to-[#F6339A] px-6 py-2 rounded-lg font-bold"
              >
                {t('forms.producer.profile.save', 'Save')}
              </button>
              <button
                type="button"
                onClick={() => { setEditMode(!editMode); setSuccess(null); setError(null); }}
                className="border border-gray-700 px-6 py-2 rounded-lg"
              >
                {editMode ? t('forms.producer.profile.viewMode', 'View') : t('forms.producer.profile.editMode', 'Edit')}
              </button>
            </div>

            {success && <div className="text-green-400">{success}</div>}
            {error && <div className="text-red-400">{error}</div>}
          </form>
        </div>

        {/* Film submission */}
        <div className="mt-8 bg-gray-900 rounded-2xl p-6 border border-gray-800 shadow-2xl">
          <h2 className="text-2xl font-bold mb-4">{t('forms.producer.filmSubmission.title')}</h2>

          <form onSubmit={handleSubmitMovie(onSubmitMovie)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold mb-1">{t('forms.producer.filmSubmission.labels.filmTitleOriginal')}</label>
                <input
                  {...registerMovie("filmTitleOriginal")}
                  placeholder={t('forms.producer.filmSubmission.placeholders?.filmTitleOriginal') || ''}
                  className="w-full bg-gray-800 border border-gray-700 text-white px-4 py-2 rounded-lg"
                />
                {movieErrors.filmTitleOriginal && <p className="text-red-400 text-sm mt-1">{t(movieErrors.filmTitleOriginal.message)}</p>}
              </div>

              <div>
                <label className="block text-sm font-semibold mb-1">{t('forms.producer.filmSubmission.labels.durationSeconds')}</label>
                <input
                  {...registerMovie("durationSeconds")}
                  type="number"
                  placeholder={t('forms.producer.filmSubmission.placeholders?.durationSeconds') || ''}
                  className="w-full bg-gray-800 border border-gray-700 text-white px-4 py-2 rounded-lg"
                />
                {movieErrors.durationSeconds && <p className="text-red-400 text-sm mt-1">{t(movieErrors.durationSeconds.message)}</p>}
                <p className="text-xs text-gray-400 mt-2">{t('forms.register.hints.durationMax') || t('validation.durationMax')}</p>
              </div>

              <div>
                <label className="block text-sm font-semibold mb-1">{t('forms.producer.filmSubmission.labels.filmLanguage')}</label>
                <input
                  {...registerMovie("filmLanguage")}
                  placeholder={t('forms.producer.filmSubmission.placeholders?.filmLanguage') || ''}
                  className="w-full bg-gray-800 border border-gray-700 text-white px-4 py-2 rounded-lg"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold mb-1">{t('forms.producer.filmSubmission.labels.releaseYear')}</label>
                <input
                  {...registerMovie("releaseYear")}
                  placeholder={t('forms.producer.filmSubmission.placeholders?.releaseYear') || ''}
                  className="w-full bg-gray-800 border border-gray-700 text-white px-4 py-2 rounded-lg"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-semibold mb-1">{t('forms.producer.filmSubmission.labels.synopsisOriginal')}</label>
                <textarea
                  {...registerMovie("synopsisOriginal")}
                  placeholder={t('forms.producer.filmSubmission.placeholders?.synopsisOriginal') || ''}
                  rows={4}
                  className="w-full bg-gray-800 border border-gray-700 text-white px-4 py-2 rounded-lg resize-none"
                />
                {movieErrors.synopsisOriginal && <p className="text-red-400 text-sm mt-1">{t(movieErrors.synopsisOriginal.message)}</p>}
              </div>

              {/* Collaborators field array */}
              <div className="md:col-span-2">
                <h3 className="text-lg font-semibold mb-2">{t('forms.producer.filmSubmission.sections.collaborators')}</h3>
                {collaboratorFields.map((field, index) => (
                  <div key={field.id} className="grid grid-cols-1 md:grid-cols-4 gap-4 bg-gray-800/30 p-3 rounded-lg mb-3">
                    <input
                      {...registerMovie(`collaborators.${index}.first_name`)}
                      placeholder={t('forms.producer.filmSubmission.labels.collaborators.firstName')}
                      className="bg-gray-800 border border-gray-700 text-white px-3 py-2 rounded-lg"
                    />
                    <input
                      {...registerMovie(`collaborators.${index}.last_name`)}
                      placeholder={t('forms.producer.filmSubmission.labels.collaborators.lastName')}
                      className="bg-gray-800 border border-gray-700 text-white px-3 py-2 rounded-lg"
                    />
                    <input
                      {...registerMovie(`collaborators.${index}.email`)}
                      placeholder={t('forms.producer.filmSubmission.labels.collaborators.email')}
                      className="bg-gray-800 border border-gray-700 text-white px-3 py-2 rounded-lg"
                    />
                    <input
                      {...registerMovie(`collaborators.${index}.job`)}
                      placeholder={t('forms.producer.filmSubmission.labels.collaborators.job')}
                      className="bg-gray-800 border border-gray-700 text-white px-3 py-2 rounded-lg"
                    />
                    <div className="flex justify-end md:col-span-4">
                      <button type="button" onClick={() => removeCollaborator(index)} className="text-sm text-red-300 hover:text-red-400">
                        {t('forms.producer.filmSubmission.buttons.remove')}
>>>>>>> origin/page-program
                      </button>
                    </div>
                  </div>
                ))}
<<<<<<< HEAD
              </div>

              <div className="mt-6 flex justify-end">
                <button
                  type="button"
                  onClick={() => setShowCollaboratorsModal(false)}
                  className="px-6 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition"
                >
                  Fermer
                </button>
              </div>
            </div>
          </div>
        )}

        {showTermsModal && (
          <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4 mobile-modal-overlay">
            <div className="bg-gray-950 border border-gray-800 rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto p-6 mobile-modal-panel">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-white">Conditions de Participation & Politique de Confidentialité</h3>
                <button
                  type="button"
                  onClick={() => setShowTermsModal(false)}
                  className="text-gray-400 hover:text-white text-2xl"
                >
                  ✕
                </button>
              </div>

              <div className="space-y-4 text-gray-300 text-sm">
                <section>
                  <h4 className="text-white font-bold text-base mb-2">1. Conditions de Participation</h4>
                  <p className="mb-2">
                    En soumettant votre film au Festival MARS AI, vous acceptez que :
                  </p>
                  <ul className="list-disc list-inside space-y-1 ml-4">
                    <li>Votre film doit être une création originale utilisant l'intelligence artificielle</li>
                    <li>La durée maximale est de 2 minutes (120 secondes)</li>
                    <li>Vous détenez tous les droits nécessaires sur votre œuvre</li>
                    <li>Le festival peut utiliser des extraits à des fins promotionnelles</li>
                    <li>La décision du jury est finale et sans appel</li>
                  </ul>
                </section>

                <section>
                  <h4 className="text-white font-bold text-base mb-2">2. Droits d'Auteur</h4>
                  <p>
                    Vous conservez tous les droits d'auteur sur votre film. Le festival obtient uniquement 
                    une licence non-exclusive pour diffuser votre œuvre dans le cadre de l'événement et de sa promotion.
                  </p>
                </section>

                <section>
                  <h4 className="text-white font-bold text-base mb-2">3. Politique de Confidentialité</h4>
                  <p className="mb-2">
                    Vos données personnelles sont collectées uniquement pour :
                  </p>
                  <ul className="list-disc list-inside space-y-1 ml-4">
                    <li>La gestion de votre inscription au festival</li>
                    <li>La communication concernant votre soumission</li>
                    <li>Les statistiques anonymisées du festival</li>
                  </ul>
                  <p className="mt-2">
                    Vos données ne seront jamais vendues ou partagées avec des tiers sans votre consentement explicite.
                  </p>
                </section>

                <section>
                  <h4 className="text-white font-bold text-base mb-2">4. Utilisation de l'IA</h4>
                  <p>
                    Vous devez indiquer de manière transparente les outils d'IA utilisés dans la création de votre film 
                    et la méthodologie employée. Le non-respect de cette obligation peut entraîner la disqualification.
                  </p>
                </section>

                <section>
                  <h4 className="text-white font-bold text-base mb-2">5. Contact</h4>
                  <p>
                    Pour toute question concernant ces conditions ou vos données personnelles, contactez-nous à : 
                    <a href="mailto:contact@marsaifestival.com" className="text-[#AD46FF] hover:text-[#F6339A] ml-1">
                      contact@marsaifestival.com
                    </a>
                  </p>
                </section>
              </div>

              <div className="mt-6 flex justify-end">
                <button
                  type="button"
                  onClick={() => setShowTermsModal(false)}
                  className="px-6 py-2 bg-[#AD46FF] text-white rounded-lg hover:opacity-90 transition"
                >
                  J'ai compris
                </button>
              </div>
            </div>
          </div>
        )}

        {selectedMovie && (
          <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4 mobile-modal-overlay">
            <div className="bg-gray-950 border border-gray-800 rounded-2xl w-full max-w-5xl max-h-[85vh] overflow-hidden p-4 mobile-modal-panel">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold text-white">{selectedMovie.title}</h3>
                <button
                  type="button"
                  onClick={() => setSelectedMovie(null)}
                  className="text-gray-400 hover:text-white"
                >
                  ✕
                </button>
              </div>

              <p className="text-gray-400 mt-1 text-sm line-clamp-2">{selectedMovie.synopsis || selectedMovie.description || "-"}</p>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-3">
                <div className="space-y-3">
                  <div className="grid grid-cols-2 gap-3 text-xs text-gray-300">
                    <div><span className="text-gray-400">Durée:</span> {selectedMovie.duration ? `${selectedMovie.duration}s` : "-"}</div>
                    <div><span className="text-gray-400">Langue:</span> {selectedMovie.main_language || "-"}</div>
                    <div><span className="text-gray-400">Nationalité:</span> {selectedMovie.nationality || "-"}</div>
                    <div><span className="text-gray-400">Statut:</span> {selectedMovie.selection_status || "submitted"}</div>
                    <div><span className="text-gray-400">Outils IA:</span> {selectedMovie.ai_tool || "-"}</div>
                    <div><span className="text-gray-400">Méthodologie:</span> {selectedMovie.workshop || "-"}</div>
                  </div>

                  <div className="flex flex-wrap gap-3 text-sm">
                    {getTrailer(selectedMovie) && (
                      <span className="text-xs text-gray-400">
                        Trailer : cliquez pour plein écran
                      </span>
                    )}
                    {selectedMovie.subtitle ? (
                      <a className="text-[#AD46FF] hover:text-[#F6339A] font-semibold" href={`${uploadBase}/${selectedMovie.subtitle}`} target="_blank" rel="noreferrer">Sous-titres</a>
                    ) : null}
                    {selectedMovie.youtube_link && (
                      <a className="text-[#AD46FF] hover:text-[#F6339A] font-semibold" href={selectedMovie.youtube_link} target="_blank" rel="noreferrer">YouTube</a>
                    )}
                  </div>
                </div>

                {(getTrailer(selectedMovie) || selectedMovie.youtube_link) && (
                  <div>
                    {getTrailer(selectedMovie) ? (
                      <VideoPreview
                        title={selectedMovie.title}
                        src={`${uploadBase}/${getTrailer(selectedMovie)}`}
                        poster={getPoster(selectedMovie) || undefined}
                        openMode="fullscreen"
                      />
                    ) : (
                      <a className="text-[#AD46FF] hover:text-[#F6339A]" href={selectedMovie.youtube_link} target="_blank" rel="noreferrer">
                        Ouvrir la vidéo
                      </a>
                    )}
                  </div>
                )}
              </div>

              <div className="mt-3 border-t border-gray-800 pt-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm uppercase text-gray-400">Collaborateurs</h4>
                  <button
                    type="button"
                    onClick={() => startEditCollaborators(selectedMovie)}
                    className="text-sm text-[#AD46FF] hover:text-[#F6339A]"
                  >
                    Modifier
                  </button>
=======

                <button type="button" onClick={() => appendCollaborator({ first_name: "", last_name: "", email: "", job: "" })} className="inline-flex items-center gap-2 border border-gray-700 text-white px-4 py-2 rounded-lg">
                  {t('forms.producer.filmSubmission.buttons.addCollaborator')}
                </button>
              </div>

              {/* Files */}
              <div>
                <label className="block text-sm font-semibold mb-1">{t('forms.producer.filmSubmission.labels.filmFile')}</label>
                <input type="file" {...registerMovie("filmFile")} className="sr-only" onChange={(e) => handleFileName(e, setFilmFileName)} />
                <div className="flex items-center gap-3 bg-gray-800 border border-gray-700 rounded-lg px-4 py-3">
                  <label className="cursor-pointer text-white font-semibold">
                    {t('forms.producer.filmSubmission.buttons.chooseFile')}
                  </label>
                  <span className="text-gray-400">— {filmFileName}</span>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold mb-1">{t('forms.producer.filmSubmission.labels.thumbnail1')}</label>
                <input type="file" {...registerMovie("thumbnail1")} className="sr-only" onChange={(e) => handleFileName(e, setThumbnail1Name)} />
                <div className="flex items-center gap-3 bg-gray-800 border border-gray-700 rounded-lg px-4 py-3">
                  <label className="cursor-pointer text-white font-semibold">{t('forms.producer.filmSubmission.buttons.chooseFile')}</label>
                  <span className="text-gray-400">— {thumbnail1Name}</span>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold mb-1">{t('forms.producer.filmSubmission.labels.thumbnail2')}</label>
                <input type="file" {...registerMovie("thumbnail2")} className="sr-only" onChange={(e) => handleFileName(e, setThumbnail2Name)} />
                <div className="flex items-center gap-3 bg-gray-800 border border-gray-700 rounded-lg px-4 py-3">
                  <label className="cursor-pointer text-white font-semibold">{t('forms.producer.filmSubmission.buttons.chooseFile')}</label>
                  <span className="text-gray-400">— {thumbnail2Name}</span>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold mb-1">{t('forms.producer.filmSubmission.labels.thumbnail3')}</label>
                <input type="file" {...registerMovie("thumbnail3")} className="sr-only" onChange={(e) => handleFileName(e, setThumbnail3Name)} />
                <div className="flex items-center gap-3 bg-gray-800 border border-gray-700 rounded-lg px-4 py-3">
                  <label className="cursor-pointer text-white font-semibold">{t('forms.producer.filmSubmission.buttons.chooseFile')}</label>
                  <span className="text-gray-400">— {thumbnail3Name}</span>
>>>>>>> origin/page-program
                </div>
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-semibold mb-1">{t('forms.producer.filmSubmission.labels.subtitlesSrt')}</label>
                <input type="file" {...registerMovie("subtitlesSrt")} className="sr-only" onChange={(e) => handleFileName(e, setSubtitlesName)} />
                <div className="flex items-center gap-3 bg-gray-800 border border-gray-700 rounded-lg px-4 py-3">
                  <label className="cursor-pointer text-white font-semibold">{t('forms.producer.filmSubmission.buttons.chooseFile')}</label>
                  <span className="text-gray-400">— {subtitlesName}</span>
                </div>
              </div>
            </div>

            <div className="flex gap-4">
              <button type="submit" disabled={createMovieMutation.isPending} className="bg-linear-to-r from-[#AD46FF] to-[#F6339A] px-6 py-2 rounded-lg font-bold">
                {createMovieMutation.isPending ? `${t('forms.producer.filmSubmission.buttons.submit')}...` : t('forms.producer.filmSubmission.buttons.submit')}
              </button>
              <button type="button" onClick={() => resetMovie()} className="border border-gray-700 px-6 py-2 rounded-lg">
                {t('forms.producer.filmSubmission.buttons.cancel')}
              </button>
            </div>

            {movieSuccess && <div className="text-green-400">{movieSuccess}</div>}
            {movieError && <div className="text-red-400">{movieError}</div>}
          </form>
        </div>

        {/* Liste des films */}
        <div className="mt-8">
          <h3 className="text-2xl font-semibold mb-4">{t('forms.producer.filmSubmission.title')}</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {movies.map((m) => (
              <div key={m.id} className="bg-gray-900 rounded-lg p-4 border border-gray-800">
                <VideoPreview movie={m} />
                <div className="mt-3 flex justify-between items-center">
                  <div className="text-sm text-gray-300">{m.filmTitleOriginal}</div>
                  <div className="flex gap-2">
                    <button onClick={() => { setSelectedMovie(m); setEditingMovieId(m.id); }} className="text-sm bg-gray-800 px-3 py-1 rounded">
                      {t('forms.producer.filmSubmission.buttons.edit', 'Edit')}
                    </button>
                    <button onClick={() => { /* action */ }} className="text-sm bg-red-700 px-3 py-1 rounded">
                      {t('forms.producer.filmSubmission.buttons.remove', 'Remove')}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}