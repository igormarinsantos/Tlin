// @vitest-environment jsdom
import { afterEach, describe, expect, it, vi } from "vitest";
import { act, cleanup, fireEvent, render, screen } from "@testing-library/react";
import type { ReactNode } from "react";
import { SiteChrome } from "../components/SiteChrome";

const state = vi.hoisted(() => ({ pathname: "/", track: vi.fn() }));
vi.mock("next/navigation", () => ({ usePathname: () => state.pathname }));
vi.mock("@/lib/utm", () => ({ trackFunnelEvent: state.track }));
vi.mock("@/components/SmoothScroll", () => ({ SmoothScroll: ({ children }: { children: ReactNode }) => children }));
vi.mock("@/components/Header", () => ({ Header: () => null }));
vi.mock("@/components/LiaPopup", () => ({ LiaPopup: () => null }));
vi.mock("next/dynamic", () => ({ default: () => function Popup({ planName, onClose }: { planName: string; onClose: () => void }) {
  return <div role="dialog"><span>{planName}</span><button onClick={onClose}>Close</button></div>;
} }));

afterEach(cleanup);
const open = () => window.dispatchEvent(new CustomEvent("open-qualification", { detail: { plan: "Scale", source: "header" } }));

describe("global qualification entry", () => {
  it.each(["/", "/ia-whatsapp", "/precos", "/como-funciona", "/blog", "/legal", "/obrigado"])("opens exactly once from %s", pathname => {
    state.pathname = pathname;
    render(<SiteChrome>Page</SiteChrome>);
    act(() => { open(); open(); });
    expect(screen.getAllByRole("dialog")).toHaveLength(1);
    expect(screen.getByText("Scale")).toBeTruthy();
    expect(state.track).toHaveBeenCalledTimes(1);
    expect(state.track).toHaveBeenCalledWith("start_lead_form", { plan_name: "Scale", cta_source: "header" });
    fireEvent.click(screen.getByText("Close"));
    expect(screen.queryByRole("dialog")).toBeNull();
    act(open);
    expect(screen.getAllByRole("dialog")).toHaveLength(1);
  });

  it("closes on route navigation and has no competing popup on the standalone routes", () => {
    state.pathname = "/blog";
    const { rerender } = render(<SiteChrome>Page</SiteChrome>);
    act(open);
    state.pathname = "/legal";
    rerender(<SiteChrome>Page</SiteChrome>);
    expect(screen.queryByRole("dialog")).toBeNull();
    for (const path of ["/demo", "/comece"]) {
      state.pathname = path;
      rerender(<SiteChrome>Standalone</SiteChrome>);
      act(open);
      expect(screen.queryByRole("dialog")).toBeNull();
    }
  });
});
