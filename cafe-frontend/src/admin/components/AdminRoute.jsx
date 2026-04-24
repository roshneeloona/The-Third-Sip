import { Navigate, useLocation } from "react-router-dom";
import { getAdminUser } from "../utils/api";

export default function AdminRoute({ children }) {
  const location = useLocation();
  const user = getAdminUser();

  if (!user || user.role !== "admin") {
    return <Navigate to="/staff/login" replace state={{ from: location.pathname }} />;
  }

  return children;
}
