import { Link, useNavigate } from "react-router";
import { login } from "../../api/auth.js";
import { useMutation } from "@tanstack/react-query";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { useTranslation } from "react-i18next";
import Navbar from "../../components/Navbar.jsx";

const loginSchema = z.object({
  email:    z.string().email("validation.invalidEmail"),
  password: z.string().min(1, "validation.required"),
});

export function Login() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(loginSchema),
  });

  /* ── Already logged in ── */
  const storedEmail = localStorage.getItem("email");
  if (storedEmail && storedEmail !== "undefined" && storedEmail !== "null") {
    return (
      <div className="min-h-screen bg-[#06080d] flex items-center justify-center p-6">
        <div className="text-center flex flex-col items-center gap-4">
          <p className="text-white/50 text-sm">{t("common.alreadyLoggedIn", { email: storedEmail })}</p>
          <Link to="/" className="text-[#AD46FF] hover:text-[#F6339A] text-sm font-medium transition-colors">
            {t("common.goHome")}
          </Link>
        </div>
      </div>
    );
  }

  if (storedEmail === "undefined" || storedEmail === "null") {
    ["email","firstName","lastName","role","token"].forEach((k) => localStorage.removeItem(k));
  }

  /* ── Logic inchangée ── */
  const loginMutation = useMutation({
    mutationFn: async (data) => await login(data),
    onSuccess: (response) => {
      const userData = response.data?.data || response.data;
      if (!userData?.token || !userData?.email) {
        ["email","firstName","lastName","role","token"].forEach((k) => localStorage.removeItem(k));
        alert(t("forms.login.errors.missingUserData"));
        return;
      }
      localStorage.setItem("email",     userData.email);
      localStorage.setItem("firstName", userData.first_name || "");
      localStorage.setItem("role",      userData.role);
      localStorage.setItem("token",     userData.token);
      const paths = { ADMIN: "/admin", JURY: "/jury", PRODUCER: "/producer" };
      navigate(paths[userData.role] || "/");
    },
    onError: (error) => {
      if (error?.response?.status === 401) { alert(t("forms.login.errors.invalidCredentials")); return; }
      alert(error?.response?.data?.error || t("forms.login.errors.loginFailed"));
    },
  });

  return (
    <>
    <Navbar />
    <div className="min-h-screen bg-[#06080d] text-white flex items-center justify-center px-4 py-24 overflow-hidden relative">

      

      {/* Ambient glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] rounded-full bg-gradient-to-r from-[#AD46FF]/8 to-[#F6339A]/8 blur-3xl pointer-events-none" />

      <div className="relative z-10 w-full max-w-md">

        {/* ── Hero header ── */}
        <div className="mb-10 text-center flex flex-col items-center gap-1">
          <span className="inline-flex items-center gap-2 text-[10px] tracking-[0.35em] uppercase text-[#AD46FF]/60 font-medium">
            <span className="w-1.5 h-1.5 rounded-full bg-[#AD46FF]/60 animate-pulse" />
            Festival MARS AI · Édition 2026
          </span>

          <h1 className="text-4xl sm:text-5xl font-black tracking-tight leading-none">
            <span className="text-white">{t("forms.login.title") || "Connexion"}</span>
          </h1>

          <p className="text-white/35 text-sm">
            {t("forms.login.subtitle") || "Accédez à votre espace MarsAI"}
          </p>

          <div className="flex items-center gap-3">
            <div className="h-px w-16 bg-gradient-to-r from-transparent to-[#AD46FF]/40" />
            <div className="w-1 h-1 rounded-full bg-[#AD46FF]/50" />
            <div className="h-px w-16 bg-gradient-to-l from-transparent to-[#F6339A]/40" />
          </div>
        </div>

        {/* ── Form card ── */}
        <div className="bg-white/[0.04] border border-white/8 rounded-3xl p-8 shadow-[0_24px_60px_rgba(0,0,0,0.5)]">
          <form onSubmit={handleSubmit((data) => loginMutation.mutate(data))} className="space-y-5">
            <input type="hidden" id="id" {...register("id")} />

            {/* Email */}
            <div className="flex flex-col gap-1.5">
              <label htmlFor="email" className="text-[9px] uppercase tracking-[0.25em] text-white/40 font-semibold">
                {t("forms.login.email") || "Email"}
              </label>
              <input
                id="email" type="email"
                placeholder={t("forms.login.placeholders.email") || "votre@email.com"}
                {...register("email")} required
                className={`w-full bg-white/[0.05] border text-white px-4 py-3 rounded-xl text-sm outline-none transition-all duration-200 placeholder:text-white/20
                  ${errors.email
                    ? "border-red-500/40 bg-red-500/[0.05] focus:border-red-500/60"
                    : "border-white/10 hover:border-[#AD46FF]/30 focus:border-[#AD46FF]/50 focus:bg-white/[0.07]"}`}
              />
              {errors.email && <p className="text-[11px] text-red-400/80">{t(errors.email.message)}</p>}
            </div>

            {/* Password */}
            <div className="flex flex-col gap-1.5">
              <label htmlFor="password" className="text-[9px] uppercase tracking-[0.25em] text-white/40 font-semibold">
                {t("forms.login.password") || "Mot de passe"}
              </label>
              <input
                id="password" type="password"
                placeholder="••••••••"
                {...register("password")} required
                className={`w-full bg-white/[0.05] border text-white px-4 py-3 rounded-xl text-sm outline-none transition-all duration-200 placeholder:text-white/20
                  ${errors.password
                    ? "border-red-500/40 bg-red-500/[0.05] focus:border-red-500/60"
                    : "border-white/10 hover:border-[#AD46FF]/30 focus:border-[#AD46FF]/50 focus:bg-white/[0.07]"}`}
              />
              {errors.password && <p className="text-[11px] text-red-400/80">{t(errors.password.message)}</p>}
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loginMutation.isPending}
              className="w-full py-3.5 mt-2 bg-gradient-to-r from-[#AD46FF] to-[#F6339A] text-white font-bold rounded-xl text-sm tracking-wide transition-all duration-200 hover:shadow-[0_0_28px_rgba(173,70,255,0.4)] hover:scale-[1.01] active:scale-[0.99] disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:scale-100"
            >
              {loginMutation.isPending ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                  Connexion…
                </span>
              ) : (t("forms.login.buttons.submit") || "Se connecter")}
            </button>

            {/* Register link */}
            <p className="text-center text-xs text-white/25 pt-1">
              {t("forms.login.links.noAccount") || "Pas encore de compte ?"}{" "}
              <Link to="/auth/register" className="text-[#AD46FF]/80 hover:text-[#AD46FF] font-semibold transition-colors">
                {t("forms.login.links.register") || "S'inscrire"}
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
    </>
  );
}