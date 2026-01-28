import { Outlet } from "react-router";
import Navbar from "../components/Navbar";

export default function JuryLayout() {
  return (
    <div>
      <Navbar />
      <main>
        <Outlet />
      </main>
    </div>
  );
}
