"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

/**
 * Adds `.in` to every `[data-r]` element as it scrolls into view, and drives two scroll-linked
 * CSS variables: `--p` (0→1 over the first viewport, on `[data-scroll-progress]`) and `--y`
 * (parallax offset, on `img[data-parallax]`).
 */
export function ScrollRevealObserver() {
  const pathname = usePathname();

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const targets = Array.from(document.querySelectorAll<HTMLElement>("[data-r]:not(.in)"));
    const observer = new IntersectionObserver(
      (entries) => entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("in");
        observer.unobserve(entry.target);
      }),
      { threshold: 0.18, rootMargin: "0px 0px -8% 0px" },
    );
    targets.forEach((el) => observer.observe(el));

    const progressRoots = Array.from(document.querySelectorAll<HTMLElement>("[data-scroll-progress]"));
    const parallax = Array.from(document.querySelectorAll<HTMLElement>("img[data-parallax]"));
    function onScroll() {
      // Anything scrolled past too fast for the observer (anchor jumps) is revealed anyway.
      targets.forEach((el) => {
        if (!el.classList.contains("in") && el.getBoundingClientRect().bottom < window.innerHeight * 0.9) el.classList.add("in");
      });
      if (reduce) return;
      const p = Math.min(1, Math.max(0, window.scrollY / (window.innerHeight * 0.9)));
      progressRoots.forEach((el) => el.style.setProperty("--p", p.toFixed(4)));
      parallax.forEach((img) => {
        const box = img.parentElement?.getBoundingClientRect();
        if (!box) return;
        const t = (box.top + box.height / 2 - window.innerHeight / 2) / window.innerHeight;
        img.style.setProperty("--y", `${(-t * 60 - 30).toFixed(1)}px`);
      });
    }
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      observer.disconnect();
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [pathname]);

  return null;
}
