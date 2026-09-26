"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

const PENDING = "[data-r]:not(.in)";

/**
 * Adds `.in` to every `[data-r]` element as it scrolls into view, and drives two scroll-linked
 * CSS variables: `--p` (0→1 over the first viewport, on `[data-scroll-progress]`) and `--y`
 * (parallax offset, on `img[data-parallax]`). Elements added later (e.g. re-rendered after a
 * language switch) are picked up too, so content can never get stuck invisible.
 */
export function ScrollRevealObserver() {
  const pathname = usePathname();

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const observer = new IntersectionObserver(
      (entries) => entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("in");
        observer.unobserve(entry.target);
      }),
      { threshold: 0.18, rootMargin: "0px 0px -8% 0px" },
    );
    const watchPending = () => document.querySelectorAll(PENDING).forEach((el) => observer.observe(el));
    watchPending();
    const mutations = new MutationObserver(watchPending);
    mutations.observe(document.body, { childList: true, subtree: true });

    function onScroll() {
      // Anything scrolled past too fast for the observer (anchor jumps) is revealed anyway.
      document.querySelectorAll<HTMLElement>(PENDING).forEach((el) => {
        if (el.getBoundingClientRect().bottom < window.innerHeight * 0.9) el.classList.add("in");
      });
      if (reduce) return;
      const p = Math.min(1, Math.max(0, window.scrollY / (window.innerHeight * 0.9)));
      document.querySelectorAll<HTMLElement>("[data-scroll-progress]").forEach((el) => el.style.setProperty("--p", p.toFixed(4)));
      document.querySelectorAll<HTMLElement>("img[data-parallax]").forEach((img) => {
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
      mutations.disconnect();
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [pathname]);

  return null;
}
