// /**
//  * Composant Videos (Gestion des Vidéos Admin)
//  * Page administrateur pour afficher et gérer les vidéos du système
//  * Utilise TanStack Query pour la récupération et le cache des données
//  * Fonctionnalités:
//  * - Affichage d'une liste de toutes les vidéos
//  * - Gestion des états de chargement et d'erreur
//  * - Affichage du titre et description de chaque vidéo
//  * @returns {JSX.Element} La liste des vidéos ou un message d'erreur/chargement
//  */
// import { useEffect, useState, useMemo } from "react";
// import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
// import {
//   getCategories,
//   getVideos,
//   deleteMovie,
//   updateMovieCategories,
//   updateMovieJuries,
//   updateMovieStatus
// } from "../../api/videos.js";
// import { getUsers } from "../../api/users.js";
// import { VideoPreview } from "../../components/VideoPreview.jsx";

// /**
//  * Fonction Videos
//  * Récupère la liste de toutes les vidéos via l'API
//  * Gère les états de chargement, succès et erreur
//  * @returns {JSX.Element} Le contenu de la page selon l'état
//  */
// function Videos() {
//   const queryClient = useQueryClient();
//   // Utilisation de TanStack Query pour gérer les données et les états de requête
//   const { isPending, isError, data, error } = useQuery({
//     queryKey: ["listVideos"],
//     queryFn: getVideos,
//   });

//   const { data: categoriesData } = useQuery({
//     queryKey: ["categories"],
//     queryFn: getCategories,
//   });

//   const { data: usersData } = useQuery({
//     queryKey: ["users"],
//     queryFn: getUsers,
//   });

//   const categories = categoriesData?.data || [];
//   const juries = useMemo(
//     () => (usersData?.data || []).filter((user) => user.role === "JURY"),
//     [usersData]
//   );

//   const [categorySelection, setCategorySelection] = useState({});
//   const [jurySelection, setJurySelection] = useState({});
//   const [selectedMovie, setSelectedMovie] = useState(null);

//   useEffect(() => {
//     if (!data?.data) return;
//     const initialCategories = {};
//     const initialJuries = {};

//     data.data.forEach((movie) => {
//       initialCategories[movie.id_movie] = (movie.Categories || []).map(
//         (category) => category.id_categorie
//       );
//       initialJuries[movie.id_movie] = (movie.Juries || []).map(
//         (jury) => jury.id_user
//       );
//     });

//     setCategorySelection(initialCategories);
//     setJurySelection(initialJuries);
//   }, [data]);

//   const statusMutation = useMutation({
//     mutationFn: ({ id, status }) => updateMovieStatus(id, status),
//     onSuccess: () => {
//       queryClient.invalidateQueries({ queryKey: ["listVideos"] });
//     }
//   });

//   const categoryMutation = useMutation({
//     mutationFn: ({ id, categories }) => updateMovieCategories(id, categories),
//     onSuccess: () => {
//       queryClient.invalidateQueries({ queryKey: ["listVideos"] });
//     }
//   });

//   const juryMutation = useMutation({
//     mutationFn: ({ id, juryIds }) => updateMovieJuries(id, juryIds),
//     onSuccess: () => {
//       queryClient.invalidateQueries({ queryKey: ["listVideos"] });
//     }
//   });

//   const deleteMutation = useMutation({
//     mutationFn: (id) => deleteMovie(id),
//     onSuccess: () => {
//       queryClient.invalidateQueries({ queryKey: ["listVideos"] });
//     }
//   });

//   const uploadBase = "http://localhost:3000/uploads";
//   const getPoster = (movie) => (
//     movie.thumbnail
//       ? `${uploadBase}/${movie.thumbnail}`
//       : movie.display_picture
//         ? `${uploadBase}/${movie.display_picture}`
//         : movie.picture1
//           ? `${uploadBase}/${movie.picture1}`
//           : null
//   );

//   // État de chargement - affiche un message en attente des données
//   if (isPending) {
//     return <div className="text-gray-300">Chargement en cours...</div>;
//   }

//   // État d'erreur - affiche le message d'erreur si la requête échoue
//   if (isError) {
//     return <div className="text-red-300">Une erreur est survenue : {error.message}</div>;
//   }

//   // Affichage de la liste des vidéos ou message si aucune vidéo n'existe
//   return (
//     <div className="space-y-6">
//       {data.data.length > 0 ? (
//         <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
//           {data.data.map((movie) => {
//             const poster = getPoster(movie);
//             return (
//               <button
//                 type="button"
//                 key={movie.id_movie}
//                 onClick={() => setSelectedMovie(movie)}
//                 className="text-left bg-gray-950 border border-gray-800 rounded-xl p-4 hover:border-gray-600 transition"
//               >
//                 <div className="aspect-video bg-gray-800 rounded-lg overflow-hidden">
//                   {poster ? (
//                     <img src={poster} alt={movie.title} className="w-full h-full object-cover" />
//                   ) : (
//                     <div className="w-full h-full flex items-center justify-center text-gray-500 text-sm">Aucune vignette</div>
//                   )}
//                 </div>
//                 <div className="mt-3">
//                   <h3 className="text-lg font-semibold text-white">{movie.title}</h3>
//                   <p className="text-sm text-gray-400 mt-1 line-clamp-2">{movie.synopsis || movie.description || "-"}</p>
//                   <div className="mt-2 text-xs text-gray-400 flex flex-wrap gap-3">
//                     <span>{movie.duration ? `${movie.duration}s` : "-"}</span>
//                     <span>{movie.main_language || "-"}</span>
//                     <span>{movie.nationality || "-"}</span>
//                     <span>{movie.selection_status || "submitted"}</span>
//                   </div>
//                 </div>
//               </button>
//             );
//           })}
//         </div>
//       ) : (
//         <div className="text-gray-400">Aucune vidéo trouvée.</div>
//       )}

//       {selectedMovie && (
//         <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4">
//           <div className="bg-gray-950 border border-gray-800 rounded-2xl w-full max-w-5xl max-h-[90vh] overflow-y-auto p-6">
//             <div className="flex items-center justify-between">
//               <h3 className="text-2xl font-bold text-white">{selectedMovie.title}</h3>
//               <button
//                 type="button"
//                 onClick={() => setSelectedMovie(null)}
//                 className="text-gray-400 hover:text-white"
//               >
//                 ✕
//               </button>
//             </div>

//             <p className="text-gray-400 mt-2">{selectedMovie.synopsis || selectedMovie.description || "-"}</p>

//             <div className="grid grid-cols-2 gap-4 mt-4 text-sm text-gray-300">
//               <div><span className="text-gray-400">Durée:</span> {selectedMovie.duration ? `${selectedMovie.duration}s` : "-"}</div>
//               <div><span className="text-gray-400">Langue:</span> {selectedMovie.main_language || "-"}</div>
//               <div><span className="text-gray-400">Nationalité:</span> {selectedMovie.nationality || "-"}</div>
//               <div><span className="text-gray-400">Statut:</span> {selectedMovie.selection_status || "submitted"}</div>
//               <div><span className="text-gray-400">Producteur:</span> {(selectedMovie.User || selectedMovie.Producer) ? `${(selectedMovie.User || selectedMovie.Producer).first_name} ${(selectedMovie.User || selectedMovie.Producer).last_name}` : "-"}</div>
//               <div><span className="text-gray-400">Comment avez-vous connu le Festival ?</span> {(selectedMovie.User || selectedMovie.Producer)?.known_by_mars_ai || "-"}</div>
//             </div>

//             <div className="mt-4 flex flex-wrap gap-3">
//               {selectedMovie.trailer && (
//                 <a
//                   className="text-[#AD46FF] hover:text-[#F6339A] font-semibold"
//                   href={`${uploadBase}/${selectedMovie.trailer}`}
//                   target="_blank"
//                   rel="noreferrer"
//                 >
//                   Ouvrir la vidéo
//                 </a>
//               )}
//               {typeof selectedMovie.subtitle === "string" && selectedMovie.subtitle.toLowerCase().endsWith(".srt") && (
//                 <a
//                   className="text-[#AD46FF] hover:text-[#F6339A] font-semibold"
//                   href={`${uploadBase}/${selectedMovie.subtitle}`}
//                   target="_blank"
//                   rel="noreferrer"
//                   download
//                 >
//                   Télécharger les sous-titres
//                 </a>
//               )}
//               {selectedMovie.youtube_link && (
//                 <a
//                   className="text-[#AD46FF] hover:text-[#F6339A] font-semibold"
//                   href={selectedMovie.youtube_link}
//                   target="_blank"
//                   rel="noreferrer"
//                 >
//                   Voir sur YouTube
//                 </a>
//               )}
//             </div>

//             {(selectedMovie.trailer || selectedMovie.youtube_link) && (
//               <div className="mt-4">
//                 {selectedMovie.trailer ? (
//                   <VideoPreview
//                     title={selectedMovie.title}
//                     src={`${uploadBase}/${selectedMovie.trailer}`}
//                     poster={getPoster(selectedMovie) || undefined}
//                   />
//                 ) : (
//                   <a className="text-[#AD46FF] hover:text-[#F6339A]" href={selectedMovie.youtube_link} target="_blank" rel="noreferrer">
//                     Ouvrir la vidéo
//                   </a>
//                 )}
//               </div>
//             )}

//             <div className="mt-6 flex flex-wrap gap-3">
//               <button
//                 type="button"
//                 onClick={() => statusMutation.mutate({ id: selectedMovie.id_movie, status: "selected" })}
//                 className="px-4 py-2 bg-green-600/80 text-white rounded-lg hover:bg-green-600"
//               >
//                 Approuver
//               </button>
//               <button
//                 type="button"
//                 onClick={() => statusMutation.mutate({ id: selectedMovie.id_movie, status: "refused" })}
//                 className="px-4 py-2 bg-red-600/80 text-white rounded-lg hover:bg-red-600"
//               >
//                 Refuser
//               </button>
//               <button
//                 type="button"
//                 onClick={() => {
//                   if (window.confirm("Supprimer définitivement ce film ?")) {
//                     deleteMutation.mutate(selectedMovie.id_movie);
//                   }
//                 }}
//                 className="px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700"
//               >
//                 Supprimer
//               </button>
//             </div>

//             <div className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
//               <div>
//                 <h4 className="text-sm uppercase text-gray-400 mb-3">Catégories</h4>
//                 {categories.length === 0 ? (
//                   <p className="text-gray-500 text-sm">Aucune catégorie disponible.</p>
//                 ) : (
//                   <select
//                     value={(categorySelection[selectedMovie.id_movie] || [""])[0] || ""}
//                     onChange={(event) => {
//                       const value = event.target.value;
//                       setCategorySelection((prev) => ({
//                         ...prev,
//                         [selectedMovie.id_movie]: value ? [Number(value)] : []
//                       }));
//                     }}
//                     className="w-full bg-gray-800 border border-gray-700 text-white px-3 py-2 rounded-lg"
//                   >
//                     <option value="">Sélectionner une catégorie</option>
//                     {categories.map((category) => (
//                       <option key={`${selectedMovie.id_movie}-cat-${category.id_categorie}`} value={category.id_categorie}>
//                         {category.name}
//                       </option>
//                     ))}
//                   </select>
//                 )}
//                 <button
//                   type="button"
//                   onClick={() => categoryMutation.mutate({
//                     id: selectedMovie.id_movie,
//                     categories: categorySelection[selectedMovie.id_movie] || []
//                   })}
//                   className="mt-3 px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700"
//                 >
//                   Enregistrer catégories
//                 </button>
//               </div>

//               <div>
//                 <h4 className="text-sm uppercase text-gray-400 mb-3">Assigner jurys</h4>
//                 {juries.length === 0 ? (
//                   <p className="text-gray-500 text-sm">Aucun jury disponible.</p>
//                 ) : (
//                   <div className="grid grid-cols-2 gap-2 text-sm text-gray-300">
//                     {juries.map((jury) => {
//                       const selected = (jurySelection[selectedMovie.id_movie] || []).includes(jury.id_user);
//                       return (
//                         <label key={`${selectedMovie.id_movie}-jury-${jury.id_user}`} className="flex items-center gap-2">
//                           <input
//                             type="checkbox"
//                             checked={selected}
//                             onChange={() => {
//                               setJurySelection((prev) => {
//                                 const current = prev[selectedMovie.id_movie] || [];
//                                 const exists = current.includes(jury.id_user);
//                                 const next = exists
//                                   ? current.filter((id) => id !== jury.id_user)
//                                   : [...current, jury.id_user];
//                                 return { ...prev, [selectedMovie.id_movie]: next };
//                               });
//                             }}
//                             className="accent-[#AD46FF]"
//                           />
//                           {jury.first_name} {jury.last_name}
//                         </label>
//                       );
//                     })}
//                   </div>
//                 )}
//                 <button
//                   type="button"
//                   onClick={() => juryMutation.mutate({
//                     id: selectedMovie.id_movie,
//                     juryIds: jurySelection[selectedMovie.id_movie] || []
//                   })}
//                   className="mt-3 px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700"
//                 >
//                   Enregistrer jurys
//                 </button>
//               </div>
//             </div>

//             <div className="mt-6 grid grid-cols-2 gap-3">
//               {[selectedMovie.picture1, selectedMovie.picture2, selectedMovie.picture3].filter(Boolean).map((pic, idx) => (
//                 <div key={`${selectedMovie.id_movie}-pic-${idx}`} className="aspect-video bg-gray-800 rounded-lg overflow-hidden">
//                   <img src={`${uploadBase}/${pic}`} alt="Vignette" className="w-full h-full object-cover" />
//                 </div>
//               ))}
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }

// export default Videos;



//SECOND CODE COMMENTE************************************************************************************************************************************************************************************************************************************************************************************




// /**
//  * Composant Videos (Gestion des Vidéos Admin)
//  * Page administrateur pour afficher et gérer les vidéos du système
//  * Utilise TanStack Query pour la récupération et le cache des données
//  * Fonctionnalités:
//  * - Affichage d'une liste de toutes les vidéos
//  * - Gestion des états de chargement et d'erreur
//  * - Affichage du titre et description de chaque vidéo
//  * @returns {JSX.Element} La liste des vidéos ou un message d'erreur/chargement
//  */
// import { useEffect, useState, useMemo } from "react";
// import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
// import {
//   getCategories,
//   getVideos,
//   deleteMovie,
//   updateMovieCategories,
//   updateMovieJuries,
//   updateMovieStatus
// } from "../../api/videos.js";
// import { getUsers } from "../../api/users.js";
// import { VideoPreview } from "../../components/VideoPreview.jsx";

// /**
//  * Fonction Videos
//  * Récupère la liste de toutes les vidéos via l'API
//  * Gère les états de chargement, succès et erreur
//  * @returns {JSX.Element} Le contenu de la page selon l'état
//  */
// function Videos() {
//   const queryClient = useQueryClient();
//   // Utilisation de TanStack Query pour gérer les données et les états de requête
//   const { isPending, isError, data, error } = useQuery({
//     queryKey: ["listVideos"],
//     queryFn: getVideos,
//   });

//   const { data: categoriesData } = useQuery({
//     queryKey: ["categories"],
//     queryFn: getCategories,
//   });

//   const { data: usersData } = useQuery({
//     queryKey: ["users"],
//     queryFn: getUsers,
//   });

//   const categories = categoriesData?.data || [];
//   const juries = useMemo(
//     () => (usersData?.data || []).filter((user) => user.role === "JURY"),
//     [usersData]
//   );

//   const [categorySelection, setCategorySelection] = useState({});
//   const [jurySelection, setJurySelection] = useState({});
//   const [selectedMovie, setSelectedMovie] = useState(null);

//   useEffect(() => {
//     if (!data?.data) return;
//     const initialCategories = {};
//     const initialJuries = {};

//     data.data.forEach((movie) => {
//       initialCategories[movie.id_movie] = (movie.Categories || []).map(
//         (category) => category.id_categorie
//       );
//       initialJuries[movie.id_movie] = (movie.Juries || []).map(
//         (jury) => jury.id_user
//       );
//     });

//     setCategorySelection(initialCategories);
//     setJurySelection(initialJuries);
//   }, [data]);

//   const statusMutation = useMutation({
//     mutationFn: ({ id, status }) => updateMovieStatus(id, status),
//     onSuccess: () => {
//       queryClient.invalidateQueries({ queryKey: ["listVideos"] });
//     }
//   });

//   const categoryMutation = useMutation({
//     mutationFn: ({ id, categories }) => updateMovieCategories(id, categories),
//     onSuccess: () => {
//       queryClient.invalidateQueries({ queryKey: ["listVideos"] });
//     }
//   });

//   const juryMutation = useMutation({
//     mutationFn: ({ id, juryIds }) => updateMovieJuries(id, juryIds),
//     onSuccess: () => {
//       queryClient.invalidateQueries({ queryKey: ["listVideos"] });
//     }
//   });

//   const deleteMutation = useMutation({
//     mutationFn: (id) => deleteMovie(id),
//     onSuccess: () => {
//       queryClient.invalidateQueries({ queryKey: ["listVideos"] });
//     }
//   });

//   const uploadBase = "http://localhost:3000/uploads";
//   const getPoster = (movie) => (
//     movie.thumbnail
//       ? `${uploadBase}/${movie.thumbnail}`
//       : movie.display_picture
//         ? `${uploadBase}/${movie.display_picture}`
//         : movie.picture1
//           ? `${uploadBase}/${movie.picture1}`
//           : null
//   );

//   // État de chargement - affiche un message en attente des données
//   if (isPending) {
//     return <div className="text-gray-300">Chargement en cours...</div>;
//   }

//   // État d'erreur - affiche le message d'erreur si la requête échoue
//   if (isError) {
//     return <div className="text-red-300">Une erreur est survenue : {error.message}</div>;
//   }

//   // Affichage de la liste des vidéos ou message si aucune vidéo n'existe
//   return (
//     <div className="space-y-6">
//       {data.data.length > 0 ? (
//         <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
//           {data.data.map((movie) => {
//             const poster = getPoster(movie);
//             return (
//               <button
//                 type="button"
//                 key={movie.id_movie}
//                 onClick={() => setSelectedMovie(movie)}
//                 className="text-left bg-gray-950 border border-gray-800 rounded-xl p-4 hover:border-gray-600 transition"
//               >
//                 <div className="aspect-video bg-gray-800 rounded-lg overflow-hidden">
//                   {poster ? (
//                     <img src={poster} alt={movie.title} className="w-full h-full object-cover" />
//                   ) : (
//                     <div className="w-full h-full flex items-center justify-center text-gray-500 text-sm">Aucune vignette</div>
//                   )}
//                 </div>
//                 <div className="mt-3">
//                   <h3 className="text-lg font-semibold text-white">{movie.title}</h3>
//                   <p className="text-sm text-gray-400 mt-1 line-clamp-2">{movie.synopsis || movie.description || "-"}</p>
//                   <div className="mt-2 text-xs text-gray-400 flex flex-wrap gap-3">
//                     <span>{movie.duration ? `${movie.duration}s` : "-"}</span>
//                     <span>{movie.main_language || "-"}</span>
//                     <span>{movie.nationality || "-"}</span>
//                     <span>{movie.selection_status || "submitted"}</span>
//                   </div>
//                 </div>
//               </button>
//             );
//           })}
//         </div>
//       ) : (
//         <div className="text-gray-400">Aucune vidéo trouvée.</div>
//       )}

//       {selectedMovie && (
//         <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4">
//           <div className="bg-gray-950 border border-gray-800 rounded-2xl w-full max-w-5xl max-h-[90vh] overflow-y-auto p-6">
//             <div className="flex items-center justify-between">
//               <h3 className="text-2xl font-bold text-white">{selectedMovie.title}</h3>
//               <button
//                 type="button"
//                 onClick={() => setSelectedMovie(null)}
//                 className="text-gray-400 hover:text-white"
//               >
//                 ✕
//               </button>
//             </div>

//             <p className="text-gray-400 mt-2">{selectedMovie.synopsis || selectedMovie.description || "-"}</p>

//             <div className="grid grid-cols-2 gap-4 mt-4 text-sm text-gray-300">
//               <div><span className="text-gray-400">Durée:</span> {selectedMovie.duration ? `${selectedMovie.duration}s` : "-"}</div>
//               <div><span className="text-gray-400">Langue:</span> {selectedMovie.main_language || "-"}</div>
//               <div><span className="text-gray-400">Nationalité:</span> {selectedMovie.nationality || "-"}</div>
//               <div><span className="text-gray-400">Statut:</span> {selectedMovie.selection_status || "submitted"}</div>
//               <div><span className="text-gray-400">Producteur:</span> {(selectedMovie.User || selectedMovie.Producer) ? `${(selectedMovie.User || selectedMovie.Producer).first_name} ${(selectedMovie.User || selectedMovie.Producer).last_name}` : "-"}</div>
//               <div><span className="text-gray-400">Comment avez-vous connu le Festival ?</span> {(selectedMovie.User || selectedMovie.Producer)?.known_by_mars_ai || "-"}</div>
//             </div>

//             <div className="mt-4 flex flex-wrap gap-3">
//               {selectedMovie.trailer && (
//                 <a
//                   className="text-[#AD46FF] hover:text-[#F6339A] font-semibold"
//                   href={`${uploadBase}/${selectedMovie.trailer}`}
//                   target="_blank"
//                   rel="noreferrer"
//                 >
//                   Ouvrir la vidéo
//                 </a>
//               )}
//               {typeof selectedMovie.subtitle === "string" && selectedMovie.subtitle.toLowerCase().endsWith(".srt") && (
//                 <a
//                   className="text-[#AD46FF] hover:text-[#F6339A] font-semibold"
//                   href={`${uploadBase}/${selectedMovie.subtitle}`}
//                   target="_blank"
//                   rel="noreferrer"
//                   download
//                 >
//                   Télécharger les sous-titres
//                 </a>
//               )}
//               {selectedMovie.youtube_link && (
//                 <a
//                   className="text-[#AD46FF] hover:text-[#F6339A] font-semibold"
//                   href={selectedMovie.youtube_link}
//                   target="_blank"
//                   rel="noreferrer"
//                 >
//                   Voir sur YouTube
//                 </a>
//               )}
//             </div>

//             {(selectedMovie.trailer || selectedMovie.youtube_link) && (
//               <div className="mt-4">
//                 {selectedMovie.trailer ? (
//                   <VideoPreview
//                     title={selectedMovie.title}
//                     src={`${uploadBase}/${selectedMovie.trailer}`}
//                     poster={getPoster(selectedMovie) || undefined}
//                   />
//                 ) : (
//                   <a className="text-[#AD46FF] hover:text-[#F6339A]" href={selectedMovie.youtube_link} target="_blank" rel="noreferrer">
//                     Ouvrir la vidéo
//                   </a>
//                 )}
//               </div>
//             )}

//             <div className="mt-6 flex flex-wrap gap-3">
//               <button
//                 type="button"
//                 onClick={() => statusMutation.mutate({ id: selectedMovie.id_movie, status: "selected" })}
//                 className="px-4 py-2 bg-green-600/80 text-white rounded-lg hover:bg-green-600"
//               >
//                 Approuver
//               </button>
//               <button
//                 type="button"
//                 onClick={() => statusMutation.mutate({ id: selectedMovie.id_movie, status: "refused" })}
//                 className="px-4 py-2 bg-red-600/80 text-white rounded-lg hover:bg-red-600"
//               >
//                 Refuser
//               </button>
//               <button
//                 type="button"
//                 onClick={() => {
//                   if (window.confirm("Supprimer définitivement ce film ?")) {
//                     deleteMutation.mutate(selectedMovie.id_movie);
//                   }
//                 }}
//                 className="px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700"
//               >
//                 Supprimer
//               </button>
//             </div>

//             <div className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
//               <div>
//                 <h4 className="text-sm uppercase text-gray-400 mb-3">Catégories</h4>
//                 {categories.length === 0 ? (
//                   <p className="text-gray-500 text-sm">Aucune catégorie disponible.</p>
//                 ) : (
//                   <select
//                     value={(categorySelection[selectedMovie.id_movie] || [""])[0] || ""}
//                     onChange={(event) => {
//                       const value = event.target.value;
//                       setCategorySelection((prev) => ({
//                         ...prev,
//                         [selectedMovie.id_movie]: value ? [Number(value)] : []
//                       }));
//                     }}
//                     className="w-full bg-gray-800 border border-gray-700 text-white px-3 py-2 rounded-lg"
//                   >
//                     <option value="">Sélectionner une catégorie</option>
//                     {categories.map((category) => (
//                       <option key={`${selectedMovie.id_movie}-cat-${category.id_categorie}`} value={category.id_categorie}>
//                         {category.name}
//                       </option>
//                     ))}
//                   </select>
//                 )}
//                 <button
//                   type="button"
//                   onClick={() => categoryMutation.mutate({
//                     id: selectedMovie.id_movie,
//                     categories: categorySelection[selectedMovie.id_movie] || []
//                   })}
//                   className="mt-3 px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700"
//                 >
//                   Enregistrer catégories
//                 </button>
//               </div>

//               <div>
//                 <h4 className="text-sm uppercase text-gray-400 mb-3">Assigner jurys</h4>
//                 {juries.length === 0 ? (
//                   <p className="text-gray-500 text-sm">Aucun jury disponible.</p>
//                 ) : (
//                   <div className="grid grid-cols-2 gap-2 text-sm text-gray-300">
//                     {juries.map((jury) => {
//                       const selected = (jurySelection[selectedMovie.id_movie] || []).includes(jury.id_user);
//                       return (
//                         <label key={`${selectedMovie.id_movie}-jury-${jury.id_user}`} className="flex items-center gap-2">
//                           <input
//                             type="checkbox"
//                             checked={selected}
//                             onChange={() => {
//                               setJurySelection((prev) => {
//                                 const current = prev[selectedMovie.id_movie] || [];
//                                 const exists = current.includes(jury.id_user);
//                                 const next = exists
//                                   ? current.filter((id) => id !== jury.id_user)
//                                   : [...current, jury.id_user];
//                                 return { ...prev, [selectedMovie.id_movie]: next };
//                               });
//                             }}
//                             className="accent-[#AD46FF]"
//                           />
//                           {jury.first_name} {jury.last_name}
//                         </label>
//                       );
//                     })}
//                   </div>
//                 )}
//                 <button
//                   type="button"
//                   onClick={() => juryMutation.mutate({
//                     id: selectedMovie.id_movie,
//                     juryIds: jurySelection[selectedMovie.id_movie] || []
//                   })}
//                   className="mt-3 px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700"
//                 >
//                   Enregistrer jurys
//                 </button>
//               </div>
//             </div>

//             <div className="mt-6 grid grid-cols-2 gap-3">
//               {[selectedMovie.picture1, selectedMovie.picture2, selectedMovie.picture3].filter(Boolean).map((pic, idx) => (
//                 <div key={`${selectedMovie.id_movie}-pic-${idx}`} className="aspect-video bg-gray-800 rounded-lg overflow-hidden">
//                   <img src={`${uploadBase}/${pic}`} alt="Vignette" className="w-full h-full object-cover" />
//                 </div>
//               ))}
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }

// export default Videos;



/**
 * Composant Videos (Gestion des Vidéos Admin)
 * Page administrateur pour afficher et gérer les vidéos du système
 * Utilise le hook useVideosData pour la logique métier
 * Affiche les vidéos en format grille (cartes)
 */
// import { useState } from "react";
// import { useVideosData } from "../../hooks/useVideosData";
// import VideosList from "../../components/admin/VideosList";

// export default function Movies() {
//   // Pagination state
//   const [currentPage, setCurrentPage] = useState(1);
//   const [itemsPerPage, setItemsPerPage] = useState(10);

//   const {
//     videos,
//     categories,
//     juries,
//     categorySelection,
//     setCategorySelection,
//     jurySelection,
//     setJurySelection,
//     selectedMovie,
//     setSelectedMovie,
//     updateStatus,
//     updateCategories,
//     updateJuries,
//     deleteMovie,
//     getPoster,
//     uploadBase,
//     isUpdatingCategories,
//     isUpdatingJuries,
//     isLoading,
//     isError,
//     error
//   } = useVideosData();

//   const handleCategoryChange = (movieId, cats) => {
//     setCategorySelection(prev => ({ ...prev, [movieId]: cats }));
//   };

//   const handleCategorySave = (movieId) => {
//     updateCategories({ id: movieId, categories: categorySelection[movieId] || [] });
//   };

//   const handleJuryToggle = (movieId, juryId) => {
//     setJurySelection((prev) => {
//       const current = prev[movieId] || [];
//       return {
//         ...prev,
//         [movieId]: current.includes(juryId)
//           ? current.filter(id => id !== juryId)
//           : [...current, juryId]
//       };
//     });
//   };

//   const handleJurySave = (movieId) => {
//     updateJuries({ id: movieId, juryIds: jurySelection[movieId] || [] });
//   };

//   const handleStatusUpdate = (movieId, status) => {
//     updateStatus({ id: movieId, status });
//   };

//   const handleDelete = (movieId) => {
//     deleteMovie(movieId);
//     setSelectedMovie(null);
//   };

//   // Pagination handlers
//   const handlePageChange = (page) => {
//     setCurrentPage(page);
//   };

//   const handleItemsPerPageChange = (items) => {
//     setItemsPerPage(items);
//     setCurrentPage(1); // Reset to first page when changing items per page
//   };

//   // Calculate paginated videos
//   const startIndex = (currentPage - 1) * itemsPerPage;
//   const endIndex = startIndex + itemsPerPage;
//   const paginatedVideos = videos.slice(startIndex, endIndex);

//   if (isLoading) return <div className="text-gray-400">Chargement...</div>;
//   if (isError) return <div className="text-red-400">Erreur: {error.message}</div>;

//   return (
//     <div className="space-y-4">
//       <h1 className="text-2xl font-bold text-white">Gestion des films</h1>
//       <VideosList
//         videos={paginatedVideos}
//         categories={categories}
//         juries={juries}
//         categorySelection={categorySelection}
//         jurySelection={jurySelection}
//         selectedMovie={selectedMovie}
//         onMovieSelect={setSelectedMovie}
//         onModalClose={() => setSelectedMovie(null)}
//         onCategoryChange={handleCategoryChange}
//         onCategorySave={handleCategorySave}
//         onJuryToggle={handleJuryToggle}
//         onJurySave={handleJurySave}
//         onStatusUpdate={handleStatusUpdate}
//         onDelete={handleDelete}
//         getPoster={getPoster}
//         uploadBase={uploadBase}
//         isUpdatingCategories={isUpdatingCategories}
//         isUpdatingJuries={isUpdatingJuries}
//         showPagination={true}
//         currentPage={currentPage}
//         totalPages={Math.ceil(videos.length / itemsPerPage)}
//         itemsPerPage={itemsPerPage}
//         onPageChange={handlePageChange}
//         onItemsPerPageChange={handleItemsPerPageChange}
//       />
//     </div>
//   );
// }



/**
 * Composant Videos (Gestion des Vidéos Admin)
 * Page administrateur pour afficher et gérer les vidéos du système
 * Utilise le hook useVideosData pour la logique métier
 * Affiche les vidéos en format grille (cartes)
 */


import { useState } from "react";
import { useVideosData } from "../../hooks/useVideosData";
import VideosList from "../../components/admin/VideosList";

export default function Movies() {

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);


  const {
    videos,
    categories,
    juries,
    categorySelection,
    setCategorySelection,
    jurySelection,
    setJurySelection,
    selectedMovie,
    setSelectedMovie,
    updateStatus,
    updateCategories,
    updateJuries,
    deleteMovie,
    getPoster,
    uploadBase,
    isUpdatingCategories,
    isUpdatingJuries,
    isLoading,
    isError,
    error
  } = useVideosData();

  const handleCategoryChange = (movieId, cats) => {
    setCategorySelection(prev => ({ ...prev, [movieId]: cats }));
  };

  const handleCategorySave = (movieId) => {
    updateCategories({ id: movieId, categories: categorySelection[movieId] || [] });
  };

  const handleJuryToggle = (movieId, juryId) => {
    setJurySelection((prev) => {
      const current = prev[movieId] || [];
      return {
        ...prev,
        [movieId]: current.includes(juryId)
          ? current.filter(id => id !== juryId)
          : [...current, juryId]
      };
    });
  };

  const handleJurySave = (movieId) => {
    updateJuries({ id: movieId, juryIds: jurySelection[movieId] || [] });
  };

  const handleStatusUpdate = (movieId, status) => {
    updateStatus({ id: movieId, status });
  };

  const handleDelete = (movieId) => {
    deleteMovie(movieId);
    setSelectedMovie(null);
  };

  // Pagination handlers
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleItemsPerPageChange = (items) => {
    setItemsPerPage(items);
    setCurrentPage(1); // Reset to first page when changing items per page
  };

  if (isLoading) return (
    <div className="flex items-center justify-center h-64">
      <div className="text-gray-400 flex items-center gap-2 bg-[#1a1c20]/80 border border-white/10 rounded-lg px-4 py-2">
        <div className="w-4 h-4 border-2 border-blue-500/30 border-t-blue-500 rounded-full animate-spin" />
        <span className="text-sm">Chargement des vidéos...</span>
      </div>
    </div>
  );
  
  if (isError) return (
    <div className="flex items-center justify-center h-64">
      <div className="bg-red-500/10 border border-red-500/30 rounded-lg px-4 py-3 text-red-400 text-sm">
        Erreur: {error.message}
      </div>
    </div>
  );

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-white">Gestion des films</h1>
          <p className="text-xs text-gray-400 mt-1">
            {videos.length} film{videos.length !== 1 ? 's' : ''} enregistré{videos.length !== 1 ? 's' : ''}
          </p>
        </div>
      </div>

      <VideosList
        videos={videos}
        categories={categories}
        juries={juries}
        categorySelection={categorySelection}
        jurySelection={jurySelection}
        selectedMovie={selectedMovie}
        onMovieSelect={setSelectedMovie}
        onModalClose={() => setSelectedMovie(null)}
        onCategoryChange={handleCategoryChange}
        onCategorySave={handleCategorySave}
        onJuryToggle={handleJuryToggle}
        onJurySave={handleJurySave}
        onStatusUpdate={handleStatusUpdate}
        onDelete={handleDelete}
        getPoster={getPoster}
        uploadBase={uploadBase}
        isUpdatingCategories={isUpdatingCategories}
        isUpdatingJuries={isUpdatingJuries}
        showPagination={true}
        currentPage={currentPage}
        totalPages={Math.ceil(videos.length / itemsPerPage)}
        itemsPerPage={itemsPerPage}
        onPageChange={handlePageChange}
        onItemsPerPageChange={handleItemsPerPageChange}
      />
    </div>
  );
}
