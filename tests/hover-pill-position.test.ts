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

  it("moves continuously through a rounded corner", () => {
    const points = [
      { pointerX: 226, pointerY: 0 },
      { pointerX: 232, pointerY: 3 },
      { pointerX: 237, pointerY: 7 },
      { pointerX: 240, pointerY: 12 },
    ].map((pointer) => getHoverPillPosition({ ...button, ...pointer }));

    for (let index = 1; index < points.length; index += 1) {
      const distance = Math.hypot(points[index].x - points[index - 1].x, points[index].y - points[index - 1].y);
      expect(distance).toBeLessThan(18);
    }
  });

  it("keeps the protected text area clear throughout the full orbit", () => {
    const protectedArea = {
      left: button.buttonWidth * 0.18,
      right: button.buttonWidth * 0.82,
      top: button.buttonHeight * 0.22,
      bottom: button.buttonHeight * 0.78,
    };

    for (let degrees = 0; degrees < 360; degrees += 5) {
      const radians = degrees * Math.PI / 180;
      const pointerX = button.buttonWidth / 2 + Math.cos(radians) * button.buttonWidth / 2;
      const pointerY = button.buttonHeight / 2 + Math.sin(radians) * button.buttonHeight / 2;
      const position = getHoverPillPosition({ ...button, pointerX, pointerY });
      const clearHorizontally = position.x + button.labelWidth / 2 <= protectedArea.left - button.gap
        || position.x - button.labelWidth / 2 >= protectedArea.right + button.gap;
      const clearVertically = position.y + button.labelHeight / 2 <= protectedArea.top - button.gap
        || position.y - button.labelHeight / 2 >= protectedArea.bottom + button.gap;

      expect(clearHorizontally || clearVertically).toBe(true);
    }
  });
});
