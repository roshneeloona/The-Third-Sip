import { useEffect, useState } from "react";
import { apiRequest } from "../utils/api";
import { fmt } from "../utils/helpers";

export default function Menu() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [updatingId, setUpdatingId] = useState("");

  useEffect(() => {
    let ignore = false;

    async function loadMenu() {
      try {
        const data = await apiRequest("/api/menu?includeInactive=true");
        if (!ignore) {
          setItems(data.items || []);
        }
      } catch (requestError) {
        if (!ignore) {
          setError(requestError.message || "Could not load menu");
        }
      } finally {
        if (!ignore) {
          setLoading(false);
        }
      }
    }

    loadMenu();
    return () => {
      ignore = true;
    };
  }, []);

  async function toggle(id, active) {
    setUpdatingId(String(id));
    try {
      const data = await apiRequest(`/api/menu/${id}`, {
        method: "PATCH",
        body: { active: !active },
      });

      setItems((prev) =>
        prev.map((item) => (item.id === id ? data.item : item))
      );
    } catch (requestError) {
      setError(requestError.message || "Could not update menu");
    } finally {
      setUpdatingId("");
    }
  }

  if (loading) {
    return <div className="card">Loading menu items...</div>;
  }

  return (
    <div className="card">
      <div className="card__header">
        <div>
          <p className="card__eyebrow">Manage</p>
          <h3 className="card__title">Menu Items</h3>
        </div>
      </div>

      {error && <p className="card__eyebrow" style={{ color: "#8a3a3a" }}>{error}</p>}

      <div className="menu-grid">
        {items.map((item) => (
          <div key={item.id} className={`menu-card ${item.active ? "menu-card--active" : "menu-card--inactive"}`}>
            <div className="menu-card__header">
              <div>
                <div className="menu-card__name">{item.name}</div>
                <div className="menu-card__meta">{item.category} Â· {item.sold} sold</div>
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
              onClick={() => toggle(item.id, item.active)}
              className={`toggle-btn ${item.active ? "toggle-btn--active" : "toggle-btn--inactive"}`}
              disabled={updatingId === String(item.id)}
            >
              {updatingId === String(item.id) ? "Saving..." : item.active ? "â— Active" : "â—‹ Hidden"}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
