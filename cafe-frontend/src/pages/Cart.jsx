import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { apiRequest, apiTextRequest, clearAuth, getStoredUser } from "../utils/api";
import { buildReceiptMarkup } from "../utils/receiptWindow";

function CustomizationTags({ customization }) {
  if (!customization) {
    return null;
  }

  const { size, temperature, milk, sugar, shots, extras } = customization;
  const tags = [
    size !== "Regular" && size,
    temperature,
    shots > 1 && `${shots} shots`,
    milk !== "Whole Milk" && milk,
    sugar !== "1 tsp" && sugar,
    ...(extras || []),
  ].filter(Boolean);

  if (!tags.length) {
    return null;
  }

  return (
    <div className="cart-item__tags">
      {tags.map((tag) => (
        <span key={tag} className="cart-tag">
          {tag}
        </span>
      ))}
    </div>
  );
}

export default function Cart() {
  const { cart, removeFromCart, updateQty, total, clearCart } = useCart();
  const [ordered, setOrdered] = useState(false);
  const [placingOrder, setPlacingOrder] = useState(false);
  const [openingReceipt, setOpeningReceipt] = useState(false);
  const [orderError, setOrderError] = useState("");
  const [orderNotice, setOrderNotice] = useState("");
  const [lastOrder, setLastOrder] = useState(null);
  const navigate = useNavigate();
  const user = getStoredUser();
  const lastKnownStatusRef = useRef("");

  useEffect(() => {
    if (!ordered || !lastOrder?.id) {
      return undefined;
    }

    let ignore = false;
    lastKnownStatusRef.current = lastOrder.status || "";

    async function syncLatestOrder(background = false) {
      try {
        const data = await apiRequest(`/api/orders/${lastOrder.id}`);
        if (ignore) {
          return;
        }

        const nextOrder = {
          ...data.order,
          receiptUrl: lastOrder.receiptUrl,
        };

        if (
          lastKnownStatusRef.current &&
          nextOrder.status !== lastKnownStatusRef.current &&
          nextOrder.status === "Preparing"
        ) {
          setOrderNotice("Payment confirmed. Your order is now being prepared.");
        }

        lastKnownStatusRef.current = nextOrder.status;
        setLastOrder(nextOrder);
      } catch (error) {
        if (ignore) {
          return;
        }

        if (error.status === 401) {
          clearAuth();
          navigate("/login", { replace: true, state: { from: "/cart" } });
        } else if (!background) {
          setOrderError(error.message || "Could not refresh your order status.");
        }
      }
    }

    syncLatestOrder();
    const intervalId = window.setInterval(() => {
      syncLatestOrder(true);
    }, 4000);

    return () => {
      ignore = true;
      window.clearInterval(intervalId);
    };
  }, [navigate, ordered, lastOrder?.id]);

  async function handleViewReceipt() {
    if (!lastOrder?.receiptUrl) {
      return;
    }

    setOpeningReceipt(true);
    setOrderError("");

    const receiptWindow = window.open("", "_blank");
    if (!receiptWindow) {
      setOpeningReceipt(false);
      setOrderError("Please allow pop-ups to open the receipt.");
      return;
    }

    receiptWindow.document.write(
      "<p style='font-family: Georgia, serif; padding: 32px;'>Preparing your receipt...</p>"
    );

    try {
      const receiptText = await apiTextRequest(lastOrder.receiptUrl);
      receiptWindow.document.open();
      receiptWindow.document.write(buildReceiptMarkup(lastOrder, receiptText));
      receiptWindow.document.close();
    } catch (error) {
      receiptWindow.close();
      setOrderError(error.message || "Could not open receipt");
    } finally {
      setOpeningReceipt(false);
    }
  }

  async function handleOrder() {
    if (!user) {
      navigate("/login", { state: { from: "/cart" } });
      return;
    }

    setPlacingOrder(true);
    setOrderError("");

    try {
      const data = await apiRequest("/api/orders", {
        method: "POST",
        body: {
          items: cart.map((item) => ({
            menuItemId: item.id,
            qty: item.qty,
            price: item.price,
            customization: item.customization || null,
          })),
        },
      });

      setLastOrder({
        ...data.order,
        receiptUrl: data.receiptUrl,
      });
      setOrderNotice("");
      setOrdered(true);
      clearCart();
    } catch (error) {
      if (error.status === 401) {
        clearAuth();
        navigate("/login", { state: { from: "/cart" } });
        return;
      }

      setOrderError(error.message || "Could not place the order");
    } finally {
      setPlacingOrder(false);
    }
  }

  if (ordered) {
    return (
      <div className="cart-page">
        <motion.div
          className="cart-success"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
        >
          <div className="cart-success__icon">OK</div>
          <h2>Order Placed!</h2>
          <p>
            Your drink is being crafted with care.
            {lastOrder ? ` Order ID: ${lastOrder.id}.` : ""}
          </p>

          {lastOrder ? (
            <p className="cart-login-note cart-login-note--success" style={{ marginBottom: 12 }}>
              Current status: {lastOrder.status}
            </p>
          ) : null}

          {orderNotice ? <p className="cart-login-note cart-login-note--success">{orderNotice}</p> : null}

          {orderError ? (
            <p className="cart-login-note" style={{ color: "#8a3a3a" }}>
              {orderError}
            </p>
          ) : null}

          {lastOrder?.receiptUrl ? (
            <div
              style={{
                display: "flex",
                gap: 12,
                flexWrap: "wrap",
                justifyContent: "center",
                marginBottom: 12,
              }}
            >
              <button
                type="button"
                onClick={handleViewReceipt}
                disabled={openingReceipt}
                className="btn btn--outline"
              >
                {openingReceipt ? "Opening Receipt..." : "View Receipt"}
              </button>
              <Link to={`/orders?focus=${encodeURIComponent(lastOrder.id)}`} className="btn btn--outline">
                Track Order
              </Link>
            </div>
          ) : null}

          <Link to="/menu" className="btn btn--primary" onClick={() => setOrdered(false)}>
            Order Again
          </Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="cart-page">
      <div className="cart-page__header">
        <p className="section-eyebrow">Review</p>
        <h1 className="cart-page__title">Your Cart</h1>
      </div>

      {cart.length === 0 ? (
        <motion.div
          className="cart-empty"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <p className="cart-empty__msg">Your cup is empty.</p>
          <Link to="/menu" className="btn btn--primary">
            Browse Menu
          </Link>
        </motion.div>
      ) : (
        <div className="cart-layout">
          <ul className="cart-items">
            <AnimatePresence>
              {cart.map((item) => (
                <motion.li
                  key={item.key}
                  className="cart-item"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 50, height: 0, marginBottom: 0, padding: 0 }}
                  transition={{ duration: 0.32 }}
                >
                  <img src={item.image} alt={item.name} className="cart-item__img" />

                  <div className="cart-item__info">
                    <h3>{item.name}</h3>
                    <CustomizationTags customization={item.customization} />
                    <p className="cart-item__unit">INR {item.price} each</p>
                  </div>

                  <div className="cart-item__controls">
                    <button className="qty-btn" onClick={() => updateQty(item.key, -1)}>
                      -
                    </button>
                    <span className="qty-num">{item.qty}</span>
                    <button className="qty-btn" onClick={() => updateQty(item.key, 1)}>
                      +
                    </button>
                  </div>

                  <p className="cart-item__subtotal">INR {item.price * item.qty}</p>
                  <button className="cart-item__remove" onClick={() => removeFromCart(item.key)}>
                    Remove
                  </button>
                </motion.li>
              ))}
            </AnimatePresence>
          </ul>

          <div className="cart-summary">
            <h2 className="cart-summary__title">Order Summary</h2>
            <div className="cart-summary__row">
              <span>Subtotal</span>
              <span>INR {total}</span>
            </div>
            <div className="cart-summary__row">
              <span>Delivery</span>
              <span className="cart-summary__free">Free</span>
            </div>
            <div className="cart-summary__divider" />
            <div className="cart-summary__row cart-summary__row--total">
              <span>Total</span>
              <span>INR {total}</span>
            </div>

            {!user ? (
              <p className="cart-login-note">
                You need to <Link to="/login">sign in</Link> to place an order.
              </p>
            ) : null}

            {orderError ? (
              <p className="cart-login-note" style={{ color: "#8a3a3a" }}>
                {orderError}
              </p>
            ) : null}

            <button
              className="btn btn--primary cart-summary__cta"
              onClick={handleOrder}
              disabled={placingOrder}
            >
              {user ? (placingOrder ? "Placing Order..." : "Place Order") : "Sign In to Order"}
            </button>

            <Link to="/menu" className="cart-summary__back">
              &lt; Continue Shopping
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
