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
export default function Button(props) {
  return <button className="btn">{props.children}</button>;
}
