import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { INVENTORY, ORDERS } from "../data/adminData";
import { expiryStatus } from "../utils/helpers";

const TABS = [
  { label: "Dashboard", icon: "◈", path: "/admin/dashboard" },
  { label: "Orders",    icon: "◉", path: "/admin/orders"    },
  { label: "Inventory", icon: "▣", path: "/admin/inventory" },
  { label: "Menu",      icon: "◧", path: "/admin/menu"      },
];

export default function Sidebar() {
  const [open, setOpen] = useState(true);
  const navigate        = useNavigate();
  const location        = useLocation();

  const expiryAlerts  = INVENTORY.filter(i => ["critical", "expired"].includes(expiryStatus(i.expiry)));
  const pendingOrders = ORDERS.filter(o => o.status === "Pending");
  const badges = {
    "/admin/orders":    pendingOrders.length,
    "/admin/inventory": expiryAlerts.length,
  };

  return (
    <aside className={`sidebar ${open ? "sidebar--open" : "sidebar--closed"}`}>

      <div className="sidebar__brand">
        <div className="sidebar__logo">☕</div>
        {open && (
          <div>
            <div className="sidebar__brand-name">The Third Sip</div>
            <div className="sidebar__brand-sub">Admin Panel</div>
          </div>
        )}
      </div>

      <nav className="sidebar__nav">
        {TABS.map(t => {
          const active = location.pathname === t.path;
          const badge  = badges[t.path] || 0;
          return (
            <button
              key={t.label}
              onClick={() => navigate(t.path)}
              className={`sidebar__link ${active ? "sidebar__link--active" : ""}`}
            >
              <span className="sidebar__icon">{t.icon}</span>
              {open && (
                <>
                  <span className="sidebar__label">{t.label}</span>
                  {badge > 0 && <span className="sidebar__badge">{badge}</span>}
                </>
              )}
            </button>
          );
        })}
      </nav>

      <div className="sidebar__footer">
        <button className="sidebar__toggle" onClick={() => setOpen(p => !p)}>
          {open ? "◀" : "▶"}
        </button>
      </div>

    </aside>
  );
}