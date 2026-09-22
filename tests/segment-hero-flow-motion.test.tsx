// @vitest-environment jsdom
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { SegmentHeroFlow } from "@/components/SegmentHeroFlow";

vi.mock("framer-motion", async (importOriginal) => {
  const original = await importOriginal<typeof import("framer-motion")>();
  return { ...original, useReducedMotion: () => true };
});

afterEach(cleanup);

describe("segment hero reduced motion", () => {
  it("lets the visitor explicitly play the full flow", () => {
    render(<SegmentHeroFlow variant="clinicas" />);

    const play = screen.getByRole("button", { name: "Ver animação" });
    expect(play).toBeTruthy();

    fireEvent.click(play);

    expect(screen.queryByRole("button", { name: "Ver animação" })).toBeNull();
    expect(screen.getByText("Oi! Gostaria de agendar uma consulta inicial. Tem horário esta semana?")).toBeTruthy();
  });
});
