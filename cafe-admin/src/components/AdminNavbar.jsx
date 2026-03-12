import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

export default function AdminNavbar() {
  const [scrolled,  setScrolled]  = useState(false);
  const [menuOpen,  setMenuOpen]  = useState(false);
  const location  = useLocation();
  const navigate  = useNavigate();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => { setMenuOpen(false); }, [location]);

  const isLanding = location.pathname === "/";

  return (
    <nav className={`navbar ${scrolled || !isLanding ? "navbar--solid" : ""}`}>
      <div className="navbar__brand" onClick={() => navigate("/")} style={{ cursor: "pointer" }}>
        The Third Sip
      </div>

      <button
        className="navbar__hamburger"
        onClick={() => setMenuOpen(v => !v)}
        aria-label="Toggle menu"
      >
        <span></span><span></span><span></span>
      </button>

      <div className={`navbar__links ${menuOpen ? "navbar__links--open" : ""}`}>
        <span
          onClick={() => navigate("/")}
          className={`navbar__link ${isLanding ? "navbar__link--active" : ""}`}
          style={{ cursor: "pointer" }}
        >
          Home
        </span>
        <span
          onClick={() => navigate("/admin/dashboard")}
          className={`navbar__link ${location.pathname.startsWith("/admin") ? "navbar__link--active" : ""}`}
          style={{ cursor: "pointer" }}
        >
          Dashboard
        </span>
        {/* badge shows pending orders count */}
        <span className="navbar__link" style={{ color: "var(--caramel)", cursor: "default" }}>
          Admin ⚙
        </span>
      </div>
    </nav>
  );
}