// Regression: ISSUE-004 — Services and Process sections went blank after an NL/EN switch
// (re-rendered [data-r] elements were never observed, so they stayed at opacity 0)
// Found by /qa on 2026-09-26
// Report: .gstack/qa-reports/qa-report-sr-fine-tile-atelier-workers-dev-2026-09-26.md
import { render, waitFor } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { ScrollRevealObserver } from "@/components/ScrollRevealObserver";

vi.mock("next/navigation", () => ({ usePathname: () => "/" }));

const observed = new Set<Element>();

beforeEach(() => {
  observed.clear();
  vi.stubGlobal("IntersectionObserver", class {
    observe(el: Element) { observed.add(el); }
    unobserve(el: Element) { observed.delete(el); }
    disconnect() {}
  });
  vi.stubGlobal("matchMedia", () => ({ matches: false }));
});

afterEach(() => {
  vi.unstubAllGlobals();
  document.body.innerHTML = "";
});

describe("ScrollRevealObserver", () => {
  it("observes reveal elements that are added after mount", async () => {
    render(<ScrollRevealObserver />);
    const late = document.createElement("p");
    late.setAttribute("data-r", "rise");
    document.body.appendChild(late);
    await waitFor(() => expect(observed.has(late)).toBe(true));
  });

  it("reveals elements already scrolled past, even ones added later", async () => {
    render(<ScrollRevealObserver />);
    const passed = document.createElement("p");
    passed.setAttribute("data-r", "rise");
    passed.getBoundingClientRect = () => ({ bottom: -100 } as DOMRect);
    document.body.appendChild(passed);
    window.dispatchEvent(new Event("scroll"));
    expect(passed.classList.contains("in")).toBe(true);
  });
});
