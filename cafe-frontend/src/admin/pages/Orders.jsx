import { useEffect, useMemo, useState } from "react";
import { apiRequest } from "../utils/api";
import { fmt } from "../utils/helpers";

const FILTERS = ["All", "Pending", "Preparing", "Delivered", "Cancelled"];

function formatOrderItems(items) {
  return items.map((item) => `${item.name} x${item.qty}`).join(", ");
}

function formatOrderTime(createdAt) {
  return new Date(createdAt).toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [filter, setFilter] = useState("All");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [updatingId, setUpdatingId] = useState("");

  useEffect(() => {
    let ignore = false;

    async function loadOrders(background = false) {
      try {
        const data = await apiRequest("/api/orders");
        if (!ignore) {
          setOrders(data.orders || []);
          setError("");
        }
      } catch (requestError) {
        if (!ignore) {
          setError(requestError.message || "Could not load orders");
        }
      } finally {
        if (!ignore && !background) {
          setLoading(false);
        }
      }
    }

    loadOrders();
    const intervalId = setInterval(() => {
      loadOrders(true);
    }, 4000);

    return () => {
      ignore = true;
      clearInterval(intervalId);
    };
  }, []);

  const shown = useMemo(() => {
    return filter === "All" ? orders : orders.filter((order) => order.status === filter);
  }, [filter, orders]);

  async function handleStatusChange(orderId, status) {
    setUpdatingId(orderId);
    try {
      const data = await apiRequest(`/api/orders/${orderId}/status`, {
        method: "PATCH",
        body: { status },
      });

      setOrders((prev) =>
        prev.map((order) => (order.id === orderId ? data.order : order))
      );
    } catch (requestError) {
      setError(requestError.message || "Could not update order status");
    } finally {
      setUpdatingId("");
    }
  }

  if (loading) {
    return <div className="admin-card admin-card--padded">Loading orders...</div>;
  }

  return (
    <div className="admin-card">
      <div className="admin-card__header">
        <div>
          <p className="admin-card__eyebrow">Live</p>
          <h3 className="admin-card__title">Orders</h3>
          <p className="admin-page-date" style={{ marginTop: 6 }}>Auto refreshes every 4 seconds.</p>
        </div>
        <div className="admin-filter-group">
          {FILTERS.map((entry) => (
            <button
              key={entry}
              onClick={() => setFilter(entry)}
              className={`admin-filter-btn ${filter === entry ? "admin-filter-btn--active" : ""}`}
            >
              {entry}
            </button>
          ))}
        </div>
      </div>

      {error && <p className="admin-card__eyebrow" style={{ color: "#8a3a3a", padding: "0 28px 18px" }}>{error}</p>}

      {shown.map((order, index) => (
        <div key={order.id} className={`admin-order-row ${index % 2 === 0 ? "admin-order-row--even" : "admin-order-row--odd"}`}>
          <div className="admin-order-row__left">
            <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
              <span className="admin-order-row__id">{order.id}</span>
              <span className="admin-order-row__customer">{order.customer}</span>
            </div>
            <span className="admin-order-row__items">{formatOrderItems(order.items)}</span>
          </div>
          <div className="admin-order-row__right">
            <span className="admin-order-row__total">{fmt(order.total)}</span>
            <select
              value={order.status}
              onChange={(event) => handleStatusChange(order.id, event.target.value)}
              disabled={updatingId === order.id}
              className="admin-filter-btn"
            >
              {FILTERS.filter((entry) => entry !== "All").map((entry) => (
                <option key={entry} value={entry}>{entry}</option>
              ))}
            </select>
            <span className="admin-order-row__time">{formatOrderTime(order.createdAt)}</span>
          </div>
        </div>
      ))}
    </div>
  );
}
