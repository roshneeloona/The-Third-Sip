import { useState } from "react";
import { MENU_ITEMS } from "../data/adminData";
import { fmt } from "../utils/helpers";

export default function Menu() {
  const [items, setItems] = useState(MENU_ITEMS);
  const toggle = (id) => setItems(prev => prev.map(i => i.id === id ? { ...i, active: !i.active } : i));

  return (
    <div className="card">
      <div className="card__header">
        <div>
          <p className="card__eyebrow">Manage</p>
          <h3 className="card__title">Menu Items</h3>
        </div>
      </div>

      <div className="menu-grid">
        {items.map(item => (
          <div key={item.id} className={`menu-card ${item.active ? "menu-card--active" : "menu-card--inactive"}`}>
            <div className="menu-card__header">
              <div>
                <div className="menu-card__name">{item.name}</div>
                <div className="menu-card__meta">{item.category} · {item.sold} sold</div>
              </div>
              <div className="menu-card__price">{fmt(item.price)}</div>
            </div>
            <div className="menu-card__bar-row">
              <div className="menu-card__bar-bg">
                <div className="menu-card__bar-fill" style={{ width: `${Math.min(100, (item.sold / 130) * 100)}%` }} />
              </div>
              <span className="menu-card__bar-count">{item.sold}/130</span>
            </div>
            <button
              onClick={() => toggle(item.id)}
              className={`toggle-btn ${item.active ? "toggle-btn--active" : "toggle-btn--inactive"}`}
            >
              {item.active ? "● Active" : "○ Hidden"}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}