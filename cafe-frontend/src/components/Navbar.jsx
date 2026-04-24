import { Link, useLocation, useNavigate } from "react-router-dom"
import { useCart } from "../context/CartContext"
import { useEffect, useState } from "react"
import { apiRequest, clearAuth, getStoredUser } from "../utils/api"

function Navbar() {
  const { count } = useCart()
  const location = useLocation()
  const navigate = useNavigate()
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const user = getStoredUser()

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 60)
    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  useEffect(() => {
    setMenuOpen(false)
  }, [location])

  const isHome = location.pathname === "/"

  async function handleLogout() {
    try {
      await apiRequest("/api/auth/logout", { method: "POST" })
    } catch (error) {
      // Local logout still lets the user recover if the server call fails.
    }

    clearAuth()
    navigate("/")
    window.location.reload()
  }

  return (
    <nav className={`navbar ${scrolled || !isHome ? "navbar--solid" : ""}`}>
      <Link to="/" className="navbar__brand">The Third Sip</Link>

      <button className="navbar__hamburger" onClick={() => setMenuOpen(v => !v)}>
        <span /><span /><span />
      </button>

      <div className={`navbar__links ${menuOpen ? "navbar__links--open" : ""}`}>
        <Link to="/" className={`navbar__link ${location.pathname === "/" ? "navbar__link--active" : ""}`}>Home</Link>
        <Link to="/menu" className={`navbar__link ${location.pathname === "/menu" ? "navbar__link--active" : ""}`}>Menu</Link>
        <Link to="/cart" className={`navbar__link navbar__link--cart ${location.pathname === "/cart" ? "navbar__link--active" : ""}`}>
          Cart {count > 0 && <span className="navbar__badge">{count}</span>}
        </Link>
        {user ? (
          <Link to="/orders" className={`navbar__link ${location.pathname === "/orders" ? "navbar__link--active" : ""}`}>
            Track Orders
          </Link>
        ) : null}

        {user ? (
          <>
            <span className="navbar__user-name">Hi, {user.name.split(" ")[0]}</span>
            <button className="navbar__logout" onClick={handleLogout}>Logout</button>
          </>
        ) : (
          <Link to="/login" className="navbar__signin">Sign In</Link>
        )}
      </div>
    </nav>
  )
}

export default Navbar
