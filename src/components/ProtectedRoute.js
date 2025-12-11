// src/components/ProtectedRoute.jsx
import { Navigate, Outlet } from "react-router-dom";

export default function ProtectedRoute({ allowedRoles }) {
  const token = localStorage.getItem("token");
  const userRoles = JSON.parse(localStorage.getItem("roles") || "[]");

  if (!token) {
    // Not logged in
    return <Navigate to="/login" replace />;
  }

  if (!allowedRoles.some(role => userRoles.includes(role))) {
    // Logged in but role not allowed
    return <Navigate to="/unauthorized" replace />;
  }

  return <Outlet />;
}
