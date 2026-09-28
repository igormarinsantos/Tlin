export type HoverPillEdge = "top" | "right" | "bottom" | "left";

type HoverPillPositionInput = {
  pointerX: number;
  pointerY: number;
  buttonWidth: number;
  buttonHeight: number;
  labelWidth: number;
  labelHeight: number;
  gap?: number;
};

export function getHoverPillPosition({
  pointerX,
  pointerY,
  buttonWidth,
  buttonHeight,
  labelWidth,
  labelHeight,
  gap = 8,
}: HoverPillPositionInput): { x: number; y: number; edge: HoverPillEdge } {
  const clampedX = Math.min(Math.max(pointerX, 0), buttonWidth);
  const clampedY = Math.min(Math.max(pointerY, 0), buttonHeight);
  const dx = clampedX - buttonWidth / 2;
  const dy = clampedY - buttonHeight / 2;
  const horizontalWeight = Math.abs(dx) / Math.max(buttonWidth / 2, 1);
  const verticalWeight = Math.abs(dy) / Math.max(buttonHeight / 2, 1);

  if (horizontalWeight > verticalWeight) {
    const edge = dx < 0 ? "left" : "right";
    return {
      x: edge === "left" ? -(labelWidth / 2 + gap) : buttonWidth + labelWidth / 2 + gap,
      y: clampedY,
      edge,
    };
  }

  const edge = dy < 0 ? "top" : "bottom";
  return {
    x: clampedX,
    y: edge === "top" ? -(labelHeight / 2 + gap) : buttonHeight + labelHeight / 2 + gap,
    edge,
  };
}
