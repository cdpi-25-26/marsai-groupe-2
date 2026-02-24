import data from "../../assets/data/categoriesPartenaires.json";
import PartenaireGrid from "../../components/PartenairesGrid";

export default function Partenaires() {
  return (
    <>
      <div className="container mx-auto px-6 py-12">

        {/* TITRE OFFICIELS */}
        <h2 className="text-4xl md:text-6xl font-bold text-white uppercase text-center pb-6">
          PARTENAIRES <span className="text-[#F6339A]">OFFICIELS</span>
        </h2>
        <PartenaireGrid items={data.officiels} />

        {/* TITRE MEDIAS */}
        <h2 className="text-4xl md:text-6xl font-bold text-white uppercase text-center pb-6">
          PARTENAIRES <span className="text-[#F6339A]">Médias</span>
        </h2>
        <PartenaireGrid items={data.medias} />

        {/* TITRE TECHNIQUES */}
        <h2 className="text-4xl md:text-6xl font-bold text-white uppercase text-center pb-6">
          PARTENAIRES <span className="text-[#F6339A]">Techniques</span>
        </h2>
        <PartenaireGrid items={data.techniques} />

        {/* TITRE DIVERS */}
        <h2 className="text-4xl md:text-6xl font-bold text-white uppercase text-center pb-6">
          PARTENAIRES <span className="text-[#F6339A]">Divers</span>
        </h2>
        <PartenaireGrid items={data.divers} />

      </div>
    </>
  );
}