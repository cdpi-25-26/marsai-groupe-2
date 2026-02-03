import { Outlet } from "react-router";
import Navbar from "../components/Navbar";

/**
 * ProducerLayout (Layout Producteur)
 * Template pour les pages des producteurs de films
 * Contient: Navbar
 * Accessible uniquement par les producteurs
 * @returns {JSX.Element} Layout avec Navbar et Outlet pour les pages enfants
 */
export default function ProducerLayout() {
  return (
    <div>
      <Navbar />
      <main>
        <Outlet />
      </main>
    </div>
  );
}
