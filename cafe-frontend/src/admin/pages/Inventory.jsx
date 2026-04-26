import { useEffect, useMemo, useState } from "react";
import { apiRequest } from "../utils/api";
import { expiryStatus, daysUntil, formatStock } from "../utils/helpers";

export default function Inventory() {
  const [inventory, setInventory] = useState([]);
  const [filter, setFilter] = useState("All");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [restockingId, setRestockingId] = useState("");

  useEffect(() => {
    let ignore = false;

    async function loadInventory(background = false) {
      try {
        const data = await apiRequest("/api/inventory");
        if (!ignore) {
          setInventory(data.items || []);
          setError("");
        }
      } catch (requestError) {
        if (!ignore) {
          setError(requestError.message || "Could not load inventory");
        }
      } finally {
        if (!ignore && !background) {
          setLoading(false);
        }
      }
    }

    loadInventory();
    const intervalId = setInterval(() => {
      loadInventory(true);
    }, 4000);

    return () => {
      ignore = true;
      clearInterval(intervalId);
    };
  }, []);

  const categories = useMemo(() => {
    return ["All", ...new Set(inventory.map((item) => item.category))];
  }, [inventory]);

  const shown = filter === "All" ? inventory : inventory.filter((item) => item.category === filter);

  async function restock(id) {
    setRestockingId(String(id));
    try {
      const data = await apiRequest(`/api/inventory/${id}`, {
        method: "PATCH",
        body: { restockBy: 10 },
      });

      setInventory((prev) =>
        prev.map((item) => (item.id === id ? data.item : item))
      );
    } catch (requestError) {
      setError(requestError.message || "Could not update inventory");
    } finally {
      setRestockingId("");
    }
  }

  if (loading) {
    return <div className="admin-card admin-card--padded">Loading inventory...</div>;
  }

  return (
    <div className="admin-card">
      <div className="admin-card__header">
        <div>
          <p className="admin-card__eyebrow">Stock</p>
          <h3 className="admin-card__title">Inventory</h3>
          <p className="admin-page-date" style={{ marginTop: 6 }}>Auto refreshes every 4 seconds.</p>
        </div>
        <div className="admin-filter-group">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setFilter(category)}
              className={`admin-filter-btn ${filter === category ? "admin-filter-btn--active" : ""}`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      {error && <p className="admin-card__eyebrow" style={{ color: "#8a3a3a", padding: "0 20px 18px" }}>{error}</p>}

      <div className="admin-table-wrap">
        <table className="admin-inventory-table">
          <thead>
            <tr>
              {["Item", "Category", "Stock", "Expiry", "Status", "Action"].map((heading) => (
                <th key={heading}>{heading}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {shown.map((item) => {
              const state = expiryStatus(item.expiry);
              const low = item.stock <= item.reorder;
              const days = daysUntil(item.expiry);

              return (
                <tr key={item.id}>
                  <td>
                    <span className="admin-inventory-table__name">{item.name}</span>
                    {low && <span className="admin-low-badge">Low Stock</span>}
                  </td>
                  <td>{item.category}</td>
                  <td className={low ? "admin-inventory-table__stock--low" : ""}>{formatStock(item.stock, item.unit)}</td>
                  <td>{item.expiry}</td>
                  <td>
                    <span className={`admin-expiry-badge admin-expiry-badge--${state}`}>
                      {state === "good" ? "Fresh"
                        : state === "warning" ? `${days}d left`
                        : state === "critical" ? `${days}d left`
                        : "Expired"}
                    </span>
                  </td>
                  <td>
                    <button className="admin-restock-btn" onClick={() => restock(item.id)} disabled={restockingId === String(item.id)}>
                      {restockingId === String(item.id) ? "Updating..." : "+ Restock"}
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
