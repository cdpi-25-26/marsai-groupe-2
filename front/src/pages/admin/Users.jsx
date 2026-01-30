import { useEffect, useState } from "react";


import { deleteUser, getUsers, updateUser, createUser } from "../../api/users.js";
import { useMutation } from "@tanstack/react-query";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";

const registerSchema = z.object({
  id: z.number().optional(),
  firstName: z.string(),
  lastName: z.string(),
  email: z.string().email(),
  password: z.string(),
  role: z.enum(["ADMIN", "JURY", "PRODUCER"]).default("PRODUCER"),
});

function Users() {
  const [users, setUsers] = useState([]);
  const [modeEdit, setModeEdit] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    getUsers().then((data) => {
      setUsers(data.data);
    });
  }, []);

  const { register, handleSubmit, setValue, watch } = useForm({
    //resolver: zodResolver(registerSchema),
    defaultValues: { role: "PRODUCER" },
  });

  const registerMutation = useMutation({
    mutationFn: async (newUser) => {
      return await createUser(newUser);
    },
    onSuccess: (data, variables, context) => {
      setMessage(data.data?.message || "Utilisateur créé");
      setTimeout(() => window.location.reload(), 1500);
    },
    onError: (error) => {
      setMessage(error.response?.data?.error || "Erreur lors de la création de l'utilisateur");
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
    setValue("id", user.userId);
    setValue("firstName", user.firstName);
    setValue("lastName", user.lastName);
    setValue("email", user.email);
    setValue("password", "");
    setValue("role", user.role || "PRODUCER");
    setModeEdit(true);
  }

  function handleReset() {
    setValue("id", undefined);
    setValue("firstName", "");
    setValue("lastName", "");
    setValue("email", "");
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
        {message && (
          <div className="mb-2 p-2 border rounded text-red-600 bg-red-100">{message}</div>
        )}
        <h2 className="text-2xl font-bold mb-4">Lista utenti</h2>
        {users.length > 0 &&
          users.map((user) => (
            <div key={user.userId} className="flex gap-2">
              <span>{user.firstName} {user.lastName}</span>
              <span>{user.email}</span>
              <span>{user.role}</span>
              <button onClick={() => handleEdit(user)}>Modifica</button>
              <button onClick={() => handleDelete(user.userId)}>Elimina</button>
            </div>
          ))}
        {users.length === 0 && <div>Nessun utente trovato.</div>}
      </div>

      <div className="border-b pb-4 mb-4">
        <h2 className="text-2xl font-bold mb-4">Crea un utente</h2>
        <form
          onSubmit={modeEdit ? handleSubmit(onUpdate) : handleSubmit(onSubmit)}
        >
          <input type="hidden" id="id" {...register("id" )} />
          <label htmlFor="firstName" className="text-sm font-medium">Nome</label>
          <input id="firstName" type="text" placeholder="Nome" {...register("firstName")} required />

          <label htmlFor="lastName" className="text-sm font-medium">Cognome</label>
          <input id="lastName" type="text" placeholder="Cognome" {...register("lastName")} required />

          <label htmlFor="email" className="text-sm font-medium">Email</label>
          <input id="email" type="email" placeholder="Email" {...register("email")} required />

          <label htmlFor="password" className="text-sm font-medium">Password</label>
          <input id="password" type="password" placeholder="Password" {...register("password")} required />

          <label htmlFor="role" className="text-sm font-medium">Ruolo</label>
          <select id="role" {...register("role")}
          >
            <option value="PRODUCER">Produttore</option>
            <option value="ADMIN">Amministratore</option>
            <option value="JURY">Giuria</option>
          </select>

          {modeEdit && (
            <button type="button" onClick={handleReset}>
              Annulla modifica
            </button>
          )}
          <button type="submit">
            {modeEdit ? "Aggiorna" : "Crea utente"}
          </button>
        </form>
      </div>
    </section>
  );
}

export default Users;
