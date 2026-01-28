import { useEffect, useState } from "react";


import { deleteUser, getUsers, updateUser } from "../../api/users.js";
import { useMutation } from "@tanstack/react-query";
import { signIn } from "../../api/auth.js";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";

const registerSchema = z.object({
  id: z.number().optional(),
  username: z.string(),
  password: z.string(),
  role: z.enum(["ADMIN", "JURY", "PRODUCER"]).default("PRODUCER"),
});

function Users() {
  const [users, setUsers] = useState([]);
  const [modeEdit, setModeEdit] = useState(false);

  useEffect(() => {
    getUsers().then((data) => {
      setUsers(data.data);
    });
  }, []);

  const { register, handleSubmit, setValue, watch } = useForm({
    resolver: zodResolver(registerSchema),
    defaultValues: { role: "PRODUCER" },
  });

  const registerMutation = useMutation({
    mutationFn: async (newUser) => {
      return await signIn(newUser);
    },
    onSuccess: (data, variables, context) => {
      alert(data.data?.message || "Utilisateur créé");
      window.location.reload();
    },
    onError: (error) => {
      alert(error.response?.data?.error || "Erreur lors de la création de l'utilisateur");
    },
  });

  function onSubmit(data) {
    return registerMutation.mutate(data);
  }

  const deleteMutation = useMutation({
    mutationFn: async (id) => {
      return await deleteUser(id);
    },
    onSuccess: (data, variables, context) => {
      window.location.reload();
    },
  });

  function handleDelete(id) {
    if (confirm("Voulez-vous vraiment supprimer cet utilisateur ?")) {
      deleteMutation.mutate(id);
    }
  }

  const updateMutation = useMutation({
    mutationFn: async (updatedUser) => {
      return await updateUser(updatedUser.id, updatedUser);
    },
    onSuccess: (data, variables, context) => {
      window.location.reload();
    },
  });

  function handleEdit(user) {
    setValue("id", user.id);
    setValue("username", user.username);
    setValue("password", user.password);
    setValue("role", user.role || "PRODUCER");
    setModeEdit(true);
  }

  function handleReset() {
    setValue("id", undefined);
    setValue("username", "");
    setValue("password", "");
    setValue("role", "PRODUCER");
    setModeEdit(false);
  }

  function onUpdate(updatedUser) {
    console.log(updatedUser);
    updateMutation.mutate(updatedUser);
  }

  return (
    <section>
      <div className="border-b pb-4 mb-4">
        <h2 className="text-2xl font-bold mb-4">Liste des utilisateurs</h2>
        {users.length > 0 &&
          users.map((user) => (
            <div key={user.id} className="flex gap-2">
              <h2>{user.username}</h2>
              <p>{user.password}</p>
              <button onClick={() => handleEdit(user)}>Modifier</button>
              <button onClick={() => handleDelete(user.id)}>Delete</button>
            </div>
          ))}
        {users.length === 0 && <div>Aucun utilisateur trouvé.</div>}
      </div>

      <div className="border-b pb-4 mb-4">
        <h2 className="text-2xl font-bold mb-4">Créer un utilisateur</h2>
        <form
          onSubmit={modeEdit ? handleSubmit(onUpdate) : handleSubmit(onSubmit)}
        >
          <input type="hidden" id="id" {...register("id" )} />
          <label
            htmlFor="username"
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            Nom d'utilisateur
          </label>
          <input
            id="username"
            type="text"
            placeholder="Votre nom d'utilisateur"
            {...register("username")}
            required
          />

          <label
            htmlFor="password"
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            Mot de passe
          </label>
          <input
            id="password"
            type="password"
            placeholder="Votre mot de passe"
            {...register("password")}
            required
          />

          <label htmlFor="role" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
            Rôle
          </label>
          <select id="role" {...register("role")}
          >
            <option value="PRODUCER">Producteur</option>
            <option value="ADMIN">Administrateur</option>
            <option value="JURY">Jury</option>
          </select>

          {modeEdit && (
            <button type="button" onClick={handleReset}>
              Annuler la modification
            </button>
          )}
          <button type="submit">
            {modeEdit ? "Mettre à jour" : "Créer un utilisateur"}
          </button>
        </form>
      </div>
    </section>
  );
}

export default Users;
