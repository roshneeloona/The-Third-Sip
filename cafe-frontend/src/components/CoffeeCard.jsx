import { useState } from "react";
import { motion } from "framer-motion";
import { useCart } from "../context/CartContext";
import CoffeeCustomizerModal from "./CoffeeCustomizerModal";

function CoffeeCard({ coffee, onAddToCart }) {
  const [modalOpen, setModalOpen] = useState(false);

  // Safe destructuring (prevents crash if context fails)
  const cartContext = useCart();
  const addToCart = cartContext?.addToCart;

  // 🔴 Prevent crash if coffee is undefined
  if (!coffee) return null;

  function handleClick() {
    // If login check fails, stop
    if (onAddToCart && !onAddToCart()) return;

    if (coffee.category === "Food") {
      addToCart?.(coffee); // safe call
    } else {
      setModalOpen(true);
    }
  }

  return (
    <>
      <motion.div
        className="coffee-card"
        whileHover={{ y: -8 }}
        transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
        onClick={handleClick}
        style={{ cursor: "pointer" }}
      >
        <div className="coffee-card__img-wrap">
          <img
            src={coffee.image || "https://via.placeholder.com/150"}
            alt={coffee.name || "Coffee"}
            className="coffee-card__img"
          />
          <span className="coffee-card__category">
            {coffee.category || "Item"}
          </span>
        </div>

        <div className="coffee-card__body">
          <h3 className="coffee-card__name">
            {coffee.name || "Unnamed"}
          </h3>

          <p className="coffee-card__desc">
            {coffee.description || "No description available"}
          </p>

          <div className="coffee-card__footer">
            <span className="coffee-card__price">
              ₹{coffee.price ?? 0}
            </span>
            <span className="coffee-card__cta-hint">
              Customize →
            </span>
          </div>
        </div>
      </motion.div>

      {modalOpen && (
        <CoffeeCustomizerModal
          coffee={coffee}
          onClose={() => setModalOpen(false)}
        />
      )}
    </>
  );
}

export default CoffeeCard;