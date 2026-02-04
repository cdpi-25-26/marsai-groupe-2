import { Outlet } from "react-router";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
/**
 * JuryLayout (Layout Jury)
 * Template pour les pages du jury d'évaluation des films
 * Contient: Navbar
 * Accessible uniquement par les membres du jury
 * @returns {JSX.Element} Layout avec Navbar et Outlet pour les pages enfants
 */
export default function JuryLayout() {
  return (
    <div>
      <Navbar />
      <main>
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
