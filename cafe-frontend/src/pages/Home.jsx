import { useEffect, useRef, useState } from "react";
import Lenis from "@studio-freight/lenis";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { coffees } from "../data/coffeeData";
import CoffeeCard from "../components/CoffeeCard";

function Home() {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const lenis = new Lenis({
      lerp: 0.09,        
      smoothWheel: true,
      wheelMultiplier: 0.95,
      touchMultiplier: 1.4,
    });

    lenis.on("scroll", ({ scroll }) => {
      setScrollY(scroll);
    });

    let rafId;
    function raf(time) {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    }
    rafId = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(rafId);
      lenis.destroy();
    };
  }, []);

  const progress     = Math.min(scrollY / 650, 1);
  const heroOpacity  = Math.max(1 - scrollY / 380, 0);
  const titleScale   = 1 + progress * 0.32;          
  const contentY     = scrollY * 0.12;                
  const bgY          = scrollY * 0.18;                

  const featured = coffees.slice(0, 3);

  return (
    <div className="home">

      {/* ═══ HERO ═══ */}
      <section className="hero">

        {/* Parallax background — clipped inside .hero (overflow:hidden) */}
        <div
          className="hero__bg"
          style={{ transform: `translateY(${bgY}px)` }}
        />
        <div className="hero__grain" />
        <div className="hero__vignette" />

        {/* Hero content fades + drifts up as user scrolls */}
        <div
          className="hero__content"
          style={{
            opacity: heroOpacity,
            transform: `translateY(${contentY}px)`,
          }}
        >
          <motion.p
            className="hero__eyebrow"
            initial={{ opacity: 0, letterSpacing: "0.12em" }}
            animate={{ opacity: 1, letterSpacing: "0.44em" }}
            transition={{ duration: 1.5, delay: 0.4, ease: "easeOut" }}
          >
            EST. 2026 · ARTISAN ROASTERY
          </motion.p>

          {/* Title zooms — contained inside hero which has overflow:hidden */}
          <motion.h1
            className="hero__title"
            style={{ transform: `scale(${titleScale})` }}
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
            Where every cup tells a story.
          </motion.p>

          <motion.div
            className="hero__actions"
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.75, ease: [0.22, 1, 0.36, 1] }}
          >
            <Link to="/menu" className="btn btn--primary">Explore Menu</Link>
            <a href="#story" className="btn btn--ghost">Our Story ↓</a>
          </motion.div>
        </div>

        <div className="hero__scroll-indicator">
          <motion.div
            className="hero__scroll-line"
            initial={{ scaleY: 0 }}
            animate={{ scaleY: 1 }}
            transition={{ duration: 1.3, delay: 1.1 }}
          />
          <span className="hero__scroll-text">Scroll</span>
        </div>
      </section>

      {/* ═══ MARQUEE ═══ */}
      <div className="marquee-strip">
        <div className="marquee-track">
          {[
            "Single Origin","Slow Roasted","Ethically Sourced","Fresh Daily","Artisan Blends","Small Batch",
            "Single Origin","Slow Roasted","Ethically Sourced","Fresh Daily","Artisan Blends","Small Batch",
          ].map((t, i) => (
            <span key={i}>{t} <span className="marquee-dot">✦</span> </span>
          ))}
        </div>
      </div>

      {/* ═══ STORY ═══ */}
      <section id="story" className="story">
        <div className="story__inner">
          <motion.div
            className="story__text-block"
            initial={{ opacity: 0, x: -36 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
          >
            <p className="section-eyebrow">Our Philosophy</p>
            <h2 className="section-title">Coffee is a <em>craft,</em><br />not a commodity.</h2>
          </motion.div>
          <motion.div
            className="story__body"
            initial={{ opacity: 0, x: 36 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.75, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
          >
            <p>
              We travel the world sourcing single-origin beans from small farms that practice
              sustainable growing. Back home, our head roaster coaxes out every note — the
              bright citrus of a Kenyan AA, the dark chocolate depth of a Sumatran Mandheling.
            </p>
            <p>Every cup you hold has a story. We think you deserve to know it.</p>
          </motion.div>
        </div>

        <div className="story__stats">
          {[
            { num: "12+", label: "Origins Sourced" },
            { num: "50k", label: "Cups Served" },
            { num: "4.9★", label: "Avg. Rating" },
          ].map((s, i) => (
            <motion.div
              key={i}
              className="stat-card"
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.55, delay: i * 0.1 }}
            >
              <span className="stat-card__num">{s.num}</span>
              <span className="stat-card__label">{s.label}</span>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ═══ FEATURED ═══ */}
      <section className="featured">
        <motion.div
          className="featured__header"
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.65 }}
        >
          <p className="section-eyebrow">Hand-Picked</p>
          <h2 className="section-title">Featured Cups</h2>
        </motion.div>

        <div className="coffee-grid">
          {featured.map((coffee, i) => (
            <motion.div
              key={coffee.id}
              initial={{ opacity: 0, y: 36 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.55, delay: i * 0.1 }}
            >
              <CoffeeCard coffee={coffee} />
            </motion.div>
          ))}
        </div>

        <motion.div
          className="featured__cta"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.25 }}
        >
          <Link to="/menu" className="btn btn--primary">View Full Menu →</Link>
        </motion.div>
      </section>

      {/* ═══ EXPERIENCE ═══ */}
      <section className="experience">
        <div className="experience__img-col">
          <motion.img
            src="https://images.unsplash.com/photo-1445116572660-236099ec97a0?w=900&auto=format&fit=crop&q=80"
            alt="Café interior"
            initial={{ opacity: 0, scale: 0.97 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          />
          <motion.img
            src="https://images.unsplash.com/photo-1442512595331-e89e73853f31?w=700&auto=format&fit=crop&q=80"
            alt="Barista crafting"
            className="experience__img-secondary"
            initial={{ opacity: 0, y: 36 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.9, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
          />
        </div>
        <motion.div
          className="experience__text-col"
          initial={{ opacity: 0, x: 36 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        >
          <p className="section-eyebrow">The Space</p>
          <h2 className="section-title">Come in.<br />Stay a while.</h2>
          <p>
            The Third Sip is more than a café — it's a sanctuary. Warm wood, soft
            light, the quiet hiss of an espresso machine. Designed for those who linger.
          </p>
          <Link to="/menu" className="btn btn--outline">Browse Menu</Link>
        </motion.div>
      </section>

      {/* ═══ FOOTER ═══ */}
      <footer className="footer">
        <div className="footer__top">
          <div className="footer__brand">The Third Sip</div>
          <nav className="footer__nav">
            <Link to="/">Home</Link>
            <Link to="/menu">Menu</Link>
            <Link to="/cart">Cart</Link>
          </nav>
        </div>
        <div className="footer__bottom">
          <p>© 2026 The Third Sip. Crafted with love & caffeine.</p>
        </div>
      </footer>
    </div>
  );
}

export default Home;