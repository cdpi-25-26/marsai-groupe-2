// import { Link } from "react-router";

// export default function Navbar() {
//   const firstName = localStorage.getItem("firstName");
//   const lastName = localStorage.getItem("lastName");

//   function handleLogout() {
//     localStorage.removeItem("email");
//     localStorage.removeItem("firstName");
//     localStorage.removeItem("lastName");
//     localStorage.removeItem("role");
//     localStorage.removeItem("token");

//     // Redirect alla home pubblica
//     window.location.href = "/";
//   }

//   return (
//     <div className="flex mt-0 ml-2.5 mr-2.5 bg-white/5 text-white text-xl uppercase rounded-full justify-between items-center p-4 border-white/10 border-2 fixed top-8 left-0 right-0 z-50">
//       <Link to="/">
//       <div className=" ml-3 flex gap-2.5 items-center">
//       <div className="text-white text-3xl uppercase font-bold">Mars</div>
//       <div className="text-3xl font-boldtext-3xl uppercase font-bold bg-linear-to-b from-[#AD46FF] to-[#F6339A] bg-clip-text text-transparent">AI</div>
//       </div>
//       </Link>

//       <div className=" flex gap-6 items-center font-bold">
//         <Link to="/" className="mr-4">Sélections</Link>
//         <Link to="/" className="mr-4">Programe</Link>
//         <Link to="/" className="mr-4">Jury</Link>
//       </div>

//     <div className=" flex items-center gap-7">

//         <button className=" bg-linear-to-br from-[#2B7FFF] to-[#9810FA] text-white px-8 py-3 rounded-full uppercase font-bold hover:from-blue-600 hover:to-purple-700 transition-colors duration-300">
//         <Link to="/auth/register">
//         Candidater au festival
//         </Link>
//         </button>

//         <div>
//           <Link to="/">
//           <img src="data:image/png;base64,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"
//           alt="Logo Anglish"
//           className="w-16 rounded-sm relative " />
//         </Link>
//         </div>

//       <div className=" mr-3">
//         {firstName ? (
//           <>
//             <span className="mr-4">Hello, {firstName}{lastName && ` ${lastName}`}</span>
//             <button onClick={handleLogout}>Logout</button>
//           </>
//         ) : (
//           <Link to="/auth/login">
//             <svg
//               xmlns="http://www.w3.org/2000/svg"
//               fill="none"
//               viewBox="0 0 24 24"
//               strokeWidth="1.5"
//               stroke="currentColor"
//               className="w-8 h-8 hover:opacity-80 transition-opacity"
//             >
//               <path
//                 strokeLinecap="round"
//                 strokeLinejoin="round"
//                 d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z"
//               />
//             </svg>
//           </Link>
//         )}
//       </div>
//     </div>

//   </div>
//   );
// }


import { Link } from "react-router";
import LanguageSwitcher from './LanguageSwitcher';
import { useTranslation } from 'react-i18next';


export default function Navbar() {
  const { i18n } = useTranslation();
  const firstName = localStorage.getItem("firstName");
  const lastName = localStorage.getItem("lastName");

  function handleLogout() {
    localStorage.clear();
    window.location.href = "/";
  }

  return (
    <div className="flex mt-0 ml-2.5 mr-2.5 bg-black/30 text-white text-xl uppercase rounded-full justify-between items-center p-1 border-white/30 border-2 fixed top-8 left-0 right-0 z-50">
      {/*logo */}
      <Link to="/">
        <div className=" ml-3 flex gap-2.5 items-center">
          <div className="text-white text-3xl uppercase font-bold">Mars</div> 
          <div className="text-3xl font-boldtext-3xl uppercase font-bold bg-linear-to-b from-[#AD46FF] to-[#F6339A] bg-clip-text text-transparent">AI</div>
        </div>
      </Link>

      <div className=" flex gap-6 items-center font-bold">
        {/* home */}
        <Link to="/" className="mr-4 hover:text-[#F6339A]">
          <svg
            height="30"
            width="30"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <g
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="1.5"
            >
              <path d="M6.133 21C4.955 21 4 20.02 4 18.81v-8.802c0-.665.295-1.295.8-1.71l5.867-4.818a2.09 2.09 0 0 1 2.666 0l5.866 4.818c.506.415.801 1.045.801 1.71v8.802c0 1.21-.955 2.19-2.133 2.19H6.133Z" />
              <path d="M9.5 21v-5.5a2 2 0 0 1 2-2h1a2 2 0 0 1 2 2V21" />
            </g>
          </svg>
        </Link>
        {/* agenda */}
        <Link to="/program" className="mr-4 hover:text-[#F6339A]">
          <svg
            height="20"
            width="20"
            viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M1 4c0-1.1.9-2 2-2h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V4zm2 2v12h14V6H3zm2-6h2v2H5V0zm8 0h2v2h-2V0zM5 9h2v2H5V9zm0 4h2v2H5v-2zm4-4h2v2H9V9zm0 4h2v2H9v-2zm4-4h2v2h-2V9zm0 4h2v2h-2v-2z"
              fill="currentColor"
            />
          </svg>
        </Link>
        {/* jury*/}
        <Link to="/juryPublic" className="mr-4 hover:text-[#F6339A]">
          <svg
            height="30"
            width="30"
            viewBox="0 0 17 16"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M10.953 14H6.016v1.031H5V16h7v-.969h-1.047V14zM8.016 4v8.953h.953V4H13.5L8.969 2.833V1.016h-.953v1.817L3.469 4h4.547zM3.492 5.979l1.9 4.005l.566-.207l-2.225-4.609c-.053-.098-.157-.16-.298-.152c-.128.005-.239.075-.279.175L1.012 9.8l.588.162l1.892-3.983zm9.69-.784l-2.158 4.619l.592.162l1.902-3.99L15.43 10l.57-.208l-2.238-4.619c-.053-.097-.16-.159-.299-.151c-.13.003-.24.075-.281.173zm2.802 5.836c0 1.061-1.112 1.922-2.484 1.922c-1.372 0-2.484-.861-2.484-1.922h4.968zm-10 0c0 1.061-1.112 1.922-2.484 1.922c-1.372 0-2.484-.861-2.484-1.922h4.968z"
              fill="currentColor"
              fillRule="evenodd"
            />
          </svg>
        </Link>
        {/* sponsors */}
        <Link to="/sponsors" className="mr-4 hover:text-[#F6339A]">
          <svg
            height="30"
            width="30"
            viewBox="0 0 32 32"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="m21 3.031l-.656.719c-1.469 1.617-2.68 2.34-3.688 2.813c-1.008.472-1.855.613-2.687 1.25c-.887.68-2.176 1.984-2.719 4.312c-1.164.254-2.016.7-2.688 1.281c-.664.574-1.164 1.227-1.78 1.938c-.005.008.003.023 0 .031c-.884 1.016-1.657 2.11-3.157 2.688l-.625.25V29h19.063c1.093-.059 1.851-.816 2.312-1.563c.46-.746.715-1.554.844-2.218c.332-1.692.937-6.563.937-6.563l.032-.093v-.094c-.032-.676-.31-1.25-.657-1.782l1.125-3.343l1.782-2.688l.5-.719l-.657-.593l-6.562-5.688zm.063 2.75l5.218 4.532l-1.375 2.03l-.093.095l-.032.156l-.906 2.687c-.473-.195-.96-.332-1.5-.312h-.063L16 15h-1v3.875c-.14 1.09-.746 1.512-1.5 1.813c-.25.101-.281.046-.5.093V14.97c-.164-3.707 1.156-4.774 2.188-5.563c.285-.219 1.12-.472 2.312-1.031c.996-.469 2.234-1.309 3.563-2.594zm-10 8.594c-.004.227-.075.387-.063.625v8h1s1.07-.012 2.219-.469c1.148-.457 2.535-1.527 2.781-3.406V17l5.375-.031h.031a1.662 1.662 0 0 1 1.75 1.562c-.004.016-.05.387-.062.469H20v2h3.844c-.106.773-.203 1.258-.313 2H20v2h3.219a5.002 5.002 0 0 1-.563 1.375c-.273.445-.508.613-.718.625H5v-7.469c1.621-.86 2.629-2.097 3.281-2.843c.676-.774 1.14-1.36 1.594-1.75c.297-.254.762-.399 1.188-.563z"
              fill="currentColor"
            />
          </svg>
        </Link>
        {/* infos */}
        <Link to="/infos" className="mr-4 hover:text-[#F6339A]">
          <svg
            height="30"
            width="30"
            viewBox="0 0 32 32"
            xmlns="http://www.w3.org/2000/svg"
          >
            <g fill="none" stroke="currentColor">
              <path
                d="M15 14h1v9h1m12-7a13 13 0 1 1-26 0a13 13 0 0 1 26 0Z"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
              />
              <path
                d="M17 9.5a1 1 0 1 1-2 0a1 1 0 0 1 2 0Z"
                fill="currentColor"
              />
            </g>
          </svg>
        </Link>
      </div>








<div className="flex items-center gap-2">
  <button 
    //onClick={() => i18n.changeLanguage('fr')}
    onClick={() => {
    i18n.changeLanguage('fr');
    localStorage.setItem('lang', 'fr');
  }}

    title="Français"
    style={{
      opacity: i18n.language === 'fr' ? 1 : 0.5,
      cursor: 'pointer',
      transition: 'opacity 0.3s',
      background: 'none',
      border: 'none'
    }}
  >
    {/*SVG Drapeau FR */}
    <svg height="25" width="25" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
      <mask id="circleFlagsFr0">
        <circle cx="256" cy="256" fill="#fff" r="256"/>
      </mask>
      <g mask="url(#circleFlagsFr0)">
        <path d="M167 0h178l25.9 252.3L345 512H167l-29.8-253.4z" fill="#eee"/>
        <path d="M0 0h167v512H0z" fill="#0052b4"/>
        <path d="M345 0h167v512H345z" fill="#d80027"/>
      </g>
    </svg>
  </button>

  <button 
    //onClick={() => i18n.changeLanguage('en')}
    onClick={() => {
    i18n.changeLanguage('en');
    localStorage.setItem('lang', 'en');
  }}
  
    title="English"
    style={{
      opacity: i18n.language === 'en' ? 1 : 0.5,
      cursor: 'pointer',
      transition: 'opacity 0.3s',
      background: 'none',
      border: 'none'
    }}
  >
     {/*SVG Drapeau EN */}
    <svg height="25" width="25" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
      <mask id="circleFlagsEn0">
        <circle cx="256" cy="256" fill="#fff" r="256"/>
      </mask>
      <g mask="url(#circleFlagsEn0)">
        <path d="m0 0l8 22l-8 23v23l32 54l-32 54v32l32 48l-32 48v32l32 54l-32 54v68l22-8l23 8h23l54-32l54 32h32l48-32l48 32h32l54-32l54 32h68l-8-22l8-23v-23l-32-54l32-54v-32l-32-48l32-48v-32l-32-54l32-54V0l-22 8l-23-8h-23l-54 32l-54-32h-32l-48 32l-48-32h-32l-54 32L68 0z" fill="#eee"/>
        <path d="M336 0v108L444 0Zm176 68L404 176h108zM0 176h108L0 68ZM68 0l108 108V0Zm108 512V404L68 512ZM0 444l108-108H0Zm512-108H404l108 108Zm-68 176L336 404v108z" fill="#0052b4"/>
        <path d="M0 0v45l131 131h45zm208 0v208H0v96h208v208h96V304h208v-96H304V0zm259 0L336 131v45L512 0zM176 336L0 512h45l131-131zm160 0l176 176v-45L381 336z" fill="#d80027"/>
      </g>
    </svg>
  </button>
  









   {/*}div className=" flex items-center gap-7"> 
      <div>
          <Link to="/">
          {/* langue*/}
         {/*} <svg height="25" width="25" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
	<mask id="circleFlagsEn0">
		<circle cx="256" cy="256" fill="#fff" r="256"/>
	</mask>
	<g mask="url(#circleFlagsEn0)">
		<path d="m0 0l8 22l-8 23v23l32 54l-32 54v32l32 48l-32 48v32l32 54l-32 54v68l22-8l23 8h23l54-32l54 32h32l48-32l48 32h32l54-32l54 32h68l-8-22l8-23v-23l-32-54l32-54v-32l-32-48l32-48v-32l-32-54l32-54V0l-22 8l-23-8h-23l-54 32l-54-32h-32l-48 32l-48-32h-32l-54 32L68 0z" fill="#eee"/>
		<path d="M336 0v108L444 0Zm176 68L404 176h108zM0 176h108L0 68ZM68 0l108 108V0Zm108 512V404L68 512ZM0 444l108-108H0Zm512-108H404l108 108Zm-68 176L336 404v108z" fill="#0052b4"/>
		<path d="M0 0v45l131 131h45zm208 0v208H0v96h208v208h96V304h208v-96H304V0zm259 0L336 131v45L512 0zM176 336L0 512h45l131-131zm160 0l176 176v-45L381 336z" fill="#d80027"/>
	</g> 
</svg>  
        </Link>
   {/* langue fr */}
         {/*<Link to="/">
       
          <svg height="25" width="25" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
	<mask id="circleFlagsFr0">
		<circle cx="256" cy="256" fill="#fff" r="256"/>
	</mask>
	<g mask="url(#circleFlagsFr0)">
		<path d="M167 0h178l25.9 252.3L345 512H167l-29.8-253.4z" fill="#eee"/>
		<path d="M0 0h167v512H0z" fill="#0052b4"/>
		<path d="M345 0h167v512H345z" fill="#d80027"/>
	</g>
</svg>
        </Link>
        </div>*/}











        <div className=" mr-3">
          {firstName ? (
            <>
              <span className="mr-4">
                Hello, {firstName}
                {lastName && ` ${lastName}`}
              </span>
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
