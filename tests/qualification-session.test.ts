import { describe, expect, it } from "vitest";
import { parseQualificationProgress } from "../components/lead-qualification/session";
import { FALLBACK_FORM_DATA } from "../components/lead-qualification/constants";

describe("saved form compatibility", () => {
  it("rejects malformed saved data without crashing the form", () => {
    expect(parseQualificationProgress({ currentStep: 4, formData: { name: 123 } })).toBeNull();
    expect(parseQualificationProgress(null)).toBeNull();
    expect(parseQualificationProgress({ currentStep: 99, formData: FALLBACK_FORM_DATA })).toBeNull();
  });
  it("resumes legacy contact progress without trusting persisted chat text", () => {
    expect(parseQualificationProgress({ currentStep: 4, formData: FALLBACK_FORM_DATA, chatHistory: "broken" }))
      .toMatchObject({ currentStep: 4, lang: "PT", chatHistory: [], selectedSlot: null });
  });
  it("sends stale or incomplete review sessions to a fresh calendar", () => {
    const slot = { startsAt: "2020-01-01T14:00:00Z", endsAt: "2020-01-01T15:00:00Z", when: "11:00" };
    const saved = { currentStep: 9, formData: FALLBACK_FORM_DATA, selectedDay: { date: "2020-01-01", label: "Quarta", slots: [slot] }, selectedSlot: slot };
    expect(parseQualificationProgress(saved)).toMatchObject({ currentStep: 7, selectedDay: null, selectedSlot: null });
    expect(parseQualificationProgress({ currentStep: 9, formData: FALLBACK_FORM_DATA })?.currentStep).toBe(7);
  });
});
