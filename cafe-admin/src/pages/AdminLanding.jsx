import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

export default function AdminLanding() {
  const navigate  = useNavigate();
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const onScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const bgY        = scrollY * 0.18;
  const heroOpacity = Math.max(1 - scrollY / 380, 0);
  const contentY    = scrollY * 0.12;

  return (
    <div className="admin-landing">

      {/* ── Hero ── */}
      <section className="hero">
        <div className="hero__bg" style={{ transform: `translateY(${bgY}px)` }} />
        <div className="hero__grain" />
        <div className="hero__vignette" />

        <div
          className="hero__content"
          style={{ opacity: heroOpacity, transform: `translateY(${contentY}px)` }}
        >
          <motion.p
            className="hero__eyebrow"
            initial={{ opacity: 0, letterSpacing: "0.12em" }}
            animate={{ opacity: 1, letterSpacing: "0.44em" }}
            transition={{ duration: 1.5, delay: 0.4, ease: "easeOut" }}
          >
            EST. 2026 · ADMIN PANEL
          </motion.p>

          <motion.h1
            className="hero__title"
            initial={{ opacity: 0, y: 36 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
          >
            <span className="hero__title-line">The Third</span>
            <span className="hero__title-line hero__title-line--accent">Sip</span>
          </motion.h1>

          <motion.p
            className="hero__sub"
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
          >
            Manage your café — stock, orders & menu, all in one place.
          </motion.p>

          <motion.div
            className="hero__actions"
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.75, ease: [0.22, 1, 0.36, 1] }}
          >
            <button
              className="btn btn--primary"
              onClick={() => navigate("/admin/dashboard")}
            >
              Enter Dashboard →
            </button>
          </motion.div>
        </div>

        {/* scroll indicator
        <div className="hero__scroll-indicator">
          <motion.div
            className="hero__scroll-line"
            initial={{ scaleY: 0 }}
            animate={{ scaleY: 1 }}
            transition={{ duration: 1.3, delay: 1.1 }}
          />
          {/* <span className="hero__scroll-text">Scroll</span> */}
        {/* </div> */} 
      </section>

      {/* ── Marquee ── */}
      <div className="marquee-strip">
        <div className="marquee-track">
          {[
            "Stock Control","Order Tracking","Menu Management","Expiry Alerts","Sales Overview","Admin Access",
            "Stock Control","Order Tracking","Menu Management","Expiry Alerts","Sales Overview","Admin Access",
          ].map((t, i) => (
            <span key={i}>{t} <span className="marquee-dot">✦</span> </span>
          ))}
        </div>
      </div>

      {/* ── Quick stats preview ── */}
      <section className="admin-landing__preview">
        <motion.div
          className="admin-landing__preview-header"
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.65 }}
        >
          <p className="section-eyebrow">What's Inside</p>
          <h2 className="section-title">Everything you need to <em>run</em> the café.</h2>
        </motion.div>

        <div className="admin-landing__cards">
          {[
            { icon: "◈", title: "Dashboard",  desc: "Live revenue, today's orders, low stock alerts and top sellers at a glance." },
            { icon: "◉", title: "Orders",     desc: "Track every order in real time — pending, preparing, delivered or cancelled." },
            { icon: "▣", title: "Inventory",  desc: "Monitor stock levels, expiry dates and get alerts before anything runs out." },
            { icon: "◧", title: "Menu",       desc: "Toggle items on or off and track how well each item is selling." },
          ].map((card, i) => (
            <motion.div
              key={card.title}
              className="admin-landing__card"
              initial={{ opacity: 0, y: 36 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.55, delay: i * 0.1 }}
            >
              <span className="admin-landing__card-icon">{card.icon}</span>
              <h3 className="admin-landing__card-title">{card.title}</h3>
              <p className="admin-landing__card-desc">{card.desc}</p>
            </motion.div>
          ))}
        </div>

        <motion.div
          className="admin-landing__cta"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <button className="btn btn--primary" onClick={() => navigate("/admin/dashboard")}>
            Go to Dashboard →
          </button>
        </motion.div>
      </section>

      {/* ── Footer ── */}
      <footer className="footer">
        <div className="footer__top">
          <div className="footer__brand">The Third Sip</div>
          <nav className="footer__nav">
            <span>Admin Panel</span>
          </nav>
        </div>
        <div className="footer__bottom">
          <p>© 2026 The Third Sip. Admin access only.</p>
        </div>
      </footer>

    </div>
  );
}