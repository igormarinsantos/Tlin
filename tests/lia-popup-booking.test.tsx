// @vitest-environment jsdom
import { act, cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { LiaPopup } from "../components/LiaPopup";
import { getDictionary } from "../lib/dictionaries";

const mocks = vi.hoisted(() => ({ push: vi.fn(), conversion: vi.fn() }));
const t = getDictionary("PT");

vi.mock("next/navigation", () => ({
  usePathname: () => "/",
  useRouter: () => ({ push: mocks.push }),
}));
vi.mock("@/lib/LanguageContext", async () => {
  const { getDictionary: get } = await import("../lib/dictionaries");
  return { useLanguage: () => ({ lang: "PT", t: get("PT") }) };
});
vi.mock("@/lib/utm", () => ({
  calculateLeadScore: () => ({ lead_score: 60, lead_quality: "qualified" }),
  getUtmLeadPayload: () => ({}),
  trackConversion: mocks.conversion,
  trackFunnelEvent: vi.fn(),
}));
vi.mock("@/components/FloatingPersonaTrigger", () => ({
  FloatingPersonaTrigger: ({ onToggle }: { onToggle: () => void }) => (
    <button type="button" onClick={onToggle}>Abrir Igor</button>
  ),
}));

const slot = {
  startsAt: "2099-09-30T13:20:00Z",
  endsAt: "2099-09-30T13:35:00Z",
  when: "quarta-feira 30/09 às 10:20",
};
const day = { date: "2099-09-30", label: "quarta-feira 30/09", slots: [slot] };

beforeEach(() => {
  vi.useFakeTimers();
  localStorage.clear();
  sessionStorage.clear();
  mocks.push.mockClear();
  mocks.conversion.mockClear();
  vi.stubEnv("NEXT_PUBLIC_TURNSTILE_SITE_KEY", "");
  vi.stubGlobal("matchMedia", vi.fn().mockReturnValue({
    matches: false,
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
  }));
  HTMLElement.prototype.scrollTo = vi.fn();
});

afterEach(() => {
  cleanup();
  vi.useRealTimers();
  vi.unstubAllGlobals();
  vi.unstubAllEnvs();
});

async function settleReply() {
  await act(async () => { await vi.advanceTimersByTimeAsync(6_000); });
}

function sendText(value: string) {
  const input = screen.getByRole("textbox");
  fireEvent.change(input, { target: { value } });
  fireEvent.click(screen.getByRole("button", { name: "Enviar mensagem" }));
}

describe("Lia popup booking flow", () => {
  it("continues from slot selection to review and books only after confirmation", async () => {
    const fetchMock = vi.fn(async (url: string) => {
      if (url.includes("availability")) return Response.json({ success: true, days: [day] });
      if (url === "/api/notify") return Response.json({ success: true, demoBooking: { booked: true } });
      return Response.json({ success: true });
    });
    vi.stubGlobal("fetch", fetchMock);

    render(<LiaPopup />);
    fireEvent.click(screen.getByRole("button", { name: "Abrir Igor" }));
    fireEvent.click(screen.getByRole("button", { name: t.leadQualify.startChat }));
    await settleReply();

    sendText("Igor");
    await settleReply();
    sendText("11999999999");
    await settleReply();
    fireEvent.click(screen.getByRole("button", { name: t.leadQualify.yesCorrect }));
    await settleReply();
    fireEvent.click(screen.getByRole("button", { name: t.leadQualify.volumeOptions[1] }));
    await settleReply();
    fireEvent.click(screen.getByRole("button", { name: t.leadQualify.teamOptions[1] }));
    await settleReply();
    sendText("igor@example.test");
    await settleReply();

    fireEvent.click(screen.getByRole("button", { name: "30" }));
    await settleReply();
    fireEvent.click(screen.getByRole("button", { name: "10:20" }));
    await settleReply();

    const confirm = screen.getByRole("button", { name: t.leadQualify.confirm });
    expect(confirm).toBeTruthy();
    expect(fetchMock.mock.calls.filter(([url]) => url === "/api/notify")).toHaveLength(0);

    fireEvent.click(confirm);
    await act(async () => { await vi.runAllTimersAsync(); });

    expect(fetchMock.mock.calls.filter(([url]) => url === "/api/notify")).toHaveLength(1);
    expect(mocks.push).toHaveBeenCalledWith("/obrigado");
    expect(mocks.conversion).toHaveBeenCalledWith("demo_booked", expect.objectContaining({
      event_id: expect.stringMatching(/^[a-f0-9-]{36}$/i),
    }));
  });
});
