import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useNavigate } from "react-router-dom"
import CoffeeCard from "../components/CoffeeCard"
import { menuItems, categories } from "../data/coffeeData"

function Menu() {
  const [activeCategory, setActiveCategory] = useState("All")
  const navigate = useNavigate()

  const filtered = activeCategory === "All"
    ? menuItems
    : menuItems.filter(item => item.category === activeCategory)

  // This gets passed down to CoffeeCard so the modal knows to redirect if not logged in
  function onAddToCart() {
    const user = localStorage.getItem("user")
    if (!user) {
      navigate("/login")
      return false // not logged in
    }
    return true // logged in, proceed
  }

  return (
    <div className="menu-page">
      <div className="menu-page__hero">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <p className="section-eyebrow" style={{ color: "#c69c6d" }}>Our Selection</p>
          <h1 className="menu-page__title">The Menu</h1>
          <p className="menu-page__sub">Click any drink to customise your perfect cup.</p>
        </motion.div>
      </div>

      {/* Category filters */}
      <div className="menu-page__filters">
        {categories.map(cat => (
          <button
            key={cat}
            className={`filter-btn ${activeCategory === cat ? "filter-btn--active" : ""}`}
            onClick={() => setActiveCategory(cat)}
          >
            {cat === "Coffee" && "☕ "}
            {cat === "Tea" && "🍵 "}
            {cat === "Mojito" && "🍹 "}
            {cat === "Smoothie" && "🥤 "}
            {cat}
          </button>
        ))}
      </div>

      {/* Grid */}
      <div className="menu-page__grid">
        <AnimatePresence mode="popLayout">
          {filtered.map((item, i) => (
            <motion.div
              key={item.id}
              layout
              initial={{ opacity: 0, y: 28 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.92 }}
              transition={{ duration: 0.35, delay: i * 0.04 }}
            >
              <CoffeeCard coffee={item} onAddToCart={onAddToCart} />
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  )
}

export default Menu