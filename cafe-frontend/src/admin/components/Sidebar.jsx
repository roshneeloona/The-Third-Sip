import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAdminSummary } from "../hooks/useAdminSummary";
import { apiRequest, clearAdminAuth } from "../utils/api";

const TABS = [
  { label: "Dashboard", icon: "DB", path: "/admin/dashboard" },
  { label: "Orders", icon: "OR", path: "/admin/orders" },
  { label: "Inventory", icon: "IN", path: "/admin/inventory" },
  { label: "Menu", icon: "ME", path: "/admin/menu" },
];

export default function Sidebar() {
  const [open, setOpen] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();
  const { summary } = useAdminSummary();

  const badges = {
    "/admin/orders": summary?.stats?.pendingOrders || 0,
    "/admin/inventory": summary?.stats?.expiryAlerts || 0,
  };

  async function handleLogout() {
    try {
      await apiRequest("/api/auth/logout", { method: "POST" });
    } catch (error) {
      // Local cleanup still signs the admin out safely.
    }

    clearAdminAuth();
    navigate("/staff/login");
  }

  return (
    <aside className={`admin-sidebar ${open ? "admin-sidebar--open" : "admin-sidebar--closed"}`}>
      <div className="admin-sidebar__brand">
        <div className="admin-sidebar__logo">TS</div>
        {open && (
          <div>
            <div className="admin-sidebar__brand-name">The Third Sip</div>
            <div className="admin-sidebar__brand-sub">Admin Panel</div>
          </div>
        )}
      </div>

      <nav className="admin-sidebar__nav">
        {TABS.map((tab) => {
          const active = location.pathname === tab.path;
          const badge = badges[tab.path] || 0;

          return (
            <button
              key={tab.label}
              onClick={() => navigate(tab.path)}
              className={`admin-sidebar__link ${active ? "admin-sidebar__link--active" : ""}`}
            >
              <span className="admin-sidebar__icon">{tab.icon}</span>
              {open && (
                <>
                  <span className="admin-sidebar__label">{tab.label}</span>
                  {badge > 0 && <span className="admin-sidebar__badge">{badge}</span>}
                </>
              )}
            </button>
          );
        })}
      </nav>

      <div className="admin-sidebar__footer">
        {open && (
          <button className="admin-sidebar__toggle" onClick={handleLogout}>
            Logout
          </button>
        )}
        <button className="admin-sidebar__toggle" onClick={() => setOpen((value) => !value)}>
          {open ? "Collapse" : "Expand"}
        </button>
      </div>
    </aside>
  );
}
