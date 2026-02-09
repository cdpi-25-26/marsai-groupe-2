import ProtocoleCard from "./cards/ProtocoleCard";
import TitleInBox from "../TitleInBox";
import Button from "../Button";

export default function Protocole() {
    return (
        <div>
           <div className="w-full flex items-center justify-center pb-3.5"> <TitleInBox  title=" Totale" spancolor="#AD46FF" title2="Immersion" /> </div>
                    
            <h2 className="text-6xl font-bold text-center text-white uppercase pb-6">LE <span className="text-[#F6339A]">PROTOCOLE</span> TEMPOREL</h2>

             <div className="pt-12 pb-12 w-full grid grid-cols-1 md:grid-cols-4 place-items-center gap-10">
            
                  <ProtocoleCard
                    title="2 MOIS"
                    description="DE PRÉPARATION"
                    accentColor="#C27AFF"
                    borderColor="border-[rgba(194,122,255,0.40)]"
                    hoverBorderColor="hover:border-[#C27AFF]"
                    hoverShadow="hover:shadow-[0_0_40px_rgba(173,70,255,0.7)]"
                  />
            
                  <ProtocoleCard
                    title="50 FILMS"
                    description="EN SÉLECTION"
                    accentColor="#00D492"
                    borderColor="border-[rgba(0,212,146,0.40)]"
                    hoverBorderColor="hover:border-[#00D492]"
                    hoverShadow="hover:shadow-[0_0_40px_rgba(0,212,146,0.7)]"
                  />
            
                  <ProtocoleCard
                    title="WEB 3.0"
                    description="EXPÉRIENCE"
                    accentColor="#FB64B6"
                    borderColor="border-[rgba(251,100,182,0.40)]"
                    hoverBorderColor="hover:border-[#FB64B6]"
                    hoverShadow="hover:shadow-[0_0_40px_rgba(251,100,182,0.7)]"
                  />
            
                  <ProtocoleCard
                    title="J4"
                    description="MARSEILLE"
                    accentColor="#2B7FFF"
                    borderColor="border-[rgba(43,127,255,0.40)]"
                    hoverBorderColor="hover:border-[#2B7FFF]"
                    hoverShadow="hover:shadow-[0_0_40px_rgba(43,127,255,0.7)]"
                  />
                </div>

                   {/* Bouton */}
                          <div className="flex justify-center pt-2 mt-6">
                            <Button
                              title="Rejoindre l'aventure ➝"
                              href="#"
                              border="border-white"
                              backgroundColor="bg-gradient-to-r from-[#9810FA] to-[#E60076]"
                              textColor="text-white"
                              hovertextColor="hover:text-black"
                              hoverBackgroundColor="hover:bg-white hover:bg-none"
                              hoverBorderColor="hover:border-[#F6339A]"
                              shadow = "shadow-[0_0_25px_rgba(255,255,255,0.35)]"
                              hoverShadow = "hover:shadow-[0_0_40px_rgba(173,70,255,0.7)]"
                            />
                          </div>
        </div>
    )
}