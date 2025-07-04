import { Navigate } from "react-router-dom";

export default function RequireAuth({ children }) {
  // Check if token is in localStorage
  const token = localStorage.getItem("churpay_token");
  // If not logged in, redirect to login
  if (!token) {
    return <Navigate to="/login" replace />;
  }
  // If logged in, show the children (dashboard)
  return children;
}