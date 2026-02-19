import TitleInBox from "../TitleInBox.jsx";
import OneCard from "./cards/OneCard.jsx";

export default function Localisation() {
  return (
    <div>

      {/* TITRE */}
      <div className="px-6 sm:px-10 md:px-20 pb-4">
        <TitleInBox
          icon={
            <svg height="30" width="30" viewBox="0 0 48 48">
              <g fill="none" stroke="currentColor" strokeLinejoin="round" strokeWidth="4">
                <path
                  d="M9.858 32.757C6.238 33.843 4 35.343 4 37c0 3.314 8.954 6 20 6s20-2.686 20-6c0-1.657-2.239-3.157-5.858-4.243"
                  strokeLinecap="round"
                />
                <path d="M24 35s13-8.496 13-18.318C37 9.678 31.18 4 24 4S11 9.678 11 16.682C11 26.504 24 35 24 35Z" />
                <path d="M24 22a5 5 0 1 0 0-10a5 5 0 0 0 0 10Z" />
              </g>
            </svg>
          }
          iconcolor="#AD46FF"
          title="comment s'y rendre ?"
        />
      </div>

      {/* 3 INFOS */}
      <div className="pt-6 pb-12 w-full grid grid-cols-1 md:grid-cols-3 place-items-center gap-10 px-6">
        <p className="text-[#FB64B6] text-center text-base uppercase pt-6">
          Marseille, Hub Créatif
        </p>

        <p className="text-white text-center text-base uppercase pt-6">
         155 rue Peyssonnel, 13002 Marseille
        </p>

        <p className="text-white text-center text-base uppercase pt-6">
          Accès Tram T2/T3 Arrêt Arenc Le Silo
        </p>
      </div>

      {/* 2 CARDS */}
      <div className="pt-6 pb-12 w-full flex justify-center px-6">
        <div className="w-full max-w-280 grid grid-cols-1 md:grid-cols-2 gap-20">
          <OneCard
            width="200"
            title="Salle des Sucres"
            description="Futur sanctuaire des conférences et de la remise des prix de Mars.A.I. Un espace majestueux alliant patrimoine et technologie."
            accentColor="#2B7FFF"
            borderColor="border-[rgba(43,127,255,0.40)]"
            hoverShadow="hover:shadow-[0_0_40px_rgba(43,127,255,0.7)]"
          />

          <OneCard
            width="200"
            title="Salle PLAZA"
            description="L'épicentre du festival : accueil, animations, workshops et restauration. Le point de rencontre de tous les participants."
            accentColor="#C27AFF"
            borderColor="border-[rgba(194,122,255,0.40)]"
            hoverShadow="hover:shadow-[0_0_40px_rgba(173,70,255,0.7)]"
          />
        </div>
      </div>

      {/* MAP */}
      <div className="w-full flex justify-center pt-10 pb-16 px-6">
        <div className="w-full max-w-250 border-2 border-[rgba(255,255,255,0.82)] rounded-4xl overflow-hidden shadow-[0_0_25px_rgba(173,70,255,0.3)]">
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d5806.007572123465!2d5.366207076720204!3d43.31418017429094!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x12c9c0f3f2295ed9%3A0xe8332bddf8f8ffdb!2s155%20Rue%20Peyssonnel%2C%2013002%20Marseille!5e0!3m2!1sfr!2sfr!4v1770892741990!5m2!1sfr!2sfr"
            className="w-full h-112.5"
            allowFullScreen=""
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          ></iframe>
        </div>
      </div>

    </div>
  );
}