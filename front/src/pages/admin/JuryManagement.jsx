import { useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getUsers } from "../../api/users.js";
import { getVideos, updateMovieJuries } from "../../api/videos.js";
import { getCategories } from "../../api/videos.js";
import TutorialBox from "../../components/TutorialBox.jsx";
import { useEffect as useEffectReact, useState as useStateReact } from "react";
import { loadTutorialSteps } from "../../utils/tutorialLoader.js";

export default function JuryManagement() {
    const [tutorial, setTutorial] = useStateReact({ title: "Tutoriel", steps: [] });

    useEffectReact(() => {
      async function fetchTutorial() {
        try {
          // Use relative path for fetch
          const tutorialData = await loadTutorialSteps("/src/pages/admin/TutorialJury.fr.md");
          setTutorial(tutorialData);
        } catch (err) {
          setTutorial({ title: "Tutoriel", steps: ["Impossible de charger le tutoriel."] });
        }
      }
      fetchTutorial();
    }, []);
  const queryClient = useQueryClient();
  const [selectedJury, setSelectedJury] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedMovies, setSelectedMovies] = useState([]);
  const [notice, setNotice] = useState(null);
  
  // États pour les modales
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [showUnassignModal, setShowUnassignModal] = useState(false);
  const [modalJury, setModalJury] = useState(null);
  const [selectedToUnassign, setSelectedToUnassign] = useState([]);
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  const { data: usersData } = useQuery({
    queryKey: ["users"],
    queryFn: getUsers,
  });
  
  const { data: videosData } = useQuery({
    queryKey: ["listVideos"],
    queryFn: getVideos,
  });

  const { data: categoriesData } = useQuery({
    queryKey: ["categories"],
    queryFn: getCategories,
  });

  const juries = useMemo(
    () => (usersData?.data || []).filter((user) => user.role === "JURY"),
    [usersData]
  );

  const videos = videosData?.data || [];
  const categories = categoriesData?.data || [];

  const assignJuryMutation = useMutation({
    mutationFn: ({ movieId, juryIds }) => updateMovieJuries(movieId, juryIds),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["listVideos"] });
      setNotice("Assignations mises à jour avec succès.");
      setTimeout(() => setNotice(null), 3000);
      setShowAssignModal(false);
      setSelectedMovies([]);
    },
    onError: () => {
      setNotice("Erreur lors de l'assignation.");
      setTimeout(() => setNotice(null), 3000);
    }
  });

  const unassignJuryMutation = useMutation({
    mutationFn: ({ movieId, juryIds }) => updateMovieJuries(movieId, juryIds),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["listVideos"] });
      setNotice("Désassignations mises à jour avec succès.");
      setTimeout(() => setNotice(null), 3000);
      setShowUnassignModal(false);
      setSelectedToUnassign([]);
      setShowConfirmModal(false);
    },
    onError: () => {
      setNotice("Erreur lors de la désassignation.");
      setTimeout(() => setNotice(null), 3000);
    }
  });

  const filteredMovies = useMemo(() => {
    if (selectedCategory === "all") return videos;
    return videos.filter((movie) =>
      (movie.Categories || []).some((cat) => cat.id_categorie === parseInt(selectedCategory))
    );
  }, [videos, selectedCategory]);

  const handleToggleMovie = (movieId) => {
    setSelectedMovies((prev) =>
      prev.includes(movieId)
        ? prev.filter((id) => id !== movieId)
        : [...prev, movieId]
    );
  };

  const handleSelectAll = () => {
    if (selectedMovies.length === filteredMovies.length) {
      setSelectedMovies([]);
    } else {
      setSelectedMovies(filteredMovies.map((m) => m.id_movie));
    }
  };

  const handleJuryClick = (jury) => {
    setModalJury(jury);
    
    // Si des films sont sélectionnés → mode assignation
    if (selectedMovies.length > 0) {
      setShowAssignModal(true);
    } else {
      // Sinon → mode retrait (afficher les films assignés à ce jury)
      setSelectedToUnassign([]);
      setShowUnassignModal(true);
    }
  };

  const handleAssignConfirm = () => {
    selectedMovies.forEach((movieId) => {
      const movie = videos.find((m) => m.id_movie === movieId);
      const currentJuries = (movie?.Juries || []).map((j) => j.id_user);
      
      if (!currentJuries.includes(modalJury.id_user)) {
        assignJuryMutation.mutate({
          movieId,
          juryIds: [...currentJuries, modalJury.id_user]
        });
      }
    });
  };

  const handleUnassignConfirm = () => {
    setShowConfirmModal(true);
  };

  const handleUnassignFinal = () => {
    selectedToUnassign.forEach((movieId) => {
      const movie = videos.find((m) => m.id_movie === movieId);
      const currentJuries = (movie?.Juries || []).map((j) => j.id_user);
      
      unassignJuryMutation.mutate({
        movieId,
        juryIds: currentJuries.filter((id) => id !== modalJury.id_user)
      });
    });
  };

  const toggleToUnassign = (movieId) => {
    setSelectedToUnassign((prev) =>
      prev.includes(movieId)
        ? prev.filter((id) => id !== movieId)
        : [...prev, movieId]
    );
  };

  const selectAllToUnassign = (movies) => {
    if (selectedToUnassign.length === movies.length) {
      setSelectedToUnassign([]);
    } else {
      setSelectedToUnassign(movies.map((m) => m.id_movie));
    }
  };

  const uploadBase = "http://localhost:3000/uploads";
  const getPoster = (movie) => (
    movie.thumbnail
      ? `${uploadBase}/${movie.thumbnail}`
      : movie.display_picture
        ? `${uploadBase}/${movie.display_picture}`
        : movie.picture1
          ? `${uploadBase}/${movie.picture1}`
          : null
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a0c0f] to-[#0d0f12] text-white pt-1 pb-12 px-1">
      <div className="max-w-7xl mx-auto space-y-4">

        {/* Header */}
        <div className="text-center">
          <h1 className="text-2xl md:text-3xl font-light bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent">
            Distribution & Jury
          </h1>
          <p className="text-white/40 text-xs mt-1">Assignez les films aux jurys pour la votation</p>
        </div>

        <TutorialBox title={tutorial.title} steps={tutorial.steps} defaultOpen={true} />

        {/* Notice */}
        {notice && (
          <div className={`p-3 rounded-lg text-xs ${
            notice.includes("succès") 
              ? "bg-green-500/10 border border-green-500/30 text-green-300" 
              : "bg-red-500/10 border border-red-500/30 text-red-300"
          }`}>
            {notice}
          </div>
        )}

        {/* Selected count indicator */}
        {selectedMovies.length > 0 && (
          <div className="bg-purple-500/10 border border-purple-500/30 rounded-lg p-2 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-xs text-white/80">{selectedMovies.length} film{selectedMovies.length !== 1 ? 's' : ''} sélectionné{selectedMovies.length !== 1 ? 's' : ''}</span>
            </div>
            <button
              onClick={() => setSelectedMovies([])}
              className="text-[10px] text-white/40 hover:text-white transition-colors"
            >
              Désélectionner tout
            </button>
          </div>
        )}

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
          
          {/* Left Column - Juries */}
          <div className="lg:col-span-1 space-y-4">
            
            {/* Juries List */}
            <div className="bg-[#1a1c20] border border-white/10 rounded-lg p-3">
              <div className="flex items-center gap-2 mb-3">
                <svg className="w-4 h-4 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
                <h2 className="text-sm font-medium text-white/90">Jurys</h2>
                <span className="ml-1 text-[10px] bg-white/10 px-1.5 py-0.5 rounded-full text-white/60">
                  {juries.length}
                </span>
              </div>

              {juries.length === 0 ? (
                <p className="text-xs text-white/40 text-center py-4">Aucun jury disponible</p>
              ) : (
                <div className="space-y-1.5 max-h-[400px] overflow-y-auto scrollbar-thin-dark pr-1 pl-1">
                  {juries.map((jury) => {
                    const assignedCount = videos.filter((m) =>
                      (m.Juries || []).some((j) => j.id_user === jury.id_user)
                    ).length;

                    return (
                      <button
                        key={jury.id_user}
                        onClick={() => handleJuryClick(jury)}
                        className={`w-full text-left p-2.5 rounded-lg border transition-colors bg-black/40 border-white/10 hover:bg-white/5 ${
                          selectedMovies.length > 0 ? "cursor-pointer" : ""
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center text-white font-semibold text-xs flex-shrink-0">
                            {jury.first_name?.[0]}{jury.last_name?.[0]}
                          </div>
                          <div className="flex-1 min-w-0">
                            <h3 className="text-xs font-medium text-white truncate">
                              {jury.first_name} {jury.last_name}
                            </h3>
                            <p className="text-[9px] text-white/40 truncate">{jury.email}</p>
                            <p className="text-[9px] text-purple-400 mt-0.5">
                              {assignedCount} film{assignedCount !== 1 ? 's' : ''}
                            </p>
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          {/* Right Column - Movies - MODERN LIST VIEW */}
          <div className="lg:col-span-3">
            <div className="bg-[#1a1c20] border border-white/10 rounded-lg p-4">
              
              {/* Filters Bar */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
                <div className="flex items-center gap-2">
                  <svg className="w-4 h-4 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 4v16M17 4v16M3 8h4m10 0h4M3 12h18M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z" />
                  </svg>
                  <h2 className="text-sm font-medium text-white/90">Films disponibles</h2>
                  <span className="text-[10px] bg-white/10 px-1.5 py-0.5 rounded-full text-white/60">
                    {filteredMovies.length}
                  </span>
                </div>
                
                <div className="flex items-center gap-2">
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="bg-black/40 border border-white/10 text-white px-2 py-1.5 text-xs rounded-lg focus:outline-none focus:ring-1 focus:ring-purple-500/30"
                  >
                    <option value="all" className="bg-[#1a1c20]">Toutes les catégories</option>
                    {categories.map((cat) => (
                      <option key={cat.id_categorie} value={cat.id_categorie} className="bg-[#1a1c20]">
                        {cat.name}
                      </option>
                    ))}
                  </select>
                  
                  <button
                    onClick={handleSelectAll}
                    className="px-3 py-1.5 bg-white/5 border border-white/10 text-white/80 text-xs rounded-lg hover:bg-white/10 transition-colors"
                  >
                    {selectedMovies.length === filteredMovies.length ? "Désélectionner" : "Tout sélectionner"}
                  </button>
                </div>
              </div>

              {/* Movies List - MODERN SCROLLABLE LIST */}
              {filteredMovies.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 bg-black/30 rounded-lg">
                  <svg className="w-12 h-12 text-white/20 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 4v16M17 4v16M3 8h4m10 0h4M3 12h18M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z" />
                  </svg>
                  <p className="text-xs text-white/40">Aucun film disponible</p>
                </div>
              ) : (
                <div className="space-y-1.5 max-h-[400px] overflow-y-auto scrollbar-thin-dark">
                  {filteredMovies.map((movie) => {
                    const poster = getPoster(movie);
                    const isSelected = selectedMovies.includes(movie.id_movie);
                    const assignedJuries = movie.Juries || [];

                    return (
                      <div
                        key={movie.id_movie}
                        onClick={() => handleToggleMovie(movie.id_movie)}
                        className={`flex items-center gap-3 p-2 rounded-lg border cursor-pointer transition-all ${
                          isSelected 
                            ? 'bg-purple-500/10 border-purple-500/30' 
                            : 'bg-black/40 border-white/10 hover:bg-white/5 hover:border-white/20'
                        }`}
                      >
                        {/* Checkbox */}
                        <div className="flex items-center justify-center">
                          <div className={`w-5 h-5 rounded-md border flex items-center justify-center transition-colors ${
                            isSelected 
                              ? 'bg-purple-500 border-purple-500' 
                              : 'border-white/20 bg-transparent'
                          }`}>
                            {isSelected && (
                              <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                              </svg>
                            )}
                          </div>
                        </div>

                        {/* Mini poster */}
                        <div className="w-8 h-8 bg-gradient-to-br from-gray-800 to-gray-900 rounded-md overflow-hidden flex-shrink-0">
                          {poster ? (
                            <img
                              src={poster}
                              alt={movie.title}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                              </svg>
                            </div>
                          )}
                        </div>

                        {/* Title */}
                        <div className="flex-1 min-w-0">
                          <p className="text-sm text-white font-medium truncate">{movie.title}</p>
                          <div className="flex items-center gap-2 mt-0.5">
                            {/* Categories */}
                            <div className="flex flex-wrap gap-1">
                              {(movie.Categories || []).slice(0, 2).map((cat) => (
                                <span
                                  key={cat.id_categorie}
                                  className="px-1.5 py-0.5 bg-purple-500/10 border border-purple-500/20 rounded-full text-[8px] text-purple-300"
                                >
                                  {cat.name}
                                </span>
                              ))}
                              {(movie.Categories || []).length > 2 && (
                                <span className="px-1.5 py-0.5 bg-white/5 border border-white/10 rounded-full text-[8px] text-white/40">
                                  +{(movie.Categories || []).length - 2}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* Juries count */}
                        <div className="flex items-center gap-1 px-2 py-1 bg-black/40 rounded-md border border-white/10">
                          <svg className="w-3 h-3 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                          </svg>
                          <span className="text-[10px] text-white/60">{assignedJuries.length}</span>
                        </div>

                        {/* Status badge */}
                        <div className={`px-2 py-1 rounded-md text-[8px] font-medium border ${
                          movie.selection_status === 'selected' 
                            ? 'bg-green-500/10 text-green-300 border-green-500/30' 
                            : movie.selection_status === 'refused'
                              ? 'bg-red-500/10 text-red-300 border-red-500/30'
                              : 'bg-yellow-500/10 text-yellow-300 border-yellow-500/30'
                        }`}>
                          {movie.selection_status === 'selected' ? 'Sélectionné' : 
                           movie.selection_status === 'refused' ? 'Refusé' : 'En attente'}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* MODAL 1 - Assignation (simple) - MODERN STYLE */}
      {showAssignModal && modalJury && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-gradient-to-br from-[#1a1c20] to-[#0f1114] border border-white/10 rounded-xl w-full max-w-sm shadow-xl shadow-black/50">
            
            <div className="p-5">
              {/* Header with close button */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center text-white font-semibold text-xs flex-shrink-0">
                    {modalJury.first_name?.[0]}{modalJury.last_name?.[0]}
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-white">
                      {modalJury.first_name} {modalJury.last_name}
                    </h3>
                    <p className="text-[9px] text-white/40">{modalJury.email}</p>
                  </div>
                </div>
                <button
                  onClick={() => setShowAssignModal(false)}
                  className="p-1 hover:bg-white/10 rounded-md transition-colors"
                >
                  <svg className="w-4 h-4 text-white/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Info */}
              <div className="mb-5 text-center">
                <p className="text-white/60 text-xs mb-1">
                  Vous allez assigner
                </p>
                <p className="text-2xl font-bold text-purple-400">
                  {selectedMovies.length}
                </p>
                <p className="text-white/60 text-[10px] mt-1">
                  film{selectedMovies.length !== 1 ? 's' : ''} à ce jury
                </p>
              </div>

              {/* Actions */}
              <div className="flex flex-col gap-2">
                <button
                  onClick={handleAssignConfirm}
                  className="w-full px-3 py-2 bg-purple-600 text-white text-xs rounded-lg hover:bg-purple-700 transition-colors font-medium"
                >
                  Assigner
                </button>
                <button
                  onClick={() => setShowAssignModal(false)}
                  className="w-full px-3 py-2 bg-white/5 border border-white/10 text-white/80 text-xs rounded-lg hover:bg-white/10 transition-colors"
                >
                  Annuler
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 2 - Retrait (liste des films assignés) - MODERN STYLE */}
      {showUnassignModal && modalJury && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-gradient-to-br from-[#1a1c20] to-[#0f1114] border border-white/10 rounded-xl w-full max-w-md shadow-xl shadow-black/50">
            
            <div className="p-4">
              {/* Header with close button */}
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center text-white font-semibold text-xs flex-shrink-0">
                    {modalJury.first_name?.[0]}{modalJury.last_name?.[0]}
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-white">
                      {modalJury.first_name} {modalJury.last_name}
                    </h3>
                    <p className="text-[9px] text-white/40">Films assignés</p>
                  </div>
                </div>
                <button
                  onClick={() => setShowUnassignModal(false)}
                  className="p-1 hover:bg-white/10 rounded-md transition-colors"
                >
                  <svg className="w-4 h-4 text-white/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Liste des films assignés */}
              {videos.filter(m => (m.Juries || []).some(j => j.id_user === modalJury.id_user)).length === 0 ? (
                <div className="text-center py-8">
                  <div className="mx-auto w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center mb-3">
                    <svg className="w-6 h-6 text-white/30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 4v16M17 4v16M3 8h4m10 0h4M3 12h18M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z" />
                    </svg>
                  </div>
                  <p className="text-xs text-white/40">Aucun film assigné à ce jury</p>
                </div>
              ) : (
                <>
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-[10px] text-white/60">
                      {selectedToUnassign.length} sélectionné{selectedToUnassign.length !== 1 ? 's' : ''}
                    </p>
                    <button
                      onClick={() => {
                        const assignedMovies = videos.filter(m => 
                          (m.Juries || []).some(j => j.id_user === modalJury.id_user)
                        );
                        if (selectedToUnassign.length === assignedMovies.length) {
                          setSelectedToUnassign([]);
                        } else {
                          setSelectedToUnassign(assignedMovies.map((m) => m.id_movie));
                        }
                      }}
                      className="text-[9px] text-purple-400 hover:text-purple-300 transition-colors"
                    >
                      {selectedToUnassign.length === videos.filter(m => (m.Juries || []).some(j => j.id_user === modalJury.id_user)).length 
                        ? "Tout désélectionner" 
                        : "Tout sélectionner"}
                    </button>
                  </div>

                  <div className="space-y-1 max-h-60 overflow-y-auto scrollbar-thin-dark mb-4">
                    {videos
                      .filter(m => (m.Juries || []).some(j => j.id_user === modalJury.id_user))
                      .map((movie) => {
                        const poster = getPoster(movie);
                        const isSelected = selectedToUnassign.includes(movie.id_movie);
                        
                        return (
                          <div
                            key={movie.id_movie}
                            onClick={() => toggleToUnassign(movie.id_movie)}
                            className={`flex items-center gap-2 p-2 rounded-lg border cursor-pointer transition-all ${
                              isSelected 
                                ? 'bg-purple-500/10 border-purple-500/30' 
                                : 'bg-black/40 border-white/10 hover:bg-white/5 hover:border-white/20'
                            }`}
                          >
                            {/* Custom checkbox */}
                            <div className={`w-4 h-4 rounded-md border flex items-center justify-center transition-colors ${
                              isSelected 
                                ? 'bg-purple-500 border-purple-500' 
                                : 'border-white/20 bg-transparent'
                            }`}>
                              {isSelected && (
                                <svg className="w-2.5 h-2.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                              )}
                            </div>
                            
                            {/* Mini poster */}
                            <div className="w-6 h-6 bg-gradient-to-br from-gray-800 to-gray-900 rounded overflow-hidden flex-shrink-0">
                              {poster ? (
                                <img
                                  src={poster}
                                  alt={movie.title}
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center">
                                  <svg className="w-3 h-3 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                  </svg>
                                </div>
                              )}
                            </div>
                            
                            {/* Title */}
                            <div className="flex-1 min-w-0">
                              <p className="text-xs text-white font-medium truncate">{movie.title}</p>
                              <div className="flex items-center gap-1 mt-0.5">
                                {(movie.Categories || []).slice(0, 1).map((cat) => (
                                  <span
                                    key={cat.id_categorie}
                                    className="text-[7px] text-purple-300"
                                  >
                                    {cat.name}
                                  </span>
                                ))}
                              </div>
                            </div>
                          </div>
                        );
                      })}
                  </div>

                  {/* Actions */}
                  <div className="flex flex-col gap-2">
                    <button
                      onClick={handleUnassignConfirm}
                      disabled={selectedToUnassign.length === 0}
                      className="w-full px-3 py-2 bg-red-600 text-white text-xs rounded-lg hover:bg-red-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Retirer {selectedToUnassign.length} film{selectedToUnassign.length !== 1 ? 's' : ''}
                    </button>
                    <button
                      onClick={() => setShowUnassignModal(false)}
                      className="w-full px-3 py-2 bg-white/5 border border-white/10 text-white/80 text-xs rounded-lg hover:bg-white/10 transition-colors"
                    >
                      Annuler
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* MODAL 3 - Confirmation de retrait */}
      {showConfirmModal && (
        <div className="fixed inset-0 z-[60] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-gradient-to-br from-[#1a1c20] to-[#0f1114] border border-white/10 rounded-xl w-full max-w-sm shadow-xl shadow-black/50">
            
            <div className="p-5">
              <div className="text-center mb-4">
                <div className="mx-auto w-10 h-10 rounded-full bg-red-500/20 border border-red-500/30 flex items-center justify-center mb-3">
                  <svg className="w-5 h-5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.142 16.5c-.77.833.192 2.5 1.732 2.5z" />
                  </svg>
                </div>
                <h3 className="text-sm font-semibold text-white mb-1">Confirmer le retrait</h3>
                <p className="text-xs text-white/60">
                  Retirer {selectedToUnassign.length} film{selectedToUnassign.length !== 1 ? 's' : ''} de {modalJury?.first_name} ?
                </p>
              </div>

              <div className="flex flex-col gap-2">
                <button
                  onClick={handleUnassignFinal}
                  className="w-full px-3 py-2 bg-red-600 text-white text-xs rounded-lg hover:bg-red-700 transition-colors font-medium"
                >
                  Oui, retirer
                </button>
                <button
                  onClick={() => setShowConfirmModal(false)}
                  className="w-full px-3 py-2 bg-white/5 border border-white/10 text-white/80 text-xs rounded-lg hover:bg-white/10 transition-colors"
                >
                  Annuler
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}