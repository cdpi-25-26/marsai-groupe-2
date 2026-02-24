// import { Outlet, NavLink, useNavigate } from "react-router";
// import { useState, useEffect } from "react";

// /**
//  * AdminLayout - Professional admin dashboard layout
//  * Provides sidebar + header + protected admin wrapper
//  */

// export default function AdminLayout() {
//   const [isSidebarOpen, setIsSidebarOpen] = useState(true);
//   const navigate = useNavigate();

//   const firstName = localStorage.getItem("firstName") || "Admin";
//   const role = localStorage.getItem("role") || "ADMIN";
//   const token = localStorage.getItem("token");

//   useEffect(() => {
//     if (!token) navigate("/auth/login", { replace: true });
//   }, [token, navigate]);

//   const handleLogout = () => {
//     localStorage.clear();
//     navigate("/auth/login", { replace: true });
//   };

//   const menuItems = [
//     { 
//       path: "/admin", 
//       icon: (className) => (
//         <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
//           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
//         </svg>
//       ), 
//       label: "Overview", 
//       exact: true 
//     },
//     { 
//       path: "/admin/movies", 
//       icon: (className) => (
//         <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
//           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 4v16M17 4v16M3 8h4m10 0h4M3 12h18M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z" />
//         </svg>
//       ), 
//       label: "Gestion films" 
//     },
//     { 
//       path: "/admin/users", 
//       icon: (className) => (
//         <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
//           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
//         </svg>
//       ), 
//       label: "Gestion utilisateurs" 
//     },
//     { 
//       path: "/admin/jury", 
//       icon: (className) => (
//         <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
//           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
//         </svg>
//       ), 
//       label: "Distribution & Jury" 
//     },
//     { 
//       path: "/admin/results", 
//       icon: (className) => (
//         <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
//           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
//         </svg>
//       ), 
//       label: "Résultats & classement" 
//     },
//     { 
//       path: "/admin/leaderboard", 
//       icon: (className) => (
//         <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
//           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
//         </svg>
//       ), 
//       label: "Leaderboard officiel" 
//     },
//     { 
//       path: "/admin/events", 
//       icon: (className) => (
//         <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
//           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
//         </svg>
//       ), 
//       label: "Événements" 
//     },
//     { 
//       path: "/admin/messages", 
//       icon: (className) => (
//         <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
//           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
//         </svg>
//       ), 
//       label: "Messages", 
//       badge: 2 
//     },
//     { 
//       path: "/admin/festival-box", 
//       icon: (className) => (
//         <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
//           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
//         </svg>
//       ), 
//       label: "Festival Box" 
//     },
//     { 
//       path: "/admin/settings", 
//       icon: (className) => (
//         <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
//           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
//           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
//         </svg>
//       ), 
//       label: "Configuration Festival" 
//     },
//   ];

//   return (
//     <div className="flex h-screen bg-gradient-to-br from-[#0a0c0f] to-[#0d0f12] text-white overflow-hidden">
      
//       {/* ================= SIDEBAR ================= */}
//       <aside
//         className={`
//           ${isSidebarOpen ? "w-64" : "w-20"}
//           bg-gradient-to-b from-[#111318]/90 to-[#0c0e11]/90
//           backdrop-blur-xl
//           border-r border-white/10
//           flex flex-col
//           transition-all duration-300
//           shadow-2xl shadow-black/40
//           relative
//         `}
//       >
//         {/* Effet de lueur latéral */}
//         <div className="absolute left-0 top-0 bottom-0 w-[1px] bg-gradient-to-b from-blue-500/0 via-blue-500/50 to-blue-500/0" />
        
//         {/* Profile */}
//         <div className="p-5 border-b border-white/10">
//           <div
//             className={`flex ${
//               isSidebarOpen ? "items-center space-x-3" : "flex-col items-center"
//             }`}
//           >
//             {/* Avatar avec effet glass */}
//             <div className="relative group/avatar">
//               <div className="absolute inset-0 bg-blue-500/20 blur-xl rounded-full scale-0 group-hover/avatar:scale-150 transition-transform duration-500" />
//               <div className="relative w-12 h-12 rounded-full bg-gradient-to-br from-blue-600/30 to-purple-600/30 border-2 border-white/20 flex items-center justify-center font-bold shadow-lg shadow-blue-500/20 backdrop-blur-sm">
//                 <span className="text-lg text-white">{firstName.charAt(0).toUpperCase()}</span>
//                 <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-[#111318] animate-pulse"></span>
//               </div>
//             </div>

//             {/* Text */}
//             {isSidebarOpen && (
//               <div className="flex-1 min-w-0">
//                 <p className="font-semibold text-white truncate">{firstName}</p>
//                 <div className="flex items-center gap-1 mt-0.5">
//                   <span className="w-1.5 h-1.5 bg-blue-400 rounded-full" />
//                   <p className="text-[10px] text-white/40 uppercase tracking-wider">
//                     {role}
//                   </p>
//                 </div>
//               </div>
//             )}
//           </div>
//         </div>

//         {/* Navigation */}
//         <nav className="flex-1 overflow-y-auto py-4 px-3 scrollbar-thin-dark">
//           {menuItems.map((item, index) => (
//             <NavLink
//               key={index}
//               to={item.path}
//               end={item.exact}
//               className={({ isActive }) =>
//                 `
//                 group relative flex items-center px-3 py-2 mb-1 rounded-xl transition-all duration-200
//                 ${
//                   isActive
//                     ? "bg-gradient-to-r from-blue-600/20 to-blue-400/10 border border-blue-500/30 shadow-lg shadow-blue-500/10"
//                     : "text-white/50 hover:bg-white/5 hover:text-white border border-transparent"
//                 }
//               `
//               }
//             >
//               {/* Effet de brillance au survol */}
//               <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700 rounded-xl" />
              
//               <span className="relative flex-shrink-0">
//                 {item.icon("w-5 h-5")}
//               </span>

//               {isSidebarOpen && (
//                 <>
//                   <span className="relative text-sm font-medium flex-1 ml-3">
//                     {item.label}
//                   </span>

//                   {item.badge && (
//                     <span className="relative bg-blue-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-lg shadow-blue-600/30">
//                       {item.badge}
//                     </span>
//                   )}
//                 </>
//               )}
//             </NavLink>
//           ))}
//         </nav>

//         {/* Bottom Card */}
//         <div className="p-4 border-t border-white/10">
//           {isSidebarOpen ? (
//             <div className="group relative bg-gradient-to-br from-white/[0.07] to-white/[0.02] backdrop-blur-2xl border border-white/10 rounded-xl p-4 shadow-xl shadow-black/30 hover:border-blue-500/30 transition-all duration-300 overflow-hidden">
              
//               {/* Effet de brillance */}
//               <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
              
//               {/* Info utilisateur */}
//               <div className="relative flex items-center gap-3 mb-3 pb-3 border-b border-white/10">
//                 <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500/20 to-purple-500/20 border border-white/10 flex items-center justify-center">
//                   <svg className="w-4 h-4 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
//                   </svg>
//                 </div>
//                 <div>
//                   <h3 className="text-sm font-semibold text-white">Mars AI</h3>
//                   <p className="text-[10px] text-white/40 flex items-center gap-1">
//                     <span className="w-1 h-1 bg-green-400 rounded-full animate-pulse" />
//                     Dashboard Admin
//                   </p>
//                 </div>
//               </div>

//               {/* Bouton Logout */}
//               <button
//                 onClick={handleLogout}
//                 className="group/btn relative w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg 
//                          bg-white/5 backdrop-blur-sm border border-white/10 text-gray-300 
//                          hover:bg-red-500/20 hover:text-red-300 hover:border-red-500/30
//                          transition-all duration-200 overflow-hidden"
//               >
//                 <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover/btn:translate-x-full transition-transform duration-700" />
                
//                 <svg className="w-4 h-4 relative" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
//                 </svg>
//                 <span className="relative text-sm">Se déconnecter</span>
//               </button>
//             </div>
//           ) : (
//             <button
//               onClick={handleLogout}
//               className="group relative w-full flex items-center justify-center p-3 rounded-lg 
//                        bg-white/5 backdrop-blur-sm border border-white/10 text-gray-400 
//                        hover:bg-red-500/20 hover:text-red-400 hover:border-red-500/30
//                        transition-all duration-200 overflow-hidden"
//               title="Se déconnecter"
//             >
//               <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
              
//               <svg className="w-5 h-5 relative" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
//               </svg>
//             </button>
//           )}
//         </div>
//       </aside>

//       {/* ================= MAIN ================= */}
//       <main className="flex-1 flex flex-col overflow-hidden">
        
//         {/* Header */}
//         <header className="bg-gradient-to-r from-[#111318]/80 to-[#0f1116]/80 backdrop-blur-xl border-b border-white/10 px-6 py-3 flex items-center justify-between shadow-xl shadow-black/20">
          
//           <div className="flex items-center space-x-4">
//             {/* Sidebar Toggle */}
//            <button
//   onClick={() => setIsSidebarOpen(!isSidebarOpen)}
//   className="p-2 rounded-lg transition-all duration-500"
// >
//   <span
//     className={`inline-block transition-all duration-500 ${
//       isSidebarOpen ? "rotate-0" : "rotate-90"
//     } text-2xl hover:scale-120`}
//   >
//     {isSidebarOpen ? "☰" : "✕"}
//   </span>
// </button>

//             <div className="flex items-center">
//               <span className="text-2xl font-light bg-gradient-to-r from-blue-500 to-blue-300 bg-clip-text text-transparent">MARS</span>
//               <span className="text-2xl font-light text-white/60 ml-1">AI</span>
//             </div>
//           </div>

//           {/* Right header */}
//           <div className="flex items-center space-x-3">
//             {/* Search */}
//             <div className="relative group/search">
//               <input
//                 type="text"
//                 placeholder="Rechercher..."
//                 className="
//                   w-72 bg-white/5 backdrop-blur-sm 
//                   border border-white/10 
//                   text-sm text-white
//                   placeholder-white/30
//                   rounded-lg
//                   px-4 py-2
//                   pl-10
//                   shadow-md shadow-black/20
//                   focus:outline-none 
//                   focus:ring-2 
//                   focus:ring-blue-500/30
//                   focus:border-transparent
//                   transition-all duration-200
//                 "
//               />
//               <svg className="absolute left-3 top-2.5 w-4 h-4 text-white/30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
//               </svg>
//             </div>

//             {/* Icons */}
//             <button className="group relative w-9 h-9 rounded-lg border border-white/10 bg-white/5 hover:bg-white/10 transition-all duration-200 flex items-center justify-center overflow-hidden">
//               <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
//               <svg className="w-4 h-4 text-white/70" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
//               </svg>
//             </button>

//             <button className="group relative w-9 h-9 rounded-lg border border-white/10 bg-white/5 hover:bg-white/10 transition-all duration-200 flex items-center justify-center overflow-hidden">
//               <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
//               <svg className="w-4 h-4 text-white/70" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
//               </svg>
//             </button>

//             <button className="group relative w-9 h-9 rounded-lg border border-white/10 bg-white/5 hover:bg-white/10 transition-all duration-200 flex items-center justify-center overflow-hidden">
//               <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
//               <svg className="w-4 h-4 text-white/70" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
//               </svg>
//             </button>
//           </div>
//         </header>

//         {/* Page Content */}
//         <div className="flex-1 overflow-y-auto bg-gradient-to-b from-[#0a0c0f] via-[#0c0e11] to-[#0d0f12] p-6 scrollbar-thin-dark">
//           <Outlet />
//         </div>
//       </main>
//     </div>
//   );
// }


import { Outlet, NavLink, useNavigate } from "react-router";
import { useState, useEffect } from "react";

/**
 * AdminLayout - Professional admin dashboard layout
 * Provides sidebar + header + protected admin wrapper
 */

export default function AdminLayout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  const firstName = localStorage.getItem("firstName") || "Admin";
  const role = localStorage.getItem("role") || "ADMIN";
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!token) navigate("/auth/login", { replace: true });
  }, [token, navigate]);

  // Close mobile menu when window resizes to desktop
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setIsMobileMenuOpen(false);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    navigate("/auth/login", { replace: true });
  };

  const menuItems = [
    {
      path: "/admin",
      icon: (className) => (
        <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
        </svg>
      ),
      label: "Overview",
      exact: true
    },
    {
      path: "/admin/movies",
      icon: (className) => (
        <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 4v16M17 4v16M3 8h4m10 0h4M3 12h18M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z" />
        </svg>
      ),
      label: "Gestion films"
    },
    {
      path: "/admin/categories",
      icon: (className) => (
        <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 7a2 2 0 012-2h5l2 2h7a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2V7z" />
        </svg>
      ),
      label: "Catégories"
    },
    {
      path: "/admin/awards",
      icon: (className) => (
        <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 4.5a1 1 0 011-1h4a1 1 0 011 1V6h3a1 1 0 011 1v2a5 5 0 01-4 4.9V18h2a1 1 0 110 2H7a1 1 0 110-2h2v-4.1A5 5 0 015 9V7a1 1 0 011-1h3V4.5z" />
        </svg>
      ),
      label: "Films premiés"
    },
    {
      path: "/admin/users",
      icon: (className) => (
        <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
        </svg>
      ),
      label: "Gestion utilisateurs"
    },
    {
      path: "/admin/jury",
      icon: (className) => (
        <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
      ),
      label: "Distribution & Jury"
    },
    {
      path: "/admin/results",
      icon: (className) => (
        <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      ),
      label: "Résultats & classement"
    },
    {
      path: "/admin/leaderboard",
      icon: (className) => (
        <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
      ),
      label: "Leaderboard officiel"
    },
    {
      path: "/admin/events",
      icon: (className) => (
        <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      ),
      label: "Événements"
    },
    {
      path: "/admin/messages",
      icon: (className) => (
        <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
        </svg>
      ),
      label: "Messages",
      badge: 2
    },
    {
      path: "/admin/festival-box",
      icon: (className) => (
        <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
        </svg>
      ),
      label: "Festival Box"
    },
    {
      path: "/admin/settings",
      icon: (className) => (
        <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      ),
      label: "Configuration Festival"
    }
  ];

  return (
    <div className="flex h-screen bg-linear-to-br from-[#0a0c0f] to-[#0d0f12] text-white overflow-hidden">
      
      {/* ================= SIDEBAR - Desktop ================= */}
      <aside
        className={`
          hidden lg:flex
          ${isSidebarOpen ? "w-64" : "w-20"}
          bg-gradient-to-b from-[#111318]/90 to-[#0c0e11]/90
          backdrop-blur-xl
          border-r border-white/10
          flex-col
          transition-all duration-300
          shadow-2xl shadow-black/40
          relative
          overflow-x-hidden
        `}
      >
        {/* Effet de lueur latéral */}
        <div className="absolute left-0 top-0 bottom-0 w-px bg-linear-to-b from-blue-500/0 via-blue-500/50 to-blue-500/0" />
        
        {/* Profile */}
        <div className="p-5 border-b border-white/10 overflow-x-hidden">
          <div
            className={`flex ${
              isSidebarExpanded ? "items-center space-x-3" : "flex-col items-center"
            }`}
          >
            {/* Avatar avec effet glass */}
            <div className="relative group/avatar flex-shrink-0">
              <div className="absolute inset-0 bg-blue-500/20 blur-xl rounded-full scale-0 group-hover/avatar:scale-150 transition-transform duration-500" />
              <div className="relative w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-gradient-to-br from-blue-600/30 to-purple-600/30 border-2 border-white/20 flex items-center justify-center font-bold shadow-lg shadow-blue-500/20 backdrop-blur-sm">
                <span className="text-base sm:text-lg text-white">{firstName.charAt(0).toUpperCase()}</span>
                <span className="absolute bottom-0 right-0 w-2 h-2 sm:w-3 sm:h-3 bg-green-500 rounded-full border-2 border-[#111318] animate-pulse"></span>
              </div>
            </div>

            {/* Text */}
            {isSidebarOpen && (
              <div className="flex-1 min-w-0 overflow-hidden">
                <p className="font-semibold text-white truncate text-sm sm:text-base">{firstName}</p>
                <div className="flex items-center gap-1 mt-0.5">
                  <span className="w-1.5 h-1.5 bg-blue-400 rounded-full flex-shrink-0" />
                  <p className="text-[10px] text-white/40 uppercase tracking-wider truncate">
                    {role}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto overflow-x-hidden py-4 px-3 scrollbar-thin-dark">
          {menuItems.map((item, index) => (
            <NavLink
              key={index}
              to={item.path}
              end={item.exact}
              title={item.label}
              className={({ isActive }) =>
                `
                group relative flex items-center px-3 py-2 mb-1 rounded-xl transition-all duration-200
                ${isSidebarOpen ? 'justify-start' : 'justify-center'}
                ${
                  isActive
                    ? "bg-linear-to-r from-blue-600/20 to-blue-400/10 border border-blue-500/30 shadow-lg shadow-blue-500/10"
                    : "text-white/50 hover:bg-white/5 hover:text-white border border-transparent"
                }
              `
              }
            >
              {/* Effet de brillance au survol */}
              <div className="absolute inset-0 bg-linear-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700 rounded-xl" />
              
              <span className="relative flex-shrink-0">
                {item.icon(isSidebarOpen ? "w-4 h-4 sm:w-5 sm:h-5" : "w-5 h-5 sm:w-6 sm:h-6")}
              </span>

              {isSidebarExpanded && (
                <>
                  <span className="relative text-xs sm:text-sm font-medium flex-1 ml-3 truncate">
                    {item.label}
                  </span>

                  {item.badge && (
                    <span className="relative bg-blue-600 text-white text-[8px] sm:text-[10px] font-bold px-1.5 sm:px-2 py-0.5 rounded-full shadow-lg shadow-blue-600/30 flex-shrink-0">
                      {item.badge}
                    </span>
                  )}
                </>
              )}

              {!isSidebarExpanded && item.badge && (
                <span className="absolute top-1 right-1 bg-blue-600 text-white text-[9px] font-bold min-w-4 h-4 px-1 rounded-full flex items-center justify-center">
                  {item.badge}
                </span>
              )}
            </NavLink>
          ))}
        </nav>

        {/* Bottom Card */}
        <div className="p-4 border-t border-white/10 overflow-x-hidden">
          {isSidebarOpen ? (
            <div className="group relative bg-gradient-to-br from-white/[0.07] to-white/[0.02] backdrop-blur-2xl border border-white/10 rounded-xl p-3 sm:p-4 shadow-xl shadow-black/30 hover:border-blue-500/30 transition-all duration-300 overflow-hidden">
              
              {/* Effet de brillance */}
              <div className="absolute inset-0 bg-linear-to-rrom-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
              
              {/* Info utilisateur */}
              <div className="relative flex items-center gap-2 sm:gap-3 mb-2 sm:mb-3 pb-2 sm:pb-3 border-b border-white/10">
                <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-lg bg-gradient-to-br from-blue-500/20 to-purple-500/20 border border-white/10 flex items-center justify-center flex-shrink-0">
                  <svg className="w-3 h-3 sm:w-4 sm:h-4 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
                  </svg>
                </div>
                <div className="min-w-0 overflow-hidden">
                  <h3 className="text-xs sm:text-sm font-semibold text-white truncate">Mars AI</h3>
                  <p className="text-[8px] sm:text-[10px] text-white/40 flex items-center gap-1">
                    <span className="w-1 h-1 bg-green-400 rounded-full animate-pulse flex-shrink-0" />
                    Dashboard Admin
                  </p>
                </div>
              </div>

              {/* Bouton Logout */}
              <button
                onClick={handleLogout}
                className="group/btn relative w-full flex items-center justify-center gap-1.5 sm:gap-2 py-2 px-3 sm:px-4 rounded-lg 
                         bg-white/5 backdrop-blur-sm border border-white/10 text-gray-300 
                         hover:bg-red-500/20 hover:text-red-300 hover:border-red-500/30
                         transition-all duration-200 overflow-hidden"
              >
                <div className="absolute inset-0 bg-linear-to-rrom-transparent via-white/10 to-transparent -translate-x-full group-hover/btn:translate-x-full transition-transform duration-700" />
                
                <svg className="w-3 h-3 sm:w-4 sm:h-4 relative flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                <span className="relative text-xs sm:text-sm">Se déconnecter</span>
              </button>
            </div>
          ) : (
            <button
              onClick={handleLogout}
              className="group relative w-full flex items-center justify-center p-2 sm:p-3 rounded-lg 
                       bg-white/5 backdrop-blur-sm border border-white/10 text-gray-400 
                       hover:bg-red-500/20 hover:text-red-400 hover:border-red-500/30
                       transition-all duration-200 overflow-hidden"
              title="Se déconnecter"
            >
              <div className="absolute inset-0 bg-linear-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
              
              <svg className="w-4 h-4 sm:w-5 sm:h-5 relative flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
            </button>
          )}
        </div>
      </aside>

      {/* ================= MOBILE HEADER ================= */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-40 bg-gradient-to-r from-[#111318]/90 to-[#0f1116]/90 backdrop-blur-xl border-b border-white/10 px-4 py-2 flex items-center justify-between shadow-xl shadow-black/20">
        <div className="flex items-center gap-3">
          {/* Mobile menu toggle with original animation */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            // className="p-2 rounded-lg hover:bg-white/10 transition-colors"
          >
            <span
              className={`inline-block transition-all duration-500 ${
                isMobileMenuOpen ? "rotate-90" : "rotate-0"
              } text-xl sm:text-2xl hover:scale-120`}
            >
              {isMobileMenuOpen ? "✕" : "☰"}
            </span>
          </button>
          <div className="flex items-center">
            <span className="text-lg font-light bg-gradient-to-r from-blue-500 to-blue-300 bg-clip-text text-transparent">MARS</span>
            <span className="text-lg font-light text-white/60 ml-1">AI</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-600/30 to-purple-600/30 border-2 border-white/20 flex items-center justify-center">
            <span className="text-sm text-white">{firstName.charAt(0).toUpperCase()}</span>
          </div>
        </div>
      </div>

      {/* ================= MOBILE SIDEBAR OVERLAY ================= */}
      {isMobileMenuOpen && (
        <div 
          className="lg:hidden fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* ================= MOBILE SIDEBAR ================= */}
      <aside
        className={`
          lg:hidden fixed top-0 left-0 bottom-0 z-50
          w-64
          bg-gradient-to-b from-[#111318]/95 to-[#0c0e11]/95
          backdrop-blur-xl
          border-r border-white/10
          flex flex-col
          transition-transform duration-300
          shadow-2xl shadow-black/40
          overflow-x-hidden
          ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}
        `}
      >
        {/* Effet de lueur latéral */}
        <div className="absolute left-0 top-0 bottom-0 w-[1px] bg-gradient-to-b from-blue-500/0 via-blue-500/50 to-blue-500/0" />
        
        {/* Profile */}
        <div className="p-4 border-b border-white/10 overflow-x-hidden">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3 min-w-0">
              {/* Avatar */}
              <div className="relative flex-shrink-0">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-600/30 to-purple-600/30 border-2 border-white/20 flex items-center justify-center">
                  <span className="text-base text-white">{firstName.charAt(0).toUpperCase()}</span>
                </div>
                <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 rounded-full border-2 border-[#111318]" />
              </div>

              {/* Text */}
              <div className="min-w-0 overflow-hidden">
                <p className="font-semibold text-white text-sm truncate">{firstName}</p>
                <div className="flex items-center gap-1 mt-0.5">
                  <span className="w-1.5 h-1.5 bg-blue-400 rounded-full flex-shrink-0" />
                  <p className="text-[10px] text-white/40 uppercase tracking-wider truncate">
                    {role}
                  </p>
                </div>
              </div>
            </div>

            {/* Mobile close button with original animation */}
            <button
              onClick={() => setIsMobileMenuOpen(false)}
              // className="p-1 rounded-lg hover:bg-white/10 flex-shrink-0"
            >
              <span className="text-xl hover:scale-120 transition-transform duration-200 inline-block">
                ✕
              </span>
            </button>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto overflow-x-hidden py-4 px-3 scrollbar-thin-dark">
          {menuItems.map((item, index) => (
            <NavLink
              key={index}
              to={item.path}
              end={item.exact}
              onClick={() => setIsMobileMenuOpen(false)}
              className={({ isActive }) =>
                `
                group relative flex items-center px-3 py-2.5 mb-1 rounded-xl transition-all duration-200
                ${
                  isActive
                    ? "bg-gradient-to-r from-blue-600/20 to-blue-400/10 border border-blue-500/30 shadow-lg shadow-blue-500/10"
                    : "text-white/50 hover:bg-white/5 hover:text-white border border-transparent"
                }
              `
              }
            >
              <span className="relative flex-shrink-0">
                {item.icon("w-5 h-5")}
              </span>

              <span className="relative text-sm font-medium flex-1 ml-3 truncate">
                {item.label}
              </span>

              {item.badge && (
                <span className="relative bg-blue-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-lg shadow-blue-600/30 flex-shrink-0">
                  {item.badge}
                </span>
              )}
            </NavLink>
          ))}
        </nav>

        {/* Bottom Card */}
        <div className="p-4 border-t border-white/10 overflow-x-hidden">
          <div className="group relative bg-gradient-to-br from-white/[0.07] to-white/[0.02] backdrop-blur-2xl border border-white/10 rounded-xl p-3 shadow-xl shadow-black/30 overflow-hidden">
            
            {/* Info utilisateur */}
            <div className="relative flex items-center gap-2 mb-2 pb-2 border-b border-white/10">
              <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-blue-500/20 to-purple-500/20 border border-white/10 flex items-center justify-center flex-shrink-0">
                <svg className="w-3 h-3 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
                </svg>
              </div>
              <div className="min-w-0 overflow-hidden">
                <h3 className="text-xs font-semibold text-white truncate">Mars AI</h3>
                <p className="text-[8px] text-white/40 flex items-center gap-1">
                  <span className="w-1 h-1 bg-green-400 rounded-full animate-pulse flex-shrink-0" />
                  Dashboard Admin
                </p>
              </div>
            </div>

            {/* Bouton Logout */}
            <button
              onClick={handleLogout}
              className="group/btn relative w-full flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg 
                       bg-white/5 backdrop-blur-sm border border-white/10 text-gray-300 
                       hover:bg-red-500/20 hover:text-red-300 hover:border-red-500/30
                       transition-all duration-200 overflow-hidden text-xs"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover/btn:translate-x-full transition-transform duration-700" />
              
              <svg className="w-3 h-3 relative flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              <span className="relative">Se déconnecter</span>
            </button>
          </div>
        </div>
      </aside>

      {/* ================= MAIN ================= */}
      <main className="flex-1 flex flex-col overflow-hidden lg:ml-0">
        
        {/* Header - Desktop with original animation */}
        <header className="hidden lg:flex bg-gradient-to-r from-[#111318]/80 to-[#0f1116]/80 backdrop-blur-xl border-b border-white/10 px-4 sm:px-6 py-2 sm:py-3 items-center justify-between shadow-xl shadow-black/20">
          
          <div className="flex items-center space-x-3 sm:space-x-4">
            {/* Sidebar Toggle with original animation */}
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="p-2 rounded-lg transition-all duration-500"
            >
              <span
                className={`inline-block transition-all duration-500 ${
                  isSidebarOpen ? "rotate-0" : "rotate-90"
                } text-xl sm:text-2xl hover:scale-120`}
              >
                {isSidebarOpen ? "☰" : "✕"}
              </span>
            </button>

            <div className="flex items-center">
              <span className="text-lg sm:text-xl md:text-2xl font-light bg-gradient-to-r from-blue-500 to-blue-300 bg-clip-text text-transparent">MARS</span>
              <span className="text-lg sm:text-xl md:text-2xl font-light text-white/60 ml-1">AI</span>
            </div>
          </div>

          {/* Right header */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            {/* Search - hidden on smaller screens */}
            {/* <div className="relative group/search hidden md:block">
              <input
                type="text"
                placeholder="Rechercher..."
                className="
                  w-48 lg:w-64 xl:w-72 bg-white/5 backdrop-blur-sm 
                  border border-white/10 
                  text-xs sm:text-sm text-white
                  placeholder-white/30
                  rounded-lg
                  px-3 sm:px-4 py-1.5 sm:py-2
                  pl-8 sm:pl-10
                  shadow-md shadow-black/20
                  focus:outline-none 
                  focus:ring-2 
                  focus:ring-blue-500/30
                  focus:border-transparent
                  transition-all duration-200
                "
              />
              <svg className="absolute left-2.5 sm:left-3 top-2 sm:top-2.5 w-3 h-3 sm:w-4 sm:h-4 text-white/30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div> */}

            {/* Icons */}
            <button className="group relative w-7 h-7 sm:w-8 sm:h-8 md:w-9 md:h-9 rounded-lg border border-white/10 bg-white/5 hover:bg-white/10 transition-all duration-200 flex items-center justify-center overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
              <svg className="w-3 h-3 sm:w-3.5 sm:h-3.5 md:w-4 md:h-4 text-white/70" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
            </button>

            <button className="group relative w-7 h-7 sm:w-8 sm:h-8 md:w-9 md:h-9 rounded-lg border border-white/10 bg-white/5 hover:bg-white/10 transition-all duration-200 flex items-center justify-center overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
              <svg className="w-3 h-3 sm:w-3.5 sm:h-3.5 md:w-4 md:h-4 text-white/70" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </button>

            <button className="group relative w-7 h-7 sm:w-8 sm:h-8 md:w-9 md:h-9 rounded-lg border border-white/10 bg-white/5 hover:bg-white/10 transition-all duration-200 flex items-center justify-center overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
              <svg className="w-3 h-3 sm:w-3.5 sm:h-3.5 md:w-4 md:h-4 text-white/70" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </button>
          </div>
        </header>

        {/* Page Content - with padding for mobile header */}
        <div className="flex-1 overflow-y-auto bg-gradient-to-b from-[#0a0c0f] via-[#0c0e11] to-[#0d0f12] p-3 sm:p-4 md:p-6 lg:pt-6 pt-16 lg:pt-6 scrollbar-thin-dark">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
