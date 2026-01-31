import { Link, useNavigate } from "react-router";

import { signIn } from "../../api/auth.js";
import { useMutation } from "@tanstack/react-query";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";

const registerSchema = z.object({
  firstName: z.string(),
  lastName: z.string(),
  email: z.string().email(),
  password: z.string(),
  role: z.string().optional().default("PRODUCER"),
});

export function Register() {
  if (localStorage.getItem("email")) {
    return (
      <>
        <h1 className="text-2xl">
          Vous êtes déjà connecté en tant que {localStorage.getItem("email")}
        </h1>
        <Link to="/">Aller à l'accueil</Link>
      </>
    );
  }

  let navigate = useNavigate();

  const { register, handleSubmit, watch } = useForm({
    resolver: zodResolver(registerSchema),
    defaultValues: { role: "PRODUCER" },
  });

  const registerMutation = useMutation({
    mutationFn: async (data) => {
      // Adatta i dati per il backend
      return await signIn({
        first_name: data.firstName,
        last_name: data.lastName,
        email: data.email,
        password: data.password,
        role: data.role
      });
    },
    onSuccess: (data, variables, context) => {
      alert(data.data?.message);
      navigate("/auth/login");
    },
  });

  function onSubmit(data) {
    return registerMutation.mutate(data);
  }
  return (
    <>
      <h1 className="text-2xl">Inscription</h1>
      <form onSubmit={handleSubmit(onSubmit)}>
        <input type="hidden" id="id" {...register("id")} />
        <label htmlFor="firstName" className="text-sm font-medium">Prénom</label>
        <input id="firstName" type="text" placeholder="Prénom" {...register("firstName")} required />

        <label htmlFor="lastName" className="text-sm font-medium">Nom</label>
        <input id="lastName" type="text" placeholder="Nom" {...register("lastName")} required />

        <label htmlFor="email" className="text-sm font-medium">Email</label>
        <input id="email" type="email" placeholder="Votre email" {...register("email")} required />

        <label htmlFor="password" className="text-sm font-medium">Mot de passe</label>
        <input id="password" type="password" placeholder="Votre mot de passe" {...register("password")} required />

        <input type="hidden" {...register("role")} value="PRODUCER" />

        <button type="submit">S'inscrire</button>
      </form>
      <Link to="/auth/login">Vous avez déjà un compte ? Se connecter</Link>
    </>
  );
}
