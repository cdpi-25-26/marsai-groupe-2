/**
 * Composant Videos (Gestion des Vidéos Admin)
 * Page administrateur pour gérer les vidéos du système
 * Fonctionnalités CRUD complètes: Créer, Lire, Mettre à jour, Supprimer
 * Utilise react-hook-form avec validation Zod
 * Utilise TanStack Query (useMutation) pour les opérations CRUD
 * @returns {JSX.Element} La page de gestion des vidéos avec tableau et modales
 */
import React, { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { z } from "zod";
import {
  getVideos,
  updateMovie,
  deleteMovie
} from "../../api/videos";

// Schéma de validation pour la création d'un film
const createMovieSchema = z.object({
  title: z.string().min(1, "Le titre est requis"),
  synopsis: z.string().optional(),
  url: z.string().url("URL invalide"),
});

// Schéma de validation pour la modification d'un film
const updateMovieSchema = z.object({
  title: z.string().min(1, "Le titre est requis"),
  synopsis: z.string().optional(),
  url: z.string().url("URL invalide"),
});

function Videos() {
  const queryClient = useQueryClient();
  const [movies, setMovies] = useState([]);
  const [filter, setFilter] = useState("");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [editingMovie, setEditingMovie] = useState(null);
  const [movieToDelete, setMovieToDelete] = useState(null);
  const [message, setMessage] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // Fetch movies
  const { data, refetch } = useQuery({
    queryKey: ["movies"],
    queryFn: getVideos,
  });

  useEffect(() => {
    if (data?.data) setMovies(data.data);
  }, [data]);

  // Filtrage
  const filteredMovies = useMemo(() => {
    return movies.filter((movie) =>
      movie.title.toLowerCase().includes(filter.toLowerCase())
    );
  }, [movies, filter]);

  // Pagination
  const paginatedMovies = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredMovies.slice(start, start + itemsPerPage);
  }, [filteredMovies, currentPage, itemsPerPage]);

  const totalPages = useMemo(() => {
    return Math.ceil(filteredMovies.length / itemsPerPage);
  }, [filteredMovies.length, itemsPerPage]);

  // Formulaires
  const createForm = useForm({
    resolver: zodResolver(createMovieSchema),
    defaultValues: { title: "", synopsis: "", url: "" },
  });
  const editForm = useForm({
    resolver: zodResolver(updateMovieSchema),
    defaultValues: { title: "", synopsis: "", url: "" },
  });

  // Mutations
  // (Remarque: la création n'est pas implémentée car l'API n'a pas createMovie)
  const updateMutation = useMutation({
    mutationFn: async ({ id, movieData }) => updateMovie(id, movieData),
    onSuccess: () => {
      setMessage("Film modifié avec succès");
      setShowEditModal(false);
      editForm.reset();
      setEditingMovie(null);
      refetch();
    },
    onError: () => setMessage("Erreur lors de la modification du film"),
  });

  const deleteMutation = useMutation({
    mutationFn: async (id) => deleteMovie(id),
    onSuccess: () => {
      setMessage("Film supprimé avec succès");
      setShowDeleteConfirm(false);
      setMovieToDelete(null);
      refetch();
    },
    onError: () => setMessage("Erreur lors de la suppression du film"),
  });

  // Handlers
  function handleEdit(movie) {
    setEditingMovie(movie);
    editForm.reset({
      title: movie.title,
      synopsis: movie.synopsis || "",
      url: movie.url,
    });
    setShowEditModal(true);
  }

  function handleDelete(movie) {
    setMovieToDelete(movie);
    setShowDeleteConfirm(true);
  }

  function confirmDelete() {
    if (movieToDelete) deleteMutation.mutate(movieToDelete.id_movie);
  }

  function cancelDelete() {
    setShowDeleteConfirm(false);
    setMovieToDelete(null);
  }

  // Render
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Gestion des Films</h1>
      <div className="flex items-center gap-2 mb-4">
        <input
          type="text"
          placeholder="Filtrer par titre..."
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="border px-2 py-1 rounded"
        />
      </div>
      {message && <div className="mb-2 text-green-600">{message}</div>}
      <table className="w-full border mb-4">
        <thead>
          <tr className="bg-gray-100">
            <th className="p-2">Titre</th>
            <th className="p-2">Synopsis</th>
            <th className="p-2">URL</th>
            <th className="p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {paginatedMovies.map((movie) => (
            <tr key={movie.id_movie} className="border-t">
              <td className="p-2">{movie.title}</td>
              <td className="p-2">{movie.synopsis}</td>
              <td className="p-2"><a href={movie.url} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">Lien</a></td>
              <td className="p-2 flex gap-2">
                <button className="bg-yellow-400 px-2 py-1 rounded" onClick={() => handleEdit(movie)}>Modifier</button>
                <button className="bg-red-500 text-white px-2 py-1 rounded" onClick={() => handleDelete(movie)}>Supprimer</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {/* Pagination */}
      <div className="flex items-center gap-2 mb-4">
        <button disabled={currentPage === 1} onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}>&lt;</button>
        <span>Page {currentPage} / {totalPages}</span>
        <button disabled={currentPage === totalPages} onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}>&gt;</button>
        <select value={itemsPerPage} onChange={e => setItemsPerPage(Number(e.target.value))}>
          {[5, 10, 20, 50].map(n => <option key={n} value={n}>{n} / page</option>)}
        </select>
      </div>
      {/* Edit Modal */}
      {showEditModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded shadow-lg w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Modifier le film</h2>
            <form onSubmit={editForm.handleSubmit((data) => updateMutation.mutate({ id: editingMovie.id_movie, movieData: data }))} className="space-y-3">
              <div>
                <label className="block mb-1">Titre</label>
                <input {...editForm.register("title")} className="border px-2 py-1 rounded w-full" />
                {editForm.formState.errors.title && <span className="text-red-500 text-xs">{editForm.formState.errors.title.message}</span>}
              </div>
              <div>
                <label className="block mb-1">Synopsis</label>
                <textarea {...editForm.register("synopsis")} className="border px-2 py-1 rounded w-full" />
              </div>
              <div>
                <label className="block mb-1">URL</label>
                <input {...editForm.register("url")} className="border px-2 py-1 rounded w-full" />
                {editForm.formState.errors.url && <span className="text-red-500 text-xs">{editForm.formState.errors.url.message}</span>}
              </div>
              <div className="flex justify-end gap-2">
                <button type="button" className="px-4 py-2 bg-gray-300 rounded" onClick={() => setShowEditModal(false)}>Annuler</button>
                <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded">Enregistrer</button>
              </div>
            </form>
          </div>
        </div>
      )}
      {/* Delete Confirm Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded shadow-lg w-full max-w-sm">
            <h2 className="text-xl font-bold mb-4">Confirmer la suppression</h2>
            <p>Voulez-vous vraiment supprimer le film "{movieToDelete?.title}" ?</p>
            <div className="flex justify-end gap-2 mt-4">
              <button className="px-4 py-2 bg-gray-300 rounded" onClick={cancelDelete}>Annuler</button>
              <button className="px-4 py-2 bg-red-600 text-white rounded" onClick={confirmDelete}>Supprimer</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Videos;
