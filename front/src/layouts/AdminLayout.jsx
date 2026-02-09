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
        <div className="p-5 border-b border-neutral-800">
          {" "}
          <div
            className={`flex ${isSidebarOpen ? "items-center space-x-3" : "flex-col items-center"}`}
          >
            {" "}
            {/* Avatar */}{" "}
            <div className="w-12 h-12 flex-shrink-0">
              {" "}
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-black-500 to-blue-500 flex items-center justify-center font-bold relative">
                {" "}
                {firstName.charAt(0).toUpperCase()}{" "}
                <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-neutral-900"></span>{" "}
              </div>{" "}
            </div>{" "}
            {/* Text only when open */}{" "}
            {isSidebarOpen && (
              <div className="flex-1 min-w-0">
                {" "}
                <p className="font-semibold truncate">{firstName}</p>{" "}
                <p className="text-xs text-neutral-400 uppercase tracking-wide">
                  {" "}
                  {role}{" "}
                </p>{" "}
              </div>
            )}{" "}
          </div>{" "}
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto py-4 px-2 scrollbar-thin-dark">
          {menuItems.map((item, index) => (
            <NavLink
              key={index}
              to={item.path}
              end={item.exact}
              className={({ isActive }) =>
                `flex items-center space-x-3 px-4 py-1 mb-1 rounded-lg transition-all duration-200 group ${
                  isActive
                    ? "bg-white/10 backdrop-blur-md border border-white/20 rounded-lg p-4 space-y-0"
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
            <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-lg p-4 space-y-2">
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
        <header className="bg-neutral-900 border-b border-neutral-800 px-7 py-2 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            {/* Sidebar Toggle */}
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="p-0 rounded-lg transition-all duration-500"
            >
              {" "}
              <span
                className={`inline-block transition-all duration-500 ${isSidebarOpen ? "rotate-0" : "rotate-90"}  text-2xl hover:scale-110`}
              >
                {" "}
                {isSidebarOpen ? "☰" : "✕"}{" "}
              </span>{" "}
            </button>
            <div className="flex items-center space-x-0 font-bold">
              <span className="text-yellow-500 text-xl">MARS</span>
              <span className="text-blue-500 text-xl">AI</span>
            </div>
          </div>

          {/* Right header */}
          <div className="flex items-center space-x-4 ">
            {/* Search */}
            <input
              type="text"
              placeholder="Rechercher..."
              className="w-74 bg-white/10 
    backdrop-blur-lg 
    border border-white/20 
    text-sm text-white
    placeholder-white/60
    rounded-lg 
    px-2 py-1
    shadow-sm shadow-black/20
    focus:outline-none 
    focus:ring-2 
    focus:ring-blue-500/50"
            />

            {/* Icons */}
            <button className="p-2 hover:bg-neutral-800 rounded-lg">🏠</button>
            <button className="p-2 hover:bg-neutral-800 rounded-lg">🏆</button>
            <button className="p-2 hover:bg-neutral-800 rounded-lg">👤</button>
          </div>
        </header>

        {/* Page Content */}
        <div className="flex-1 overflow-y-auto bg-black p-8 scrollbar-thin-dark">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
