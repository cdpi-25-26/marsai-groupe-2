import { Outlet } from "react-router";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export default function ProducerLayout() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1 pt-4 px-6">
        <Outlet />
      </main> 
      <Footer />
    </div>
  );
}
