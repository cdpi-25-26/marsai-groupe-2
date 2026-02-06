
/**
 * Composant ProducerHome (Accueil Producteur)
 * Page permettant aux producteurs de voir et modifier leur profil complet
 * Fonctionnalités: 
 * - Affichage des informations utilisateur (18 champs optionnels)
 * - Mode édition pour modifier les informations
 * - Appel API getCurrentUser pour récupérer les données
 * - Validation et mise à jour via updateCurrentUser
 * @returns {JSX.Element} La page d'accueil du producteur avec formulaire de profil
 */

import { useEffect, useState } from "react";
import { getCurrentUser, updateCurrentUser } from "../../api/users";
import { getMyMovies } from "../../api/movies";

export default function ProducerHome() {
  // État pour stocker les données utilisateur
  const [user, setUser] = useState(null);
  // État pour indiquer si les données sont en cours de chargement
  const [loading, setLoading] = useState(true);
  // État pour gérer les messages d'erreur
  const [error, setError] = useState(null);
  // État pour basculer entre mode lecture et mode édition
  const [editMode, setEditMode] = useState(false);
  // État pour stocker les données du formulaire d'édition
  const [form, setForm] = useState({});
  // État pour afficher les messages de succès
  const [success, setSuccess] = useState(null);
  // État pour stocker les films du producteur
  const [movies, setMovies] = useState([]);

  /**
   * Effect - Récupère les données utilisateur au chargement du composant
   * Vérifie que l'utilisateur est authentifié avant de faire l'appel API
   */
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
        setForm(userRes.data);
        setMovies(moviesRes.data || []);
        setLoading(false);
      })
      .catch(() => {
        setError("Erreur lors de la récupération des données utilisateur");
        setLoading(false);
      });
  }, []);


  if (loading) return <div className="min-h-screen bg-black text-white flex items-center justify-center">Chargement...</div>;
  if (error) return <div className="min-h-screen bg-black text-white flex items-center justify-center">{error}</div>;
  if (!user) return <div className="min-h-screen bg-black text-white flex items-center justify-center">Utilisateur introuvable</div>;

  const uploadBase = "http://localhost:3000/uploads";

  /**
   * Fonction handleEditChange
   * Met à jour le state form lors de chaque modification de champ
   * @param {Event} e - L'événement du champ modifié
   */
  function handleEditChange(e) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  /**
   * Fonction handleSave
   * Envoie les données modifiées au serveur via updateCurrentUser
   * Supprime les champs email et role car ils ne peuvent pas être modifiés
   * Met à jour le localStorage avec le nouveau prénom
   * @param {Event} e - L'événement du formulaire
   */
  async function handleSave(e) {
    e.preventDefault();
    setSuccess(null);
    try {
      const toSend = { ...form };
      // Les champs email et role sont protégés et ne doivent pas être modifiés par l'utilisateur
      delete toSend.email;
      delete toSend.role;
      const res = await updateCurrentUser(toSend);
      setUser(res.data);
      setEditMode(false);
      setSuccess("Profil mis à jour avec succès.");
      // Mise à jour du prénom dans le localStorage pour l'affichage dans la navbar
      if (res.data.first_name) localStorage.setItem("firstName", res.data.first_name);
    } catch (err) {
      setError("Erreur lors de la mise à jour du profil");
    }
  }

  return (
    <div className="min-h-screen bg-black text-white font-light pt-28 pb-20 px-4 md:pt-32">
      <div className="max-w-6xl mx-auto space-y-10">
        <div className="text-center">
          <h1 className="text-4xl font-bold">Espace Producteur</h1>
          <p className="text-gray-400 mt-2">Bienvenue {user.first_name} {user.last_name}</p>
        </div>

        <section className="bg-gray-900 rounded-2xl p-8 border border-gray-800 shadow-2xl">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold">Vos informations personnelles</h2>
            {!editMode && (
              <button
                className="bg-gradient-to-r from-[#AD46FF] to-[#F6339A] text-white px-4 py-2 rounded-lg font-semibold"
                onClick={() => setEditMode(true)}
              >
                Modifier
              </button>
            )}
          </div>

          {success && <div className="text-green-400 mb-4">{success}</div>}

          {editMode ? (
            <form onSubmit={handleSave} className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex flex-col">
                <label className="text-sm uppercase text-gray-400 mb-1">Prénom</label>
                <input name="first_name" value={form.first_name || ""} onChange={handleEditChange} required className="bg-gray-800 border border-gray-700 text-white px-4 py-3 rounded-lg" />
              </div>
              <div className="flex flex-col">
                <label className="text-sm uppercase text-gray-400 mb-1">Nom</label>
                <input name="last_name" value={form.last_name || ""} onChange={handleEditChange} required className="bg-gray-800 border border-gray-700 text-white px-4 py-3 rounded-lg" />
              </div>
              <div className="flex flex-col">
                <label className="text-sm uppercase text-gray-400 mb-1">Téléphone</label>
                <input name="phone" value={form.phone || ""} onChange={handleEditChange} className="bg-gray-800 border border-gray-700 text-white px-4 py-3 rounded-lg" />
              </div>
              <div className="flex flex-col">
                <label className="text-sm uppercase text-gray-400 mb-1">Mobile</label>
                <input name="mobile" value={form.mobile || ""} onChange={handleEditChange} className="bg-gray-800 border border-gray-700 text-white px-4 py-3 rounded-lg" />
              </div>
              <div className="flex flex-col">
                <label className="text-sm uppercase text-gray-400 mb-1">Date de naissance</label>
                <input name="birth_date" type="date" value={form.birth_date ? form.birth_date.substring(0,10) : ""} onChange={handleEditChange} className="bg-gray-800 border border-gray-700 text-white px-4 py-3 rounded-lg" />
              </div>
              <div className="flex flex-col">
                <label className="text-sm uppercase text-gray-400 mb-1">Rue</label>
                <input name="street" value={form.street || ""} onChange={handleEditChange} className="bg-gray-800 border border-gray-700 text-white px-4 py-3 rounded-lg" />
              </div>
              <div className="flex flex-col">
                <label className="text-sm uppercase text-gray-400 mb-1">Code postal</label>
                <input name="postal_code" value={form.postal_code || ""} onChange={handleEditChange} className="bg-gray-800 border border-gray-700 text-white px-4 py-3 rounded-lg" />
              </div>
              <div className="flex flex-col">
                <label className="text-sm uppercase text-gray-400 mb-1">Ville</label>
                <input name="city" value={form.city || ""} onChange={handleEditChange} className="bg-gray-800 border border-gray-700 text-white px-4 py-3 rounded-lg" />
              </div>
              <div className="flex flex-col">
                <label className="text-sm uppercase text-gray-400 mb-1">Pays</label>
                <input name="country" value={form.country || ""} onChange={handleEditChange} className="bg-gray-800 border border-gray-700 text-white px-4 py-3 rounded-lg" />
              </div>
              <div className="flex flex-col md:col-span-2">
                <label className="text-sm uppercase text-gray-400 mb-1">Biographie</label>
                <textarea name="biography" value={form.biography || ""} onChange={handleEditChange} className="bg-gray-800 border border-gray-700 text-white px-4 py-3 rounded-lg" />
              </div>
              <div className="flex flex-col">
                <label className="text-sm uppercase text-gray-400 mb-1">Profession</label>
                <select name="job" value={form.job || ""} onChange={handleEditChange} className="bg-gray-800 border border-gray-700 text-white px-4 py-3 rounded-lg">
                  <option value="">-</option>
                  <option value="PRODUCER">Producteur</option>
                  <option value="ACTOR">Acteur</option>
                  <option value="DIRECTOR">Réalisateur</option>
                  <option value="WRITER">Scénariste</option>
                  <option value="OTHER">Autre</option>
                </select>
              </div>
              <div className="flex flex-col">
                <label className="text-sm uppercase text-gray-400 mb-1">Portfolio</label>
                <input name="portfolio" value={form.portfolio || ""} onChange={handleEditChange} className="bg-gray-800 border border-gray-700 text-white px-4 py-3 rounded-lg" />
              </div>
              <div className="flex flex-col">
                <label className="text-sm uppercase text-gray-400 mb-1">YouTube</label>
                <input name="youtube" value={form.youtube || ""} onChange={handleEditChange} className="bg-gray-800 border border-gray-700 text-white px-4 py-3 rounded-lg" />
              </div>
              <div className="flex flex-col">
                <label className="text-sm uppercase text-gray-400 mb-1">Instagram</label>
                <input name="instagram" value={form.instagram || ""} onChange={handleEditChange} className="bg-gray-800 border border-gray-700 text-white px-4 py-3 rounded-lg" />
              </div>
              <div className="flex flex-col">
                <label className="text-sm uppercase text-gray-400 mb-1">LinkedIn</label>
                <input name="linkedin" value={form.linkedin || ""} onChange={handleEditChange} className="bg-gray-800 border border-gray-700 text-white px-4 py-3 rounded-lg" />
              </div>
              <div className="flex flex-col">
                <label className="text-sm uppercase text-gray-400 mb-1">Facebook</label>
                <input name="facebook" value={form.facebook || ""} onChange={handleEditChange} className="bg-gray-800 border border-gray-700 text-white px-4 py-3 rounded-lg" />
              </div>
              <div className="flex flex-col">
                <label className="text-sm uppercase text-gray-400 mb-1">TikTok</label>
                <input name="tiktok" value={form.tiktok || ""} onChange={handleEditChange} className="bg-gray-800 border border-gray-700 text-white px-4 py-3 rounded-lg" />
              </div>
              <div className="flex flex-col">
                <label className="text-sm uppercase text-gray-400 mb-1">Connu par MarsAI ?</label>
                <select name="known_by_mars_ai" value={form.known_by_mars_ai || ""} onChange={handleEditChange} className="bg-gray-800 border border-gray-700 text-white px-4 py-3 rounded-lg">
                  <option value="">-</option>
                  <option value="YES">Oui</option>
                  <option value="NO">Non</option>
                </select>
              </div>
              <div className="flex flex-col md:col-span-2">
                <label className="text-sm uppercase text-gray-400 mb-1">Mot de passe (changer uniquement si nécessaire)</label>
                <input name="password" type="password" value={form.password || ""} onChange={handleEditChange} autoComplete="new-password" className="bg-gray-800 border border-gray-700 text-white px-4 py-3 rounded-lg" />
              </div>
              <div className="md:col-span-2 flex gap-3">
                <button type="submit" className="bg-gradient-to-r from-[#AD46FF] to-[#F6339A] text-white px-4 py-2 rounded-lg font-semibold">Enregistrer</button>
                <button type="button" className="border border-gray-700 px-4 py-2 rounded-lg" onClick={() => { setEditMode(false); setForm(user); setSuccess(null); }}>Annuler</button>
              </div>
            </form>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-300">
              <div><span className="text-gray-400">Email:</span> {user.email}</div>
              <div><span className="text-gray-400">Téléphone:</span> {user.phone || "-"}</div>
              <div><span className="text-gray-400">Mobile:</span> {user.mobile || "-"}</div>
              <div><span className="text-gray-400">Date de naissance:</span> {user.birth_date ? user.birth_date.substring(0,10) : "-"}</div>
              <div className="md:col-span-2"><span className="text-gray-400">Adresse:</span> {user.street || "-"}, {user.postal_code || "-"} {user.city || "-"}, {user.country || "-"}</div>
              <div className="md:col-span-2"><span className="text-gray-400">Biographie:</span> {user.biography || "-"}</div>
              <div><span className="text-gray-400">Profession:</span> {user.job || "-"}</div>
              <div><span className="text-gray-400">Portfolio:</span> {user.portfolio || "-"}</div>
              <div><span className="text-gray-400">YouTube:</span> {user.youtube || "-"}</div>
              <div><span className="text-gray-400">Instagram:</span> {user.instagram || "-"}</div>
              <div><span className="text-gray-400">LinkedIn:</span> {user.linkedin || "-"}</div>
              <div><span className="text-gray-400">Facebook:</span> {user.facebook || "-"}</div>
              <div><span className="text-gray-400">TikTok:</span> {user.tiktok || "-"}</div>
              <div><span className="text-gray-400">Connu par MarsAI:</span> {user.known_by_mars_ai || "-"}</div>
            </div>
          )}
        </section>

        <section className="bg-gray-900 rounded-2xl p-8 border border-gray-800 shadow-2xl">
          <h2 className="text-2xl font-bold mb-6">Votre film soumis</h2>
          {movies.length === 0 ? (
            <p className="text-gray-400">Aucun film soumis pour le moment.</p>
          ) : (
            movies.map(movie => (
              <div key={movie.id_movie} className="border border-gray-800 rounded-xl p-6 bg-gray-950">
                <div className="flex flex-col lg:flex-row gap-6">
                  <div className="flex-1">
                    <h3 className="text-2xl font-bold text-white">{movie.title}</h3>
                    <p className="text-gray-400 mt-2">{movie.synopsis || movie.description || "-"}</p>
                    <div className="grid grid-cols-2 gap-4 mt-4 text-sm text-gray-300">
                      <div><span className="text-gray-400">Durée:</span> {movie.duration ? `${movie.duration}s` : "-"}</div>
                      <div><span className="text-gray-400">Langue:</span> {movie.main_language || "-"}</div>
                      <div><span className="text-gray-400">Nationalité:</span> {movie.nationality || "-"}</div>
                      <div><span className="text-gray-400">Statut:</span> {movie.selection_status || "submitted"}</div>
                      <div><span className="text-gray-400">Outils IA:</span> {movie.ai_tool || "-"}</div>
                      <div><span className="text-gray-400">Méthodologie:</span> {movie.workshop || "-"}</div>
                      <div><span className="text-gray-400">Production:</span> {movie.production || "-"}</div>
                      <div><span className="text-gray-400">Sous-titres:</span> {movie.subtitle ? (
                        <a className="text-[#AD46FF] hover:text-[#F6339A]" href={`${uploadBase}/${movie.subtitle}`} target="_blank" rel="noreferrer">Télécharger</a>
                      ) : "-"}</div>
                    </div>
                    {movie.trailer && (
                      <div className="mt-4">
                        <a className="text-[#AD46FF] hover:text-[#F6339A] font-semibold" href={`${uploadBase}/${movie.trailer}`} target="_blank" rel="noreferrer">
                          Télécharger le film
                        </a>
                      </div>
                    )}
                  </div>

                  <div className="flex-1">
                    <div className="grid grid-cols-2 gap-3">
                      {[movie.picture1, movie.picture2, movie.picture3].filter(Boolean).map((pic, idx) => (
                        <div key={`${movie.id_movie}-pic-${idx}`} className="aspect-video bg-gray-800 rounded-lg overflow-hidden">
                          <img src={`${uploadBase}/${pic}`} alt="Vignette" className="w-full h-full object-cover" />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </section>
      </div>
    </div>
  );
}
