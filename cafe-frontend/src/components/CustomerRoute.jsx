import { Navigate, useLocation } from "react-router-dom";
import { getStoredUser } from "../utils/api";

export default function CustomerRoute({ children }) {
  const location = useLocation();
  const user = getStoredUser();

  if (!user || user.role !== "customer") {
    return <Navigate to="/login" replace state={{ from: location.pathname + location.search }} />;
  }

  return children;
}
