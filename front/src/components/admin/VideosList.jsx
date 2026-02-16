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

//   const displayVideos = getSortedVideos();

//   const SortIcon = ({ field }) => {
//     if (sortField !== field) return <span className="ml-1 text-gray-500">↕️</span>;
//     return <span className="ml-1">{sortDirection === 'asc' ? '↑' : '↓'}</span>;
//   };

//   if (videos.length === 0) {
//     return <div className="text-gray-400">Aucune vidéo trouvée.</div>;
//   }

//   return (
//     <>
//       <div className="bg-gray-950 border border-gray-800 rounded-xl overflow-hidden">
//         <div className="overflow-x-auto">
//           <table className="w-full text-sm">
//             <thead className="bg-gray-900/50 border-b border-gray-800">
//               <tr>
//                 <th 
//                   className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider cursor-pointer hover:text-white"
//                   onClick={() => handleSort('title')}
//                 >
//                   Titre <SortIcon field="title" />
//                 </th>
//                 <th 
//                   className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider cursor-pointer hover:text-white"
//                   onClick={() => handleSort('producer')}
//                 >
//                   Producteur <SortIcon field="producer" />
//                 </th>
//                 <th 
//                   className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider cursor-pointer hover:text-white"
//                   onClick={() => handleSort('duration')}
//                 >
//                   Durée <SortIcon field="duration" />
//                 </th>
//                 <th 
//                   className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider cursor-pointer hover:text-white"
//                   onClick={() => handleSort('main_language')}
//                 >
//                   Langue <SortIcon field="main_language" />
//                 </th>
//                 <th 
//                   className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider cursor-pointer hover:text-white"
//                   onClick={() => handleSort('nationality')}
//                 >
//                   Nationalité <SortIcon field="nationality" />
//                 </th>
//                 <th 
//                   className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider cursor-pointer hover:text-white"
//                   onClick={() => handleSort('selection_status')}
//                 >
//                   Statut <SortIcon field="selection_status" />
//                 </th>
//                 <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
//                   Catégories
//                 </th>
//                 <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
//                   Jurys
//                 </th>
//                 <th className="px-4 py-3 text-right text-xs font-medium text-gray-400 uppercase tracking-wider">
//                   Actions
//                 </th>
//               </tr>
//             </thead>
//             <tbody className="divide-y divide-gray-800">
//               {displayVideos.map((movie) => (
//                 <tr 
//                   key={movie.id_movie} 
//                   className="hover:bg-gray-900/50 transition cursor-pointer"
//                   onClick={() => onMovieSelect(movie)}
//                 >
//                   <td className="px-4 py-3">
//                     <div className="flex items-center gap-3">
//                       <div className="w-10 h-10 bg-gray-800 rounded overflow-hidden flex-shrink-0">
//                         {getPoster(movie) ? (
//                           <img 
//                             src={getPoster(movie)} 
//                             alt={movie.title} 
//                             className="w-full h-full object-cover"
//                           />
//                         ) : (
//                           <div className="w-full h-full flex items-center justify-center text-gray-600 text-xs">
//                             🎬
//                           </div>
//                         )}
//                       </div>
//                       <span className="font-medium text-white">{movie.title}</span>
//                     </div>
//                   </td>
//                   <td className="px-4 py-3 text-gray-300">
//                     {(movie.User || movie.Producer)?.first_name} {(movie.User || movie.Producer)?.last_name}
//                   </td>
//                   <td className="px-4 py-3 text-gray-300">
//                     {movie.duration ? `${movie.duration}s` : '-'}
//                   </td>
//                   <td className="px-4 py-3 text-gray-300">
//                     {movie.main_language || '-'}
//                   </td>
//                   <td className="px-4 py-3 text-gray-300">
//                     {movie.nationality || '-'}
//                   </td>
//                   <td className="px-4 py-3">
//                     <span className={`inline-flex px-2 py-1 text-xs rounded-full ${
//                       movie.selection_status === 'selected' 
//                         ? 'bg-green-500/20 text-green-400' 
//                         : movie.selection_status === 'refused'
//                           ? 'bg-red-500/20 text-red-400'
//                           : 'bg-yellow-500/20 text-yellow-400'
//                     }`}>
//                       {movie.selection_status || 'submitted'}
//                     </span>
//                   </td>
//                   <td className="px-4 py-3">
//                     <div className="flex flex-wrap gap-1">
//                       {(movie.Categories || []).map((cat) => (
//                         <span 
//                           key={cat.id_categorie}
//                           className="px-2 py-1 bg-gray-800 rounded text-xs text-gray-300"
//                         >
//                           {cat.name}
//                         </span>
//                       ))}
//                     </div>
//                   </td>
//                   <td className="px-4 py-3">
//                     <div className="flex flex-wrap gap-1">
//                       {(movie.Juries || []).slice(0, 2).map((jury) => (
//                         <span 
//                           key={jury.id_user}
//                           className="px-2 py-1 bg-purple-500/10 text-purple-400 rounded text-xs"
//                         >
//                           {jury.first_name} {jury.last_name}
//                         </span>
//                       ))}
//                       {(movie.Juries || []).length > 2 && (
//                         <span className="px-2 py-1 bg-gray-800 rounded text-xs text-gray-400">
//                           +{(movie.Juries || []).length - 2}
//                         </span>
//                       )}
//                     </div>
//                   </td>
//                   <td className="px-4 py-3 text-right">
//                     <div className="flex items-center justify-end gap-2">
//                       <button
//                         onClick={(e) => {
//                           e.stopPropagation();
//                           onStatusUpdate(movie.id_movie, "selected");
//                         }}
//                         className="p-1.5 bg-green-600/20 text-green-400 rounded hover:bg-green-600/40"
//                         title="Approuver"
//                       >
//                         ✓
//                       </button>
//                       <button
//                         onClick={(e) => {
//                           e.stopPropagation();
//                           onStatusUpdate(movie.id_movie, "refused");
//                         }}
//                         className="p-1.5 bg-red-600/20 text-red-400 rounded hover:bg-red-600/40"
//                         title="Refuser"
//                       >
//                         ✗
//                       </button>
//                       <button
//                         onClick={(e) => {
//                           e.stopPropagation();
//                           if (window.confirm("Supprimer définitivement ce film ?")) {
//                             onDelete(movie.id_movie);
//                           }
//                         }}
//                         className="p-1.5 bg-gray-800 text-gray-400 rounded hover:bg-gray-700"
//                         title="Supprimer"
//                       >
//                         🗑️
//                       </button>
//                     </div>
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
        
//         {showPagination && (
//           <div className="px-4 py-3 border-t border-gray-800">
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




import { useState } from "react";
import { VideoModal } from "../VideoModal.jsx";
import Pagination from "../../components/admin/Pagination.jsx";

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

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const getSortedVideos = () => {
    if (!sortField) return videos;

    return [...videos].sort((a, b) => {
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
        <svg className="w-3 h-3 ml-1 text-gray-500 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l-4-4m4 4l4-4" />
        </svg>
      );
    }
    return (
      <svg className={`w-3 h-3 ml-1 inline ${sortDirection === 'asc' ? 'text-blue-400' : 'text-blue-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={sortDirection === 'asc' ? "M5 15l7-7 7 7" : "M19 9l-7 7-7-7"} />
      </svg>
    );
  };

  if (videos.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-48 bg-[#1a1c20]/60 border border-white/10 rounded-lg p-6">
        <svg className="w-12 h-12 text-gray-600 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
        </svg>
        <p className="text-gray-400 text-sm">Aucune vidéo trouvée</p>
        <p className="text-gray-500 text-xs mt-1">Les vidéos uploadées apparaîtront ici</p>
      </div>
    );
  }

  return (
    <>
      <div className="bg-gradient-to-br from-[#1a1c20]/60 to-[#0f1114]/60 backdrop-blur-xl border border-white/10 rounded-xl shadow-xl shadow-black/30 transition-all duration-300">
        <div className="overflow-x-auto scrollbar-thin-dark">
          <table className="w-full text-sm">
            <thead className="bg-gray-900/50 border-b border-white/10">
              <tr>
                <th 
                  className="px-3 py-2.5 text-left text-xs font-medium text-gray-400 uppercase tracking-wider cursor-pointer hover:text-white transition-colors"
                  onClick={() => handleSort('title')}
                >
                  <div className="flex items-center">
                    Titre <SortIcon field="title" />
                  </div>
                </th>
                <th 
                  className="px-3 py-2.5 text-left text-xs font-medium text-gray-400 uppercase tracking-wider cursor-pointer hover:text-white transition-colors"
                  onClick={() => handleSort('producer')}
                >
                  <div className="flex items-center">
                    Producteur <SortIcon field="producer" />
                  </div>
                </th>
                <th 
                  className="px-3 py-2.5 text-left text-xs font-medium text-gray-400 uppercase tracking-wider cursor-pointer hover:text-white transition-colors"
                  onClick={() => handleSort('duration')}
                >
                  <div className="flex items-center">
                    Durée <SortIcon field="duration" />
                  </div>
                </th>
                <th 
                  className="px-3 py-2.5 text-left text-xs font-medium text-gray-400 uppercase tracking-wider cursor-pointer hover:text-white transition-colors"
                  onClick={() => handleSort('selection_status')}
                >
                  <div className="flex items-center">
                    Statut <SortIcon field="selection_status" />
                  </div>
                </th>
                <th className="px-3 py-2.5 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Catégories
                </th>
                <th className="px-3 py-2.5 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Jurys
                </th>
                <th className="px-3 py-2.5 text-right text-xs font-medium text-gray-400 uppercase tracking-wider">
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
                  <td className="px-3 py-2.5">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 bg-gray-800/80 rounded overflow-hidden flex-shrink-0 border border-white/10">
                        {getPoster(movie) ? (
                          <img 
                            src={getPoster(movie)} 
                            alt={movie.title} 
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                            </svg>
                          </div>
                        )}
                      </div>
                      <span className="text-sm font-medium text-white">{movie.title}</span>
                    </div>
                  </td>
                  <td className="px-3 py-2.5 text-sm text-gray-300">
                    {(movie.User || movie.Producer)?.first_name} {(movie.User || movie.Producer)?.last_name}
                  </td>
                  <td className="px-3 py-2.5 text-sm text-gray-300">
                    {movie.duration ? `${Math.floor(movie.duration)}min` : '-'}
                  </td>
                  <td className="px-3 py-2.5">
                    <span className={`inline-flex px-2 py-1 text-[10px] font-medium rounded-full ${
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
                  <td className="px-3 py-2.5">
                    <div className="flex flex-wrap gap-1 max-w-[200px]">
                      {(movie.Categories || []).slice(0, 2).map((cat) => (
                        <span 
                          key={cat.id_categorie}
                          className="px-1.5 py-0.5 bg-blue-500/10 border border-blue-500/20 rounded text-[9px] text-blue-300 whitespace-nowrap"
                        >
                          {cat.name}
                        </span>
                      ))}
                      {(movie.Categories || []).length > 2 && (
                        <span className="px-1.5 py-0.5 bg-white/5 border border-white/10 rounded text-[9px] text-gray-400">
                          +{(movie.Categories || []).length - 2}
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-3 py-2.5">
                    <div className="flex flex-wrap gap-1 max-w-[200px]">
                      {(movie.Juries || []).slice(0, 2).map((jury) => (
                        <span 
                          key={jury.id_user}
                          className="px-1.5 py-0.5 bg-purple-500/10 border border-purple-500/20 rounded text-[9px] text-purple-300 whitespace-nowrap"
                        >
                          {jury.first_name}
                        </span>
                      ))}
                      {(movie.Juries || []).length > 2 && (
                        <span className="px-1.5 py-0.5 bg-white/5 border border-white/10 rounded text-[9px] text-gray-400">
                          +{(movie.Juries || []).length - 2}
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-3 py-2.5 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onStatusUpdate(movie.id_movie, "selected");
                        }}
                        className="p-1.5 bg-green-500/10 text-green-400 rounded hover:bg-green-500/20 border border-green-500/20 transition-colors"
                        title="Approuver"
                      >
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onStatusUpdate(movie.id_movie, "refused");
                        }}
                        className="p-1.5 bg-red-500/10 text-red-400 rounded hover:bg-red-500/20 border border-red-500/20 transition-colors"
                        title="Refuser"
                      >
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
                        className="p-1.5 bg-gray-700/50 text-gray-400 rounded hover:bg-red-500/20 hover:text-red-400 border border-white/10 hover:border-red-500/30 transition-colors"
                        title="Supprimer"
                      >
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
        
        {showPagination && (
          <div className="px-3 py-2 border-t border-white/10">
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              itemsPerPage={itemsPerPage}
              onPageChange={onPageChange}
              onItemsPerPageChange={onItemsPerPageChange}
            />
          </div>
        )}
      </div>

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