
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
    <div>
      <Navbar />
      <main>
        <Outlet />
      </main>
      <footer>Pied de page</footer>
    </div>
  );
}
