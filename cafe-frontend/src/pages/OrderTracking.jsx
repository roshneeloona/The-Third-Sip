import { useEffect, useMemo, useRef, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { apiRequest, apiTextRequest, clearAuth } from "../utils/api";
import { buildReceiptMarkup, formatCurrency, formatPlacedAt } from "../utils/receiptWindow";

const STATUS_FLOW = ["Pending", "Preparing", "Delivered"];
const STATUS_TONE = {
  Pending: "pending",
  Preparing: "preparing",
  Delivered: "delivered",
  Cancelled: "cancelled",
};

function getStepState(currentStatus, step) {
  if (currentStatus === "Cancelled") {
    return "upcoming";
  }

  const currentIndex = STATUS_FLOW.indexOf(currentStatus);
  const stepIndex = STATUS_FLOW.indexOf(step);

  if (stepIndex < currentIndex) {
    return "complete";
  }

  if (stepIndex === currentIndex) {
    return "active";
  }

  return "upcoming";
}

export default function OrderTracking() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [openingReceiptId, setOpeningReceiptId] = useState("");
  const [notices, setNotices] = useState([]);
  const focusOrderId = searchParams.get("focus") || "";
  const previousStatusesRef = useRef(new Map());
  const noticeTimeoutsRef = useRef([]);

  function pushNotice(message) {
    const id = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
    setNotices((current) => [...current, { id, message }]);

    const timeoutId = window.setTimeout(() => {
      setNotices((current) => current.filter((entry) => entry.id !== id));
      noticeTimeoutsRef.current = noticeTimeoutsRef.current.filter((entry) => entry !== timeoutId);
    }, 5000);

    noticeTimeoutsRef.current.push(timeoutId);
  }

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
        if (requestError.status === 401) {
          clearAuth();
          navigate("/login", {
            replace: true,
            state: { from: `${window.location.pathname}${window.location.search}` },
          });
          return;
        }

        if (!ignore) {
          setError(requestError.message || "Could not load your orders");
        }
      } finally {
        if (!ignore && !background) {
          setLoading(false);
        }
      }
    }

    loadOrders();
    const intervalId = window.setInterval(() => {
      loadOrders(true);
    }, 4000);

    return () => {
      ignore = true;
      window.clearInterval(intervalId);
    };
  }, [navigate]);

  useEffect(() => {
    return () => {
      noticeTimeoutsRef.current.forEach((timeoutId) => window.clearTimeout(timeoutId));
    };
  }, []);

  useEffect(() => {
    const nextStatuses = new Map();

    orders.forEach((order) => {
      const previousStatus = previousStatusesRef.current.get(order.id);

      if (previousStatus && previousStatus !== order.status && order.status === "Preparing") {
        pushNotice(`Payment confirmed. ${order.id} is now being prepared.`);
      }

      nextStatuses.set(order.id, order.status);
    });

    previousStatusesRef.current = nextStatuses;
  }, [orders]);

  const shownOrders = useMemo(() => {
    if (!focusOrderId) {
      return orders;
    }

    const focused = orders.find((order) => order.id === focusOrderId);
    const remaining = orders.filter((order) => order.id !== focusOrderId);

    return focused ? [focused, ...remaining] : orders;
  }, [focusOrderId, orders]);

  async function handleViewReceipt(order) {
    setOpeningReceiptId(order.id);
    setError("");

    const receiptWindow = window.open("", "_blank");
    if (!receiptWindow) {
      setOpeningReceiptId("");
      setError("Please allow pop-ups to open the receipt.");
      return;
    }

    receiptWindow.document.write("<p style='font-family: Georgia, serif; padding: 32px;'>Preparing your receipt...</p>");

    try {
      const receiptText = await apiTextRequest(`/api/orders/${order.id}/receipt`);
      receiptWindow.document.open();
      receiptWindow.document.write(buildReceiptMarkup(order, receiptText));
      receiptWindow.document.close();
    } catch (requestError) {
      receiptWindow.close();
      setError(requestError.message || "Could not open receipt");
    } finally {
      setOpeningReceiptId("");
    }
  }

  if (loading) {
    return (
      <div className="order-tracking-page">
        <div className="order-tracking-empty">Loading your orders...</div>
      </div>
    );
  }

  return (
    <div className="order-tracking-page">
      {notices.length > 0 ? (
        <div className="order-toast-stack">
          {notices.map((notice) => (
            <div key={notice.id} className="order-toast">
              {notice.message}
            </div>
          ))}
        </div>
      ) : null}

      <div className="order-tracking-header">
        <div>
          <p className="section-eyebrow">Customer Space</p>
          <h1 className="order-tracking-title">Track Your Orders</h1>
          <p className="order-tracking-subtitle">
            Updates refresh automatically, so any change from the staff dashboard appears here for the same order.
          </p>
        </div>
        <Link to="/menu" className="btn btn--outline">
          Order More
        </Link>
      </div>

      {error ? <p className="order-tracking-error">{error}</p> : null}

      {shownOrders.length === 0 ? (
        <div className="order-tracking-empty">
          <p className="order-tracking-empty__title">No orders yet.</p>
          <p className="order-tracking-empty__sub">
            Once you place your first order, the live status and digital receipt will appear here.
          </p>
          <Link to="/menu" className="btn btn--primary">
            Browse Menu
          </Link>
        </div>
      ) : (
        <div className="order-tracking-grid">
          {shownOrders.map((order) => {
            const tone = STATUS_TONE[order.status] || "pending";
            const isFocused = focusOrderId === order.id;

            return (
              <article
                key={order.id}
                className={`order-card ${isFocused ? "order-card--focused" : ""}`}
              >
                <div className="order-card__top">
                  <div>
                    <p className="order-card__id">{order.id}</p>
                    <h2 className="order-card__guest">{order.customer}</h2>
                  </div>
                  <span className={`order-card__status order-card__status--${tone}`}>
                    {order.status}
                  </span>
                </div>

                <div className="order-card__meta">
                  <div>
                    <span className="order-card__meta-label">Placed</span>
                    <span className="order-card__meta-value">{formatPlacedAt(order.createdAt)}</span>
                  </div>
                  <div>
                    <span className="order-card__meta-label">Last update</span>
                    <span className="order-card__meta-value">{formatPlacedAt(order.updatedAt || order.createdAt)}</span>
                  </div>
                  <div>
                    <span className="order-card__meta-label">Total</span>
                    <span className="order-card__meta-value">{formatCurrency(order.total)}</span>
                  </div>
                </div>

                {order.status === "Cancelled" ? (
                  <div className="order-progress order-progress--cancelled">
                    <div className="order-progress__cancelled">This order was cancelled by the cafe team.</div>
                  </div>
                ) : (
                  <div className="order-progress">
                    {STATUS_FLOW.map((step) => (
                      <div
                        key={step}
                        className={`order-progress__step order-progress__step--${getStepState(order.status, step)}`}
                      >
                        <span className="order-progress__dot" />
                        <span className="order-progress__label">{step}</span>
                      </div>
                    ))}
                  </div>
                )}

                <div className="order-card__items">
                  {order.items.map((item, index) => (
                    <div key={`${order.id}-${item.menuItemId}-${index}`} className="order-card__item">
                      <div>
                        <div className="order-card__item-name">{item.name}</div>
                        <div className="order-card__item-meta">
                          Qty {item.qty}
                          {item.customization?.temperature ? ` | ${item.customization.temperature}` : ""}
                        </div>
                      </div>
                      <div className="order-card__item-price">
                        {formatCurrency(item.qty * item.price)}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="order-card__footer">
                  <div>
                    <div className="order-card__footer-label">Receipt</div>
                    <div className="order-card__footer-value">Stored securely with your order history.</div>
                  </div>
                  <button
                    type="button"
                    className="btn btn--primary"
                    onClick={() => handleViewReceipt(order)}
                    disabled={openingReceiptId === order.id}
                  >
                    {openingReceiptId === order.id ? "Opening..." : "View Receipt"}
                  </button>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
}
