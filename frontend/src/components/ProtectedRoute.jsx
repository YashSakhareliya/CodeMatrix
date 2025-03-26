import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";

const ProtectedRoute = ({ allowedRoles }) => {
  const { isAuthenticated, role } = useSelector((state) => state.auth);

  if (!isAuthenticated || !allowedRoles.includes(role)) {
    return <Navigate to="/student/login" />;
  }

  return <Outlet />;
};

export default ProtectedRoute;

