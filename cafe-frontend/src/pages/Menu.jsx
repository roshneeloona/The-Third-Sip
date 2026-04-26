import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useNavigate } from "react-router-dom"
import CoffeeCard from "../components/CoffeeCard"
import { menuItems, categories } from "../data/coffeeData"
import { fetchMenuItems, getStoredUser } from "../utils/api"

function Menu() {
  const [items, setItems] = useState(menuItems)
  const [activeCategory, setActiveCategory] = useState("All")
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    let ignore = false

    async function loadMenu() {
      try {
        const apiItems = await fetchMenuItems()
        if (!ignore && apiItems.length > 0) {
          setItems(apiItems)
        }
      } catch (error) {
        // The local dataset remains available if the API is offline.
      } finally {
        if (!ignore) {
          setLoading(false)
        }
      }
    }

    loadMenu()
    return () => {
      ignore = true
    }
  }, [])

  const filtered = activeCategory === "All"
    ? items
    : items.filter(item => item.category === activeCategory)

  function onAddToCart() {
    const user = getStoredUser()
    if (!user) {
      navigate("/login")
      return false
    }
    return true
  }

  return (
    <div className="menu-page">
      <div className="menu-page__hero">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className="menu-page__title">A Curated Menu of Sips and Bites.</h1>
          <p className="menu-page__sub">Signature pours, chilled favourites, and fresh bites prepared with a quiet attention to detail.</p>
        </motion.div>
      </div>

      <div className="menu-page__filters">
        {categories.map(cat => (
          <button
            key={cat}
            className={`filter-btn ${activeCategory === cat ? "filter-btn--active" : ""}`}
            onClick={() => setActiveCategory(cat)}
          >
            {cat === "Hot Beverages" && <span className="filter-btn__mark filter-btn__mark--hot" />}
            {cat === "Cold Beverages" && <span className="filter-btn__mark filter-btn__mark--cold" />}
            {cat === "Food" && <span className="filter-btn__mark filter-btn__mark--food" />}
            {cat}
          </button>
        ))}
      </div>

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

      {!loading && filtered.length === 0 && (
        <p className="menu-page__sub" style={{ textAlign: "center" }}>
          No items are available in this category right now.
        </p>
      )}
    </div>
  )
}

export default Menu
