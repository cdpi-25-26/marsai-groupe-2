import { Outlet, useNavigate } from "react-router";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export default function PublicLayout() {
  const navigate = useNavigate();
  
  const handleLogout = () => {
    localStorage.removeItem("email");
    localStorage.removeItem("firstName");
    localStorage.removeItem("role");
    localStorage.removeItem("token");
    navigate("/auth/login");

  };
  
  const isLogged = !!localStorage.getItem("email");
  
  return (
    <div className="relative m-0 p-0 w-full min-h-screen overflow-hidden bg-black">
      {/* Effet prisme */}
      <div className="fixed inset-0">
        {/* Base sombre */}
        <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-black to-slate-950" />
        
        {/* Reflets prismatiques */}
        <div className="absolute inset-0 opacity-30">
          {[...Array(5)].map((_, i) => (
            <div
              key={i}
              className="absolute w-full h-32 bg-gradient-to-r from-transparent via-blue-400/20 via-fuchsia-400/20 via-amber-400/20 to-transparent blur-xl"
              style={{
                top: `${i * 20}%`,
                transform: `rotate(${i * 5}deg)`
              }}
            />
          ))}
        </div>
        
        {/* Bandes de lumière */}
        {/* <div className="absolute top-1/3 left-0 w-full h-1 bg-gradient-to-r from-transparent via-blue-400/30 via-fuchsia-400/30 to-transparent blur-sm" />
        <div className="absolute bottom-1/3 left-0 w-full h-1 bg-gradient-to-r from-transparent via-fuchsia-400/30 via-amber-400/30 to-transparent blur-sm" /> */}
        
        {/* Rideaux */}
        <div className="absolute top-0 left-0 bottom-0 w-32 bg-gradient-to-r from-black to-transparent" />
        <div className="absolute top-0 right-0 bottom-0 w-32 bg-gradient-to-l from-black to-transparent" />
        
        {/* Tapis rouge */}
        <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-red-600/10 to-transparent" />
      </div>
      
      <div className="relative z-10 flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-grow">
          <Outlet />
        </main>
        <Footer />
      </div>
    </div>
  );
}