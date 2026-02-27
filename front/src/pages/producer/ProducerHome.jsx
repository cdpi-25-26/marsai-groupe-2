/**
 * ProducerHome — Espace producteur
 *
 * Corrections appliquées :
 *  - handleResetForm : setThumbnail1/2/3Name remplacés par setThumbnailNames([…])
 *  - isStep2Valid() : vérifie désormais acceptTerms (et non acceptRules inexistant)
 *  - Section profil : affichée et modifiable (était construite mais jamais rendue)
 *  - Badges de statut : les 7 étapes du pipeline sont visibles (submitted → awarded)
 *  - UPLOAD_BASE centralisé (plus de localhost hardcodé)
 */

import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { VideoPreview } from "../../components/VideoPreview.jsx";
import Navbar from "../../components/Navbar.jsx";
import { useMutation, useQuery } from "@tanstack/react-query";
import { zodResolver } from "@hookform/resolvers/zod";
import { useFieldArray, useForm, useWatch } from "react-hook-form";
import * as z from "zod";
import { getCurrentUser, updateCurrentUser } from "../../api/users";
import { createMovie, getMyMovies, updateMovieCollaborators } from "../../api/movies";
import { getCategories } from "../../api/videos.js";
import { UPLOAD_BASE } from "../../utils/constants.js";

/* ─── Schéma de validation du formulaire film ─────────── */
const movieSchema = z.object({
  filmTitleOriginal: z.string().min(1, "Le titre du film est obligatoire"),
  durationSeconds: z.coerce
    .number()
    .int("La durée doit être un nombre entier")
    .min(1, "La durée est obligatoire")
    .max(120, "La durée maximale est de 120 secondes"),
  filmLanguage:     z.string().optional(),
  releaseYear:      z.string().optional(),
  nationality:      z.string().optional(),
  translation:      z.string().optional(),
  youtubeLink:      z.string().optional(),
  synopsisOriginal: z.string().min(1, "Le synopsis est obligatoire"),
  synopsisEnglish:  z.string().optional(),
  aiClassification: z.string().min(1, "La classification IA est obligatoire"),
  aiStack:          z.string().optional(),
  aiMethodology:    z.string().optional(),
  categoryId:       z.string().min(1, "La catégorie est obligatoire"),
  knownByMarsAi:    z.string().optional(),
  collaborators: z
    .array(
      z.object({
        first_name: z.string().optional(),
        last_name:  z.string().optional(),
        email:      z.string().email("Adresse e-mail invalide").optional().or(z.literal("")),
        job:        z.string().optional(),
      })
    )
    .optional(),
  filmFile:     z.any().optional(),
  thumbnails:   z.array(z.any()).optional(),
  subtitlesSrt: z.any().optional(),
  acceptTerms:  z.boolean().refine((v) => v === true, {
    message: "Vous devez accepter les conditions de participation",
  }),
});

/* ─── Libellés des étapes du pipeline ─────────────────── */
const STATUS_MAP = {
  submitted:   { label: "Soumis",              color: "bg-gray-600"    },
  assigned:    { label: "En cours d'évaluation", color: "bg-blue-600"   },
  to_discuss:  { label: "En discussion",        color: "bg-yellow-600"  },
  candidate:   { label: "Candidat",             color: "bg-purple-600"  },
  selected:    { label: "Sélectionné ✓",        color: "bg-green-600"   },
  finalist:    { label: "Finaliste ⭐",          color: "bg-orange-600"  },
  refused:     { label: "Non retenu",           color: "bg-red-600"     },
  awarded:     { label: "Primé 🏆",             color: "bg-yellow-500"  },
};

const getStatusBadge = (status) =>
  STATUS_MAP[status] || { label: "En attente", color: "bg-gray-600" };

/* ─── Composant principal ─────────────────────────────── */
export default function ProducerHome() {
  const { t } = useTranslation();

  /* États utilisateur */
  const [user, setUser]         = useState(null);
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [form, setForm]         = useState({});
  const [success, setSuccess]   = useState(null);

  /* États films */
  const [movies, setMovies]                   = useState([]);
  const [movieSuccess, setMovieSuccess]       = useState(null);
  const [movieError, setMovieError]           = useState(null);
  const [editingMovieId, setEditingMovieId]   = useState(null);
  const [collabDrafts, setCollabDrafts]       = useState({});
  const [selectedMovie, setSelectedMovie]     = useState(null);
  const [submittedSuccess, setSubmittedSuccess] = useState(false);

  /* États formulaire multi-étapes */
  const [formStep, setFormStep]                     = useState(1);
  const [filmFileName, setFilmFileName]             = useState("Aucun fichier sélectionné");
  const [thumbnailNames, setThumbnailNames]         = useState(["Aucun fichier sélectionné"]);
  const [subtitlesName, setSubtitlesName]           = useState("Aucun fichier sélectionné");
  const [showCollaboratorsModal, setShowCollaboratorsModal] = useState(false);
  const [showTermsModal, setShowTermsModal]         = useState(false);

  /* ── Formulaire React Hook Form ── */
  const {
    register: registerMovie,
    handleSubmit: handleSubmitMovie,
    reset: resetMovie,
    control: movieControl,
    formState: { errors: movieErrors },
  } = useForm({ resolver: zodResolver(movieSchema) });

  const filmTitleOriginal = useWatch({ control: movieControl, name: "filmTitleOriginal" });
  const durationSeconds   = useWatch({ control: movieControl, name: "durationSeconds" });
  const synopsisOriginal  = useWatch({ control: movieControl, name: "synopsisOriginal" });
  const aiClassification  = useWatch({ control: movieControl, name: "aiClassification" });
  const categoryId        = useWatch({ control: movieControl, name: "categoryId" });
  const acceptTerms       = useWatch({ control: movieControl, name: "acceptTerms" });

  const { fields: collaboratorFields, append: appendCollaborator, remove: removeCollaborator } =
    useFieldArray({ control: movieControl, name: "collaborators" });

  const { fields, append, remove } =
    useFieldArray({ control: movieControl, name: "thumbnails" });

  /* ── Catégories ── */
  const { data: categoriesData } = useQuery({
    queryKey: ["categories"],
    queryFn: getCategories,
  });
  const categories = categoriesData?.data || [];

  /* ── Mutation — soumettre un film ── */
  const createMovieMutation = useMutation({
    mutationFn: async (data) => {
      const fd = new FormData();
      fd.append("filmTitleOriginal", data.filmTitleOriginal || "");
      fd.append("durationSeconds",   data.durationSeconds   || "");
      fd.append("filmLanguage",      data.filmLanguage      || "");
      fd.append("releaseYear",       data.releaseYear       || "");
      fd.append("nationality",       data.nationality       || "");
      fd.append("translation",       data.translation       || "");
      fd.append("youtubeLink",       data.youtubeLink       || "");
      fd.append("synopsisOriginal",  data.synopsisOriginal  || "");
      fd.append("synopsisEnglish",   data.synopsisEnglish   || "");
      fd.append("aiClassification",  data.aiClassification  || "");
      fd.append("aiStack",           data.aiStack           || "");
      fd.append("aiMethodology",     data.aiMethodology     || "");

      if (data.knownByMarsAi) fd.append("knownByMarsAi", data.knownByMarsAi);
      if (data.categoryId) fd.append("categories", JSON.stringify([Number(data.categoryId)]));

      if (data.collaborators?.length) {
        const normalized = data.collaborators.filter(
          (c) => c?.first_name || c?.last_name || c?.email
        );
        fd.append("collaborators", JSON.stringify(normalized));
      }

      if (data.filmFile?.[0])    fd.append("filmFile", data.filmFile[0]);
      if (data.thumbnails?.length) {
        data.thumbnails.forEach((file) => {
          if (file) fd.append("thumbnails", file);
        });
      }
      if (data.subtitlesSrt?.[0]) fd.append("subtitlesSrt", data.subtitlesSrt[0]);

      return await createMovie(fd);
    },
    onSuccess: async () => {
      setMovieError(null);
      setMovieSuccess("Film soumis avec succès.");
      setSubmittedSuccess(true);
      setFormStep(1);
      resetMovie();
      /* Correction : setThumbnailNames (tableau) — plus de setThumbnail1/2/3Name */
      setFilmFileName("Aucun fichier sélectionné");
      setThumbnailNames(["Aucun fichier sélectionné"]);
      setSubtitlesName("Aucun fichier sélectionné");
      try {
        const res = await getMyMovies();
        setMovies(res.data || []);
      } catch {
        // ignore
      }
    },
    onError: (err) => {
      setMovieSuccess(null);
      setMovieError(err?.response?.data?.error || err?.message || "Erreur lors de la soumission.");
    },
  });

  /* ── Mutation — mettre à jour les collaborateurs ── */
  const updateCollaboratorsMutation = useMutation({
    mutationFn: ({ id, collaborators }) => updateMovieCollaborators(id, collaborators),
    onSuccess: async () => {
      try {
        const res = await getMyMovies();
        setMovies(res.data || []);
      } catch {
        // ignore
      }
      setEditingMovieId(null);
    },
    onError: () => setMovieError("Erreur lors de la mise à jour des collaborateurs."),
  });

  /* ── Chargement initial ── */
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      setError("Vous n'êtes pas authentifié.");
      setLoading(false);
      return;
    }
    Promise.all([getCurrentUser(), getMyMovies()])
      .then(([userRes, moviesRes]) => {
        setUser(userRes.data);
        setForm(userRes.data);
        const list = moviesRes.data || [];
        setMovies(list);
        setSubmittedSuccess(list.length > 0);
        setLoading(false);
      })
      .catch(() => {
        setError("Impossible de charger vos données. Veuillez réessayer.");
        setLoading(false);
      });
  }, []);

  /* ── Utilitaires fichiers ── */
  const handleFileName = (event, setter) => {
    const file = event.target.files?.[0];
    setter(file ? file.name : "Aucun fichier sélectionné");
  };

  /* ── Helpers poster / trailer ── */
  const getPoster = (movie) =>
    movie.thumbnail       ? `${UPLOAD_BASE}/${movie.thumbnail}`       :
    movie.display_picture ? `${UPLOAD_BASE}/${movie.display_picture}` :
    movie.picture1        ? `${UPLOAD_BASE}/${movie.picture1}`        :
    movie.picture2        ? `${UPLOAD_BASE}/${movie.picture2}`        :
    movie.picture3        ? `${UPLOAD_BASE}/${movie.picture3}`        : null;

  const getTrailer = (movie) =>
    movie.trailer || movie.trailer_video || movie.trailerVideo || movie.filmFile || movie.video || null;

  /* ── Validation étapes ── */
  const isStep1Valid = () =>
    filmTitleOriginal?.trim().length > 0 &&
    durationSeconds > 0 && durationSeconds <= 120 &&
    synopsisOriginal?.trim().length > 0;

  /* Correction : on vérifie acceptTerms (pas acceptRules qui n'existe pas) */
  const isStep2Valid = () =>
    acceptTerms === true &&
    aiClassification?.trim().length > 0 &&
    categoryId?.toString().trim().length > 0;

  const handleNextStep = () => {
    if (!isStep1Valid()) {
      alert(t("producerHome.alertStep1"));
      return;
    }
    setFormStep(2);
  };

  /* Correction : handleResetForm ne référence plus les états inexistants */
  const handleResetForm = () => {
    setSubmittedSuccess(false);
    setFormStep(1);
    setMovieSuccess(null);
    setMovieError(null);
    resetMovie();
    setFilmFileName("Aucun fichier sélectionné");
    setThumbnailNames(["Aucun fichier sélectionné"]);
    setSubtitlesName("Aucun fichier sélectionné");
  };

  /* ── Profil ── */
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
    } catch {
      setError("Erreur lors de la mise à jour du profil.");
    }
  }

  /* ── Collaborateurs (film existant) ── */
  function startEditCollaborators(movie) {
    const existing = (movie.Collaborators || []).map((c) => ({
      first_name: c.first_name || "",
      last_name:  c.last_name  || "",
      email:      c.email      || "",
      job:        c.job        || "",
    }));
    setCollabDrafts((prev) => ({
      ...prev,
      [movie.id_movie]: existing.length
        ? existing
        : [{ first_name: "", last_name: "", email: "", job: "" }],
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
      [movieId]: [...(prev[movieId] || []), { first_name: "", last_name: "", email: "", job: "" }],
    }));
  }

  function removeDraftCollaborator(movieId, index) {
    setCollabDrafts((prev) => {
      const list = [...(prev[movieId] || [])];
      list.splice(index, 1);
      return { ...prev, [movieId]: list };
    });
  }

  /* ── Chargement / erreur ── */
  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#AD46FF] mx-auto mb-3" />
          <p className="text-gray-400">Chargement de votre espace…</p>
        </div>
      </div>
    );
  }
  if (error) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <p className="text-red-400">{error}</p>
      </div>
    );
  }
  if (!user) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <p className="text-gray-400">Utilisateur introuvable.</p>
      </div>
    );
  }

  /* ════════════════════════════════════════════════
     RENDU
  ════════════════════════════════════════════════ */
  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-black text-white font-light pt-28 pb-20 px-4 md:pt-32">
        <div className="max-w-6xl mx-auto space-y-8">

          {/* ── Section profil ───────────────────────────────── */}
          <section className="bg-gray-900 rounded-2xl p-6 border border-gray-800 shadow-2xl">
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-full bg-gradient-to-br from-[#AD46FF] to-[#F6339A] flex items-center justify-center text-2xl font-bold text-white">
                  {user.first_name?.[0]}{user.last_name?.[0]}
                </div>
                <div>
                  <h2 className="text-xl font-bold text-white">
                    {user.first_name} {user.last_name}
                  </h2>
                  <p className="text-gray-400 text-sm">{user.email}</p>
                  <span className="mt-1 inline-block px-2 py-0.5 rounded-full text-xs font-semibold bg-[#AD46FF]/20 text-[#AD46FF] border border-[#AD46FF]/30">
                    Producteur
                  </span>
                </div>
              </div>
              <button
                onClick={() => setEditMode((v) => !v)}
                className="px-4 py-2 border border-gray-700 text-white rounded-lg hover:bg-gray-800 transition text-sm"
              >
                {editMode ? "Annuler" : "Modifier le profil"}
              </button>
            </div>

            {success && (
              <div className="mb-4 bg-green-900/30 border border-green-600 text-green-300 px-4 py-3 rounded-lg text-sm">
                {success}
              </div>
            )}

            {editMode ? (
              /* ── Formulaire de modification de profil ── */
              <form onSubmit={handleSave} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  { name: "first_name",  label: "Prénom",    type: "text" },
                  { name: "last_name",   label: "Nom",       type: "text" },
                  { name: "phone",       label: "Téléphone", type: "text" },
                  { name: "nationality", label: "Nationalité", type: "text" },
                  { name: "biography",   label: "Biographie", type: "textarea" },
                  { name: "website",     label: "Site internet", type: "text" },
                ].map(({ name, label, type }) => (
                  <div key={name} className={type === "textarea" ? "md:col-span-2 flex flex-col" : "flex flex-col"}>
                    <label className="text-xs uppercase text-gray-400 mb-1">{label}</label>
                    {type === "textarea" ? (
                      <textarea
                        name={name}
                        value={form[name] || ""}
                        onChange={handleEditChange}
                        rows={3}
                        className="bg-gray-800 border border-gray-700 text-white px-3 py-2 rounded-lg text-sm focus:outline-none focus:border-[#AD46FF] resize-none"
                      />
                    ) : (
                      <input
                        type={type}
                        name={name}
                        value={form[name] || ""}
                        onChange={handleEditChange}
                        className="bg-gray-800 border border-gray-700 text-white px-3 py-2 rounded-lg text-sm focus:outline-none focus:border-[#AD46FF]"
                      />
                    )}
                  </div>
                ))}

                <div className="md:col-span-2 flex justify-end gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setEditMode(false)}
                    className="px-5 py-2 border border-gray-700 text-white rounded-lg hover:bg-gray-800 transition text-sm"
                  >
                    Annuler
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 bg-gradient-to-r from-[#AD46FF] to-[#F6339A] text-white rounded-lg font-semibold hover:opacity-90 transition text-sm"
                  >
                    Enregistrer
                  </button>
                </div>
              </form>
            ) : (
              /* ── Vue lecture du profil ── */
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                {[
                  { label: "Téléphone",    value: user.phone       },
                  { label: "Nationalité",  value: user.nationality  },
                  { label: "Site internet", value: user.website    },
                ].map(({ label, value }) => (
                  <div key={label}>
                    <p className="text-gray-500 text-xs uppercase mb-1">{label}</p>
                    <p className="text-gray-300">{value || "—"}</p>
                  </div>
                ))}
                {user.biography && (
                  <div className="md:col-span-3">
                    <p className="text-gray-500 text-xs uppercase mb-1">Biographie</p>
                    <p className="text-gray-300 leading-relaxed">{user.biography}</p>
                  </div>
                )}
              </div>
            )}
          </section>

          {/* ── Section films soumis ou formulaire ── */}
          {submittedSuccess ? (
            <section className="bg-gray-900 rounded-2xl p-8 border border-gray-800 shadow-2xl">
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-[#AD46FF] mb-2">
                  {movies.length === 1 ? "Film soumis 🎬" : "Mes films soumis 🎬"}
                </h2>
                {movieSuccess && (
                  <p className="text-gray-300">{movieSuccess}</p>
                )}
              </div>

              {/* Grille des films */}
              {movies.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                  {movies.map((movie) => {
                    const badge = getStatusBadge(movie.selection_status);
                    return (
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
                          <p className="text-gray-400 text-sm mt-1 line-clamp-2">
                            {movie.synopsis || movie.synopsisOriginal || "Aucun synopsis"}
                          </p>
                          <div className="mt-3 space-y-1 text-xs text-gray-500">
                            <div>
                              <span className="text-gray-400">Durée : </span>
                              {movie.duration || movie.durationSeconds}s
                            </div>
                            <div>
                              <span className="text-gray-400">Langue : </span>
                              {movie.main_language || movie.filmLanguage || "—"}
                            </div>
                            <div>
                              <span className="text-gray-400">Nationalité : </span>
                              {movie.nationality || "—"}
                            </div>
                            <div className="pt-2 flex items-center gap-2">
                              <span className="text-gray-400">Statut :</span>
                              <span className={`inline-block px-2 py-1 rounded text-white text-xs font-semibold ${badge.color}`}>
                                {badge.label}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
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

            /* ── Formulaire de soumission ── */
            <section className="bg-gray-900 rounded-2xl p-8 border border-gray-800 shadow-2xl">
              {/* Indicateur d'étapes */}
              <div className="mb-8">
                <div className="flex items-center justify-center gap-4">
                  {[1, 2].map((step) => (
                    <div key={step} className="flex items-center gap-4">
                      <div className={`flex items-center justify-center w-10 h-10 rounded-full font-bold ${formStep >= step ? "bg-[#AD46FF] text-white" : "bg-gray-700 text-gray-400"}`}>
                        {step}
                      </div>
                      {step < 2 && <div className={`w-16 h-1 ${formStep >= 2 ? "bg-[#AD46FF]" : "bg-gray-700"}`} />}
                    </div>
                  ))}
                </div>
                <div className="flex justify-between mt-3 text-sm px-2">
                  <span className={formStep >= 1 ? "text-white font-semibold" : "text-gray-400"}>
                    Données du film
                  </span>
                  <span className={formStep >= 2 ? "text-white font-semibold" : "text-gray-400"}>
                    IA, fichiers & collaborateurs
                  </span>
                </div>
              </div>

              <form onSubmit={handleSubmitMovie((data) => createMovieMutation.mutate(data))} className="space-y-8">

                {/* ── Étape 1 ── */}
                {formStep === 1 && (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <Field label="Titre original *" error={movieErrors.filmTitleOriginal}>
                      <input type="text" placeholder="TITRE ORIGINAL" {...registerMovie("filmTitleOriginal")}
                        className={inputCls(movieErrors.filmTitleOriginal)} />
                    </Field>

                    <Field label="Durée (secondes) *" hint="120 s maximum" error={movieErrors.durationSeconds}>
                      <input type="number" placeholder="60" max={120} {...registerMovie("durationSeconds")}
                        className={inputCls(movieErrors.durationSeconds)} />
                    </Field>

                    <Field label="Langue">
                      <input type="text" placeholder="Français" {...registerMovie("filmLanguage")}
                        className={inputCls()} />
                    </Field>

                    <Field label="Année">
                      <input type="number" placeholder="2026" {...registerMovie("releaseYear")}
                        className={inputCls()} />
                    </Field>

                    <Field label="Nationalité">
                      <input type="text" placeholder="France" {...registerMovie("nationality")}
                        className={inputCls()} />
                    </Field>

                    <Field label="Comment nous avez-vous connu ?">
                      <select {...registerMovie("knownByMarsAi")} className={inputCls()}>
                        <option value="">Sélectionner</option>
                        <option value="Par un ami">Par un ami</option>
                        <option value="Vu une publicité du festival">Via une publicité du festival</option>
                        <option value="Via le site internet ou application de l'IA">Via le site ou l'appli IA</option>
                      </select>
                    </Field>

                    <Field label="Catégorie *" error={movieErrors.categoryId}>
                      <select {...registerMovie("categoryId")} className={inputCls(movieErrors.categoryId)}>
                        <option value="">Sélectionner une catégorie</option>
                        {categories.map((cat) => (
                          <option key={cat.id_categorie} value={cat.id_categorie}>
                            {cat.name}
                          </option>
                        ))}
                      </select>
                    </Field>

                    <Field label="Traduction du titre">
                      <input type="text" placeholder="English title" {...registerMovie("translation")}
                        className={inputCls()} />
                    </Field>

                    <Field label="Lien YouTube" className="md:col-span-2">
                      <input type="text" placeholder="https://youtube.com/watch?v=…" {...registerMovie("youtubeLink")}
                        className={inputCls()} />
                    </Field>

                    <Field label="Synopsis original * (300 caractères max)" className="md:col-span-3" error={movieErrors.synopsisOriginal}>
                      <textarea rows={2} maxLength={300} placeholder="Résumez votre film en quelques lignes…"
                        {...registerMovie("synopsisOriginal")} className={`${inputCls(movieErrors.synopsisOriginal)} resize-none`} />
                    </Field>

                    <Field label="Synopsis en anglais (300 caractères max)" className="md:col-span-3">
                      <textarea rows={2} maxLength={300} placeholder="Summary in English…"
                        {...registerMovie("synopsisEnglish")} className={`${inputCls()} resize-none`} />
                    </Field>
                  </div>
                )}

                {/* ── Étape 2 ── */}
                {formStep === 2 && (
                  <>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      {/* Classification IA */}
                      <Field label="Classification IA *" className="md:col-span-3" error={movieErrors.aiClassification}>
                        <div className={`grid grid-cols-1 md:grid-cols-2 gap-2 border rounded-lg p-2 ${movieErrors.aiClassification ? "border-red-500 bg-red-950/20" : "border-transparent"}`}>
                          {[
                            { value: "integrale", label: "100 % IA" },
                            { value: "hybride",   label: "Hybride (réel + IA)" },
                          ].map((opt) => (
                            <label key={opt.value} className="flex items-center gap-2 bg-gray-800 border border-gray-700 rounded-lg px-2 py-1.5 cursor-pointer">
                              <input type="radio" value={opt.value} {...registerMovie("aiClassification")} className="cursor-pointer" />
                              <span className="text-sm">{opt.label}</span>
                            </label>
                          ))}
                        </div>
                      </Field>

                      <Field label="Outils technologiques utilisés" className="md:col-span-3">
                        <textarea rows={2} maxLength={500} placeholder="Listez les outils IA utilisés (ex. : Midjourney, Runway, ElevenLabs…)"
                          {...registerMovie("aiStack")} className={`${inputCls()} resize-none`} />
                      </Field>

                      <Field label="Méthodologie créative" className="md:col-span-3">
                        <textarea rows={2} maxLength={500} placeholder="Décrivez l'interaction humain-machine dans votre processus créatif…"
                          {...registerMovie("aiMethodology")} className={`${inputCls()} resize-none`} />
                      </Field>

                      <Field label={`Collaborateurs (${collaboratorFields.length})`} className="md:col-span-3">
                        <button type="button" onClick={() => setShowCollaboratorsModal(true)}
                          className={`${inputCls()} text-left`}>
                          {collaboratorFields.length === 0
                            ? "Gérer les collaborateurs"
                            : `${collaboratorFields.length} collaborateur(s) ajouté(s) — cliquez pour modifier`}
                        </button>
                      </Field>
                    </div>

                    {/* Fichiers */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      <Field label="Fichier du film" className="md:col-span-3">
                        {(() => {
                          const { onChange, ...rest } = registerMovie("filmFile");
                          return (
                            <>
                              <input id="filmFile" type="file" {...rest} className="sr-only"
                                onChange={(e) => { onChange(e); handleFileName(e, setFilmFileName); }} />
                              <div className="flex items-center gap-2 bg-gray-800 border border-gray-700 rounded-lg px-3 py-1.5">
                                <label htmlFor="filmFile" className="cursor-pointer text-white font-semibold text-sm whitespace-nowrap">
                                  Choisir
                                </label>
                                <span className="text-gray-400 text-sm truncate">{filmFileName}</span>
                              </div>
                            </>
                          );
                        })()}
                      </Field>

                      {/* Vignettes dynamiques */}
                      <Field label="Vignettes" className="md:col-span-3">
                        {fields.map((field, idx) => (
                          <div key={field.id} className="flex items-center gap-2 mb-2">
                            <input type="file" accept="image/*" id={`thumbnail-${idx}`} className="sr-only"
                              {...registerMovie(`thumbnails.${idx}`)}
                              onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (file) {
                                  setThumbnailNames((prev) => {
                                    const next = [...prev];
                                    next[idx] = file.name;
                                    return next;
                                  });
                                  if (idx === fields.length - 1) append({});
                                }
                              }}
                            />
                            <label htmlFor={`thumbnail-${idx}`} className="cursor-pointer text-white font-semibold text-sm bg-gray-800 border border-gray-700 rounded-lg px-3 py-1.5 whitespace-nowrap">
                              Choisir
                            </label>
                            <span className="text-gray-400 text-xs truncate">{thumbnailNames[idx] || "Aucun fichier"}</span>
                            {idx > 0 && (
                              <button type="button" onClick={() => remove(idx)} className="text-red-500 text-xs ml-1">
                                Supprimer
                              </button>
                            )}
                          </div>
                        ))}
                        {fields.length === 0 && (
                          <button type="button" onClick={() => append({})}
                            className="text-sm text-[#AD46FF] hover:text-[#F6339A] transition">
                            + Ajouter une vignette
                          </button>
                        )}
                      </Field>

                      <Field label="Sous-titres (.srt)" className="md:col-span-3">
                        {(() => {
                          const { onChange, ...rest } = registerMovie("subtitlesSrt");
                          return (
                            <>
                              <input id="subtitlesSrt" type="file" accept=".srt" {...rest} className="sr-only"
                                onChange={(e) => { onChange(e); handleFileName(e, setSubtitlesName); }} />
                              <div className="flex items-center gap-2 bg-gray-800 border border-gray-700 rounded-lg px-3 py-1.5">
                                <label htmlFor="subtitlesSrt" className="cursor-pointer text-white font-semibold text-sm whitespace-nowrap">
                                  Choisir
                                </label>
                                <span className="text-gray-400 text-sm truncate">{subtitlesName}</span>
                              </div>
                            </>
                          );
                        })()}
                      </Field>
                    </div>

                    {/* Conditions d'utilisation */}
                    <div className="flex items-center gap-2 bg-gray-800 border border-gray-700 rounded-lg px-3 py-2">
                      <input id="acceptTerms" type="checkbox" {...registerMovie("acceptTerms")} className="w-4 h-4 cursor-pointer" />
                      <label htmlFor="acceptTerms" className="text-white text-xs cursor-pointer flex-1">
                        J'accepte les{" "}
                        <button type="button" onClick={(e) => { e.preventDefault(); setShowTermsModal(true); }}
                          className="text-[#AD46FF] hover:text-[#F6339A] underline font-semibold">
                          conditions de participation
                        </button>
                      </label>
                    </div>
                    {movieErrors.acceptTerms && (
                      <p className="text-red-400 text-sm">{movieErrors.acceptTerms.message}</p>
                    )}
                  </>
                )}

                {/* ── Boutons navigation ── */}
                <div className="flex flex-col gap-3 pt-2">
                  {formStep === 1 && (
                    <button type="button" onClick={handleNextStep}
                      className="w-full bg-gradient-to-r from-[#AD46FF] to-[#F6339A] text-white font-bold py-4 rounded-lg uppercase hover:opacity-90 transition">
                      {t("common.next")}
                    </button>
                  )}
                  {formStep === 2 && (
                    <>
                      <button type="button" onClick={() => setFormStep(1)}
                        className="w-full border border-gray-600 text-white font-bold py-4 rounded-lg uppercase hover:bg-gray-800 transition">
                        {t("common.back")}
                      </button>
                      <button type="submit" disabled={createMovieMutation.isPending || !acceptTerms}
                        className="w-full bg-gradient-to-r from-[#AD46FF] to-[#F6339A] text-white font-bold py-4 rounded-lg uppercase hover:opacity-90 transition disabled:opacity-50">
                        {createMovieMutation.isPending ? t("producerHome.submitting") : t("producerHome.submit")}
                      </button>
                    </>
                  )}
                </div>

                {movieError && (
                  <div className="bg-red-900/30 border border-red-600 text-red-300 px-4 py-3 rounded-lg text-sm">
                    {movieError}
                  </div>
                )}
              </form>
            </section>
          )}
        </div>
      </div>

      {/* ════════════════════════
          MODALE COLLABORATEURS
      ════════════════════════ */}
      {showCollaboratorsModal && (
        <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4">
          <div className="bg-gray-950 border border-gray-800 rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-white">Gérer les collaborateurs</h3>
              <button type="button" onClick={() => setShowCollaboratorsModal(false)} className="text-gray-400 hover:text-white text-2xl">✕</button>
            </div>
            <button type="button" onClick={() => appendCollaborator({ first_name: "", last_name: "", email: "", job: "" })}
              className="mb-4 px-4 py-2 bg-[#AD46FF] text-white rounded-lg hover:opacity-90 transition text-sm">
              + Ajouter un collaborateur
            </button>
            {collaboratorFields.length === 0 && (
              <p className="text-gray-400 text-center py-8 text-sm">Aucun collaborateur ajouté.</p>
            )}
            <div className="space-y-3">
              {collaboratorFields.map((field, index) => (
                <div key={field.id} className="grid grid-cols-1 md:grid-cols-4 gap-3 bg-gray-900 border border-gray-800 p-3 rounded-xl">
                  {[
                    { name: `collaborators.${index}.first_name`, placeholder: "Prénom" },
                    { name: `collaborators.${index}.last_name`,  placeholder: "Nom" },
                    { name: `collaborators.${index}.email`,      placeholder: "email@exemple.com" },
                    { name: `collaborators.${index}.job`,        placeholder: "Rôle (réalisateur, acteur…)" },
                  ].map(({ name, placeholder }) => (
                    <input key={name} type="text" {...registerMovie(name)} placeholder={placeholder}
                      className="bg-gray-800 border border-gray-700 text-white px-2 py-1.5 rounded-lg text-sm" />
                  ))}
                  <div className="md:col-span-4 flex justify-end">
                    <button type="button" onClick={() => removeCollaborator(index)} className="text-red-400 hover:text-red-300 text-sm">
                      ✕ Supprimer
                    </button>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-6 flex justify-end">
              <button type="button" onClick={() => setShowCollaboratorsModal(false)}
                className="px-6 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition text-sm">
                Fermer
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ════════════════════════
          MODALE CONDITIONS
      ════════════════════════ */}
      {showTermsModal && (
        <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4">
          <div className="bg-gray-950 border border-gray-800 rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-white">Conditions de participation & politique de confidentialité</h3>
              <button type="button" onClick={() => setShowTermsModal(false)} className="text-gray-400 hover:text-white text-2xl">✕</button>
            </div>
            <div className="space-y-4 text-gray-300 text-sm">
              {[
                {
                  title: "1. Conditions de participation",
                  content: (
                    <ul className="list-disc list-inside space-y-1 ml-4 mt-2">
                      <li>Votre film doit être une création originale utilisant l'intelligence artificielle.</li>
                      <li>La durée maximale est de 2 minutes (120 secondes).</li>
                      <li>Vous détenez tous les droits nécessaires sur votre œuvre.</li>
                      <li>Le festival peut utiliser des extraits à des fins promotionnelles.</li>
                      <li>La décision du jury est définitive et sans appel.</li>
                    </ul>
                  ),
                },
                {
                  title: "2. Droits d'auteur",
                  content: <p className="mt-2">Vous conservez tous les droits d'auteur sur votre film. Le festival obtient uniquement une licence non exclusive pour diffuser votre œuvre dans le cadre de l'événement et de sa promotion.</p>,
                },
                {
                  title: "3. Politique de confidentialité",
                  content: (
                    <>
                      <ul className="list-disc list-inside space-y-1 ml-4 mt-2">
                        <li>La gestion de votre inscription au festival.</li>
                        <li>La communication concernant votre soumission.</li>
                        <li>Les statistiques anonymisées du festival.</li>
                      </ul>
                      <p className="mt-2">Vos données ne seront jamais vendues ni partagées avec des tiers sans votre consentement explicite.</p>
                    </>
                  ),
                },
                {
                  title: "4. Transparence sur l'utilisation de l'IA",
                  content: <p className="mt-2">Vous devez indiquer de façon transparente les outils d'IA utilisés dans la création de votre film ainsi que la méthodologie employée. Le non-respect de cette obligation peut entraîner la disqualification.</p>,
                },
                {
                  title: "5. Contact",
                  content: (
                    <p className="mt-2">
                      Pour toute question concernant ces conditions ou vos données personnelles :{" "}
                      <a href="mailto:contact@marsaifestival.com" className="text-[#AD46FF] hover:text-[#F6339A]">
                        contact@marsaifestival.com
                      </a>
                    </p>
                  ),
                },
              ].map(({ title, content }) => (
                <section key={title}>
                  <h4 className="text-white font-bold text-base mb-1">{title}</h4>
                  {content}
                </section>
              ))}
            </div>
            <div className="mt-6 flex justify-end">
              <button type="button" onClick={() => setShowTermsModal(false)}
                className="px-6 py-2 bg-[#AD46FF] text-white rounded-lg hover:opacity-90 transition text-sm">
                J'ai compris
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ════════════════════════
          MODALE DÉTAIL FILM
      ════════════════════════ */}
      {selectedMovie && (
        <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4">
          <div className="bg-gray-950 border border-gray-800 rounded-2xl w-full max-w-5xl max-h-[85vh] overflow-y-auto p-5">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-xl font-bold text-white">{selectedMovie.title}</h3>
              <button type="button" onClick={() => setSelectedMovie(null)} className="text-gray-400 hover:text-white text-xl">✕</button>
            </div>

            <p className="text-gray-400 text-sm mb-4 line-clamp-2">
              {selectedMovie.synopsis || selectedMovie.description || "—"}
            </p>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {/* Infos */}
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-3 text-xs text-gray-300">
                  <div><span className="text-gray-400">Durée : </span>{selectedMovie.duration ? `${selectedMovie.duration}s` : "—"}</div>
                  <div><span className="text-gray-400">Langue : </span>{selectedMovie.main_language || "—"}</div>
                  <div><span className="text-gray-400">Nationalité : </span>{selectedMovie.nationality || "—"}</div>
                  <div className="flex items-center gap-2">
                    <span className="text-gray-400">Statut : </span>
                    <span className={`px-2 py-0.5 rounded text-white text-[10px] font-semibold ${getStatusBadge(selectedMovie.selection_status).color}`}>
                      {getStatusBadge(selectedMovie.selection_status).label}
                    </span>
                  </div>
                  <div><span className="text-gray-400">Outils IA : </span>{selectedMovie.ai_tool || "—"}</div>
                  <div><span className="text-gray-400">Méthodologie : </span>{selectedMovie.workshop || "—"}</div>
                </div>

                <div className="flex flex-wrap gap-3 text-sm">
                  {selectedMovie.subtitle && (
                    <a href={`${UPLOAD_BASE}/${selectedMovie.subtitle}`} target="_blank" rel="noreferrer"
                      className="text-[#AD46FF] hover:text-[#F6339A] font-semibold text-xs">
                      Sous-titres ↓
                    </a>
                  )}
                  {selectedMovie.youtube_link && (
                    <a href={selectedMovie.youtube_link} target="_blank" rel="noreferrer"
                      className="text-[#AD46FF] hover:text-[#F6339A] font-semibold text-xs">
                      YouTube ↗
                    </a>
                  )}
                </div>

                {/* Collaborateurs */}
                <div className="pt-2 border-t border-gray-800">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="text-sm uppercase text-gray-400">Collaborateurs</h4>
                    <button type="button" onClick={() => startEditCollaborators(selectedMovie)}
                      className="text-sm text-[#AD46FF] hover:text-[#F6339A]">
                      Modifier
                    </button>
                  </div>
                  {selectedMovie.Collaborators?.length ? (
                    <ul className="text-sm text-gray-300 space-y-1">
                      {selectedMovie.Collaborators.map((c) => (
                        <li key={c.id_collaborator}>
                          {c.first_name} {c.last_name}{c.job ? ` — ${c.job}` : ""}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-sm text-gray-500">Aucun collaborateur.</p>
                  )}

                  {/* Edition collaborateurs inline */}
                  {editingMovieId === selectedMovie.id_movie && (
                    <div className="mt-3 space-y-3">
                      {(collabDrafts[selectedMovie.id_movie] || []).map((c, idx) => (
                        <div key={`${selectedMovie.id_movie}-collab-${idx}`}
                          className="grid grid-cols-1 md:grid-cols-4 gap-2 bg-gray-900 border border-gray-800 p-2 rounded-lg">
                          {["first_name", "last_name", "email", "job"].map((field) => (
                            <input key={field} type={field === "email" ? "email" : "text"}
                              placeholder={field === "first_name" ? "Prénom" : field === "last_name" ? "Nom" : field === "email" ? "E-mail" : "Rôle"}
                              value={c[field]}
                              onChange={(e) => updateDraftField(selectedMovie.id_movie, idx, field, e.target.value)}
                              className="bg-gray-800 border border-gray-700 text-white px-2 py-1.5 rounded-lg text-xs"
                            />
                          ))}
                          <div className="md:col-span-4 flex justify-end">
                            <button type="button" onClick={() => removeDraftCollaborator(selectedMovie.id_movie, idx)}
                              className="text-red-400 hover:text-red-300 text-xs">
                              ✕ Supprimer
                            </button>
                          </div>
                        </div>
                      ))}
                      <div className="flex flex-wrap gap-2">
                        <button type="button" onClick={() => addDraftCollaborator(selectedMovie.id_movie)}
                          className="px-3 py-1.5 bg-gray-800 text-white rounded-lg hover:bg-gray-700 text-sm">
                          Ajouter
                        </button>
                        <button type="button"
                          onClick={() => updateCollaboratorsMutation.mutate({ id: selectedMovie.id_movie, collaborators: collabDrafts[selectedMovie.id_movie] || [] })}
                          className="px-3 py-1.5 bg-[#AD46FF] text-white rounded-lg hover:opacity-90 text-sm">
                          Enregistrer
                        </button>
                        <button type="button" onClick={() => setEditingMovieId(null)}
                          className="px-3 py-1.5 border border-gray-700 text-white rounded-lg text-sm">
                          Annuler
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Vidéo */}
              {(getTrailer(selectedMovie) || selectedMovie.youtube_link) && (
                <div>
                  {getTrailer(selectedMovie) ? (
                    <VideoPreview
                      title={selectedMovie.title}
                      src={`${UPLOAD_BASE}/${getTrailer(selectedMovie)}`}
                      poster={getPoster(selectedMovie) || undefined}
                      openMode="fullscreen"
                    />
                  ) : (
                    <a href={selectedMovie.youtube_link} target="_blank" rel="noreferrer"
                      className="text-[#AD46FF] hover:text-[#F6339A] text-sm">
                      Ouvrir la vidéo ↗
                    </a>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}

/* ─── Helpers CSS ─────────────────────────────────────── */
const inputCls = (error) =>
  `w-full bg-gray-800 border ${error ? "border-red-500 bg-red-950/20" : "border-gray-700"} text-white px-2 py-1.5 rounded-lg text-sm focus:outline-none focus:border-[#AD46FF] transition`;

function Field({ label, hint, error, children, className = "" }) {
  return (
    <div className={`flex flex-col ${className}`}>
      <label className="text-white font-semibold mb-1 text-xs uppercase">{label}</label>
      {children}
      {hint && <p className="text-xs text-gray-400 mt-0.5">{hint}</p>}
      {error && <p className="text-red-400 text-xs mt-1">{error.message}</p>}
    </div>
  );
}