import { useState } from "react";
import { INVENTORY } from "../data/adminData";
import { expiryStatus, daysUntil } from "../utils/helpers";

const ALL_CATS = ["All", ...new Set(INVENTORY.map(i => i.category))];

export default function Inventory() {
  const [inventory, setInventory] = useState(INVENTORY);
  const [filter, setFilter]       = useState("All");

  const shown   = filter === "All" ? inventory : inventory.filter(i => i.category === filter);
  const restock = (id) => setInventory(prev => prev.map(it => it.id === id ? { ...it, stock: it.stock + 10 } : it));

  return (
    <div className="card">
      <div className="card__header">
        <div>
          <p className="card__eyebrow">Stock</p>
          <h3 className="card__title">Inventory</h3>
        </div>
        <div className="filter-group">
          {ALL_CATS.map(c => (
            <button
              key={c}
              onClick={() => setFilter(c)}
              className={`filter-btn ${filter === c ? "filter-btn--active" : ""}`}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      <div className="overflow-x">
        <table className="inv-table">
          <thead>
            <tr>
              {["Item", "Category", "Stock", "Expiry", "Status", "Action"].map(h => (
                <th key={h}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {shown.map(item => {
              const st  = expiryStatus(item.expiry);
              const low = item.stock <= item.reorder;
              const d   = daysUntil(item.expiry);
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
                    <span className={`expiry-badge expiry-badge--${st}`}>
                      {st === "good"     ? "✓ Fresh"
                       : st === "warning"  ? `⚠ ${d}d left`
                       : st === "critical" ? `🔴 ${d}d left`
                       : "Expired"}
                    </span>
                  </td>
                  <td>
                    <button className="restock-btn" onClick={() => restock(item.id)}>
                      + Restock
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