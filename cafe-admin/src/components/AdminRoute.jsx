import { Navigate, useLocation } from "react-router-dom";
import { getAdminUser } from "../utils/api";

export default function AdminRoute({ children }) {
  const location = useLocation();
  const user = getAdminUser();

  if (!user || user.role !== "admin") {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }

  return children;
}
