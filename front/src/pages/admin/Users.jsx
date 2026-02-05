/**
 * Composant Users (Gestion des Utilisateurs Admin)
 * Page administrateur pour gérer les utilisateurs du système
 * Fonctionnalités CRUD complètes: Créer, Lire, Mettre à jour, Supprimer
 * Utilise react-hook-form avec validation Zod
 * Utilise TanStack Query (useMutation) pour les opérations CRUD
 * @returns {JSX.Element} La page de gestion des utilisateurs avec tableau et modales
 */
import { useEffect, useState } from "react";
import { deleteUser, getUsers, updateUser, createUser } from "../../api/users.js";
import { useMutation, useQuery } from "@tanstack/react-query";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";

/**
 * Schéma de validation pour la création d'un utilisateur
 * Champs requis: prénom, nom, email (valide), mot de passe (min 6 caractères)
 * Rôle par défaut: PRODUCER
 */
const createUserSchema = z.object({
  firstName: z.string().min(1, "Le prénom est requis"),
  lastName: z.string().min(1, "Le nom est requis"),
  email: z.string().email("Email invalide"),
  password: z.string().min(6, "Le mot de passe doit contenir au moins 6 caractères"),
  role: z.enum(["ADMIN", "JURY", "PRODUCER"]).default("PRODUCER"),
});

/**
 * Schéma de validation pour la modification d'un utilisateur
 * Mot de passe optionnel pour permettre les modifications sans changer le mot de passe
 */
const updateUserSchema = z.object({
  firstName: z.string().min(1, "Le prénom est requis"),
  lastName: z.string().min(1, "Le nom est requis"),
  email: z.string().email("Email invalide"),
  password: z.string().optional(),
  role: z.enum(["ADMIN", "JURY", "PRODUCER"]),
});

/**
 * Fonction Users
 * Gère l'affichage et la manipulation des utilisateurs
 * - Affiche une liste de tous les utilisateurs dans un tableau
 * - Permet de créer, modifier et supprimer des utilisateurs
 * - Utilise des modales pour les formulaires de création et modification
 * @returns {JSX.Element} La page de gestion des utilisateurs
 */
function Users() {
  // État pour stocker la liste des utilisateurs
  const [users, setUsers] = useState([]);
  // État pour afficher/masquer la modale de création
  const [showCreateModal, setShowCreateModal] = useState(false);
  // État pour afficher/masquer la modale de modification
  const [showEditModal, setShowEditModal] = useState(false);
  // État pour stocker l'utilisateur en cours de modification
  const [editingUser, setEditingUser] = useState(null);
  // État pour afficher les messages de succès/erreur
  const [message, setMessage] = useState("");

  /**
   * Effect - Charge la liste des utilisateurs au montage du composant
   */
  useEffect(() => {
    getUsers().then((data) => {
      setUsers(data.data);
    });
  }, []);

  /**
   * Formulaire React Hook Form pour la création d'utilisateur
   * Applique la validation du schéma createUserSchema avec Zod
   */
  const createForm = useForm({
    resolver: zodResolver(createUserSchema),
    defaultValues: { 
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      role: "PRODUCER" 
    },
  });

  /**
   * Formulaire React Hook Form pour la modification d'utilisateur
   * Applique la validation du schéma updateUserSchema avec Zod
   */
  const editForm = useForm({
    resolver: zodResolver(updateUserSchema),
    defaultValues: { 
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      role: "PRODUCER" 
    },
  });

  /**
   * Mutation TanStack Query pour créer un utilisateur
   * Appelle createUser de l'API, réinitialise le formulaire et rafraîchit la liste
   */
  const createMutation = useMutation({
    mutationFn: async (newUser) => {
      return await createUser(newUser);
    },
    onSuccess: (data) => {
      setMessage("Utilisateur créé avec succès");
      setShowCreateModal(false);
      createForm.reset();
      // Rafraîchit la liste des utilisateurs
      getUsers().then((data) => setUsers(data.data));
      setTimeout(() => setMessage(""), 3000);
    },
    onError: (error) => {
      setMessage(error.response?.data?.error || "Erreur lors de la création de l'utilisateur");
      setTimeout(() => setMessage(""), 3000);
    },
  });

  /**
   * Mutation TanStack Query pour modifier un utilisateur
   * Appelle updateUser de l'API, réinitialise le formulaire et rafraîchit la liste
   */
  const updateMutation = useMutation({
    mutationFn: async ({ id, userData }) => {
      return await updateUser(id, userData);
    },
    onSuccess: (data) => {
      setMessage("Utilisateur mis à jour avec succès");
      setShowEditModal(false);
      setEditingUser(null);
      editForm.reset();
      // Rafraîchit la liste des utilisateurs
      getUsers().then((data) => setUsers(data.data));
      setTimeout(() => setMessage(""), 3000);
    },
    onError: (error) => {
      setMessage(error.response?.data?.error || "Erreur lors de la mise à jour");
      setTimeout(() => setMessage(""), 3000);
    },
  });

  /**
   * Mutation TanStack Query pour supprimer un utilisateur
   * Appelle deleteUser de l'API et rafraîchit la liste
   */
  const deleteMutation = useMutation({
    mutationFn: async (id) => {
      return await deleteUser(id);
    },
    onSuccess: () => {
      setMessage("Utilisateur supprimé avec succès");
      // Rafraîchit la liste des utilisateurs
      getUsers().then((data) => setUsers(data.data));
      setTimeout(() => setMessage(""), 3000);
    },
    onError: (error) => {
      setMessage(error.response?.data?.error || "Erreur lors de la suppression");
      setTimeout(() => setMessage(""), 3000);
    },
  });

  /**
   * Fonction handleDelete
   * Demande une confirmation avant de supprimer un utilisateur
   * @param {number} id - L'ID de l'utilisateur à supprimer
   */
  function handleDelete(id) {
    if (confirm("Voulez-vous vraiment supprimer cet utilisateur ?")) {
      deleteMutation.mutate(id);
    }
  }

  /**
   * Fonction handleEdit
   * Prépare le formulaire pour la modification d'un utilisateur
   * Définit les valeurs actuelles du formulaire à partir de l'utilisateur sélectionné
   * @param {Object} user - L'utilisateur à modifier
   */
  function handleEdit(user) {
    setEditingUser(user);
    editForm.setValue("firstName", user.first_name);
    editForm.setValue("lastName", user.last_name);
    editForm.setValue("email", user.email);
    editForm.setValue("password", "");
    editForm.setValue("role", user.role || "PRODUCER");
    setShowEditModal(true);
  }

  /**
   * Fonction onCreateSubmit
   * Appelée lors de la soumission du formulaire de création
   * Transmet les données au createMutation
   * @param {Object} data - Les données du formulaire validées
   */
  function onCreateSubmit(data) {
    createMutation.mutate(data);
  }

  /**
   * Fonction onUpdateSubmit
   * Appelée lors de la soumission du formulaire de modification
   * Supprime le champ password si vide pour ne pas le modifier
   * @param {Object} data - Les données du formulaire validées
   */
  function onUpdateSubmit(data) {
    const userData = { ...data };
    // Supprime le mot de passe si vide pour éviter de changer le mot de passe
    if (!userData.password) {
      delete userData.password;
    }
    updateMutation.mutate({ 
      id: editingUser.id_user, 
      userData 
    });
  }


  return (
    <section className="min-h-screen bg-black text-white font-light pt-28 pb-20 px-4 md:pt-32">
      <div className="max-w-6xl mx-auto">
      {/* Affichage des messages de succès/erreur */}
      {message && (
        <div className="mb-6 p-3 border border-gray-700 rounded-lg bg-gray-900 text-gray-200">
          {message}
        </div>
      )}

      {/* En-tête avec titre et bouton de création */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <h2 className="text-3xl font-bold">Gestion des utilisateurs</h2>
        <button 
          onClick={() => setShowCreateModal(true)}
          className="bg-gradient-to-r from-[#AD46FF] to-[#F6339A] text-white px-4 py-2 rounded-lg font-semibold hover:opacity-90 transition"
        >
          + Créer un utilisateur
        </button>
      </div>

      {/* Tableau affichant la liste des utilisateurs */}
      <div className="border border-gray-800 rounded-xl overflow-hidden bg-gray-900">
        <table className="min-w-full divide-y divide-gray-800">
          {/* En-tête du tableau avec colonnes */}
          <thead className="bg-gray-900">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase">Prénom</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase">Nom</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase">Email</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase">Rôle</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase">Actions</th>
            </tr>
          </thead>
          {/* Corps du tableau avec les données des utilisateurs */}
          <tbody className="bg-gray-950 divide-y divide-gray-800">
            {users.length > 0 ? (
              users.map((user) => (
                <tr key={user.id_user}>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-200">{user.first_name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-200">{user.last_name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-200">{user.email}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {/* Affichage du rôle avec couleur distincte selon le rôle */}
                    <span className={`px-2 py-1 text-xs rounded ${
                      user.role === 'ADMIN' ? 'bg-red-900/40 text-red-200' :
                      user.role === 'JURY' ? 'bg-purple-900/40 text-purple-200' :
                      'bg-green-900/40 text-green-200'
                    }`}>
                      {user.role}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {/* Boutons d'actions: Modifier et Supprimer */}
                    <button 
                      onClick={() => handleEdit(user)}
                      className="text-[#AD46FF] hover:text-[#F6339A] mr-3"
                    >
                      Modifier
                    </button>
                    <button 
                      onClick={() => handleDelete(user.id_user)}
                      className="text-red-300 hover:text-red-400"
                    >
                      Supprimer
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="px-6 py-4 text-center text-gray-500">
                  Aucun utilisateur trouvé
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Modal de création d'utilisateur */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 w-full max-w-md">
            <h3 className="text-xl font-bold mb-4">Créer un nouvel utilisateur</h3>
            <form onSubmit={createForm.handleSubmit(onCreateSubmit)} className="space-y-4">
              {/* Champ: Prénom */}
              <div>
                <label className="block text-sm font-medium mb-1 text-gray-300">Prénom</label>
                <input 
                  type="text" 
                  {...createForm.register("firstName")} 
                  className="w-full bg-gray-800 border border-gray-700 text-white rounded px-3 py-2"
                />
                {createForm.formState.errors.firstName && (
                  <p className="text-red-500 text-xs mt-1">{createForm.formState.errors.firstName.message}</p>
                )}
              </div>

              {/* Champ: Nom */}
              <div>
                <label className="block text-sm font-medium mb-1 text-gray-300">Nom</label>
                <input 
                  type="text" 
                  {...createForm.register("lastName")} 
                  className="w-full bg-gray-800 border border-gray-700 text-white rounded px-3 py-2"
                />
                {createForm.formState.errors.lastName && (
                  <p className="text-red-500 text-xs mt-1">{createForm.formState.errors.lastName.message}</p>
                )}
              </div>

              {/* Champ: Email */}
              <div>
                <label className="block text-sm font-medium mb-1 text-gray-300">Email</label>
                <input 
                  type="email" 
                  {...createForm.register("email")} 
                  className="w-full bg-gray-800 border border-gray-700 text-white rounded px-3 py-2"
                />
                {createForm.formState.errors.email && (
                  <p className="text-red-500 text-xs mt-1">{createForm.formState.errors.email.message}</p>
                )}
              </div>

              {/* Champ: Mot de passe */}
              <div>
                <label className="block text-sm font-medium mb-1 text-gray-300">Mot de passe</label>
                <input 
                  type="password" 
                  {...createForm.register("password")} 
                  className="w-full bg-gray-800 border border-gray-700 text-white rounded px-3 py-2"
                />
                {createForm.formState.errors.password && (
                  <p className="text-red-500 text-xs mt-1">{createForm.formState.errors.password.message}</p>
                )}
              </div>

              {/* Champ: Rôle */}
              <div>
                <label className="block text-sm font-medium mb-1 text-gray-300">Rôle</label>
                <select 
                  {...createForm.register("role")} 
                  className="w-full bg-gray-800 border border-gray-700 text-white rounded px-3 py-2"
                >
                  <option value="PRODUCER">Producteur</option>
                  <option value="JURY">Jury</option>
                  <option value="ADMIN">Administrateur</option>
                </select>
              </div>

              {/* Boutons de la modale */}
              <div className="flex justify-end gap-2 mt-6">
                <button 
                  type="button"
                  onClick={() => {
                    setShowCreateModal(false);
                    createForm.reset();
                  }}
                  className="px-4 py-2 border border-gray-700 rounded hover:bg-gray-800"
                >
                  Annuler
                </button>
                <button 
                  type="submit"
                  className="px-4 py-2 bg-gradient-to-r from-[#AD46FF] to-[#F6339A] text-white rounded hover:opacity-90"
                >
                  Créer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal de modification d'utilisateur */}
      {showEditModal && editingUser && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 w-full max-w-md">
            <h3 className="text-xl font-bold mb-4">Modifier l'utilisateur</h3>
            <form onSubmit={editForm.handleSubmit(onUpdateSubmit)} className="space-y-4">
              {/* Champ: Prénom */}
              <div>
                <label className="block text-sm font-medium mb-1 text-gray-300">Prénom</label>
                <input 
                  type="text" 
                  {...editForm.register("firstName")} 
                  className="w-full bg-gray-800 border border-gray-700 text-white rounded px-3 py-2"
                />
                {editForm.formState.errors.firstName && (
                  <p className="text-red-500 text-xs mt-1">{editForm.formState.errors.firstName.message}</p>
                )}
              </div>

              {/* Champ: Nom */}
              <div>
                <label className="block text-sm font-medium mb-1 text-gray-300">Nom</label>
                <input 
                  type="text" 
                  {...editForm.register("lastName")} 
                  className="w-full bg-gray-800 border border-gray-700 text-white rounded px-3 py-2"
                />
                {editForm.formState.errors.lastName && (
                  <p className="text-red-500 text-xs mt-1">{editForm.formState.errors.lastName.message}</p>
                )}
              </div>

              {/* Champ: Email */}
              <div>
                <label className="block text-sm font-medium mb-1 text-gray-300">Email</label>
                <input 
                  type="email" 
                  {...editForm.register("email")} 
                  className="w-full bg-gray-800 border border-gray-700 text-white rounded px-3 py-2"
                />
                {editForm.formState.errors.email && (
                  <p className="text-red-500 text-xs mt-1">{editForm.formState.errors.email.message}</p>
                )}
              </div>

              {/* Champ: Mot de passe (optionnel pour ne pas changer) */}
              <div>
                <label className="block text-sm font-medium mb-1 text-gray-300">Mot de passe (laisser vide pour ne pas changer)</label>
                <input 
                  type="password" 
                  {...editForm.register("password")} 
                  className="w-full bg-gray-800 border border-gray-700 text-white rounded px-3 py-2"
                  placeholder="Laisser vide pour conserver l'ancien"
                />
                {editForm.formState.errors.password && (
                  <p className="text-red-500 text-xs mt-1">{editForm.formState.errors.password.message}</p>
                )}
              </div>

              {/* Champ: Rôle */}
              <div>
                <label className="block text-sm font-medium mb-1 text-gray-300">Rôle</label>
                <select 
                  {...editForm.register("role")} 
                  className="w-full bg-gray-800 border border-gray-700 text-white rounded px-3 py-2"
                >
                  <option value="PRODUCER">Producteur</option>
                  <option value="JURY">Jury</option>
                  <option value="ADMIN">Administrateur</option>
                </select>
              </div>

              {/* Boutons de la modale */}
              <div className="flex justify-end gap-2 mt-6">
                <button 
                  type="button"
                  onClick={() => {
                    setShowEditModal(false);
                    setEditingUser(null);
                    editForm.reset();
                  }}
                  className="px-4 py-2 border border-gray-700 rounded hover:bg-gray-800"
                >
                  Annuler
                </button>
                <button 
                  type="submit"
                  className="px-4 py-2 bg-gradient-to-r from-[#AD46FF] to-[#F6339A] text-white rounded hover:opacity-90"
                >
                  Mettre à jour
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      </div>
    </section>
  );
}

export default Users;
