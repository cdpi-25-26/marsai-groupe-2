import { Link, useNavigate } from "react-router";
import { login } from "../../api/auth.js";
import { useMutation } from "@tanstack/react-query";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { useTranslation } from "react-i18next";

/**
 * Schéma de validation pour le formulaire de connexion
 * Valide: email et password
 */
const loginSchema = z.object({
  email: z.string().email("validation.invalidEmail"),
  password: z.string().min(1, "validation.required"),
});

/**
 * Composant Login (Page de connexion)
 * Affiche un formulaire de connexion pour les utilisateurs existants
 * Après connexion réussie, stocke le JWT et redirige selon le rôle
 * @returns {JSX.Element} La page de connexion
 */
export function Login() {
  const { t } = useTranslation();

  // Si déjà connecté, afficher un message
  if (localStorage.getItem("email")) {
    return (
      <>
        <h1 className="text-2xl">
          {t('common.alreadyLoggedIn', { email: localStorage.getItem("email") })}
        </h1>
        <Link to="/">{t('common.goHome')}</Link>
      </>
    );
  }

  const navigate = useNavigate();

  // Configuration du formulaire avec react-hook-form et Zod
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(loginSchema),
  });

  /**
   * Mutation pour envoyer les données de connexion au backend
   * Stocke le token et les données utilisateur en localStorage
   * Redirige vers le dashboard selon le rôle
   */
  const loginMutation = useMutation({
    mutationFn: async (data) => {
      return await login(data);
    },
    onSuccess: (response) => {
      // Sauvegarder le token et les infos utilisateur
      localStorage.setItem("email", response.data?.email);
      localStorage.setItem("firstName", response.data?.first_name || "");
      localStorage.setItem("role", response.data?.role);
      localStorage.setItem("token", response.data?.token);

      // Redirection basée sur le rôle
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
    onError: (error) => {
      alert(error.response?.data?.error || "Erreur de connexion");
    },
  });

  /**
   * Gère la soumission du formulaire de connexion
   * @param {Object} data - { email, password }
   */
  function onSubmit(data) {
    return loginMutation.mutate(data);
  }
  return (
    <div className="min-h-screen bg-black text-white font-light pt-28 pb-20 px-4 md:pt-32">
      <div className="max-w-xl mx-auto">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold mb-2">{t('forms.login.title')}</h1>
          <p className="text-gray-400">{t('forms.login.subtitle')}</p>
        </div>

        <div className="bg-gray-900 rounded-2xl p-8 border border-gray-800 shadow-2xl">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <input type="hidden" id="id" {...register("id")} />

            <div className="flex flex-col">
              <label htmlFor="email" className="text-white font-semibold mb-2 text-sm uppercase">
                {t('forms.login.email')}
              </label>
              <input
                id="email"
                type="email"
                placeholder={t('forms.login.placeholders.email')}
                {...register("email")}
                className="bg-gray-800 border border-gray-700 text-white px-4 py-3 rounded-lg focus:outline-none focus:border-[#AD46FF] transition"
                required
              />
              {errors.email && (
                <p className="text-red-400 text-sm mt-1">{t(errors.email.message)}</p>
              )}
            </div>

            <div className="flex flex-col">
              <label htmlFor="password" className="text-white font-semibold mb-2 text-sm uppercase">
                {t('forms.login.password')}
              </label>
              <input
                id="password"
                type="password"
                placeholder={t('forms.login.placeholders.password')}
                {...register("password")}
                className="bg-gray-800 border border-gray-700 text-white px-4 py-3 rounded-lg focus:outline-none focus:border-[#AD46FF] transition"
                required
              />
              {errors.password && (
                <p className="text-red-400 text-sm mt-1">{t(errors.password.message)}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={loginMutation.isPending}
              className="w-full bg-gradient-to-r from-[#AD46FF] to-[#F6339A] text-white font-bold py-4 rounded-lg uppercase hover:opacity-90 transition disabled:opacity-50"
            >
              {loginMutation.isPending ? `${t('forms.login.buttons.submit')}...` : t('forms.login.buttons.submit')}
            </button>

            <p className="text-center text-gray-400">
              {t('forms.login.links.noAccount')} {" "}
              <Link
                to="/auth/register"
                className="text-[#AD46FF] hover:text-[#F6339A] font-semibold transition"
              >
                {t('forms.login.links.register')}
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
