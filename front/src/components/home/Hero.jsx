      export default function Hero() {
  return (
      
      <div className="relative w-full h-190 overflow-hidden"> 
        <video className="absolute top-0 left-0 w-full h-full object-cover" autoPlay loop muted playsInline > 
          <source src="./src/assets/videos/accueil_marsai.mp4" type="video/mp4" /> </video>

          {/* Contenu par-dessus la vidéo */} 
          <div className="relative z-10"> {
          /* ton contenu */
          } </div>

          {/* overlay sombre */} 
          <div className="absolute inset-0 bg-black/40 z-5"></div>
          </div>
            );
}