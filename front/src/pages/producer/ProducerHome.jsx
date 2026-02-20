/**
 * Composant ProducerHome (Shell)
 * Orchestre la page producteur :
 * - Récupère les données (user, movies, categories)
 * - Gère le routing par hash (#profile, #formulaire, #films)
 * - Délègue le rendu à ProducerProfile, ProducerFormulaire, ProducerFilms
 */

import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router";
import { useQuery } from "@tanstack/react-query";
import { getCurrentUser } from "../../api/users";
import { getMyMovies } from "../../api/movies";
import { getCategories } from "../../api/videos.js";
import ProducerProfile from "./ProducerProfile.jsx";
import ProducerFormulaire from "./ProducerFormulaire.jsx";
import ProducerFilms from "./ProducerFilms.jsx";

export default function ProducerHome() {
  const location = useLocation();
  const navigate = useNavigate();
  const section = location.state?.section || "profile"; // "profile" | "formulaire" | "films"

  const [user, setUser] = useState(null);
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Reset scroll and prevent hash-jump on navigation
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
  }, []);

  // Fetch user + movies on mount
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      setError("Non authentifié");
      setLoading(false);
      return;
    }
    Promise.all([getCurrentUser(), getMyMovies()])
      .then(([userRes, moviesRes]) => {
        setUser(userRes.data);
        setMovies(moviesRes.data || []);
        setLoading(false);
        // console.log("statuses:", (moviesRes.data || []).map(m => m.selection_status).join(", "))
      })
      .catch(() => {
        setError("Erreur lors de la récupération des données utilisateur");
        setLoading(false);
      });
  }, []);

  const { data: categoriesData } = useQuery({
    queryKey: ["categories"],
    queryFn: getCategories
  });
  const categories = categoriesData?.data || [];

  // Refresh movies list (called by ProducerFormulaire and ProducerFilms after mutations)
  async function refreshMovies() {
    try {
      const moviesRes = await getMyMovies();
      setMovies(moviesRes.data || []);
    } catch {
      // ignore refresh errors
    }
  }

  if (loading) return (
    <div className="min-h-screen text-white pt-28 pb-20 px-4 flex items-start justify-center">
      <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl px-6 py-4 flex items-center gap-3 mt-20">
        <div className="w-5 h-5 border-2 border-blue-500/30 border-t-blue-500 rounded-full animate-spin" />
        <span className="text-sm text-white/70">Chargement...</span>
      </div>
    </div>
  );
  
  if (error) return (
    <div className="min-h-screen text-white pt-28 pb-20 px-4 flex items-start justify-center">
      <div className="bg-red-500/10 border border-red-500/30 rounded-xl px-6 py-4 text-red-400 mt-20">
        {error}
      </div>
    </div>
  );
  
  if (!user) return (
    <div className="min-h-screen text-white pt-28 pb-20 px-4 flex items-start justify-center">
      <div className="bg-white/5 border border-white/10 rounded-xl px-6 py-4 text-white/70 mt-20">
        Utilisateur introuvable
      </div>
    </div>
  );

  return (
    <div className="text-white pt-28 pb-20 px-4 md:pt-25">
      
      {/* Éléments décoratifs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-500/5 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-500/5 rounded-full blur-3xl" />
      </div>
      
      <div className="max-w-6xl mx-auto relative z-10 space-y-2">

        {/* Bouton Retour au menu*/}
        <button
          type="button"
          onClick={() => navigate("/producer")}
          className="group relative flex items-center gap-2 px-4 py-2 text-white/60 hover:text-white transition-all duration-200 overflow-hidden rounded-xl bg-white/5 backdrop-blur-sm border border-white/10 hover:border-blue-500/30 w-fit"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
          <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 relative" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
          </svg>
          <span className="relative text-sm font-medium">Retour au menu</span>
          
          {/* Effet de lueur au survol */}
          <div className="absolute inset-0 opacity-0 group-hover:opacity-100 bg-gradient-to-r from-blue-500/10 to-purple-500/10 blur-xl transition-opacity duration-700 pointer-events-none" />
        </button>

        {/* Page header avec effet glass */}
        <div className="text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/5 backdrop-blur-sm border border-white/10 rounded-full mb-2">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
            <p className="text-xs uppercase tracking-wider text-white/60">Espace Producteur</p>
          </div>
          {/* <h1 className="text-4xl font-light bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent">
            {user.first_name} {user.last_name}
          </h1> */}
          <p className="text-white/40 text-sm mt-2">Gérez votre profil</p>
        </div>

        {/* Sections — only the one matching the hash is rendered */}
        {section === "profile" && (
          <ProducerProfile
            user={user}
            movies={movies}
            onUserUpdate={(updatedUser) => setUser(updatedUser)}
          />
        )}

        {section === "formulaire" && (
          <ProducerFormulaire
            categories={categories}
            onMovieCreated={refreshMovies}
          />
        )}

        {section === "films" && (
          <ProducerFilms
            movies={movies}
            onMoviesUpdate={(updatedMovies) => setMovies(updatedMovies)}
          />
        )}

      </div>
    </div>
  );
}