import { Navigate, Outlet, useLocation } from "react-router-dom";

import { getAuthUser, roleHomePath } from "../utils/authStorage";

export default function ProtectedRoute({ role }) {
  const location = useLocation();
  const authUser = getAuthUser();

  if (!authUser) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }

  if (role && authUser.role !== role) {
    return <Navigate to={roleHomePath[authUser.role] || "/login"} replace />;
  }

  return <Outlet />;
}
