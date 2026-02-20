/**
 * Composant ProducerHome (Accueil Producteur)
 * Page permettant aux producteurs de voir et modifier leur profil complet
 */

import { useEffect, useState } from "react";
import { VideoPreview } from "../../components/VideoPreview.jsx";
import { useMutation, useQuery } from "@tanstack/react-query";
import { zodResolver } from "@hookform/resolvers/zod";
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
  aiClassification: z.string().optional(),
  aiStack: z.string().optional(),
  aiMethodology: z.string().optional(),
  categoryId: z.string().optional(),
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
  subtitlesSrt: z.any().optional()
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
      setMovieSuccess(t('forms.producer.filmSubmission.success', 'Film submitted successfully'));
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

  // Récupération user + films + catégories
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
        setForm(userRes.data || {});
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

  function handleProfileSubmit(e) {
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
                className="bg-gradient-to-r from-[#AD46FF] to-[#F6339A] px-6 py-2 rounded-lg font-bold"
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
                      </button>
                    </div>
                  </div>
                ))}

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
              <button type="submit" disabled={createMovieMutation.isPending} className="bg-gradient-to-r from-[#AD46FF] to-[#F6339A] px-6 py-2 rounded-lg font-bold">
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
