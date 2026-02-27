/**
 * Composant Categories (Gestion des Catégories)
 * Page admin pour gérer les catégories de films.
 * Utilise le style e i colori della dashboard admin, awards.jsx e users.jsx.
 * Utilise TanStack Query pour CRUD, modale per aggiunta/modifica, layout full-page.
 */
import React, { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { z } from "zod";
import {
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory
} from "../../api/videos";

const categorySchema = z.object({
  name: z.string().min(1, "Le nom est requis"),
});

function Categories() {
  const queryClient = useQueryClient();
  const [showModal, setShowModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [message, setMessage] = useState("");
  const [filter, setFilter] = useState("");

  // Query
  const { data, refetch } = useQuery({
    queryKey: ["categories"],
    queryFn: getCategories,
  });
  const categories = useMemo(() => {
    if (!data?.data) return [];
    return data.data.filter(cat => cat.name.toLowerCase().includes(filter.toLowerCase()));
  }, [data, filter]);

  // Form
  const form = useForm({
    resolver: zodResolver(categorySchema),
    defaultValues: { name: "" },
  });

  // Mutations
  const createMutation = useMutation({
    mutationFn: async (cat) => createCategory(cat.name),
    onSuccess: () => { setMessage("Catégorie ajoutée"); setShowModal(false); form.reset(); refetch(); },
    onError: () => setMessage("Erreur lors de l'ajout"),
  });
  const updateMutation = useMutation({
    mutationFn: async ({ id, name }) => updateCategory(id, name),
    onSuccess: () => { setMessage("Catégorie modifiée"); setShowModal(false); setEditingCategory(null); form.reset(); refetch(); },
    onError: () => setMessage("Erreur lors de la modification"),
  });
  const deleteMutation = useMutation({
    mutationFn: async (id) => deleteCategory(id),
    onSuccess: () => { setMessage("Catégorie supprimée"); refetch(); },
    onError: () => setMessage("Erreur lors de la suppression"),
  });

  // Handlers
  function handleEdit(cat) {
    setEditingCategory(cat);
    form.reset({ name: cat.name });
    setShowModal(true);
  }
  function handleDelete(cat) {
    if (window.confirm("Supprimer cette catégorie ?")) deleteMutation.mutate(cat.id_categorie);
  }
  function handleSubmit(data) {
    if (editingCategory) {
      updateMutation.mutate({ id: editingCategory.id_categorie, name: data.name });
    } else {
      createMutation.mutate(data);
    }
  }
  function handleAdd() {
    setEditingCategory(null);
    form.reset({ name: "" });
    setShowModal(true);
  }

  // Render
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#18181b] to-[#23272f] flex flex-col items-center justify-center p-0">
      <div className="w-full max-w-2xl bg-[#23272f] rounded-2xl shadow-2xl border border-[#2d2d37] p-8 mt-8 mb-8">
        <h1 className="text-3xl font-bold text-white mb-6 text-center">Gestion des Catégories</h1>
        <div className="flex items-center gap-2 mb-6">
          <input
            type="text"
            placeholder="Filtrer par nom..."
            value={filter}
            onChange={e => setFilter(e.target.value)}
            className="bg-[#18181b] border border-[#393950] text-white px-3 py-2 rounded-lg w-full"
          />
          <button
            className="bg-gradient-to-r from-[#AD46FF] to-[#5EEAD4] text-white px-5 py-2 rounded-lg font-semibold shadow hover:opacity-90 transition"
            onClick={handleAdd}
          >
            Ajouter
          </button>
        </div>
        {message && <div className="mb-4 text-green-400 text-center">{message}</div>}
        <table className="w-full text-white rounded-lg overflow-hidden shadow-lg">
          <thead className="bg-[#18181b]">
            <tr>
              <th className="p-3 text-left">Nom</th>
              <th className="p-3 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {categories.map(cat => (
              <tr key={cat.id_categorie} className="border-b border-[#393950] hover:bg-[#23272f]">
                <td className="p-3">{cat.name}</td>
                <td className="p-3 flex gap-2">
                  <button className="bg-yellow-400 text-black px-3 py-1 rounded" onClick={() => handleEdit(cat)}>Modifier</button>
                  <button className="bg-red-600 text-white px-3 py-1 rounded" onClick={() => handleDelete(cat)}>Supprimer</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
          <div className="bg-[#23272f] border border-[#393950] rounded-2xl p-8 w-full max-w-md shadow-2xl">
            <h2 className="text-xl font-bold text-white mb-4 text-center">{editingCategory ? "Modifier" : "Ajouter"} une catégorie</h2>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
              <div>
                <label className="block text-sm text-gray-300 mb-1">Nom</label>
                <input {...form.register("name")} className="w-full bg-[#18181b] border border-[#393950] text-white px-3 py-2 rounded-lg" />
                {form.formState.errors.name && <span className="text-red-400 text-xs">{form.formState.errors.name.message}</span>}
              </div>
              <div className="flex justify-end gap-2 mt-4">
                <button type="button" className="px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-800" onClick={() => setShowModal(false)}>Annuler</button>
                <button type="submit" className="px-4 py-2 bg-gradient-to-r from-[#AD46FF] to-[#5EEAD4] text-white rounded-lg font-semibold">{editingCategory ? "Enregistrer" : "Créer"}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Categories;
