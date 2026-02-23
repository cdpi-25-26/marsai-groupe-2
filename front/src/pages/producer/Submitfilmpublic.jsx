// /**
//  * SubmitFilmPublic
//  * Page publique accessible via le bouton "Soumettre un film" du site.
//  *
//  * Étape 1 — Informations personnelles (création de compte)
//  * Étape 2 — Informations du film
//  *
//  * À la validation de l'étape 2 :
//  *   1. Crée le compte (signIn)
//  *   2. Auto-login (login)
//  *   3. Soumet le film (createMovie)
//  *   4. Redirige vers /producer (ProducerDashboard)
//  *
//  * Route suggérée : /submit  (ou /soumettre-un-film)
//  */

// import { useState } from "react";
// import { useNavigate, Link } from "react-router";
// import { useMutation } from "@tanstack/react-query";
// import { zodResolver } from "@hookform/resolvers/zod";
// import { useFieldArray, useForm } from "react-hook-form";
// import * as z from "zod";
// import { signIn, login } from "../../api/auth.js";
// import { createMovie } from "../../api/movies";


// // ── Schémas ──────────────────────────────────────────────────────────────────

// const step1Schema = z.object({
//   firstName:  z.string().min(1, "Le prénom est requis"),
//   lastName:   z.string().min(1, "Le nom est requis"),
//   email:      z.string().email("Format d'email invalide"),
//   password:   z.string().min(6, "Au moins 6 caractères"),
//   phone:      z.string().optional(),
//   birthDate:  z.string().optional(),
//   city:       z.string().optional(),
//   postalCode: z.string().optional(),
//   country:    z.string().optional(),
//   biography:  z.string().optional(),
//   portfolio:  z.string().optional(),
//   instagram:  z.string().optional(),
//   linkedin:   z.string().optional(),
// });

// const step2Schema = z.object({
//   filmTitleOriginal: z.string().min(1, "Le titre du film est requis"),
//   durationSeconds:   z.coerce.number().int().min(1, "La durée est obligatoire").max(120, "Max 120 secondes"),
//   filmLanguage:      z.string().optional(),
//   releaseYear:       z.string().optional(),
//   nationality:       z.string().optional(),
//   translation:       z.string().optional(),
//   youtubeLink:       z.string().optional(),
//   synopsisOriginal:  z.string().min(1, "Le synopsis est requis"),
//   synopsisEnglish:   z.string().optional(),
//   aiClassification:  z.string().optional(),
//   aiStack:           z.string().optional(),
//   aiMethodology:     z.string().optional(),
//   categoryId:        z.string().optional(),
//   knownByMarsAi:     z.string().optional(),
//   collaborators: z.array(z.object({
//     first_name: z.string().optional(),
//     last_name:  z.string().optional(),
//     email:      z.string().optional(),
//     job:        z.string().optional(),
//   })).optional(),
//   filmFile:     z.any().optional(),
//   thumbnail1:   z.any().optional(),
//   thumbnail2:   z.any().optional(),
//   thumbnail3:   z.any().optional(),
//   subtitlesSrt: z.any().optional(),
// });

// // ── Style helpers ─────────────────────────────────────────────────────────────

// const inputCls   = "bg-gray-800 border border-gray-700 text-white px-4 py-3 rounded-lg focus:outline-none focus:border-[#AD46FF] transition placeholder:text-gray-500";
// const labelCls   = "text-white font-semibold mb-2 text-sm uppercase";
// const sectionCls = "text-xl font-semibold text-white mb-4 flex items-center gap-2";

// // ── Composant ─────────────────────────────────────────────────────────────────

// export default function SubmitFilmPublic() {
//   const navigate = useNavigate();
//   const [step, setStep] = useState(1);

//   // Stocke les données de l'étape 1 pour les réutiliser à la soumission finale
//   const [accountData, setAccountData] = useState(null);

//   // ── Étape 1 ───────────────────────────────────────────────────────────────

//   const {
//     register: reg1,
//     handleSubmit: handle1,
//     formState: { errors: err1 },
//   } = useForm({ resolver: zodResolver(step1Schema) });

//   function onStep1Submit(data) {
//     setAccountData(data);
//     setStep(2);
//     window.scrollTo({ top: 0, behavior: "instant" });
//   }

//   // ── Étape 2 ───────────────────────────────────────────────────────────────

//   const [filmFileName,   setFilmFileName]   = useState("Aucun fichier sélectionné");
//   const [thumb1Name,     setThumb1Name]     = useState("Aucun fichier sélectionné");
//   const [thumb2Name,     setThumb2Name]     = useState("Aucun fichier sélectionné");
//   const [thumb3Name,     setThumb3Name]     = useState("Aucun fichier sélectionné");
//   const [subtitlesName,  setSubtitlesName]  = useState("Aucun fichier sélectionné");
//   const [submitError,    setSubmitError]    = useState(null);

//   const {
//     register: reg2,
//     handleSubmit: handle2,
//     control: ctrl2,
//     formState: { errors: err2 },
//   } = useForm({ resolver: zodResolver(step2Schema) });

//   const { fields: collabFields, append: addCollab, remove: removeCollab } =
//     useFieldArray({ control: ctrl2, name: "collaborators" });

//   const handleFileName = (e, setter) => {
//     const file = e.target.files?.[0];
//     setter(file ? file.name : "Aucun fichier sélectionné");
//   };

//   // Mutation finale : crée le compte → login → soumet le film → redirige
//   const submitMutation = useMutation({
//     mutationFn: async (filmData) => {
//       // 1. Créer le compte
//       await signIn({
//         firstName:  accountData.firstName,
//         lastName:   accountData.lastName,
//         email:      accountData.email,
//         password:   accountData.password,
//         phone:      accountData.phone,
//         birthDate:  accountData.birthDate,
//         city:       accountData.city,
//         postalCode: accountData.postalCode,
//         country:    accountData.country,
//         biography:  accountData.biography,
//         portfolio:  accountData.portfolio,
//         instagram:  accountData.instagram,
//         linkedin:   accountData.linkedin,
//         job:        "PRODUCER",
//         role:       "PRODUCER",
//       });

//       // 2. Auto-login
//       const loginRes = await login({ email: accountData.email, password: accountData.password });
//       const userData = loginRes.data?.data || loginRes.data;
//       if (!userData?.token) throw new Error("Connexion automatique échouée.");

//       localStorage.setItem("token",     userData.token);
//       localStorage.setItem("email",     userData.email);
//       localStorage.setItem("firstName", userData.first_name || "");
//       localStorage.setItem("lastName",  userData.last_name  || "");
//       localStorage.setItem("role",      userData.role);

//       // 3. Soumettre le film
//       const fd = new FormData();
//       fd.append("filmTitleOriginal", filmData.filmTitleOriginal || "");
//       fd.append("durationSeconds",   filmData.durationSeconds   || "");
//       fd.append("filmLanguage",      filmData.filmLanguage      || "");
//       fd.append("releaseYear",       filmData.releaseYear       || "");
//       fd.append("nationality",       filmData.nationality       || "");
//       fd.append("translation",       filmData.translation       || "");
//       fd.append("youtubeLink",       filmData.youtubeLink       || "");
//       fd.append("synopsisOriginal",  filmData.synopsisOriginal  || "");
//       fd.append("synopsisEnglish",   filmData.synopsisEnglish   || "");
//       fd.append("aiClassification",  filmData.aiClassification  || "");
//       fd.append("aiStack",           filmData.aiStack           || "");
//       fd.append("aiMethodology",     filmData.aiMethodology     || "");
//       if (filmData.knownByMarsAi) fd.append("knownByMarsAi", filmData.knownByMarsAi);
//       if (filmData.categoryId)    fd.append("categories", JSON.stringify([Number(filmData.categoryId)]));
//       if (filmData.collaborators?.length) {
//         const norm = filmData.collaborators.filter(c => c?.first_name || c?.last_name || c?.email);
//         fd.append("collaborators", JSON.stringify(norm));
//       }
//       if (filmData.filmFile?.[0])     fd.append("filmFile",     filmData.filmFile[0]);
//       if (filmData.thumbnail1?.[0])   fd.append("thumbnail1",   filmData.thumbnail1[0]);
//       if (filmData.thumbnail2?.[0])   fd.append("thumbnail2",   filmData.thumbnail2[0]);
//       if (filmData.thumbnail3?.[0])   fd.append("thumbnail3",   filmData.thumbnail3[0]);
//       if (filmData.subtitlesSrt?.[0]) fd.append("subtitlesSrt", filmData.subtitlesSrt[0]);

//       return createMovie(fd);
//     },
//     onSuccess: () => {
//       // Compte créé + film soumis → aller au dashboard
//       navigate("/producer");
//     },
//     onError: (err) => {
//       setSubmitError(
//         err?.response?.data?.error || err?.message || "Une erreur est survenue. Veuillez réessayer."
//       );
//     },
//   });

//   // ── Rendu ─────────────────────────────────────────────────────────────────

//   return (
//     <div className="min-h-screen bg-black text-white pt-28 pb-20 px-4">

//       {/* Décorations */}
//       <div className="fixed inset-0 overflow-hidden pointer-events-none">
//         <div className="absolute -top-40 -right-40 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl" />
//         <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-pink-500/5 rounded-full blur-3xl" />
//       </div>

//       <div className="max-w-3xl mx-auto relative z-10">

//         {/* En-tête */}
//         <div className="text-center mb-10">
//           <p className="text-sm uppercase tracking-widest text-gray-400 mb-2">Festival Mars AI</p>
//           <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-white to-purple-200 bg-clip-text text-transparent">
//             Soumettre un film
//           </h1>
//           <p className="text-gray-400 mt-3 text-sm max-w-xl mx-auto">
//             Complétez vos informations personnelles puis les détails de votre film. Votre compte producteur sera créé automatiquement.
//           </p>
//         </div>

//         {/* Indicateur d'étapes */}
//         <div className="flex items-center justify-center gap-4 mb-8">
//           {[
//             { n: 1, label: "Mes informations" },
//             { n: 2, label: "Mon film" },
//           ].map(({ n, label }, i) => (
//             <div key={n} className="flex items-center gap-3">
//               {i > 0 && (
//                 <div className={`w-12 h-px transition-colors duration-300 ${step > 1 ? "bg-purple-500/60" : "bg-white/10"}`} />
//               )}
//               <div className="flex items-center gap-2">
//                 <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold border-2 transition-all duration-300 ${
//                   step === n  ? "border-[#AD46FF] bg-[#AD46FF]/20 text-white"
//                   : step > n  ? "border-green-400/60 bg-green-500/10 text-green-300"
//                               : "border-white/10 bg-white/5 text-white/30"
//                 }`}>
//                   {step > n ? "✓" : n}
//                 </div>
//                 <span className={`text-sm font-medium transition-colors hidden sm:block ${step === n ? "text-white" : step > n ? "text-green-300" : "text-white/30"}`}>
//                   {label}
//                 </span>
//               </div>
//             </div>
//           ))}
//         </div>

//         <div className="bg-gray-900 rounded-2xl p-8 border border-gray-800 shadow-2xl">

//           {/* ════════════════════════════════════════════════
//               ÉTAPE 1 — Informations personnelles
//           ════════════════════════════════════════════════ */}
//           {step === 1 && (
//             <form onSubmit={handle1(onStep1Submit)} className="space-y-8">

//               <div>
//                 <h2 className={sectionCls}>
//                   <span className="text-[#AD46FF]">●</span> Mes informations
//                 </h2>

//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
//                   <div className="flex flex-col">
//                     <label className={labelCls}>Nom *</label>
//                     <input type="text" placeholder="NOM" {...reg1("lastName")} className={inputCls} />
//                     {err1.lastName && <p className="text-red-400 text-xs mt-1">{err1.lastName.message}</p>}
//                   </div>
//                   <div className="flex flex-col">
//                     <label className={labelCls}>Prénom *</label>
//                     <input type="text" placeholder="PRÉNOM" {...reg1("firstName")} className={inputCls} />
//                     {err1.firstName && <p className="text-red-400 text-xs mt-1">{err1.firstName.message}</p>}
//                   </div>
//                   <div className="flex flex-col">
//                     <label className={labelCls}>Email *</label>
//                     <input type="email" placeholder="EMAIL@EXEMPLE.COM" {...reg1("email")} className={inputCls} />
//                     {err1.email && <p className="text-red-400 text-xs mt-1">{err1.email.message}</p>}
//                   </div>
//                   <div className="flex flex-col">
//                     <label className={labelCls}>Téléphone</label>
//                     <input type="text" placeholder="+33 6 12 34 56 78" {...reg1("phone")} className={inputCls} />
//                   </div>
//                   <div className="flex flex-col">
//                     <label className={labelCls}>Date de naissance</label>
//                     <input type="date" {...reg1("birthDate")} className={inputCls} />
//                   </div>
//                   <div className="flex flex-col">
//                     <label className={labelCls}>Ville</label>
//                     <input type="text" placeholder="VILLE" {...reg1("city")} className={inputCls} />
//                   </div>
//                   <div className="flex flex-col">
//                     <label className={labelCls}>Code Postal</label>
//                     <input type="text" placeholder="CODE POSTAL" {...reg1("postalCode")} className={inputCls} />
//                   </div>
//                   <div className="flex flex-col">
//                     <label className={labelCls}>Pays</label>
//                     <input type="text" placeholder="PAYS" {...reg1("country")} className={inputCls} />
//                   </div>
//                   <div className="flex flex-col md:col-span-2">
//                     <label className={labelCls}>Biographie</label>
//                     <textarea rows="3" placeholder="DÉCRIVEZ VOTRE PARCOURS..." {...reg1("biography")} className={`${inputCls} resize-none`} />
//                   </div>
//                   <div className="flex flex-col">
//                     <label className={labelCls}>Site web / Portfolio</label>
//                     <input type="text" placeholder="HTTPS://SITEWEB.COM" {...reg1("portfolio")} className={inputCls} />
//                   </div>
//                   <div className="flex flex-col">
//                     <label className={labelCls}>Instagram</label>
//                     <input type="text" placeholder="@USERNAME_IG" {...reg1("instagram")} className={inputCls} />
//                   </div>
//                   <div className="flex flex-col">
//                     <label className={labelCls}>LinkedIn</label>
//                     <input type="text" placeholder="@USERNAME_LINKEDIN" {...reg1("linkedin")} className={inputCls} />
//                   </div>
//                   <div className="flex flex-col md:col-span-2">
//                     <label className={labelCls}>Mot de passe * (min. 6 caractères)</label>
//                     <input type="password" placeholder="••••••••" {...reg1("password")} className={inputCls} />
//                     {err1.password && <p className="text-red-400 text-xs mt-1">{err1.password.message}</p>}
//                   </div>
//                 </div>
//               </div>

//               <div className="flex flex-col gap-3 pt-2">
//                 <button
//                   type="submit"
//                   className="w-full bg-gradient-to-r from-[#AD46FF] to-[#F6339A] text-white font-bold py-4 rounded-lg uppercase hover:opacity-90 transition"
//                 >
//                   Continuer vers mon film →
//                 </button>
//                 <p className="text-center text-sm text-gray-400">
//                   Déjà inscrit ?{" "}
//                   <Link to="/auth/login" className="text-[#AD46FF] hover:text-[#F6339A] transition">
//                     Se connecter
//                   </Link>
//                 </p>
//               </div>
//             </form>
//           )}

//           {/* ════════════════════════════════════════════════
//               ÉTAPE 2 — Informations du film
//           ════════════════════════════════════════════════ */}
//           {step === 2 && (
//             <form onSubmit={handle2((data) => submitMutation.mutate(data))} className="space-y-8">

//               {/* Bouton retour étape 1 */}
//               <button
//                 type="button"
//                 onClick={() => { setStep(1); window.scrollTo({ top: 0, behavior: "instant" }); }}
//                 className="flex items-center gap-2 text-sm text-gray-400 hover:text-white transition"
//               >
//                 <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
//                 </svg>
//                 Modifier mes informations personnelles
//               </button>

//               {/* Identité du film */}
//               <div>
//                 <h2 className={sectionCls}>
//                   <span className="text-[#AD46FF]">●</span> Mon film
//                 </h2>
//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
//                   <div className="flex flex-col">
//                     <label className={labelCls}>Titre original *</label>
//                     <input type="text" placeholder="TITRE ORIGINAL" {...reg2("filmTitleOriginal")} className={inputCls} />
//                     {err2.filmTitleOriginal && <p className="text-red-400 text-xs mt-1">{err2.filmTitleOriginal.message}</p>}
//                   </div>
//                   <div className="flex flex-col">
//                     <label className={labelCls}>Durée (sec) * — max 120</label>
//                     <input type="number" placeholder="EX: 60" max={120} {...reg2("durationSeconds")} className={inputCls} />
//                     {err2.durationSeconds && <p className="text-red-400 text-xs mt-1">{err2.durationSeconds.message}</p>}
//                   </div>
//                   <div className="flex flex-col">
//                     <label className={labelCls}>Langue parlée</label>
//                     <input type="text" placeholder="LANGUE" {...reg2("filmLanguage")} className={inputCls} />
//                   </div>
//                   <div className="flex flex-col">
//                     <label className={labelCls}>Année de sortie</label>
//                     <input type="number" placeholder="2026" {...reg2("releaseYear")} className={inputCls} />
//                   </div>
//                   <div className="flex flex-col">
//                     <label className={labelCls}>Nationalité</label>
//                     <input type="text" placeholder="NATIONALITÉ" {...reg2("nationality")} className={inputCls} />
//                   </div>
//                   <div className="flex flex-col">
//                     <label className={labelCls}>Traduction du titre</label>
//                     <input type="text" placeholder="TRADUCTION" {...reg2("translation")} className={inputCls} />
//                   </div>
//                   <div className="flex flex-col">
//                     <label className={labelCls}>Lien YouTube</label>
//                     <input type="text" placeholder="https://youtube.com/..." {...reg2("youtubeLink")} className={inputCls} />
//                   </div>
//                   <div className="flex flex-col">
//                     <label className={labelCls}>Comment avez-vous connu le Festival ?</label>
//                     <select {...reg2("knownByMarsAi")} className={inputCls}>
//                       <option value="" className="bg-gray-900">Sélectionner</option>
//                       <option value="Par un ami" className="bg-gray-900">Par un ami</option>
//                       <option value="Vu une publicité" className="bg-gray-900">Vu une publicité</option>
//                       <option value="Via le site internet" className="bg-gray-900">Via le site internet</option>
//                     </select>
//                   </div>
//                   <div className="flex flex-col md:col-span-2">
//                     <label className={labelCls}>Synopsis original * (max. 300 caractères)</label>
//                     <textarea rows="3" maxLength={300} placeholder="RÉSUMEZ L'INTENTION DE VOTRE FILM..." {...reg2("synopsisOriginal")} className={`${inputCls} resize-none`} />
//                     {err2.synopsisOriginal && <p className="text-red-400 text-xs mt-1">{err2.synopsisOriginal.message}</p>}
//                   </div>
//                   <div className="flex flex-col md:col-span-2">
//                     <label className={labelCls}>Synopsis anglais (max. 300 caractères)</label>
//                     <textarea rows="3" maxLength={300} placeholder="ENGLISH SYNOPSIS..." {...reg2("synopsisEnglish")} className={`${inputCls} resize-none`} />
//                   </div>
//                 </div>
//               </div>

//               {/* Déclaration IA */}
//               <div>
//                 <h2 className={sectionCls}>
//                   <span className="text-[#AD46FF]">●</span> Déclaration IA
//                 </h2>
//                 <p className="text-gray-400 text-sm mb-4">Transparence sur l'utilisation de l'IA dans votre film.</p>
//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
//                   <div className="md:col-span-2">
//                     <label className={labelCls}>Classification</label>
//                     <div className="grid grid-cols-2 gap-3 mt-2">
//                       <label className="flex items-center gap-3 bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 hover:border-[#AD46FF]/50 transition cursor-pointer">
//                         <input type="radio" value="integrale" {...reg2("aiClassification")} className="accent-[#AD46FF]" />
//                         <span className="text-sm text-white">Génération intégrale</span>
//                       </label>
//                       <label className="flex items-center gap-3 bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 hover:border-[#AD46FF]/50 transition cursor-pointer">
//                         <input type="radio" value="hybride" {...reg2("aiClassification")} className="accent-[#AD46FF]" />
//                         <span className="text-sm text-white">Production hybride</span>
//                       </label>
//                     </div>
//                   </div>
//                   <div className="flex flex-col">
//                     <label className={labelCls}>Stack Technologique</label>
//                     <textarea rows="3" maxLength={500} placeholder="OUTILS UTILISÉS..." {...reg2("aiStack")} className={`${inputCls} resize-none`} />
//                   </div>
//                   <div className="flex flex-col">
//                     <label className={labelCls}>Méthodologie</label>
//                     <textarea rows="3" maxLength={500} placeholder="MÉTHODOLOGIE..." {...reg2("aiMethodology")} className={`${inputCls} resize-none`} />
//                   </div>
//                 </div>
//               </div>

//               {/* Collaborateurs */}
//               <div>
//                 <div className="flex items-center justify-between mb-4">
//                   <h2 className={sectionCls}>
//                     <span className="text-[#AD46FF]">●</span> Collaborateurs
//                   </h2>
//                   <button type="button"
//                     onClick={() => addCollab({ first_name: "", last_name: "", email: "", job: "" })}
//                     className="px-4 py-2 bg-gray-800 border border-gray-700 text-white text-sm rounded-lg hover:border-[#AD46FF]/50 transition">
//                     + Ajouter
//                   </button>
//                 </div>
//                 {collabFields.length === 0 && (
//                   <p className="text-gray-500 text-sm bg-gray-800/50 rounded-lg p-4 text-center">Aucun collaborateur ajouté.</p>
//                 )}
//                 <div className="space-y-3">
//                   {collabFields.map((field, idx) => (
//                     <div key={field.id} className="grid grid-cols-1 md:grid-cols-4 gap-3 bg-gray-800 border border-gray-700 rounded-lg p-4">
//                       <div className="flex flex-col">
//                         <label className="text-xs text-gray-400 mb-1 uppercase">Prénom</label>
//                         <input type="text" {...reg2(`collaborators.${idx}.first_name`)} className="bg-gray-900 border border-gray-600 text-white px-3 py-2 rounded-lg text-sm focus:outline-none focus:border-[#AD46FF] transition" />
//                       </div>
//                       <div className="flex flex-col">
//                         <label className="text-xs text-gray-400 mb-1 uppercase">Nom</label>
//                         <input type="text" {...reg2(`collaborators.${idx}.last_name`)} className="bg-gray-900 border border-gray-600 text-white px-3 py-2 rounded-lg text-sm focus:outline-none focus:border-[#AD46FF] transition" />
//                       </div>
//                       <div className="flex flex-col">
//                         <label className="text-xs text-gray-400 mb-1 uppercase">Email</label>
//                         <input type="email" {...reg2(`collaborators.${idx}.email`)} className="bg-gray-900 border border-gray-600 text-white px-3 py-2 rounded-lg text-sm focus:outline-none focus:border-[#AD46FF] transition" />
//                       </div>
//                       <div className="flex flex-col">
//                         <label className="text-xs text-gray-400 mb-1 uppercase">Rôle</label>
//                         <input type="text" {...reg2(`collaborators.${idx}.job`)} className="bg-gray-900 border border-gray-600 text-white px-3 py-2 rounded-lg text-sm focus:outline-none focus:border-[#AD46FF] transition" />
//                       </div>
//                       <div className="md:col-span-4 flex justify-end">
//                         <button type="button" onClick={() => removeCollab(idx)} className="text-red-400 hover:text-red-300 text-sm transition">Supprimer</button>
//                       </div>
//                     </div>
//                   ))}
//                 </div>
//               </div>

//               {/* Fichiers */}
//               <div>
//                 <h2 className={sectionCls}>
//                   <span className="text-[#AD46FF]">●</span> Fichiers
//                 </h2>
//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

//                   {/* Film */}
//                   <div className="flex flex-col md:col-span-2">
//                     <label className={labelCls}>Fichier du film</label>
//                     {(() => { const { onChange, ...rest } = reg2("filmFile"); return (
//                       <input id="pub-filmFile" type="file" {...rest} className="sr-only" onChange={(e) => { onChange(e); handleFileName(e, setFilmFileName); }} />
//                     ); })()}
//                     <label htmlFor="pub-filmFile" className="flex items-center gap-3 bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 cursor-pointer hover:border-[#AD46FF]/50 transition">
//                       <span className="text-white text-sm font-medium">Choisir un fichier</span>
//                       <span className="text-gray-400 text-sm">— {filmFileName}</span>
//                     </label>
//                   </div>

//                   {/* Thumbnails */}
//                   {[
//                     { id: "pub-thumb1", key: "thumbnail1", name: thumb1Name, setter: setThumb1Name },
//                     { id: "pub-thumb2", key: "thumbnail2", name: thumb2Name, setter: setThumb2Name },
//                     { id: "pub-thumb3", key: "thumbnail3", name: thumb3Name, setter: setThumb3Name },
//                   ].map(({ id, key, name, setter }, i) => (
//                     <div key={key} className="flex flex-col">
//                       <label className={labelCls}>Vignette {i + 1}</label>
//                       {(() => { const { onChange, ...rest } = reg2(key); return (
//                         <input id={id} type="file" {...rest} className="sr-only" onChange={(e) => { onChange(e); handleFileName(e, setter); }} />
//                       ); })()}
//                       <label htmlFor={id} className="flex items-center gap-3 bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 cursor-pointer hover:border-[#AD46FF]/50 transition">
//                         <span className="text-white text-sm font-medium">Choisir</span>
//                         <span className="text-gray-400 text-sm truncate">— {name}</span>
//                       </label>
//                     </div>
//                   ))}

//                   {/* Sous-titres */}
//                   <div className="flex flex-col md:col-span-2">
//                     <label className={labelCls}>Sous-titres (.srt)</label>
//                     {(() => { const { onChange, ...rest } = reg2("subtitlesSrt"); return (
//                       <input id="pub-srt" type="file" accept=".srt" {...rest} className="sr-only" onChange={(e) => { onChange(e); handleFileName(e, setSubtitlesName); }} />
//                     ); })()}
//                     <label htmlFor="pub-srt" className="flex items-center gap-3 bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 cursor-pointer hover:border-[#AD46FF]/50 transition">
//                       <span className="text-white text-sm font-medium">Choisir un fichier</span>
//                       <span className="text-gray-400 text-sm">— {subtitlesName}</span>
//                     </label>
//                   </div>
//                 </div>
//               </div>

//               {/* Erreur globale */}
//               {submitError && (
//                 <div className="bg-red-900/30 border border-red-600 text-red-300 px-4 py-3 rounded-lg text-sm">
//                   {submitError}
//                 </div>
//               )}

//               {/* Submit final */}
//               <button
//                 type="submit"
//                 disabled={submitMutation.isPending}
//                 className="w-full bg-gradient-to-r from-[#AD46FF] to-[#F6339A] text-white font-bold py-4 rounded-lg uppercase hover:opacity-90 transition disabled:opacity-50"
//               >
//                 {submitMutation.isPending
//                   ? "Création du compte et soumission en cours..."
//                   : "Créer mon compte et soumettre mon film"}
//               </button>

//               <p className="text-center text-xs text-gray-500">
//                 En soumettant, votre compte producteur sera automatiquement créé et vous serez redirigé vers votre espace.
//               </p>
//             </form>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// }




/**
 * SubmitFilmPublic
 * Page publique accessible via le bouton "Soumettre un film" du site.
 *
 * Étape 1 — Informations personnelles (création de compte)
 * Étape 2 — Informations du film
 *
 * À la validation de l'étape 2 :
 *   1. Crée le compte (signIn)
 *   2. Auto-login (login)
 *   3. Soumet le film (createMovie)
 *   4. Redirige vers /producer (ProducerDashboard)
 *
 * Route suggérée : /submit  (ou /soumettre-un-film)
 */

import { useState } from "react";
import { useNavigate, Link } from "react-router";
import { useMutation } from "@tanstack/react-query";
import { zodResolver } from "@hookform/resolvers/zod";
import { useFieldArray, useForm } from "react-hook-form";
import * as z from "zod";
import { signIn, login } from "../../api/auth.js";
import { createMovie } from "../../api/movies";


// ── Schémas ──────────────────────────────────────────────────────────────────

const step1Schema = z.object({
  firstName:  z.string().min(1, "Le prénom est requis"),
  lastName:   z.string().min(1, "Le nom est requis"),
  email:      z.string().email("Format d'email invalide"),
  password:   z.string().min(6, "Au moins 6 caractères"),
  phone:      z.string().optional(),
  birthDate:  z.string().optional(),
  city:       z.string().optional(),
  postalCode: z.string().optional(),
  country:    z.string().optional(),
  biography:  z.string().optional(),
  portfolio:  z.string().optional(),
  instagram:  z.string().optional(),
  linkedin:   z.string().optional(),
});

const step2Schema = z.object({
  filmTitleOriginal: z.string().min(1, "Le titre du film est requis"),
  durationSeconds:   z.coerce.number().int().min(1, "La durée est obligatoire").max(120, "Max 120 secondes"),
  filmLanguage:      z.string().optional(),
  releaseYear:       z.string().optional(),
  nationality:       z.string().optional(),
  translation:       z.string().optional(),
  youtubeLink:       z.string().optional(),
  synopsisOriginal:  z.string().min(1, "Le synopsis est requis"),
  synopsisEnglish:   z.string().optional(),
  aiClassification:  z.string().optional(),
  aiStack:           z.string().optional(),
  aiMethodology:     z.string().optional(),
  categoryId:        z.string().optional(),
  knownByMarsAi:     z.string().optional(),
  collaborators: z.array(z.object({
    first_name: z.string().optional(),
    last_name:  z.string().optional(),
    email:      z.string().optional(),
    job:        z.string().optional(),
  })).optional(),
  filmFile:     z.any().optional(),
  thumbnail1:   z.any().optional(),
  thumbnail2:   z.any().optional(),
  thumbnail3:   z.any().optional(),
  subtitlesSrt: z.any().optional(),
});

// ── Composant ─────────────────────────────────────────────────────────────────

export default function SubmitFilmPublic() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);

  // Stocke les données de l'étape 1 pour les réutiliser à la soumission finale
  const [accountData, setAccountData] = useState(null);

  // ── Étape 1 ───────────────────────────────────────────────────────────────

  const {
    register: reg1,
    handleSubmit: handle1,
    formState: { errors: err1 },
  } = useForm({ resolver: zodResolver(step1Schema) });

  function onStep1Submit(data) {
    setAccountData(data);
    setStep(2);
    window.scrollTo({ top: 0, behavior: "instant" });
  }

  // ── Étape 2 ───────────────────────────────────────────────────────────────

  const [filmFileName,   setFilmFileName]   = useState("Aucun fichier sélectionné");
  const [thumb1Name,     setThumb1Name]     = useState("Aucun fichier sélectionné");
  const [thumb2Name,     setThumb2Name]     = useState("Aucun fichier sélectionné");
  const [thumb3Name,     setThumb3Name]     = useState("Aucun fichier sélectionné");
  const [subtitlesName,  setSubtitlesName]  = useState("Aucun fichier sélectionné");
  const [submitError,    setSubmitError]    = useState(null);

  const {
    register: reg2,
    handleSubmit: handle2,
    control: ctrl2,
    formState: { errors: err2 },
  } = useForm({ resolver: zodResolver(step2Schema) });

  const { fields: collabFields, append: addCollab, remove: removeCollab } =
    useFieldArray({ control: ctrl2, name: "collaborators" });

  const handleFileName = (e, setter) => {
    const file = e.target.files?.[0];
    setter(file ? file.name : "Aucun fichier sélectionné");
  };

  // Mutation finale : crée le compte → login → soumet le film → redirige
  const submitMutation = useMutation({
    mutationFn: async (filmData) => {
      // 1. Créer le compte
      await signIn({
        firstName:  accountData.firstName,
        lastName:   accountData.lastName,
        email:      accountData.email,
        password:   accountData.password,
        phone:      accountData.phone,
        birthDate:  accountData.birthDate,
        city:       accountData.city,
        postalCode: accountData.postalCode,
        country:    accountData.country,
        biography:  accountData.biography,
        portfolio:  accountData.portfolio,
        instagram:  accountData.instagram,
        linkedin:   accountData.linkedin,
        job:        "PRODUCER",
        role:       "PRODUCER",
      });

      // 2. Auto-login
      const loginRes = await login({ email: accountData.email, password: accountData.password });
      const userData = loginRes.data?.data || loginRes.data;
      if (!userData?.token) throw new Error("Connexion automatique échouée.");

      localStorage.setItem("token",     userData.token);
      localStorage.setItem("email",     userData.email);
      localStorage.setItem("firstName", userData.first_name || "");
      localStorage.setItem("lastName",  userData.last_name  || "");
      localStorage.setItem("role",      userData.role);

      // 3. Soumettre le film
      const fd = new FormData();
      fd.append("filmTitleOriginal", filmData.filmTitleOriginal || "");
      fd.append("durationSeconds",   filmData.durationSeconds   || "");
      fd.append("filmLanguage",      filmData.filmLanguage      || "");
      fd.append("releaseYear",       filmData.releaseYear       || "");
      fd.append("nationality",       filmData.nationality       || "");
      fd.append("translation",       filmData.translation       || "");
      fd.append("youtubeLink",       filmData.youtubeLink       || "");
      fd.append("synopsisOriginal",  filmData.synopsisOriginal  || "");
      fd.append("synopsisEnglish",   filmData.synopsisEnglish   || "");
      fd.append("aiClassification",  filmData.aiClassification  || "");
      fd.append("aiStack",           filmData.aiStack           || "");
      fd.append("aiMethodology",     filmData.aiMethodology     || "");
      if (filmData.knownByMarsAi) fd.append("knownByMarsAi", filmData.knownByMarsAi);
      if (filmData.categoryId)    fd.append("categories", JSON.stringify([Number(filmData.categoryId)]));
      if (filmData.collaborators?.length) {
        const norm = filmData.collaborators.filter(c => c?.first_name || c?.last_name || c?.email);
        fd.append("collaborators", JSON.stringify(norm));
      }
      if (filmData.filmFile?.[0])     fd.append("filmFile",     filmData.filmFile[0]);
      if (filmData.thumbnail1?.[0])   fd.append("thumbnail1",   filmData.thumbnail1[0]);
      if (filmData.thumbnail2?.[0])   fd.append("thumbnail2",   filmData.thumbnail2[0]);
      if (filmData.thumbnail3?.[0])   fd.append("thumbnail3",   filmData.thumbnail3[0]);
      if (filmData.subtitlesSrt?.[0]) fd.append("subtitlesSrt", filmData.subtitlesSrt[0]);

      return createMovie(fd);
    },
    onSuccess: () => {
      // Compte créé + film soumis → aller au dashboard
      navigate("/producer");
    },
    onError: (err) => {
      setSubmitError(
        err?.response?.data?.error || err?.message || "Une erreur est survenue. Veuillez réessayer."
      );
    },
  });

  // ── Rendu ─────────────────────────────────────────────────────────────────

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a0c0f] via-[#0c0e11] to-[#0d0f12] text-white pt-28 pb-20 px-4">

      {/* Éléments décoratifs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-pink-500/5 rounded-full blur-3xl" />
      </div>

      <div className="max-w-3xl mx-auto relative z-10">

        {/* En-tête */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/5 backdrop-blur-sm border border-white/10 rounded-full mb-4">
            <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse" />
            <p className="text-xs uppercase tracking-wider text-white/60">Festival Mars AI</p>
          </div>
          <h1 className="text-4xl md:text-5xl font-light bg-gradient-to-r from-white to-purple-200 bg-clip-text text-transparent">
            Soumettre un film
          </h1>
          <p className="text-white/40 mt-3 text-sm max-w-xl mx-auto">
            Complétez vos informations personnelles puis les détails de votre film. Votre compte producteur sera créé automatiquement.
          </p>
        </div>

        {/* Indicateur d'étapes */}
        <div className="flex items-center justify-center gap-4 mb-8">
          {[
            { n: 1, label: "Mes informations" },
            { n: 2, label: "Mon film" },
          ].map(({ n, label }, i) => (
            <div key={n} className="flex items-center gap-3">
              {i > 0 && (
                <div className={`w-12 h-px transition-colors duration-300 ${step > 1 ? "bg-purple-500/60" : "bg-white/10"}`} />
              )}
              <div className="flex items-center gap-2">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium border transition-all duration-300 ${
                  step === n  ? "border-purple-500/50 bg-purple-500/20 text-white"
                  : step > n  ? "border-green-500/30 bg-green-500/10 text-green-300"
                              : "border-white/10 bg-white/5 text-white/40"
                }`}>
                  {step > n ? "✓" : n}
                </div>
                <span className={`text-sm font-light transition-colors hidden sm:block ${step === n ? "text-white" : step > n ? "text-green-300" : "text-white/40"}`}>
                  {label}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Carte principale avec effet glass */}
        <div className="group relative bg-gradient-to-br from-white/[0.07] to-white/[0.02] backdrop-blur-2xl border border-white/10 rounded-2xl p-6 shadow-2xl shadow-black/40 transition-all duration-500 overflow-hidden">
          
          {/* Effet de brillance */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 pointer-events-none" />

          {/* ════════════════════════════════════════════════
              ÉTAPE 1 — Informations personnelles
          ════════════════════════════════════════════════ */}
          {step === 1 && (
            <form onSubmit={handle1(onStep1Submit)} className="relative space-y-6">

              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500/20 to-pink-500/20 border border-white/10 flex items-center justify-center">
                  <svg className="w-4 h-4 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <h2 className="text-lg font-light text-white/90">Mes informations</h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex flex-col">
                  <label className="text-[10px] uppercase text-white/40 mb-1">Nom *</label>
                  <input type="text" placeholder="NOM" {...reg1("lastName")} className="bg-black/40 border border-white/10 text-white px-3 py-2.5 text-sm rounded-lg focus:outline-none focus:ring-1 focus:ring-purple-500/30 placeholder:text-white/30" />
                  {err1.lastName && <p className="text-red-400 text-[10px] mt-1">{err1.lastName.message}</p>}
                </div>
                <div className="flex flex-col">
                  <label className="text-[10px] uppercase text-white/40 mb-1">Prénom *</label>
                  <input type="text" placeholder="PRÉNOM" {...reg1("firstName")} className="bg-black/40 border border-white/10 text-white px-3 py-2.5 text-sm rounded-lg focus:outline-none focus:ring-1 focus:ring-purple-500/30 placeholder:text-white/30" />
                  {err1.firstName && <p className="text-red-400 text-[10px] mt-1">{err1.firstName.message}</p>}
                </div>
                <div className="flex flex-col">
                  <label className="text-[10px] uppercase text-white/40 mb-1">Email *</label>
                  <input type="email" placeholder="EMAIL@EXEMPLE.COM" {...reg1("email")} className="bg-black/40 border border-white/10 text-white px-3 py-2.5 text-sm rounded-lg focus:outline-none focus:ring-1 focus:ring-purple-500/30 placeholder:text-white/30" />
                  {err1.email && <p className="text-red-400 text-[10px] mt-1">{err1.email.message}</p>}
                </div>
                <div className="flex flex-col">
                  <label className="text-[10px] uppercase text-white/40 mb-1">Téléphone</label>
                  <input type="text" placeholder="+33 6 12 34 56 78" {...reg1("phone")} className="bg-black/40 border border-white/10 text-white px-3 py-2.5 text-sm rounded-lg focus:outline-none focus:ring-1 focus:ring-purple-500/30 placeholder:text-white/30" />
                </div>
                <div className="flex flex-col">
                  <label className="text-[10px] uppercase text-white/40 mb-1">Date de naissance</label>
                  <input type="date" {...reg1("birthDate")} className="bg-black/40 border border-white/10 text-white px-3 py-2.5 text-sm rounded-lg focus:outline-none focus:ring-1 focus:ring-purple-500/30" />
                </div>
                <div className="flex flex-col">
                  <label className="text-[10px] uppercase text-white/40 mb-1">Ville</label>
                  <input type="text" placeholder="VILLE" {...reg1("city")} className="bg-black/40 border border-white/10 text-white px-3 py-2.5 text-sm rounded-lg focus:outline-none focus:ring-1 focus:ring-purple-500/30 placeholder:text-white/30" />
                </div>
                <div className="flex flex-col">
                  <label className="text-[10px] uppercase text-white/40 mb-1">Code Postal</label>
                  <input type="text" placeholder="CODE POSTAL" {...reg1("postalCode")} className="bg-black/40 border border-white/10 text-white px-3 py-2.5 text-sm rounded-lg focus:outline-none focus:ring-1 focus:ring-purple-500/30 placeholder:text-white/30" />
                </div>
                <div className="flex flex-col">
                  <label className="text-[10px] uppercase text-white/40 mb-1">Pays</label>
                  <input type="text" placeholder="PAYS" {...reg1("country")} className="bg-black/40 border border-white/10 text-white px-3 py-2.5 text-sm rounded-lg focus:outline-none focus:ring-1 focus:ring-purple-500/30 placeholder:text-white/30" />
                </div>
                <div className="flex flex-col md:col-span-2">
                  <label className="text-[10px] uppercase text-white/40 mb-1">Biographie</label>
                  <textarea rows="2" placeholder="DÉCRIVEZ VOTRE PARCOURS..." {...reg1("biography")} className="bg-black/40 border border-white/10 text-white px-3 py-2.5 text-sm rounded-lg focus:outline-none focus:ring-1 focus:ring-purple-500/30 placeholder:text-white/30 resize-none" />
                </div>
                <div className="flex flex-col">
                  <label className="text-[10px] uppercase text-white/40 mb-1">Site web / Portfolio</label>
                  <input type="text" placeholder="HTTPS://SITEWEB.COM" {...reg1("portfolio")} className="bg-black/40 border border-white/10 text-white px-3 py-2.5 text-sm rounded-lg focus:outline-none focus:ring-1 focus:ring-purple-500/30 placeholder:text-white/30" />
                </div>
                <div className="flex flex-col">
                  <label className="text-[10px] uppercase text-white/40 mb-1">Instagram</label>
                  <input type="text" placeholder="@USERNAME_IG" {...reg1("instagram")} className="bg-black/40 border border-white/10 text-white px-3 py-2.5 text-sm rounded-lg focus:outline-none focus:ring-1 focus:ring-purple-500/30 placeholder:text-white/30" />
                </div>
                <div className="flex flex-col">
                  <label className="text-[10px] uppercase text-white/40 mb-1">LinkedIn</label>
                  <input type="text" placeholder="@USERNAME_LINKEDIN" {...reg1("linkedin")} className="bg-black/40 border border-white/10 text-white px-3 py-2.5 text-sm rounded-lg focus:outline-none focus:ring-1 focus:ring-purple-500/30 placeholder:text-white/30" />
                </div>
                <div className="flex flex-col md:col-span-2">
                  <label className="text-[10px] uppercase text-white/40 mb-1">Mot de passe * (min. 6 caractères)</label>
                  <input type="password" placeholder="••••••••" {...reg1("password")} className="bg-black/40 border border-white/10 text-white px-3 py-2.5 text-sm rounded-lg focus:outline-none focus:ring-1 focus:ring-purple-500/30 placeholder:text-white/30" />
                  {err1.password && <p className="text-red-400 text-[10px] mt-1">{err1.password.message}</p>}
                </div>
              </div>

              <div className="flex flex-col gap-3 pt-4">
                <button
                  type="submit"
                  className="group relative w-full px-4 py-3 bg-gradient-to-r from-purple-600/80 to-pink-600/80 text-white text-sm font-medium rounded-lg hover:from-purple-700 hover:to-pink-700 hover:scale-[1.01] transition-all duration-200 shadow-lg overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
                  <span className="relative">Continuer vers mon film →</span>
                </button>
                <p className="text-center text-xs text-white/40">
                  Déjà inscrit ?{" "}
                  <Link to="/auth/login" className="text-purple-400 hover:text-purple-300 transition-colors">
                    Se connecter
                  </Link>
                </p>
              </div>
            </form>
          )}

          {/* ════════════════════════════════════════════════
              ÉTAPE 2 — Informations du film
          ════════════════════════════════════════════════ */}
          {step === 2 && (
            <form onSubmit={handle2((data) => submitMutation.mutate(data))} className="relative space-y-6">

              {/* Bouton retour étape 1 */}
              <button
                type="button"
                onClick={() => { setStep(1); window.scrollTo({ top: 0, behavior: "instant" }); }}
                className="group relative flex items-center gap-2 text-xs text-white/40 hover:text-white transition-colors mb-4 px-3 py-1.5 rounded-lg hover:bg-white/5 overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
                <svg className="w-4 h-4 relative" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
                </svg>
                <span className="relative">Modifier mes informations personnelles</span>
              </button>

              {/* Identité du film */}
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500/20 to-pink-500/20 border border-white/10 flex items-center justify-center">
                    <svg className="w-4 h-4 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 4v16M17 4v16M3 8h4m10 0h4M3 12h18M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z" />
                    </svg>
                  </div>
                  <h2 className="text-lg font-light text-white/90">Mon film</h2>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex flex-col">
                    <label className="text-[10px] uppercase text-white/40 mb-1">Titre original *</label>
                    <input type="text" placeholder="TITRE ORIGINAL" {...reg2("filmTitleOriginal")} className="bg-black/40 border border-white/10 text-white px-3 py-2.5 text-sm rounded-lg focus:outline-none focus:ring-1 focus:ring-purple-500/30 placeholder:text-white/30" />
                    {err2.filmTitleOriginal && <p className="text-red-400 text-[10px] mt-1">{err2.filmTitleOriginal.message}</p>}
                  </div>
                  <div className="flex flex-col">
                    <label className="text-[10px] uppercase text-white/40 mb-1">Durée (sec) * — max 120</label>
                    <input type="number" placeholder="EX: 60" max={120} {...reg2("durationSeconds")} className="bg-black/40 border border-white/10 text-white px-3 py-2.5 text-sm rounded-lg focus:outline-none focus:ring-1 focus:ring-purple-500/30 placeholder:text-white/30" />
                    {err2.durationSeconds && <p className="text-red-400 text-[10px] mt-1">{err2.durationSeconds.message}</p>}
                  </div>
                  <div className="flex flex-col">
                    <label className="text-[10px] uppercase text-white/40 mb-1">Langue parlée</label>
                    <input type="text" placeholder="LANGUE" {...reg2("filmLanguage")} className="bg-black/40 border border-white/10 text-white px-3 py-2.5 text-sm rounded-lg focus:outline-none focus:ring-1 focus:ring-purple-500/30 placeholder:text-white/30" />
                  </div>
                  <div className="flex flex-col">
                    <label className="text-[10px] uppercase text-white/40 mb-1">Année de sortie</label>
                    <input type="number" placeholder="2026" {...reg2("releaseYear")} className="bg-black/40 border border-white/10 text-white px-3 py-2.5 text-sm rounded-lg focus:outline-none focus:ring-1 focus:ring-purple-500/30 placeholder:text-white/30" />
                  </div>
                  <div className="flex flex-col">
                    <label className="text-[10px] uppercase text-white/40 mb-1">Nationalité</label>
                    <input type="text" placeholder="NATIONALITÉ" {...reg2("nationality")} className="bg-black/40 border border-white/10 text-white px-3 py-2.5 text-sm rounded-lg focus:outline-none focus:ring-1 focus:ring-purple-500/30 placeholder:text-white/30" />
                  </div>
                  <div className="flex flex-col">
                    <label className="text-[10px] uppercase text-white/40 mb-1">Traduction du titre</label>
                    <input type="text" placeholder="TRADUCTION" {...reg2("translation")} className="bg-black/40 border border-white/10 text-white px-3 py-2.5 text-sm rounded-lg focus:outline-none focus:ring-1 focus:ring-purple-500/30 placeholder:text-white/30" />
                  </div>
                  <div className="flex flex-col">
                    <label className="text-[10px] uppercase text-white/40 mb-1">Lien YouTube</label>
                    <input type="text" placeholder="https://youtube.com/..." {...reg2("youtubeLink")} className="bg-black/40 border border-white/10 text-white px-3 py-2.5 text-sm rounded-lg focus:outline-none focus:ring-1 focus:ring-purple-500/30 placeholder:text-white/30" />
                  </div>
                  <div className="flex flex-col">
                    <label className="text-[10px] uppercase text-white/40 mb-1">Comment connu le Festival ?</label>
                    <select {...reg2("knownByMarsAi")} className="bg-black/40 border border-white/10 text-white px-3 py-2.5 text-sm rounded-lg focus:outline-none focus:ring-1 focus:ring-purple-500/30">
                      <option value="" className="bg-gray-900">Sélectionner</option>
                      <option value="Par un ami" className="bg-gray-900">Par un ami</option>
                      <option value="Vu une publicité" className="bg-gray-900">Vu une publicité</option>
                      <option value="Via le site internet" className="bg-gray-900">Via le site internet</option>
                    </select>
                  </div>
                  <div className="flex flex-col md:col-span-2">
                    <label className="text-[10px] uppercase text-white/40 mb-1">Synopsis original * (max. 300)</label>
                    <textarea rows="2" maxLength={300} placeholder="RÉSUMEZ L'INTENTION DE VOTRE FILM..." {...reg2("synopsisOriginal")} className="bg-black/40 border border-white/10 text-white px-3 py-2.5 text-sm rounded-lg focus:outline-none focus:ring-1 focus:ring-purple-500/30 placeholder:text-white/30 resize-none" />
                    {err2.synopsisOriginal && <p className="text-red-400 text-[10px] mt-1">{err2.synopsisOriginal.message}</p>}
                  </div>
                  <div className="flex flex-col md:col-span-2">
                    <label className="text-[10px] uppercase text-white/40 mb-1">Synopsis anglais (max. 300)</label>
                    <textarea rows="2" maxLength={300} placeholder="ENGLISH SYNOPSIS..." {...reg2("synopsisEnglish")} className="bg-black/40 border border-white/10 text-white px-3 py-2.5 text-sm rounded-lg focus:outline-none focus:ring-1 focus:ring-purple-500/30 placeholder:text-white/30 resize-none" />
                  </div>
                </div>
              </div>

              {/* Déclaration IA */}
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500/20 to-pink-500/20 border border-white/10 flex items-center justify-center">
                    <svg className="w-4 h-4 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.75 3.104v5.714a2 2 0 01-1.042 1.756L6 12.5l2.708 1.667a2 2 0 011.042 1.756v5.714M9.75 3.104h7.5M9.75 3.104a2.25 2.25 0 010 4.5m7.5-4.5a2.25 2.25 0 010 4.5m0 0v5.714a2 2 0 01-1.042 1.756L15 18.5l2.208 1.379a2 2 0 011.042 1.756v.615" />
                    </svg>
                  </div>
                  <h2 className="text-lg font-light text-white/90">Déclaration IA</h2>
                </div>
                
                <p className="text-xs text-white/40 mb-4">Transparence sur l'utilisation de l'IA dans votre film.</p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="md:col-span-2">
                    <label className="text-[10px] uppercase text-white/40 mb-2 block">Classification</label>
                    <div className="grid grid-cols-2 gap-3">
                      <label className="flex items-center gap-2 bg-black/40 border border-white/10 rounded-lg px-3 py-2.5 hover:border-purple-500/30 transition-colors cursor-pointer">
                        <input type="radio" value="integrale" {...reg2("aiClassification")} className="accent-purple-500" />
                        <span className="text-xs text-white/80">Génération intégrale</span>
                      </label>
                      <label className="flex items-center gap-2 bg-black/40 border border-white/10 rounded-lg px-3 py-2.5 hover:border-purple-500/30 transition-colors cursor-pointer">
                        <input type="radio" value="hybride" {...reg2("aiClassification")} className="accent-purple-500" />
                        <span className="text-xs text-white/80">Production hybride</span>
                      </label>
                    </div>
                  </div>
                  <div className="flex flex-col">
                    <label className="text-[10px] uppercase text-white/40 mb-1">Stack Technologique</label>
                    <textarea rows="2" maxLength={500} placeholder="OUTILS UTILISÉS..." {...reg2("aiStack")} className="bg-black/40 border border-white/10 text-white px-3 py-2.5 text-sm rounded-lg focus:outline-none focus:ring-1 focus:ring-purple-500/30 placeholder:text-white/30 resize-none" />
                  </div>
                  <div className="flex flex-col">
                    <label className="text-[10px] uppercase text-white/40 mb-1">Méthodologie</label>
                    <textarea rows="2" maxLength={500} placeholder="MÉTHODOLOGIE..." {...reg2("aiMethodology")} className="bg-black/40 border border-white/10 text-white px-3 py-2.5 text-sm rounded-lg focus:outline-none focus:ring-1 focus:ring-purple-500/30 placeholder:text-white/30 resize-none" />
                  </div>
                </div>
              </div>

              {/* Collaborateurs */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500/20 to-pink-500/20 border border-white/10 flex items-center justify-center">
                      <svg className="w-4 h-4 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                      </svg>
                    </div>
                    <h2 className="text-lg font-light text-white/90">Collaborateurs</h2>
                  </div>
                  <button type="button"
                    onClick={() => addCollab({ first_name: "", last_name: "", email: "", job: "" })}
                    className="group/btn relative px-3 py-1.5 bg-white/5 border border-white/10 text-white/80 text-xs rounded-lg hover:bg-white/10 transition-all duration-200 overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover/btn:translate-x-full transition-transform duration-700" />
                    <span className="relative">+ Ajouter</span>
                  </button>
                </div>
                
                {collabFields.length === 0 && (
                  <p className="text-xs text-white/40 bg-black/30 rounded-lg p-3 text-center">Aucun collaborateur ajouté.</p>
                )}
                
                <div className="space-y-2">
                  {collabFields.map((field, idx) => (
                    <div key={field.id} className="grid grid-cols-1 md:grid-cols-4 gap-2 bg-black/40 border border-white/10 rounded-lg p-3">
                      <div className="flex flex-col">
                        <label className="text-[8px] uppercase text-white/30 mb-0.5">Prénom</label>
                        <input type="text" {...reg2(`collaborators.${idx}.first_name`)} className="bg-black/60 border border-white/10 text-white px-2 py-1.5 text-xs rounded-lg focus:outline-none focus:ring-1 focus:ring-purple-500/30" />
                      </div>
                      <div className="flex flex-col">
                        <label className="text-[8px] uppercase text-white/30 mb-0.5">Nom</label>
                        <input type="text" {...reg2(`collaborators.${idx}.last_name`)} className="bg-black/60 border border-white/10 text-white px-2 py-1.5 text-xs rounded-lg focus:outline-none focus:ring-1 focus:ring-purple-500/30" />
                      </div>
                      <div className="flex flex-col">
                        <label className="text-[8px] uppercase text-white/30 mb-0.5">Email</label>
                        <input type="email" {...reg2(`collaborators.${idx}.email`)} className="bg-black/60 border border-white/10 text-white px-2 py-1.5 text-xs rounded-lg focus:outline-none focus:ring-1 focus:ring-purple-500/30" />
                      </div>
                      <div className="flex flex-col">
                        <label className="text-[8px] uppercase text-white/30 mb-0.5">Rôle</label>
                        <input type="text" {...reg2(`collaborators.${idx}.job`)} className="bg-black/60 border border-white/10 text-white px-2 py-1.5 text-xs rounded-lg focus:outline-none focus:ring-1 focus:ring-purple-500/30" />
                      </div>
                      <div className="md:col-span-4 flex justify-end">
                        <button type="button" onClick={() => removeCollab(idx)} className="text-red-400/70 hover:text-red-400 text-[10px] transition-colors">Supprimer</button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Fichiers */}
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500/20 to-pink-500/20 border border-white/10 flex items-center justify-center">
                    <svg className="w-4 h-4 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 13h6m-3-3v6m5 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <h2 className="text-lg font-light text-white/90">Fichiers</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Film */}
                  <div className="flex flex-col md:col-span-2">
                    <label className="text-[10px] uppercase text-white/40 mb-1">Fichier du film</label>
                    {(() => { const { onChange, ...rest } = reg2("filmFile"); return (
                      <input id="pub-filmFile" type="file" {...rest} className="sr-only" onChange={(e) => { onChange(e); handleFileName(e, setFilmFileName); }} />
                    ); })()}
                    <label htmlFor="pub-filmFile" className="flex items-center gap-2 bg-black/40 border border-white/10 rounded-lg px-3 py-2.5 cursor-pointer hover:border-purple-500/30 transition-colors">
                      <span className="text-white/80 text-xs font-medium">Choisir un fichier</span>
                      <span className="text-xs text-white/40">— {filmFileName}</span>
                    </label>
                  </div>

                  {/* Thumbnails */}
                  {[
                    { id: "pub-thumb1", key: "thumbnail1", name: thumb1Name, setter: setThumb1Name },
                    { id: "pub-thumb2", key: "thumbnail2", name: thumb2Name, setter: setThumb2Name },
                    { id: "pub-thumb3", key: "thumbnail3", name: thumb3Name, setter: setThumb3Name },
                  ].map(({ id, key, name, setter }, i) => (
                    <div key={key} className="flex flex-col">
                      <label className="text-[10px] uppercase text-white/40 mb-1">Vignette {i + 1}</label>
                      {(() => { const { onChange, ...rest } = reg2(key); return (
                        <input id={id} type="file" {...rest} className="sr-only" onChange={(e) => { onChange(e); handleFileName(e, setter); }} />
                      ); })()}
                      <label htmlFor={id} className="flex items-center gap-2 bg-black/40 border border-white/10 rounded-lg px-3 py-2.5 cursor-pointer hover:border-purple-500/30 transition-colors">
                        <span className="text-white/80 text-xs font-medium">Choisir</span>
                        <span className="text-xs text-white/40 truncate">— {name}</span>
                      </label>
                    </div>
                  ))}

                  {/* Sous-titres */}
                  <div className="flex flex-col md:col-span-2">
                    <label className="text-[10px] uppercase text-white/40 mb-1">Sous-titres (.srt)</label>
                    {(() => { const { onChange, ...rest } = reg2("subtitlesSrt"); return (
                      <input id="pub-srt" type="file" accept=".srt" {...rest} className="sr-only" onChange={(e) => { onChange(e); handleFileName(e, setSubtitlesName); }} />
                    ); })()}
                    <label htmlFor="pub-srt" className="flex items-center gap-2 bg-black/40 border border-white/10 rounded-lg px-3 py-2.5 cursor-pointer hover:border-purple-500/30 transition-colors">
                      <span className="text-white/80 text-xs font-medium">Choisir un fichier</span>
                      <span className="text-xs text-white/40">— {subtitlesName}</span>
                    </label>
                  </div>
                </div>
              </div>

              {/* Erreur globale */}
              {submitError && (
                <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-lg text-red-300 text-sm">
                  {submitError}
                </div>
              )}

              {/* Submit final */}
              <button
                type="submit"
                disabled={submitMutation.isPending}
                className="group relative w-full px-4 py-3 bg-gradient-to-r from-purple-600/80 to-pink-600/80 text-white text-sm font-medium rounded-lg hover:from-purple-700 hover:to-pink-700 hover:scale-[1.01] transition-all duration-200 shadow-lg disabled:opacity-50 overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
                <span className="relative">
                  {submitMutation.isPending
                    ? "Création du compte et soumission..."
                    : "Créer mon compte et soumettre mon film"}
                </span>
              </button>

              <p className="text-center text-[10px] text-white/30">
                En soumettant, votre compte producteur sera automatiquement créé et vous serez redirigé vers votre espace.
              </p>
            </form>
          )}
          
          {/* Badge décoratif */}
          <div className="absolute top-0 right-0 w-32 h-32 overflow-hidden opacity-5 pointer-events-none">
            <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-br from-purple-500/30 to-pink-500/30 rounded-full blur-3xl" />
          </div>
        </div>
      </div>
    </div>
  );
}