import { Link, useNavigate } from "react-router";
import { signIn, login } from "../../api/auth.js";
import { useMutation } from "@tanstack/react-query";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import * as z from "zod";

/**
 * Schéma de validation pour le formulaire d'enregistrement
 * Valide tous les champs du profil utilisateur
 */
const registerSchema = z.object({
  firstName: z.string().min(1, "validation.firstName.required"),
  lastName: z.string().min(1, "validation.lastName.required"),
  email: z.string().email("validation.email.invalid"),
  password: z.string().min(6, "validation.password.minLength"),
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
    resolver: zodResolver(registerSchema),
    defaultValues: { role: "PRODUCER", job: "PRODUCER" },
  });

  /**
   * Mutation pour envoyer les données d'enregistrement au backend
   * Après succès, effectue un auto-login automatique
   */
  const registerMutation = useMutation({
    mutationFn: async (data) => {
      return await signIn({
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        password: data.password,
        phone: data.phone,
        mobile: data.mobile,
        birthDate: data.birthDate,
        street: data.street,
        postalCode: data.postalCode,
        city: data.city,
        country: data.country,
        biography: data.biography,
        job: data.job || "PRODUCER",
        portfolio: data.portfolio,
        youtube: data.youtube,
        instagram: data.instagram,
        linkedin: data.linkedin,
        facebook: data.facebook,
        tiktok: data.tiktok,
        knownByMarsAi: data.knownByMarsAi,
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
        alert(t('messages.registrationError'));
        navigate("/auth/login");
      }
    },
  });

  function onSubmit(data) {
    return registerMutation.mutate(data);
  }

  return (
    <div className="min-h-screen bg-black text-white font-light pt-28 pb-20 px-4 md:pt-32">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-10">
          <p className="text-sm uppercase tracking-widest text-gray-400">Producer</p>
          <h1 className="text-5xl font-bold mt-2">{t('forms.register.pageTitle')}</h1>
          <p className="text-gray-400 text-base mt-4">
            {t('forms.register.subtitle')}
          </p>
        </div>

        <div className="bg-gray-900 rounded-2xl p-8 border border-gray-800 shadow-2xl">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-10">
            {/* Mon Profil */}
            <section>
              <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                <span className="text-[#F6339A]">●</span> {t('forms.register.sections.profile')}
              </h2>
              <p className="text-sm uppercase tracking-widest text-gray-400 mb-4">Director</p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex flex-col">
                  <label htmlFor="lastName" className="text-white font-semibold mb-2 text-sm uppercase">
                    {t('forms.register.labels.lastName')} *
                  </label>
                  <input
                    id="lastName"
                    type="text"
                    placeholder={t('forms.register.placeholders.lastName')}
                    {...register("lastName")}
                    className="bg-gray-800 border border-gray-700 text-white px-4 py-3 rounded-lg focus:outline-none focus:border-[#AD46FF] transition"
                  />
                  {errors.lastName && <p className="text-red-400 text-sm mt-1">{t(errors.lastName.message)}</p>}
                </div>

                <div className="flex flex-col">
                  <label htmlFor="firstName" className="text-white font-semibold mb-2 text-sm uppercase">
                    {t('forms.register.labels.firstName')} *
                  </label>
                  <input
                    id="firstName"
                    type="text"
                    placeholder={t('forms.register.placeholders.firstName')}
                    {...register("firstName")}
                    className="bg-gray-800 border border-gray-700 text-white px-4 py-3 rounded-lg focus:outline-none focus:border-[#AD46FF] transition"
                  />
                  {errors.firstName && <p className="text-red-400 text-sm mt-1">{t(errors.firstName.message)}</p>}
                </div>

                <div className="flex flex-col">
                  <label htmlFor="email" className="text-white font-semibold mb-2 text-sm uppercase">
                    {t('forms.register.labels.email')} *
                  </label>
                  <input
                    id="email"
                    type="email"
                    placeholder={t('forms.register.placeholders.email')}
                    {...register("email")}
                    className="bg-gray-800 border border-gray-700 text-white px-4 py-3 rounded-lg focus:outline-none focus:border-[#AD46FF] transition"
                  />
                  {errors.email && <p className="text-red-400 text-sm mt-1">{t(errors.email.message)}</p>}
                </div>

                <div className="flex flex-col">
                  <label htmlFor="phone" className="text-white font-semibold mb-2 text-sm uppercase">
                    {t('forms.register.labels.phone')} *
                  </label>
                  <input
                    id="phone"
                    type="text"
                    placeholder={t('forms.register.placeholders.phone')}
                    {...register("phone")}
                    className="bg-gray-800 border border-gray-700 text-white px-4 py-3 rounded-lg focus:outline-none focus:border-[#AD46FF] transition"
                  />
                </div>

                <div className="flex flex-col">
                  <label htmlFor="birthDate" className="text-white font-semibold mb-2 text-sm uppercase">
                    {t('forms.register.labels.birthDate')} *
                  </label>
                  <input
                    id="birthDate"
                    type="date"
                    {...register("birthDate")}
                    className="bg-gray-800 border border-gray-700 text-white px-4 py-3 rounded-lg focus:outline-none focus:border-[#AD46FF] transition"
                  />
                </div>

                <div className="flex flex-col">
                  <label htmlFor="street" className="text-white font-semibold mb-2 text-sm uppercase">
                    {t('forms.register.labels.street')}
                  </label>
                  <input
                    id="street"
                    type="text"
                    placeholder={t('forms.register.placeholders.street')}
                    {...register("street")}
                    className="bg-gray-800 border border-gray-700 text-white px-4 py-3 rounded-lg focus:outline-none focus:border-[#AD46FF] transition"
                  />
                </div>

                <div className="flex flex-col">
                  <label htmlFor="city" className="text-white font-semibold mb-2 text-sm uppercase">
                    {t('forms.register.labels.city')} *
                  </label>
                  <input
                    id="city"
                    type="text"
                    placeholder={t('forms.register.placeholders.city')}
                    {...register("city")}
                    className="bg-gray-800 border border-gray-700 text-white px-4 py-3 rounded-lg focus:outline-none focus:border-[#AD46FF] transition"
                  />
                </div>

                <div className="flex flex-col">
                  <label htmlFor="postalCode" className="text-white font-semibold mb-2 text-sm uppercase">
                    {t('forms.register.labels.postalCode')} *
                  </label>
                  <input
                    id="postalCode"
                    type="text"
                    placeholder={t('forms.register.placeholders.postalCode')}
                    {...register("postalCode")}
                    className="bg-gray-800 border border-gray-700 text-white px-4 py-3 rounded-lg focus:outline-none focus:border-[#AD46FF] transition"
                  />
                </div>

                <div className="flex flex-col">
                  <label htmlFor="country" className="text-white font-semibold mb-2 text-sm uppercase">
                    {t('forms.register.labels.country')} *
                  </label>
                  <input
                    id="country"
                    type="text"
                    placeholder={t('forms.register.placeholders.country')}
                    {...register("country")}
                    className="bg-gray-800 border border-gray-700 text-white px-4 py-3 rounded-lg focus:outline-none focus:border-[#AD46FF] transition"
                  />
                </div>

                <div className="flex flex-col md:col-span-2">
                  <label htmlFor="biography" className="text-white font-semibold mb-2 text-sm uppercase">
                    {t('forms.register.labels.biography')}
                  </label>
                  <textarea
                    id="biography"
                    rows="4"
                    placeholder={t('forms.register.placeholders.biography')}
                    {...register("biography")}
                    className="bg-gray-800 border border-gray-700 text-white px-4 py-3 rounded-lg focus:outline-none focus:border-[#AD46FF] transition resize-none"
                  />
                </div>

                <div className="flex flex-col">
                  <label htmlFor="job" className="text-white font-semibold mb-2 text-sm uppercase">
                    {t('forms.register.labels.job')}
                  </label>
                  <select
                    id="job"
                    {...register("job")}
                    className="bg-gray-800 border border-gray-700 text-white px-4 py-3 rounded-lg focus:outline-none focus:border-[#AD46FF] transition"
                  >
                    <option value="ACTOR">{t('forms.register.jobOptions.ACTOR')}</option>
                    <option value="DIRECTOR">{t('forms.register.jobOptions.DIRECTOR')}</option>
                    <option value="PRODUCER">{t('forms.register.jobOptions.PRODUCER')}</option>
                    <option value="WRITER">{t('forms.register.jobOptions.WRITER')}</option>
                    <option value="OTHER">{t('forms.register.jobOptions.OTHER')}</option>
                  </select>
                </div>

                <div className="flex flex-col">
                  <label htmlFor="portfolio" className="text-white font-semibold mb-2 text-sm uppercase">
                    {t('forms.register.labels.portfolio')}
                  </label>
                  <input
                    id="portfolio"
                    type="text"
                    placeholder={t('forms.register.placeholders.portfolio')}
                    {...register("portfolio")}
                    className="bg-gray-800 border border-gray-700 text-white px-4 py-3 rounded-lg focus:outline-none focus:border-[#AD46FF] transition"
                  />
                </div>

                <div className="flex flex-col">
                  <label htmlFor="youtube" className="text-white font-semibold mb-2 text-sm uppercase">
                    {t('forms.register.labels.youtube')}
                  </label>
                  <input
                    id="youtube"
                    type="text"
                    placeholder={t('forms.register.placeholders.youtube')}
                    {...register("youtube")}
                    className="bg-gray-800 border border-gray-700 text-white px-4 py-3 rounded-lg focus:outline-none focus:border-[#AD46FF] transition"
                  />
                </div>

                <div className="flex flex-col">
                  <label htmlFor="instagram" className="text-white font-semibold mb-2 text-sm uppercase">
                    {t('forms.register.labels.instagram')}
                  </label>
                  <input
                    id="instagram"
                    type="text"
                    placeholder={t('forms.register.placeholders.instagram')}
                    {...register("instagram")}
                    className="bg-gray-800 border border-gray-700 text-white px-4 py-3 rounded-lg focus:outline-none focus:border-[#AD46FF] transition"
                  />
                </div>

                <div className="flex flex-col">
                  <label htmlFor="linkedin" className="text-white font-semibold mb-2 text-sm uppercase">
                    {t('forms.register.labels.linkedin')}
                  </label>
                  <input
                    id="linkedin"
                    type="text"
                    placeholder={t('forms.register.placeholders.linkedin')}
                    {...register("linkedin")}
                    className="bg-gray-800 border border-gray-700 text-white px-4 py-3 rounded-lg focus:outline-none focus:border-[#AD46FF] transition"
                  />
                </div>

                <div className="flex flex-col">
                  <label htmlFor="facebook" className="text-white font-semibold mb-2 text-sm uppercase">
                    {t('forms.register.labels.facebook')}
                  </label>
                  <input
                    id="facebook"
                    type="text"
                    placeholder={t('forms.register.placeholders.facebook')}
                    {...register("facebook")}
                    className="bg-gray-800 border border-gray-700 text-white px-4 py-3 rounded-lg focus:outline-none focus:border-[#AD46FF] transition"
                  />
                </div>

                <div className="flex flex-col">
                  <label htmlFor="tiktok" className="text-white font-semibold mb-2 text-sm uppercase">
                    {t('forms.register.labels.tiktok')}
                  </label>
                  <input
                    id="tiktok"
                    type="text"
                    placeholder={t('forms.register.placeholders.tiktok')}
                    {...register("tiktok")}
                    className="bg-gray-800 border border-gray-700 text-white px-4 py-3 rounded-lg focus:outline-none focus:border-[#AD46FF] transition"
                  />
                </div>

                <div className="flex flex-col md:col-span-2">
                  <label htmlFor="password" className="text-white font-semibold mb-2 text-sm uppercase">
                    {t('forms.register.labels.password')} *
                  </label>
                  <input
                    id="password"
                    type="password"
                    placeholder={t('forms.register.placeholders.password')}
                    {...register("password")}
                    className="bg-gray-800 border border-gray-700 text-white px-4 py-3 rounded-lg focus:outline-none focus:border-[#AD46FF] transition"
                  />
                  {errors.password && <p className="text-red-400 text-sm mt-1">{t(errors.password.message)}</p>}
                </div>
              </div>
            </section>

            {/* Hidden role field */}
            <input type="hidden" {...register("role")} defaultValue="PRODUCER" />

            <div className="flex flex-col gap-4 pt-4">
              <button
                type="submit"
                disabled={registerMutation.isPending}
                className="w-full bg-gradient-to-r from-[#AD46FF] to-[#F6339A] text-white font-bold py-4 rounded-lg uppercase hover:opacity-90 transition disabled:opacity-50"
              >
                {registerMutation.isPending ? `${t('forms.register.buttons.submit')}...` : t('forms.register.buttons.submit')}
              </button>
              <div className="text-center text-sm text-gray-400">
                {t('forms.login.links.noAccount')}
                <Link
                  to="/auth/login"
                  className="ml-2 inline-flex items-center justify-center border border-gray-700 text-white px-4 py-2 rounded-lg hover:border-[#AD46FF] transition"
                >
                  {t('forms.login.links.register')}
                </Link>
              </div>
            </div>

            {registerMutation.isError && (
              <div className="bg-red-900/30 border border-red-600 text-red-300 px-4 py-3 rounded-lg">
                {registerMutation.error?.response?.data?.error
                  || registerMutation.error?.message
                  || t('validation.submissionError')}
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
}