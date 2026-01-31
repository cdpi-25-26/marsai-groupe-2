import { Link, useNavigate } from "react-router";

import { login } from "../../api/auth.js";
import { useMutation } from "@tanstack/react-query";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

export function Login() {
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

  const { register, handleSubmit } = useForm({
    resolver: zodResolver(loginSchema),
  });

  const loginMutation = useMutation({
    mutationFn: async (data) => {
      return await login(data);
    },
    onSuccess: (response, variables, context) => {
      // If you are logged
      localStorage.setItem("email", response.data?.email);
      localStorage.setItem("role", response.data?.role);
      localStorage.setItem("token", response.data?.token);

      switch (response.data?.role) {
        case "ADMIN":
          navigate("/admin");
          break;
        case "JURY":
          navigate("/jury");
          break;
        case "PRODUCER":
          navigate("/producer");
          break;
        default:
          navigate("/");
          break;
      }
    },
    onError: (error, variables, context) => {
      alert(error.response?.data?.error || "Erreur de connexion");
    },
  });

  function onSubmit(data) {
    return loginMutation.mutate(data);
  }
  return (
    <>
      <h1 className="text-2xl">Connexion</h1>

      <form onSubmit={handleSubmit(onSubmit)}>
        <input type="hidden" id="id" {...register("id")} />

        <label
          htmlFor="email"
          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
        >
          Email
        </label>
        <input
          id="email"
          type="email"
          placeholder="Votre email"
          {...register("email")}
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

        <button type="submit">Se connecter</button>
      </form>

      <Link to="/auth/register">Pas encore de compte ? S'inscrire</Link>
    </>
  );
}
