/**
 * Composant ProducerHome (Accueil Producteur)
 * Page permettant aux producteurs de voir et modifier leur profil complet
 */

import { useEffect, useState } from "react";
import { VideoPreview } from "../../components/VideoPreview.jsx";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useFieldArray, useForm } from "react-hook-form";
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
        setUser(userRes.data);
// ...existing code...
        setForm(userRes.data);
        const userMovies = moviesRes.data || [];
        setMovies(userMovies);
        // Se l'utilisateur a déjà soumis des films, afficher la liste
        setSubmittedSuccess(userMovies.length > 0);
// ...existing code...
        setForm(userRes.data || {});
        setMovies(moviesRes.data || []);
        setCategories(categoriesRes?.data || []);
// ...existing code...
        setLoading(false);
      })
      .catch(() => {
        setError(t('forms.producer.profile.errorUpdate', 'Error fetching data'));
        setLoading(false);
      });
  }, []);

  // categories state
  const [categories, setCategories] = useState([]);

  // Skeleton JSX: solo submission film, lista film, modali
  if (loading) return <div className="min-h-screen bg-black text-white flex items-center justify-center">Chargement...</div>;
  if (error) return <div className="min-h-screen bg-black text-white flex items-center justify-center">{error}</div>;

  return (
    <div className="min-h-screen bg-black text-white font-light pt-28 pb-20 px-4 md:pt-32">
      <div className="max-w-3xl mx-auto">
        <div className="animate-pulse flex flex-col gap-6">
          <div className="h-10 bg-gray-800 rounded w-1/2" />
          <div className="h-6 bg-gray-800 rounded w-1/3" />
          <div className="h-40 bg-gray-800 rounded" />
          <div className="h-6 bg-gray-800 rounded w-1/4" />
          <div className="h-6 bg-gray-800 rounded w-1/2" />
          <div className="h-6 bg-gray-800 rounded w-1/3" />
        </div>
      </div>
    </div>
  );
}