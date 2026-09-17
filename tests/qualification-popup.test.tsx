// @vitest-environment jsdom
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { act, cleanup, fireEvent, render, screen } from "@testing-library/react";
import type { ImgHTMLAttributes } from "react";
import { LeadQualificationPopup } from "../components/LeadQualificationPopup";
import { getDictionary } from "../lib/dictionaries";
import { QualificationRequest } from "../lib/qualification-request";

const mocks = vi.hoisted(() => ({ push: vi.fn(), track: vi.fn(), conversion: vi.fn() }));
const dictionary = getDictionary("PT");
vi.mock("next/navigation", () => ({ useRouter: () => ({ push: mocks.push }), usePathname: () => "/demo" }));
vi.mock("next/image", () => ({ default: ({ src, alt }: ImgHTMLAttributes<HTMLImageElement>) => <span data-image={src}>{alt}</span> }));
vi.mock("@/lib/LanguageContext", async () => {
  const { getDictionary: get } = await import("../lib/dictionaries");
  return { useLanguage: () => ({ lang: "PT", t: get("PT") }) };
});
vi.mock("@/lib/utm", () => ({ getUtmLeadPayload: () => ({}), calculateLeadScore: () => ({ lead_score: 60 }), trackFunnelEvent: mocks.track, trackConversion: mocks.conversion }));
vi.mock("@/components/lead-qualification/TypewriterQuestion", () => ({ TypewriterQuestion: ({ text }: { text: string }) => <span>{text}</span> }));

const slot = { startsAt: "2099-01-01T14:00:00Z", endsAt: "2099-01-01T15:00:00Z", when: "11:00" };
const day = { date: "2099-01-01", label: "Quarta-feira", slots: [slot] };

function seed(step = 9) {
  localStorage.setItem("tlin_lead_qualify_state", JSON.stringify({
    currentStep: step, lang: "PT", selectedDay: step >= 8 ? day : null, selectedSlot: step >= 9 ? slot : null,
    formData: { name: "Ana", phone: "11999999999", countryCode: "+55", email: "ana@example.test", volume: dictionary.leadQualify.volumeOptions[1], team: dictionary.leadQualify.teamOptions[1] },
  }));
}

beforeEach(() => {
  vi.useFakeTimers();
  localStorage.clear(); sessionStorage.clear();
  vi.stubEnv("NEXT_PUBLIC_TURNSTILE_SITE_KEY", "");
  vi.stubGlobal("matchMedia", vi.fn().mockReturnValue({ matches: false, addListener: vi.fn(), removeListener: vi.fn(), addEventListener: vi.fn(), removeEventListener: vi.fn() }));
  HTMLElement.prototype.scrollTo = vi.fn();
});
afterEach(() => { cleanup(); vi.useRealTimers(); vi.unstubAllGlobals(); vi.unstubAllEnvs(); });

async function resume(step = 9) {
  seed(step);
  render(<LeadQualificationPopup isOpen embedded planName="Scale" onClose={vi.fn()} />);
  fireEvent.click(screen.getByRole("button", { name: dictionary.leadQualify.resumeContinue }));
  await act(async () => { await vi.advanceTimersByTimeAsync(500); });
}

describe("rendered qualification flow", () => {
  it("resumes the review, confirms once, and saves a receipt before navigation", async () => {
    const fetchMock = vi.fn(async (url: string) => Response.json(url === "/api/notify"
      ? { success: true, demoBooking: { booked: true } } : { success: true }));
    vi.stubGlobal("fetch", fetchMock);
    await resume();
    const confirm = screen.getByRole("button", { name: dictionary.leadQualify.confirm });
    fireEvent.click(confirm); fireEvent.click(confirm);
    expect(screen.getByRole("status").textContent).toContain(dictionary.leadQualify.sendingRequest);
    await act(async () => { await vi.advanceTimersByTimeAsync(8_000); });
    expect(fetchMock.mock.calls.filter(([url]) => url === "/api/notify")).toHaveLength(1);
    expect(mocks.push).toHaveBeenCalledWith("/obrigado");
    expect(JSON.parse(sessionStorage.getItem("tlin_demo_confirmation")!).startsAt).toBe(slot.startsAt);
    expect(localStorage.getItem("tlin_lead_qualify_state")).toBeNull();
    expect(mocks.conversion).toHaveBeenCalledTimes(1);
  });

  it("keeps a rejected send on review for retry and emits no successful conversion", async () => {
    vi.stubGlobal("fetch", vi.fn(async (url: string) => url === "/api/notify"
      ? Response.json({ success: false }, { status: 403 }) : Response.json({ success: true })));
    await resume();
    fireEvent.click(screen.getByRole("button", { name: dictionary.leadQualify.confirm }));
    await act(async () => { await vi.advanceTimersByTimeAsync(8_000); });
    expect(screen.getByRole("button", { name: dictionary.leadQualify.confirm })).toBeTruthy();
    expect(mocks.push).not.toHaveBeenCalled();
    expect(mocks.conversion).not.toHaveBeenCalled();
  });

  it("refreshes days after a refused slot, without showing a fake success", async () => {
    const fetchMock = vi.fn(async (url: string) => Response.json(url === "/api/notify"
      ? { success: false, demoBooking: { booked: false, slotUnavailable: true } }
      : url.includes("availability") ? { success: true, days: [] } : { success: true }));
    vi.stubGlobal("fetch", fetchMock);
    await resume();
    fireEvent.click(screen.getByRole("button", { name: dictionary.leadQualify.confirm }));
    await act(async () => { await vi.advanceTimersByTimeAsync(8_000); });
    expect(fetchMock.mock.calls.some(([url]) => url.includes("availability"))).toBe(true);
    expect(screen.getByRole("button", { name: dictionary.leadQualify.retryAvailability })).toBeTruthy();
    expect(mocks.push).not.toHaveBeenCalled();
  });

  it("does not loop on availability errors and allows an explicit retry", async () => {
    const fetchMock = vi.fn(async (url: string) => url.includes("availability")
      ? Response.json({ success: false }, { status: 503 }) : Response.json({ success: true }));
    vi.stubGlobal("fetch", fetchMock);
    await resume(7);
    await act(async () => { await vi.advanceTimersByTimeAsync(20_000); });
    expect(fetchMock.mock.calls.filter(([url]) => url.includes("availability"))).toHaveLength(1);
    fireEvent.click(screen.getByRole("button", { name: dictionary.leadQualify.retryAvailability }));
    await act(async () => { await vi.advanceTimersByTimeAsync(500); });
    expect(fetchMock.mock.calls.filter(([url]) => url.includes("availability"))).toHaveLength(2);
  });

  it("restores an interrupted booking as a support action without sending again", async () => {
    seed();
    new QualificationRequest(localStorage).mark("pending");
    const fetchMock = vi.fn();
    vi.stubGlobal("fetch", fetchMock);
    render(<LeadQualificationPopup isOpen embedded planName="Scale" onClose={vi.fn()} />);
    expect(screen.getByRole("status").textContent).toContain(dictionary.leadQualify.bookingUncertain);
    expect(screen.getByRole("link", { name: dictionary.leadQualify.bookingSupport })).toBeTruthy();
    expect(fetchMock).not.toHaveBeenCalled();
  });
});
