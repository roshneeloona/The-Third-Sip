import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { apiRequest, clearAdminAuth, getAdminUser } from "../utils/api";

export default function AdminNavbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const adminUser = getAdminUser();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setMenuOpen(false);
  }, [location]);

  const isLanding = location.pathname === "/";

  async function handleLogout() {
    try {
      await apiRequest("/api/auth/logout", { method: "POST" });
    } catch (error) {
      // Local cleanup still keeps the admin side safe.
    }

    clearAdminAuth();
    navigate("/login");
  }

  return (
    <nav className={`navbar ${scrolled || !isLanding ? "navbar--solid" : ""}`}>
      <div className="navbar__brand" onClick={() => navigate("/")} style={{ cursor: "pointer" }}>
        The Third Sip
      </div>

      <button
        className="navbar__hamburger"
        onClick={() => setMenuOpen((open) => !open)}
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
          onClick={() => navigate(adminUser ? "/admin/dashboard" : "/login")}
          className={`navbar__link ${location.pathname.startsWith("/admin") ? "navbar__link--active" : ""}`}
          style={{ cursor: "pointer" }}
        >
          {adminUser ? "Dashboard" : "Admin Login"}
        </span>
        {adminUser && (
          <span className="navbar__role-badge navbar__role-badge--admin">Admin</span>
        )}
        {adminUser ? (
          <span className="navbar__link" onClick={handleLogout} style={{ color: "var(--caramel)", cursor: "pointer" }}>
            Logout
          </span>
        ) : (
          <span className="navbar__link" style={{ color: "var(--caramel)", cursor: "default" }}>
            Admin
          </span>
        )}
      </div>
    </nav>
  );
}
