import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import CoffeeCard from "../components/CoffeeCard";
import { coffees, categories } from "../data/coffeeData";

function Menu() {
  const [activeCategory, setActiveCategory] = useState("All");

  const filtered =
    activeCategory === "All" ? coffees : coffees.filter((c) => c.category === activeCategory);

  return (
    <div className="menu-page">
      <div className="menu-page__hero">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        >
          <p className="section-eyebrow" style={{ color: "#c69c6d" }}>Our Selection</p>
          <h1 className="menu-page__title">The Menu</h1>
          <p className="menu-page__sub">
            Click any coffee to customise your perfect cup.
          </p>
        </motion.div>
      </div>

      <div className="menu-page__filters">
        {categories.map((cat) => (
          <button
            key={cat}
            className={`filter-btn ${activeCategory === cat ? "filter-btn--active" : ""}`}
            onClick={() => setActiveCategory(cat)}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="menu-page__grid">
        <AnimatePresence mode="popLayout">
          {filtered.map((coffee, i) => (
            <motion.div
              key={coffee.id}
              layout
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.92 }}
              transition={{ duration: 0.38, delay: i * 0.04 }}
            >
              <CoffeeCard coffee={coffee} />
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}

export default Menu;