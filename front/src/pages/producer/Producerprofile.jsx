/**
 * Composant ProducerProfile
 * Affiche et permet la modification des informations personnelles du producteur.
 */

import { useState } from "react";
import { updateCurrentUser } from "../../api/users";
import {
  Film,
  Clock,
  CheckCircle2,
  XCircle
} from "lucide-react";

/* ===================== */
/* STAT CARDS CONFIG */
/* ===================== */

const statCards = [
  {
    label: "Films soumis",
    icon: Film,
    filter: () => true,
    gradient:
      "bg-blue-500/30 to-transparent border border-blue-500/80 backdrop-blur-sm",
    glow: "shadow-cyan-500/20",
  },
  {
    label: "En attente",
    icon: Clock,
    filter: (m) =>
      !m.selection_status ||
      m.selection_status === "submitted" ||
      m.selection_status === "pending",
    gradient:
      "bg-amber-500/30 to-transparent border border-amber-500/80 backdrop-blur-sm",
    glow: "shadow-orange-500/20",
  },
  {
    label: "Sélectionnés",
    icon: CheckCircle2,
    filter: (m) =>
      m.selection_status === "selected" || m.selection_status === "accepted",
    gradient:
      "bg-emerald-500/30 to-transparent border border-emerald-500/80 backdrop-blur-sm",
    glow: "shadow-emerald-500/20",
  },
  {
    label: "Refusés",
    icon: XCircle,
    filter: (m) =>
      m.selection_status === "refused" || m.selection_status === "rejected",
    gradient:
      "bg-rose-500/30 to-transparent border border-rose-500/80 backdrop-blur-sm",
    glow: "shadow-rose-500/20",
  },
];

export default function ProducerProfile({ user, movies = [], onUserUpdate }) {
  const [editMode, setEditMode] = useState(false);
  const [form, setForm] = useState(user);
  const [success, setSuccess] = useState(null);
  const [error, setError] = useState(null);

  function handleEditChange(e) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  async function handleSave(e) {
    e.preventDefault();
    setSuccess(null);
    setError(null);

    try {
      const toSend = { ...form };
      delete toSend.email;
      delete toSend.role;

      const res = await updateCurrentUser(toSend);

      onUserUpdate(res.data);
      setEditMode(false);
      setSuccess("Profil mis à jour avec succès.");

      if (res.data.first_name)
        localStorage.setItem("firstName", res.data.first_name);
    } catch {
      setError("Erreur lors de la mise à jour du profil.");
    }
  }

  return (
    <section id="profile" className="space-y-4">
      {/* EDIT BUTTON */}
      {!editMode && (
        <div className="flex justify-end">
          <button
  className="group relative overflow-hidden rounded-lg px-4 py-1.5
             bg-blue-500/20 backdrop-blur-xl
             border border-blue-400/30
             shadow-lg shadow-blue-500/20
             transition-all duration-300
             hover:bg-blue-500/30
             hover:shadow-blue-500/40
             hover:-translate-y-0.5"
  onClick={() => {
    setEditMode(true);
    setForm(user);
  }}
>
  {/* Glass shine */}
  <div className="absolute inset-0 bg-gradient-to-tr from-white/20 via-white/10 to-transparent opacity-40 pointer-events-none" />

  <span className="relative z-10 text-xs font-medium text-blue-100 tracking-wide">
    Modifier le profil
  </span>
</button>
        </div>
      )}

      {success && (
        <div className="p-2 bg-green-500/10 border border-green-500/30 rounded-lg text-green-300 text-xs">
          {success}
        </div>
      )}

      {error && (
        <div className="p-2 bg-red-500/10 border border-red-500/30 rounded-lg text-red-300 text-xs">
          {error}
        </div>
      )}

      {editMode ? (
        <form
          onSubmit={handleSave}
          className="bg-white/[0.05] border border-white/10 rounded-xl p-5 grid grid-cols-1 md:grid-cols-2 gap-4"
        >
          <div className="flex flex-col">
            <label className="text-xs uppercase text-white/40 mb-1">Prénom</label>
            <input name="first_name" value={form.first_name || ""} onChange={handleEditChange} required className="bg-black/40 border border-white/10 text-white px-4 py-2.5 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/30" />
          </div>
          <div className="flex flex-col">
            <label className="text-xs uppercase text-white/40 mb-1">Nom</label>
            <input name="last_name" value={form.last_name || ""} onChange={handleEditChange} required className="bg-black/40 border border-white/10 text-white px-4 py-2.5 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/30" />
          </div>
          <div className="flex flex-col">
            <label className="text-xs uppercase text-white/40 mb-1">Téléphone</label>
            <input name="phone" value={form.phone || ""} onChange={handleEditChange} className="bg-black/40 border border-white/10 text-white px-4 py-2.5 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/30" />
          </div>
          <div className="flex flex-col">
            <label className="text-xs uppercase text-white/40 mb-1">Mobile</label>
            <input name="mobile" value={form.mobile || ""} onChange={handleEditChange} className="bg-black/40 border border-white/10 text-white px-4 py-2.5 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/30" />
          </div>
          <div className="flex flex-col">
            <label className="text-xs uppercase text-white/40 mb-1">Date de naissance</label>
            <input name="birth_date" type="date" value={form.birth_date ? form.birth_date.substring(0, 10) : ""} onChange={handleEditChange} className="bg-black/40 border border-white/10 text-white px-4 py-2.5 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/30" />
          </div>
          <div className="flex flex-col">
            <label className="text-xs uppercase text-white/40 mb-1">Rue</label>
            <input name="street" value={form.street || ""} onChange={handleEditChange} className="bg-black/40 border border-white/10 text-white px-4 py-2.5 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/30" />
          </div>
          <div className="flex flex-col">
            <label className="text-xs uppercase text-white/40 mb-1">Code postal</label>
            <input name="postal_code" value={form.postal_code || ""} onChange={handleEditChange} className="bg-black/40 border border-white/10 text-white px-4 py-2.5 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/30" />
          </div>
          <div className="flex flex-col">
            <label className="text-xs uppercase text-white/40 mb-1">Ville</label>
            <input name="city" value={form.city || ""} onChange={handleEditChange} className="bg-black/40 border border-white/10 text-white px-4 py-2.5 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/30" />
          </div>
          <div className="flex flex-col">
            <label className="text-xs uppercase text-white/40 mb-1">Pays</label>
            <input name="country" value={form.country || ""} onChange={handleEditChange} className="bg-black/40 border border-white/10 text-white px-4 py-2.5 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/30" />
          </div>
          <div className="flex flex-col">
            <label className="text-xs uppercase text-white/40 mb-1">Profession</label>
            <select name="job" value={form.job || ""} onChange={handleEditChange} className="bg-black/40 border border-white/10 text-white px-4 py-2.5 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/30">
              <option value="">-</option>
              <option value="PRODUCER">Producteur</option>
              <option value="ACTOR">Acteur</option>
              <option value="DIRECTOR">Réalisateur</option>
              <option value="WRITER">Scénariste</option>
              <option value="OTHER">Autre</option>
            </select>
          </div>
          <div className="flex flex-col md:col-span-2">
            <label className="text-xs uppercase text-white/40 mb-1">Biographie</label>
            <textarea name="biography" value={form.biography || ""} onChange={handleEditChange} rows={3} className="bg-black/40 border border-white/10 text-white px-4 py-2.5 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/30 resize-none" />
          </div>
          <div className="flex flex-col">
            <label className="text-xs uppercase text-white/40 mb-1">Portfolio</label>
            <input name="portfolio" value={form.portfolio || ""} onChange={handleEditChange} className="bg-black/40 border border-white/10 text-white px-4 py-2.5 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/30" />
          </div>
          <div className="flex flex-col">
            <label className="text-xs uppercase text-white/40 mb-1">YouTube</label>
            <input name="youtube" value={form.youtube || ""} onChange={handleEditChange} className="bg-black/40 border border-white/10 text-white px-4 py-2.5 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/30" />
          </div>
          <div className="flex flex-col">
            <label className="text-xs uppercase text-white/40 mb-1">Instagram</label>
            <input name="instagram" value={form.instagram || ""} onChange={handleEditChange} className="bg-black/40 border border-white/10 text-white px-4 py-2.5 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/30" />
          </div>
          <div className="flex flex-col">
            <label className="text-xs uppercase text-white/40 mb-1">LinkedIn</label>
            <input name="linkedin" value={form.linkedin || ""} onChange={handleEditChange} className="bg-black/40 border border-white/10 text-white px-4 py-2.5 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/30" />
          </div>
          <div className="flex flex-col">
            <label className="text-xs uppercase text-white/40 mb-1">Facebook</label>
            <input name="facebook" value={form.facebook || ""} onChange={handleEditChange} className="bg-black/40 border border-white/10 text-white px-4 py-2.5 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/30" />
          </div>
          <div className="flex flex-col">
            <label className="text-xs uppercase text-white/40 mb-1">TikTok</label>
            <input name="tiktok" value={form.tiktok || ""} onChange={handleEditChange} className="bg-black/40 border border-white/10 text-white px-4 py-2.5 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/30" />
          </div>
          <div className="flex flex-col md:col-span-2">
            <label className="text-xs uppercase text-white/40 mb-1">Mot de passe (laisser vide pour conserver)</label>
            <input name="password" type="password" value={form.password || ""} onChange={handleEditChange} autoComplete="new-password" className="bg-black/40 border border-white/10 text-white px-4 py-2.5 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/30" />
          </div>
          <div className="md:col-span-2 flex gap-3 pt-2">
            <button type="submit" className="flex-1 px-6 py-2.5 bg-gradient-to-r from-blue-600/80 to-purple-600/80 text-white text-sm font-medium rounded-lg hover:opacity-90 transition-opacity">
              Enregistrer
            </button>
            <button type="button" className="flex-1 px-6 py-2.5 bg-white/5 border border-white/10 text-white/80 text-sm rounded-lg hover:bg-white/10 transition-colors"
              onClick={() => { setEditMode(false); setForm(user); setSuccess(null); }}>
              Annuler
            </button>
          </div>
        </form>
      ) : (
        <div className="space-y-3">
          {/* ================= CONTAINER 1 ================= */}
          <div className="group relative bg-gradient-to-br from-white/[0.07] to-white/[0.02] backdrop-blur-2xl border border-white/10 rounded-xl p-4 shadow-2xl shadow-black/40 overflow-hidden">
            <div className="relative space-y-4">
              {/* CONTACT HEADER */}
              <div className="flex flex-col lg:flex-row lg:items-center gap-4">
                <div className="flex items-center gap-3 min-w-[220px]">
                  <div className="w-14 h-14 rounded-full bg-gradient-to-br from-blue-500/40 to-purple-500/40 p-[2px]">
                    <div className="w-full h-full rounded-full bg-black/60 flex items-center justify-center text-white text-lg font-semibold">
                      {user.first_name?.[0]}
                      {user.last_name?.[0]}
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-medium text-white">
                      {user.first_name} {user.last_name}
                    </h3>
                    <p className="text-[11px] text-white/40 uppercase tracking-wider">
                      Producteur
                    </p>
                  </div>
                </div>

                <div className="hidden lg:block w-px h-10 bg-white/10" />

                {/* CONTACT CARDS */}
                <div className="flex-1 grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="bg-white/[0.04] border border-white/10 rounded-lg px-3 py-2">
                    <p className="text-[10px] text-white/40 uppercase">
                      Téléphone
                    </p>
                    <p className="text-sm text-white/90">{user.phone || "-"}</p>
                  </div>

                  <div className="bg-white/[0.04] border border-white/10 rounded-lg px-3 py-2">
                    <p className="text-[10px] text-white/40 uppercase">
                      Mobile
                    </p>
                    <p className="text-sm text-white/90">
                      {user.mobile || "-"}
                    </p>
                  </div>

                  <div className="bg-white/[0.04] border border-white/10 rounded-lg px-3 py-2">
                    <p className="text-[10px] text-white/40 uppercase">Email</p>
                    <p className="text-sm text-white/90 break-all">
                      {user.email}
                    </p>
                  </div>
                </div>
              </div>

             {/* ================= STATS — IMPROVED GLASS ================= */}
<div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
  {statCards.map((card) => {
    const Icon = card.icon;
    const count = movies.filter(card.filter).length;

    return (
      <div
        key={card.label}
        className={`
          group relative overflow-hidden rounded-xl p-4
          border border-white/10
          bg-white/[0.05]
          backdrop-blur-2xl
          shadow-xl ${card.glow}
          transition-all duration-300
          {/*hover:-translate-y-1 hover:shadow-2xl */}
        `}
      >
        {/* Gradient liquid background */}
        <div
          className={`
            absolute inset-0 opacity-70
            bg-gradient-to-br ${card.gradient}
            transition-opacity duration-300
            group-hover:opacity-90
          `}
        />

        {/* Gloss reflection */}
        <div className="absolute inset-0 bg-gradient-to-tr from-white/10 via-transparent to-transparent opacity-40" />

        {/* Content */}
        <div className="relative z-10 flex items-center justify-between">
          <div>
            <p className="text-xs text-white/50 uppercase tracking-wide">
              {card.label}
            </p>

            <p className="text-2xl font-semibold text-white mt-1">
              {count}
            </p>
          </div>

          {/* Icon container */}
          <div className="p-2 rounded-lg bg-white/10 border border-white/20">
            <Icon className="w-5 h-5 text-white/80" />
          </div>
        </div>
      </div>
    );
  })}
</div>
{/* ================= END STATS ================= */}
            </div>
          </div>

          {/* ================= GRID 2 + 3 ================= */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {/* CONTAINER 2 */}
            <div className="bg-gradient-to-br from-white/[0.07] to-white/[0.02] backdrop-blur-2xl border border-white/10 rounded-xl p-4">
              <h4 className="text-sm text-white/40 uppercase mb-2 pb-2 relative">
                Informations personnelles
                <span className="absolute left-0 bottom-0 w-full h-[1px] bg-white/10"></span>
              </h4>

              <div className="space-y-3 text-xs text-white/90">
                {/* Naissance */}
                <div>
                  <p className="text-[10px] text-white/40 uppercase mb-0.5">
                    Naissance:
                  </p>
                  <p className="text-white/90">
                    {user.birth_date ? user.birth_date.substring(0, 10) : "-"}
                  </p>
                </div>

                {/* Adresse */}
                <div>
                  <p className="text-[10px] text-white/40 uppercase mb-0.5">
                    Adresse:
                  </p>
                  <p className="text-white/90 leading-relaxed">
                    {user.street || "-"}, {user.postal_code || "-"}{" "}
                    {user.city || "-"}, {user.country || "-"}
                  </p>
                </div>

                {/* Profession */}
                <div>
                  <p className="text-[10px] text-white/40 uppercase mb-0.5">
                    Profession:
                  </p>
                  <p className="text-white/90">{user.job || "-"}</p>
                </div>

                {/* Biographie */}
                <div>
                  <p className="text-[10px] text-white/40 uppercase mb-0.5">
                    Biographie:
                  </p>
                  <p className="text-white/90 whitespace-pre-line">
                    {user.biography || "-"}
                  </p>
                </div>
              </div>
            </div>

            {/* CONTAINER 3 */}
            <div className="bg-gradient-to-br from-white/[0.07] to-white/[0.02] backdrop-blur-2xl border border-white/10 rounded-xl p-4">
              <h4 className="text-sm text-white/40 uppercase mb-6 pb-2 relative">
                Réseaux sociaux
                <span className="absolute left-0 bottom-0 w-full h-[1px] bg-white/10"></span>
              </h4>
              

              <div className="space-y-3 text-xs text-white/90">
                {/* Portfolio */}
                <div>
                  <p className="text-[10px] text-white/40 uppercase mb-0.5">
                    Portfolio:
                  </p>
                  <p className="text-white/90 break-all">
                    {user.portfolio || "-"}
                  </p>
                </div>

                {/* YouTube */}
                <div>
                  <p className="text-[10px] text-white/40 uppercase mb-0.5">
                    YouTube:
                  </p>
                  <p className="text-white/90 break-all">
                    {user.youtube || "-"}
                  </p>
                </div>

                {/* Instagram */}
                <div>
                  <p className="text-[10px] text-white/40 uppercase mb-0.5">
                    Instagram:
                  </p>
                  <p className="text-white/90 break-all">
                    {user.instagram || "-"}
                  </p>
                </div>

                {/* LinkedIn */}
                <div>
                  <p className="text-[10px] text-white/40 uppercase mb-0.5">
                    LinkedIn:
                  </p>
                  <p className="text-white/90 break-all">
                    {user.linkedin || "-"}
                  </p>
                </div>

                {/* Facebook */}
                <div>
                  <p className="text-[10px] text-white/40 uppercase mb-0.5">
                    Facebook:
                  </p>
                  <p className="text-white/90 break-all">
                    {user.facebook || "-"}
                  </p>
                </div>

                {/* TikTok */}
                <div>
                  <p className="text-[10px] text-white/40 uppercase mb-0.5">
                    TikTok:
                  </p>
                  <p className="text-white/90 break-all">
                    {user.tiktok || "-"}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
