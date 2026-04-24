import { useEffect, useMemo, useState } from "react";
import { apiRequest } from "../utils/api";
import { expiryStatus, daysUntil } from "../utils/helpers";

export default function Inventory() {
  const [inventory, setInventory] = useState([]);
  const [filter, setFilter] = useState("All");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [restockingId, setRestockingId] = useState("");

  useEffect(() => {
    let ignore = false;

    async function loadInventory() {
      try {
        const data = await apiRequest("/api/inventory");
        if (!ignore) {
          setInventory(data.items || []);
        }
      } catch (requestError) {
        if (!ignore) {
          setError(requestError.message || "Could not load inventory");
        }
      } finally {
        if (!ignore) {
          setLoading(false);
        }
      }
    }

    loadInventory();
    return () => {
      ignore = true;
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
    return <div className="card">Loading inventory...</div>;
  }

  return (
    <div className="card">
      <div className="card__header">
        <div>
          <p className="card__eyebrow">Stock</p>
          <h3 className="card__title">Inventory</h3>
        </div>
        <div className="filter-group">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setFilter(category)}
              className={`filter-btn ${filter === category ? "filter-btn--active" : ""}`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      {error && <p className="card__eyebrow" style={{ color: "#8a3a3a" }}>{error}</p>}

      <div className="overflow-x">
        <table className="inv-table">
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
                    <span className="inv-table__name">{item.name}</span>
                    {low && <span className="low-badge">Low Stock</span>}
                  </td>
                  <td>{item.category}</td>
                  <td className={low ? "inv-table__stock--low" : ""}>{item.stock} {item.unit}</td>
                  <td>{item.expiry}</td>
                  <td>
                    <span className={`expiry-badge expiry-badge--${state}`}>
                      {state === "good" ? "âœ“ Fresh"
                        : state === "warning" ? `âš  ${days}d left`
                        : state === "critical" ? `ðŸ”´ ${days}d left`
                        : "Expired"}
                    </span>
                  </td>
                  <td>
                    <button className="restock-btn" onClick={() => restock(item.id)} disabled={restockingId === String(item.id)}>
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
