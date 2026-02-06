import { Link } from "react-router";

export default function Navbar() {
  const firstName = localStorage.getItem("firstName");
  const lastName = localStorage.getItem("lastName");

  function handleLogout() {
    localStorage.removeItem("email");
    localStorage.removeItem("firstName");
    localStorage.removeItem("lastName");
    localStorage.removeItem("role");
    localStorage.removeItem("token");
    
    // Redirect alla home pubblica
    window.location.href = "/";
  }

  return (
    <div className="flex mt-0 ml-2.5 mr-2.5 bg-white/5 text-white text-xl uppercase rounded-full justify-between items-center p-4 border-white/10 border-2 fixed top-8 left-0 right-0 z-50">
      <Link to="/">
      <div className=" ml-3 flex gap-2.5 items-center">
      <div className="text-white text-3xl uppercase font-bold">Mars</div> 
      <div className="text-3xl font-boldtext-3xl uppercase font-bold bg-linear-to-b from-[#AD46FF] to-[#F6339A] bg-clip-text text-transparent">AI</div>
      </div>
      </Link>


      <div className=" flex gap-6 items-center font-bold">
        <Link to="/" className="mr-4">Sélections</Link>
        <Link to="/" className="mr-4">Programe</Link>
        <Link to="/" className="mr-4">Jury</Link>
      </div>


    <div className=" flex items-center gap-7"> 

        
        <button className=" bg-linear-to-br from-[#2B7FFF] to-[#9810FA] text-white px-8 py-3 rounded-full uppercase font-bold hover:from-blue-600 hover:to-purple-700 transition-colors duration-300">
        <Link to="/auth/register">
        Candidater au festival
        </Link>
        </button>
        

        <div>
          <Link to="/">
          <img src="data:image/png;base64,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" 
          alt="Logo Anglish" 
          className="w-16 rounded-sm relative " />
        </Link>
        </div>


      <div className=" mr-3">
        {firstName ? (
          <>
            <span className="mr-4">Hello, {firstName}{lastName && ` ${lastName}`}</span>
            <button onClick={handleLogout}>Logout</button>
          </>
        ) : (
          <Link to="/auth/login">
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              fill="none" 
              viewBox="0 0 24 24" 
              strokeWidth="1.5" 
              stroke="currentColor" 
              className="w-8 h-8 hover:opacity-80 transition-opacity"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" 
              />
            </svg>
          </Link>
        )}
      </div>
    </div>
    
  </div>
  );
}
