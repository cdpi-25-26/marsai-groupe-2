export function RoleGuard({ allowedRoles, children }) {
  const userRole = localStorage.getItem("role");

  if (allowedRoles.includes(userRole)) {
    return children;
  } else {
    return <div>Access Denied</div>;
  }
}
