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
  const buttonRadiusX = Math.max(buttonWidth / 2, 1);
  const buttonRadiusY = Math.max(buttonHeight / 2, 1);
  const normalizedX = (clampedX - buttonWidth / 2) / buttonRadiusX;
  const normalizedY = (clampedY - buttonHeight / 2) / buttonRadiusY;
  const angle = normalizedX === 0 && normalizedY === 0
    ? -Math.PI / 2
    : Math.atan2(normalizedY, normalizedX);
  const cos = Math.cos(angle);
  const sin = Math.sin(angle);

  // Uma superelipse cria uma pista continua: trechos mais retos nas laterais
  // e curvas arredondadas sem o salto de eixo que existia nos cantos.
  const curveExponent = 6;
  const curveScale = 1 / Math.pow(
    Math.pow(Math.abs(cos), curveExponent) + Math.pow(Math.abs(sin), curveExponent),
    1 / curveExponent,
  );
  const orbitRadiusX = buttonRadiusX + labelWidth / 2 + gap;
  const orbitRadiusY = buttonRadiusY + labelHeight / 2 + gap;
  const horizontalWeight = Math.abs(normalizedX);
  const verticalWeight = Math.abs(normalizedY);
  const edge: HoverPillEdge = horizontalWeight > verticalWeight
    ? normalizedX < 0 ? "left" : "right"
    : normalizedY < 0 ? "top" : "bottom";

  return {
    x: buttonWidth / 2 + cos * orbitRadiusX * curveScale,
    y: buttonHeight / 2 + sin * orbitRadiusY * curveScale,
    edge,
  };
}
