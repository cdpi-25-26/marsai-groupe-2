/**
 * Composant ProducerHome (Accueil Producteur)
 * Page permettant aux producteurs de voir et modifier leur profil complet
 */

import { useEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { VideoPreview } from "../../components/VideoPreview.jsx";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useFieldArray, useForm, useWatch } from "react-hook-form";
import { useTranslation } from "react-i18next";
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
  // Stati principali solo per la submission film e UI
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [movies, setMovies] = useState([]);
  const [movieSuccess, setMovieSuccess] = useState(null);
  const [movieError, setMovieError] = useState(null);
  const [editingMovieId, setEditingMovieId] = useState(null);
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

  // ...altri hook e funzioni per la submission film...

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
// ...existing code...
      setMovieSuccess(t('forms.producer.filmSubmission.success', 'Film submitted successfully'));
// ...existing code...
      setMovieSuccess(t('forms.producer.filmSubmission.success', 'Film submitted successfully'));
// ...existing code...
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

// ...existing code...
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
// ...existing code...
  // Récupération user + films + catégories
// ...existing code...
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      setError(t('common.errorNotAuthenticated', 'Not authenticated'));
      setLoading(false);
      return;
    }

    Promise.all([getCurrentUser(), getMyMovies(), getCategories()])
            .then(([userRes, moviesRes, categoriesRes]) => {
        const userMovies = moviesRes.data || [];
        setMovies(userMovies);
        // Se l'utilisateur a déjà soumis des films, afficher la liste
        setSubmittedSuccess(userMovies.length > 0);
        setMovies(moviesRes.data || []);
        setCategories(categoriesRes?.data || []);
        setLoading(false);
            })
      .catch(() => {
        setError(t('forms.producer.profile.errorUpdate', 'Error fetching data'));
        setLoading(false);
      });
  }, []);

  // categories state
  const [categories, setCategories] = useState([]);

  if (loading) return <div className="min-h-screen bg-black text-white flex items-center justify-center">{t('common.loading', 'Chargement...')}</div>;
  if (error) return <div className="min-h-screen bg-black text-white flex items-center justify-center">{error}</div>;

  return (
    <div className="min-h-screen bg-black text-white font-light pt-28 pb-20 px-4 md:pt-32">
      <div className="max-w-4xl mx-auto space-y-10">


        {/* 2. Form submission film */}
        <section className="bg-gray-900 rounded-2xl p-8 border border-gray-800 shadow-2xl">
          <h2 className="text-2xl font-bold mb-6">{t('forms.producer.filmSubmission.title', 'Soumettre un nouveau film')}</h2>
          <form className="space-y-4">
            {/* ...tutti i campi film come già presenti... */}
            <div>
              <label className="block mb-1 font-semibold">{t('forms.producer.filmSubmission.labels.filmTitleOriginal', 'Titre du film')}</label>
              <input className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2" placeholder={t('forms.producer.filmSubmission.placeholders.filmTitleOriginal', 'Titre du film')} />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block mb-1 font-semibold">{t('forms.producer.filmSubmission.labels.durationSeconds', 'Durée (secondes)')}</label>
                <input type="number" className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2" placeholder="60" />
              </div>
              <div>
                <label className="block mb-1 font-semibold">{t('forms.producer.filmSubmission.labels.filmLanguage', 'Langue')}</label>
                <input className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2" placeholder={t('forms.producer.filmSubmission.placeholders.filmLanguage', 'Français')} />
              </div>
              <div>
                <label className="block mb-1 font-semibold">{t('forms.producer.filmSubmission.labels.releaseYear', 'Année')}</label>
                <input type="number" className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2" placeholder="2026" />
              </div>
              <div>
                <label className="block mb-1 font-semibold">{t('forms.producer.filmSubmission.labels.nationality', 'Nationalité')}</label>
                <input className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2" placeholder={t('forms.producer.filmSubmission.placeholders.nationality', 'France')} />
              </div>
            </div>
            <div>
              <label className="block mb-1 font-semibold">{t('forms.producer.filmSubmission.labels.translation', 'Traduction titre')}</label>
              <input className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2" placeholder={t('forms.producer.filmSubmission.placeholders.translation', 'English')} />
            </div>
            <div>
              <label className="block mb-1 font-semibold">{t('forms.producer.filmSubmission.labels.youtubeLink', 'Lien YouTube')}</label>
              <input className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2" placeholder="https://youtube.com/watch?v=..." />
            </div>
            <div>
              <label className="block mb-1 font-semibold">{t('forms.producer.filmSubmission.labels.synopsisOriginal', 'Synopsis')}</label>
              <textarea className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2" rows={2} placeholder={t('forms.producer.filmSubmission.placeholders.synopsisOriginal', 'Résumé du film')}></textarea>
            </div>
            <div>
              <label className="block mb-1 font-semibold">{t('forms.producer.filmSubmission.labels.synopsisEnglish', 'Synopsis anglais')}</label>
              <textarea className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2" rows={2} placeholder={t('forms.producer.filmSubmission.placeholders.synopsisEnglish', 'Summary in English...')}></textarea>
            </div>
            <div>
              <label className="block mb-1 font-semibold">{t('forms.producer.filmSubmission.labels.aiClassification', 'Classification IA')}</label>
              <select className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2">
                <option value="">{t('forms.producer.filmSubmission.placeholders.aiClassification', 'Sélectionner')}</option>
                <option value="integrale">100% IA</option>
                <option value="hybride">Hybride (Réel + IA)</option>
              </select>
            </div>
            <div>
              <label className="block mb-1 font-semibold">{t('forms.producer.filmSubmission.labels.aiStack', 'Stack Technologique')}</label>
              <textarea className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2" rows={2} placeholder="Listez les outils IA utilisés (ex: Midjourney, Runway, ElevenLabs...)"></textarea>
            </div>
            <div>
              <label className="block mb-1 font-semibold">{t('forms.producer.filmSubmission.labels.aiMethodology', 'Méthodologie Créative')}</label>
              <textarea className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2" rows={2} placeholder="Décrivez l'interaction humain-machine dans le processus créatif..."></textarea>
            </div>
            <div>
              <label className="block mb-1 font-semibold">{t('forms.producer.filmSubmission.labels.categoryId', 'Catégorie')}</label>
              <select className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2">
                <option value="">{t('forms.producer.filmSubmission.placeholders.categoryId', 'Sélectionner une catégorie')}</option>
                {categories.map((cat) => (
                  <option key={cat.id_categorie} value={cat.id_categorie}>{cat.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block mb-1 font-semibold">{t('forms.producer.filmSubmission.labels.knownByMarsAi', 'Comment connu ?')}</label>
              <select className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2">
                <option value="">{t('forms.producer.filmSubmission.placeholders.knownByMarsAi', 'Sélectionner')}</option>
                <option value="Par un ami">Par un ami</option>
                <option value="Vu une publicité du festival">Vu une publicité du festival</option>
                <option value="Via le site internet ou application de l'IA">Via le site internet ou application de l'IA</option>
              </select>
            </div>
            {/* File upload campi */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block mb-1 font-semibold">{t('forms.producer.filmSubmission.labels.filmFile', 'Fichier du film')}</label>
                <input type="file" className="w-full text-gray-300" />
              </div>
              <div>
                <label className="block mb-1 font-semibold">{t('forms.producer.filmSubmission.labels.thumbnail1', 'Vignette 1')}</label>
                <input type="file" className="w-full text-gray-300" />
              </div>
              <div>
                <label className="block mb-1 font-semibold">{t('forms.producer.filmSubmission.labels.thumbnail2', 'Vignette 2')}</label>
                <input type="file" className="w-full text-gray-300" />
              </div>
              <div>
                <label className="block mb-1 font-semibold">{t('forms.producer.filmSubmission.labels.thumbnail3', 'Vignette 3')}</label>
                <input type="file" className="w-full text-gray-300" />
              </div>
              <div>
                <label className="block mb-1 font-semibold">{t('forms.producer.filmSubmission.labels.subtitlesSrt', 'Sous-titres (.srt)')}</label>
                <input type="file" className="w-full text-gray-300" />
              </div>
            </div>
            <div className="flex items-center gap-2 mt-4">
              <input type="checkbox" className="w-4 h-4" />
              <span className="text-xs">{t('forms.producer.filmSubmission.labels.acceptTerms', 'J\'accepte les conditions de participation')}</span>
            </div>
            <button type="button" className="px-6 py-3 bg-gradient-to-r from-[#AD46FF] to-[#F6339A] text-white font-bold rounded-lg uppercase hover:opacity-90 transition mt-4">{t('forms.producer.filmSubmission.buttons.submit', 'Soumettre')}</button>
          </form>
        </section>

        {/* 3. Lista film caricati */}
        <section className="bg-gray-900 rounded-2xl p-8 border border-gray-800 shadow-2xl">
          <h2 className="text-2xl font-bold mb-6">{t('forms.producer.filmSubmission.listTitle', 'Films soumis')}</h2>
          {movies && movies.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {movies.map((movie) => (
                <div key={movie.id || movie.id_movie} className="bg-gray-800 rounded-lg p-4 flex gap-4 items-center">
                  {/* Vignetta/thumbnail */}
                  {movie.thumbnail1 ? (
                    <img src={typeof movie.thumbnail1 === 'string' ? movie.thumbnail1 : URL.createObjectURL(movie.thumbnail1)} alt="thumbnail" className="w-24 h-24 object-cover rounded-lg" />
                  ) : (
                    <div className="w-24 h-24 bg-gray-700 rounded-lg flex items-center justify-center text-gray-400 text-xs">No image</div>
                  )}
                  <div className="flex-1">
                    <div className="font-semibold text-lg mb-1">{movie.filmTitleOriginal || movie.title}</div>
                    <div className="text-gray-400 text-sm mb-1">{t('forms.producer.filmSubmission.labels.durationSeconds', 'Durée')}: {movie.durationSeconds || movie.duration || '-'}</div>
                    <div className="text-gray-400 text-sm mb-1">{t('forms.producer.filmSubmission.labels.synopsisOriginal', 'Synopsis')}: {movie.synopsisOriginal || movie.synopsis || '-'}</div>
                    <div className="text-xs mt-1">
                      <span className="inline-block px-2 py-1 rounded text-white font-semibold " style={{backgroundColor: movie.selection_status === 'selected' ? '#16a34a' : movie.selection_status === 'refused' ? '#dc2626' : '#facc15'}}>
                        {movie.selection_status === 'selected' ? t('forms.producer.filmSubmission.status.selected', 'Approuvé') :
                         movie.selection_status === 'refused' ? t('forms.producer.filmSubmission.status.refusé', 'Refusé') :
                         t('forms.producer.filmSubmission.status.pending', 'En attente')}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-gray-400">{t('forms.producer.filmSubmission.noMovies', 'Aucun film soumis pour le moment.')}</div>
          )}
        </section>
      </div>
    </div>
  );
}