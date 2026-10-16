import { Navigate, useLocation } from "react-router-dom";
import { dashboardPath, useApp } from "../context/AppContext";

function ProtectedRoute({ roles, children }) {
  const { user } = useApp();
  const location = useLocation();

  if (!user) return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  if (roles && !roles.includes(user.role)) return <Navigate to={dashboardPath(user.role)} replace />;

  return children;
}

export default ProtectedRoute;
