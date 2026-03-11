import { useState } from "react";
import { motion } from "framer-motion";
import CoffeeCustomizerModal from "./CoffeeCustomizerModal";

function CoffeeCard({ coffee }) {
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <>
      <motion.div
        className="coffee-card"
        whileHover={{ y: -8 }}
        transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
        onClick={() => setModalOpen(true)}
        style={{ cursor: "pointer" }}
      >
        <div className="coffee-card__img-wrap">
          <img src={coffee.image} alt={coffee.name} className="coffee-card__img" />
          <span className="coffee-card__category">{coffee.category}</span>
        </div>
        <div className="coffee-card__body">
          <h3 className="coffee-card__name">{coffee.name}</h3>
          <p className="coffee-card__desc">{coffee.description}</p>
          <div className="coffee-card__footer">
            <span className="coffee-card__price">₹{coffee.price}</span>
            <span className="coffee-card__cta-hint">Customize →</span>
          </div>
        </div>
      </motion.div>

      {modalOpen && (
        <CoffeeCustomizerModal coffee={coffee} onClose={() => setModalOpen(false)} />
      )}
    </>
  );
}

export default CoffeeCard;