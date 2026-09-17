import { afterEach, describe, expect, it, vi } from "vitest";
import { SingleUseToken } from "../lib/single-use-token";

afterEach(() => vi.useRealTimers());

describe("security token lifecycle", () => {
  it("waits for a late token and requires a different one for the next request", async () => {
    const renew = vi.fn();
    const tokens = new SingleUseToken(renew);
    const first = tokens.take();
    tokens.receive("capture-token");
    expect(await first).toBe("capture-token");
    const second = tokens.take();
    tokens.receive("booking-token");
    expect(await second).toBe("booking-token");
    expect(renew).toHaveBeenCalled();
  });

  it("discards expired tokens and rejects concurrent waiters", async () => {
    const tokens = new SingleUseToken(vi.fn());
    tokens.receive("expired");
    tokens.receive(null);
    const pending = tokens.take();
    await expect(tokens.take()).rejects.toThrow("already pending");
    tokens.receive("fresh");
    expect(await pending).toBe("fresh");
  });

  it("allows retry after a timeout or component unmount", async () => {
    vi.useFakeTimers();
    const tokens = new SingleUseToken(vi.fn(), 50);
    const timeout = expect(tokens.take()).rejects.toThrow("unavailable");
    await vi.advanceTimersByTimeAsync(50);
    await timeout;
    const cancelled = expect(tokens.take()).rejects.toThrow("unavailable");
    tokens.cancel();
    await cancelled;
    tokens.receive("retry");
    expect(await tokens.take()).toBe("retry");
  });
});
