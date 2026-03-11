import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";

function CustomizationTags({ customization }) {
  if (!customization) return null;
  const { size, milk, sugar, shots, extras } = customization;
  const tags = [
    size !== "Regular" && size,
    shots > 1 && `${shots} shots`,
    milk !== "Whole Milk" && milk,
    sugar !== "1 tsp" && sugar,
    ...(extras || []),
  ].filter(Boolean);

  if (!tags.length) return null;
  return (
    <div className="cart-item__tags">
      {tags.map((t) => (
        <span key={t} className="cart-tag">{t}</span>
      ))}
    </div>
  );
}

function Cart() {
  const { cart, removeFromCart, updateQty, total, clearCart } = useCart();
  const [ordered, setOrdered] = useState(false);

  const handleOrder = () => {
    setOrdered(true);
    clearCart();
  };

  if (ordered) {
    return (
      <div className="cart-page">
        <motion.div
          className="cart-success"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="cart-success__icon">✓</div>
          <h2>Order Placed!</h2>
          <p>Your coffee is being crafted with love. See you soon.</p>
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
          transition={{ duration: 0.6 }}
        >
          <p className="cart-empty__msg">Your cup is empty.</p>
          <Link to="/menu" className="btn btn--primary">Browse Menu</Link>
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
                    <p className="cart-item__unit">₹{item.price} each</p>
                  </div>
                  <div className="cart-item__controls">
                    <button className="qty-btn" onClick={() => updateQty(item.key, -1)}>−</button>
                    <span className="qty-num">{item.qty}</span>
                    <button className="qty-btn" onClick={() => updateQty(item.key, 1)}>+</button>
                  </div>
                  <p className="cart-item__subtotal">₹{item.price * item.qty}</p>
                  <button className="cart-item__remove" onClick={() => removeFromCart(item.key)}>✕</button>
                </motion.li>
              ))}
            </AnimatePresence>
          </ul>

          <div className="cart-summary">
            <h2 className="cart-summary__title">Order Summary</h2>
            <div className="cart-summary__row">
              <span>Subtotal</span>
              <span>₹{total}</span>
            </div>
            <div className="cart-summary__row">
              <span>Delivery</span>
              <span className="cart-summary__free">Free</span>
            </div>
            <div className="cart-summary__divider" />
            <div className="cart-summary__row cart-summary__row--total">
              <span>Total</span>
              <span>₹{total}</span>
            </div>
            <button className="btn btn--primary cart-summary__cta" onClick={handleOrder}>
              Place Order
            </button>
            <Link to="/menu" className="cart-summary__back">← Continue Shopping</Link>
          </div>
        </div>
      )}
    </div>
  );
}

export default Cart;