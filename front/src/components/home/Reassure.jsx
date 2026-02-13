import FourCards from "./cards/FourCards";

export default function Reassure() {
  return (
    <div className="pt-12 pb-12 w-full grid grid-cols-1 md:grid-cols-4 place-items-center gap-10">

      <FourCards
        title="1 MINUTE"
        description="Format ultra-court pour un impact maximum"
        accentColor="#C27AFF"
        borderColor="border-[rgba(194,122,255,0.40)]"
        hoverBorderColor="hover:border-[#C27AFF]"
        hoverShadow="hover:shadow-[0_0_40px_rgba(173,70,255,0.7)]"
      />

      <FourCards
        title="GRATUITÉ"
        description="Conférences et workshops accessibles."
        accentColor="#00D492"
        borderColor="border-[rgba(0,212,146,0.40)]"
        hoverBorderColor="hover:border-[#00D492]"
        hoverShadow="hover:shadow-[0_0_40px_rgba(0,212,146,0.7)]"
      />

      <FourCards
        title="POUR TOUS"
        description="Professionnels, étudiants et curieux."
        accentColor="#FB64B6"
        borderColor="border-[rgba(251,100,182,0.40)]"
        hoverBorderColor="hover:border-[#FB64B6]"
        hoverShadow="hover:shadow-[0_0_40px_rgba(251,100,182,0.7)]"
      />

      <FourCards
        title="EXPERTISE"
        description="Leaders mondiaux de l'IA générative."
        accentColor="#2B7FFF"
        borderColor="border-[rgba(43,127,255,0.40)]"
        hoverBorderColor="hover:border-[#2B7FFF]"
        hoverShadow="hover:shadow-[0_0_40px_rgba(43,127,255,0.7)]"
      />

    </div>
  );
}
