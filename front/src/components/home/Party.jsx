import TitleInBox from "../TitleInBox.jsx";
import OneCard from "./cards/OneCard.jsx";
import Button from "../Button.jsx";

export default function Program() {
  return (
    <div className="w-full">

      {/* TITRE SECTION */}
      <div className="pt-10 px-6 sm:px-10 md:px-20 pb-4">
        <TitleInBox
          icon={
            <svg className="w-7 h-7" viewBox="0 0 2112 1920">
              <path
                d="M1282 626q-95-100-198-174T891 341t-165-35.5T609 352q-10 10-17 22.5T582 394t-8 25t-7 23L195 1666l23 24q-39 27-69.5 63T95 1812t-55 32q-7 2-17.5 13.5T12 1878q0 18 18 30t40 12q28 0 54-22.5t52.5-57.5t38.5-46q26-23 58-44l26 25l1182-401q39-12 60-36q42-45 43.5-124.5t-33.5-175t-104.5-204T1282 626zm-108 109q153 156 232.5 298.5T1445 1221t-179-33t-290-233Q822 799 742.5 657T704 469q41-45 179.5 33T1174 735zm-219 414q73 65 145 114q1 2 50 94l-84 29q-60-113-111-237zM614 691q22 49 61 119q32 144 100.5 312T925 1437l-83 28q-94-174-164-364.5T592 764zm-116 366q70 224 197 460l-82 29q-99-190-156-357zm-115 365q39 92 83 175l-82 29q-14-27-40-83zM1118 0l50 151l-129 94h159l49 151l49-151h158l-128-94l50-150l-129 93zM838 0l-27 137l137 27l27-137zm901 412l110-115l143 70l-74-140l111-113l-157 27l-74-141l-22 158l-157 27l143 69zm-37 246l133 88l-42 154l124-100l132 88l-55-150l124-98l-159 7l-56-149l-41 153zm-57-371l-298 244l37 45l298-244zm104 472l-233-21l-6 58l234 21zm23 280l-43 134l133 43l44-133z"
                fill="currentColor"
              />
            </svg>
          }
          iconcolor="#AD46FF"
          title="Soirée de cloture"
        />
      </div>

      {/* GRID RESPONSIVE */}
      <div
        className="
          px-6 sm:px-10 md:px-20
          pt-10 pb-16
          grid grid-cols-1 md:grid-cols-2
          gap-12 md:gap-20
        "
      >

        {/* TEXTE GAUCHE */}
        <div className="w-full">
          <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white uppercase leading-none">
            MARS.A.I
          </h2>

          <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold text-[#F6339A] uppercase leading-none mb-6">
            night
          </h2>

          <p className="text-lg sm:text-xl md:text-2xl text-white leading-relaxed max-w-xl">
            Fête Électro mêlant IA et futurs souhaitables.<br />
            Une expérience immersive sonore et visuelle.
          </p>
        </div>

        {/* CARD DROITE */}
        <div className="flex justify-start md:justify-end w-full">
          <OneCard
            icon={
              <svg className="w-24 h-24 md:w-40 md:h-40" viewBox="0 0 432 432">
                <path
                  d="M213.5 3q88.5 0 151 62.5T427 216t-62.5 150.5t-151 62.5t-151-62.5T0 216T62.5 65.5T213.5 3zm0 384q70.5 0 120.5-50t50-121t-50-121t-120.5-50T93 95T43 216t50 121t120.5 50zM224 109v112l96 57l-16 27l-112-68V109h32z"
                  fill="currentColor"
                />
              </svg>
            }
            title="13 JUIN 2026"
            description="DÈS 19H00 • MARSEILLE"
            accentColor="#FB64B6"
            borderColor="border-[rgba(251,100,182,0.40)]"
            hoverShadow="hover:shadow-[0_0_40px_rgba(251,100,182,0.7)]"
          />
        </div>

      </div>

      {/* BOUTON */}
      <div className="w-full flex items-center justify-center px-6 sm:px-10 md:px-20 pb-10">
        <Button
          title="réserver ➝"
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