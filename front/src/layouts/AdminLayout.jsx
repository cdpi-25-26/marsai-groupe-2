// import { Outlet } from "react-router";
// import Navbar from "../components/Navbar";
// import Footer from "../components/Footer";

/**
 * AdminLayout (Layout Administrateur)
 * Template pour les pages d'administration
 * Contient: Navbar, barre latérale
 * Accessible uniquement par les administrateurs
 * @returns {JSX.Element} Layout avec Navbar et Outlet pour les pages enfants
 */
// export default function AdminLayout() {
//   return (
//     <div className="flex flex-col min-h-screen">
//       {/* <Navbar /> */}
//       <aside>Barre latéra</aside>
//       <main>
//         <Outlet />
//       </main>
//       {/* <Footer /> */}
//     </div>
//   );
// }

import { Outlet, NavLink, useNavigate } from "react-router";
import { useState, useEffect } from "react";

/**
 * AdminLayout - Professional admin dashboard layout
 * Works with react-router (not react-router-dom)
 * Provides sidebar + header + protected admin wrapper
 */
export default function AdminLayout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const navigate = useNavigate();

  // Get user info from localStorage
  const firstName = localStorage.getItem("firstName") || "Admin";
  const role = localStorage.getItem("role") || "ADMIN";
  const token = localStorage.getItem("token");

  /**
   * 🔐 Auth Guard
   * Redirect if not logged in
   */
  useEffect(() => {
    if (!token) {
      navigate("/auth/login", { replace: true });
    }
  }, [token, navigate]);

  /**
   * Logout handler
   */
  const handleLogout = () => {
    localStorage.clear();
    navigate("/auth/login", { replace: true });
  };

  /**
   * Sidebar menu items
   */
  const menuItems = [
    { path: "/admin", icon: "📊", label: "Overview", exact: true },
    { path: "/admin/films", icon: "🎬", label: "Gestion films" },
    { path: "/admin/users", icon: "👥", label: "Gestion utilisateurs" },
    { path: "/admin/users", icon: "👥", label: "Distribution & Jury" },
    { path: "/admin/results", icon: "📈", label: "Résultats & classement" },
    { path: "/admin/leaderboard", icon: "🏆", label: "Leaderboard officiel" },
    { path: "/admin/events", icon: "📅", label: "Événements" },
    {
      path: "/admin/messages",
      icon: "✉️",
      label: "Messages",
      badge: 2,
    },
    { path: "/admin/festival-box", icon: "📦", label: "Festival Box" },
    {
      path: "/admin/settings",
      icon: "⚙️",
      label: "Configuration Festival",
    },
  ];

  return (
    <div className="flex h-screen bg-black text-white overflow-hidden">
      {/* ================= SIDEBAR ================= */}
      <aside
        className={`${
          isSidebarOpen ? "w-64" : "w-20"
        } bg-neutral-900 border-r border-neutral-800 flex flex-col transition-all duration-300`}
      >
        {/* Logo / Profile */}
        <div className="p-6 border-b border-neutral-800">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center font-bold relative">
              {firstName.charAt(0).toUpperCase()}
              <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-neutral-900"></span>
            </div>

            {isSidebarOpen && (
              <div className="flex-1 min-w-0">
                <p className="font-semibold truncate">{firstName}</p>
                <p className="text-xs text-neutral-400 uppercase tracking-wide">
                  {role}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto py-4 px-2">
          {menuItems.map((item, index) => (
            <NavLink
              key={index}
              to={item.path}
              end={item.exact}
              className={({ isActive }) =>
                `flex items-center space-x-3 px-4 py-3 mb-1 rounded-lg transition-all duration-200 group ${
                  isActive
                    ? "bg-blue-600 text-white"
                    : "text-neutral-400 hover:bg-neutral-800 hover:text-white"
                }`
              }
            >
              <span className="text-xl flex-shrink-0">{item.icon}</span>

              {isSidebarOpen && (
                <>
                  <span className="text-sm font-medium flex-1">
                    {item.label}
                  </span>

                  {item.badge && (
                    <span className="bg-blue-600 text-xs font-bold px-2 py-0.5 rounded-full">
                      {item.badge}
                    </span>
                  )}
                </>
              )}
            </NavLink>
          ))}
        </nav>

        {/* Bottom Card */}
        <div className="p-4 border-t border-neutral-800 space-y-3">
          {isSidebarOpen ? (
            <div className="bg-gradient-to-br from-blue-600 to-purple-700 rounded-lg p-4 space-y-2">
              <div className="flex items-center space-x-2">
                <span className="text-2xl">🚀</span>
                <span className="font-bold">Mars AI</span>
              </div>

              <p className="text-xs text-blue-100 opacity-90">Dashboard</p>

              <button
                onClick={handleLogout}
                className="w-full bg-neutral-900 hover:bg-black text-sm py-2 px-4 rounded-lg transition-colors"
              >
                Log out
              </button>
            </div>
          ) : (
            <button
              onClick={handleLogout}
              className="w-full flex items-center justify-center p-3 rounded-lg bg-neutral-800 hover:bg-red-600 transition-colors"
              title="Logout"
            >
              🚪
            </button>
          )}
        </div>
      </aside>

      {/* ================= MAIN ================= */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-neutral-900 border-b border-neutral-800 px-8 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            {/* Sidebar Toggle */}
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="p-2 hover:bg-neutral-800 rounded-lg"
            >
              ☰
            </button>

            <div className="flex items-center space-x-2 font-bold text-xl">
              <span>MARS</span>
              <span className="text-blue-500">AI</span>
            </div>
          </div>

          {/* Right header */}
          <div className="flex items-center space-x-4">
            {/* Search */}
            <input
              type="text"
              placeholder="Rechercher..."
              className="bg-neutral-800 rounded-lg px-4 py-2 w-64 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />

            {/* Icons */}
            <button className="p-2 hover:bg-neutral-800 rounded-lg">🏠</button>
            <button className="p-2 hover:bg-neutral-800 rounded-lg">🏆</button>
            <button className="p-2 hover:bg-neutral-800 rounded-lg">👤</button>
          </div>
        </header>

        {/* Page Content (OLD LAYOUT FUNCTIONALITY) */}
        <div className="flex-1 overflow-y-auto bg-black p-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
