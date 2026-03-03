/**
 * Videos.jsx — Gestion des films (Admin)
 *
 * Pipeline strict :
 *   submitted  → admin vérifie → Accepter (→ assigned) | Refuser
 *   assigned   → jury vote Phase 1 → Ouvrir Phase 2 (→ to_discuss) | Refuser
 *   to_discuss → jury vote Phase 2 → Promouvoir (→ selected) | Finaliste | Refuser
 *   selected   → Finaliste | Primer (→ awarded) | Refuser
 *   finalist   → Primer (→ awarded) | Refuser
 *   awarded    → Retirer du palmarès
 *   refused    → Remettre en attente (→ submitted)
 */

import { useEffect, useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  getCategories, getVideos, deleteMovie,
  updateMovie, updateMovieCategories, updateMovieStatus
} from "../../api/videos.js";
import { getVotes } from "../../api/votes.js";
import { VideoPreview } from "../../components/VideoPreview.jsx";
import { UPLOAD_BASE } from "../../utils/constants.js";

/* ─── Statuts ─────────────────────────────────────────── */
const S = {
  submitted:  { label: "Soumis",       dot: "bg-zinc-400",    badge: "bg-zinc-800 text-zinc-300"          },
  assigned:   { label: "Phase 1",      dot: "bg-sky-500",     badge: "bg-sky-950 text-sky-300"            },
  to_discuss: { label: "Phase 2",      dot: "bg-amber-400",   badge: "bg-amber-950 text-amber-300"        },
  candidate:  { label: "Candidat",     dot: "bg-violet-400",  badge: "bg-violet-950 text-violet-300"      },
  selected:   { label: "Sélectionné",  dot: "bg-emerald-400", badge: "bg-emerald-950 text-emerald-300"    },
  finalist:   { label: "Finaliste",    dot: "bg-orange-400",  badge: "bg-orange-950 text-orange-300"      },
  refused:    { label: "Refusé",       dot: "bg-red-500",     badge: "bg-red-950 text-red-400"            },
  awarded:    { label: "Primé 🏆",     dot: "bg-yellow-400",  badge: "bg-yellow-900 text-yellow-200"      },
};
const scfg = (s) => S[s] || S.submitted;

const TABS = [
  { key: "all",        label: "Tous"         },
  { key: "submitted",  label: "À vérifier"   },
  { key: "assigned",   label: "Phase 1"      },
  { key: "to_discuss", label: "Phase 2"      },
  { key: "selected",   label: "Sélectionnés" },
  { key: "finalist",   label: "Finalistes"   },
  { key: "refused",    label: "Refusés"      },
  { key: "awarded",    label: "Primés"       },
];

const PIPELINE = [
  { key: "submitted",  short: "Soumis"    },
  { key: "assigned",   short: "Phase 1"   },
  { key: "to_discuss", short: "Phase 2"   },
  { key: "selected",   short: "Sélection" },
  { key: "finalist",   short: "Finaliste" },
  { key: "awarded",    short: "Palmarès"  },
];
const PIPELINE_ORDER = PIPELINE.map((p) => p.key);

/* ─── Actions contextuelles par statut ───────────────── */
function contextualActions(status, hasVotes, juriesCount) {
  switch (status) {
    case "submitted":
      return {
        primary: [{
          to: "assigned", cls: "act-green",
          label: "✓ Accepter — lancer la Phase 1",
          tip: juriesCount === 0
            ? "⚠ Aucun jury assigné. Après acceptation, allez dans Distribution & Jury."
            : null,
        }],
        danger: [{ to: "refused", cls: "act-red", label: "✗ Refuser le film" }],
        info: "Vérifiez le film avant d'accepter. Toutes les vérifications doivent être au vert.",
      };
    case "assigned":
      return {
        primary: [{
          to: "to_discuss", cls: hasVotes ? "act-amber" : "act-amber act-disabled",
          label: "💬 Ouvrir la Phase 2 (délibération)",
          tip: !hasVotes ? "En attente des votes Phase 1. Au moins un jury doit avoir voté." : null,
        }],
        danger: [{ to: "refused", cls: "act-red", label: "✗ Refuser" }],
        info: hasVotes
          ? `${juriesCount} jury(s) assigné(s) — votes reçus. Vous pouvez ouvrir la Phase 2.`
          : `Phase 1 en cours — ${juriesCount} jury(s) assigné(s). En attente de votes.`,
      };
    case "to_discuss":
      return {
        primary: [
          { to: "selected", cls: "act-violet", label: "★ Promouvoir — Sélection officielle" },
          { to: "finalist",  cls: "act-orange", label: "⭐ Passer directement en Finaliste" },
        ],
        danger: [{ to: "refused", cls: "act-red", label: "✗ Refuser" }],
        info: "Phase 2 ouverte. Attendez les votes de délibération du jury.",
      };
    case "selected":
    case "candidate":
      return {
        primary: [
          { to: "finalist", cls: "act-orange", label: "⭐ Passer en Finaliste" },
          { to: "awarded",  cls: "act-gold",   label: "🏆 Primer ce film" },
        ],
        danger: [{ to: "refused", cls: "act-red", label: "✗ Retirer de la sélection" }],
        info: null,
      };
    case "finalist":
      return {
        primary: [{ to: "awarded", cls: "act-gold", label: "🏆 Ajouter au palmarès" }],
        danger:  [{ to: "refused", cls: "act-red",  label: "✗ Retirer" }],
        info: null,
      };
    case "awarded":
      return {
        primary: [],
        danger:  [{ to: "finalist", cls: "act-orange", label: "↩ Retirer du palmarès" }],
        info: "🏆 Ce film fait partie du palmarès.",
      };
    case "refused":
      return {
        primary: [{ to: "submitted", cls: "act-slate", label: "↺ Remettre en attente" }],
        danger:  [],
        info: null,
      };
    default:
      return { primary: [], danger: [], info: null };
  }
}

/* ─── Utilitaires ─────────────────────────────────────── */
const getPoster  = (m) =>
  m.thumbnail       ? `${UPLOAD_BASE}/${m.thumbnail}`       :
  m.display_picture ? `${UPLOAD_BASE}/${m.display_picture}` :
  m.picture1        ? `${UPLOAD_BASE}/${m.picture1}`        :
  m.picture2        ? `${UPLOAD_BASE}/${m.picture2}`        :
  m.picture3        ? `${UPLOAD_BASE}/${m.picture3}`        : null;

const getTrailer = (m) =>
  m.trailer || m.trailer_video || m.trailerVideo || m.filmFile || m.video || null;

/* ════════════════════════════════════════════════════════
   COMPOSANT PRINCIPAL
════════════════════════════════════════════════════════ */
export default function Videos() {
  const qc = useQueryClient();

  const { isPending, isError, data, error } = useQuery({
    queryKey: ["listVideos"], queryFn: getVideos, refetchInterval: 30_000,
  });
  const { data: catsData }  = useQuery({ queryKey: ["categories"], queryFn: getCategories });
  const { data: votesData } = useQuery({ queryKey: ["votes"],      queryFn: getVotes });

  const allMovies  = data?.data     || [];
  const categories = catsData?.data || [];
  const votes      = votesData?.data || [];

  const voteSummary = useMemo(() => votes.reduce((acc, v) => {
    if (!acc[v.id_movie]) acc[v.id_movie] = { YES: 0, NO: 0, "TO DISCUSS": 0, total: 0, votes: [] };
    const s = acc[v.id_movie];
    if (["YES","NO","TO DISCUSS"].includes(v.note)) s[v.note]++;
    s.total++;
    s.votes.push(v);
    return acc;
  }, {}), [votes]);

  const [activeTab,     setActiveTab]     = useState("all");
  const [search,        setSearch]        = useState("");
  const [selectedIds,   setSelectedIds]   = useState([]);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [adminComment,  setAdminComment]  = useState("");
  const [modalNotice,   setModalNotice]   = useState(null);
  const [catSel,        setCatSel]        = useState({});

  useEffect(() => {
    if (!allMovies.length) return;
    const c = {};
    allMovies.forEach((m) => { c[m.id_movie] = (m.Categories || []).map((x) => x.id_categorie); });
    setCatSel(c);
  }, [data]);

  useEffect(() => {
    if (!selectedMovie) { setModalNotice(null); return; }
    setAdminComment(selectedMovie.admin_comment || "");
    setModalNotice(null);
  }, [selectedMovie]);

  useEffect(() => {
    if (!modalNotice) return;
    const t = setTimeout(() => setModalNotice(null), 4500);
    return () => clearTimeout(t);
  }, [modalNotice]);

  const filteredMovies = useMemo(() => allMovies.filter((m) => {
    const s = m.selection_status || "submitted";
    if (activeTab !== "all") {
      const norm = (activeTab === "selected" && ["selected","candidate"].includes(s)) ? true : s === activeTab;
      if (!norm) return false;
    }
    if (search.trim()) {
      const q = search.toLowerCase();
      const pr = `${m.Producer?.first_name||""} ${m.Producer?.last_name||""}`.toLowerCase();
      return m.title?.toLowerCase().includes(q) || pr.includes(q);
    }
    return true;
  }), [allMovies, activeTab, search]);

  const tabCounts = useMemo(() => {
    const c = { all: allMovies.length };
    TABS.slice(1).forEach((t) => {
      c[t.key] = t.key === "selected"
        ? allMovies.filter((m) => ["selected","candidate"].includes(m.selection_status||"submitted")).length
        : allMovies.filter((m) => (m.selection_status||"submitted") === t.key).length;
    });
    return c;
  }, [allMovies]);

  function inv() { qc.invalidateQueries({ queryKey: ["listVideos"] }); qc.invalidateQueries({ queryKey: ["votes"] }); }
  const NOTE = { assigned:"✓ Film accepté — Phase 1 lancée.", refused:"Film refusé.", to_discuss:"Phase 2 ouverte.", selected:"Film promu.", finalist:"Film finaliste.", awarded:"🏆 Film primé !", submitted:"Film remis en attente." };

  const statusM = useMutation({
    mutationFn: ({ id, status }) => updateMovieStatus(id, status),
    onSuccess: (_,v) => { inv(); setModalNotice(NOTE[v.status] || "Statut mis à jour."); },
    onError: () => setModalNotice("❌ Erreur lors de la mise à jour."),
  });
  const commentM  = useMutation({ mutationFn: ({ id, c }) => updateMovie(id, { admin_comment: c }), onSuccess: () => { inv(); setModalNotice("Note enregistrée."); } });
  const catM      = useMutation({ mutationFn: ({ id, cats }) => updateMovieCategories(id, cats),   onSuccess: () => { inv(); setModalNotice("Catégories mises à jour."); } });
  const deleteM   = useMutation({ mutationFn: (id) => deleteMovie(id), onSuccess: () => { inv(); setSelectedMovie(null); } });

  async function batchStatus(s) {
    if (!selectedIds.length) return;
    await Promise.all(selectedIds.map((id) => updateMovieStatus(id, s)));
    inv(); setSelectedIds([]);
  }

  if (isPending) return <div className="flex items-center justify-center h-64"><div className="w-7 h-7 border-2 border-amber-500/20 border-t-amber-500 rounded-full animate-spin" /></div>;
  if (isError)   return <div className="m-6 px-4 py-3 bg-red-900/20 border border-red-900/40 rounded-xl text-red-400 text-sm">Erreur : {error?.message}</div>;

  return (
    <div className="min-h-screen bg-[#07090c] text-white pb-16">
      <style>{`
        .act-green  { background:rgba(5,150,105,.15); color:#6ee7b7; border:1px solid rgba(5,150,105,.25); }
        .act-green:hover { background:rgba(5,150,105,.28); }
        .act-red    { background:rgba(185,28,28,.15);  color:#fca5a5; border:1px solid rgba(185,28,28,.25); }
        .act-red:hover   { background:rgba(185,28,28,.28); }
        .act-amber  { background:rgba(180,83,9,.15);   color:#fcd34d; border:1px solid rgba(180,83,9,.25); }
        .act-amber:hover { background:rgba(180,83,9,.28); }
        .act-disabled    { opacity:.38 !important; cursor:not-allowed !important; }
        .act-violet { background:rgba(109,40,217,.15); color:#c4b5fd; border:1px solid rgba(109,40,217,.25); }
        .act-violet:hover{ background:rgba(109,40,217,.28); }
        .act-orange { background:rgba(194,65,12,.15);  color:#fdba74; border:1px solid rgba(194,65,12,.25); }
        .act-orange:hover{ background:rgba(194,65,12,.28); }
        .act-gold   { background:rgba(161,98,7,.25);   color:#fde68a; border:1px solid rgba(161,98,7,.35); font-weight:700; }
        .act-gold:hover  { background:rgba(161,98,7,.4); }
        .act-slate  { background:rgba(71,85,105,.2);   color:#94a3b8; border:1px solid rgba(71,85,105,.3); }
        .act-slate:hover { background:rgba(71,85,105,.35); }
        .qbtn { padding:3px 7px; border-radius:5px; font-size:9px; font-weight:500; transition:all .15s; white-space:nowrap; }
      `}</style>

      {/* ── Header sticky ── */}
      <div className="sticky top-0 z-20 bg-[#07090c]/96 backdrop-blur border-b border-white/[0.05] px-5 py-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-start justify-between gap-4 flex-wrap mb-4">
            <div>
              <p className="text-[9px] tracking-[0.25em] uppercase text-amber-500/50 mb-0.5">Administration</p>
              <h1 className="text-xl font-semibold text-white">Gestion des films</h1>
              <p className="text-xs text-white/25 mt-0.5">{allMovies.length} film{allMovies.length !== 1 ? "s" : ""}</p>
            </div>
            {/* Pipeline mini */}
            <div className="flex items-center gap-2 flex-wrap">
              {[
                { key: "submitted",  n: tabCounts.submitted  || 0, col: "text-zinc-400"   },
                { key: "assigned",   n: tabCounts.assigned   || 0, col: "text-sky-400"    },
                { key: "to_discuss", n: tabCounts.to_discuss || 0, col: "text-amber-400"  },
                { key: "selected",   n: tabCounts.selected   || 0, col: "text-violet-400" },
                { key: "finalist",   n: tabCounts.finalist   || 0, col: "text-orange-400" },
                { key: "awarded",    n: tabCounts.awarded    || 0, col: "text-yellow-400" },
              ].map((s, i) => (
                <div key={s.key} className="flex items-center gap-2">
                  {i > 0 && <div className="w-3 h-px bg-white/10" />}
                  <div className="text-center">
                    <p className={`text-base font-bold leading-none ${s.col}`}>{s.n}</p>
                    <p className="text-[7px] text-white/25 mt-0.5">{scfg(s.key).label}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Tabs */}
          <div className="flex flex-wrap gap-1">
            {TABS.map((tab) => (
              <button key={tab.key} onClick={() => { setActiveTab(tab.key); setSelectedIds([]); }}
                className={`px-3 py-1 rounded text-xs font-medium transition-all ${
                  activeTab === tab.key
                    ? "bg-amber-500 text-black shadow shadow-amber-500/20"
                    : "bg-white/[0.04] text-white/35 hover:bg-white/[0.07] hover:text-white/60"
                }`}>
                {tab.label}
                {(tabCounts[tab.key] || 0) > 0 && (
                  <span className={`ml-1 text-[9px] ${activeTab === tab.key ? "text-black/50" : "text-white/20"}`}>
                    {tabCounts[tab.key]}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-5 pt-4 space-y-3">

        {/* Recherche + batch */}
        <div className="flex flex-wrap gap-2 items-center">
          <div className="relative flex-1 min-w-[200px]">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-white/20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input type="text" value={search} onChange={(e) => setSearch(e.target.value)}
              placeholder="Titre ou producteur…"
              className="w-full bg-white/[0.04] border border-white/[0.06] text-white text-sm pl-9 pr-3 py-2 rounded-lg focus:outline-none focus:border-amber-500/30 placeholder:text-white/15" />
          </div>
          {selectedIds.length > 0 && (
            <div className="flex items-center gap-2 bg-white/[0.04] border border-white/[0.06] rounded-lg px-3 py-1.5 text-[10px]">
              <span className="text-white/35">{selectedIds.length} film(s)</span>
              <span className="h-3 w-px bg-white/10" />
              <button onClick={() => batchStatus("assigned")} className="text-emerald-400 hover:text-emerald-300 transition font-medium">✓ Accepter</button>
              <span className="h-3 w-px bg-white/10" />
              <button onClick={() => batchStatus("refused")} className="text-red-400 hover:text-red-300 transition">✗ Refuser</button>
              <span className="h-3 w-px bg-white/10" />
              <button onClick={() => setSelectedIds([])} className="text-white/25 hover:text-white/50 transition">✕</button>
            </div>
          )}
        </div>

        {/* Liste */}
        {filteredMovies.length === 0 ? (
          <div className="flex flex-col items-center py-20 text-white/20 gap-3">
            <span className="text-4xl">🎬</span>
            <p className="text-sm">{allMovies.length === 0 ? "Aucun film soumis." : "Aucun film pour ce filtre."}</p>
          </div>
        ) : (
          <div className="rounded-xl border border-white/[0.06] overflow-hidden">
            <div className="grid grid-cols-[18px_40px_1fr_100px_76px_88px_auto] gap-2 px-4 py-2 border-b border-white/[0.05] bg-white/[0.015] text-[8px] uppercase tracking-widest text-white/18">
              <input type="checkbox" checked={selectedIds.length === filteredMovies.length && filteredMovies.length > 0}
                onChange={() => setSelectedIds(selectedIds.length === filteredMovies.length ? [] : filteredMovies.map((m) => m.id_movie))}
                className="accent-amber-500" />
              <span />
              <span>Film</span>
              <span>Producteur</span>
              <span>Votes P1</span>
              <span>Statut</span>
              <span>Actions</span>
            </div>

            <div className="divide-y divide-white/[0.035]">
              {filteredMovies.map((movie) => {
                const status  = movie.selection_status || "submitted";
                const meta    = scfg(status);
                const summary = voteSummary[movie.id_movie];
                const poster  = getPoster(movie);
                const isSel   = selectedIds.includes(movie.id_movie);

                return (
                  <div key={movie.id_movie}
                    className={`grid grid-cols-[18px_40px_1fr_100px_76px_88px_auto] gap-2 px-4 py-2.5 items-center transition ${
                      isSel ? "bg-amber-500/[0.04]" : "hover:bg-white/[0.02]"
                    }`}>

                    <input type="checkbox" checked={isSel}
                      onChange={() => setSelectedIds((p) => p.includes(movie.id_movie) ? p.filter((x) => x !== movie.id_movie) : [...p, movie.id_movie])}
                      className="accent-amber-500" />

                    <button type="button" onClick={() => setSelectedMovie(movie)}
                      className="w-10 h-10 rounded-md overflow-hidden bg-white/5 border border-white/[0.07] flex-shrink-0">
                      {poster
                        ? <img src={poster} alt={movie.title} className="w-full h-full object-cover" />
                        : <div className="w-full h-full flex items-center justify-center text-white/15 text-sm">🎬</div>}
                    </button>

                    <button type="button" onClick={() => setSelectedMovie(movie)} className="text-left min-w-0">
                      <p className="text-sm text-white/75 truncate hover:text-amber-300 transition">{movie.title}</p>
                      <div className="flex flex-wrap gap-1 mt-0.5">
                        {(movie.Categories || []).slice(0, 2).map((c) => (
                          <span key={c.id_categorie} className="text-[7px] text-white/25 bg-white/[0.04] px-1.5 py-0.5 rounded-full border border-white/[0.06]">{c.name}</span>
                        ))}
                        {movie.duration && <span className="text-[7px] text-white/15">{movie.duration}s</span>}
                      </div>
                    </button>

                    <p className="text-[11px] text-white/35 truncate">
                      {movie.Producer ? `${movie.Producer.first_name} ${movie.Producer.last_name}` : "—"}
                    </p>

                    <div className="text-[10px] whitespace-nowrap">
                      {summary ? (
                        <span className="space-x-1">
                          <span className="text-emerald-400">{summary.YES}✓</span>
                          <span className="text-amber-400">{summary["TO DISCUSS"]}◇</span>
                          <span className="text-red-400">{summary.NO}✗</span>
                        </span>
                      ) : <span className="text-white/15">—</span>}
                    </div>

                    <div>
                      <span className={`inline-flex items-center gap-1 text-[8px] px-2 py-1 rounded-full font-medium ${meta.badge}`}>
                        <span className={`w-1 h-1 rounded-full inline-block ${meta.dot}`} />
                        {meta.label}
                      </span>
                    </div>

                    <div className="flex items-center gap-1 flex-wrap">
                      {status === "submitted" && (
                        <button type="button" onClick={() => statusM.mutate({ id: movie.id_movie, status: "assigned" })}
                          className="qbtn act-green">✓ Accepter</button>
                      )}
                      {status === "assigned" && summary?.total > 0 && (
                        <button type="button" onClick={() => statusM.mutate({ id: movie.id_movie, status: "to_discuss" })}
                          className="qbtn act-amber">Phase 2 →</button>
                      )}
                      {status === "to_discuss" && (
                        <button type="button" onClick={() => statusM.mutate({ id: movie.id_movie, status: "selected" })}
                          className="qbtn act-violet">★ Sélect.</button>
                      )}
                      {(status === "selected" || status === "candidate") && (
                        <button type="button" onClick={() => statusM.mutate({ id: movie.id_movie, status: "finalist" })}
                          className="qbtn act-orange">⭐ Final.</button>
                      )}
                      {status === "finalist" && (
                        <button type="button" onClick={() => statusM.mutate({ id: movie.id_movie, status: "awarded" })}
                          className="qbtn act-gold">🏆</button>
                      )}
                      {status === "refused" && (
                        <button type="button" onClick={() => statusM.mutate({ id: movie.id_movie, status: "submitted" })}
                          className="qbtn act-slate">↺</button>
                      )}
                      {status !== "refused" && status !== "awarded" && (
                        <button type="button"
                          onClick={() => window.confirm(`Refuser "${movie.title}" ?`) && statusM.mutate({ id: movie.id_movie, status: "refused" })}
                          className="qbtn act-red">✗</button>
                      )}
                      <button type="button" onClick={() => setSelectedMovie(movie)}
                        className="qbtn" style={{ background: "rgba(255,255,255,.04)", color: "rgba(255,255,255,.3)", border: "1px solid rgba(255,255,255,.06)" }}>
                        ···
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* MODAL */}
      {selectedMovie && (
        <FilmModal
          movie={selectedMovie}
          summary={voteSummary[selectedMovie.id_movie]}
          categories={categories}
          catSel={catSel} setCatSel={setCatSel}
          adminComment={adminComment} setAdminComment={setAdminComment}
          notice={modalNotice}
          onClose={() => setSelectedMovie(null)}
          onStatus={(id, s) => statusM.mutate({ id, status: s })}
          onComment={(id) => commentM.mutate({ id, c: adminComment })}
          onCategories={(id) => catM.mutate({ id, cats: catSel[id] || [] })}
          onDelete={(id) => { if (window.confirm("Supprimer définitivement ? Action irréversible.")) deleteM.mutate(id); }}
        />
      )}
    </div>
  );
}

/* ══════════════════════════════════════════════════════
   MODAL
══════════════════════════════════════════════════════ */
function FilmModal({ movie, summary, categories, catSel, setCatSel,
  adminComment, setAdminComment, notice, onClose, onStatus, onComment, onCategories, onDelete }) {

  const status    = movie.selection_status || "submitted";
  const meta      = scfg(status);
  const trailer   = getTrailer(movie);
  const poster    = getPoster(movie);
  const juries    = movie.Juries || [];
  const hasVotes  = (summary?.total || 0) > 0;
  const { primary, danger, info } = contextualActions(status, hasVotes, juries.length);
  const pIdx      = PIPELINE_ORDER.indexOf(status);
  const [manual, setManual] = useState(false);
  const currentCats = catSel[movie.id_movie] || [];

  return (
    <div className="fixed inset-0 z-50 bg-black/82 backdrop-blur-md overflow-y-auto">
      <div className="min-h-full flex items-start justify-center p-4 py-7">
        <div className="bg-[#0b0d10] border border-white/[0.07] rounded-2xl w-full max-w-6xl shadow-2xl shadow-black/70">

          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-white/[0.06]">
            <div className="flex items-center gap-2.5 min-w-0 flex-wrap">
              <span className={`text-[9px] px-2 py-1 rounded-full font-semibold flex-shrink-0 ${meta.badge}`}>{meta.label}</span>
              <h2 className="text-base font-semibold text-white">{movie.title}</h2>
              {(movie.Awards || []).length > 0 && (
                <span className="text-[9px] bg-yellow-800/40 text-yellow-300 px-2 py-1 rounded-full border border-yellow-700/30 font-bold">
                  🏆 {movie.Awards.length} prix
                </span>
              )}
            </div>
            <button onClick={onClose}
              className="w-7 h-7 flex items-center justify-center rounded-lg bg-white/[0.05] text-white/35 hover:bg-white/[0.09] hover:text-white transition ml-4 flex-shrink-0">
              ✕
            </button>
          </div>

          {/* Pipeline */}
          {status !== "refused" && (
            <div className="px-6 py-2.5 bg-white/[0.01] border-b border-white/[0.04]">
              <div className="flex items-center gap-1 overflow-x-auto">
                {PIPELINE.map((step, i) => {
                  const cur  = step.key === status || (step.key === "selected" && status === "candidate");
                  const past = !cur && pIdx > i;
                  return (
                    <div key={step.key} className="flex items-center gap-1 flex-shrink-0">
                      {i > 0 && <div className={`w-4 h-px ${past || cur ? "bg-amber-500/35" : "bg-white/[0.06]"}`} />}
                      <div className={`flex items-center gap-1 px-2 py-0.5 rounded text-[8px] ${
                        cur  ? "bg-amber-500/10 border border-amber-500/22 text-amber-300" :
                        past ? "text-white/28" : "text-white/10"
                      }`}>
                        <div className={`w-1 h-1 rounded-full ${cur ? "bg-amber-400" : past ? "bg-white/22" : "bg-white/7"}`} />
                        {step.short}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Notice */}
          {notice && (
            <div className={`mx-6 mt-4 px-4 py-2 rounded-lg text-xs border ${
              notice.startsWith("❌")
                ? "bg-red-900/15 border-red-800/25 text-red-300"
                : "bg-emerald-900/15 border-emerald-800/25 text-emerald-300"
            }`}>{notice}</div>
          )}

          <div className="p-6 grid grid-cols-1 lg:grid-cols-[1fr_290px] gap-6">

            {/* ── Gauche ── */}
            <div className="space-y-4">
              <AutoChecks movie={movie} />

              <Blk title="Informations">
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-[11px]">
                  {[
                    ["Producteur",       movie.Producer ? `${movie.Producer.first_name} ${movie.Producer.last_name}` : "—"],
                    ["E-mail",           movie.Producer?.email || "—"],
                    ["Durée",            movie.duration ? `${movie.duration}s` : "—"],
                    ["Langue",           movie.main_language || "—"],
                    ["Nationalité",      movie.nationality || "—"],
                    ["Outil IA",         movie.ai_tool || "—"],
                    ["Classification IA",movie.production || "—"],
                    ["Méthodologie IA",  movie.workshop || "—"],
                    ["Connu via",        movie.Producer?.known_by_mars_ai || "—"],
                  ].map(([lbl, val]) => (
                    <div key={lbl}>
                      <p className="text-[7px] uppercase tracking-widest text-white/18 mb-0.5">{lbl}</p>
                      <p className="text-white/55 truncate">{val}</p>
                    </div>
                  ))}
                </div>
              </Blk>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Blk title="Synopsis (FR)">
                  <p className="text-[11px] text-white/45 leading-relaxed line-clamp-4">{movie.synopsis || movie.description || "—"}</p>
                </Blk>
                <Blk title="Synopsis (EN)">
                  <p className="text-[11px] text-white/45 leading-relaxed line-clamp-4">{movie.synopsis_anglais || "—"}</p>
                </Blk>
              </div>

              {(trailer || movie.youtube_link) && (
                <Blk title="Visionner">
                  {trailer ? (
                    <div className="aspect-video max-h-52 rounded-lg overflow-hidden">
                      <VideoPreview title={movie.title} src={`${UPLOAD_BASE}/${trailer}`} poster={poster || undefined} />
                    </div>
                  ) : (
                    <a href={movie.youtube_link} target="_blank" rel="noreferrer"
                      className="text-sm text-amber-400 hover:text-amber-300">Ouvrir YouTube ↗</a>
                  )}
                </Blk>
              )}

              {(summary?.votes?.length || 0) > 0 && (
                <Blk title={`Votes Phase 1 (${summary.total})`}>
                  <div className="flex gap-6 mb-3">
                    {[["Validé","YES","text-emerald-400"],["À discuter","TO DISCUSS","text-amber-400"],["Refusé","NO","text-red-400"]].map(([lbl,k,col]) => (
                      <div key={k} className="text-center">
                        <p className={`text-xl font-bold ${col}`}>{summary[k]}</p>
                        <p className="text-[9px] text-white/25">{lbl}</p>
                      </div>
                    ))}
                  </div>
                  {summary.total > 0 && (
                    <div className="h-1.5 rounded-full flex overflow-hidden bg-white/[0.06] mb-3">
                      <div className="bg-emerald-500 h-full" style={{ width: `${(summary.YES/summary.total)*100}%` }} />
                      <div className="bg-amber-500 h-full"  style={{ width: `${(summary["TO DISCUSS"]/summary.total)*100}%` }} />
                      <div className="bg-red-500 h-full"    style={{ width: `${(summary.NO/summary.total)*100}%` }} />
                    </div>
                  )}
                  <div className="space-y-1.5 max-h-36 overflow-y-auto">
                    {summary.votes.map((v) => (
                      <div key={v.id_vote} className="flex items-start gap-3 bg-white/[0.025] border border-white/[0.04] rounded-lg px-3 py-2 text-[11px]">
                        <span className="text-white/40 flex-1 truncate">
                          {v.User ? `${v.User.first_name} ${v.User.last_name}` : `Jury #${v.id_user}`}
                        </span>
                        <span className={`text-[9px] px-2 py-0.5 rounded-full font-semibold ${
                          v.note === "YES" ? "bg-emerald-500/12 text-emerald-300" :
                          v.note === "NO"  ? "bg-red-500/12 text-red-300" :
                          "bg-amber-500/12 text-amber-300"
                        }`}>{v.note}</span>
                      </div>
                    ))}
                  </div>
                </Blk>
              )}
            </div>

            {/* ── Droite ── */}
            <div className="space-y-4">

              {/* Actions contextuelles */}
              <Blk title="Actions disponibles">
                {info && (
                  <div className="mb-3 px-3 py-2 bg-amber-500/[0.06] border border-amber-500/14 rounded-lg text-[11px] text-amber-200/65 leading-relaxed">
                    {info}
                  </div>
                )}
                {primary.length > 0 && (
                  <div className="space-y-2 mb-2">
                    {primary.map((a) => (
                      <button key={a.to} type="button"
                        disabled={a.cls.includes("disabled")}
                        onClick={() => !a.cls.includes("disabled") && onStatus(movie.id_movie, a.to)}
                        className={`w-full px-3 py-2.5 rounded-lg text-xs font-semibold text-left transition ${a.cls}`}>
                        {a.label}
                        {a.tip && <p className="text-[9px] font-normal opacity-55 mt-0.5">{a.tip}</p>}
                      </button>
                    ))}
                  </div>
                )}
                {danger.length > 0 && (
                  <div className={`space-y-1.5 ${primary.length > 0 ? "pt-2 border-t border-white/[0.05]" : ""}`}>
                    {danger.map((a) => (
                      <button key={a.to} type="button" onClick={() => onStatus(movie.id_movie, a.to)}
                        className={`w-full px-3 py-2 rounded-lg text-xs text-left transition ${a.cls}`}>
                        {a.label}
                      </button>
                    ))}
                  </div>
                )}
                {primary.length === 0 && danger.length === 0 && !info && (
                  <p className="text-xs text-white/18 italic">Aucune action disponible.</p>
                )}
              </Blk>

              {/* Override manuel */}
              <Blk title="Forcer un statut">
                <button onClick={() => setManual((p) => !p)}
                  className="w-full flex items-center justify-between text-[11px] text-white/30 hover:text-white/55 transition">
                  <span>Cas particuliers (sans validation)</span>
                  <span className={`transition-transform ${manual ? "rotate-180" : ""}`}>▾</span>
                </button>
                {manual && (
                  <div className="mt-3 space-y-1 pt-3 border-t border-white/[0.05]">
                    {Object.entries(S).filter(([s]) => s !== status).map(([s, m]) => (
                      <button key={s} type="button" onClick={() => onStatus(movie.id_movie, s)}
                        className="w-full flex items-center gap-2 px-3 py-2 bg-white/[0.03] border border-white/[0.05] text-white/45 text-xs rounded-lg hover:bg-white/[0.06] hover:text-white/70 transition text-left">
                        <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${m.dot}`} />
                        {m.label}
                      </button>
                    ))}
                  </div>
                )}
              </Blk>

              {/* Catégories */}
              <Blk title="Catégories">
                <div className="flex flex-wrap gap-1.5 mb-2">
                  {categories.map((c) => (
                    <button key={c.id_categorie} type="button"
                      onClick={() => {
                        const curr = catSel[movie.id_movie] || [];
                        const next = curr.includes(c.id_categorie) ? curr.filter((x) => x !== c.id_categorie) : [...curr, c.id_categorie];
                        setCatSel((p) => ({ ...p, [movie.id_movie]: next }));
                      }}
                      className={`text-[10px] px-2 py-1 rounded-full border transition ${
                        currentCats.includes(c.id_categorie)
                          ? "bg-amber-500/12 border-amber-500/30 text-amber-300"
                          : "bg-white/[0.04] border-white/[0.07] text-white/35 hover:bg-white/[0.07]"
                      }`}>
                      {c.name}
                    </button>
                  ))}
                </div>
                <button type="button" onClick={() => onCategories(movie.id_movie)}
                  className="w-full px-3 py-1.5 bg-white/[0.04] border border-white/[0.06] text-white/45 text-xs rounded-lg hover:bg-white/[0.07] hover:text-white/65 transition">
                  Enregistrer
                </button>
              </Blk>

              {/* Jurys (lecture seule) */}
              <Blk title="Jurys assignés">
                {juries.length === 0
                  ? <p className="text-xs text-white/22 italic mb-2">Aucun jury assigné.</p>
                  : <div className="space-y-1.5 mb-2">
                      {juries.map((j) => (
                        <div key={j.id_user} className="flex items-center gap-2 text-[11px]">
                          <div className="w-5 h-5 rounded-full bg-gradient-to-br from-violet-600 to-pink-600 flex items-center justify-center text-[7px] font-bold flex-shrink-0">
                            {j.first_name?.[0]}{j.last_name?.[0]}
                          </div>
                          <span className="text-white/50">{j.first_name} {j.last_name}</span>
                        </div>
                      ))}
                    </div>
                }
                <p className="text-[9px] text-white/18 italic">
                  Gérer dans <span className="text-amber-400/45">Distribution & Jury</span>.
                </p>
              </Blk>

              {/* Note interne */}
              <Blk title="Note interne">
                <textarea value={adminComment} onChange={(e) => setAdminComment(e.target.value)}
                  rows={3} placeholder="Note confidentielle…"
                  className="w-full bg-white/[0.04] border border-white/[0.06] text-white text-xs px-3 py-2 rounded-lg focus:outline-none focus:border-amber-500/25 resize-none mb-2 placeholder:text-white/15" />
                <button type="button" onClick={() => onComment(movie.id_movie)}
                  className="w-full px-3 py-1.5 bg-white/[0.04] border border-white/[0.06] text-white/45 text-xs rounded-lg hover:bg-white/[0.07] hover:text-white/65 transition">
                  Enregistrer
                </button>
              </Blk>

              {/* Fichiers */}
              <Blk title="Fichiers">
                <div className="space-y-2">
                  {trailer && (
                    <a href={`${UPLOAD_BASE}/${trailer}`} target="_blank" rel="noreferrer"
                      className="flex items-center gap-2 text-xs text-amber-400/60 hover:text-amber-300 transition">
                      ▶ Télécharger le film
                    </a>
                  )}
                  {movie.subtitle && (
                    <a href={`${UPLOAD_BASE}/${movie.subtitle}`} target="_blank" rel="noreferrer" download
                      className="flex items-center gap-2 text-xs text-amber-400/60 hover:text-amber-300 transition">
                      📄 Sous-titres
                    </a>
                  )}
                  {movie.youtube_link && (
                    <a href={movie.youtube_link} target="_blank" rel="noreferrer"
                      className="flex items-center gap-2 text-xs text-red-400/60 hover:text-red-300 transition">
                      ▶ YouTube
                    </a>
                  )}
                  {!trailer && !movie.subtitle && !movie.youtube_link && (
                    <p className="text-xs text-white/18 italic">Aucun fichier.</p>
                  )}
                </div>
              </Blk>

              <button type="button" onClick={() => onDelete(movie.id_movie)}
                className="w-full px-3 py-2 text-xs text-red-500/35 border border-red-900/25 rounded-lg hover:bg-red-900/12 hover:text-red-400 transition">
                🗑 Supprimer définitivement
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── Vérifications auto ───────────────────────────────── */
function AutoChecks({ movie }) {
  const trailer = getTrailer(movie);
  const checks = [
    { label: "Durée ≤ 120s",         ok: !movie.duration || movie.duration <= 120, note: movie.duration ? `${movie.duration}s` : "non renseignée" },
    { label: "Titre",                ok: Boolean(movie.title?.trim())                                                                               },
    { label: "Synopsis",             ok: Boolean((movie.synopsis || movie.description)?.trim())                                                     },
    { label: "Fichier vidéo",        ok: Boolean(trailer || movie.youtube_link), note: "absent"                                                     },
    { label: "Classification IA",    ok: Boolean(movie.production?.trim()), note: "non renseignée"                                                  },
  ];
  const passed = checks.filter((c) => c.ok).length;

  return (
    <Blk title={`Vérifications — ${passed} / ${checks.length}`}>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
        {checks.map((c) => (
          <div key={c.label} className={`flex items-start gap-2 px-3 py-2 rounded-lg border text-[11px] ${
            c.ok
              ? "bg-emerald-900/[0.1] border-emerald-800/18 text-emerald-400/75"
              : "bg-red-900/[0.1]     border-red-800/18     text-red-400/75"
          }`}>
            <span className="mt-px flex-shrink-0">{c.ok ? "✓" : "✗"}</span>
            <div className="min-w-0">
              <p className="font-medium leading-tight">{c.label}</p>
              {!c.ok && c.note && <p className="text-[9px] opacity-45">{c.note}</p>}
            </div>
          </div>
        ))}
      </div>
    </Blk>
  );
}

function Blk({ title, children }) {
  return (
    <div className="bg-white/[0.018] border border-white/[0.055] rounded-xl p-4">
      <h3 className="text-[7px] uppercase tracking-[0.22em] text-white/22 font-semibold mb-3">{title}</h3>
      {children}
    </div>
  );
}