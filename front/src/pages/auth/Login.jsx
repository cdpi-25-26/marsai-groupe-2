// import { Link, useNavigate } from "react-router";
// import { login } from "../../api/auth.js";
// import { useMutation } from "@tanstack/react-query";
// import { zodResolver } from "@hookform/resolvers/zod";
// import { useForm } from "react-hook-form";
// import * as z from "zod";

// /**
//  * Schéma de validation pour le formulaire de connexion
//  * Valide: email et password
//  */
// const loginSchema = z.object({
//   email: z.string().email("Format d'email invalide"),
//   password: z.string().min(1, "Le mot de passe est requis"),
// });

// /**
//  * Composant Login (Page de connexion)
//  * Affiche un formulaire de connexion pour les utilisateurs existants
//  * Après connexion réussie, stocke le JWT et redirige selon le rôle
//  * @returns {JSX.Element} La page de connexion
//  */
// export function Login() {
//   // Si déjà connecté, afficher un message
//   const storedEmail = localStorage.getItem("email");
//   if (storedEmail && storedEmail !== "undefined" && storedEmail !== "null") {
//     return (
//       <>
//         <h1 className="text-2xl">
//           Vous êtes déjà connecté en tant que {storedEmail}
//         </h1>
//         <Link to="/">Aller à l'accueil</Link>
//       </>
//     );
//   }

//   if (storedEmail === "undefined" || storedEmail === "null") {
//     localStorage.removeItem("email");
//     localStorage.removeItem("firstName");
//     localStorage.removeItem("lastName");
//     localStorage.removeItem("role");
//     localStorage.removeItem("token");
//   }

//   const navigate = useNavigate();

//   // Configuration du formulaire avec react-hook-form et Zod
//   const { register, handleSubmit, formState: { errors } } = useForm({
//     resolver: zodResolver(loginSchema),
//   });

//   /**
//    * Mutation pour envoyer les données de connexion au backend
//    * Stocke le token et les données utilisateur en localStorage
//    * Redirige vers le dashboard selon le rôle
//    */
//   const loginMutation = useMutation({
//     mutationFn: async (data) => {
//       return await login(data);
//     },
//     onSuccess: (response) => {
//       // Sauvegarder le token et les infos utilisateur
//       const userData = response.data?.data || response.data;
//       if (!userData?.token || !userData?.email) {
//         localStorage.removeItem("email");
//         localStorage.removeItem("firstName");
//         localStorage.removeItem("lastName");
//         localStorage.removeItem("role");
//         localStorage.removeItem("token");
//         alert("Connexion invalide: données utilisateur manquantes");
//         return;
//       }
//       localStorage.setItem("email", userData?.email);
//       localStorage.setItem("firstName", userData?.first_name || "");
//       localStorage.setItem("role", userData?.role);
//       localStorage.setItem("token", userData?.token);

//       // Redirection basée sur le rôle
//       switch (userData?.role) {
//         case "ADMIN":
//           navigate("/admin");
//           break;
//         case "JURY":
//           navigate("/jury");
//           break;
//         case "PRODUCER":
//           navigate("/producer");
//           break;
//         default:
//           navigate("/");
//           break;
//       }
//     },
//     onError: (error) => {
//       alert(error.response?.data?.error || "Erreur de connexion");
//     },
//   });

//   /**
//    * Gère la soumission du formulaire de connexion
//    * @param {Object} data - { email, password }
//    */
//   function onSubmit(data) {
//     return loginMutation.mutate(data);
//   }
//   return (
//     <div className="min-h-screen bg-black text-white font-light pt-28 pb-20 px-4 md:pt-32">
//       <div className="max-w-xl mx-auto">
//         <div className="text-center mb-10">
//           <h1 className="text-4xl font-bold mb-2">Connexion</h1>
//           <p className="text-gray-400">Accédez à votre espace MarsAI</p>
//         </div>

//         <div className="bg-gray-900 rounded-2xl p-8 border border-gray-800 shadow-2xl">
//           <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
//             <input type="hidden" id="id" {...register("id")} />

//             <div className="flex flex-col">
//               <label htmlFor="email" className="text-white font-semibold mb-2 text-sm uppercase">
//                 Email
//               </label>
//               <input
//                 id="email"
//                 type="email"
//                 placeholder="Votre email"
//                 {...register("email")}
//                 className="bg-gray-800 border border-gray-700 text-white px-4 py-3 rounded-lg focus:outline-none focus:border-[#AD46FF] transition"
//                 required
//               />
//               {errors.email && (
//                 <p className="text-red-400 text-sm mt-1">{errors.email.message}</p>
//               )}
//             </div>

//             <div className="flex flex-col">
//               <label htmlFor="password" className="text-white font-semibold mb-2 text-sm uppercase">
//                 Mot de passe
//               </label>
//               <input
//                 id="password"
//                 type="password"
//                 placeholder="Votre mot de passe"
//                 {...register("password")}
//                 className="bg-gray-800 border border-gray-700 text-white px-4 py-3 rounded-lg focus:outline-none focus:border-[#AD46FF] transition"
//                 required
//               />
//               {errors.password && (
//                 <p className="text-red-400 text-sm mt-1">{errors.password.message}</p>
//               )}
//             </div>

//             <button
//               type="submit"
//               disabled={loginMutation.isPending}
//               className="w-full bg-linear-to-r from-[#AD46FF] to-[#F6339A] text-white font-bold py-4 rounded-lg uppercase hover:opacity-90 transition disabled:opacity-50"
//             >
//               {loginMutation.isPending ? "Connexion..." : "Se connecter"}
//             </button>

//           </form>
//         </div>
//       </div>
//     </div>
//   );
// }



import { Link, useNavigate } from "react-router";
import { login } from "../../api/auth.js";
import { useMutation } from "@tanstack/react-query";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { useState } from "react";

/**
 * Schéma de validation pour le formulaire de connexion
 * Valide: email et password
 */
const loginSchema = z.object({
  email: z.string().email("Format d'email invalide"),
  password: z.string().min(1, "Le mot de passe est requis"),
});

/**
 * Composant Login (Page de connexion)
 * Affiche un formulaire de connexion pour les utilisateurs existants
 * Après connexion réussie, stocke le JWT et redirige selon le rôle
 * @returns {JSX.Element} La page de connexion
 */
export function Login() {
  const [showPassword, setShowPassword] = useState(false);
  
  // Si déjà connecté, afficher un message
  const storedEmail = localStorage.getItem("email");
  if (storedEmail && storedEmail !== "undefined" && storedEmail !== "null") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#0a0c0f] to-[#0d0f12] flex items-center justify-center p-4">
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8 max-w-md w-full text-center shadow-2xl">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-green-500/20 to-emerald-500/20 border border-white/10 flex items-center justify-center">
            <svg className="w-8 h-8 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h1 className="text-xl text-white mb-2">
            Déjà connecté
          </h1>
          <p className="text-sm text-white/60 mb-6">
            Vous êtes connecté en tant que {storedEmail}
          </p>
          <Link 
            to="/" 
            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600/20 to-purple-600/20 border border-white/10 rounded-xl text-white/80 hover:text-white hover:border-blue-500/30 transition-all duration-200"
          >
            <span>Accueil</span>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
          </Link>
        </div>
      </div>
    );
  }

  if (storedEmail === "undefined" || storedEmail === "null") {
    localStorage.removeItem("email");
    localStorage.removeItem("firstName");
    localStorage.removeItem("lastName");
    localStorage.removeItem("role");
    localStorage.removeItem("token");
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
      const userData = response.data?.data || response.data;
      if (!userData?.token || !userData?.email) {
        localStorage.removeItem("email");
        localStorage.removeItem("firstName");
        localStorage.removeItem("lastName");
        localStorage.removeItem("role");
        localStorage.removeItem("token");
        alert("Connexion invalide: données utilisateur manquantes");
        return;
      }
      localStorage.setItem("email", userData?.email);
      localStorage.setItem("firstName", userData?.first_name || "");
      localStorage.setItem("role", userData?.role);
      localStorage.setItem("token", userData?.token);

      // Redirection basée sur le rôle
      switch (userData?.role) {
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
    <div className="min-h-screen bg-gradient-to-br from-[#0a0c0f] via-[#0c0e11] to-[#0d0f12] flex items-center justify-center p-4 relative overflow-hidden">
      
      {/* Éléments décoratifs - arrière-plan */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        {/* Projecteurs animés */}
        <div className="absolute top-0 -left-20 w-40 h-full bg-gradient-to-r from-transparent via-yellow-500/10 to-transparent rotate-12 animate-pulse" />
        <div className="absolute top-0 -right-20 w-40 h-full bg-gradient-to-l from-transparent via-yellow-500/10 to-transparent -rotate-12 animate-pulse delay-1000" />
        
        {/* Cercles de lumière */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse delay-1000" />
        
        {/* Tapis rouge subtil */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-red-600/10 to-transparent" />
        
        {/* Effet de rideau sur les côtés */}
        <div className="absolute top-0 left-0 bottom-0 w-32 bg-gradient-to-r from-black/40 to-transparent" />
        <div className="absolute top-0 right-0 bottom-0 w-32 bg-gradient-to-l from-black/40 to-transparent" />
      </div>
      
      <div className="max-w-md w-full relative z-10">
        {/* Carte principale */}
        <div className="group relative">
          {/* Effet de halo lumineux autour de la carte */}
          <div className="absolute -inset-1 bg-gradient-to-r from-blue-600/30 via-purple-600/30 to-pink-600/30 rounded-2xl blur-xl opacity-50 group-hover:opacity-75 transition duration-1000" />
          
          {/* Carte avec tout le contenu */}
          <div className="relative backdrop-blur-xl bg-transparent border border-white/20 rounded-2xl p-8 shadow-2xl overflow-hidden">
            
            {/* Effet de brillance principal */}
            {/* <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-all duration-1000 pointer-events-none" />
             */}
            {/* Effets de reflets */}
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/60 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent" />
            <div className="absolute left-0 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-white/40 to-transparent" />
            <div className="absolute right-0 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-white/40 to-transparent" />
            
            {/* Header */}
            <div className="text-center mb-8">
              <h1 className="text-4xl font-light bg-gradient-to-r from-white via-blue-200 to-purple-200 bg-clip-text text-transparent mb-2 tracking-tight">
                Connexion
              </h1>
              <p className="text-sm text-white/50 backdrop-blur-sm px-4 py-2 rounded-full inline-block border border-white/5">
                Accédez à votre espace MarsAI
              </p>
            </div>
            
            {/* Formulaire */}
            <form onSubmit={handleSubmit(onSubmit)} className="relative space-y-6">
              <input type="hidden" id="id" {...register("id")} />

              {/* Champ Email - avec correction autofill améliorée */}
              <div className="flex flex-col">
                <label htmlFor="email" className="text-xs font-medium text-white/70 uppercase tracking-wider mb-2 flex items-center gap-1">
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  Adresse email
                </label>
                <div className="relative">
                  <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/50">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                    </svg>
                  </div>
                  <input
                    id="email"
                    type="email"
                    placeholder="vous@exemple.com"
                    {...register("email")}
                   className="w-full bg-transparent border border-white/20 text-white pl-11 pr-12 py-3 rounded-xl focus:outline-none focus:border-white/40 focus:ring-2 focus:ring-white/20 transition-all placeholder-white/30"
                    // required
                  />
                </div>
                {errors.email && (
                  <p className="text-red-400 text-xs mt-2 flex items-center gap-1">
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    {errors.email.message}
                  </p>
                )}
              </div>

              {/* Champ Mot de passe - avec correction autofill améliorée */}
              <div className="flex flex-col">
                <label htmlFor="password" className="text-xs font-medium text-white/70 uppercase tracking-wider mb-2 flex items-center gap-1">
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                  Mot de passe
                </label>
                <div className="relative">
                  <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/50">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  </div>
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    {...register("password")}
                    className="w-full bg-transparent border border-white/20 text-white pl-11 pr-12 py-3 rounded-xl focus:outline-none focus:border-white/40 focus:ring-2 focus:ring-white/20 transition-all placeholder-white/30 
                    [&:-webkit-autofill]:bg-transparent 
                    [&:-webkit-autofill]:text-white 
                    [&:-webkit-autofill]:[-webkit-text-fill-color:white] 
                    [&:-webkit-autofill]:shadow-[inset_0_0_0px_1000px_rgba(0,0,0,0.5)]
                    [&:-webkit-autofill]:[transition:background-color_0s_0s,color_0s_0s]"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white/40 hover:text-white transition-colors"
                  >
                    {showPassword ? (
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    ) : (
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                      </svg>
                    )}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-red-400 text-xs mt-2 flex items-center gap-1">
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    {errors.password.message}
                  </p>
                )}
              </div>

             {/* Bouton de connexion */}
<button
  type="submit"
  disabled={loginMutation.isPending}
  className="
    group/btn relative w-full overflow-hidden
    bg-gradient-to-br from-blue-400/20 via-blue-500/30 to-blue-600/20
    backdrop-blur-xl
    border border-white/30 hover:border-blue-400/50
    text-white text-sm font-medium
    py-4 px-6 rounded-xl
    transform transition-all duration-300
    hover:shadow-2xl hover:shadow-blue-500/30
    hover:scale-[1.02] active:scale-[0.98]
    disabled:opacity-50 disabled:cursor-not-allowed
    disabled:hover:scale-100
    flex items-center justify-center gap-2
    before:absolute before:inset-0 before:bg-gradient-to-r before:from-transparent before:via-white/30 before:to-transparent before:translate-x-[-200%] before:hover:translate-x-[200%] before:transition-transform before:duration-1000
  "
>
  {/* Effet de reflet supérieur */}
  <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/60 to-transparent" />
  
  {/* Effet de reflet latéral */}
  <div className="absolute left-0 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-white/30 to-transparent" />
  <div className="absolute right-0 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-white/30 to-transparent" />
  
  <span className="relative flex items-center justify-center gap-2 z-10">
    {loginMutation.isPending ? (
      <>
        <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
        </svg>
        <span>Connexion en cours...</span>
      </>
    ) : (
      <>
        <span>Se connecter</span>
        {/* <svg className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
        </svg> */}
      </>
    )}
  </span>
</button>
            </form>

            {/* Lien inscription */}
            <p className="text-center text-sm text-white/50 mt-8">
              Pas encore de compte ?{" "}
              <Link 
                to="/auth/register" 
                className="text-white hover:text-blue-300 transition-colors font-medium relative group/link"
              >
                <span className="relative z-10">S'inscrire</span>
                <span className="absolute bottom-0 left-0 w-0 h-px bg-gradient-to-r from-blue-400 to-purple-400 group-hover/link:w-full transition-all duration-300" />
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}