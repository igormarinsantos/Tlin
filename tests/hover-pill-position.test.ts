import { describe, expect, it } from "vitest";
import { getHoverPillPosition } from "@/lib/hover-pill-position";

describe("demo hover pill perimeter", () => {
  const button = { buttonWidth: 240, buttonHeight: 56, labelWidth: 96, labelHeight: 24, gap: 8 };

  it.each([
    { pointerX: 120, pointerY: 0, edge: "top" },
    { pointerX: 240, pointerY: 28, edge: "right" },
    { pointerX: 120, pointerY: 56, edge: "bottom" },
    { pointerX: 0, pointerY: 28, edge: "left" },
  ] as const)("tracks the $edge edge without entering the button", ({ pointerX, pointerY, edge }) => {
    const position = getHoverPillPosition({ ...button, pointerX, pointerY });
    expect(position.edge).toBe(edge);

    if (edge === "top") expect(position.y + button.labelHeight / 2).toBeLessThanOrEqual(-button.gap);
    if (edge === "right") expect(position.x - button.labelWidth / 2).toBeGreaterThanOrEqual(button.buttonWidth + button.gap);
    if (edge === "bottom") expect(position.y - button.labelHeight / 2).toBeGreaterThanOrEqual(button.buttonHeight + button.gap);
    if (edge === "left") expect(position.x + button.labelWidth / 2).toBeLessThanOrEqual(-button.gap);
  });
});
