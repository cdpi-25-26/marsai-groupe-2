/**
 * Composant Button (Bouton réutilisable)
 * Composant simple de bouton pour les formulaires et actions
 *
 * @param {Object} props - Props du composant
 * @param {ReactNode} props.children - Contenu du bouton (texte ou éléments)
 * @returns {JSX.Element} Un élément <button> stylisé avec Tailwind
 *
 * @example
 * <Button>Cliquez-moi</Button>
 */
export default function Button({
  title,
  href = "#",
  backgroundColor,
  textColor,
  border,
  hovertextColor,
  hoverBackgroundColor,
  hoverBorderColor,
  shadow,
  hoverShadow,
}) {
  return (
    <div>
      <a
        href={href}
        className={`
          px-6 py-3 md:px-8 md:py-3 
          rounded-full font-semibold 
          text-sm md:text-lg uppercase
          border ${border}
          ${backgroundColor} ${textColor}
          ${hovertextColor}
          ${shadow}
          ${hoverShadow}
          ${hoverBackgroundColor} ${hoverBorderColor}
          transition-all duration-300
        `}
      >
        {title}
      </a>
    </div>
  );
}

