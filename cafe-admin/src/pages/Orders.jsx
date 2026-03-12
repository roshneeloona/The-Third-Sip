import { useState } from "react";
import { ORDERS } from "../data/adminData";
import { fmt } from "../utils/helpers";

const FILTERS = ["All", "Pending", "Preparing", "Delivered", "Cancelled"];

export default function Orders() {
  const [filter, setFilter] = useState("All");
  const shown = filter === "All" ? ORDERS : ORDERS.filter(o => o.status === filter);

  return (
    <div className="card">
      <div className="card__header">
        <div>
          <p className="card__eyebrow">Live</p>
          <h3 className="card__title">Orders</h3>
        </div>
        <div className="filter-group">
          {FILTERS.map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`filter-btn ${filter === f ? "filter-btn--active" : ""}`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {shown.map((order, i) => (
        <div key={order.id} className={`orders__row ${i % 2 === 0 ? "orders__row--even" : "orders__row--odd"}`}>
          <div className="orders__row-left">
            <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
              <span className="orders__id">{order.id}</span>
              <span className="orders__customer">{order.customer}</span>
            </div>
            <span className="orders__items">{order.items.join(", ")}</span>
          </div>
          <div className="orders__row-right">
            <span className="orders__total">{fmt(order.total)}</span>
            <span className={`status-badge status-badge--${order.status}`}>{order.status}</span>
            <span className="orders__time">{order.time}</span>
          </div>
        </div>
      ))}
    </div>
  );
}