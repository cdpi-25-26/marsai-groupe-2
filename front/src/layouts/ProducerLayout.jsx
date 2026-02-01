import { Outlet, useNavigate } from "react-router";
import Navbar from "../components/Navbar";

export default function ProducerLayout() {
  const navigate = useNavigate();
  const handleLogout = () => {
    localStorage.removeItem("email");
    localStorage.removeItem("firstName");
    localStorage.removeItem("role");
    localStorage.removeItem("token");
    window.location.href = "/auth/login";
  };
  const isLogged = !!localStorage.getItem("email");
  return (
    <div>
      <Navbar />
      {isLogged && (
        <button onClick={handleLogout} style={{position:'absolute',top:10,right:10}}>Se déconnecter</button>
      )}
      <main>
        <Outlet />
      </main>
    </div>
  );
}
