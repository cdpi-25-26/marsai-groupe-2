
import { Outlet } from "react-router";
import Navbar from "../components/Navbar";

/**
 * PublicLayout (Layout Public)
 * Template pour les pages accessibles à tous
 * Contient: Navbar, footer
 * Accessible par tous les utilisateurs (authentifiés ou non)
 * @returns {JSX.Element} Layout avec Navbar, Outlet et footer
 */
export default function PublicLayout() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1 pt-4 px-6">
        <Outlet />
      </main>
      <footer className="bg-gray-100 text-center py-4">Pied de page</footer>
    </div>
  );
}
