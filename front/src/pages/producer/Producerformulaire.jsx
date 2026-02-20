/**
 * Composant ProducerFormulaire
 * Formulaire de soumission d'un film par le producteur.
 * Props:
 * - categories: array — liste des catégories disponibles
 * - onMovieCreated: function — appelée après soumission réussie pour rafraîchir la liste
 */

import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { zodResolver } from "@hookform/resolvers/zod";
import { useFieldArray, useForm } from "react-hook-form";
import * as z from "zod";
import { createMovie } from "../../api/movies";

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
  categoryId: z.string().optional(),
  knownByMarsAi: z.string().optional(),
  collaborators: z
    .array(
      z.object({
        first_name: z.string().optional(),
        last_name: z.string().optional(),
        email: z.string().email("Email invalide").optional(),
        job: z.string().optional(),
      }),
    )
    .optional(),
  filmFile: z.any().optional(),
  thumbnail1: z.any().optional(),
  thumbnail2: z.any().optional(),
  thumbnail3: z.any().optional(),
  subtitlesSrt: z.any().optional(),
});

export default function ProducerFormulaire({ categories, onMovieCreated }) {
  const [filmFileName, setFilmFileName] = useState("Aucun fichier sélectionné");
  const [thumbnail1Name, setThumbnail1Name] = useState(
    "Aucun fichier sélectionné",
  );
  const [thumbnail2Name, setThumbnail2Name] = useState(
    "Aucun fichier sélectionné",
  );
  const [thumbnail3Name, setThumbnail3Name] = useState(
    "Aucun fichier sélectionné",
  );
  const [subtitlesName, setSubtitlesName] = useState(
    "Aucun fichier sélectionné",
  );
  const [movieSuccess, setMovieSuccess] = useState(null);
  const [movieError, setMovieError] = useState(null);

  const {
    register: registerMovie,
    handleSubmit: handleSubmitMovie,
    reset: resetMovie,
    control: movieControl,
    formState: { errors: movieErrors },
  } = useForm({ resolver: zodResolver(movieSchema) });

  const {
    fields: collaboratorFields,
    append: appendCollaborator,
    remove: removeCollaborator,
  } = useFieldArray({ control: movieControl, name: "collaborators" });

  const handleFileName = (event, setter) => {
    const file = event.target.files?.[0];
    setter(file ? file.name : "Aucun fichier sélectionné");
  };

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
      if (data.knownByMarsAi)
        formData.append("knownByMarsAi", data.knownByMarsAi);
      if (data.categoryId)
        formData.append(
          "categories",
          JSON.stringify([Number(data.categoryId)]),
        );
      if (data.collaborators?.length) {
        const normalized = data.collaborators.filter(
          (c) => c?.first_name || c?.last_name || c?.email,
        );
        formData.append("collaborators", JSON.stringify(normalized));
      }
      if (data.filmFile?.[0]) formData.append("filmFile", data.filmFile[0]);
      if (data.thumbnail1?.[0])
        formData.append("thumbnail1", data.thumbnail1[0]);
      if (data.thumbnail2?.[0])
        formData.append("thumbnail2", data.thumbnail2[0]);
      if (data.thumbnail3?.[0])
        formData.append("thumbnail3", data.thumbnail3[0]);
      if (data.subtitlesSrt?.[0])
        formData.append("subtitlesSrt", data.subtitlesSrt[0]);
      return await createMovie(formData);
    },
    onSuccess: () => {
      setMovieError(null);
      setMovieSuccess("Film soumis avec succès.");
      resetMovie();
      setFilmFileName("Aucun fichier sélectionné");
      setThumbnail1Name("Aucun fichier sélectionné");
      setThumbnail2Name("Aucun fichier sélectionné");
      setThumbnail3Name("Aucun fichier sélectionné");
      setSubtitlesName("Aucun fichier sélectionné");
      onMovieCreated();
    },
    onError: (err) => {
      setMovieSuccess(null);
      setMovieError(
        err?.response?.data?.error ||
          err?.message ||
          "Erreur lors de la soumission du film.",
      );
    },
  });

  return (
    <section
      id="formulaire"
      className="group relative bg-gradient-to-br from-white/[0.07] to-white/[0.02] backdrop-blur-2xl border border-white/10 rounded-xl p-5 shadow-2xl shadow-black/40 hover:border-purple-500/30 transition-all duration-500 overflow-hidden"
    >
      {/* Effet de brillance */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 pointer-events-none" />

      <div className="relative">
        <div className="text-center mb-5">
          <div className="flex items-center justify-center gap-2 mb-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500/20 to-pink-500/20 border border-white/10 flex items-center justify-center">
              <svg
                className="w-4 h-4 text-purple-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M7 4v16M17 4v16M3 8h4m10 0h4M3 12h18M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z"
                />
              </svg>
            </div>
            <h2 className="text-xl font-light text-white/90">
              Soumettre un film
            </h2>
          </div>
          <p className="text-xs text-white/40 max-w-2xl mx-auto">
            Ajoutez votre film, vos vignettes et vos sous-titres. Tous les
            champs marqués d'une étoile (*) sont obligatoires.
          </p>
        </div>

        <form
          onSubmit={handleSubmitMovie((data) =>
            createMovieMutation.mutate(data),
          )}
          className="space-y-5"
        >
          {/* ── Identité du Film ── */}
          <div className="space-y-3">
            <h3 className="text-sm font-medium text-white/60 uppercase tracking-wider flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-400" />
              Identité du Film
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="flex flex-col">
                <label
                  htmlFor="filmTitleOriginal"
                  className="text-[10px] uppercase text-white/40 mb-1"
                >
                  Titre original *
                </label>
                <input
                  id="filmTitleOriginal"
                  type="text"
                  placeholder="TITRE ORIGINAL"
                  {...registerMovie("filmTitleOriginal")}
                  className="bg-black/40 border border-white/10 text-white px-3 py-2 text-sm rounded-lg focus:outline-none focus:ring-1 focus:ring-purple-500/30 placeholder:text-white/30"
                />
                {movieErrors.filmTitleOriginal && (
                  <p className="text-red-400 text-[10px] mt-1">
                    {movieErrors.filmTitleOriginal.message}
                  </p>
                )}
              </div>

              <div className="flex flex-col">
                <label
                  htmlFor="durationSeconds"
                  className="text-[10px] uppercase text-white/40 mb-1"
                >
                  Durée (sec) *
                </label>
                <input
                  id="durationSeconds"
                  type="number"
                  placeholder="EX: 60"
                  {...registerMovie("durationSeconds")}
                  max={120}
                  className="bg-black/40 border border-white/10 text-white px-3 py-2 text-sm rounded-lg focus:outline-none focus:ring-1 focus:ring-purple-500/30 placeholder:text-white/30"
                />
                <p className="text-[9px] text-white/30 mt-1">
                  Max: 120 secondes
                </p>
                {movieErrors.durationSeconds && (
                  <p className="text-red-400 text-[10px] mt-1">
                    {movieErrors.durationSeconds.message}
                  </p>
                )}
              </div>

              <div className="flex flex-col">
                <label
                  htmlFor="filmLanguage"
                  className="text-[10px] uppercase text-white/40 mb-1"
                >
                  Langue parlée
                </label>
                <input
                  id="filmLanguage"
                  type="text"
                  placeholder="LANGUE"
                  {...registerMovie("filmLanguage")}
                  className="bg-black/40 border border-white/10 text-white px-3 py-2 text-sm rounded-lg focus:outline-none focus:ring-1 focus:ring-purple-500/30 placeholder:text-white/30"
                />
              </div>

              <div className="flex flex-col">
                <label
                  htmlFor="releaseYear"
                  className="text-[10px] uppercase text-white/40 mb-1"
                >
                  Année de sortie
                </label>
                <input
                  id="releaseYear"
                  type="number"
                  placeholder="2026"
                  {...registerMovie("releaseYear")}
                  className="bg-black/40 border border-white/10 text-white px-3 py-2 text-sm rounded-lg focus:outline-none focus:ring-1 focus:ring-purple-500/30 placeholder:text-white/30"
                />
              </div>

              <div className="flex flex-col">
                <label
                  htmlFor="nationality"
                  className="text-[10px] uppercase text-white/40 mb-1"
                >
                  Nationalité
                </label>
                <input
                  id="nationality"
                  type="text"
                  placeholder="NATIONALITÉ"
                  {...registerMovie("nationality")}
                  className="bg-black/40 border border-white/10 text-white px-3 py-2 text-sm rounded-lg focus:outline-none focus:ring-1 focus:ring-purple-500/30 placeholder:text-white/30"
                />
              </div>

              <div className="flex flex-col">
                <label
                  htmlFor="knownByMarsAi"
                  className="text-[10px] uppercase text-white/40 mb-1"
                >
                  Comment connu le Festival ?
                </label>
                <select
                  id="knownByMarsAi"
                  {...registerMovie("knownByMarsAi")}
                  className="bg-black/40 border border-white/10 text-white px-3 py-2 text-sm rounded-lg focus:outline-none focus:ring-1 focus:ring-purple-500/30"
                >
                  <option value="" className="bg-gray-900">
                    Sélectionner
                  </option>
                  <option value="Par un ami" className="bg-gray-900">
                    Par un ami
                  </option>
                  <option value="Vu une publicité" className="bg-gray-900">
                    Vu une publicité
                  </option>
                  <option value="Via le site internet" className="bg-gray-900">
                    Via le site internet
                  </option>
                </select>
              </div>

              <div className="flex flex-col">
                <label
                  htmlFor="categoryId"
                  className="text-[10px] uppercase text-white/40 mb-1"
                >
                  Catégorie
                </label>
                <select
                  id="categoryId"
                  {...registerMovie("categoryId")}
                  className="bg-black/40 border border-white/10 text-white px-3 py-2 text-sm rounded-lg focus:outline-none focus:ring-1 focus:ring-purple-500/30"
                >
                  <option value="" className="bg-gray-900">
                    Sélectionner
                  </option>
                  {categories.map((category) => (
                    <option
                      key={category.id_categorie}
                      value={category.id_categorie}
                      className="bg-gray-900"
                    >
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex flex-col">
                <label
                  htmlFor="translation"
                  className="text-[10px] uppercase text-white/40 mb-1"
                >
                  Traduction du titre
                </label>
                <input
                  id="translation"
                  type="text"
                  placeholder="TRADUCTION"
                  {...registerMovie("translation")}
                  className="bg-black/40 border border-white/10 text-white px-3 py-2 text-sm rounded-lg focus:outline-none focus:ring-1 focus:ring-purple-500/30 placeholder:text-white/30"
                />
              </div>

              <div className="flex flex-col">
                <label
                  htmlFor="youtubeLink"
                  className="text-[10px] uppercase text-white/40 mb-1"
                >
                  Lien YouTube
                </label>
                <input
                  id="youtubeLink"
                  type="text"
                  placeholder="https://youtube.com/..."
                  {...registerMovie("youtubeLink")}
                  className="bg-black/40 border border-white/10 text-white px-3 py-2 text-sm rounded-lg focus:outline-none focus:ring-1 focus:ring-purple-500/30 placeholder:text-white/30"
                />
              </div>

              <div className="flex flex-col md:col-span-2">
                <label
                  htmlFor="synopsisOriginal"
                  className="text-[10px] uppercase text-white/40 mb-1"
                >
                  Synopsis original * (max. 300)
                </label>
                <textarea
                  id="synopsisOriginal"
                  rows="2"
                  placeholder="RÉSUMEZ L'INTENTION DE VOTRE FILM..."
                  {...registerMovie("synopsisOriginal")}
                  maxLength={300}
                  className="bg-black/40 border border-white/10 text-white px-3 py-2 text-sm rounded-lg focus:outline-none focus:ring-1 focus:ring-purple-500/30 placeholder:text-white/30 resize-none"
                />
                {movieErrors.synopsisOriginal && (
                  <p className="text-red-400 text-[10px] mt-1">
                    {movieErrors.synopsisOriginal.message}
                  </p>
                )}
              </div>

              <div className="flex flex-col md:col-span-2">
                <label
                  htmlFor="synopsisEnglish"
                  className="text-[10px] uppercase text-white/40 mb-1"
                >
                  Synopsis anglais (max. 300)
                </label>
                <textarea
                  id="synopsisEnglish"
                  rows="2"
                  placeholder="RÉSUMEZ L'INTENTION DE VOTRE FILM..."
                  {...registerMovie("synopsisEnglish")}
                  maxLength={300}
                  className="bg-black/40 border border-white/10 text-white px-3 py-2 text-sm rounded-lg focus:outline-none focus:ring-1 focus:ring-purple-500/30 placeholder:text-white/30 resize-none"
                />
              </div>
            </div>
          </div>

          {/* ── Déclaration Usage de l'IA ── */}
          <div className="space-y-3">
            <h3 className="text-sm font-medium text-white/60 uppercase tracking-wider flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-purple-400" />
              Déclaration IA
            </h3>
            <p className="text-xs text-white/40 mb-2">
              Transparence sur l'utilisation de l'IA.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="flex flex-col md:col-span-2">
                <label className="text-[10px] uppercase text-white/40 mb-2">
                  Classification :
                </label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  <label className="flex items-center gap-2 bg-black/40 border border-white/10 rounded-lg px-3 py-2 hover:border-purple-500/30 transition-colors cursor-pointer">
                    <input
                      type="radio"
                      value="integrale"
                      {...registerMovie("aiClassification")}
                      className="accent-purple-500"
                    />
                    <span className="text-xs text-white/80">
                      Génération intégrale
                    </span>
                  </label>
                  <label className="flex items-center gap-2 bg-black/40 border border-white/10 rounded-lg px-3 py-2 hover:border-purple-500/30 transition-colors cursor-pointer">
                    <input
                      type="radio"
                      value="hybride"
                      {...registerMovie("aiClassification")}
                      className="accent-purple-500"
                    />
                    <span className="text-xs text-white/80">
                      Production hybride
                    </span>
                  </label>
                </div>
              </div>
              <div className="flex flex-col">
                <label
                  htmlFor="aiStack"
                  className="text-[10px] uppercase text-white/40 mb-1"
                >
                  Stack Technologique
                </label>
                <textarea
                  id="aiStack"
                  rows="2"
                  maxLength={500}
                  {...registerMovie("aiStack")}
                  placeholder="OUTILS UTILISÉS..."
                  className="bg-black/40 border border-white/10 text-white px-3 py-2 text-sm rounded-lg focus:outline-none focus:ring-1 focus:ring-purple-500/30 placeholder:text-white/30 resize-none"
                />
              </div>
              <div className="flex flex-col">
                <label
                  htmlFor="aiMethodology"
                  className="text-[10px] uppercase text-white/40 mb-1"
                >
                  Méthodologie
                </label>
                <textarea
                  id="aiMethodology"
                  rows="2"
                  maxLength={500}
                  {...registerMovie("aiMethodology")}
                  placeholder="MÉTHODOLOGIE..."
                  className="bg-black/40 border border-white/10 text-white px-3 py-2 text-sm rounded-lg focus:outline-none focus:ring-1 focus:ring-purple-500/30 placeholder:text-white/30 resize-none"
                />
              </div>
            </div>
          </div>

          {/* ── Collaborateurs ── */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-medium text-white/60 uppercase tracking-wider flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-green-400" />
                Collaborateurs
              </h3>
              <button
                type="button"
                onClick={() =>
                  appendCollaborator({
                    first_name: "",
                    last_name: "",
                    email: "",
                    job: "",
                  })
                }
                className="group/btn relative px-3 py-1.5 bg-white/5 border border-white/10 text-white/80 text-xs rounded-lg hover:bg-white/10 transition-all duration-200 overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover/btn:translate-x-full transition-transform duration-700" />
                <span className="relative">+ Ajouter</span>
              </button>
            </div>

            {collaboratorFields.length === 0 && (
              <p className="text-xs text-white/40 bg-black/30 rounded-lg p-3 text-center">
                Aucun collaborateur ajouté.
              </p>
            )}

            <div className="space-y-2">
              {collaboratorFields.map((field, index) => (
                <div
                  key={field.id}
                  className="grid grid-cols-1 md:grid-cols-4 gap-2 bg-black/40 border border-white/10 rounded-lg p-3"
                >
                  <div className="flex flex-col">
                    <label className="text-[8px] uppercase text-white/30 mb-0.5">
                      Prénom
                    </label>
                    <input
                      type="text"
                      {...registerMovie(`collaborators.${index}.first_name`)}
                      className="bg-black/60 border border-white/10 text-white px-2 py-1.5 text-xs rounded-lg focus:outline-none focus:ring-1 focus:ring-purple-500/30"
                    />
                  </div>
                  <div className="flex flex-col">
                    <label className="text-[8px] uppercase text-white/30 mb-0.5">
                      Nom
                    </label>
                    <input
                      type="text"
                      {...registerMovie(`collaborators.${index}.last_name`)}
                      className="bg-black/60 border border-white/10 text-white px-2 py-1.5 text-xs rounded-lg focus:outline-none focus:ring-1 focus:ring-purple-500/30"
                    />
                  </div>
                  <div className="flex flex-col">
                    <label className="text-[8px] uppercase text-white/30 mb-0.5">
                      Email
                    </label>
                    <input
                      type="email"
                      {...registerMovie(`collaborators.${index}.email`)}
                      className="bg-black/60 border border-white/10 text-white px-2 py-1.5 text-xs rounded-lg focus:outline-none focus:ring-1 focus:ring-purple-500/30"
                    />
                  </div>
                  <div className="flex flex-col">
                    <label className="text-[8px] uppercase text-white/30 mb-0.5">
                      Rôle
                    </label>
                    <input
                      type="text"
                      {...registerMovie(`collaborators.${index}.job`)}
                      className="bg-black/60 border border-white/10 text-white px-2 py-1.5 text-xs rounded-lg focus:outline-none focus:ring-1 focus:ring-purple-500/30"
                    />
                  </div>
                  <div className="md:col-span-4 flex justify-end">
                    <button
                      type="button"
                      onClick={() => removeCollaborator(index)}
                      className="text-red-400/70 hover:text-red-400 text-[10px] transition-colors"
                    >
                      Supprimer
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* ── Fichiers ── */}
          <div className="space-y-3">
            <h3 className="text-sm font-medium text-white/60 uppercase tracking-wider flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-orange-400" />
              Fichiers
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {/* Film file */}
              <div className="flex flex-col md:col-span-2">
                <label
                  htmlFor="filmFile"
                  className="text-[10px] uppercase text-white/40 mb-1"
                >
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
                      onChange={(e) => {
                        onChange(e);
                        handleFileName(e, setFilmFileName);
                      }}
                    />
                  );
                })()}
                <div className="flex items-center gap-2 bg-black/40 border border-white/10 rounded-lg px-3 py-2">
                  <label
                    htmlFor="filmFile"
                    className="cursor-pointer text-white/80 text-xs font-medium hover:text-white transition-colors"
                  >
                    Choisir
                  </label>
                  <span className="text-xs text-white/40">
                    — {filmFileName}
                  </span>
                </div>
              </div>

              {/* Thumbnails */}
              {[1, 2, 3].map((num) => (
                <div key={num} className="flex flex-col">
                  <label
                    htmlFor={`thumbnail${num}`}
                    className="text-[10px] uppercase text-white/40 mb-1"
                  >
                    Vignette {num}
                  </label>
                  {(() => {
                    const { onChange, ...rest } = registerMovie(
                      `thumbnail${num}`,
                    );
                    return (
                      <input
                        id={`thumbnail${num}`}
                        type="file"
                        {...rest}
                        className="sr-only"
                        onChange={(e) => {
                          onChange(e);
                          handleFileName(
                            e,
                            num === 1
                              ? setThumbnail1Name
                              : num === 2
                                ? setThumbnail2Name
                                : setThumbnail3Name,
                          );
                        }}
                      />
                    );
                  })()}
                  <div className="flex items-center gap-2 bg-black/40 border border-white/10 rounded-lg px-3 py-2">
                    <label
                      htmlFor={`thumbnail${num}`}
                      className="cursor-pointer text-white/80 text-xs font-medium hover:text-white transition-colors"
                    >
                      Choisir
                    </label>
                    <span className="text-xs text-white/40">
                      —{" "}
                      {num === 1
                        ? thumbnail1Name
                        : num === 2
                          ? thumbnail2Name
                          : thumbnail3Name}
                    </span>
                  </div>
                </div>
              ))}

              {/* Subtitles */}
              <div className="flex flex-col md:col-span-2">
                <label
                  htmlFor="subtitlesSrt"
                  className="text-[10px] uppercase text-white/40 mb-1"
                >
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
                      onChange={(e) => {
                        onChange(e);
                        handleFileName(e, setSubtitlesName);
                      }}
                    />
                  );
                })()}
                <div className="flex items-center gap-2 bg-black/40 border border-white/10 rounded-lg px-3 py-2">
                  <label
                    htmlFor="subtitlesSrt"
                    className="cursor-pointer text-white/80 text-xs font-medium hover:text-white transition-colors"
                  >
                    Choisir
                  </label>
                  <span className="text-xs text-white/40">
                    — {subtitlesName}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* ── Submit ── */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={createMovieMutation.isPending}
              className="group relative w-full px-4 py-3 bg-gradient-to-r from-purple-600/80 to-pink-600/80 text-white text-sm font-medium rounded-lg hover:from-purple-700 hover:to-pink-700 hover:scale-[1.01] transition-all duration-200 shadow-lg disabled:opacity-50 overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
              <span className="relative">
                {createMovieMutation.isPending
                  ? "Soumission..."
                  : "Soumettre le film"}
              </span>
            </button>
          </div>

          {movieSuccess && (
            <div className="p-2 bg-green-500/10 border border-green-500/30 rounded-lg text-green-300 text-xs">
              {movieSuccess}
            </div>
          )}
          {movieError && (
            <div className="p-2 bg-red-500/10 border border-red-500/30 rounded-lg text-red-300 text-xs">
              {movieError}
            </div>
          )}
        </form>
      </div>

      {/* Badge décoratif */}
      <div className="absolute top-0 right-0 w-32 h-32 overflow-hidden opacity-5 pointer-events-none">
        <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-br from-purple-500/30 to-pink-500/30 rounded-full blur-3xl" />
      </div>
    </section>
  );
}
