import { useState } from "react";

export default function TutorialBox({ title = "Tutoriel", steps = [], defaultOpen = false }) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  if (!steps.length) return null;

  return (
    <div className="bg-gray-900/70 border border-[#AD46FF]/40 rounded-2xl p-4">
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className="w-full flex items-center justify-between text-left"
      >
        <h3 className="text-white font-semibold">{title}</h3>
        <span className="text-sm text-[#AD46FF] font-semibold">
          {isOpen ? "Fermer" : "Ouvrir"}
        </span>
      </button>

      {isOpen && (
        <ol className="list-decimal list-inside space-y-1 text-sm text-gray-300 mt-3">
          {steps.map((step, index) => (
            <li key={`${title}-${index}`}>{step}</li>
          ))}
        </ol>
      )}
    </div>
  );
}
