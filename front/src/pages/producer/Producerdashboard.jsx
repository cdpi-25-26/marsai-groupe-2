/**
 * Composant ProducerDashboard (Menu Producteur)
 * Page d'accueil du producteur avec 3 cartes de navigation :
 * - Profil : redirige vers la section profil de ProducerHome
 * - Formulaire : redirige vers la section soumission de film
 * - Films : redirige vers la section liste des films
 *
 * Aucune logique de ProducerHome n'est modifiée.
 * @returns {JSX.Element}
 */

import { useNavigate } from "react-router";

const menuCards = [
  {
    id: "profile",
    label: "Profil",
    description: "Consultez et modifiez vos informations personnelles.",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="w-8 h-8"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={1.5}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z"
        />
      </svg>
    ),
    hash: "#profile",
  },
  {
    id: "formulaire",
    label: "Formulaire",
    description: "Soumettez un nouveau film à la sélection.",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="w-8 h-8"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={1.5}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m3.75 9v6m3-3H9m1.5-12H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z"
        />
      </svg>
    ),
    hash: "#formulaire",
  },
  {
    id: "films",
    label: "Films",
    description: "Retrouvez tous vos films soumis et leur statut.",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="w-8 h-8"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={1.5}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M3.375 19.5h17.25m-17.25 0a1.125 1.125 0 01-1.125-1.125M3.375 19.5h1.5C5.496 19.5 6 18.996 6 18.375m-3.75.125v-5.25M6 18.375V6.75m0 11.625h13.5M6 6.75h13.5m0 0v11.625m0-11.625a1.125 1.125 0 011.125 1.125v9.375M6 6.75a1.125 1.125 0 00-1.125 1.125v9.375m1.125-10.5h13.5m-13.5 0c-.621 0-1.125.504-1.125 1.125M19.5 6.75c.621 0 1.125.504 1.125 1.125v9.375c0 .621-.504 1.125-1.125 1.125m0 0h-1.5"
        />
      </svg>
    ),
    hash: "#films",
  },
];

export default function ProducerDashboard() {
  const navigate = useNavigate();

  /**
   * Navigue vers ProducerHome et scroll vers la section correspondante via le hash URL.
   * ProducerHome doit avoir des id="profile", id="formulaire", id="films" sur ses sections,
   * et un useEffect qui lit window.location.hash pour scroller automatiquement.
   */
  const handleCardClick = (hash) => {
    navigate("/producer/home", { state: { section: hash.replace("#", "") } });
  };

  return (
    <div className="text-white pt-28 pb-20 px-4 md:pt-25">
      {/* Éléments décoratifs d'arrière-plan */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-500/5 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-500/5 rounded-full blur-3xl" />
      </div>

      <div className="max-w-4xl mx-auto relative z-10">
        {/* En-tête avec effet glass */}
        <div className="text-center mb-12">
          <div
            className="relative inline-flex items-center gap-2 px-5 py-2.5
bg-blue-500/20 backdrop-blur-xl
border border-blue-300/50
rounded-full
shadow-[0_0_30px_rgba(59,130,246,0.3)]
mb-4 overflow-hidden"
          >
            <div
              className="absolute inset-0 bg-gradient-to-br
                  from-blue-400/20 via-transparent to-transparent
                  opacity-50 pointer-events-none"
            />

            <div className="relative z-10 w-2 h-2 bg-emerald-400 rounded-full shadow-[0_0_8px_rgba(52,211,153,0.8)]" />
            {/* <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" /> */}
            <p className="relative z-10 text-xs uppercase tracking-wider text-blue-1000">
              Espace Producteur
            </p>
          </div>

          <h1 className="text-4xl md:text-5xl font-light bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent mb-3">
            Que souhaitez-vous faire ?
          </h1>

          <p className="text-white/40 text-base max-w-2xl mx-auto">
            Sélectionnez une section pour gérer votre profil, soumettre un film
            ou consulter vos œuvres.
          </p>
        </div>

        {/* Grille de cartes avec effet glass */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {menuCards.map((card) => (
            <button
              key={card.id}
              type="button"
              onClick={() => handleCardClick(card.hash)}
              className="
                 group relative flex flex-col items-center text-center
  bg-blue-500/10 backdrop-blur-2xl
  border border-blue-400/30
  rounded-2xl p-6
  shadow-[0_0_25px_rgba(59,130,246,0.15)]
  transition-all duration-300 ease-out
  hover:bg-blue-500/20
  hover:border-blue-300/50
  hover:shadow-[0_0_40px_rgba(59,130,246,0.35)]
  hover:-translate-y-1
  overflow-hidden
  cursor-pointer
              "
            >
              {/* Effet de brillance au survol */}
              <div
                className="absolute inset-0 bg-gradient-to-tr 
                from-white/20 via-white/10 to-transparent 
                opacity-40 group-hover:opacity-60
                transition duration-300 pointer-events-none"
              />

              {/* Effet de lueur colorée au survol */}
              <div
                className="absolute inset-0 bg-gradient-to-br 
                from-blue-400/20 via-transparent to-transparent 
                opacity-50 pointer-events-none"
              />

              {/* Icône avec effet glass */}
              <div
                className="
                 relative mb-4 p-4 rounded-xl
  bg-blue-500/10 backdrop-blur-xl
  border border-blue-400/30
  text-blue-200
  group-hover:bg-blue-500/20
  group-hover:border-blue-300/50
  transition-all duration-300
              "
              >
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-purple-500/20 blur-lg rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <span className="relative">{card.icon}</span>
              </div>

              {/* Titre avec gradient au survol */}
              <h2
                className="
                relative text-xl font-light text-white/90 mb-2
                group-hover:bg-gradient-to-r group-hover:from-white group-hover:to-blue-200 group-hover:bg-clip-text group-hover:text-transparent
                transition-all duration-300
              "
              >
                {card.label}
              </h2>

              {/* Description */}
              <p className="relative text-sm text-white/40 leading-relaxed">
                {card.description}
              </p>

              {/* Flèche indicatrice avec animation */}
              <div
                className="
                relative mt-6 w-8 h-8 rounded-full
                bg-gradient-to-br from-white/[0.07] to-white/[0.02]
                border border-white/10
                flex items-center justify-center
                text-white/40
                group-hover:text-blue-400
                group-hover:border-blue-500/30
                group-hover:translate-x-1
                transition-all duration-300
              "
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-4 h-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"
                  />
                </svg>
              </div>

              {/* Badge décoratif dans le coin */}
              <div className="absolute top-0 right-0 w-20 h-20 overflow-hidden opacity-5 group-hover:opacity-10 transition-opacity duration-500 pointer-events-none">
                <div className="absolute top-0 right-0 w-10 h-10 bg-gradient-to-br from-blue-500/30 to-purple-500/30 rounded-full blur-2xl" />
              </div>
            </button>
          ))}
        </div>

        {/* Ligne décorative en bas */}
        <div className="mt-10 flex justify-center">
          <div className="relative w-80 h-px">
            {/* Soft outer glow */}
            <div className="absolute inset-0 bg-blue-500/40 blur-md opacity-40" />

            {/* Core line */}
            <div
              className="absolute inset-0 bg-gradient-to-r 
                    from-transparent 
                    via-blue-400/60 
                    to-transparent"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
