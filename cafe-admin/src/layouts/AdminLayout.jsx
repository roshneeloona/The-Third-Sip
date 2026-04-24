import { useLocation } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import { getAdminUser } from "../utils/api";
import { useAdminSummary } from "../hooks/useAdminSummary";

const PAGE_TITLES = {
  "/admin/dashboard": "Dashboard",
  "/admin/orders": "Orders",
  "/admin/inventory": "Inventory",
  "/admin/menu": "Menu",
};

export default function AdminLayout({ children }) {
  const location = useLocation();
  const title = PAGE_TITLES[location.pathname] || "Admin";
  const adminUser = getAdminUser();
  const { summary } = useAdminSummary();
  const expiryAlerts = summary?.stats?.expiryAlerts || 0;

  return (
    <div className="admin-app">
      <Sidebar />
      <main className="admin-main">
        <div className="page-header">
          <div>
            <p className="page-eyebrow">Admin Panel</p>
            <h1 className="page-title">{title}</h1>
            <p className="page-date">
              {new Date().toLocaleDateString("en-IN", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
            </p>
          </div>
          <div className="page-header__right">
            {expiryAlerts > 0 && (
              <div className="alert-pill">
                ðŸ”” {expiryAlerts} expiry alert{expiryAlerts !== 1 ? "s" : ""}
              </div>
            )}
            <div className="avatar">{adminUser?.name?.[0] || "A"}</div>
          </div>
        </div>

        {children}
      </main>
    </div>
  );
}
