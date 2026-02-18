/**
 * Composant SearchBar réutilisable
 * @param {string} value - La valeur actuelle de la recherche
 * @param {function} onChange - Appelée à chaque modification
 * @param {string} placeholder - Texte de l'espace réservé
 * @param {string} className - Classes Tailwind supplémentaires
 */
export default function SearchBar({ value, onChange, placeholder = "Rechercher...", className = "" }) {
  return (
    <div className={`relative ${className}`}>
      {/* Icône loupe */}
      <div className="absolute inset-y-0 left-0 pl-2.5 flex items-center pointer-events-none">
        <svg
          className="w-3.5 h-3.5 text-gray-500"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z"
          />
        </svg>
      </div>

      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="
          w-full
          bg-black/30
          border border-white/10
          rounded-lg
          pl-8 pr-8 py-1.5
          text-xs text-white
          placeholder-gray-500
          focus:outline-none focus:ring-1 focus:ring-blue-500/50 focus:border-blue-500/30
          transition-all duration-200
        "
      />

      {/* Bouton clear — visible seulement quand il y a du texte */}
      {value && (
        <button
          type="button"
          onClick={() => onChange("")}
          className="absolute inset-y-0 right-0 pr-2.5 flex items-center text-gray-500 hover:text-gray-300 transition-colors"
          aria-label="Effacer la recherche"
        >
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      )}
    </div>
  );
}