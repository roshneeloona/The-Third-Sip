import { useEffect, useRef } from "react";
import Lenis from "@studio-freight/lenis";
import { useLocation } from "react-router-dom";

export default function SmoothScroll() {
  const location = useLocation();
  const lenisRef = useRef(null);

  useEffect(() => {
    const lenis = new Lenis({
      lerp: 0.06,
      smoothWheel: true,
      wheelMultiplier: 0.82,
      touchMultiplier: 1,
    });

    lenisRef.current = lenis;

    let rafId;
    function raf(time) {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    }

    rafId = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(rafId);
      lenis.destroy();
      lenisRef.current = null;
    };
  }, []);

  useEffect(() => {
    function handleHashLink(event) {
      const link = event.target.closest?.("a[href^='#']");
      const hash = link?.getAttribute("href");

      if (!hash || hash === "#") {
        return;
      }

      const target = document.querySelector(hash);
      if (!target) {
        return;
      }

      event.preventDefault();
      lenisRef.current?.scrollTo(target, { offset: -72 });
    }

    document.addEventListener("click", handleHashLink);

    return () => {
      document.removeEventListener("click", handleHashLink);
    };
  }, []);

  useEffect(() => {
    lenisRef.current?.scrollTo(0, { immediate: true });
  }, [location.pathname]);

  return null;
}
