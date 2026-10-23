export interface Point { x: number; y: number }
export interface Viewport { width: number; height: number; left: number; top: number }
export const companionSize = { width: 104, height: 112 };
const margin = 16;

export function clampPosition(point: Point, viewport: Viewport): Point {
  function clamp(value: number, start: number, available: number, size: number): number {
    const inset = Math.min(margin, Math.max(0, (available - size) / 2));
    const minimum = start + inset;
    const maximum = start + Math.max(inset, available - size - inset);
    return Math.min(maximum, Math.max(minimum, Number.isFinite(value) ? value : maximum));
  }
  return {
    x: clamp(point.x, viewport.left, viewport.width, companionSize.width),
    y: clamp(point.y, viewport.top, viewport.height, companionSize.height),
  };
}

export function initialPosition(viewport: Viewport): Point {
  return clampPosition({ x: viewport.left + viewport.width, y: viewport.top + viewport.height }, viewport);
}

export function normalizePosition(point: Point, viewport: Viewport): Point {
  const far = initialPosition(viewport);
  const near = clampPosition({ x: viewport.left - 1, y: viewport.top - 1 }, viewport);
  return {
    x: far.x === near.x ? 1 : Math.max(0, Math.min(1, (point.x - near.x) / (far.x - near.x))),
    y: far.y === near.y ? 1 : Math.max(0, Math.min(1, (point.y - near.y) / (far.y - near.y))),
  };
}
export function restorePosition(position: Point, viewport: Viewport): Point {
  const near = clampPosition({ x: viewport.left - 1, y: viewport.top - 1 }, viewport);
  const far = initialPosition(viewport);
  return clampPosition({ x: near.x + position.x * (far.x - near.x), y: near.y + position.y * (far.y - near.y) }, viewport);
}
