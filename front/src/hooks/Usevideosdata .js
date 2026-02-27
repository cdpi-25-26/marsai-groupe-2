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
import { UPLOAD_BASE } from "../utils/constants.js";

export function useVideosData() {
  const queryClient = useQueryClient();

  // Récupération des données
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

  // État local pour les sélections
  const [categorySelection, setCategorySelection] = useState({});
  const [jurySelection, setJurySelection] = useState({});
  const [selectedMovie, setSelectedMovie] = useState(null);

  // Initialisation des sélections au chargement des données
  useEffect(() => {
    if (!videosQuery.data?.data) return;
    const initialCategories = {};
    const initialJuries = {};

    videosQuery.data.data.forEach((movie) => {
      initialCategories[movie.id_movie] = (movie.Categories || []).map(
        (cat) => cat.id_categorie
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
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["listVideos"] })
  });

  const categoryMutation = useMutation({
    mutationFn: ({ id, categories }) => updateMovieCategories(id, categories),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["listVideos"] })
  });

  const juryMutation = useMutation({
    mutationFn: ({ id, juryIds }) => updateMovieJuries(id, juryIds),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["listVideos"] })
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => deleteMovie(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["listVideos"] })
  });

  const getPoster = (movie) =>
    movie.thumbnail
      ? `${UPLOAD_BASE}/${movie.thumbnail}`
      : movie.display_picture
        ? `${UPLOAD_BASE}/${movie.display_picture}`
        : movie.picture1
          ? `${UPLOAD_BASE}/${movie.picture1}`
          : null;

  return {
    // Données
    videos: videosQuery.data?.data || [],
    categories,
    juries,
    isLoading: videosQuery.isPending,
    isError: videosQuery.isError,
    error: videosQuery.error,

    // État local
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

    // Utilitaires
    getPoster,
    uploadBase: UPLOAD_BASE,

    // États des mutations
    isUpdatingStatus: statusMutation.isPending,
    isUpdatingCategories: categoryMutation.isPending,
    isUpdatingJuries: juryMutation.isPending,
    isDeleting: deleteMutation.isPending
  };
}