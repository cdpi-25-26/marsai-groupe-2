
import { Outlet, useNavigate } from "react-router";
import Navbar from "../components/Navbar";

export default function PublicLayout() {
  const navigate = useNavigate();
  const handleLogout = () => {
    localStorage.removeItem("email");
    localStorage.removeItem("role");
    localStorage.removeItem("token");
    navigate("/auth/login");
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
      <footer>Pied de page</footer>
    </div>
  );
}
