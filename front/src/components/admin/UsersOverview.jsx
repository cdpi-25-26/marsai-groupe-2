/**
 * UsersOverview - Version simplifiée pour le tableau de bord
 * Réutilise le composant Users en mode compact
 */
import Users from "../../pages/admin/Users.jsx"; // ✅ 3 lignes !

export default function UsersOverview({ users = [], onEdit, onDelete, onCreate }) {
  return (
    <Users 
      users={users}
      compact={true}
      maxItems={5}
      showTotal={true}
      onEdit={onEdit}
      onDelete={onDelete}
      onCreate={onCreate}
    />
  );
}