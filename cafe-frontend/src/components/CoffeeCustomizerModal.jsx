import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useCart } from "../context/CartContext";

const SIZES = [
  { label: "Small", short: "S", priceAdj: -20 },
  { label: "Regular", short: "M", priceAdj: 0 },
  { label: "Large", short: "L", priceAdj: 30 },
];

const MILKS = ["Whole Milk", "Oat Milk", "Almond Milk", "Soy Milk", "Coconut Milk", "Skimmed"];
const SUGARS = ["No Sugar", "½ tsp", "1 tsp", "2 tsp", "Honey", "Stevia"];
const EXTRAS = [
  { label: "Extra Shot", price: 40 },
  { label: "Vanilla Syrup", price: 30 },
  { label: "Caramel Drizzle", price: 25 },
  { label: "Whipped Cream", price: 30 },
  { label: "Cinnamon Dust", price: 15 },
  { label: "Chocolate Chips", price: 25 },
];

export default function CoffeeCustomizerModal({ coffee, onClose }) {
  const { addToCart } = useCart();
  const [size, setSize] = useState("Regular");
  const [milk, setMilk] = useState("Whole Milk");
  const [sugar, setSugar] = useState("1 tsp");
  const [shots, setShots] = useState(1);
  const [extras, setExtras] = useState([]);
  const [added, setAdded] = useState(false);

  const toggleExtra = (label) =>
    setExtras((prev) =>
      prev.includes(label) ? prev.filter((e) => e !== label) : [...prev, label]
    );

  const sizeAdj = SIZES.find((s) => s.label === size)?.priceAdj ?? 0;
  const extrasTotal = extras.reduce((sum, label) => {
    const found = EXTRAS.find((e) => e.label === label);
    return sum + (found?.price ?? 0);
  }, 0);
  const shotAdj = (shots - 1) * 40;
  const finalPrice = coffee.price + sizeAdj + extrasTotal + shotAdj;

  const handleAddToCart = () => {
    const customization = { size, milk, sugar, shots, extras };
    addToCart({ ...coffee, price: finalPrice }, customization);
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
          className="modal"
          initial={{ opacity: 0, y: 60, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 40, scale: 0.96 }}
          transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="modal__header">
            <img src={coffee.image} alt={coffee.name} className="modal__img" />
            <div className="modal__header-text">
              <span className="modal__category">{coffee.category}</span>
              <h2 className="modal__title">{coffee.name}</h2>
              <p className="modal__desc">{coffee.description}</p>
            </div>
            <button className="modal__close" onClick={onClose}>✕</button>
          </div>

          <div className="modal__body">
            {/* Size */}
            <div className="modal__section">
              <h3 className="modal__section-title">Size</h3>
              <div className="modal__pills">
                {SIZES.map((s) => (
                  <button
                    key={s.label}
                    className={`pill ${size === s.label ? "pill--active" : ""}`}
                    onClick={() => setSize(s.label)}
                  >
                    {s.label}
                    {s.priceAdj !== 0 && (
                      <span className="pill__adj">
                        {s.priceAdj > 0 ? `+₹${s.priceAdj}` : `-₹${Math.abs(s.priceAdj)}`}
                      </span>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Espresso Shots */}
            <div className="modal__section">
              <h3 className="modal__section-title">Espresso Shots</h3>
              <div className="modal__stepper">
                <button
                  className="stepper-btn"
                  onClick={() => setShots((s) => Math.max(1, s - 1))}
                  disabled={shots <= 1}
                >−</button>
                <span className="stepper-val">{shots}</span>
                <button
                  className="stepper-btn"
                  onClick={() => setShots((s) => Math.min(4, s + 1))}
                  disabled={shots >= 4}
                >+</button>
                {shots > 1 && <span className="stepper-note">+₹{(shots - 1) * 40} for extra shots</span>}
              </div>
            </div>

            {/* Milk */}
            <div className="modal__section">
              <h3 className="modal__section-title">Milk Choice</h3>
              <div className="modal__pills modal__pills--wrap">
                {MILKS.map((m) => (
                  <button
                    key={m}
                    className={`pill ${milk === m ? "pill--active" : ""}`}
                    onClick={() => setMilk(m)}
                  >
                    {m}
                  </button>
                ))}
              </div>
            </div>

            {/* Sugar */}
            <div className="modal__section">
              <h3 className="modal__section-title">Sweetness</h3>
              <div className="modal__pills modal__pills--wrap">
                {SUGARS.map((s) => (
                  <button
                    key={s}
                    className={`pill ${sugar === s ? "pill--active" : ""}`}
                    onClick={() => setSugar(s)}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            {/* Extras */}
            <div className="modal__section">
              <h3 className="modal__section-title">Add-ons</h3>
              <div className="modal__pills modal__pills--wrap">
                {EXTRAS.map((ex) => (
                  <button
                    key={ex.label}
                    className={`pill pill--extra ${extras.includes(ex.label) ? "pill--active" : ""}`}
                    onClick={() => toggleExtra(ex.label)}
                  >
                    {ex.label}
                    <span className="pill__adj">+₹{ex.price}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="modal__footer">
            <div className="modal__price-block">
              <span className="modal__price-label">Total</span>
              <span className="modal__price">₹{finalPrice}</span>
            </div>
            <button
              className={`btn btn--primary modal__cta ${added ? "modal__cta--added" : ""}`}
              onClick={handleAddToCart}
            >
              {added ? "✓ Added to Cart!" : "Add to Cart"}
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}