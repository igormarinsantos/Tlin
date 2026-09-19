// @vitest-environment jsdom
import { afterEach, expect, it, vi } from "vitest";
import { createRef, useEffect } from "react";
import { cleanup, render } from "@testing-library/react";
import { Turnstile, type TurnstileHandle } from "../components/Turnstile";

vi.mock("next/script", () => ({ default: function CachedScript({ onReady }: { onReady: () => void }) {
  // Cached Next scripts invoke onReady on remount, but do not invoke onLoad again.
  useEffect(() => { onReady(); }, [onReady]);
  return null;
} }));

afterEach(() => { cleanup(); vi.unstubAllEnvs(); delete window.turnstile; });

it("recreates a cached widget on reopen and resets it for the second request", async () => {
  vi.stubEnv("NEXT_PUBLIC_TURNSTILE_SITE_KEY", "test-site-key");
  let callback!: (token: string) => void;
  const renderWidget = vi.fn((_container: HTMLElement, options: Record<string, unknown>) => {
    callback = options.callback as (token: string) => void;
    return "widget";
  });
  const reset = vi.fn();
  const remove = vi.fn();
  window.turnstile = { render: renderWidget, reset, remove };
  const ref = createRef<TurnstileHandle>();
  const first = render(<Turnstile ref={ref} />);
  callback("first-token");
  expect(await ref.current!.takeToken()).toBe("first-token");
  const next = ref.current!.takeToken();
  expect(reset).toHaveBeenCalledWith("widget");
  callback("second-token");
  expect(await next).toBe("second-token");
  first.unmount();
  expect(remove).toHaveBeenCalledWith("widget");
  render(<Turnstile ref={ref} />);
  expect(renderWidget).toHaveBeenCalledTimes(2);
  callback("reopened-token");
  expect(await ref.current!.takeToken()).toBe("reopened-token");
});

it("does not wait for a widget when no public key is configured", async () => {
  vi.stubEnv("NEXT_PUBLIC_TURNSTILE_SITE_KEY", "");
  const ref = createRef<TurnstileHandle>();
  render(<Turnstile ref={ref} />);
  expect(await ref.current!.takeToken()).toBeNull();
});
