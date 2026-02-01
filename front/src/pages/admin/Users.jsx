import { useEffect, useState } from "react";
import { deleteUser, getUsers, updateUser, createUser } from "../../api/users.js";
import { useMutation, useQuery } from "@tanstack/react-query";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";

const createUserSchema = z.object({
  firstName: z.string().min(1, "Le prénom est requis"),
  lastName: z.string().min(1, "Le nom est requis"),
  email: z.string().email("Email invalide"),
  password: z.string().min(6, "Le mot de passe doit contenir au moins 6 caractères"),
  role: z.enum(["ADMIN", "JURY", "PRODUCER"]).default("PRODUCER"),
});

const updateUserSchema = z.object({
  firstName: z.string().min(1, "Le prénom est requis"),
  lastName: z.string().min(1, "Le nom est requis"),
  email: z.string().email("Email invalide"),
  password: z.string().optional(),
  role: z.enum(["ADMIN", "JURY", "PRODUCER"]),
});

function Users() {
  const [users, setUsers] = useState([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [message, setMessage] = useState("");

  useEffect(() => {
    getUsers().then((data) => {
      setUsers(data.data);
    });
  }, []);

  // Form pour créer un utilisateur
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

  // Form pour modifier un utilisateur
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

  const createMutation = useMutation({
    mutationFn: async (newUser) => {
      return await createUser(newUser);
    },
    onSuccess: (data) => {
      setMessage("Utilisateur créé avec succès");
      setShowCreateModal(false);
      createForm.reset();
      // Ricarica la lista
      getUsers().then((data) => setUsers(data.data));
      setTimeout(() => setMessage(""), 3000);
    },
    onError: (error) => {
      setMessage(error.response?.data?.error || "Erreur lors de la création de l'utilisateur");
      setTimeout(() => setMessage(""), 3000);
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, userData }) => {
      return await updateUser(id, userData);
    },
    onSuccess: (data) => {
      setMessage("Utilisateur mis à jour avec succès");
      setShowEditModal(false);
      setEditingUser(null);
      editForm.reset();
      // Ricarica la lista
      getUsers().then((data) => setUsers(data.data));
      setTimeout(() => setMessage(""), 3000);
    },
    onError: (error) => {
      setMessage(error.response?.data?.error || "Erreur lors de la mise à jour");
      setTimeout(() => setMessage(""), 3000);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id) => {
      return await deleteUser(id);
    },
    onSuccess: () => {
      setMessage("Utilisateur supprimé avec succès");
      // Ricarica la lista
      getUsers().then((data) => setUsers(data.data));
      setTimeout(() => setMessage(""), 3000);
    },
    onError: (error) => {
      setMessage(error.response?.data?.error || "Erreur lors de la suppression");
      setTimeout(() => setMessage(""), 3000);
    },
  });

  function handleDelete(id) {
    if (confirm("Voulez-vous vraiment supprimer cet utilisateur ?")) {
      deleteMutation.mutate(id);
    }
  }

  function handleEdit(user) {
    setEditingUser(user);
    editForm.setValue("firstName", user.first_name);
    editForm.setValue("lastName", user.last_name);
    editForm.setValue("email", user.email);
    editForm.setValue("password", "");
    editForm.setValue("role", user.role || "PRODUCER");
    setShowEditModal(true);
  }

  function onCreateSubmit(data) {
    createMutation.mutate(data);
  }

  function onUpdateSubmit(data) {
    const userData = { ...data };
    // Rimuovi password se vuota
    if (!userData.password) {
      delete userData.password;
    }
    updateMutation.mutate({ 
      id: editingUser.id_user, 
      userData 
    });
  }

  return (
    <section className="p-6">
      {message && (
        <div className="mb-4 p-3 border rounded bg-blue-50 text-blue-700">
          {message}
        </div>
      )}

      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Gestion des utilisateurs</h2>
        <button 
          onClick={() => setShowCreateModal(true)}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          + Créer un utilisateur
        </button>
      </div>

      {/* Lista utenti */}
      <div className="border rounded-lg overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Prénom</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Nom</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Rôle</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {users.length > 0 ? (
              users.map((user) => (
                <tr key={user.id_user}>
                  <td className="px-6 py-4 whitespace-nowrap">{user.first_name}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{user.last_name}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{user.email}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs rounded ${
                      user.role === 'ADMIN' ? 'bg-red-100 text-red-800' :
                      user.role === 'JURY' ? 'bg-purple-100 text-purple-800' :
                      'bg-green-100 text-green-800'
                    }`}>
                      {user.role}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <button 
                      onClick={() => handleEdit(user)}
                      className="text-blue-600 hover:text-blue-800 mr-3"
                    >
                      Modifier
                    </button>
                    <button 
                      onClick={() => handleDelete(user.id_user)}
                      className="text-red-600 hover:text-red-800"
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

      {/* Modal Créer */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-xl font-bold mb-4">Créer un nouvel utilisateur</h3>
            <form onSubmit={createForm.handleSubmit(onCreateSubmit)} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Prénom</label>
                <input 
                  type="text" 
                  {...createForm.register("firstName")} 
                  className="w-full border rounded px-3 py-2"
                />
                {createForm.formState.errors.firstName && (
                  <p className="text-red-500 text-xs mt-1">{createForm.formState.errors.firstName.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Nom</label>
                <input 
                  type="text" 
                  {...createForm.register("lastName")} 
                  className="w-full border rounded px-3 py-2"
                />
                {createForm.formState.errors.lastName && (
                  <p className="text-red-500 text-xs mt-1">{createForm.formState.errors.lastName.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Email</label>
                <input 
                  type="email" 
                  {...createForm.register("email")} 
                  className="w-full border rounded px-3 py-2"
                />
                {createForm.formState.errors.email && (
                  <p className="text-red-500 text-xs mt-1">{createForm.formState.errors.email.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Mot de passe</label>
                <input 
                  type="password" 
                  {...createForm.register("password")} 
                  className="w-full border rounded px-3 py-2"
                />
                {createForm.formState.errors.password && (
                  <p className="text-red-500 text-xs mt-1">{createForm.formState.errors.password.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Rôle</label>
                <select 
                  {...createForm.register("role")} 
                  className="w-full border rounded px-3 py-2"
                >
                  <option value="PRODUCER">Producteur</option>
                  <option value="JURY">Jury</option>
                  <option value="ADMIN">Administrateur</option>
                </select>
              </div>

              <div className="flex justify-end gap-2 mt-6">
                <button 
                  type="button"
                  onClick={() => {
                    setShowCreateModal(false);
                    createForm.reset();
                  }}
                  className="px-4 py-2 border rounded hover:bg-gray-100"
                >
                  Annuler
                </button>
                <button 
                  type="submit"
                  className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                  Créer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Modifier */}
      {showEditModal && editingUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-xl font-bold mb-4">Modifier l'utilisateur</h3>
            <form onSubmit={editForm.handleSubmit(onUpdateSubmit)} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Prénom</label>
                <input 
                  type="text" 
                  {...editForm.register("firstName")} 
                  className="w-full border rounded px-3 py-2"
                />
                {editForm.formState.errors.firstName && (
                  <p className="text-red-500 text-xs mt-1">{editForm.formState.errors.firstName.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Nom</label>
                <input 
                  type="text" 
                  {...editForm.register("lastName")} 
                  className="w-full border rounded px-3 py-2"
                />
                {editForm.formState.errors.lastName && (
                  <p className="text-red-500 text-xs mt-1">{editForm.formState.errors.lastName.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Email</label>
                <input 
                  type="email" 
                  {...editForm.register("email")} 
                  className="w-full border rounded px-3 py-2"
                />
                {editForm.formState.errors.email && (
                  <p className="text-red-500 text-xs mt-1">{editForm.formState.errors.email.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Mot de passe (laisser vide pour ne pas changer)</label>
                <input 
                  type="password" 
                  {...editForm.register("password")} 
                  className="w-full border rounded px-3 py-2"
                  placeholder="Laisser vide pour conserver l'ancien"
                />
                {editForm.formState.errors.password && (
                  <p className="text-red-500 text-xs mt-1">{editForm.formState.errors.password.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Rôle</label>
                <select 
                  {...editForm.register("role")} 
                  className="w-full border rounded px-3 py-2"
                >
                  <option value="PRODUCER">Producteur</option>
                  <option value="JURY">Jury</option>
                  <option value="ADMIN">Administrateur</option>
                </select>
              </div>

              <div className="flex justify-end gap-2 mt-6">
                <button 
                  type="button"
                  onClick={() => {
                    setShowEditModal(false);
                    setEditingUser(null);
                    editForm.reset();
                  }}
                  className="px-4 py-2 border rounded hover:bg-gray-100"
                >
                  Annuler
                </button>
                <button 
                  type="submit"
                  className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                  Mettre à jour
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );
}

export default Users;
