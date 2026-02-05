export default function Reassure() {
  return (
    <div className="pt-12 pb-12 w-full 
                    grid grid-cols-1 md:grid-cols-4 
                    place-items-center gap-10">

      {/* CARD 1 */}
      <div className="w-90 h-50 bg-[rgba(255,255,255,0.05)]
                      rounded-[40px] border border-[rgba(194,122,255,0.40)]
                      flex flex-col items-center justify-center
                      hover:shadow-[0_0_40px_rgba(173,70,255,0.7)]
                      hover:border-[#C27AFF]
                      [@media(max-aspect-ratio:4/5)]:pt-6">
        <h2 className="text-2xl font-bold text-center text-[#C27AFF] uppercase">
          1 MINUTE
        </h2>
        <p className="text-gray-300 text-center text-base uppercase pt-6 px-6">
          Format ultra-court pour un impact maximum
        </p>
      </div>

      {/* CARD 2 */}
      <div className="w-90 h-50 bg-[rgba(255,255,255,0.05)]
                      rounded-[40px] border border-[rgba(0,212,146,0.40)]
                      flex flex-col items-center justify-center
                      hover:shadow-[0_0_40px_rgba(0,212,146,0.7)]
                      hover:border-[#00D492]
                      [@media(max-aspect-ratio:4/5)]:pt-6">
        <h2 className="text-2xl font-bold text-center text-[#00D492] uppercase">
          GRATUITÉ
        </h2>
        <p className="text-gray-300 text-center text-base uppercase pt-6 px-6">
          Conférences et workshops accessibles.
        </p>
      </div>

      {/* CARD 3 */}
      <div className="w-90 h-50 bg-[rgba(255,255,255,0.05)]
                      rounded-[40px] border border-[rgba(251,100,182,0.40)]
                      flex flex-col items-center justify-center
                      hover:shadow-[0_0_40px_rgba(251,100,182,0.7)]
                      hover:border-[#FB64B6]
                      [@media(max-aspect-ratio:4/5)]:pt-6">
        <h2 className="text-2xl font-bold text-center text-[#FB64B6] uppercase">
          POUR TOUS
        </h2>
        <p className="text-gray-300 text-center text-base uppercase pt-6 px-6">
          Professionnels, étudiants et curieux.
        </p>
      </div>

      {/* CARD 4 */}
      <div className="w-90 h-50 bg-[rgba(255,255,255,0.05)]
                      rounded-[40px] border border-[rgba(43,127,255,0.40)]
                      flex flex-col items-center justify-center
                      hover:shadow-[0_0_40px_rgba(43,127,255,0.7)]
                      hover:border-[#2B7FFF]
                      [@media(max-aspect-ratio:4/5)]:pt-6">
        <h2 className="text-2xl font-bold text-center text-[#2B7FFF] uppercase">
          EXPERTISE
        </h2>
        <p className="text-gray-300 text-center text-base uppercase pt-6 px-6">
          Leaders mondiaux de l'IA générative.
        </p>
      </div>

    </div>
  );
}
