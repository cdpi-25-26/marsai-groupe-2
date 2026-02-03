
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
    getCurrentUser()
      .then(res => {
        setUser(res.data);
        setForm(res.data);
        setLoading(false);
      })
      .catch(() => {
        setError("Erreur lors de la récupération des données utilisateur");
        setLoading(false);
      });
  }, []);


  if (loading) return <div>Chargement...</div>;
  if (error) return <div>{error}</div>;
  if (!user) return <div>Utilisateur introuvable</div>;

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
    <div>
      <h1 className="text-2xl font-bold mb-4">Bienvenue Producteur {user.first_name} {user.last_name}</h1>
      <h2 className="text-xl mb-2">Vos informations personnelles</h2>
      {success && <div className="text-green-600 mb-2">{success}</div>}
      {editMode ? (
        <form onSubmit={handleSave} className="mb-4 grid grid-cols-1 md:grid-cols-2 gap-2">
          <label>Prénom<input name="first_name" value={form.first_name || ""} onChange={handleEditChange} required /></label>
          <label>Nom<input name="last_name" value={form.last_name || ""} onChange={handleEditChange} required /></label>
          <label>Téléphone<input name="phone" value={form.phone || ""} onChange={handleEditChange} /></label>
          <label>Mobile<input name="mobile" value={form.mobile || ""} onChange={handleEditChange} /></label>
          <label>Date de naissance<input name="birth_date" type="date" value={form.birth_date ? form.birth_date.substring(0,10) : ""} onChange={handleEditChange} /></label>
          <label>Rue<input name="street" value={form.street || ""} onChange={handleEditChange} /></label>
          <label>Code postal<input name="postal_code" value={form.postal_code || ""} onChange={handleEditChange} /></label>
          <label>Ville<input name="city" value={form.city || ""} onChange={handleEditChange} /></label>
          <label>Pays<input name="country" value={form.country || ""} onChange={handleEditChange} /></label>
          <label>Biographie<textarea name="biography" value={form.biography || ""} onChange={handleEditChange} /></label>
          <label>Profession
            <select name="job" value={form.job || ""} onChange={handleEditChange}>
              <option value="">-</option>
              <option value="PRODUCER">Producteur</option>
              <option value="ACTOR">Acteur</option>
              <option value="DIRECTOR">Réalisateur</option>
              <option value="WRITER">Scénariste</option>
              <option value="OTHER">Autre</option>
            </select>
          </label>
          <label>Portfolio<input name="portfolio" value={form.portfolio || ""} onChange={handleEditChange} /></label>
          <label>YouTube<input name="youtube" value={form.youtube || ""} onChange={handleEditChange} /></label>
          <label>Instagram<input name="instagram" value={form.instagram || ""} onChange={handleEditChange} /></label>
          <label>LinkedIn<input name="linkedin" value={form.linkedin || ""} onChange={handleEditChange} /></label>
          <label>Facebook<input name="facebook" value={form.facebook || ""} onChange={handleEditChange} /></label>
          <label>TikTok<input name="tiktok" value={form.tiktok || ""} onChange={handleEditChange} /></label>
          <label>Connu par MarsAI ?
            <select name="known_by_mars_ai" value={form.known_by_mars_ai || ""} onChange={handleEditChange}>
              <option value="">-</option>
              <option value="YES">Oui</option>
              <option value="NO">Non</option>
            </select>
          </label>
          <label>Mot de passe (changer uniquement si nécessaire)<input name="password" type="password" value={form.password || ""} onChange={handleEditChange} autoComplete="new-password" /></label>
          <div className="col-span-2 flex gap-2 mt-2">
            <button type="submit" className="bg-blue-500 text-white px-4 py-1 rounded">Enregistrer</button>
            <button type="button" className="bg-gray-300 px-4 py-1 rounded" onClick={() => { setEditMode(false); setForm(user); setSuccess(null); }}>Annuler</button>
          </div>
        </form>
      ) : (
        <>
          <ul className="mb-4">
            <li><b>Email:</b> {user.email}</li>
            <li><b>Téléphone:</b> {user.phone || "-"}</li>
            <li><b>Mobile:</b> {user.mobile || "-"}</li>
            <li><b>Date de naissance:</b> {user.birth_date ? user.birth_date.substring(0,10) : "-"}</li>
            <li><b>Adresse:</b> {user.street || "-"}, {user.postal_code || "-"} {user.city || "-"}, {user.country || "-"}</li>
            <li><b>Biographie:</b> {user.biography || "-"}</li>
            <li><b>Profession:</b> {user.job || "-"}</li>
            <li><b>Portfolio:</b> {user.portfolio || "-"}</li>
            <li><b>YouTube:</b> {user.youtube || "-"}</li>
            <li><b>Instagram:</b> {user.instagram || "-"}</li>
            <li><b>LinkedIn:</b> {user.linkedin || "-"}</li>
            <li><b>Facebook:</b> {user.facebook || "-"}</li>
            <li><b>TikTok:</b> {user.tiktok || "-"}</li>
            <li><b>Connu par MarsAI:</b> {user.known_by_mars_ai || "-"}</li>
          </ul>
          <button className="bg-blue-500 text-white px-4 py-1 rounded" onClick={() => setEditMode(true)}>Modifier le profil</button>
        </>
      )}
    </div>
  );
}
