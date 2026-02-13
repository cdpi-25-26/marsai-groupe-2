import { useState, useEffect } from "react";

export default function Carousel({ items, interval = 3000 }) {
  const [index, setIndex] = useState(0);
  const [visible, setVisible] = useState(4);

  // Responsive : calcule combien de cartes afficher
  useEffect(() => {
    const updateVisible = () => {
      if (window.innerWidth < 500) setVisible(1);
      else if (window.innerWidth < 800) setVisible(2);
      else if (window.innerWidth < 1200) setVisible(3);
      else setVisible(4);
    };

    updateVisible();
    window.addEventListener("resize", updateVisible);
    return () => window.removeEventListener("resize", updateVisible);
  }, []);

  // Auto défilement
  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((i) => (i + 1) % items.length);
    }, interval);
    return () => clearInterval(timer);
  }, [items.length, interval]);

  // Sélectionne les cartes visibles
  const getVisibleItems = () => {
    const result = [];
    for (let i = 0; i < visible; i++) {
      result.push(items[(index + i) % items.length]);
    }
    return result;
  };

  return (
    <div className="w-full flex flex-col items-center">

      {/* ZONE DES CARTES */}
      <div className="flex justify-center gap-6 w-full">
        {getVisibleItems().map((item, i) => (
          <div key={i} className="w-65 md:w-70 lg:w-75">
            {item}
          </div>
        ))}
      </div>

      {/* BOUTONS DISCRETS */}
      <div className="flex gap-3 mt-4">
        <button
          onClick={() => setIndex((i) => (i - 1 + items.length) % items.length)}
          className="w-3 h-3 rounded-full bg-white/20 hover:bg-white/40 transition"
        />
        <button
          onClick={() => setIndex((i) => (i + 1) % items.length)}
          className="w-3 h-3 rounded-full bg-white/20 hover:bg-white/40 transition"
        />
      </div>
    </div>
  );
}