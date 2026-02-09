export default function Hero() {
  return (
    <div className="relative w-full h-screen overflow-hidden">

      {/* Vidéo responsive */}
      <div className="absolute inset-0 w-full h-full overflow-hidden">
        <video
          className="w-full h-full object-cover object-center
                     [@media(max-aspect-ratio:4/5)]:object-[50%_30%]"
          autoPlay
          loop
          muted
          playsInline
        >
          <source src="./src/assets/videos/accueil_marsai_2.mp4" type="video/mp4" />
        </video>
      </div>

      {/* Overlay sombre */}
      <div className="absolute inset-0 bg-black/90"></div>

      {/* Contenu */}
      <div className="relative z-10 flex items-center justify-center w-full h-full px-4 md:px-6">
        <div className="text-center w-full">

          {/* Sur‑titre */}
          <TitleInBox title="LE PROTOCOLE TEMPOREL" spancolor="#AD46FF" title2="2026"/>
        

          {/* Titre principal */}
          <h1
            className="
              font-extrabold leading-none text-white
              text-[2.5rem] sm:text-[4rem] md:text-[6rem] lg:text-[8rem] xl:text-[11rem]
              md:whitespace-nowrap
            "
          >
            MARS{" "}
            <span className="bg-linear-to-r from-[#51A2FF] via-[#AD46FF] to-[#FF2B7F] bg-clip-text text-transparent">
              AI
            </span>
          </h1>

          {/* Baseline */}
          <h2
            className="
              mt-4 font-semibold uppercase tracking-[0.2em] text-gray-200
              text-base sm:text-lg md:text-xl lg:text-2xl xl:text-3xl
            "
          >
            IMAGINEZ DES{" "}
            <span className="bg-linear-to-r from-[#AD46FF] via-[#F6339A] to-[#FF6900] bg-clip-text text-transparent">
              FUTURS
            </span>{" "}
            SOUHAITABLES
          </h2>

          {/* Description */}
          <p
            className="
              mt-5 text-gray-400 leading-relaxed
              text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl
            "
          >
            Le festival de courts‑métrages de 60 secondes réalisés par IA.
            <br className="hidden md:block" />
            Deux jours d’immersion au cœur de Marseille.
          </p>

          {/* Bouton */}
          <div className="flex justify-center pt-2 mt-6">
            <a
              href="#"
              className="
                px-6 py-3 md:px-8 md:py-3 
                rounded-full font-semibold 
                text-sm md:text-lg uppercase
                bg-white text-black
                shadow-[0_0_25px_rgba(255,255,255,0.35)]
                hover:shadow-[0_0_40px_rgba(173,70,255,0.7)]
                hover:bg-[#F5F5F5] hover:border hover:border-[#F6339A]
                transition-all duration-300
              "
            >
              inscrivez votre film ➝
            </a>
          </div>

        </div>
      </div>
    </div>
  );
}
