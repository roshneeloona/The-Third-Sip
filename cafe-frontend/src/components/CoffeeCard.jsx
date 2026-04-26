import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import CoffeeCustomizerModal from "./CoffeeCustomizerModal";
import FoodDetailsModal from "./FoodDetailsModal";

const FALLBACK_IMAGE =
  "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=700&auto=format&fit=crop&q=80";

function CoffeeCard({ coffee, onAddToCart }) {
  const [modalOpen, setModalOpen] = useState(false);
  const [foodModalOpen, setFoodModalOpen] = useState(false);
  const [imageSrc, setImageSrc] = useState(coffee?.image || FALLBACK_IMAGE);

  useEffect(() => {
    setImageSrc(coffee?.image || FALLBACK_IMAGE);
  }, [coffee?.image]);

  if (!coffee) return null;

  function handleClick() {
    if (coffee.category === "Food") {
      setFoodModalOpen(true);
      return;
    }

    if (onAddToCart && !onAddToCart()) return;
    setModalOpen(true);
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
            src={imageSrc}
            alt={coffee.name || "Coffee"}
            className="coffee-card__img"
            onError={() => setImageSrc(FALLBACK_IMAGE)}
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
              &#8377;{coffee.price ?? 0}
            </span>
            <span className="coffee-card__cta-hint">
              {coffee.category === "Food" ? "View Details" : "Customize"}
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

      {foodModalOpen && (
        <FoodDetailsModal
          food={coffee}
          onClose={() => setFoodModalOpen(false)}
          onAddToCartCheck={onAddToCart}
        />
      )}
    </>
  );
}

export default CoffeeCard;
