// @vitest-environment jsdom
import { act, cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { SegmentHeroFlow } from "@/components/SegmentHeroFlow";

afterEach(() => {
  vi.useRealTimers();
  cleanup();
});

describe("segment hero motion", () => {
  it("autoplays and loops without playback controls", () => {
    vi.useFakeTimers();
    render(<SegmentHeroFlow variant="clinicas" />);

    const flow = screen.getByTestId("segment-hero-flow");
    expect(flow.getAttribute("data-flow-step")).toBe("0");
    expect(screen.queryByRole("button", { name: "Ver animação" })).toBeNull();

    for (const duration of [1450, 1550, 1450, 1650, 1450, 1550]) {
      act(() => vi.advanceTimersByTime(duration));
    }
    expect(flow.getAttribute("data-flow-step")).toBe("6");

    act(() => vi.advanceTimersByTime(2600));
    expect(flow.getAttribute("data-flow-step")).toBe("0");
  });
});
