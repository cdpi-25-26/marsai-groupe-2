import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getAdminStats } from "../../api/dashboard";
import { useVideosData } from "../../hooks/useVideosData";

import DashboardHero from "../../components/admin/DashboardHero.jsx";
import StatsGrid from "../../components/admin/StatsGrid.jsx";
import VotesChart from "../../components/admin/VotesChart.jsx";
import VoteDistribution from "../../components/admin/VoteDistribution.jsx";
import VideosList from "../../components/admin/VideosList.jsx";

export default function Dashboard() {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // Stats globales depuis le endpoint dédié /admin/dashboard
  // Refresh automatique toutes les 30 secondes
  const { data: stats, isLoading, error } = useQuery({
    queryKey: ["adminStats"],
    queryFn: getAdminStats,
    refetchInterval: 30_000,
    staleTime: 20_000,
  });

  // Hook centralisé pour films, catégories, jurys et leurs mutations
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
    isUpdatingJuries
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
      const exists = current.includes(juryId);
      const next = exists ? current.filter(id => id !== juryId) : [...current, juryId];
      return { ...prev, [movieId]: next };
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

  const handlePageChange = (page) => setCurrentPage(page);

  const handleItemsPerPageChange = (items) => {
    setItemsPerPage(items);
    setCurrentPage(1);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64 sm:h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 sm:h-12 sm:w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-sm sm:text-base text-gray-400">Chargement des statistiques...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64 sm:h-screen">
        <div className="text-center px-4">
          <p className="text-base sm:text-xl text-red-500 mb-2">❌ Erreur de chargement</p>
          <p className="text-xs sm:text-sm text-gray-400 break-words">{error.message}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 sm:space-y-8">
      <DashboardHero />

      <StatsGrid stats={stats} />

      {/* Graphiques côte à côte */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 sm:gap-6">
        <div className="xl:col-span-2">
          <VotesChart votesData={stats?.votes} />
        </div>
        <div>
          <VoteDistribution distribution={stats?.votes?.distribution} total={stats?.votes?.total} />
        </div>
      </div>

      <section className="space-y-3 sm:space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-base sm:text-lg md:text-xl font-bold">Gestion des vidéos</h2>
          <span className="text-xs text-white/40">{videos?.length || 0} films</span>
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
          totalPages={Math.ceil((videos?.length || 0) / itemsPerPage)}
          itemsPerPage={itemsPerPage}
          onPageChange={handlePageChange}
          onItemsPerPageChange={handleItemsPerPageChange}
        />
      </section>
    </div>
  );
}