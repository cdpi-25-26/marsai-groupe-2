// import { useState } from "react";
// import { VideoModal } from "../VideoModal.jsx";
// import Pagination from "../../components/admin/Pagination.jsx";

// export default function VideosList({ 
//   videos,
//   categories,
//   juries,
//   categorySelection,
//   jurySelection,
//   selectedMovie,
//   onMovieSelect,
//   onModalClose,
//   onCategoryChange,
//   onCategorySave,
//   onJuryToggle,
//   onJurySave,
//   onStatusUpdate,
//   onDelete,
//   getPoster,
//   uploadBase,
//   isUpdatingCategories,
//   isUpdatingJuries,
//   showPagination = false,
//   itemsPerPage = 10,
//   onPageChange,
//   onItemsPerPageChange,
//   currentPage = 1,
//   totalPages = 1
// }) {
//   const [sortField, setSortField] = useState(null);
//   const [sortDirection, setSortDirection] = useState('asc');

//   const handleSort = (field) => {
//     if (sortField === field) {
//       setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
//     } else {
//       setSortField(field);
//       setSortDirection('asc');
//     }
//   };

//   const getSortedVideos = () => {
//     if (!sortField) return videos;

//     return [...videos].sort((a, b) => {
//       let aValue = a[sortField];
//       let bValue = b[sortField];

//       if (sortField === 'producer') {
//         aValue = (a.User || a.Producer)?.first_name || '';
//         bValue = (b.User || b.Producer)?.first_name || '';
//       }

//       if (typeof aValue === 'string') {
//         aValue = aValue.toLowerCase();
//         bValue = bValue.toLowerCase();
//       }

//       if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
//       if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
//       return 0;
//     });
//   };

//   // First sort all videos, THEN paginate
//   const sortedVideos = getSortedVideos();

//   // Apply pagination to sorted videos
//   const startIndex = (currentPage - 1) * itemsPerPage;
//   const endIndex = startIndex + itemsPerPage;
//   const displayVideos = showPagination 
//     ? sortedVideos.slice(startIndex, endIndex)
//     : sortedVideos;

//   const SortIcon = ({ field }) => {
//     if (sortField !== field) {
//       return (
//         <svg className="w-3 h-3 ml-1 text-gray-500 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l-4-4m4 4l4-4" />
//         </svg>
//       );
//     }
//     return (
//       <svg className={`w-3 h-3 ml-1 inline ${sortDirection === 'asc' ? 'text-blue-400' : 'text-blue-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
//         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={sortDirection === 'asc' ? "M5 15l7-7 7 7" : "M19 9l-7 7-7-7"} />
//       </svg>
//     );
//   };

//   if (videos.length === 0) {
//     return (
//       <div className="flex flex-col items-center justify-center h-48 bg-[#1a1c20]/60 border border-white/10 rounded-lg p-6">
//         <svg className="w-12 h-12 text-gray-600 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
//         </svg>
//         <p className="text-gray-400 text-sm">Aucune vidéo trouvée</p>
//         <p className="text-gray-500 text-xs mt-1">Les vidéos uploadées apparaîtront ici</p>
//       </div>
//     );
//   }

//   return (
//     <>
//       <div className="bg-gradient-to-br from-[#1a1c20]/60 to-[#0f1114]/60 backdrop-blur-xl border border-white/10 rounded-xl shadow-xl shadow-black/30 transition-all duration-300">
//         <div className="overflow-x-auto scrollbar-thin-dark">
//           <table className="w-full text-sm">
//             <thead className="bg-gray-900/50 border-b border-white/10">
//               <tr>
//                 <th 
//                   className="px-3 py-2.5 text-left text-xs font-medium text-gray-400 uppercase tracking-wider cursor-pointer hover:text-white transition-colors"
//                   onClick={() => handleSort('title')}
//                 >
//                   <div className="flex items-center">
//                     Titre <SortIcon field="title" />
//                   </div>
//                 </th>
//                 <th 
//                   className="px-3 py-2.5 text-left text-xs font-medium text-gray-400 uppercase tracking-wider cursor-pointer hover:text-white transition-colors"
//                   onClick={() => handleSort('producer')}
//                 >
//                   <div className="flex items-center">
//                     Producteur <SortIcon field="producer" />
//                   </div>
//                 </th>
//                 <th 
//                   className="px-3 py-2.5 text-left text-xs font-medium text-gray-400 uppercase tracking-wider cursor-pointer hover:text-white transition-colors"
//                   onClick={() => handleSort('duration')}
//                 >
//                   <div className="flex items-center">
//                     Durée <SortIcon field="duration" />
//                   </div>
//                 </th>
//                 <th 
//                   className="px-3 py-2.5 text-left text-xs font-medium text-gray-400 uppercase tracking-wider cursor-pointer hover:text-white transition-colors"
//                   onClick={() => handleSort('selection_status')}
//                 >
//                   <div className="flex items-center">
//                     Statut <SortIcon field="selection_status" />
//                   </div>
//                 </th>
//                 <th className="px-3 py-2.5 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
//                   Catégories
//                 </th>
//                 <th className="px-3 py-2.5 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
//                   Jurys
//                 </th>
//                 <th className="px-3 py-2.5 text-right text-xs font-medium text-gray-400 uppercase tracking-wider">
//                   Actions
//                 </th>
//               </tr>
//             </thead>
//             <tbody className="divide-y divide-white/5">
//               {displayVideos.map((movie) => (
//                 <tr 
//                   key={movie.id_movie} 
//                   className="hover:bg-white/5 transition-colors duration-150 cursor-pointer"
//                   onClick={() => onMovieSelect(movie)}
//                 >
//                   <td className="px-3 py-2.5">
//                     <div className="flex items-center gap-2">
//                       <div className="w-8 h-8 bg-gray-800/80 rounded overflow-hidden flex-shrink-0 border border-white/10">
//                         {getPoster(movie) ? (
//                           <img 
//                             src={getPoster(movie)} 
//                             alt={movie.title} 
//                             className="w-full h-full object-cover"
//                           />
//                         ) : (
//                           <div className="w-full h-full flex items-center justify-center">
//                             <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
//                             </svg>
//                           </div>
//                         )}
//                       </div>
//                       <span className="text-sm font-medium text-white">{movie.title}</span>
//                     </div>
//                   </td>
//                   <td className="px-3 py-2.5 text-sm text-gray-300">
//                     {(movie.User || movie.Producer)?.first_name} {(movie.User || movie.Producer)?.last_name}
//                   </td>
//                   <td className="px-3 py-2.5 text-sm text-gray-300">
//                     {movie.duration ? `${Math.floor(movie.duration)}min` : '-'}
//                   </td>
//                   <td className="px-3 py-2.5">
//                     <span className={`inline-flex px-2 py-1 text-[10px] font-medium rounded-full ${
//                       movie.selection_status === 'selected' 
//                         ? 'bg-green-500/20 text-green-300 border border-green-500/30' 
//                         : movie.selection_status === 'refused'
//                           ? 'bg-red-500/20 text-red-300 border border-red-500/30'
//                           : 'bg-yellow-500/20 text-yellow-300 border border-yellow-500/30'
//                     }`}>
//                       {movie.selection_status === 'selected' ? 'Sélectionné' : 
//                        movie.selection_status === 'refused' ? 'Refusé' : 'En attente'}
//                     </span>
//                   </td>
//                   <td className="px-3 py-2.5">
//                     <div className="flex flex-wrap gap-1 max-w-[200px]">
//                       {(movie.Categories || []).slice(0, 2).map((cat) => (
//                         <span 
//                           key={cat.id_categorie}
//                           className="px-1.5 py-0.5 bg-blue-500/10 border border-blue-500/20 rounded text-[9px] text-blue-300 whitespace-nowrap"
//                         >
//                           {cat.name}
//                         </span>
//                       ))}
//                       {(movie.Categories || []).length > 2 && (
//                         <span className="px-1.5 py-0.5 bg-white/5 border border-white/10 rounded text-[9px] text-gray-400">
//                           +{(movie.Categories || []).length - 2}
//                         </span>
//                       )}
//                     </div>
//                   </td>
//                   <td className="px-3 py-2.5">
//                     <div className="flex flex-wrap gap-1 max-w-[200px]">
//                       {(movie.Juries || []).slice(0, 2).map((jury) => (
//                         <span 
//                           key={jury.id_user}
//                           className="px-1.5 py-0.5 bg-purple-500/10 border border-purple-500/20 rounded text-[9px] text-purple-300 whitespace-nowrap"
//                         >
//                           {jury.first_name}
//                         </span>
//                       ))}
//                       {(movie.Juries || []).length > 2 && (
//                         <span className="px-1.5 py-0.5 bg-white/5 border border-white/10 rounded text-[9px] text-gray-400">
//                           +{(movie.Juries || []).length - 2}
//                         </span>
//                       )}
//                     </div>
//                   </td>
//                   <td className="px-3 py-2.5 text-right">
//                     <div className="flex items-center justify-end gap-1">
//                       <button
//                         onClick={(e) => {
//                           e.stopPropagation();
//                           onStatusUpdate(movie.id_movie, "selected");
//                         }}
//                         className="p-1.5 bg-green-500/10 text-green-400 rounded hover:bg-green-500/20 border border-green-500/20 transition-colors"
//                         title="Approuver"
//                       >
//                         <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
//                         </svg>
//                       </button>
//                       <button
//                         onClick={(e) => {
//                           e.stopPropagation();
//                           onStatusUpdate(movie.id_movie, "refused");
//                         }}
//                         className="p-1.5 bg-red-500/10 text-red-400 rounded hover:bg-red-500/20 border border-red-500/20 transition-colors"
//                         title="Refuser"
//                       >
//                         <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
//                         </svg>
//                       </button>
//                       <button
//                         onClick={(e) => {
//                           e.stopPropagation();
//                           if (window.confirm("Supprimer définitivement ce film ?")) {
//                             onDelete(movie.id_movie);
//                           }
//                         }}
//                         className="p-1.5 bg-gray-700/50 text-gray-400 rounded hover:bg-red-500/20 hover:text-red-400 border border-white/10 hover:border-red-500/30 transition-colors"
//                         title="Supprimer"
//                       >
//                         <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
//                         </svg>
//                       </button>
//                     </div>
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
        
//         {showPagination && (
//           <div className="px-3 py-2 border-t border-white/10">
//             <Pagination
//               currentPage={currentPage}
//               totalPages={totalPages}
//               itemsPerPage={itemsPerPage}
//               onPageChange={onPageChange}
//               onItemsPerPageChange={onItemsPerPageChange}
//             />
//           </div>
//         )}
//       </div>

//       {selectedMovie && (
//         <VideoModal
//           movie={selectedMovie}
//           onClose={onModalClose}
//           categories={categories}
//           juries={juries}
//           categorySelection={categorySelection}
//           onCategoryChange={onCategoryChange}
//           onCategorySave={onCategorySave}
//           jurySelection={jurySelection}
//           onJuryToggle={onJuryToggle}
//           onJurySave={onJurySave}
//           onStatusUpdate={onStatusUpdate}
//           onDelete={onDelete}
//           getPoster={getPoster}
//           uploadBase={uploadBase}
//           isUpdatingCategories={isUpdatingCategories}
//           isUpdatingJuries={isUpdatingJuries}
//         />
//       )}
//     </>
//   );
// }



// import { useState } from "react";
// import { VideoModal } from "../VideoModal.jsx";
// import Pagination from "../../components/admin/Pagination.jsx";

// export default function VideosList({ 
//   videos,
//   categories,
//   juries,
//   categorySelection,
//   jurySelection,
//   selectedMovie,
//   onMovieSelect,
//   onModalClose,
//   onCategoryChange,
//   onCategorySave,
//   onJuryToggle,
//   onJurySave,
//   onStatusUpdate,
//   onDelete,
//   getPoster,
//   uploadBase,
//   isUpdatingCategories,
//   isUpdatingJuries,
//   showPagination = false,
//   itemsPerPage = 10,
//   onPageChange,
//   onItemsPerPageChange,
//   currentPage = 1,
//   totalPages = 1
// }) {
//   const [sortField, setSortField] = useState(null);
//   const [sortDirection, setSortDirection] = useState('asc');

//   const handleSort = (field) => {
//     if (sortField === field) {
//       setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
//     } else {
//       setSortField(field);
//       setSortDirection('asc');
//     }
//   };

//   const getSortedVideos = () => {
//     if (!sortField) return videos;

//     return [...videos].sort((a, b) => {
//       let aValue = a[sortField];
//       let bValue = b[sortField];

//       if (sortField === 'producer') {
//         aValue = (a.User || a.Producer)?.first_name || '';
//         bValue = (b.User || b.Producer)?.first_name || '';
//       }

//       if (typeof aValue === 'string') {
//         aValue = aValue.toLowerCase();
//         bValue = bValue.toLowerCase();
//       }

//       if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
//       if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
//       return 0;
//     });
//   };

//   // First sort all videos, THEN paginate
//   const sortedVideos = getSortedVideos();

//   // Apply pagination to sorted videos
//   const startIndex = (currentPage - 1) * itemsPerPage;
//   const endIndex = startIndex + itemsPerPage;
//   const displayVideos = showPagination 
//     ? sortedVideos.slice(startIndex, endIndex)
//     : sortedVideos;

//   const SortIcon = ({ field }) => {
//     if (sortField !== field) {
//       return (
//         <svg className="w-2.5 h-2.5 sm:w-3 sm:h-3 ml-1 text-gray-500 inline flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l-4-4m4 4l4-4" />
//         </svg>
//       );
//     }
//     return (
//       <svg className={`w-2.5 h-2.5 sm:w-3 sm:h-3 ml-1 inline flex-shrink-0 ${sortDirection === 'asc' ? 'text-blue-400' : 'text-blue-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
//         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={sortDirection === 'asc' ? "M5 15l7-7 7 7" : "M19 9l-7 7-7-7"} />
//       </svg>
//     );
//   };

//   if (videos.length === 0) {
//     return (
//       <div className="flex flex-col items-center justify-center h-48 bg-[#1a1c20]/60 border border-white/10 rounded-lg p-6">
//         <svg className="w-10 h-10 sm:w-12 sm:h-12 text-gray-600 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
//         </svg>
//         <p className="text-gray-400 text-sm">Aucune vidéo trouvée</p>
//         <p className="text-gray-500 text-xs mt-1 text-center">Les vidéos uploadées apparaîtront ici</p>
//       </div>
//     );
//   }

//   return (
//     <>
//       <div className="bg-gradient-to-br from-[#1a1c20]/60 to-[#0f1114]/60 backdrop-blur-xl border border-white/10 rounded-xl shadow-xl shadow-black/30 transition-all duration-300">
//         <div className="overflow-x-auto scrollbar-thin-dark">
//           <table className="w-full text-xs sm:text-sm">
//             <thead className="bg-gray-900/50 border-b border-white/10">
//               <tr>
//                 <th 
//                   className="px-2 sm:px-3 py-2 text-left text-[10px] sm:text-xs font-medium text-gray-400 uppercase tracking-wider cursor-pointer hover:text-white transition-colors"
//                   onClick={() => handleSort('title')}
//                 >
//                   <div className="flex items-center whitespace-nowrap">
//                     Titre <SortIcon field="title" />
//                   </div>
//                 </th>
//                 <th 
//                   className="px-2 sm:px-3 py-2 text-left text-[10px] sm:text-xs font-medium text-gray-400 uppercase tracking-wider cursor-pointer hover:text-white transition-colors hidden md:table-cell"
//                   onClick={() => handleSort('producer')}
//                 >
//                   <div className="flex items-center whitespace-nowrap">
//                     Producteur <SortIcon field="producer" />
//                   </div>
//                 </th>
//                 <th 
//                   className="px-2 sm:px-3 py-2 text-left text-[10px] sm:text-xs font-medium text-gray-400 uppercase tracking-wider cursor-pointer hover:text-white transition-colors hidden sm:table-cell"
//                   onClick={() => handleSort('duration')}
//                 >
//                   <div className="flex items-center whitespace-nowrap">
//                     Durée <SortIcon field="duration" />
//                   </div>
//                 </th>
//                 <th 
//                   className="px-2 sm:px-3 py-2 text-left text-[10px] sm:text-xs font-medium text-gray-400 uppercase tracking-wider cursor-pointer hover:text-white transition-colors"
//                   onClick={() => handleSort('selection_status')}
//                 >
//                   <div className="flex items-center whitespace-nowrap">
//                     Statut <SortIcon field="selection_status" />
//                   </div>
//                 </th>
//                 <th className="px-2 sm:px-3 py-2 text-left text-[10px] sm:text-xs font-medium text-gray-400 uppercase tracking-wider hidden lg:table-cell">
//                   Catégories
//                 </th>
//                 <th className="px-2 sm:px-3 py-2 text-left text-[10px] sm:text-xs font-medium text-gray-400 uppercase tracking-wider hidden lg:table-cell">
//                   Jurys
//                 </th>
//                 <th className="px-2 sm:px-3 py-2 text-right text-[10px] sm:text-xs font-medium text-gray-400 uppercase tracking-wider">
//                   Actions
//                 </th>
//               </tr>
//             </thead>
//             <tbody className="divide-y divide-white/5">
//               {displayVideos.map((movie) => (
//                 <tr 
//                   key={movie.id_movie} 
//                   className="hover:bg-white/5 transition-colors duration-150 cursor-pointer"
//                   onClick={() => onMovieSelect(movie)}
//                 >
//                   <td className="px-2 sm:px-3 py-2">
//                     <div className="flex items-center gap-2">
//                       <div className="w-6 h-6 sm:w-8 sm:h-8 bg-gray-800/80 rounded overflow-hidden flex-shrink-0 border border-white/10">
//                         {getPoster(movie) ? (
//                           <img 
//                             src={getPoster(movie)} 
//                             alt={movie.title} 
//                             className="w-full h-full object-cover"
//                           />
//                         ) : (
//                           <div className="w-full h-full flex items-center justify-center">
//                             <svg className="w-3 h-3 sm:w-4 sm:h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
//                             </svg>
//                           </div>
//                         )}
//                       </div>
//                       <span className="text-xs sm:text-sm font-medium text-white truncate max-w-[80px] sm:max-w-none">{movie.title}</span>
//                     </div>
//                   </td>
//                   <td className="px-2 sm:px-3 py-2 text-xs sm:text-sm text-gray-300 hidden md:table-cell">
//                     <span className="truncate max-w-[100px] block">
//                       {(movie.User || movie.Producer)?.first_name} {(movie.User || movie.Producer)?.last_name}
//                     </span>
//                   </td>
//                   <td className="px-2 sm:px-3 py-2 text-xs sm:text-sm text-gray-300 hidden sm:table-cell">
//                     {movie.duration ? `${Math.floor(movie.duration)}min` : '-'}
//                   </td>
//                   <td className="px-2 sm:px-3 py-2">
//                     <span className={`inline-flex px-1.5 sm:px-2 py-1 text-[8px] sm:text-[10px] font-medium rounded-full whitespace-nowrap ${
//                       movie.selection_status === 'selected' 
//                         ? 'bg-green-500/20 text-green-300 border border-green-500/30' 
//                         : movie.selection_status === 'refused'
//                           ? 'bg-red-500/20 text-red-300 border border-red-500/30'
//                           : 'bg-yellow-500/20 text-yellow-300 border border-yellow-500/30'
//                     }`}>
//                       {movie.selection_status === 'selected' ? 'Sélectionné' : 
//                        movie.selection_status === 'refused' ? 'Refusé' : 'En attente'}
//                     </span>
//                   </td>
//                   <td className="px-2 sm:px-3 py-2 hidden lg:table-cell">
//                     <div className="flex flex-wrap gap-1 max-w-[150px]">
//                       {(movie.Categories || []).slice(0, 2).map((cat) => (
//                         <span 
//                           key={cat.id_categorie}
//                           className="px-1.5 py-0.5 bg-blue-500/10 border border-blue-500/20 rounded text-[8px] text-blue-300 whitespace-nowrap"
//                         >
//                           {cat.name}
//                         </span>
//                       ))}
//                       {(movie.Categories || []).length > 2 && (
//                         <span className="px-1.5 py-0.5 bg-white/5 border border-white/10 rounded text-[8px] text-gray-400">
//                           +{(movie.Categories || []).length - 2}
//                         </span>
//                       )}
//                     </div>
//                   </td>
//                   <td className="px-2 sm:px-3 py-2 hidden lg:table-cell">
//                     <div className="flex flex-wrap gap-1 max-w-[150px]">
//                       {(movie.Juries || []).slice(0, 2).map((jury) => (
//                         <span 
//                           key={jury.id_user}
//                           className="px-1.5 py-0.5 bg-purple-500/10 border border-purple-500/20 rounded text-[8px] text-purple-300 whitespace-nowrap"
//                         >
//                           {jury.first_name}
//                         </span>
//                       ))}
//                       {(movie.Juries || []).length > 2 && (
//                         <span className="px-1.5 py-0.5 bg-white/5 border border-white/10 rounded text-[8px] text-gray-400">
//                           +{(movie.Juries || []).length - 2}
//                         </span>
//                       )}
//                     </div>
//                   </td>
//                   <td className="px-2 sm:px-3 py-2 text-right">
//                     <div className="flex items-center justify-end gap-1">
//                       <button
//                         onClick={(e) => {
//                           e.stopPropagation();
//                           onStatusUpdate(movie.id_movie, "selected");
//                         }}
//                         className="p-1 sm:p-1.5 bg-green-500/10 text-green-400 rounded hover:bg-green-500/20 border border-green-500/20 transition-colors"
//                         title="Approuver"
//                       >
//                         <svg className="w-3 h-3 sm:w-3.5 sm:h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
//                         </svg>
//                       </button>
//                       <button
//                         onClick={(e) => {
//                           e.stopPropagation();
//                           onStatusUpdate(movie.id_movie, "refused");
//                         }}
//                         className="p-1 sm:p-1.5 bg-red-500/10 text-red-400 rounded hover:bg-red-500/20 border border-red-500/20 transition-colors"
//                         title="Refuser"
//                       >
//                         <svg className="w-3 h-3 sm:w-3.5 sm:h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
//                         </svg>
//                       </button>
//                       <button
//                         onClick={(e) => {
//                           e.stopPropagation();
//                           if (window.confirm("Supprimer définitivement ce film ?")) {
//                             onDelete(movie.id_movie);
//                           }
//                         }}
//                         className="p-1 sm:p-1.5 bg-gray-700/50 text-gray-400 rounded hover:bg-red-500/20 hover:text-red-400 border border-white/10 hover:border-red-500/30 transition-colors"
//                         title="Supprimer"
//                       >
//                         <svg className="w-3 h-3 sm:w-3.5 sm:h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
//                         </svg>
//                       </button>
//                     </div>
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
        
//         {showPagination && (
//           <div className="px-2 sm:px-3 py-2 border-t border-white/10">
//             <Pagination
//               currentPage={currentPage}
//               totalPages={totalPages}
//               itemsPerPage={itemsPerPage}
//               onPageChange={onPageChange}
//               onItemsPerPageChange={onItemsPerPageChange}
//             />
//           </div>
//         )}
//       </div>

//       {selectedMovie && (
//         <VideoModal
//           movie={selectedMovie}
//           onClose={onModalClose}
//           categories={categories}
//           juries={juries}
//           categorySelection={categorySelection}
//           onCategoryChange={onCategoryChange}
//           onCategorySave={onCategorySave}
//           jurySelection={jurySelection}
//           onJuryToggle={onJuryToggle}
//           onJurySave={onJurySave}
//           onStatusUpdate={onStatusUpdate}
//           onDelete={onDelete}
//           getPoster={getPoster}
//           uploadBase={uploadBase}
//           isUpdatingCategories={isUpdatingCategories}
//           isUpdatingJuries={isUpdatingJuries}
//         />
//       )}
//     </>
//   );
// }


import { useState, useMemo } from "react";
import { VideoModal } from "../VideoModal.jsx";
import Pagination from "../../components/admin/Pagination.jsx";
import SearchBar from "../../components/admin/SearchBar.jsx";

export default function VideosList({ 
  videos,
  categories,
  juries,
  categorySelection,
  jurySelection,
  selectedMovie,
  onMovieSelect,
  onModalClose,
  onCategoryChange,
  onCategorySave,
  onJuryToggle,
  onJurySave,
  onStatusUpdate,
  onDelete,
  getPoster,
  uploadBase,
  isUpdatingCategories,
  isUpdatingJuries,
  showPagination = false,
  itemsPerPage = 10,
  onPageChange,
  onItemsPerPageChange,
  currentPage = 1,
  totalPages = 1
}) {
  const [sortField, setSortField] = useState(null);
  const [sortDirection, setSortDirection] = useState('asc');
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearchChange = (value) => {
    setSearchQuery(value);
  };

  /**
   * Filtrage par titre et statut de sélection
   */
  const filteredVideos = useMemo(() => {
    if (!searchQuery.trim()) return videos;
    const q = searchQuery.toLowerCase().trim();
    return videos.filter((movie) => {
      const titleMatch = (movie.title || "").toLowerCase().includes(q);
      const statusLabel =
        movie.selection_status === "selected" ? "sélectionné" :
        movie.selection_status === "refused" ? "refusé" : "en attente";
      const statusMatch =
        (movie.selection_status || "").toLowerCase().includes(q) ||
        statusLabel.includes(q);
      return titleMatch || statusMatch;
    });
  }, [videos, searchQuery]);

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const getSortedVideos = () => {
    if (!sortField) return filteredVideos;

    return [...filteredVideos].sort((a, b) => {
      let aValue = a[sortField];
      let bValue = b[sortField];

      if (sortField === 'producer') {
        aValue = (a.User || a.Producer)?.first_name || '';
        bValue = (b.User || b.Producer)?.first_name || '';
      }

      if (typeof aValue === 'string') {
        aValue = aValue.toLowerCase();
        bValue = bValue.toLowerCase();
      }

      if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });
  };

  // First sort all videos, THEN paginate
  const sortedVideos = getSortedVideos();

  // Apply pagination to sorted videos
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const displayVideos = showPagination 
    ? sortedVideos.slice(startIndex, endIndex)
    : sortedVideos;

  const SortIcon = ({ field }) => {
    if (sortField !== field) {
      return (
        <svg className="w-2.5 h-2.5 sm:w-3 sm:h-3 ml-1 text-gray-500 inline flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l-4-4m4 4l4-4" />
        </svg>
      );
    }
    return (
      <svg className={`w-2.5 h-2.5 sm:w-3 sm:h-3 ml-1 inline flex-shrink-0 ${sortDirection === 'asc' ? 'text-blue-400' : 'text-blue-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={sortDirection === 'asc' ? "M5 15l7-7 7 7" : "M19 9l-7 7-7-7"} />
      </svg>
    );
  };

  if (videos.length === 0) {
    return (
      <section className="bg-gradient-to-br from-[#1a1c20]/60 to-[#0f1114]/60 backdrop-blur-xl border border-white/10 rounded-xl p-3 sm:p-4 shadow-xl shadow-black/30 transition-all duration-300">
        <div className="flex flex-col items-center justify-center h-48">
          <svg className="w-10 h-10 sm:w-12 sm:h-12 text-gray-600 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
          </svg>
          <p className="text-gray-400 text-sm">Aucune vidéo trouvée</p>
          <p className="text-gray-500 text-xs mt-1 text-center">Les vidéos uploadées apparaîtront ici</p>
        </div>
      </section>
    );
  }

  return (
    <>
      <section className="bg-gradient-to-br from-[#1a1c20]/60 to-[#0f1114]/60 backdrop-blur-xl border border-white/10 rounded-xl p-3 sm:p-4 shadow-xl shadow-black/30 transition-all duration-300">
        {/* Header with title and count */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-4">
          <div>
            <h2 className="text-base sm:text-lg font-semibold text-white">Gestion des vidéos</h2>
            <p className="text-[10px] sm:text-xs text-gray-400 mt-1">
              {videos.length} vidéo{videos.length !== 1 ? 's' : ''} au total
            </p>
          </div>
          
          {/* Search Bar */}
          <SearchBar
            value={searchQuery}
            onChange={handleSearchChange}
            placeholder="Titre, statut..."
            className="w-full sm:w-60"
          />
        </div>

        {filteredVideos.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-36">
            <svg className="w-8 h-8 text-gray-600 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" />
            </svg>
            <p className="text-gray-400 text-sm">Aucun résultat pour "{searchQuery}"</p>
          </div>
        ) : (
          <>
            {/* Results count and sort options */}
            <div className="flex items-center justify-between mb-3">
              <p className="text-[10px] sm:text-xs text-gray-400">
                {searchQuery
                  ? `${filteredVideos.length} résultat${filteredVideos.length !== 1 ? "s" : ""} pour "${searchQuery}"`
                 : `${displayVideos.length} vidéo${displayVideos.length !== 1 ? "s" : ""} affichée${displayVideos.length !== 1 ? "s" : ""} sur ${filteredVideos.length}`}
              </p>
              
              {/* Sort buttons */}
              <div className="flex items-center gap-1">
                <span className="text-[10px] text-gray-500 mr-1">Trier par:</span>
                <button
                  onClick={() => handleSort('title')}
                  className={`px-2 py-1 rounded text-[10px] flex items-center gap-1 ${
                    sortField === 'title' 
                      ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30' 
                      : 'text-gray-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  Titre <SortIcon field="title" />
                </button>
                <button
                  onClick={() => handleSort('selection_status')}
                  className={`px-2 py-1 rounded text-[10px] flex items-center gap-1 ${
                    sortField === 'selection_status' 
                      ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30' 
                      : 'text-gray-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  Statut <SortIcon field="selection_status" />
                </button>
                <button
                  onClick={() => handleSort('duration')}
                  className={`px-2 py-1 rounded text-[10px] flex items-center gap-1 ${
                    sortField === 'duration' 
                      ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30' 
                      : 'text-gray-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  Durée <SortIcon field="duration" />
                </button>
              </div>
            </div>

            {/* Table */}
            <div className="border border-white/10 rounded-lg overflow-hidden bg-black/30 backdrop-blur-sm">
              <div className="overflow-x-auto scrollbar-thin-dark">
                <table className="w-full text-xs sm:text-sm">
                  <thead className="bg-gray-900/70">
                    <tr>
                      <th className="px-2 sm:px-3 py-2 text-left text-[10px] sm:text-xs font-medium text-gray-300 uppercase border-b border-white/10">
                        <div className="flex items-center whitespace-nowrap">
                          Titre
                        </div>
                      </th>
                      <th className="px-2 sm:px-3 py-2 text-left text-[10px] sm:text-xs font-medium text-gray-300 uppercase border-b border-white/10 hidden md:table-cell">
                        Producteur
                      </th>
                      <th className="px-2 sm:px-3 py-2 text-left text-[10px] sm:text-xs font-medium text-gray-300 uppercase border-b border-white/10 hidden sm:table-cell">
                        Durée
                      </th>
                      <th className="px-2 sm:px-3 py-2 text-left text-[10px] sm:text-xs font-medium text-gray-300 uppercase border-b border-white/10">
                        Statut
                      </th>
                      <th className="px-2 sm:px-3 py-2 text-left text-[10px] sm:text-xs font-medium text-gray-300 uppercase border-b border-white/10 hidden lg:table-cell">
                        Catégories
                      </th>
                      <th className="px-2 sm:px-3 py-2 text-left text-[10px] sm:text-xs font-medium text-gray-300 uppercase border-b border-white/10 hidden lg:table-cell">
                        Jurys
                      </th>
                      <th className="px-2 sm:px-3 py-2 text-right text-[10px] sm:text-xs font-medium text-gray-300 uppercase border-b border-white/10 w-16 sm:w-20">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {displayVideos.map((movie) => (
                      <tr 
                        key={movie.id_movie} 
                        className="hover:bg-white/5 transition-colors duration-150 cursor-pointer"
                        onClick={() => onMovieSelect(movie)}
                      >
                        <td className="px-2 sm:px-3 py-2">
                          <div className="flex items-center gap-2">
                            <div className="w-6 h-6 sm:w-8 sm:h-8 bg-gray-800/80 rounded overflow-hidden flex-shrink-0 border border-white/10">
                              {getPoster(movie) ? (
                                <img 
                                  src={getPoster(movie)} 
                                  alt={movie.title} 
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center">
                                  <svg className="w-3 h-3 sm:w-4 sm:h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                                  </svg>
                                </div>
                              )}
                            </div>
                            <span className="text-xs sm:text-sm font-medium text-white truncate max-w-[80px] sm:max-w-none">{movie.title}</span>
                          </div>
                        </td>
                        <td className="px-2 sm:px-3 py-2 text-xs sm:text-sm text-gray-300 hidden md:table-cell">
                          <span className="truncate max-w-[100px] block">
                            {(movie.User || movie.Producer)?.first_name} {(movie.User || movie.Producer)?.last_name}
                          </span>
                        </td>
                        <td className="px-2 sm:px-3 py-2 text-xs sm:text-sm text-gray-300 hidden sm:table-cell">
                          {movie.duration ? `${Math.floor(movie.duration)}min` : '-'}
                        </td>
                        <td className="px-2 sm:px-3 py-2">
                          <span className={`inline-flex px-1.5 sm:px-2 py-1 text-[8px] sm:text-[10px] font-medium rounded-full whitespace-nowrap ${
                            movie.selection_status === 'selected' 
                              ? 'bg-green-500/20 text-green-300 border border-green-500/30' 
                              : movie.selection_status === 'refused'
                                ? 'bg-red-500/20 text-red-300 border border-red-500/30'
                                : 'bg-yellow-500/20 text-yellow-300 border border-yellow-500/30'
                          }`}>
                            {movie.selection_status === 'selected' ? 'Sélectionné' : 
                             movie.selection_status === 'refused' ? 'Refusé' : 'En attente'}
                          </span>
                        </td>
                        <td className="px-2 sm:px-3 py-2 hidden lg:table-cell">
                          <div className="flex flex-wrap gap-1 max-w-[150px]">
                            {(movie.Categories || []).slice(0, 2).map((cat) => (
                              <span 
                                key={cat.id_categorie}
                                className="px-1.5 py-0.5 bg-blue-500/10 border border-blue-500/20 rounded text-[8px] text-blue-300 whitespace-nowrap"
                              >
                                {cat.name}
                              </span>
                            ))}
                            {(movie.Categories || []).length > 2 && (
                              <span className="px-1.5 py-0.5 bg-white/5 border border-white/10 rounded text-[8px] text-gray-400">
                                +{(movie.Categories || []).length - 2}
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="px-2 sm:px-3 py-2 hidden lg:table-cell">
                          <div className="flex flex-wrap gap-1 max-w-[150px]">
                            {(movie.Juries || []).slice(0, 2).map((jury) => (
                              <span 
                                key={jury.id_user}
                                className="px-1.5 py-0.5 bg-purple-500/10 border border-purple-500/20 rounded text-[8px] text-purple-300 whitespace-nowrap"
                              >
                                {jury.first_name}
                              </span>
                            ))}
                            {(movie.Juries || []).length > 2 && (
                              <span className="px-1.5 py-0.5 bg-white/5 border border-white/10 rounded text-[8px] text-gray-400">
                                +{(movie.Juries || []).length - 2}
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="px-2 sm:px-3 py-2 text-right">
                          <div className="flex items-center justify-end gap-1">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                onStatusUpdate(movie.id_movie, "selected");
                              }}
                              className="p-1 sm:p-1.5 bg-green-500/10 text-green-400 rounded hover:bg-green-500/20 border border-green-500/20 transition-colors"
                              title="Approuver"
                            >
                              <svg className="w-3 h-3 sm:w-3.5 sm:h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                              </svg>
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                onStatusUpdate(movie.id_movie, "refused");
                              }}
                              className="p-1 sm:p-1.5 bg-red-500/10 text-red-400 rounded hover:bg-red-500/20 border border-red-500/20 transition-colors"
                              title="Refuser"
                            >
                              <svg className="w-3 h-3 sm:w-3.5 sm:h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                              </svg>
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                if (window.confirm("Supprimer définitivement ce film ?")) {
                                  onDelete(movie.id_movie);
                                }
                              }}
                              className="p-1 sm:p-1.5 bg-gray-700/50 text-gray-400 rounded hover:bg-red-500/20 hover:text-red-400 border border-white/10 hover:border-red-500/30 transition-colors"
                              title="Supprimer"
                            >
                              <svg className="w-3 h-3 sm:w-3.5 sm:h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                              </svg>
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}
        
        {/* Pagination */}
        {showPagination && filteredVideos.length > 0 && (
          <div className="mt-4">
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              itemsPerPage={itemsPerPage}
              onPageChange={onPageChange}
              onItemsPerPageChange={onItemsPerPageChange}
            />
          </div>
        )}
      </section>

      {/* Modal */}
      {selectedMovie && (
        <VideoModal
          movie={selectedMovie}
          onClose={onModalClose}
          categories={categories}
          juries={juries}
          categorySelection={categorySelection}
          onCategoryChange={onCategoryChange}
          onCategorySave={onCategorySave}
          jurySelection={jurySelection}
          onJuryToggle={onJuryToggle}
          onJurySave={onJurySave}
          onStatusUpdate={onStatusUpdate}
          onDelete={onDelete}
          getPoster={getPoster}
          uploadBase={uploadBase}
          isUpdatingCategories={isUpdatingCategories}
          isUpdatingJuries={isUpdatingJuries}
        />
      )}
    </>
  );
}