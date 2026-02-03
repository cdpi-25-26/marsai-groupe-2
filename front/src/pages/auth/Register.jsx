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
  const { register, handleSubmit } = useForm({
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

        <label htmlFor="phone" className="text-sm font-medium">Téléphone</label>
        <input id="phone" type="text" placeholder="Téléphone" {...register("phone")} />

        <label htmlFor="mobile" className="text-sm font-medium">Mobile</label>
        <input id="mobile" type="text" placeholder="Mobile" {...register("mobile")} />

        <label htmlFor="birthDate" className="text-sm font-medium">Date de naissance</label>
        <input id="birthDate" type="date" {...register("birthDate")} />

        <label htmlFor="street" className="text-sm font-medium">Rue</label>
        <input id="street" type="text" placeholder="Rue" {...register("street")} />

        <label htmlFor="postalCode" className="text-sm font-medium">Code postal</label>
        <input id="postalCode" type="text" placeholder="Code postal" {...register("postalCode")} />

        <label htmlFor="city" className="text-sm font-medium">Ville</label>
        <input id="city" type="text" placeholder="Ville" {...register("city")} />

        <label htmlFor="country" className="text-sm font-medium">Pays</label>
        <input id="country" type="text" placeholder="Pays" {...register("country")} />

        <label htmlFor="biography" className="text-sm font-medium">Biographie</label>
        <textarea id="biography" placeholder="Biographie" {...register("biography")} />

        <label htmlFor="job" className="text-sm font-medium">Profession</label>
        <select id="job" {...register("job")}> 
          <option value="PRODUCER">Producteur</option>
          <option value="ACTOR">Acteur</option>
          <option value="DIRECTOR">Réalisateur</option>
          <option value="WRITER">Scénariste</option>
          <option value="OTHER">Autre</option>
        </select>

        <label htmlFor="portfolio" className="text-sm font-medium">Portfolio</label>
        <input id="portfolio" type="text" placeholder="Portfolio" {...register("portfolio")} />

        <label htmlFor="youtube" className="text-sm font-medium">YouTube</label>
        <input id="youtube" type="text" placeholder="YouTube" {...register("youtube")} />

        <label htmlFor="instagram" className="text-sm font-medium">Instagram</label>
        <input id="instagram" type="text" placeholder="Instagram" {...register("instagram")} />

        <label htmlFor="linkedin" className="text-sm font-medium">LinkedIn</label>
        <input id="linkedin" type="text" placeholder="LinkedIn" {...register("linkedin")} />

        <label htmlFor="facebook" className="text-sm font-medium">Facebook</label>
        <input id="facebook" type="text" placeholder="Facebook" {...register("facebook")} />

        <label htmlFor="tiktok" className="text-sm font-medium">TikTok</label>
        <input id="tiktok" type="text" placeholder="TikTok" {...register("tiktok")} />

        <label htmlFor="knownByMarsAi" className="text-sm font-medium">Connu par MarsAI ?</label>
        <select id="knownByMarsAi" {...register("knownByMarsAi")}> 
          <option value="">--</option>
          <option value="YES">Oui</option>
          <option value="NO">Non</option>
        </select>

        <input type="hidden" {...register("role")} defaultValue="PRODUCER" />

        <button type="submit">S'inscrire</button>
      </form>
      <Link to="/auth/login">Vous avez déjà un compte ? Se connecter</Link>
    </>
  );
}
