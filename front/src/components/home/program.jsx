import ThreeCards from "./cards/ThreeCards.jsx"
import TitleInBox from "../TitleInBox.jsx";
import Button from "../Button.jsx";

export default function Program() {
  return (
    <div className="w-full">

      {/* TITRE */}
      <div className="w-full flex items-center justify-center pt-16 pb-6 px-4">
        <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-center text-white uppercase leading-tight">
          DEUX JOURNÉES DE <span className="text-[#F6339A]">CONFÉRENCES gratuites</span>
        </h2>
      </div>

      {/* AGENDA */}
      <div className="px-6 sm:px-10 md:px-20 text-xl sm:text-2xl pb-4">
        <TitleInBox
          icon={
            <svg className="w-6 h-6" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
              <path d="M1 4c0-1.1.9-2 2-2h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V4zm2 2v12h14V6H3zm2-6h2v2H5V0zm8 0h2v2h-2V0zM5 9h2v2H5V9zm0 4h2v2H5v-2zm4-4h2v2H9V9zm0 4h2v2H9v-2zm4-4h2v2h-2V9zm0 4h2v2h-2v-2z" fill="currentColor"/>
            </svg>
          }
          iconcolor="#AD46FF"
          title="agenda"
        />
      </div>

      {/* LISTE */}
      <div className="px-6 sm:px-10 md:px-20 text-lg sm:text-xl md:text-2xl">
        <ul className="list-decimal pl-5 space-y-2">
          <li>Débats engagés sur l’éthique et le future</li>
          <li>Confrontations d'idées entre artistes et tech</li>
          <li>Interrogations stimulantes sur la création</li>
        </ul>
      </div>

      {/* CARDS */}
      <div
        className="pt-12 pb-12 px-6
                   grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3
                   place-items-center gap-10">

        <ThreeCards
          icon={<svg className="w-24 h-24 md:w-40 md:h-40" viewBox="0 0 24 24"><path d="M5 5v14a2 2 0 0 0 2.75 1.84L20 13.74a2 2 0 0 0 0-3.5L7.75 3.14A2 2 0 0 0 5 4.89" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"/></svg>}
          title="projections"
          description="Diffusion sur écran géant en présence des réalisateurs et de l'équipe du festival."
          accentColor="#C27AFF"
          borderColor="border-[rgba(194,122,255,0.40)]"
          hoverShadow="hover:shadow-[0_0_40px_rgba(173,70,255,0.7)]"
        />

        <ThreeCards
          icon={<svg className="w-24 h-24 md:w-40 md:h-40" viewBox="0 0 24 24"><path d="M5 7a4 4 0 1 0 8 0a4 4 0 1 0-8 0M3 21v-2a4 4 0 0 1 4-4h4a4 4 0 0 1 4 4v2m1-17.87a4 4 0 0 1 0 7.75M21 21v-2a4 4 0 0 0-3-3.85" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"/></svg>}
          title="workshops"
          description="Sessions pratiques pour découvrir les outils de création IA et expérimenter en direct avec des artistes et techniciens."
          accentColor="#FB64B6"
          borderColor="border-[rgba(251,100,182,0.40)]"
          hoverShadow="hover:shadow-[0_0_40px_rgba(251,100,182,0.7)]"
        />

        <ThreeCards
          icon={<svg height="200" width="200" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
	<g fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2">
		<circle cx="12" cy="8" r="6"/>
		<path d="M15.477 12.89L17 22l-5-3l-5 3l1.523-9.11"/>
	</g>
</svg>}
          title="AWARDS"
          description="Cérémonie de remise des prix avec un jury d’experts et une audience passionnée."
          accentColor="#00D492"
          borderColor="border-[rgba(0,212,146,0.40)]"
          hoverShadow="hover:shadow-[0_0_40px_rgba(0,212,146,0.7)]"
        />

      </div>

      {/* BOUTON */}
      <div className="w-full flex items-center justify-center pt-2 mt-6 px-4">
        <Button
          title="agenda complet ➝"
          href="/auth/register"
          border="border-white"
          backgroundColor="bg-gradient-to-r from-[#9810FA] to-[#E60076]"
          textColor="text-white"
          hovertextColor="hover:text-black"
          hoverBackgroundColor="hover:bg-white hover:bg-none"
          hoverBorderColor="hover:border-[#F6339A]"
          shadow="shadow-[0_0_25px_rgba(255,255,255,0.35)]"
          hoverShadow="hover:shadow-[0_0_40px_rgba(173,70,255,0.7)]"
        />
      </div>

    </div>
  );
}