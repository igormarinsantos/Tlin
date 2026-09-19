// @vitest-environment jsdom
import { afterEach, beforeEach, expect, it, vi } from "vitest";
import { act, cleanup, render, screen } from "@testing-library/react";
import ObrigadoPage from "../app/obrigado/page";
import { saveDemoConfirmation } from "../lib/qualification-request";

const mocks = vi.hoisted(() => ({ replace: vi.fn() }));
vi.mock("next/navigation", () => ({ useRouter: () => mocks }));
vi.mock("@/lib/LanguageContext", () => ({ useLanguage: () => ({ lang: "PT" }) }));
vi.mock("@/lib/utm", () => ({ trackFunnelEvent: vi.fn() }));

beforeEach(() => { sessionStorage.clear(); vi.useFakeTimers(); });
afterEach(() => { cleanup(); vi.useRealTimers(); });

it("shows a confirmed receipt after mounting the thank-you page again", async () => {
  saveDemoConfirmation({ requestId: "demo-test", startsAt: "2099-01-01T14:00:00Z", day: "Quarta", time: "11:00" });
  const first = render(<ObrigadoPage />);
  await act(async () => { await vi.advanceTimersByTimeAsync(1); });
  expect(screen.getByText("Quarta")).toBeTruthy();
  first.unmount();
  render(<ObrigadoPage />);
  await act(async () => { await vi.advanceTimersByTimeAsync(1); });
  expect(screen.getByText("11:00")).toBeTruthy();
  expect(mocks.replace).not.toHaveBeenCalled();
});

it("redirects a direct visit without a receipt, including development", () => {
  render(<ObrigadoPage />);
  expect(mocks.replace).toHaveBeenCalledWith("/demo");
  expect(screen.queryByText("DEMO CONFIRMADA")).toBeNull();
});
