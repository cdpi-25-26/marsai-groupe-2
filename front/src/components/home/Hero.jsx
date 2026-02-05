export default function Hero() {
  return (
    <div className="relative w-full h-screen overflow-hidden">

      {/* Vidéo */}
      <video
        className="absolute inset-0 w-full h-full object-cover"
        autoPlay
        loop
        muted
        playsInline
      >
        <source src="./src/assets/videos/accueil_marsai.mp4" type="video/mp4" />
      </video>

      {/* Overlay sombre */}
      <div className="absolute inset-0 bg-black/60"></div>

      {/* Contenu centré */}
      <div className="relative z-10 flex items-center justify-center w-full h-full px-6">
        <div className="max-w-xl text-center">

          {/* Sur‑titre */}
          <div className="mt-10 inline-flex items-center justify-center  bg-black/20 border border-white/10 px-4 py-1.5 rounded-full mb-6">
          <p className="text-base tracking-[0.25em] text-gray-300 font-bold uppercase m-0">
            LE PROTOCOLE TEMPOREL <span className="text-[#AD46FF]">2026</span>
          </p>
          </div>

          {/* Titre principal */}
          <div className="w-full flex justify-center">
          <h1 className="whitespace-nowrap text-[12rem] font-extrabold leading-tight mb-4 text-white">
MARS <span className="bg-linear-to-r from-[#51A2FF] via-[#AD46FF] to-[#FF2B7F] bg-clip-text text-transparent">AI</span>
</h1>
</div>


          {/* Baseline */}
          <div className="w-full flex justify-center">
            <h2 className="whitespace-nowrap text-3xl font-semibold tracking-[0.2em] text-gray-200 uppercase">
              IMAGINEZ DES  <span className="bg-linear-to-r from-[#AD46FF] via-[#F6339A] to-[#FF6900] bg-clip-text text-transparent">FUTURS</span> SOUHAITABLES
          </h2>
          </div>

          {/* Description */}
          <div className="w-full flex justify-center mt-5">
          <h3 className="whitespace-nowrap text-gray-400 leading-relaxed text-2xl mb-6">
            Le festival de courts‑métrages de 60 secondes réalisés par IA.<br />
            Deux jours d’immersion au cœur de Marseille.
          </h3>
          </div>

          {/* Bouton centré */}
          <div className="flex justify-center pt-2 mt-5">
            <a
              href="#"
              className="px-8 py-3 rounded-full font-semibold text-1xl uppercase
                         bg-white text-black
                         shadow-[0_0_25px_rgba(255,255,255,0.35)]
                         hover:shadow-[0_0_40px_rgba(173,70,255,0.7)]
                         hover:bg-[#F5F5F5] hover:border hover:border-[#F6339A]
                         transition-all duration-300"
            >
              inscrivez votre film ➜
            </a>
          </div>

        </div>
      </div>
    </div>
  );
}