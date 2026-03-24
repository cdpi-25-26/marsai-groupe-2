import { useEffect, useRef, useState } from "react";
import { UPLOAD_BASE } from "../../utils/constants";
import { getPoster, getTrailer } from "../../utils/movieUtils";
import { useTranslation } from "react-i18next";

const API = import.meta.env.VITE_API_URL || "http://localhost:3000";

const GRAIN = `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`;

export default function Selection() {
   const { t } = useTranslation();
   const [movies,  setMovies]  = useState([]);
   const [phase,   setPhase]   = useState(null);
   const [phaseSplit, setPhaseSplit] = useState(0); // Index where palmares ends and selection begins
   const [loading, setLoading] = useState(true);
   const [active,  setActive]  = useState(null);
   const [currentPage, setCurrentPage] = useState(1);
   const videoRef = useRef(null);
   const gridRef  = useRef(null);

   const MOVIES_PER_PAGE = 10;

   useEffect(() => {
      fetch(`${API}/festival/phase`)
        .then((r) => r.json())
        .then(async (data) => {
          const activePhase = data.phase ?? 0;
          setPhase(activePhase);
          if (activePhase === 2 || activePhase === 3) {
            const res = await fetch(`${API}/movies/phase${activePhase}`);
            const list = await res.json();
            if (Array.isArray(list)) {
              // Phase 3: split into palmares (first half - awarded) and selection (second half)
              const awardedCount = list.filter(m => m.selection_status === 'awarded').length;
              setMovies(list);
              // Store the split point for rendering
              if (activePhase === 3) {
                setPhaseSplit(awardedCount);
              }
            }
          }
        })
        .catch(() => setPhase(0))
        .finally(() => setLoading(false));
    }, []);

  useEffect(() => {
    function onKey(e) { if (e.key === "Escape") setActive(null); }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  useEffect(() => {
    if (!active && videoRef.current) {
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
    }
  }, [active]);

  /* ── Loading ── */
  if (loading) {
    return (
      <div className="flex items-center justify-center py-32">
        <div className="flex flex-col items-center gap-4">
          <div className="w-8 h-8 border-2 border-white/10 border-t-[#AD46FF] rounded-full animate-spin" />
          <p className="text-white/25 text-xs tracking-widest uppercase">{t("pages.selection.loading")}</p>
        </div>
      </div>
    );
  }

  /* ── Phase 0 — before festival ── */
  if (phase === 0 || phase === null || movies.length === 0) {
    return (
      <div className="flex items-center justify-center py-32 px-6">
        <div className="text-center flex flex-col items-center gap-5">
          {/* Same hero style, no movies yet */}
          <span className="inline-flex items-center gap-2 text-[10px] tracking-[0.35em] uppercase text-[#AD46FF]/60 font-medium">
            <span className="w-1.5 h-1.5 rounded-full bg-[#AD46FF]/60 animate-pulse" />
            Festival MARS AI · Édition 2026
          </span>
          <h1 className="text-5xl sm:text-6xl font-black tracking-tight">
            <span className="text-white">{t("pages.selection.title")} </span>
            <span className="bg-gradient-to-r from-[#AD46FF] to-[#F6339A] bg-clip-text text-transparent">{t("pages.selection.titleAccent")}</span>
          </h1>
          <p className="text-white/30 text-sm max-w-sm leading-relaxed">
            {t("pages.selection.comingSoon")}.
          </p>
          <div className="flex items-center gap-3 mt-2">
            <div className="h-px w-20 bg-gradient-to-r from-transparent to-[#AD46FF]/40" />
            <div className="w-1 h-1 rounded-full bg-[#AD46FF]/50" />
            <div className="h-px w-20 bg-gradient-to-l from-transparent to-[#F6339A]/40" />
          </div>
        </div>
      </div>
    );
  }

  const isPhase3       = phase === 3;
  const hasBothSections = isPhase3 && phaseSplit > 0 && phaseSplit < movies.length;
  
  // Split movies into palmares and selection for phase 3
  const palmaresMovies = hasBothSections ? movies.slice(0, phaseSplit) : (isPhase3 ? movies : []);
  const selectionMovies = hasBothSections ? movies.slice(phaseSplit) : movies;
  
  // When both sections are shown, use different titles
  const heroTitle    = hasBothSections ? "Festival" : (isPhase3 ? t("pages.selection.titlePhase3") : t("pages.selection.title"));
  const heroAccent   = hasBothSections ? "MARS AI" : (isPhase3 ? t("pages.selection.titleAccentPhase3") : t("pages.selection.titleAccent"));
  const heroSubtitle = hasBothSections ? "Palmares & Selection Officielle" : (isPhase3 ? t("pages.selection.subtitlePhase3") : t("pages.selection.subtitle"));
  const heroBadge    = isPhase3 ? t("pages.selection.heroBadgePhase3")   : t("pages.selection.heroBadge");
 
  const activeTrailer = active ? getTrailer(active) : null;
  const activePoster  = active ? getPoster(active)  : null;
  
  // For phase 3 with both sections, handle pagination separately
  const totalPages = hasBothSections 
    ? Math.ceil(Math.max(palmaresMovies.length, selectionMovies.length) / MOVIES_PER_PAGE)
    : Math.ceil(movies.length / MOVIES_PER_PAGE);
    
  const paginatedMovies = hasBothSections 
    ? null // Use separate paginated arrays for each section
    : movies.slice(
        (currentPage - 1) * MOVIES_PER_PAGE,
        currentPage * MOVIES_PER_PAGE,
      );
      
  const paginatedPalmares = hasBothSections 
    ? palmaresMovies.slice((currentPage - 1) * MOVIES_PER_PAGE, currentPage * MOVIES_PER_PAGE)
    : [];
  const paginatedSelection = hasBothSections 
    ? selectionMovies.slice((currentPage - 1) * MOVIES_PER_PAGE, currentPage * MOVIES_PER_PAGE)
    : [];

  const goToPage = (page) => {
    setCurrentPage(page);
    gridRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div className="text-white overflow-x-hidden">

      {/* ── HERO ────────────────────────────── */}
      <section className="relative flex flex-col items-center justify-center pt-40 pb-28 px-6 text-center overflow-hidden">

       

        {/* Ambient glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[300px] rounded-full bg-gradient-to-r from-[#AD46FF]/8 to-[#F6339A]/8 blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col items-center gap-5">
          <span className="inline-flex items-center gap-2 text-[10px] tracking-[0.35em] uppercase text-[#AD46FF]/60 font-medium">
            <span className="w-1.5 h-1.5 rounded-full bg-[#AD46FF]/60 animate-pulse" />
            Festival MARS AI · Édition 2026
          </span>

          <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black tracking-tight leading-none">
            <span className="text-white">{heroTitle} </span>
            <span className="bg-gradient-to-r from-[#AD46FF] to-[#F6339A] bg-clip-text text-transparent">
              {heroAccent}
            </span>
          </h1>

          <p className="max-w-lg text-white/40 text-sm sm:text-base leading-relaxed mt-1">
            {heroSubtitle}
          </p>

          <div className="flex items-center gap-3 mt-3">
            <div className="h-px w-20 bg-gradient-to-r from-transparent to-[#AD46FF]/50" />
            <div className="w-1 h-1 rounded-full bg-[#AD46FF]/60" />
            <div className="h-px w-20 bg-gradient-to-l from-transparent to-[#F6339A]/50" />
          </div>

          {/* Film count badge */}
          {!hasBothSections && (
            <div className="flex items-center gap-2 mt-2 bg-white/[0.04] border border-white/10 rounded-full px-4 py-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#AD46FF]/70" />
              <span className="text-[11px] text-white/40 font-medium tracking-wide">
                {movies.length} film{movies.length > 1 ? "s" : ""}
              </span>
            </div>
          )}
          {hasBothSections && (
            <div className="flex items-center justify-center gap-6 mt-2">
              <div className="flex items-center gap-2 bg-yellow-500/10 border border-yellow-500/20 rounded-full px-4 py-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-yellow-500/70" />
                <span className="text-[11px] text-yellow-300 font-medium tracking-wide">
                  🏆 {palmaresMovies.length} film{palmaresMovies.length > 1 ? "s" : ""}
                </span>
              </div>
              <div className="flex items-center gap-2 bg-[#AD46FF]/10 border border-[#AD46FF]/20 rounded-full px-4 py-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#AD46FF]/70" />
                <span className="text-[11px] text-[#AD46FF] font-medium tracking-wide">
                  ⭐ {selectionMovies.length} film{selectionMovies.length > 1 ? "s" : ""}
                </span>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* ── POSTER GRID ─────────────────────── */}
      <div ref={gridRef} className="max-w-6xl mx-auto px-4 sm:px-6 pb-32 space-y-16">
        
        {/* Palmares Section (Phase 3 with both) */}
        {hasBothSections && palmaresMovies.length > 0 && (
          <div>
            <div className="flex items-center justify-center gap-4 mb-8">
              <div className="h-px flex-1 bg-gradient-to-r from-transparent to-yellow-500/40" />
              <h2 className="text-2xl sm:text-3xl font-black text-yellow-400 tracking-tight">
                🏆 Palmarès
              </h2>
              <div className="h-px flex-1 bg-gradient-to-l from-transparent to-yellow-500/40" />
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4">
              {paginatedPalmares.map((movie) => {
                const trailer  = getTrailer(movie);
                const poster   = getPoster(movie);
                const hasVideo = !!(trailer || movie.youtube_link);

                return (
                  <button
                    key={movie.id_movie}
                    onClick={() => hasVideo && setActive(movie)}
                    className={`group relative text-left focus:outline-none ${hasVideo ? "cursor-pointer" : "cursor-default"}`}
                    style={{ aspectRatio: "2/3" }}
                  >
                    <div className="relative w-full h-full border border-white/5 rounded-lg overflow-hidden shadow-[0_8px_32px_rgba(0,0,0,0.8)] group-hover:shadow-[0_14px_44px_rgba(173,70,255,0.18)] transition-all duration-500 group-hover:-translate-y-2">
                      {poster ? (
                        <img src={poster} alt={movie.title} className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                      ) : (
                        <div className="absolute inset-0 bg-gradient-to-br from-[#1a1025] via-[#0d0f14] to-[#1a0a20] flex items-center justify-center">
                          <span className="text-4xl opacity-15">🎬</span>
                        </div>
                      )}
                      <div className="absolute inset-0 opacity-[0.07] pointer-events-none mix-blend-overlay" style={{ backgroundImage: GRAIN, backgroundSize: "120px 120px" }} />
                      <div className="absolute inset-0 bg-gradient-to-b from-black/25 via-transparent to-transparent" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/35 to-transparent" />
                      <div className="absolute top-2.5 left-2.5 w-3 h-3 border-t border-l border-white/20" />
                      <div className="absolute top-2.5 right-2.5 w-3 h-3 border-t border-r border-white/20" />
                      <div className="absolute bottom-2.5 left-2.5 w-3 h-3 border-b border-l border-white/20" />
                      <div className="absolute bottom-2.5 right-2.5 w-3 h-3 border-b border-r border-white/20" />
                      {movie.Awards?.length > 0 && (
                        <div className="absolute top-3 left-3 flex flex-col gap-1 z-10">
                          {movie.Awards.map((a) => (
                            <span key={a.id_award} className="inline-flex items-center gap-1 px-1.5 py-0.5 text-[8px] font-bold uppercase tracking-widest backdrop-blur-sm rounded-sm bg-yellow-400/20 text-yellow-300 border border-yellow-400/30 max-w-[100px] truncate">
                              🏆 {a.award_name}
                            </span>
                          ))}
                        </div>
                      )}
                      {hasVideo && (
                        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10">
                          <div className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-sm border border-white/25 flex items-center justify-center shadow-xl">
                            <svg className="w-5 h-5 text-white ml-0.5" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z" /></svg>
                          </div>
                        </div>
                      )}
                      <div className="absolute bottom-0 left-0 right-0 px-3 pb-3 pt-1">
                        <div className="flex items-center gap-1.5 mb-1.5">
                          <div className="flex-1 h-px bg-white/20" />
                          <span className="text-[6px] tracking-[0.2em] text-white/35 uppercase font-medium">MarsAI</span>
                          <div className="flex-1 h-px bg-white/20" />
                        </div>
                        <p className="font-bold uppercase tracking-wide leading-tight text-white group-hover:text-[#C179FB] transition-colors duration-300 line-clamp-2" style={{ fontSize: "clamp(8px, 1.8vw, 12px)", textShadow: "0 1px 6px rgba(0,0,0,1)" }}>
                          {movie.title}
                        </p>
                        <div className="flex items-center gap-1 mt-1 text-white/35" style={{ fontSize: "8px" }}>
                          {movie.main_language && <span className="uppercase tracking-wider">{movie.main_language}</span>}
                          {movie.duration && movie.main_language && <span>·</span>}
                          {movie.duration && <span>{movie.duration}s</span>}
                          {movie.nationality && <><span>·</span><span>{movie.nationality}</span></>}
                        </div>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Selection Officielle Section */}
        <div>
          {(hasBothSections ? selectionMovies.length > 0 : movies.length > 0) && (
            <div className="flex items-center justify-center gap-4 mb-8">
              <div className="h-px flex-1 bg-gradient-to-r from-transparent to-[#AD46FF]/40" />
              <h2 className="text-2xl sm:text-3xl font-black tracking-tight">
                {hasBothSections ? "⭐ Sélection Officielle" : heroTitle}
                <span className="bg-gradient-to-r from-[#AD46FF] to-[#F6339A] bg-clip-text text-transparent ml-2">
                  {hasBothSections ? "" : heroAccent}
                </span>
              </h2>
              <div className="h-px flex-1 bg-gradient-to-l from-transparent to-[#F6339A]/40" />
            </div>
          )}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4">
            {(hasBothSections ? paginatedSelection : paginatedMovies).map((movie) => {
              const trailer  = getTrailer(movie);
              const poster   = getPoster(movie);
              const hasVideo = !!(trailer || movie.youtube_link);

              return (
                <button
                  key={movie.id_movie}
                  onClick={() => hasVideo && setActive(movie)}
                  className={`group relative text-left focus:outline-none ${hasVideo ? "cursor-pointer" : "cursor-default"}`}
                  style={{ aspectRatio: "2/3" }}
                >
                  <div className="relative w-full h-full border border-white/5 rounded-lg overflow-hidden shadow-[0_8px_32px_rgba(0,0,0,0.8)] group-hover:shadow-[0_14px_44px_rgba(173,70,255,0.18)] transition-all duration-500 group-hover:-translate-y-2">
                    {poster ? (
                      <img src={poster} alt={movie.title} className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                    ) : (
                      <div className="absolute inset-0 bg-gradient-to-br from-[#1a1025] via-[#0d0f14] to-[#1a0a20] flex items-center justify-center">
                        <span className="text-4xl opacity-15">🎬</span>
                      </div>
                    )}
                    <div className="absolute inset-0 opacity-[0.07] pointer-events-none mix-blend-overlay" style={{ backgroundImage: GRAIN, backgroundSize: "120px 120px" }} />
                    <div className="absolute inset-0 bg-gradient-to-b from-black/25 via-transparent to-transparent" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/35 to-transparent" />
                    <div className="absolute top-2.5 left-2.5 w-3 h-3 border-t border-l border-white/20" />
                    <div className="absolute top-2.5 right-2.5 w-3 h-3 border-t border-r border-white/20" />
                    <div className="absolute bottom-2.5 left-2.5 w-3 h-3 border-b border-l border-white/20" />
                    <div className="absolute bottom-2.5 right-2.5 w-3 h-3 border-b border-r border-white/20" />
                    {isPhase3 && movie.selection_status === 'awarded' && movie.Awards?.length > 0 && (
                      <div className="absolute top-3 left-3 flex flex-col gap-1 z-10">
                        {movie.Awards.map((a) => (
                          <span key={a.id_award} className="inline-flex items-center gap-1 px-1.5 py-0.5 text-[8px] font-bold uppercase tracking-widest backdrop-blur-sm rounded-sm bg-yellow-400/20 text-yellow-300 border border-yellow-400/30 max-w-[100px] truncate">
                            🏆 {a.award_name}
                          </span>
                        ))}
                      </div>
                    )}
                    {hasVideo && (
                      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10">
                        <div className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-sm border border-white/25 flex items-center justify-center shadow-xl">
                          <svg className="w-5 h-5 text-white ml-0.5" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z" /></svg>
                        </div>
                      </div>
                    )}
                    <div className="absolute bottom-0 left-0 right-0 px-3 pb-3 pt-1">
                      <div className="flex items-center gap-1.5 mb-1.5">
                        <div className="flex-1 h-px bg-white/20" />
                        <span className="text-[6px] tracking-[0.2em] text-white/35 uppercase font-medium">MarsAI</span>
                        <div className="flex-1 h-px bg-white/20" />
                      </div>
                      <p className="font-bold uppercase tracking-wide leading-tight text-white group-hover:text-[#C179FB] transition-colors duration-300 line-clamp-2" style={{ fontSize: "clamp(8px, 1.8vw, 12px)", textShadow: "0 1px 6px rgba(0,0,0,1)" }}>
                        {movie.title}
                      </p>
                      <div className="flex items-center gap-1 mt-1 text-white/35" style={{ fontSize: "8px" }}>
                        {movie.main_language && <span className="uppercase tracking-wider">{movie.main_language}</span>}
                        {movie.duration && movie.main_language && <span>·</span>}
                        {movie.duration && <span>{movie.duration}s</span>}
                        {movie.nationality && <><span>·</span><span>{movie.nationality}</span></>}
                      </div>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* ── Pagination ── */}
        {totalPages > 1 && (
          <div className="mt-12 flex flex-col items-center gap-4">
            <div className="flex items-center gap-3">
              <div className="flex-1 h-px bg-gradient-to-r from-transparent to-white/8 w-16" />
               <span className="text-[9px] tracking-[0.3em] uppercase text-white/20 font-medium">
                 {hasBothSections 
                   ? `${palmaresMovies.length + selectionMovies.length} films · ${t("pages.selection.page")} ${currentPage}/${totalPages}`
                   : t("pages.selection.filmCount", { count: movies.length }) + ` · ${t("pages.selection.page")} ${currentPage}/${totalPages}`
                 }
               </span>
               <div className="flex-1 h-px bg-gradient-to-l from-transparent to-white/8 w-16" />
            </div>

            <div className="flex items-center gap-1.5">
              {/* First */}
              <button
                onClick={() => goToPage(1)}
                disabled={currentPage === 1}
                className={`w-8 h-8 flex items-center justify-center rounded-lg border text-xs transition-all duration-200 ${currentPage === 1 ? "border-white/5 text-white/15 cursor-not-allowed" : "border-white/10 text-white/40 hover:border-[#AD46FF]/40 hover:text-[#AD46FF] hover:bg-[#AD46FF]/5"}`}
              >
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 19l-7-7 7-7m8 14l-7-7 7-7"/></svg>
              </button>
              {/* Prev */}
              <button
                onClick={() => goToPage(currentPage - 1)}
                disabled={currentPage === 1}
                className={`w-8 h-8 flex items-center justify-center rounded-lg border text-xs transition-all duration-200 ${currentPage === 1 ? "border-white/5 text-white/15 cursor-not-allowed" : "border-white/10 text-white/40 hover:border-[#AD46FF]/40 hover:text-[#AD46FF] hover:bg-[#AD46FF]/5"}`}
              >
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7"/></svg>
              </button>

              {/* Page numbers */}
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  onClick={() => goToPage(page)}
                  className={`w-8 h-8 flex items-center justify-center rounded-lg border text-xs font-medium transition-all duration-200 ${
                    currentPage === page
                      ? "border-[#AD46FF]/50 bg-gradient-to-b from-[#AD46FF]/20 to-[#AD46FF]/10 text-[#C179FB] shadow-[0_0_12px_rgba(173,70,255,0.2)]"
                      : "border-white/8 text-white/35 hover:border-[#AD46FF]/30 hover:text-[#AD46FF]/70 hover:bg-[#AD46FF]/5"
                  }`}
                >
                  {page}
                </button>
              ))}

              {/* Next */}
              <button
                onClick={() => goToPage(currentPage + 1)}
                disabled={currentPage === totalPages}
                className={`w-8 h-8 flex items-center justify-center rounded-lg border text-xs transition-all duration-200 ${currentPage === totalPages ? "border-white/5 text-white/15 cursor-not-allowed" : "border-white/10 text-white/40 hover:border-[#AD46FF]/40 hover:text-[#AD46FF] hover:bg-[#AD46FF]/5"}`}
              >
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7"/></svg>
              </button>
              {/* Last */}
              <button
                onClick={() => goToPage(totalPages)}
                disabled={currentPage === totalPages}
                className={`w-8 h-8 flex items-center justify-center rounded-lg border text-xs transition-all duration-200 ${currentPage === totalPages ? "border-white/5 text-white/15 cursor-not-allowed" : "border-white/10 text-white/40 hover:border-[#AD46FF]/40 hover:text-[#AD46FF] hover:bg-[#AD46FF]/5"}`}
              >
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 5l7 7-7 7M5 5l7 7-7 7"/></svg>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* ── LIGHTBOX ────────────────────────── */}
      {active && (
        <div
          className="fixed inset-0 z-50 bg-black/95 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setActive(null)}
        >
          <div className="w-full max-w-4xl" onClick={(e) => e.stopPropagation()}>

            {/* Header */}
            <div className="flex items-start justify-between mb-3 px-1">
              <div>
                <p className="text-[8px] tracking-[0.25em] uppercase text-[#AD46FF]/50 mb-1">
                  {heroBadge} · MarsAI Festival
                </p>
                <h2 className="text-white font-bold text-lg sm:text-xl uppercase tracking-wide">{active.title}</h2>
                <div className="flex items-center gap-2 mt-1 text-white/35 text-xs">
                  {active.main_language && <span>{active.main_language}</span>}
                  {active.duration      && <span>· {active.duration}s</span>}
                  {active.nationality   && <span>· {active.nationality}</span>}
                </div>
              </div>
              <button
                onClick={() => setActive(null)}
                className="flex-shrink-0 w-8 h-8 rounded-lg bg-white/8 hover:bg-white/15 border border-white/10 text-white/50 hover:text-white flex items-center justify-center transition-all ml-4 mt-1"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Awards divider */}
            <div className="flex items-center gap-3 mb-4 px-1">
              <div className="flex-1 h-px bg-white/10" />
              {isPhase3 && active.Awards?.length > 0 && (
                <div className="flex gap-1.5 flex-wrap justify-center">
                  {active.Awards.map((a) => (
                    <span key={a.id_award} className="text-[8px] px-2 py-0.5 rounded-sm bg-yellow-500/15 text-yellow-300 border border-yellow-500/25 font-medium">
                      🏆 {a.award_name}
                    </span>
                  ))}
                </div>
              )}
              <div className="flex-1 h-px bg-white/10" />
            </div>

            {/* Video */}
            <div className="rounded-2xl overflow-hidden border border-white/8 bg-black shadow-[0_0_80px_rgba(0,0,0,0.8)]">
              {activeTrailer ? (
                <video
                  ref={videoRef}
                  className="w-full aspect-video object-contain bg-black"
                  src={`${UPLOAD_BASE}/${activeTrailer}`}
                  poster={activePoster || undefined}
                  controls
                  autoPlay
                />
              ) : active.youtube_link ? (
                <div className="aspect-video flex items-center justify-center bg-black/60 relative">
                  {activePoster && (
                    <img src={activePoster} alt={active.title} className="absolute inset-0 w-full h-full object-cover opacity-30" />
                  )}
                  <a href={active.youtube_link} target="_blank" rel="noreferrer" className="relative z-10 flex flex-col items-center gap-3">
                    <div className="w-16 h-16 rounded-full bg-red-600/90 hover:bg-red-500 flex items-center justify-center shadow-xl transition-colors">
                      <svg className="w-7 h-7 text-white ml-1" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M8 5v14l11-7z" />
                      </svg>
                    </div>
                    <span className="text-white/60 text-xs">{t("selection.watchOnYouTube")}</span>
                  </a>
                </div>
              ) : null}
            </div>

            {/* Synopsis */}
            {(active.synopsis || active.description) && (
              <p className="mt-4 text-white/35 text-xs leading-relaxed px-1 line-clamp-3">
                {active.synopsis || active.description}
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}