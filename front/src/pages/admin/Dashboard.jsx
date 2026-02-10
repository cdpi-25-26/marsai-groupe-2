import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createCategory, deleteCategory, getCategories, updateCategory } from "../../api/videos.js";
import Users from "./Users.jsx";
import Videos from "./Videos.jsx";

/**
 * Composant Dashboard (Tableau de bord Admin)
 * Page principale pour les administrateurs
 * Affiche: Gestion des utilisateurs, Gestion des vidéos
 * @returns {JSX.Element} Le dashboard avec les composants admin
 */
function Dashboard() {
  const queryClient = useQueryClient();
  const [newCategoryName, setNewCategoryName] = useState("");
  const [editingCategoryId, setEditingCategoryId] = useState(null);
  const [editingCategoryName, setEditingCategoryName] = useState("");

  const { data: categoriesData } = useQuery({
    queryKey: ["categories"],
    queryFn: getCategories
  });

  const categories = categoriesData?.data || [];

  const createCategoryMutation = useMutation({
    mutationFn: (name) => createCategory(name),
    onSuccess: () => {
      setNewCategoryName("");
      queryClient.invalidateQueries({ queryKey: ["categories"] });
    }
  });

  const updateCategoryMutation = useMutation({
    mutationFn: ({ id, name }) => updateCategory(id, name),
    onSuccess: () => {
      setEditingCategoryId(null);
      setEditingCategoryName("");
      queryClient.invalidateQueries({ queryKey: ["categories"] });
    }
  });

  const deleteCategoryMutation = useMutation({
    mutationFn: (id) => deleteCategory(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
    }
  });

  return (
    <div className="bg-black text-white">
      <Users />
      <div className="max-w-6xl mx-auto px-4 pb-10">
        <div className="bg-gray-900 rounded-2xl p-8 border border-gray-800 shadow-2xl">
          <h2 className="text-3xl font-bold mb-6">Gestion des catégories</h2>
          <div className="flex flex-col md:flex-row gap-3">
            <input
              type="text"
              value={newCategoryName}
              onChange={(event) => setNewCategoryName(event.target.value)}
              placeholder="Nom de la catégorie"
              className="flex-1 bg-gray-800 border border-gray-700 text-white px-4 py-3 rounded-lg"
            />
            <button
              type="button"
              onClick={() => {
                if (newCategoryName.trim()) {
                  createCategoryMutation.mutate(newCategoryName.trim());
                }
              }}
              className="px-5 py-3 bg-[#AD46FF] text-white rounded-lg hover:opacity-90"
            >
              Ajouter
            </button>
          </div>

          <div className="mt-6 space-y-3">
            {categories.length === 0 ? (
              <p className="text-gray-400">Aucune catégorie créée.</p>
            ) : (
              categories.map((category) => (
                <div
                  key={category.id_categorie}
                  className="flex flex-col md:flex-row md:items-center gap-3 bg-gray-950 border border-gray-800 rounded-xl px-4 py-3"
                >
                  {editingCategoryId === category.id_categorie ? (
                    <input
                      type="text"
                      value={editingCategoryName}
                      onChange={(event) => setEditingCategoryName(event.target.value)}
                      className="flex-1 bg-gray-800 border border-gray-700 text-white px-4 py-2 rounded-lg"
                    />
                  ) : (
                    <span className="flex-1 text-white font-medium">{category.name}</span>
                  )}

                  <div className="flex flex-wrap gap-2">
                    {editingCategoryId === category.id_categorie ? (
                      <>
                        <button
                          type="button"
                          onClick={() => {
                            const nextName = editingCategoryName.trim();
                            if (nextName) {
                              updateCategoryMutation.mutate({ id: category.id_categorie, name: nextName });
                            }
                          }}
                          className="px-4 py-2 bg-[#AD46FF] text-white rounded-lg hover:opacity-90"
                        >
                          Enregistrer
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setEditingCategoryId(null);
                            setEditingCategoryName("");
                          }}
                          className="px-4 py-2 border border-gray-700 rounded-lg"
                        >
                          Annuler
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          type="button"
                          onClick={() => {
                            setEditingCategoryId(category.id_categorie);
                            setEditingCategoryName(category.name || "");
                          }}
                          className="px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700"
                        >
                          Modifier
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            if (window.confirm("Supprimer cette catégorie ?")) {
                              deleteCategoryMutation.mutate(category.id_categorie);
                            }
                          }}
                          className="px-4 py-2 bg-red-600/80 text-white rounded-lg hover:bg-red-600"
                        >
                          Supprimer
                        </button>
                      </>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
      <div className="max-w-6xl mx-auto px-4 pb-20">
        <div className="bg-gray-900 rounded-2xl p-8 border border-gray-800 shadow-2xl">
          <h2 className="text-3xl font-bold mb-6">Gestion des films</h2>
          <Videos />
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
