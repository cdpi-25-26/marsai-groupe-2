import { Outlet } from "react-router";
import Navbar from "../components/Navbar";

/**
 * AdminLayout (Layout Administrateur)
 * Template pour les pages d'administration
 * Contient: Navbar, barre latérale
 * Accessible uniquement par les administrateurs
 * @returns {JSX.Element} Layout avec Navbar et Outlet pour les pages enfants
 */
export default function AdminLayout() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <div className="flex flex-1">
        <aside className="w-64 bg-gray-50 border-r pt-4">Barra latérale</aside>
        <main className="flex-1 pt-4 px-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
