import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { AppointmentCard, MetricCard, StatusPill } from "@/components/dashboard";

describe("dashboard UI", () => {
  it("shows the customer appointment state and reference", () => {
    render(
      <AppointmentCard
        appointment={{
          id: "1",
          reference: "SR-2609-ABC123",
          service: "Tegelreparatie",
          preferredDate: "2026-10-08",
          location: "Zoetermeer",
          details: "Tegel vervangen",
          status: "confirmed",
          createdAt: "2026-09-25T00:00:00.000Z",
        }}
      />,
    );
    expect(screen.getByText("SR-2609-ABC123")).toBeInTheDocument();
    expect(screen.getByText("Bevestigd")).toBeInTheDocument();
    expect(screen.getByText("Tegelreparatie")).toBeInTheDocument();
  });

  it("renders metrics with readable labels", () => {
    render(<MetricCard label="Nieuwe aanvragen" value="12" detail="Deze week" />);
    expect(screen.getByText("Nieuwe aanvragen")).toBeInTheDocument();
    expect(screen.getByText("12")).toBeInTheDocument();
  });

  it("gives every appointment state an accessible label", () => {
    render(<StatusPill status="pending" />);
    expect(screen.getByText("In behandeling")).toBeInTheDocument();
  });
});
