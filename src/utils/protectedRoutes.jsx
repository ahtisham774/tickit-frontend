// src/utils/protectedRoutes.js
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/useAuth";

const ProtectedRoute = ({ redirectTo, role }) => {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to={redirectTo} />;
  }

  if (role && user.role !== role) {
    return <Navigate to={redirectTo} />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
