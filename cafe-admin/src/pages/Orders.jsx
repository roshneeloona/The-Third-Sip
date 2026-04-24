import { useEffect, useMemo, useState } from "react";
import { apiRequest } from "../utils/api";
import { createAdminSocket } from "../utils/socket";
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

  async function loadOrders() {
    const data = await apiRequest("/api/orders");
    setOrders(data.orders || []);
  }

  useEffect(() => {
    let ignore = false;

    async function bootstrap() {
      try {
        const data = await apiRequest("/api/orders");
        if (!ignore) {
          setOrders(data.orders || []);
        }
      } catch (requestError) {
        if (!ignore) {
          setError(requestError.message || "Could not load orders");
        }
      } finally {
        if (!ignore) {
          setLoading(false);
        }
      }
    }

    const socket = createAdminSocket();
    const refresh = () => loadOrders().catch(() => {});

    socket.on("order:created", refresh);
    socket.on("order:updated", refresh);

    bootstrap();
    return () => {
      ignore = true;
      socket.off("order:created", refresh);
      socket.off("order:updated", refresh);
      socket.disconnect();
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
    return <div className="card">Loading orders...</div>;
  }

  return (
    <div className="card">
      <div className="card__header">
        <div>
          <p className="card__eyebrow">Live</p>
          <h3 className="card__title">Orders</h3>
        </div>
        <div className="filter-group">
          {FILTERS.map((entry) => (
            <button
              key={entry}
              onClick={() => setFilter(entry)}
              className={`filter-btn ${filter === entry ? "filter-btn--active" : ""}`}
            >
              {entry}
            </button>
          ))}
        </div>
      </div>

      {error && <p className="card__eyebrow" style={{ color: "#8a3a3a" }}>{error}</p>}

      {shown.map((order, index) => (
        <div key={order.id} className={`orders__row ${index % 2 === 0 ? "orders__row--even" : "orders__row--odd"}`}>
          <div className="orders__row-left">
            <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
              <span className="orders__id">{order.id}</span>
              <span className="orders__customer">{order.customer}</span>
            </div>
            <span className="orders__items">{formatOrderItems(order.items)}</span>
          </div>
          <div className="orders__row-right">
            <span className="orders__total">{fmt(order.total)}</span>
            <select
              value={order.status}
              onChange={(event) => handleStatusChange(order.id, event.target.value)}
              disabled={updatingId === order.id}
              className="filter-btn"
            >
              {FILTERS.filter((entry) => entry !== "All").map((entry) => (
                <option key={entry} value={entry}>{entry}</option>
              ))}
            </select>
            <span className="orders__time">{formatOrderTime(order.createdAt)}</span>
          </div>
        </div>
      ))}
    </div>
  );
}
