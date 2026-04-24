import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAdminSummary } from "../hooks/useAdminSummary";
import { apiRequest, clearAdminAuth } from "../utils/api";

const TABS = [
  { label: "Dashboard", icon: "â—ˆ", path: "/admin/dashboard" },
  { label: "Orders", icon: "â—‰", path: "/admin/orders" },
  { label: "Inventory", icon: "â–£", path: "/admin/inventory" },
  { label: "Menu", icon: "â—§", path: "/admin/menu" },
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
    navigate("/login");
  }

  return (
    <aside className={`sidebar ${open ? "sidebar--open" : "sidebar--closed"}`}>
      <div className="sidebar__brand">
        <div className="sidebar__logo">â˜•</div>
        {open && (
          <div>
            <div className="sidebar__brand-name">The Third Sip</div>
            <div className="sidebar__brand-sub">Admin Panel</div>
          </div>
        )}
      </div>

      <nav className="sidebar__nav">
        {TABS.map((tab) => {
          const active = location.pathname === tab.path;
          const badge = badges[tab.path] || 0;
          return (
            <button
              key={tab.label}
              onClick={() => navigate(tab.path)}
              className={`sidebar__link ${active ? "sidebar__link--active" : ""}`}
            >
              <span className="sidebar__icon">{tab.icon}</span>
              {open && (
                <>
                  <span className="sidebar__label">{tab.label}</span>
                  {badge > 0 && <span className="sidebar__badge">{badge}</span>}
                </>
              )}
            </button>
          );
        })}
      </nav>

      <div className="sidebar__footer">
        {open && (
          <button className="sidebar__toggle" onClick={handleLogout}>
            Logout
          </button>
        )}
        <button className="sidebar__toggle" onClick={() => setOpen((value) => !value)}>
          {open ? "â—€" : "â–¶"}
        </button>
      </div>
    </aside>
  );
}
