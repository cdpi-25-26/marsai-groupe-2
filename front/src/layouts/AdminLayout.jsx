import { Outlet, NavLink, useNavigate } from "react-router";
import { useState, useEffect } from "react";

/**
 * AdminLayout - Professional admin dashboard layout
 * Provides sidebar + header + protected admin wrapper
 */

export default function AdminLayout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const navigate = useNavigate();

  const firstName = localStorage.getItem("firstName") || "Admin";
  const role = localStorage.getItem("role") || "ADMIN";
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!token) navigate("/auth/login", { replace: true });
  }, [token, navigate]);

  const handleLogout = () => {
    localStorage.clear();
    navigate("/auth/login", { replace: true });
  };

  const menuItems = [
    { path: "/admin", icon: "📊", label: "Overview", exact: true },
    { path: "/admin/movies", icon: "🎬", label: "Gestion films" },
    { path: "/admin/categories", icon: "📂", label: "Catégories" },
    { path: "/admin/awards", icon: "🏆", label: "Prix" },
    { path: "/admin/users", icon: "👥", label: "Gestion utilisateurs" },
    { path: "/admin/jury", icon: "👥", label: "Distribution & Jury" },
    { path: "/admin/results", icon: "📈", label: "Résultats & classement" },
    { path: "/admin/leaderboard", icon: "🎖️", label: "Leaderboard officiel" },
    { path: "/admin/events", icon: "📅", label: "Événements" },
    { path: "/admin/messages", icon: "✉️", label: "Messages", badge: 2 },
    { path: "/admin/festival-box", icon: "📦", label: "Festival Box" },
    { path: "/admin/settings", icon: "⚙️", label: "Configuration Festival" },
  ];

  return (
    <div className="flex h-screen bg-[#0d0f12] text-white overflow-hidden">
      {/* ================= SIDEBAR ================= */}
      <aside
        className={`
          ${isSidebarOpen ? "w-64" : "w-20"}
          bg-gradient-to-b from-[#111318] to-[#0c0e11]
          border-r border-white/5
          flex flex-col
          transition-all duration-300
          shadow-xl shadow-black/20
        `}
      >
        {/* Profile */}
        <div className="p-6 border-b border-white/5">
          <div
            className={`flex ${
              isSidebarOpen ? "items-center space-x-3" : "flex-col items-center"
            }`}
          >
            {/* Avatar */}
            <div className="w-12 h-12 flex-shrink-0">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-900 to-blue-100 flex items-center justify-center font-bold relative shadow-lg shadow-blue-500/20">
                {firstName.charAt(0).toUpperCase()}
                <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-[#0d0f12]"></span>
              </div>
            </div>

            {/* Text */}
            {isSidebarOpen && (
              <div className="flex-1 min-w-0">
                <p className="font-semibold truncate">{firstName}</p>
                <p className="text-xs text-white/40 uppercase tracking-wide">
                  {role}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto py-2 px-3 scrollbar-thin-dark">
          {menuItems.map((item, index) => (
            <NavLink
              key={index}
              to={item.path}
              end={item.exact}
              className={({ isActive }) =>
                `
                flex items-center space-x-2 px-2 py-1 mb-3 rounded-lg transition-all duration-200
                ${
                  isActive
                    ? "bg-gradient-to-r from-blue-600/20 to-blue-400/10 border border-blue-500/20 shadow-md shadow-blue-500/10"
                    : "text-white/50 hover:bg-white/5 hover:text-white"
                }
              `
              }
            >
              <span className="text-xl flex-shrink-0">{item.icon}</span>

              {isSidebarOpen && (
                <>
                  <span className="text-sm font-medium flex-1">
                    {item.label}
                  </span>

                  {item.badge && (
                    <span className="bg-blue-600/80 text-xs font-bold px-2 py-0.5 rounded-full">
                      {item.badge}
                    </span>
                  )}
                </>
              )}
            </NavLink>
          ))}
        </nav>

        {/* Bottom Card - Version minimaliste */}
        <div className="p-4 border-t border-white/10">
          {isSidebarOpen ? (
            <div className="bg-black/40 backdrop-blur-md border border-white/10 rounded-xl p-4 shadow-xl shadow-black/30">
              {/* Info utilisateur */}
              <div className="flex items-center gap-3 mb-4 pb-4 border-b border-white/10">
                <div className="w-8 h-8 rounded-lg bg-white/5 backdrop-blur-sm border border-blue-400/30 flex items-center justify-center ring-1 ring-blue-500/20 shadow-lg shadow-blue-500/10">
                  <svg
                    className="w-4 h-4 text-blue-300"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z"
                    />
                  </svg>
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-white">Mars AI</h3>
                  <p className="text-xs text-gray-400">Dashboard Admin</p>
                </div>
              </div>

              {/* Bouton Logout élégant */}
              <button
                onClick={handleLogout}
                className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg 
                 bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white
                 border border-white/10 hover:border-white/20
                 transition-all duration-200 group"
              >
                <svg
                  className="w-4 h-4 text-gray-400 group-hover:text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                  />
                </svg>
                <span className="text-sm">Se déconnecter</span>
              </button>
            </div>
          ) : (
            <button
              onClick={handleLogout}
              className="w-full flex items-center justify-center p-3 rounded-lg 
               bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white
               border border-white/10 hover:border-white/20
               transition-all duration-200"
              title="Se déconnecter"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                />
              </svg>
            </button>
          )}
        </div>
      </aside>

      {/* ================= MAIN ================= */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-[#111318]/80 backdrop-blur-xl border-b border-white/5 px-7 py-1 flex items-center justify-between shadow-lg shadow-black/20">
          <div className="flex items-center space-x-4">
            {/* Sidebar Toggle */}
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="p-2 rounded-lg transition-all duration-500 "
            >
              <span
                className={`inline-block transition-all duration-500 ${
                  isSidebarOpen ? "rotate-0" : "rotate-90"
                } text-2xl hover:scale-120`}
              >
                {isSidebarOpen ? "☰" : "✕"}
              </span>
            </button>

            <div className="flex items-center space-x-0 font-bold">
              <span className="text-blue-500 text-xl">MARS</span>
              <span className="text-blue-200 text-xl">AI</span>
            </div>
          </div>

          {/* Right header */}
          <div className="flex items-center space-x-4">
            {/* Search */}
            <input
              type="text"
              placeholder="Rechercher..."
              className="
                w-72 bg-white/5 
                backdrop-blur-lg 
                border border-white/10 
                text-sm text-white
                placeholder-white/30
                rounded-lg
                px-2 py-1
                shadow-md shadow-black/20
                focus:outline-none 
                focus:ring-2 
                focus:ring-blue-500/40
              "
            />

            {/* Icons */}
            <button className="p-2 hover:bg-white/5 rounded-lg border border-white/10">
              🏠
            </button>
            <button className="p-2 hover:bg-white/5 rounded-lg border border-white/10">
              🏆
            </button>
            <button className="p-2 hover:bg-white/5 rounded-lg border border-white/10">
              👤
            </button>
          </div>
        </header>

        {/* Page Content */}
        <div className="flex-1 overflow-y-auto bg-gradient-to-b from-[#0d0f12] to-[#0a0c0f] p-8 scrollbar-thin-dark">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
