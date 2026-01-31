import { Outlet, useNavigate } from "react-router";

export default function AdminLayout() {
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
      <div>Barre de navigation</div>
      {isLogged && (
        <button onClick={handleLogout} style={{position:'absolute',top:10,right:10}}>Se déconnecter</button>
      )}
      <aside>Barre latérale</aside>
      <main>
        <Outlet />
      </main>
    </div>
  );
}
