import { Outlet } from "react-router";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

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
      <aside>Barre latérale</aside>
      <main>
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
