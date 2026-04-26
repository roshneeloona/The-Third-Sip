import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useCart } from "../context/CartContext";

const FALLBACK_FOOD_IMAGE =
  "https://images.unsplash.com/photo-1498837167922-ddd27525d352?w=700&auto=format&fit=crop&q=80";

export default function FoodDetailsModal({ food, onClose, onAddToCartCheck }) {
  const { addToCart } = useCart();
  const [added, setAdded] = useState(false);
  const [imageSrc, setImageSrc] = useState(food.image || FALLBACK_FOOD_IMAGE);

  const handleAddToCart = () => {
    if (onAddToCartCheck && !onAddToCartCheck()) return;

    addToCart(food, { type: "Food", note: "No customization" });
    setAdded(true);
    setTimeout(() => {
      setAdded(false);
      onClose();
    }, 900);
  };

  return (
    <AnimatePresence>
      <motion.div
        className="modal-backdrop"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      >
        <motion.div
          className="modal food-modal"
          initial={{ opacity: 0, y: 60, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 40, scale: 0.96 }}
          transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
          onClick={(event) => event.stopPropagation()}
        >
          <div className="modal__header">
            <img
              src={imageSrc}
              alt={food.name}
              className="modal__img"
              onError={() => setImageSrc(FALLBACK_FOOD_IMAGE)}
            />
            <div className="modal__header-text">
              <span className="modal__category">{food.category}</span>
              <h2 className="modal__title">{food.name}</h2>
              <p className="modal__desc">{food.description}</p>
            </div>
            <button className="modal__close" onClick={onClose} aria-label="Close details">
              x
            </button>
          </div>

          <div className="modal__body food-modal__body">
            <div className="modal__section">
              <h3 className="modal__section-title">Details</h3>
              <div className="food-modal__detail-grid">
                <div className="food-modal__detail">
                  <span className="food-modal__label">Prepared</span>
                  <span className="food-modal__value">Fresh to order</span>
                </div>
                <div className="food-modal__detail">
                  <span className="food-modal__label">Serving</span>
                  <span className="food-modal__value">Single portion</span>
                </div>
              </div>
            </div>

            <div className="modal__section">
              <h3 className="modal__section-title">Before You Order</h3>
              <p className="food-modal__note">
                Please ask our team about allergens or dietary preferences before checkout.
              </p>
            </div>
          </div>

          <div className="modal__footer">
            <div className="modal__price-block">
              <span className="modal__price-label">Total</span>
              <span className="modal__price">&#8377;{food.price ?? 0}</span>
            </div>
            <div className="food-modal__actions">
              <button
                className={`btn btn--primary modal__cta ${added ? "modal__cta--added" : ""}`}
                onClick={handleAddToCart}
              >
                {added ? "Added to Cart" : "Add to Cart"}
              </button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
