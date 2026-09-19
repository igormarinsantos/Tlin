// @vitest-environment jsdom
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { act, cleanup, renderHook } from "@testing-library/react";
import { useQualificationRequest } from "../components/lead-qualification/useQualificationRequest";
import { bookingOutcome, QualificationRequest, readDemoConfirmation, saveDemoConfirmation } from "../lib/qualification-request";

const data = { name: "Ana", phone: "11999999999", countryCode: "+55", utm: {} };
beforeEach(() => { localStorage.clear(); sessionStorage.clear(); });
afterEach(() => { cleanup(); vi.unstubAllGlobals(); vi.restoreAllMocks(); });

function setup() {
  const hook = renderHook(() => useQualificationRequest());
  const takeToken = vi.fn().mockResolvedValueOnce("capture-token").mockResolvedValue("next-token");
  hook.result.current.turnstileRef.current = { takeToken };
  return { ...hook, takeToken };
}

describe("qualification request lifecycle", () => {
  it("uses a new CRM identity after a phone correction, including after reload", () => {
    const first = new QualificationRequest(localStorage);
    first.identifyPhone("5511999999999"); first.captured("contact");
    const resumed = new QualificationRequest(localStorage);
    resumed.identifyPhone("5511999999999"); expect(resumed.state.id).toBe(first.state.id);
    resumed.identifyPhone("5511888888888"); expect(resumed.state.id).not.toBe(first.state.id);
    expect(resumed.state.capturedContact).toBeNull();
  });
  it("keeps identity/capture on reload, isolates new requests, and restores an interrupted send as uncertain", () => {
    const first = new QualificationRequest(localStorage);
    first.captured("contact");
    const resumed = new QualificationRequest(localStorage);
    expect(resumed.state.id).toBe(first.state.id);
    expect(resumed.state.capturedContact).toBe("contact");
    resumed.mark("pending");
    expect(new QualificationRequest(localStorage).state.submission).toBe("unknown");
    resumed.reset();
    expect(resumed.state.id).not.toBe(first.state.id);
    expect(resumed.state.capturedContact).toBeNull();
  });

  it("waits for capture before booking, consumes two tokens and ignores a double submit", async () => {
    let releaseCapture!: (response: Response) => void;
    const fetchMock = vi.fn().mockImplementationOnce(() => new Promise<Response>(resolve => { releaseCapture = resolve; }))
      .mockResolvedValueOnce(Response.json({ success: true, demoBooking: { booked: true } }));
    vi.stubGlobal("fetch", fetchMock);
    const { result, takeToken } = setup();
    act(() => result.current.capture(data));
    await act(async () => { await Promise.resolve(); });
    let submitted!: Promise<string>;
    act(() => { submitted = result.current.submit({ demoSlot: { starts_at: "2030-01-01" } }); });
    expect(await result.current.submit({})).toBe("busy");
    expect(fetchMock).toHaveBeenCalledTimes(1);
    await act(async () => { releaseCapture(Response.json({ success: true })); expect(await submitted).toBe("booked"); });
    expect(takeToken).toHaveBeenCalledTimes(2);
    const payloads = fetchMock.mock.calls.map(call => JSON.parse(call[1].body));
    expect(payloads[0].leadCaptureId).toBe(payloads[1].leadCaptureId);
    expect(payloads.map(p => p.turnstileToken)).toEqual(["capture-token", "next-token"]);
    expect(await result.current.submit({})).toBe("already-booked");
    expect(fetchMock).toHaveBeenCalledTimes(2);
  });

  it("does not mark HTTP capture failures as captured and retries final submission with the same id", async () => {
    const fetchMock = vi.fn().mockResolvedValueOnce(Response.json({ success: false }, { status: 502 }))
      .mockResolvedValueOnce(Response.json({ success: false }, { status: 403 }))
      .mockResolvedValueOnce(Response.json({ success: true, demoBooking: { booked: true } }));
    vi.stubGlobal("fetch", fetchMock);
    const { result } = setup();
    act(() => result.current.capture(data));
    await act(async () => { expect(await result.current.submit({ ...data, email: "updated@example.test" })).toBe("retry"); });
    expect(result.current.request.state.capturedContact).toBeNull();
    await act(async () => { expect(await result.current.submit(data)).toBe("booked"); });
    const ids = fetchMock.mock.calls.map(call => JSON.parse(call[1].body).leadCaptureId);
    expect(new Set(ids).size).toBe(1);
  });

  it("blocks blind retries after a lost booking response, including remount", async () => {
    const fetchMock = vi.fn().mockRejectedValue(new TypeError("Network lost"));
    vi.stubGlobal("fetch", fetchMock);
    const { result, unmount } = setup();
    await act(async () => { expect(await result.current.submit(data)).toBe("unknown"); });
    expect(result.current.uncertain).toBe(true);
    expect(result.current.reset()).toBe(false);
    unmount();
    const resumed = setup();
    expect(await resumed.result.current.submit(data)).toBe("unknown");
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });

  it("lets security failure retry without dispatching or marking a booking uncertain", async () => {
    const fetchMock = vi.fn();
    vi.stubGlobal("fetch", fetchMock);
    const { result, takeToken } = setup();
    takeToken.mockReset().mockRejectedValue(new Error("Security unavailable"));
    await act(async () => { expect(await result.current.submit(data)).toBe("retry"); });
    expect(result.current.uncertain).toBe(false);
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("allows retry for an explicit HTTP rejection even when its body is not JSON", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(new Response("Forbidden", { status: 403 })));
    const { result } = setup();
    await act(async () => { expect(await result.current.submit(data)).toBe("retry"); });
    expect(result.current.uncertain).toBe(false);
  });

  it("does not let a closed popup overwrite a newly started request when its capture finishes", async () => {
    let finish!: (response: Response) => void;
    vi.stubGlobal("fetch", vi.fn().mockImplementation(() => new Promise<Response>(resolve => { finish = resolve; })));
    const old = setup();
    act(() => old.result.current.capture(data));
    await act(async () => { await Promise.resolve(); });
    old.unmount();
    const fresh = setup();
    act(() => { fresh.result.current.reset(); });
    const newId = fresh.result.current.request.state.id;
    await act(async () => { finish(Response.json({ success: true })); });
    expect(new QualificationRequest(localStorage).state.id).toBe(newId);
  });

  it("persists a confirmed receipt across reads and rejects expired or legacy receipts", () => {
    saveDemoConfirmation({ requestId: "request-1", startsAt: "2030-01-01T14:00:00Z", day: "Quarta", time: "11h" });
    expect(readDemoConfirmation()?.requestId).toBe("request-1");
    expect(readDemoConfirmation()?.requestId).toBe("request-1");
    const receipt = JSON.parse(sessionStorage.getItem("tlin_demo_confirmation")!);
    sessionStorage.setItem("tlin_demo_confirmation", JSON.stringify({ ...receipt, expiresAt: 1 }));
    expect(readDemoConfirmation()).toBeNull();
    sessionStorage.setItem("tlin_demo_confirmation", JSON.stringify({ day: "Quarta", time: "11h" }));
    expect(readDemoConfirmation()).toBeNull();
  });

  it("uses memory for the immediate confirmation when browser storage is blocked", () => {
    vi.spyOn(Storage.prototype, "setItem").mockImplementation(() => { throw new Error("Blocked"); });
    saveDemoConfirmation({ requestId: "memory", startsAt: "2030-01-01T14:00:00Z", day: "Quarta", time: "11h" });
    expect(readDemoConfirmation()?.requestId).toBe("memory");
  });

  it("requires explicit booking confirmation even when capture or email succeeded", () => {
    expect(bookingOutcome(200, { success: true })).toBe("unknown");
    expect(bookingOutcome(200, { success: true, demoBooking: { booked: false } })).toBe("retry");
    expect(bookingOutcome(500, { demoBooking: { booked: true } })).toBe("booked");
    expect(bookingOutcome(502, { demoBooking: { booked: false, pendingConfirmation: true } })).toBe("unknown");
    expect(bookingOutcome(502, { demoBooking: { booked: false, slotUnavailable: true } })).toBe("slots");
  });
});
