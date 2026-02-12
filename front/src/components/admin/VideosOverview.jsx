/**
 * VideosOverview - Version simplifiée pour le tableau de bord
 * Affiche les vidéos en format liste compacte
 */
import Videos from "../../../pages/admin/Videos.jsx";

export default function VideosOverview({ videos = [], onAction }) {
  return (
    <Videos 
      videos={videos}
      compact={true}
      maxItems={5}
      onAction={onAction}
    />
  );
}