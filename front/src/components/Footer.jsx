import React from "react";
import Social from "../components/Social";
import Newletter from "./Newletter";

export default function Footer() {
  return (
    <footer className="w-full bg-black text-white font-light bottom-0 m-auto text-base">
      {/* Section principale */}
      <div className="w-full px-8 py-16 grid grid-cols-1 md:grid-cols-3 gap-16 items-start">
        
        {/* Colonne gauche : identité + réseaux */}
        <div>
          <h2 className="text-4xl font-semibold mb-4">MARS <span className="text-[#AD46FF]">
AI</span></h2>
          <p className="text-gray-300 mb-6 leading-relaxed">
            La plateforme mondiale de la narration générative, ancrée dans la lumière de Marseille.
          </p>
          <div className="flex space-x-4 text-gray-400">
            <Social />
          </div>
        </div>

        {/* Colonne centrale : NAVIGATION + LÉGAL */}
        <div className="grid grid-cols-2 gap-8">
          <div className="text-right">
            <h3 className="text-base font-semibold mb-4 text-[#AD46FF]">NAVIGATION</h3>
            <ul className="space-y-2 text-gray-300">
              <li><a href="#" className="hover:text-white transition">Jury</a></li>
              <li><a href="#" className="hover:text-white transition">Programme</a></li>
              <li><a href="#" className="hover:text-white transition">Billetterie</a></li>
            </ul>
          </div>
          <div className="text-right">
            <h3 className="text-base font-semibold mb-4 text-[#F6339A]">LÉGAL</h3>
            <ul className="space-y-2 text-gray-300">
              <li><a href="#" className="hover:text-white transition">Partenaires</a></li>
              <li><a href="#" className="hover:text-white transition">FAQ</a></li>
              <li><a href="#" className="hover:text-white transition">Contact</a></li>
            </ul>
          </div>
        </div>

        {/* Colonne droite : formulaire */}
        <div className="flex justify-end">
        <Newletter />
        </div>
  </div>
      {/* Bas de page */}
      <div className="w-full border-t border-gray-800 px-8 py-6 text-center text-sm text-gray-400 leading-relaxed grid grid-cols-1 md:grid-cols-3 gap-16">
        <div>© 2026 MARS.A.I PROTOCOL • MARSEILLE HUB</div>
        <div>DESIGN SYSTÈME CYBER-PREMIUM</div>
        <div><a href="#" className="hover:text-white transition">LÉGAL</a></div>
      </div>
    </footer>
  );
}


