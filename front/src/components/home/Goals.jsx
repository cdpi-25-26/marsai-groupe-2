import InfoCard from "@/components/ui/InfoCard";

export default function Goals() {
  return (
    <div className="pt-12 pb-12 w-full">

      <h2 className="text-6xl font-bold text-center text-white uppercase">
        Objectifs du <span className="text-[#F6339A]">festival</span>
      </h2>

      <div className="pt-12 pb-12 pl-12 pr-12 w-full
                      grid grid-cols-1 md:grid-cols-3
                      place-items-center gap-10">

        <InfoCard
          title="GRATUITÉ"
          description="Conférences et workshops accessibles."
          accentColor="#00D492"
          borderColor="border-[rgba(0,212,146,0.40)]"
          hoverShadow="shadow-[0_0_40px_rgba(0,212,146,0.7)]"
        />

        <InfoCard
          title="GRATUITÉ"
          description="Conférences et workshops accessibles."
          accentColor="#00D492"
          borderColor="border-[rgba(0,212,146,0.40)]"
          hoverShadow="shadow-[0_0_40px_rgba(0,212,146,0.7)]"
        />

        <InfoCard
          title="1 MINUTE"
          description="Format ultra-court pour un impact maximum"
          accentColor="#C27AFF"
          borderColor="border-[rgba(194,122,255,0.40)]"
          hoverShadow="shadow-[0_0_40px_rgba(173,70,255,0.7)]"
        />

      </div>
    </div>
  );
}
