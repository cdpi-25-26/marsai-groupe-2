import { useEffect, useState } from "react";

export function RoleGuard({ allowedRoles, children }) {
  const [userRole, setUserRole] = useState(() => localStorage.getItem("role"));

  useEffect(() => {
    const onStorage = () => setUserRole(localStorage.getItem("role"));
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  if (allowedRoles.includes(userRole)) {
    return children;
  } else {
    return <div>Access Denied</div>;
  }
}