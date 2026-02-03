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
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1 pt-4 px-6">
        <Outlet />
      </main>
    </div>
  );
}
