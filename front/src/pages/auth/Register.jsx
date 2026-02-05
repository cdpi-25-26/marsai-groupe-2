import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { signInWithFilm, login } from "../../api/auth.js";
import { useMutation } from "@tanstack/react-query";
import { zodResolver } from "@hookform/resolvers/zod";
import { useFieldArray, useForm } from "react-hook-form";
import * as z from "zod";

/**
 * Schéma de validation pour le formulaire d'enregistrement
 * Valide tous les champs du profil utilisateur
 */
const registerSchema = z.object({
  firstName: z.string().min(1, "Le prénom est requis"),
  lastName: z.string().min(1, "Le nom est requis"),
  email: z.string().email("Format d'email invalide"),
  password: z.string().min(6, "Au moins 6 caractères"),
  phone: z.string().optional(),
  mobile: z.string().optional(),
  birthDate: z.string().optional(),
  street: z.string().optional(),
  postalCode: z.string().optional(),
  city: z.string().optional(),
  country: z.string().optional(),
  biography: z.string().optional(),
  job: z.enum(["ACTOR", "DIRECTOR", "PRODUCER", "WRITER", "OTHER"]).optional(),
  portfolio: z.string().optional(),
  youtube: z.string().optional(),
  instagram: z.string().optional(),
  linkedin: z.string().optional(),
  facebook: z.string().optional(),
  tiktok: z.string().optional(),
  knownByMarsAi: z.enum(["YES", "NO"]).optional(),
  role: z.string().optional().default("PRODUCER"),
});

/**
 * Composant Register (Page d'enregistrement)
 * Formulaire complet d'enregistrement pour les nouveaux utilisateurs
 * Après enregistrement réussi, auto-login automatique
 * @returns {JSX.Element} La page d'enregistrement
 */
export function Register() {
  // Si déjà connecté, afficher un message
  if (localStorage.getItem("email")) {
    return (
      <>
        <h1 className="text-2xl">
          Vous êtes déjà connecté en tant que {localStorage.getItem("email")}
        </h1>
        <Link to="/">Aller à l'accueil</Link>
      </>
    );
  }

  const navigate = useNavigate();

  const [filmFileName, setFilmFileName] = useState("Aucun fichier sélectionné");
  const [thumbnail1Name, setThumbnail1Name] = useState("Aucun fichier sélectionné");
  const [thumbnail2Name, setThumbnail2Name] = useState("Aucun fichier sélectionné");
  const [thumbnail3Name, setThumbnail3Name] = useState("Aucun fichier sélectionné");
  const [subtitlesName, setSubtitlesName] = useState("Aucun fichier sélectionné");

  const handleFileName = (event, setter) => {
    const file = event.target.files?.[0];
    setter(file ? file.name : "Aucun fichier sélectionné");
  };

  // Configuration du formulaire avec react-hook-form et Zod
  const { register, handleSubmit, control, formState: { errors } } = useForm({
    resolver: zodResolver(registerSchema),
    defaultValues: { role: "PRODUCER", job: "PRODUCER" },
  });

  const { fields: collaboratorFields, append: appendCollaborator, remove: removeCollaborator } = useFieldArray({
    control,
    name: "collaborators"
  });

  /**
   * Mutation pour envoyer les données d'enregistrement au backend
   * Après succès, effectue un auto-login automatique
   */
  const registerMutation = useMutation({
    mutationFn: async (data) => {
      const formData = new FormData();

      formData.append("first_name", data.firstName || "");
      formData.append("last_name", data.lastName || "");
      formData.append("email", data.email || "");
      formData.append("password", data.password || "");
      formData.append("phone", data.phone || "");
      formData.append("mobile", data.mobile || "");
      formData.append("birth_date", data.birthDate || "");
      formData.append("street", data.street || "");
      formData.append("postal_code", data.postalCode || "");
      formData.append("city", data.city || "");
      formData.append("country", data.country || "");
      formData.append("biography", data.biography || "");
      formData.append("job", data.job || "PRODUCER");
      formData.append("portfolio", data.portfolio || "");
      formData.append("youtube", data.youtube || "");
      formData.append("instagram", data.instagram || "");
      formData.append("linkedin", data.linkedin || "");
      formData.append("facebook", data.facebook || "");
      formData.append("tiktok", data.tiktok || "");
      formData.append("known_by_mars_ai", data.knownByMarsAi || "");
      formData.append("role", data.role || "PRODUCER");

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

      const collaboratorsPayload = (data.collaborators || [])
        .filter(collab => collab?.first_name || collab?.last_name || collab?.email || collab?.job)
        .map(collab => ({
          first_name: collab.first_name || "",
          last_name: collab.last_name || "",
          email: collab.email || "",
          job: collab.job || ""
        }));
      formData.append("collaborators", JSON.stringify(collaboratorsPayload));

      if (data.filmFile?.[0]) formData.append("filmFile", data.filmFile[0]);
      if (data.thumbnail1?.[0]) formData.append("thumbnail1", data.thumbnail1[0]);
      if (data.thumbnail2?.[0]) formData.append("thumbnail2", data.thumbnail2[0]);
      if (data.thumbnail3?.[0]) formData.append("thumbnail3", data.thumbnail3[0]);
      if (data.subtitlesSrt?.[0]) formData.append("subtitlesSrt", data.subtitlesSrt[0]);

      return await signInWithFilm(formData);
    },
    onSuccess: async (data, variables) => {
      // Après enregistrement réussi, effectuer un login automatique
      try {
        const loginRes = await login({
          email: variables.email,
          password: variables.password
        });
        // Sauvegarder les données de session
        localStorage.setItem("email", loginRes.data?.email);
        localStorage.setItem("firstName", loginRes.data?.first_name || "");
        localStorage.setItem("lastName", loginRes.data?.last_name || "");
        localStorage.setItem("role", loginRes.data?.role);
        localStorage.setItem("token", loginRes.data?.token);
        
        // Redirection vers le tableau de bord du producteur
        navigate("/producer");
      } catch (err) {
        alert("Enregistrement réussi, mais la connexion automatique a échoué. Veuillez vous connecter manuellement.");
        navigate("/auth/login");
      }
    },
  });

  function onSubmit(data) {
    return registerMutation.mutate(data);
  }
  return (
    <div className="min-h-screen bg-black text-white font-light pt-28 pb-20 px-4 md:pt-32">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-10">
          <p className="text-sm uppercase tracking-widest text-gray-400">Film</p>
          <h1 className="text-5xl font-bold mt-2">Déposer un film</h1>
          <p className="text-gray-400 text-base mt-4">
            Transmettez les éléments techniques, l'usage de l'IA et la composition de votre équipe. Tous les champs marqués d'une étoile (*) sont obligatoires.
          </p>
        </div>

        <div className="bg-gray-900 rounded-2xl p-8 border border-gray-800 shadow-2xl">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-10">
            {/* 01. Identité du Film */}
            <section>
              <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                <span className="text-[#AD46FF]">●</span> Identité du Film
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex flex-col">
                  <label htmlFor="filmTitleOriginal" className="text-white font-semibold mb-2 text-sm uppercase">
                    Titre original *
                  </label>
                  <input
                    id="filmTitleOriginal"
                    type="text"
                    placeholder="TITRE ORIGINAL"
                    {...register("filmTitleOriginal")}
                    className="bg-gray-800 border border-gray-700 text-white px-4 py-3 rounded-lg focus:outline-none focus:border-[#AD46FF] transition"
                  />
                </div>

                <div className="flex flex-col">
                  <label htmlFor="durationSeconds" className="text-white font-semibold mb-2 text-sm uppercase">
                    Durée exacte (en secondes) *
                  </label>
                  <input
                    id="durationSeconds"
                    type="number"
                    placeholder="EX: 60"
                    {...register("durationSeconds")}
                    className="bg-gray-800 border border-gray-700 text-white px-4 py-3 rounded-lg focus:outline-none focus:border-[#AD46FF] transition"
                  />
                </div>

                <div className="flex flex-col">
                  <label htmlFor="filmLanguage" className="text-white font-semibold mb-2 text-sm uppercase">
                    Langue parlée / principale du film *
                  </label>
                  <input
                    id="filmLanguage"
                    type="text"
                    placeholder="LANGUE"
                    {...register("filmLanguage")}
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
                    {...register("releaseYear")}
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
                    {...register("nationality")}
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
                    {...register("translation")}
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
                    {...register("youtubeLink")}
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
                    {...register("synopsisOriginal")}
                    maxLength={300}
                    className="bg-gray-800 border border-gray-700 text-white px-4 py-3 rounded-lg focus:outline-none focus:border-[#AD46FF] transition resize-none"
                  />
                  <p className="text-xs text-gray-500 mt-2">0/300</p>
                </div>

                <div className="flex flex-col md:col-span-2">
                  <label htmlFor="synopsisEnglish" className="text-white font-semibold mb-2 text-sm uppercase">
                    Synopsis anglais * (max. 300 caractères)
                  </label>
                  <textarea
                    id="synopsisEnglish"
                    rows="4"
                    placeholder="RÉSUMEZ L'INTENTION DE VOTRE FILM ET L'HISTOIRE QU'IL RACONTE EN QUELQUES LIGNES..."
                    {...register("synopsisEnglish")}
                    maxLength={300}
                    className="bg-gray-800 border border-gray-700 text-white px-4 py-3 rounded-lg focus:outline-none focus:border-[#AD46FF] transition resize-none"
                  />
                  <p className="text-xs text-gray-500 mt-2">0/300</p>
                </div>

                <div className="flex flex-col md:col-span-2">
                  <label htmlFor="filmFile" className="text-white font-semibold mb-2 text-sm uppercase">
                    Fichier du film *
                  </label>
                  <input
                    id="filmFile"
                    type="file"
                    {...register("filmFile")}
                    className="sr-only"
                    onChange={(event) => handleFileName(event, setFilmFileName)}
                  />
                  <div className="flex items-center gap-3 bg-gray-800 border border-gray-700 rounded-lg px-4 py-3">
                    <label htmlFor="filmFile" className="cursor-pointer text-white font-semibold">
                      Choisir un fichier
                    </label>
                    <span className="text-gray-400">— {filmFileName}</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-gray-400 mt-2">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 text-[#AD46FF]">
                      <path d="M12 3a1 1 0 0 1 1 1v9.586l2.293-2.293a1 1 0 1 1 1.414 1.414l-4.007 4.007a1.25 1.25 0 0 1-1.7 0l-4.007-4.007a1 1 0 0 1 1.414-1.414L11 13.586V4a1 1 0 0 1 1-1Z" />
                      <path d="M4 14a1 1 0 0 1 1 1v3a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-3a1 1 0 1 1 2 0v3a3 3 0 0 1-3 3H6a3 3 0 0 1-3-3v-3a1 1 0 0 1 1-1Z" />
                    </svg>
                    <span>Déposez votre fichier ici ou cliquez pour sélectionner</span>
                  </div>
                </div>

                <div className="flex flex-col">
                  <label htmlFor="thumbnail1" className="text-white font-semibold mb-2 text-sm uppercase">
                    Vignette 1 (16:9) *
                  </label>
                  <input
                    id="thumbnail1"
                    type="file"
                    {...register("thumbnail1")}
                    className="sr-only"
                    onChange={(event) => handleFileName(event, setThumbnail1Name)}
                  />
                  <div className="flex items-center gap-3 bg-gray-800 border border-gray-700 rounded-lg px-4 py-3">
                    <label htmlFor="thumbnail1" className="cursor-pointer text-white font-semibold">
                      Choisir un fichier
                    </label>
                    <span className="text-gray-400">— {thumbnail1Name}</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-gray-400 mt-2">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 text-[#AD46FF]">
                      <path d="M12 3a1 1 0 0 1 1 1v9.586l2.293-2.293a1 1 0 1 1 1.414 1.414l-4.007 4.007a1.25 1.25 0 0 1-1.7 0l-4.007-4.007a1 1 0 0 1 1.414-1.414L11 13.586V4a1 1 0 0 1 1-1Z" />
                      <path d="M4 14a1 1 0 0 1 1 1v3a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-3a1 1 0 1 1 2 0v3a3 3 0 0 1-3 3H6a3 3 0 0 1-3-3v-3a1 1 0 0 1 1-1Z" />
                    </svg>
                    <span>Déposez l'image ou cliquez pour sélectionner</span>
                  </div>
                </div>

                <div className="flex flex-col">
                  <label htmlFor="thumbnail2" className="text-white font-semibold mb-2 text-sm uppercase">
                    Vignette 2 (16:9) *
                  </label>
                  <input
                    id="thumbnail2"
                    type="file"
                    {...register("thumbnail2")}
                    className="sr-only"
                    onChange={(event) => handleFileName(event, setThumbnail2Name)}
                  />
                  <div className="flex items-center gap-3 bg-gray-800 border border-gray-700 rounded-lg px-4 py-3">
                    <label htmlFor="thumbnail2" className="cursor-pointer text-white font-semibold">
                      Choisir un fichier
                    </label>
                    <span className="text-gray-400">— {thumbnail2Name}</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-gray-400 mt-2">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 text-[#AD46FF]">
                      <path d="M12 3a1 1 0 0 1 1 1v9.586l2.293-2.293a1 1 0 1 1 1.414 1.414l-4.007 4.007a1.25 1.25 0 0 1-1.7 0l-4.007-4.007a1 1 0 0 1 1.414-1.414L11 13.586V4a1 1 0 0 1 1-1Z" />
                      <path d="M4 14a1 1 0 0 1 1 1v3a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-3a1 1 0 1 1 2 0v3a3 3 0 0 1-3 3H6a3 3 0 0 1-3-3v-3a1 1 0 0 1 1-1Z" />
                    </svg>
                    <span>Déposez l'image ou cliquez pour sélectionner</span>
                  </div>
                </div>

                <div className="flex flex-col">
                  <label htmlFor="thumbnail3" className="text-white font-semibold mb-2 text-sm uppercase">
                    Vignette 3 (16:9) *
                  </label>
                  <input
                    id="thumbnail3"
                    type="file"
                    {...register("thumbnail3")}
                    className="sr-only"
                    onChange={(event) => handleFileName(event, setThumbnail3Name)}
                  />
                  <div className="flex items-center gap-3 bg-gray-800 border border-gray-700 rounded-lg px-4 py-3">
                    <label htmlFor="thumbnail3" className="cursor-pointer text-white font-semibold">
                      Choisir un fichier
                    </label>
                    <span className="text-gray-400">— {thumbnail3Name}</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-gray-400 mt-2">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 text-[#AD46FF]">
                      <path d="M12 3a1 1 0 0 1 1 1v9.586l2.293-2.293a1 1 0 1 1 1.414 1.414l-4.007 4.007a1.25 1.25 0 0 1-1.7 0l-4.007-4.007a1 1 0 0 1 1.414-1.414L11 13.586V4a1 1 0 0 1 1-1Z" />
                      <path d="M4 14a1 1 0 0 1 1 1v3a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-3a1 1 0 1 1 2 0v3a3 3 0 0 1-3 3H6a3 3 0 0 1-3-3v-3a1 1 0 0 1 1-1Z" />
                    </svg>
                    <span>Déposez l'image ou cliquez pour sélectionner</span>
                  </div>
                </div>

                <div className="flex flex-col md:col-span-2">
                  <label htmlFor="subtitlesSrt" className="text-white font-semibold mb-2 text-sm uppercase">
                    Fichier de sous-titres (.srt)
                  </label>
                  <input
                    id="subtitlesSrt"
                    type="file"
                    {...register("subtitlesSrt")}
                    className="sr-only"
                    onChange={(event) => handleFileName(event, setSubtitlesName)}
                  />
                  <div className="flex items-center gap-3 bg-gray-800 border border-gray-700 rounded-lg px-4 py-3">
                    <label htmlFor="subtitlesSrt" className="cursor-pointer text-white font-semibold">
                      Choisir un fichier
                    </label>
                    <span className="text-gray-400">— {subtitlesName}</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-gray-400 mt-2">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 text-[#AD46FF]">
                      <path d="M12 3a1 1 0 0 1 1 1v9.586l2.293-2.293a1 1 0 1 1 1.414 1.414l-4.007 4.007a1.25 1.25 0 0 1-1.7 0l-4.007-4.007a1 1 0 0 1 1.414-1.414L11 13.586V4a1 1 0 0 1 1-1Z" />
                      <path d="M4 14a1 1 0 0 1 1 1v3a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-3a1 1 0 1 1 2 0v3a3 3 0 0 1-3 3H6a3 3 0 0 1-3-3v-3a1 1 0 0 1 1-1Z" />
                    </svg>
                    <span>Déposez le fichier .srt ou cliquez pour sélectionner</span>
                  </div>
                </div>
              </div>
            </section>

            {/* 02. Déclaration Usage de l'IA */}
            <section>
              <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
                <span className="text-[#F6339A]">●</span> Déclaration Usage de l'IA
              </h2>
              <p className="text-gray-400 mb-6">
                MARS.A.I exige une transparence totale sur l'utilisation de l'Intelligence Artificielle. Sélectionnez tous les outils génératifs sollicités dans votre processus créatif.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex flex-col md:col-span-2">
                  <label className="text-white font-semibold mb-2 text-sm uppercase">
                    Classification de l'Œuvre : * Choix exclusif entre :
                  </label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <label className="flex items-center gap-3 bg-gray-800 border border-gray-700 rounded-lg px-4 py-3">
                      <input type="radio" value="integrale" {...register("aiClassification")} />
                      <span>Génération intégrale (100% IA)</span>
                    </label>
                    <label className="flex items-center gap-3 bg-gray-800 border border-gray-700 rounded-lg px-4 py-3">
                      <input type="radio" value="hybride" {...register("aiClassification")} />
                      <span>Production hybride (Prises de vues réelles + apports IA)</span>
                    </label>
                  </div>
                </div>

                <div className="flex flex-col">
                  <label htmlFor="aiStack" className="text-white font-semibold mb-2 text-sm uppercase">
                    Stack Technologique *
                  </label>
                  <textarea
                    id="aiStack"
                    rows="3"
                    maxLength={500}
                    {...register("aiStack")}
                    placeholder="LISTEZ LES OUTILS UTILISÉS (EX: MIDJOURNEY POUR LES VISUELS, ELEVENLABS POUR LES VOIX, RUNWAY POUR L'ANIMATION...)"
                    className="bg-gray-800 border border-gray-700 text-white px-4 py-3 rounded-lg focus:outline-none focus:border-[#AD46FF] transition resize-none"
                  />
                  <p className="text-xs text-gray-500 mt-2">0/500</p>
                </div>

                <div className="flex flex-col">
                  <label htmlFor="aiMethodology" className="text-white font-semibold mb-2 text-sm uppercase">
                    Méthodologie Créative *
                  </label>
                  <textarea
                    id="aiMethodology"
                    rows="3"
                    maxLength={500}
                    {...register("aiMethodology")}
                    placeholder="DÉCRIVEZ L'INTERACTION ENTRE L'HUMAIN ET LA MACHINE DANS CE PROCESSUS.."
                    className="bg-gray-800 border border-gray-700 text-white px-4 py-3 rounded-lg focus:outline-none focus:border-[#AD46FF] transition resize-none"
                  />
                  <p className="text-xs text-gray-500 mt-2">0/500</p>
                </div>
              </div>
            </section>

            {/* Mon Profil */}
            <section>
              <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                <span className="text-[#F6339A]">●</span> Mon Profil
              </h2>
              <p className="text-sm uppercase tracking-widest text-gray-400 mb-4">Réalisateur</p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex flex-col">
                  <label htmlFor="lastName" className="text-white font-semibold mb-2 text-sm uppercase">
                    Nom *
                  </label>
                  <input
                    id="lastName"
                    type="text"
                    placeholder="NOM"
                    {...register("lastName")}
                    className="bg-gray-800 border border-gray-700 text-white px-4 py-3 rounded-lg focus:outline-none focus:border-[#AD46FF] transition"
                  />
                  {errors.lastName && <p className="text-red-400 text-sm mt-1">{errors.lastName.message}</p>}
                </div>

                <div className="flex flex-col">
                  <label htmlFor="firstName" className="text-white font-semibold mb-2 text-sm uppercase">
                    Prénom *
                  </label>
                  <input
                    id="firstName"
                    type="text"
                    placeholder="PRÉNOM"
                    {...register("firstName")}
                    className="bg-gray-800 border border-gray-700 text-white px-4 py-3 rounded-lg focus:outline-none focus:border-[#AD46FF] transition"
                  />
                  {errors.firstName && <p className="text-red-400 text-sm mt-1">{errors.firstName.message}</p>}
                </div>

                <div className="flex flex-col">
                  <label htmlFor="email" className="text-white font-semibold mb-2 text-sm uppercase">
                    Adresse e-mail *
                  </label>
                  <input
                    id="email"
                    type="email"
                    placeholder="EMAIL@EXEMPLE.COM"
                    {...register("email")}
                    className="bg-gray-800 border border-gray-700 text-white px-4 py-3 rounded-lg focus:outline-none focus:border-[#AD46FF] transition"
                  />
                  {errors.email && <p className="text-red-400 text-sm mt-1">{errors.email.message}</p>}
                </div>

                <div className="flex flex-col">
                  <label htmlFor="phone" className="text-white font-semibold mb-2 text-sm uppercase">
                    Téléphone *
                  </label>
                  <input
                    id="phone"
                    type="text"
                    placeholder="+33 6 12 34 56 78"
                    {...register("phone")}
                    className="bg-gray-800 border border-gray-700 text-white px-4 py-3 rounded-lg focus:outline-none focus:border-[#AD46FF] transition"
                  />
                </div>

                <div className="flex flex-col">
                  <label htmlFor="birthDate" className="text-white font-semibold mb-2 text-sm uppercase">
                    Date de naissance *
                  </label>
                  <input
                    id="birthDate"
                    type="date"
                    {...register("birthDate")}
                    className="bg-gray-800 border border-gray-700 text-white px-4 py-3 rounded-lg focus:outline-none focus:border-[#AD46FF] transition"
                  />
                </div>


                <div className="flex flex-col">
                  <label htmlFor="city" className="text-white font-semibold mb-2 text-sm uppercase">
                    Ville *
                  </label>
                  <input
                    id="city"
                    type="text"
                    placeholder="VILLE"
                    {...register("city")}
                    className="bg-gray-800 border border-gray-700 text-white px-4 py-3 rounded-lg focus:outline-none focus:border-[#AD46FF] transition"
                  />
                </div>

                <div className="flex flex-col">
                  <label htmlFor="postalCode" className="text-white font-semibold mb-2 text-sm uppercase">
                    Code Postal *
                  </label>
                  <input
                    id="postalCode"
                    type="text"
                    placeholder="CODE POSTAL"
                    {...register("postalCode")}
                    className="bg-gray-800 border border-gray-700 text-white px-4 py-3 rounded-lg focus:outline-none focus:border-[#AD46FF] transition"
                  />
                </div>

                <div className="flex flex-col">
                  <label htmlFor="country" className="text-white font-semibold mb-2 text-sm uppercase">
                    Pays *
                  </label>
                  <input
                    id="country"
                    type="text"
                    placeholder="PAYS"
                    {...register("country")}
                    className="bg-gray-800 border border-gray-700 text-white px-4 py-3 rounded-lg focus:outline-none focus:border-[#AD46FF] transition"
                  />
                </div>

                <div className="flex flex-col md:col-span-2">
                  <label htmlFor="biography" className="text-white font-semibold mb-2 text-sm uppercase">
                    Ma Biographie
                  </label>
                  <textarea
                    id="biography"
                    rows="4"
                    placeholder="ARTISTE CANADIEN BASÉ À MARSEILLE - J'EXPLORE LES FRONTIÈRES ENTRE L'ART CINÉMATOGRAPHIQUE TRADITIONNEL ET LES ALGORITHMES GÉNÉRATIFS..."
                    {...register("biography")}
                    className="bg-gray-800 border border-gray-700 text-white px-4 py-3 rounded-lg focus:outline-none focus:border-[#AD46FF] transition resize-none"
                  />
                </div>

                <div className="flex flex-col">
                  <label htmlFor="portfolio" className="text-white font-semibold mb-2 text-sm uppercase">
                    Mes Liens
                  </label>
                  <input
                    id="portfolio"
                    type="text"
                    placeholder="HTTPS://SITEWEB.COM"
                    {...register("portfolio")}
                    className="bg-gray-800 border border-gray-700 text-white px-4 py-3 rounded-lg focus:outline-none focus:border-[#AD46FF] transition"
                  />
                </div>

                <div className="flex flex-col">
                  <label htmlFor="instagram" className="text-white font-semibold mb-2 text-sm uppercase">
                    Instagram
                  </label>
                  <input
                    id="instagram"
                    type="text"
                    placeholder="@USERNAME_IG"
                    {...register("instagram")}
                    className="bg-gray-800 border border-gray-700 text-white px-4 py-3 rounded-lg focus:outline-none focus:border-[#AD46FF] transition"
                  />
                </div>

                <div className="flex flex-col">
                  <label htmlFor="linkedin" className="text-white font-semibold mb-2 text-sm uppercase">
                    LinkedIn
                  </label>
                  <input
                    id="linkedin"
                    type="text"
                    placeholder="@USERNAME_LINKEDIN"
                    {...register("linkedin")}
                    className="bg-gray-800 border border-gray-700 text-white px-4 py-3 rounded-lg focus:outline-none focus:border-[#AD46FF] transition"
                  />
                </div>

                <div className="flex flex-col md:col-span-2">
                  <label htmlFor="password" className="text-white font-semibold mb-2 text-sm uppercase">
                    Mot de passe *
                  </label>
                  <input
                    id="password"
                    type="password"
                    placeholder="Minimum 6 caractères"
                    {...register("password")}
                    className="bg-gray-800 border border-gray-700 text-white px-4 py-3 rounded-lg focus:outline-none focus:border-[#AD46FF] transition"
                  />
                  {errors.password && <p className="text-red-400 text-sm mt-1">{errors.password.message}</p>}
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                <span className="text-[#AD46FF]">●</span> Collaborateurs
              </h2>

              <div className="flex flex-col gap-6">
                {collaboratorFields.map((field, index) => (
                  <div key={field.id} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 bg-gray-800/50 border border-gray-700 rounded-xl p-4">
                    <div className="flex flex-col">
                      <label htmlFor={`collaborators.${index}.first_name`} className="text-white font-semibold mb-2 text-sm uppercase">
                        Prénom
                      </label>
                      <input
                        id={`collaborators.${index}.first_name`}
                        type="text"
                        placeholder="PRÉNOM"
                        {...register(`collaborators.${index}.first_name`)}
                        className="bg-gray-800 border border-gray-700 text-white px-4 py-3 rounded-lg focus:outline-none focus:border-[#AD46FF] transition"
                      />
                    </div>

                    <div className="flex flex-col">
                      <label htmlFor={`collaborators.${index}.last_name`} className="text-white font-semibold mb-2 text-sm uppercase">
                        Nom
                      </label>
                      <input
                        id={`collaborators.${index}.last_name`}
                        type="text"
                        placeholder="NOM"
                        {...register(`collaborators.${index}.last_name`)}
                        className="bg-gray-800 border border-gray-700 text-white px-4 py-3 rounded-lg focus:outline-none focus:border-[#AD46FF] transition"
                      />
                    </div>

                    <div className="flex flex-col">
                      <label htmlFor={`collaborators.${index}.email`} className="text-white font-semibold mb-2 text-sm uppercase">
                        Email
                      </label>
                      <input
                        id={`collaborators.${index}.email`}
                        type="email"
                        placeholder="EMAIL"
                        {...register(`collaborators.${index}.email`)}
                        className="bg-gray-800 border border-gray-700 text-white px-4 py-3 rounded-lg focus:outline-none focus:border-[#AD46FF] transition"
                      />
                    </div>

                    <div className="flex flex-col">
                      <label htmlFor={`collaborators.${index}.job`} className="text-white font-semibold mb-2 text-sm uppercase">
                        Rôle
                      </label>
                      <input
                        id={`collaborators.${index}.job`}
                        type="text"
                        placeholder="RÔLE"
                        {...register(`collaborators.${index}.job`)}
                        className="bg-gray-800 border border-gray-700 text-white px-4 py-3 rounded-lg focus:outline-none focus:border-[#AD46FF] transition"
                      />
                    </div>

                    <div className="lg:col-span-4 flex justify-end">
                      <button
                        type="button"
                        onClick={() => removeCollaborator(index)}
                        className="text-sm text-red-300 hover:text-red-400 transition"
                      >
                        Supprimer
                      </button>
                    </div>
                  </div>
                ))}

                <button
                  type="button"
                  onClick={() => appendCollaborator({ first_name: "", last_name: "", email: "", job: "" })}
                  className="inline-flex items-center gap-2 border border-gray-700 text-white px-4 py-2 rounded-lg hover:border-[#AD46FF] transition"
                >
                  + Ajouter un collaborateur
                </button>
              </div>
            </section>


            {/* Certificat de Propriété */}
            <section className="bg-gray-800/40 border border-gray-700 rounded-2xl p-6">
              <h2 className="text-lg font-bold text-white mb-3">Certificat de Propriété</h2>
              <p className="text-gray-300 mb-4">
                Je certifie être le propriétaire légitime de ce film et disposer de tous les droits nécessaires pour le soumettre à ce festival, conformément aux conditions d'utilisation et au règlement intérieur.
              </p>

              <label className="flex items-start gap-3 text-sm text-gray-200">
                <input type="checkbox" {...register("termsAccepted")} required className="mt-1" />
                <span>J'accepte les conditions et certifie l'exactitude des informations fournies *</span>
              </label>
            </section>

            {/* Hidden role field */}
            <input type="hidden" {...register("role")} defaultValue="PRODUCER" />

            <div className="flex flex-col gap-4 pt-4">
              <button
                type="submit"
                disabled={registerMutation.isPending}
                className="w-full bg-gradient-to-r from-[#AD46FF] to-[#F6339A] text-white font-bold py-4 rounded-lg uppercase hover:opacity-90 transition disabled:opacity-50"
              >
                {registerMutation.isPending ? "Soumission en cours..." : "Soumettre ma candidature"}
              </button>

              <p className="text-center text-gray-400">
                Vous avez déjà un compte ?{" "}
                <Link to="/auth/login" className="text-[#AD46FF] hover:text-[#F6339A] font-semibold transition">
                  Se connecter
                </Link>
              </p>
            </div>

            {registerMutation.isError && (
              <div className="bg-red-900/30 border border-red-600 text-red-300 px-4 py-3 rounded-lg">
                Erreur lors de la soumission. Veuillez réessayer.
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
}
