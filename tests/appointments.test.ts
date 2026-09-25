import { describe, expect, it } from "vitest";
import {
  appointmentStatusLabel,
  canTransitionAppointment,
  filterAppointmentsForUser,
  nextAppointmentStatuses,
  validateAppointmentInput,
} from "@/lib/appointments";

describe("appointment domain", () => {
  it("validates a complete customer request", () => {
    const result = validateAppointmentInput({
      name: "Jan Jansen",
      phone: "06 1234 5678",
      email: "jan@example.nl",
      location: "2718 GS Zoetermeer",
      service: "Tegelreparatie",
      preferredDate: "2099-05-12",
      details: "Twee badkamertegels zijn gebarsten en moeten worden vervangen.",
    });
    expect(result.ok).toBe(true);
    expect(result.errors).toEqual({});
    expect(result.input.email).toBe("jan@example.nl");
  });

  it("rejects missing and malformed values", () => {
    const result = validateAppointmentInput({ name: "J", email: "nope" });
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(Object.keys(result.errors).sort()).toEqual(
        ["details", "email", "location", "name", "phone", "preferredDate", "service"].sort(),
      );
    }
  });

  it("does not expose another customer's appointments", () => {
    const rows = [
      { id: "1", userId: "user-a", status: "pending" as const },
      { id: "2", userId: "user-b", status: "confirmed" as const },
    ];
    expect(filterAppointmentsForUser(rows, "user-a").map((row) => row.id)).toEqual(["1"]);
  });

  it("allows admin-only terminal and review transitions", () => {
    expect(canTransitionAppointment("pending", "confirmed", "admin")).toBe(true);
    expect(canTransitionAppointment("confirmed", "completed", "admin")).toBe(true);
    expect(canTransitionAppointment("pending", "declined", "admin")).toBe(true);
    expect(canTransitionAppointment("declined", "confirmed", "admin")).toBe(false);
    expect(canTransitionAppointment("pending", "confirmed", "customer")).toBe(false);
  });

  it("offers the correct admin next states", () => {
    expect(nextAppointmentStatuses("pending")).toEqual(["confirmed", "declined"]);
    expect(nextAppointmentStatuses("confirmed")).toEqual(["completed"]);
    expect(nextAppointmentStatuses("completed")).toEqual([]);
  });

  it("uses customer-friendly status labels", () => {
    expect(appointmentStatusLabel("pending")).toBe("In behandeling");
    expect(appointmentStatusLabel("confirmed")).toBe("Bevestigd");
    expect(appointmentStatusLabel("declined")).toBe("Afgewezen");
    expect(appointmentStatusLabel("completed")).toBe("Afgerond");
  });
});
