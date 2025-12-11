// src/components/PublicRoute.jsx
import { Navigate, Outlet } from "react-router-dom";

export default function PublicRoute() {
  const token = localStorage.getItem("token");
  const userRoles = JSON.parse(localStorage.getItem("roles") || "[]");

  // If user is already logged in, redirect to their dashboard
  if (token) {
    if (userRoles.includes("ROLE_ADMIN")) {
      return <Navigate to="/admin/dashboard" replace />;
    } 
    else if (userRoles.includes("ROLE_STAFF")) {
      return <Navigate to="/admin/dashboard" replace />;
    } 
    else if (userRoles.includes("ROLE_SUPPLIER")) {
      return <Navigate to="/supplier/dashboard" replace />;
    } 
    else if (userRoles.includes("ROLE_MEDIATOR")) {
      return <Navigate to="/mediator/dashboard" replace />;
    } 
    else {
      return <Navigate to="/customer/dashboard" replace />;
    }
  }

  // Not logged in, show the public page (login)
  return <Outlet />;
}