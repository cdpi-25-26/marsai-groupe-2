import { Outlet } from "react-router";
import Navbar from "../components/Navbar";

export default function PublicLayout() {
  return (
    <div>
      <Navbar />
      <main>
        <Outlet />
      </main>
      <footer>Footer</footer>
    </div>
  );
}
