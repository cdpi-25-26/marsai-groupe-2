import Carousel from "./Caroussel";
import OneCardWithImage from "./cards/OneCardWithImage";
import TitleInBox from "../TitleInBox.jsx";



export default function Sponsors() {
  const cards = [
    <OneCardWithImage
      image="/img/topito.jpg"
      title="Topito"
      description="Humour & culture pop"
      accentColor="#4da6ff"
      borderColor="border-blue-400/40"
      hoverShadow="hover:shadow-[0_0_20px_rgba(77,166,255,0.4)]"
      onOpenModal={() => console.log("Modal Topito")}
    />,
    <OneCardWithImage
      image="/img/bioguia.jpg"
      title="Bioguia"
      description="Écologie & bien-être"
      accentColor="#7ed957"
      borderColor="border-green-400/40"
      hoverShadow="hover:shadow-[0_0_20px_rgba(126,217,87,0.4)]"
      onOpenModal={() => console.log("Modal Bioguia")}
    />,
    <OneCardWithImage
      image="/img/dotsub.jpg"
      title="Dotsub"
      description="Vidéo & traduction"
      accentColor="#5bc0de"
      borderColor="border-cyan-400/40"
      hoverShadow="hover:shadow-[0_0_20px_rgba(91,192,222,0.4)]"
      onOpenModal={() => console.log("Modal Dotsub")}
    />,
    <OneCardWithImage
      image="/img/event.jpg"
      title="Event"
      description="Concert & spectacle"
      accentColor="#ff66cc"
      borderColor="border-pink-400/40"
      hoverShadow="hover:shadow-[0_0_20px_rgba(255,102,204,0.4)]"
      onOpenModal={() => console.log("Modal Event")}
    />,
  ];

return (

  <div className="w-full pt-12 justify-center gap-10">
 <div className="w-full flex items-center justify-center pt-10">
        <TitleInBox
          icon={
           <svg height="20" width="20" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg">
	<path d="M7.984 14q-.217 0-.409-.077a1.3 1.3 0 0 1-.369-.236l-.73-.671Q4.24 11.012 2.62 9.18Q1 7.35 1 5.43q0-1.453.994-2.441q.995-.99 2.445-.989q.85 0 1.784.436C6.845 2.727 7.438 3.142 8 4c.59-.858 1.189-1.273 1.798-1.564Q10.711 2 11.561 2q1.45 0 2.445.989q.994.988.994 2.44q0 1.967-1.7 3.823A59 59 0 0 1 9.526 13l-.747.687a1.15 1.15 0 0 1-.794.313z" fill="#f06292"/>
</svg>
          }
          iconcolor="#AD46FF"
          title="Nos Soutiens"
        />
      </div>

    <h2 className="pt-10 text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-center text-white uppercase leading-tight">
      ILS SOUTIENNENT <span className="text-[#F6339A]">le futur</span>
    </h2>

    <div className="w-full pt-10">
      <Carousel items={cards} interval={3000} />
    </div>
  </div>
);
}
