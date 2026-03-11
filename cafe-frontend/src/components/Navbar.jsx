import { Link, useLocation, useNavigate } from "react-router-dom"
import { useCart } from "../context/CartContext"
import { useState, useEffect } from "react"

function Navbar() {
  const { count } = useCart()
  const location = useLocation()
  const navigate = useNavigate()
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  // Read user from localStorage
  const user = JSON.parse(localStorage.getItem("user") || "null")

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 60)
    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  useEffect(() => { setMenuOpen(false) }, [location])

  const isHome = location.pathname === "/"

  function handleLogout() {
    localStorage.removeItem("token")
    localStorage.removeItem("user")
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