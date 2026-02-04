import { Link, useNavigate } from "react-router";
import { signIn, login } from "../../api/auth.js";
import { useMutation } from "@tanstack/react-query";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";

/**
 * Schéma de validation pour le formulaire d'enregistrement
 * Valide tous les champs du profil utilisateur
 */
const registerSchema = z.object({
  firstName: z.string().min(1, "Le prénom est requis"),
  lastName: z.string().min(1, "Le nom est requis"),
  email: z.string().email("Format d'email invalide"),
  password: z.string().min(6, "Au moins 6 caractères"),
  phone: z.string().optional(),
  mobile: z.string().optional(),
  birthDate: z.string().optional(),
  street: z.string().optional(),
  postalCode: z.string().optional(),
  city: z.string().optional(),
  country: z.string().optional(),
  biography: z.string().optional(),
  job: z.enum(["ACTOR", "DIRECTOR", "PRODUCER", "WRITER", "OTHER"]).optional(),
  portfolio: z.string().optional(),
  youtube: z.string().optional(),
  instagram: z.string().optional(),
  linkedin: z.string().optional(),
  facebook: z.string().optional(),
  tiktok: z.string().optional(),
  knownByMarsAi: z.enum(["YES", "NO"]).optional(),
  role: z.string().optional().default("PRODUCER"),
});

/**
 * Composant Register (Page d'enregistrement)
 * Formulaire complet d'enregistrement pour les nouveaux utilisateurs
 * Après enregistrement réussi, auto-login automatique
 * @returns {JSX.Element} La page d'enregistrement
 */
export function Register() {
  // Si déjà connecté, afficher un message
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

  const navigate = useNavigate();

  // Configuration du formulaire avec react-hook-form et Zod
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(registerSchema),
    defaultValues: { role: "PRODUCER", job: "PRODUCER" },
  });

  /**
   * Mutation pour envoyer les données d'enregistrement au backend
   * Après succès, effectue un auto-login automatique
   */
  const registerMutation = useMutation({
    mutationFn: async (data) => {
      // Mapper les champs camelCase du frontend en snake_case pour le backend
      return await signIn({
        first_name: data.firstName,
        last_name: data.lastName,
        email: data.email,
        password: data.password,
        phone: data.phone,
        mobile: data.mobile,
        birth_date: data.birthDate,
        street: data.street,
        postal_code: data.postalCode,
        city: data.city,
        country: data.country,
        biography: data.biography,
        job: data.job,
        portfolio: data.portfolio,
        youtube: data.youtube,
        instagram: data.instagram,
        linkedin: data.linkedin,
        facebook: data.facebook,
        tiktok: data.tiktok,
        known_by_mars_ai: data.knownByMarsAi,
        role: data.role || "PRODUCER"
      });
    },
    onSuccess: async (data, variables) => {
      // Après enregistrement réussi, effectuer un login automatique
      try {
        const loginRes = await login({
          email: variables.email,
          password: variables.password
        });
        // Sauvegarder les données de session
        localStorage.setItem("email", loginRes.data?.email);
        localStorage.setItem("firstName", loginRes.data?.first_name || "");
        localStorage.setItem("lastName", loginRes.data?.last_name || "");
        localStorage.setItem("role", loginRes.data?.role);
        localStorage.setItem("token", loginRes.data?.token);
        
        // Redirection vers le tableau de bord du producteur
        navigate("/producer");
      } catch (err) {
        alert("Enregistrement réussi, mais la connexion automatique a échoué. Veuillez vous connecter manuellement.");
        navigate("/auth/login");
      }
    },
  });

  function onSubmit(data) {
    return registerMutation.mutate(data);
  }
  return (
    <div className="min-h-screen bg-black text-white font-light py-20 px-4">
      <div className="max-w-4xl mx-auto">
        {/* En-tête */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold mb-2">
            <span className="text-white">Créer un compte</span>
          </h1>
          <p className="text-gray-400 text-lg mb-8">
            Rejoignez la plateforme MarsAI en tant que producteur
          </p>
        </div>

        {/* Formulaire dans une table grigio scuro */}
        <div className="bg-gray-900 rounded-2xl p-8 border border-gray-800 shadow-2xl">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            
            {/* Informazioni personali */}
            <div>
              <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                <span className="text-[#AD46FF]">●</span> Informazioni personali
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Prénom */}
                <div className="flex flex-col">
                  <label htmlFor="firstName" className="text-white font-semibold mb-2 text-sm uppercase">
                    Prénom *
                  </label>
                  <input
                    id="firstName"
                    type="text"
                    placeholder="Votre prénom"
                    {...register("firstName")}
                    className="bg-gray-800 border border-gray-700 text-white px-4 py-3 rounded-lg focus:outline-none focus:border-[#AD46FF] transition"
                  />
                  {errors.firstName && <p className="text-red-400 text-sm mt-1">{errors.firstName.message}</p>}
                </div>

                {/* Nom */}
                <div className="flex flex-col">
                  <label htmlFor="lastName" className="text-white font-semibold mb-2 text-sm uppercase">
                    Nom *
                  </label>
                  <input
                    id="lastName"
                    type="text"
                    placeholder="Votre nom"
                    {...register("lastName")}
                    className="bg-gray-800 border border-gray-700 text-white px-4 py-3 rounded-lg focus:outline-none focus:border-[#AD46FF] transition"
                  />
                  {errors.lastName && <p className="text-red-400 text-sm mt-1">{errors.lastName.message}</p>}
                </div>

                {/* Email */}
                <div className="flex flex-col md:col-span-2">
                  <label htmlFor="email" className="text-white font-semibold mb-2 text-sm uppercase">
                    Email *
                  </label>
                  <input
                    id="email"
                    type="email"
                    placeholder="votre.email@example.com"
                    {...register("email")}
                    className="bg-gray-800 border border-gray-700 text-white px-4 py-3 rounded-lg focus:outline-none focus:border-[#AD46FF] transition"
                  />
                  {errors.email && <p className="text-red-400 text-sm mt-1">{errors.email.message}</p>}
                </div>

                {/* Mot de passe */}
                <div className="flex flex-col md:col-span-2">
                  <label htmlFor="password" className="text-white font-semibold mb-2 text-sm uppercase">
                    Mot de passe *
                  </label>
                  <input
                    id="password"
                    type="password"
                    placeholder="Minimum 6 caractères"
                    {...register("password")}
                    className="bg-gray-800 border border-gray-700 text-white px-4 py-3 rounded-lg focus:outline-none focus:border-[#AD46FF] transition"
                  />
                  {errors.password && <p className="text-red-400 text-sm mt-1">{errors.password.message}</p>}
                </div>

                {/* Téléphone */}
                <div className="flex flex-col">
                  <label htmlFor="phone" className="text-white font-semibold mb-2 text-sm uppercase">
                    Téléphone
                  </label>
                  <input
                    id="phone"
                    type="text"
                    placeholder="Téléphone fixe"
                    {...register("phone")}
                    className="bg-gray-800 border border-gray-700 text-white px-4 py-3 rounded-lg focus:outline-none focus:border-[#AD46FF] transition"
                  />
                </div>

                {/* Mobile */}
                <div className="flex flex-col">
                  <label htmlFor="mobile" className="text-white font-semibold mb-2 text-sm uppercase">
                    Mobile
                  </label>
                  <input
                    id="mobile"
                    type="text"
                    placeholder="Téléphone mobile"
                    {...register("mobile")}
                    className="bg-gray-800 border border-gray-700 text-white px-4 py-3 rounded-lg focus:outline-none focus:border-[#AD46FF] transition"
                  />
                </div>

                {/* Date di nascita */}
                <div className="flex flex-col">
                  <label htmlFor="birthDate" className="text-white font-semibold mb-2 text-sm uppercase">
                    Date de naissance
                  </label>
                  <input
                    id="birthDate"
                    type="date"
                    {...register("birthDate")}
                    className="bg-gray-800 border border-gray-700 text-white px-4 py-3 rounded-lg focus:outline-none focus:border-[#AD46FF] transition"
                  />
                </div>

                {/* Profession */}
                <div className="flex flex-col">
                  <label htmlFor="job" className="text-white font-semibold mb-2 text-sm uppercase">
                    Profession
                  </label>
                  <select
                    id="job"
                    {...register("job")}
                    className="bg-gray-800 border border-gray-700 text-white px-4 py-3 rounded-lg focus:outline-none focus:border-[#AD46FF] transition"
                  >
                    <option value="PRODUCER">Producteur</option>
                    <option value="ACTOR">Acteur</option>
                    <option value="DIRECTOR">Réalisateur</option>
                    <option value="WRITER">Scénariste</option>
                    <option value="OTHER">Autre</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Indirizzo */}
            <div>
              <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                <span className="text-[#F6339A]">●</span> Adresse
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Rue */}
                <div className="flex flex-col md:col-span-2">
                  <label htmlFor="street" className="text-white font-semibold mb-2 text-sm uppercase">
                    Rue
                  </label>
                  <input
                    id="street"
                    type="text"
                    placeholder="Adresse"
                    {...register("street")}
                    className="bg-gray-800 border border-gray-700 text-white px-4 py-3 rounded-lg focus:outline-none focus:border-[#AD46FF] transition"
                  />
                </div>

                {/* Code postal */}
                <div className="flex flex-col">
                  <label htmlFor="postalCode" className="text-white font-semibold mb-2 text-sm uppercase">
                    Code postal
                  </label>
                  <input
                    id="postalCode"
                    type="text"
                    placeholder="Code postal"
                    {...register("postalCode")}
                    className="bg-gray-800 border border-gray-700 text-white px-4 py-3 rounded-lg focus:outline-none focus:border-[#AD46FF] transition"
                  />
                </div>

                {/* Ville */}
                <div className="flex flex-col">
                  <label htmlFor="city" className="text-white font-semibold mb-2 text-sm uppercase">
                    Ville
                  </label>
                  <input
                    id="city"
                    type="text"
                    placeholder="Ville"
                    {...register("city")}
                    className="bg-gray-800 border border-gray-700 text-white px-4 py-3 rounded-lg focus:outline-none focus:border-[#AD46FF] transition"
                  />
                </div>

                {/* Paese */}
                <div className="flex flex-col">
                  <label htmlFor="country" className="text-white font-semibold mb-2 text-sm uppercase">
                    Pays
                  </label>
                  <input
                    id="country"
                    type="text"
                    placeholder="Pays"
                    {...register("country")}
                    className="bg-gray-800 border border-gray-700 text-white px-4 py-3 rounded-lg focus:outline-none focus:border-[#AD46FF] transition"
                  />
                </div>
              </div>
            </div>

            {/* Professionnel */}
            <div>
              <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                <span className="text-[#AD46FF]">●</span> Profil professionnel
              </h2>
              
              <div className="space-y-6">
                {/* Biographie */}
                <div className="flex flex-col">
                  <label htmlFor="biography" className="text-white font-semibold mb-2 text-sm uppercase">
                    Biographie
                  </label>
                  <textarea
                    id="biography"
                    placeholder="Parlez-nous de vous..."
                    rows="4"
                    {...register("biography")}
                    className="bg-gray-800 border border-gray-700 text-white px-4 py-3 rounded-lg focus:outline-none focus:border-[#AD46FF] transition resize-none"
                  />
                </div>

                {/* Portfolio */}
                <div className="flex flex-col">
                  <label htmlFor="portfolio" className="text-white font-semibold mb-2 text-sm uppercase">
                    Portfolio (URL)
                  </label>
                  <input
                    id="portfolio"
                    type="text"
                    placeholder="https://votre-portfolio.com"
                    {...register("portfolio")}
                    className="bg-gray-800 border border-gray-700 text-white px-4 py-3 rounded-lg focus:outline-none focus:border-[#AD46FF] transition"
                  />
                </div>
              </div>
            </div>

            {/* Réseaux sociaux */}
            <div>
              <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                <span className="text-[#F6339A]">●</span> Réseaux sociaux
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* YouTube */}
                <div className="flex flex-col">
                  <label htmlFor="youtube" className="text-white font-semibold mb-2 text-sm uppercase">
                    YouTube
                  </label>
                  <input
                    id="youtube"
                    type="text"
                    placeholder="Chaîne YouTube"
                    {...register("youtube")}
                    className="bg-gray-800 border border-gray-700 text-white px-4 py-3 rounded-lg focus:outline-none focus:border-[#AD46FF] transition"
                  />
                </div>

                {/* Instagram */}
                <div className="flex flex-col">
                  <label htmlFor="instagram" className="text-white font-semibold mb-2 text-sm uppercase">
                    Instagram
                  </label>
                  <input
                    id="instagram"
                    type="text"
                    placeholder="@instagram"
                    {...register("instagram")}
                    className="bg-gray-800 border border-gray-700 text-white px-4 py-3 rounded-lg focus:outline-none focus:border-[#AD46FF] transition"
                  />
                </div>

                {/* LinkedIn */}
                <div className="flex flex-col">
                  <label htmlFor="linkedin" className="text-white font-semibold mb-2 text-sm uppercase">
                    LinkedIn
                  </label>
                  <input
                    id="linkedin"
                    type="text"
                    placeholder="Profil LinkedIn"
                    {...register("linkedin")}
                    className="bg-gray-800 border border-gray-700 text-white px-4 py-3 rounded-lg focus:outline-none focus:border-[#AD46FF] transition"
                  />
                </div>

                {/* Facebook */}
                <div className="flex flex-col">
                  <label htmlFor="facebook" className="text-white font-semibold mb-2 text-sm uppercase">
                    Facebook
                  </label>
                  <input
                    id="facebook"
                    type="text"
                    placeholder="Profil Facebook"
                    {...register("facebook")}
                    className="bg-gray-800 border border-gray-700 text-white px-4 py-3 rounded-lg focus:outline-none focus:border-[#AD46FF] transition"
                  />
                </div>

                {/* TikTok */}
                <div className="flex flex-col">
                  <label htmlFor="tiktok" className="text-white font-semibold mb-2 text-sm uppercase">
                    TikTok
                  </label>
                  <input
                    id="tiktok"
                    type="text"
                    placeholder="@tiktok"
                    {...register("tiktok")}
                    className="bg-gray-800 border border-gray-700 text-white px-4 py-3 rounded-lg focus:outline-none focus:border-[#AD46FF] transition"
                  />
                </div>

                {/* Connu par MarsAI */}
                <div className="flex flex-col">
                  <label htmlFor="knownByMarsAi" className="text-white font-semibold mb-2 text-sm uppercase">
                    Connu par MarsAI ?
                  </label>
                  <select
                    id="knownByMarsAi"
                    {...register("knownByMarsAi")}
                    className="bg-gray-800 border border-gray-700 text-white px-4 py-3 rounded-lg focus:outline-none focus:border-[#AD46FF] transition"
                  >
                    <option value="">-- Sélectionner --</option>
                    <option value="YES">Oui</option>
                    <option value="NO">Non</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Hidden role field */}
            <input type="hidden" {...register("role")} defaultValue="PRODUCER" />

            {/* Boutons d'action */}
            <div className="flex flex-col gap-4 pt-8 border-t border-gray-700">
              <button
                type="submit"
                disabled={registerMutation.isPending}
                className="w-full bg-gradient-to-r from-[#AD46FF] to-[#F6339A] text-white font-bold py-4 rounded-lg uppercase hover:opacity-90 transition disabled:opacity-50"
              >
                {registerMutation.isPending ? "Inscription en cours..." : "S'inscrire"}
              </button>

              <p className="text-center text-gray-400">
                Vous avez déjà un compte ?{" "}
                <Link to="/auth/login" className="text-[#AD46FF] hover:text-[#F6339A] font-semibold transition">
                  Se connecter
                </Link>
              </p>
            </div>

            {registerMutation.isError && (
              <div className="bg-red-900/30 border border-red-600 text-red-300 px-4 py-3 rounded-lg">
                Erreur lors de l'inscription. Veuillez réessayer.
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
}
