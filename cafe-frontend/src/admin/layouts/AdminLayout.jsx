import { useEffect } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import { apiRequest, clearAdminAuth, getAdminUser } from "../utils/api";
import { useAdminSummary } from "../hooks/useAdminSummary";

const PAGE_TITLES = {
  "/admin/dashboard": "Dashboard",
  "/admin/orders": "Orders",
  "/admin/inventory": "Inventory",
  "/admin/menu": "Menu",
};

export default function AdminLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const title = PAGE_TITLES[location.pathname] || "Admin";
  const adminUser = getAdminUser();
  const { summary } = useAdminSummary();
  const expiryAlerts = summary?.stats?.expiryAlerts || 0;

  useEffect(() => {
    let cancelled = false;

    async function sendHeartbeat() {
      try {
        await apiRequest("/api/auth/admin-heartbeat", { method: "POST" });
      } catch (error) {
        if (cancelled) {
          return;
        }

        if (error.status === 401 || error.status === 409) {
          clearAdminAuth();
          navigate("/staff/login", {
            replace: true,
            state: {
              sessionMessage: error.message || "Admin panel is already active somewhere else.",
            },
          });
        }
      }
    }

    sendHeartbeat();
    const intervalId = window.setInterval(sendHeartbeat, 20_000);

    return () => {
      cancelled = true;
      window.clearInterval(intervalId);
    };
  }, [navigate]);

  return (
    <div className="admin-shell">
      <Sidebar />
      <main className="admin-main">
        <div className="admin-page-header">
          <div>
            <p className="admin-page-eyebrow">Admin Panel</p>
            <h1 className="admin-page-title">{title}</h1>
            <p className="admin-page-date">
              {new Date().toLocaleDateString("en-IN", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </p>
          </div>
          <div className="admin-page-header__right">
            {expiryAlerts > 0 && (
              <div className="admin-alert-pill">
                Alert: {expiryAlerts} expiry alert{expiryAlerts !== 1 ? "s" : ""}
              </div>
            )}
            <div className="admin-avatar">{adminUser?.name?.[0] || "A"}</div>
          </div>
        </div>

        <Outlet />
      </main>
    </div>
  );
}
