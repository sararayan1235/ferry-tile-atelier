// Regression: ISSUE-003 — customer portal stayed Dutch after choosing EN on the website
// Found by /qa on 2026-09-26
// Report: .gstack/qa-reports/qa-report-sr-fine-tile-atelier-workers-dev-2026-09-26.md
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { AppointmentCard, StatusPill, formatDate } from "@/components/dashboard";
import { appointmentStatusLabel } from "@/lib/appointments";

const appointment = {
  id: "1",
  reference: "SR-2609-ABC123",
  service: "Tiling",
  preferredDate: "2026-10-08",
  location: "Zoetermeer",
  details: "Replace two cracked tiles",
  status: "confirmed" as const,
  createdAt: "2026-09-25T00:00:00.000Z",
  note: "Confirmed for Tuesday 10:00",
};

describe("portal language", () => {
  it("renders status, date and owner message in English when language is en", () => {
    render(<AppointmentCard appointment={appointment} language="en" />);
    expect(screen.getByText("Confirmed")).toBeInTheDocument();
    expect(screen.getByText("8 October 2026")).toBeInTheDocument();
    expect(screen.getByText("Message from S.R.")).toBeInTheDocument();
  });

  it("keeps Dutch as the default for every status", () => {
    render(<StatusPill status="declined" />);
    expect(screen.getByText("Afgewezen")).toBeInTheDocument();
    expect(appointmentStatusLabel("pending")).toBe("In behandeling");
    expect(formatDate("2026-10-08")).toBe("8 oktober 2026");
  });

  it("has an English label for every status", () => {
    for (const status of ["pending", "confirmed", "declined", "completed"] as const) {
      expect(appointmentStatusLabel(status, "en")).toMatch(/^[A-Z][a-z]+$/);
    }
  });
});
