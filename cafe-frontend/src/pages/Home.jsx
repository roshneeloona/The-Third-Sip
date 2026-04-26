import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { coffees } from "../data/coffeeData";
import CoffeeCard from "../components/CoffeeCard";
import { fetchMenuItems, getStoredUser } from "../utils/api";

function Home() {
  const navigate = useNavigate();
  const [featured, setFeatured] = useState(() => coffees.slice(0, 3));
  const heroBgRef = useRef(null);
  const heroContentRef = useRef(null);
  const heroTitleRef = useRef(null);
  const customerUser = getStoredUser();

  useEffect(() => {
    let rafId = 0;
    let heroActive = true;

    function updateHero() {
      rafId = 0;

      const scroll = window.scrollY || document.documentElement.scrollTop || 0;
      const heroLimit = Math.max(window.innerHeight, 640) + 180;
      const activeScroll = Math.min(scroll, heroLimit);
      const progress = Math.min(activeScroll / 650, 1);
      const heroOpacity = Math.max(1 - activeScroll / 380, 0);
      const titleScale = 1 + progress * 0.32;
      const contentY = activeScroll * 0.12;
      const bgY = activeScroll * 0.18;
      heroActive = scroll <= heroLimit;

      if (heroBgRef.current) {
        heroBgRef.current.style.transform = `translate3d(0, ${bgY}px, 0)`;
      }

      if (heroContentRef.current) {
        heroContentRef.current.style.opacity = String(heroOpacity);
        heroContentRef.current.style.transform = `translate3d(0, ${contentY}px, 0)`;
      }

      if (heroTitleRef.current) {
        heroTitleRef.current.style.transform = `scale(${titleScale})`;
      }
    }

    function scheduleHeroUpdate() {
      if ((heroActive || window.scrollY < window.innerHeight + 180) && !rafId) {
        rafId = requestAnimationFrame(updateHero);
      }
    }

    scheduleHeroUpdate();
    window.addEventListener("scroll", scheduleHeroUpdate, { passive: true });
    window.addEventListener("resize", scheduleHeroUpdate);

    return () => {
      if (rafId) {
        cancelAnimationFrame(rafId);
      }
      window.removeEventListener("scroll", scheduleHeroUpdate);
      window.removeEventListener("resize", scheduleHeroUpdate);
    };
  }, []);

  useEffect(() => {
    let ignore = false;

    async function loadFeatured() {
      try {
        const liveItems = await fetchMenuItems("limit=3");
        if (!ignore && liveItems.length > 0) {
          setFeatured(liveItems);
        }
      } catch (error) {
        // Static featured items remain available if the API is offline.
      }
    }

    loadFeatured();
    return () => {
      ignore = true;
    };
  }, []);

  function onAddToCart() {
    const currentUser = getStoredUser();
    if (!currentUser) {
      navigate("/login");
      return false;
    }
    return true;
  }

  return (
    <div className="home">
      <section className="hero">
        <div className="hero__bg" ref={heroBgRef} />
        <div className="hero__grain" />
        <div className="hero__vignette" />

        <div className="hero__content" ref={heroContentRef}>
          <motion.p
            className="hero__eyebrow"
            initial={{ opacity: 0, letterSpacing: "0.12em" }}
            animate={{ opacity: 1, letterSpacing: "0.44em" }}
            transition={{ duration: 1.5, delay: 0.4, ease: "easeOut" }}
          >
            EST. 2026 · ARTISAN ROASTERY
          </motion.p>

          <motion.h1
            className="hero__title"
            ref={heroTitleRef}
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

        {/* <div className="hero__scroll-indicator">
          <motion.div
            className="hero__scroll-line"
            initial={{ scaleY: 0 }}
            animate={{ scaleY: 1 }}
            transition={{ duration: 1.3, delay: 1.1 }}
          />
         
        </div> */}
      </section>

      <div className="marquee-strip">
        <div className="marquee-track">
          {[
            "Single Origin", "Slow Roasted", "Ethically Sourced", "Fresh Daily", "Artisan Blends", "Small Batch",
            "Single Origin", "Slow Roasted", "Ethically Sourced", "Fresh Daily", "Artisan Blends", "Small Batch",
          ].map((entry, index) => (
            <span key={index}>{entry} <span className="marquee-dot">✦</span> </span>
          ))}
        </div>
      </div>

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
              sustainable growing. Back home, our head roaster coaxes out every note - the
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
          ].map((stat, index) => (
            <motion.div
              key={index}
              className="stat-card"
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.55, delay: index * 0.1 }}
            >
              <span className="stat-card__num">{stat.num}</span>
              <span className="stat-card__label">{stat.label}</span>
            </motion.div>
          ))}
        </div>
      </section>

      <section className="access-guide">
        <motion.div
          className="access-guide__header"
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.35 }}
          transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
        >
          <p className="section-eyebrow">Why Guests Return</p>
          <h2 className="section-title">Built for slow mornings and easy ordering.</h2>
          <p className="access-guide__sub">
            Thoughtful coffee, a calm atmosphere, and a menu that feels easy to explore from the first click to the final sip.
          </p>
        </motion.div>

        <div className="access-guide__grid">
          <motion.div
            className="access-card"
            initial={{ opacity: 0, y: 34 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.25 }}
            transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
          >
            <span className="access-card__tag">Freshly Made</span>
            <h3>Small-batch coffee with a menu that stays simple and focused.</h3>
            <p>
              From signature espresso drinks to baked favourites, everything is designed to feel warm, quick, and easy to choose.
            </p>
            <div className="access-card__actions">
              <Link to="/menu" className="btn btn--primary">Browse Menu</Link>
              {customerUser ? (
                <Link to="/cart" className="btn btn--outline">Open Cart</Link>
              ) : (
                <Link to="/login" className="btn btn--outline">Sign In</Link>
              )}
            </div>
          </motion.div>

          <motion.div
            className="access-card access-card--admin"
            initial={{ opacity: 0, y: 34 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.25 }}
            transition={{ duration: 0.65, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
          >
            <span className="access-card__tag">Easy Ordering</span>
            <h3>Pick your drink, customise it, and place your order in a few clicks.</h3>
            <p>
              The ordering flow now connects directly with inventory, order tracking, and receipt generation behind the scenes.
            </p>
            <div className="access-card__actions">
              <Link to="/cart" className="btn btn--primary">Open Cart</Link>
              {customerUser ? (
                <Link to="/menu" className="btn btn--outline">Order More</Link>
              ) : (
                <Link to="/signup" className="btn btn--outline">Create Account</Link>
              )}
            </div>
          </motion.div>
        </div>
      </section>

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
          {featured.map((coffee, index) => (
            <motion.div
              key={coffee.id}
              initial={{ opacity: 0, y: 36 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.55, delay: index * 0.1 }}
            >
              <CoffeeCard coffee={coffee} onAddToCart={onAddToCart} />
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
          <Link to="/menu" className="btn btn--primary">View Full Menu {"->"}</Link>
        </motion.div>
      </section>

      <section className="experience">
        <div className="experience__img-col">
          <motion.img
            src="https://images.unsplash.com/photo-1445116572660-236099ec97a0?w=900&auto=format&fit=crop&q=80"
            alt="Cafe interior"
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
            The Third Sip is more than a cafe - it's a sanctuary. Warm wood, soft
            light, the quiet hiss of an espresso machine. Designed for those who linger.
          </p>
          <Link to="/menu" className="btn btn--outline">Browse Menu</Link>
        </motion.div>
      </section>

      <footer className="footer">
        <div className="footer__inner">
          <div className="footer__brand-block">
            <Link to="/" className="footer__brand">The Third Sip</Link>
            <p>
              Small-batch coffee with fresh cafe bites and a slower kind of everyday ritual.
            </p>
            <div className="footer__socials" aria-label="Social links">
              <a href="https://instagram.com" target="_blank" rel="noreferrer">Instagram</a>
              <a href="https://facebook.com" target="_blank" rel="noreferrer">Facebook</a>
            </div>
          </div>

          <div className="footer__cols">
            <div className="footer__col">
              <h3>Explore</h3>
              <Link to="/">Home</Link>
              <Link to="/menu">Menu</Link>
              <Link to="/cart">Cart</Link>
              {customerUser ? <Link to="/orders">Track Orders</Link> : <Link to="/login">Sign In</Link>}
            </div>

            <div className="footer__col">
              <h3>Visit</h3>
              <p>Open daily</p>
              <p>8:00 AM - 10:00 PM</p>
              <p>Fresh brews served all day</p>
            </div>

            <div className="footer__col footer__col--support">
              <h3>Support</h3>
              <Link to="/privacy">Privacy</Link>
              <Link to="/faq">FAQ</Link>
              <Link to="/contact">Help & Advice</Link>
              {customerUser ? <Link to="/orders">Track an Order</Link> : <Link to="/login">Order Help</Link>}
            </div>
          </div>
        </div>

        <div className="footer__bottom">
          <p>&copy; 2026 The Third Sip. Crafted with care and caffeine.</p>
          <p>Open daily 8:00 AM - 10:00 PM</p>
        </div>
      </footer>
    </div>
  );
}

export default Home;
