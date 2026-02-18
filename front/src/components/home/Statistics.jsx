
import { useTranslation } from "react-i18next";
import OneCard from "./cards/OneCard";
export default function Statistics() {
  const { t } = useTranslation();
  return (

<div className="w-full grid grid-cols-1 md:grid-cols-3 gap-20 place-items-center"> 
    <div className="w-full md:max-w-95"> 
        <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-left text-white uppercase leading-tight"> 
            {t("pages.home.statistics.title")} <span className="text-[#F6339A]">{t("pages.home.statistics.titleAccent")}</span> </h2> 
            <p className="text-white text-base uppercase pt-6"> {t("pages.home.statistics.description")} </p> 
            </div>
<div className="w-full md:max-w-95">
    <OneCard
      width="200"
      textSize="text-lg sm:text-xl md:text-5xl"
      title={t("pages.home.statistics.card1Title")}
      description={t("pages.home.statistics.card1Description")}
      accentColor="#2B7FFF"
      borderColor="border-[rgba(43,127,255,0.40)]"
      hoverShadow="hover:shadow-[0_0_40px_rgba(43,127,255,0.7)]"
    />
    </div>
<div className="w-full md:max-w-95">
    <OneCard
      width="200"
      textSize="text-lg sm:text-xl md:text-5xl"
      title={t("pages.home.statistics.card2Title")}
      description={t("pages.home.statistics.card2Description")}
      accentColor="#C27AFF"
      borderColor="border-[rgba(194,122,255,0.40)]"
      hoverShadow="hover:shadow-[0_0_40px_rgba(173,70,255,0.7)]"
    />
  </div>
</div>
    );
}