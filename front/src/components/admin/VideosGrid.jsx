import { VideoModal } from "../VideoModal.jsx";

export default function VideosGrid({ 
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
  isUpdatingJuries
}) {
  if (videos.length === 0) {
    return <div className="text-gray-400">Aucune vidéo trouvée.</div>;
  }

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
        {videos.map((movie) => {
          const poster = getPoster(movie);
          return (
            <button
              type="button"
              key={movie.id_movie}
              onClick={() => onMovieSelect(movie)}
              className="text-left bg-gray-950 border border-gray-800 rounded-xl p-4 hover:border-gray-600 transition"
            >
              <div className="aspect-video bg-gray-800 rounded-lg overflow-hidden">
                {poster ? (
                  <img src={poster} alt={movie.title} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-500 text-sm">
                    Aucune vignette
                  </div>
                )}
              </div>
              <div className="mt-3">
                <h3 className="text-lg font-semibold text-white">{movie.title}</h3>
                <p className="text-sm text-gray-400 mt-1 line-clamp-2">
                  {movie.synopsis || movie.description || "-"}
                </p>
                <div className="mt-2 text-xs text-gray-400 flex flex-wrap gap-3">
                  <span>{movie.duration ? `${movie.duration}s` : "-"}</span>
                  <span>{movie.main_language || "-"}</span>
                  <span>{movie.nationality || "-"}</span>
                  <span>{movie.selection_status || "submitted"}</span>
                </div>
              </div>
            </button>
          );
        })}
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