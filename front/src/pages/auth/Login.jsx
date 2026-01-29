import { Link, useNavigate } from "react-router";

import { login } from "../../api/auth.js";
import { useMutation } from "@tanstack/react-query";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";

const loginSchema = z.object({
  username: z.string(),
  password: z.string(),
});

export function Login() {
  if (localStorage.getItem("username")) {
    return (
      <>
        <h1 className="text-2xl">
          Vous êtes déjà connecté en tant que {localStorage.getItem("username")}
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
      localStorage.setItem("username", response.data?.username);
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
      <h1 className="text-2xl">Login</h1>

      <form onSubmit={handleSubmit(onSubmit)}>
        <input type="hidden" id="id" {...register("id")} />
        <label
          htmlFor="username"
          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
        >
          Username
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
          Password
        </label>
        <input
          id="password"
          type="password"
          placeholder="Votre mot de passe"
          {...register("password")}
          required
        />

        <button type="submit">Login</button>
      </form>

      <Link to="/auth/register">No account yet? Register</Link>
    </>
  );
}
