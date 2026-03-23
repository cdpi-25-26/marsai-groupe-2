import { Navigate } from "react-router";

export function RoleGuard({ allowedRoles, children }) {
  const token = localStorage.getItem("token");
  const userRole = localStorage.getItem("role");

  if (!token || !allowedRoles.includes(userRole)) {
    return <Navigate to="/auth/login" replace />;
  }

  return children;
}