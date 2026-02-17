import { useEffect, useState, useMemo } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  getCategories,
  getVideos,
  deleteMovie,
  updateMovieCategories,
  updateMovieJuries,
  updateMovieStatus
} from "../api/videos.js";
import { getUsers } from "../api/users.js";

export function useVideosData() {
  const queryClient = useQueryClient();
  
  // Data fetching
  const videosQuery = useQuery({
    queryKey: ["listVideos"],
    queryFn: getVideos,
  });

  const { data: categoriesData } = useQuery({
    queryKey: ["categories"],
    queryFn: getCategories,
  });

  const { data: usersData } = useQuery({
    queryKey: ["users"],
    queryFn: getUsers,
  });

  const categories = categoriesData?.data || [];
  const juries = useMemo(
    () => (usersData?.data || []).filter((user) => user.role === "JURY"),
    [usersData]
  );

  // State for selections
  const [categorySelection, setCategorySelection] = useState({});
  const [jurySelection, setJurySelection] = useState({});
  const [selectedMovie, setSelectedMovie] = useState(null);

  // Initialize selections when data loads
  useEffect(() => {
    if (!videosQuery.data?.data) return;
    const initialCategories = {};
    const initialJuries = {};

    videosQuery.data.data.forEach((movie) => {
      initialCategories[movie.id_movie] = (movie.Categories || []).map(
        (category) => category.id_categorie
      );
      initialJuries[movie.id_movie] = (movie.Juries || []).map(
        (jury) => jury.id_user
      );
    });

    setCategorySelection(initialCategories);
    setJurySelection(initialJuries);
  }, [videosQuery.data]);

  // Mutations
  const statusMutation = useMutation({
    mutationFn: ({ id, status }) => updateMovieStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["listVideos"] });
    }
  });

  const categoryMutation = useMutation({
    mutationFn: ({ id, categories }) => updateMovieCategories(id, categories),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["listVideos"] });
    }
  });

  const juryMutation = useMutation({
    mutationFn: ({ id, juryIds }) => updateMovieJuries(id, juryIds),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["listVideos"] });
    }
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => deleteMovie(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["listVideos"] });
    }
  });

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

  return {
    // Data
    videos: videosQuery.data?.data || [],
    categories,
    juries,
    isLoading: videosQuery.isPending,
    isError: videosQuery.isError,
    error: videosQuery.error,
    
    // State
    categorySelection,
    setCategorySelection,
    jurySelection,
    setJurySelection,
    selectedMovie,
    setSelectedMovie,
    
    // Actions
    updateStatus: statusMutation.mutate,
    updateCategories: categoryMutation.mutate,
    updateJuries: juryMutation.mutate,
    deleteMovie: deleteMutation.mutate,
    
    // Utilities
    getPoster,
    uploadBase,
    
    // Mutation states (for loading indicators)
    isUpdatingStatus: statusMutation.isPending,
    isUpdatingCategories: categoryMutation.isPending,
    isUpdatingJuries: juryMutation.isPending,
    isDeleting: deleteMutation.isPending
  };
}