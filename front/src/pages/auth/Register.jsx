import { Link, useNavigate } from "react-router";
import { signIn, login } from "../../api/auth.js";
import { useMutation } from "@tanstack/react-query";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import Navbar from "../../components/Navbar.jsx";
import * as z from "zod";

const registerSchema = z.object({
  firstName:    z.string().min(1, "validation.firstName.required"),
  lastName:     z.string().min(1, "validation.lastName.required"),
  email:        z.string().email("validation.email.invalid"),
  password:     z.string().min(6, "validation.password.minLength"),
  phone:        z.string().optional(),
  mobile:       z.string().optional(),
  birthDate:    z.string().optional(),
  street:       z.string().optional(),
  postalCode:   z.string().optional(),
  city:         z.string().optional(),
  country:      z.string().optional(),
  biography:    z.string().optional(),
  job:          z.enum(["ACTOR","DIRECTOR","PRODUCER","WRITER","OTHER"]).optional(),
  portfolio:    z.string().optional(),
  youtube:      z.string().optional(),
  instagram:    z.string().optional(),
  linkedin:     z.string().optional(),
  facebook:     z.string().optional(),
  tiktok:       z.string().optional(),
  knownByMarsAi: z.enum(["YES","NO"]).optional(),
  role:         z.string().optional().default("PRODUCER"),
});

export function Register() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(registerSchema),
    defaultValues: { role: "PRODUCER", job: "PRODUCER" },
  });

  /* ── Already logged in ── */
  if (localStorage.getItem("email")) {
    return (
      <div className="min-h-screen bg-[#06080d] flex items-center justify-center p-6">
        <div className="text-center flex flex-col items-center gap-4">
          <p className="text-white/50 text-sm">{t("common.alreadyLoggedIn", { email: localStorage.getItem("email") })}</p>
          <Link to="/" className="text-[#AD46FF] hover:text-[#F6339A] text-sm font-medium transition-colors">
            {t("common.goHome")}
          </Link>
        </div>
      </div>
    );
  }

  /* ── Logic inchangée ── */
  const registerMutation = useMutation({
    mutationFn: async (data) => await signIn({
      firstName: data.firstName, lastName: data.lastName,
      email: data.email, password: data.password,
      phone: data.phone, mobile: data.mobile, birthDate: data.birthDate,
      street: data.street, postalCode: data.postalCode, city: data.city,
      country: data.country, biography: data.biography,
      job: data.job || "PRODUCER", portfolio: data.portfolio,
      youtube: data.youtube, instagram: data.instagram,
      linkedin: data.linkedin, facebook: data.facebook, tiktok: data.tiktok,
      knownByMarsAi: data.knownByMarsAi, role: data.role || "PRODUCER",
    }),
    onSuccess: async (data, variables) => {
      try {
        const loginRes = await login({ email: variables.email, password: variables.password });
        const userData = loginRes.data?.data || loginRes.data;
        if (!userData?.token || !userData?.email) {
          ["email","firstName","lastName","role","token"].forEach((k) => localStorage.removeItem(k));
          alert(t("messages.registrationSuccessButLoginFailed"));
          navigate("/auth/login");
          return;
        }
        localStorage.setItem("email",     userData.email);
        localStorage.setItem("firstName", userData.first_name || "");
        localStorage.setItem("lastName",  userData.last_name  || "");
        localStorage.setItem("role",      userData.role);
        localStorage.setItem("token",     userData.token);
        navigate("/producer");
      } catch {
        alert(t("messages.registrationError"));
        navigate("/auth/login");
      }
    },
  });

  return (
    <>
    <Navbar />
    <div className="min-h-screen bg-[#06080d] text-white pt-28 pb-24 px-4 md:pt-32 overflow-hidden relative">

      {/* Ambient glow */}
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] rounded-full bg-gradient-to-r from-[#AD46FF]/6 to-[#F6339A]/6 blur-3xl pointer-events-none" />

      <div className="relative z-10 max-w-5xl mx-auto">

        {/* ── Hero header ── */}
        <div className="mb-12">
          <span className="inline-flex items-center gap-2 text-[10px] tracking-[0.35em] uppercase text-[#AD46FF]/60 font-medium mb-4">
            <span className="w-1.5 h-1.5 rounded-full bg-[#AD46FF]/60 animate-pulse" />
            Festival MARS AI · Édition 2026
          </span>

          <h1 className="text-4xl sm:text-5xl font-black tracking-tight leading-none">
            <span className="text-white">{t("forms.register.title") || "Inscription"} </span>
            <span className="bg-gradient-to-r from-[#AD46FF] to-[#F6339A] bg-clip-text text-transparent">
              {t("forms.register.titleAccent") || "Producteur"}
            </span>
          </h1>

          <p className="text-white/35 text-sm mt-3 max-w-lg">
            {t("forms.register.subtitle1") || "Créez votre espace producteur ."}
          </p>

          <div className="mt-6 h-px bg-gradient-to-r from-[#AD46FF]/20 via-white/5 to-transparent" />
        </div>

        {/* ── Form ── */}
        <form onSubmit={handleSubmit((data) => registerMutation.mutate(data))} className="space-y-6">

          {/* ═══ Section : Profil ═══ */}
          <div className="bg-white/[0.03] border border-white/8 rounded-2xl overflow-hidden">
            <div className="flex items-center gap-3 px-6 py-4 border-b border-white/6">
              <div className="w-8 h-8 rounded-xl bg-[#AD46FF]/10 border border-[#AD46FF]/20 flex items-center justify-center">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#AD46FF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="8" r="4"/><path d="M5 20v-1a7 7 0 0 1 14 0v1"/>
                </svg>
              </div>
              <p className="text-[11px] tracking-widest uppercase text-white/60 font-semibold">
                {t("forms.register.sections.profile") || "Profil"}
              </p>
            </div>

            <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <Field label={`${t("forms.register.labels.lastName") || "Nom"} *`} error={errors.lastName?.message && t(errors.lastName.message)}>
                <input type="text" placeholder={t("forms.register.placeholders.lastName") || "Nom"} {...register("lastName")} className={inp(!!errors.lastName)} />
              </Field>

              <Field label={`${t("forms.register.labels.firstName") || "Prénom"} *`} error={errors.firstName?.message && t(errors.firstName.message)}>
                <input type="text" placeholder={t("forms.register.placeholders.firstName") || "Prénom"} {...register("firstName")} className={inp(!!errors.firstName)} />
              </Field>

              <Field label={`${t("forms.register.labels.email") || "Email"} *`} error={errors.email?.message && t(errors.email.message)}>
                <input type="email" placeholder={t("forms.register.placeholders.email") || "votre@email.com"} {...register("email")} className={inp(!!errors.email)} />
              </Field>

              <Field label={`${t("forms.register.labels.password") || "Mot de passe"} *`} error={errors.password?.message && t(errors.password.message)}>
                <input type="password" placeholder="••••••••" {...register("password")} className={inp(!!errors.password)} />
              </Field>

              <Field label={t("forms.register.labels.phone") || "Téléphone"}>
                <input type="text" placeholder={t("forms.register.placeholders.phone") || "+33 6 00 00 00 00"} {...register("phone")} className={inp(false)} />
              </Field>

              <Field label={t("forms.register.labels.birthDate") || "Date de naissance"}>
                <input type="date" {...register("birthDate")} className={`${inp(false)} [color-scheme:dark]`} />
              </Field>

              <Field label={t("forms.register.labels.street") || "Rue"}>
                <input type="text" placeholder={t("forms.register.placeholders.street") || "Adresse"} {...register("street")} className={inp(false)} />
              </Field>

              <Field label={t("forms.register.labels.city") || "Ville"}>
                <input type="text" placeholder={t("forms.register.placeholders.city") || "Paris"} {...register("city")} className={inp(false)} />
              </Field>

              <Field label={t("forms.register.labels.postalCode") || "Code postal"}>
                <input type="text" placeholder={t("forms.register.placeholders.postalCode") || "75000"} {...register("postalCode")} className={inp(false)} />
              </Field>

              <Field label={t("forms.register.labels.country") || "Pays"}>
                <input type="text" placeholder={t("forms.register.placeholders.country") || "France"} {...register("country")} className={inp(false)} />
              </Field>

              <Field label={t("forms.register.labels.job") || "Métier"}>
                <select {...register("job")} className={inp(false)}>
                  <option value="ACTOR">{t("forms.register.jobOptions.ACTOR") || "Acteur"}</option>
                  <option value="DIRECTOR">{t("forms.register.jobOptions.DIRECTOR") || "Réalisateur"}</option>
                  <option value="PRODUCER">{t("forms.register.jobOptions.PRODUCER") || "Producteur"}</option>
                  <option value="WRITER">{t("forms.register.jobOptions.WRITER") || "Scénariste"}</option>
                  <option value="OTHER">{t("forms.register.jobOptions.OTHER") || "Autre"}</option>
                </select>
              </Field>

              <Field label={t("forms.register.labels.socialLink") || "Site web / réseau social"} className="md:col-span-2">
                <input type="text" placeholder="https://siteweb.com" {...register("portfolio")} className={inp(false)} />
              </Field>

              <Field label={t("forms.register.labels.biography") || "Biographie"} className="md:col-span-2 lg:col-span-3">
                <textarea rows={3} placeholder={t("forms.register.placeholders.biography") || "Parlez-nous de vous…"} {...register("biography")} className={`${inp(false)} resize-none`} />
              </Field>
            </div>
          </div>

          <input type="hidden" {...register("role")} defaultValue="PRODUCER" />

          {/* ── Error ── */}
          {registerMutation.isError && (
            <div className="flex items-center gap-3 bg-red-950/60 border border-red-500/20 text-red-300 px-4 py-3 rounded-xl text-sm">
              <span className="w-1.5 h-1.5 rounded-full bg-red-400 flex-shrink-0" />
              {registerMutation.error?.response?.data?.error || registerMutation.error?.message || t("validation.submissionError")}
            </div>
          )}

          {/* ── Submit ── */}
          <div className="space-y-3 pb-4">
            <button
              type="submit"
              disabled={registerMutation.isPending}
              className="w-full py-4 bg-gradient-to-r from-[#AD46FF] to-[#F6339A] text-white font-bold rounded-2xl text-sm tracking-wide transition-all duration-200 hover:shadow-[0_0_32px_rgba(173,70,255,0.4)] hover:scale-[1.005] active:scale-[0.998] disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:scale-100"
            >
              {registerMutation.isPending ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                  {t("forms.register.buttons.submit") || "Inscription"}…
                </span>
              ) : (t("forms.register.buttons.submit") || "Créer mon compte")}
            </button>

            <p className="text-center text-xs text-white/25">
              Déjà inscrit ?{" "}
              <Link to="/auth/login" className="text-[#AD46FF]/80 hover:text-[#AD46FF] font-semibold transition-colors">
                Se connecter
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
    </>
  );
}

/* ── Helpers ── */
function inp(hasError) {
  return `w-full bg-white/[0.05] border text-white px-3.5 py-2.5 rounded-xl text-sm outline-none transition-all duration-200 placeholder:text-white/20
    ${hasError
      ? "border-red-500/40 bg-red-500/[0.05] focus:border-red-500/60"
      : "border-white/10 hover:border-[#AD46FF]/30 focus:border-[#AD46FF]/50 focus:bg-white/[0.07]"}`;
}

function Field({ label, error, children, className = "" }) {
  return (
    <div className={`flex flex-col gap-1.5 ${className}`}>
      <label className="text-[9px] uppercase tracking-[0.25em] text-white/40 font-semibold">{label}</label>
      {children}
      {error && <p className="text-[11px] text-red-400/80">{error}</p>}
    </div>
  );
}