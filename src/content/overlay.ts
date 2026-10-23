import { clampPosition, initialPosition, normalizePosition, restorePosition } from '../shared/position.ts';
import type { Point, Viewport } from '../shared/position.ts';
import { mountCharacter } from '../character/mount.ts';
import css from './overlay.css';
import { QuietBehavior } from '../character/quiet-behavior.ts';

function viewport(): Viewport {
  const visual = window.visualViewport;
  return {
    width: visual?.width ?? window.innerWidth,
    height: visual?.height ?? window.innerHeight,
    left: visual?.offsetLeft ?? 0,
    top: visual?.offsetTop ?? 0,
  };
}

export function mountCompanion(
  previousPosition: Point | undefined,
  savePosition: (point: Point) => void,
  hide: () => void,
  commitPosition?: (point: Point) => void,
  normalizedPosition?: Point,
): () => void {
  const host = document.createElement('div');
  // Reset host styles against site CSS; Shadow DOM isolates the controls and artwork.
  host.style.cssText = 'all:initial!important;position:fixed!important;inset:0!important;width:0!important;height:0!important;z-index:2147483647!important;pointer-events:none!important;';
  const shadow = host.attachShadow({ mode: 'closed' });
  const style = document.createElement('style');
  style.textContent = css;
  const companion = document.createElement('div');
  companion.className = 'companion';
  companion.setAttribute('role', 'group');
  companion.setAttribute('aria-label', 'Fat Cat companion');
  const cat = document.createElement('button');
  cat.type = 'button';
  cat.className = 'cat';
  cat.setAttribute('aria-label', 'Pet Fat Cat. Drag or use arrow keys to move. Escape hides the cat.');
  cat.title = 'Pet me · Drag to move · Arrow keys move · Esc hides';
  const close = document.createElement('button');
  close.type = 'button';
  close.className = 'hide';
  close.textContent = '×';
  close.setAttribute('aria-label', 'Hide Fat Cat on this site');
  close.title = 'Hide on this site';
  companion.append(cat, close);
  shadow.append(style, companion);
  document.documentElement.append(host);

  const character = mountCharacter(cat, () => {}, false);
  const abort = new AbortController();
  const options = { signal: abort.signal };
  let point = previousPosition ?? (normalizedPosition ? restorePosition(normalizedPosition, viewport()) : initialPosition(viewport()));
  let pageHidden = false;
  const behavior = new QuietBehavior(state => {
    companion.dataset.pose = state === 'sleeping' ? 'sleep' : state === 'petting' ? 'pet' : state;
    character.setState(state);
  }, {
    schedule: (callback, delay) => setTimeout(callback, delay),
    cancel: handle => clearTimeout(handle as ReturnType<typeof setTimeout>),
  });
  const media = typeof matchMedia === 'function' ? matchMedia('(prefers-reduced-motion: reduce)') : undefined;
  const syncReducedMotion = () => behavior.setReducedMotion(media?.matches === true);
  media?.addEventListener('change', syncReducedMotion, options);
  syncReducedMotion();
  let drag: { pointerId: number; start: Point; origin: Point; moved: boolean } | undefined;
  let suppressClick = false;

  function renderPosition(): void {
    point = clampPosition(point, viewport());
    companion.style.left = `${point.x}px`;
    companion.style.top = `${point.y}px`;
    savePosition(point);
  }
  function inactive(): boolean { return pageHidden || document.hidden || document.fullscreenElement !== null; }
  function syncActivity(): void {
    companion.dataset.inactive = String(inactive());
    const unavailable = inactive() || Boolean(drag);
    character.setSuspended(unavailable);
    behavior.setAvailable(!unavailable);
    if (inactive()) cancelDrag();
  }
  function cancelDrag(): void {
    const pointerId = drag?.pointerId;
    drag = undefined;
    companion.dataset.dragging = 'false';
    character.setSuspended(inactive());
    behavior.setAvailable(!inactive());
    if (pointerId !== undefined && cat.hasPointerCapture(pointerId)) cat.releasePointerCapture(pointerId);
  }
  cat.addEventListener('click', (event) => {
    event.stopPropagation();
    if (suppressClick && event.detail !== 0) { suppressClick = false; return; }
    if (inactive()) return;
    behavior.pet();
  }, options);
  cat.addEventListener('pointerdown', (event) => {
    if (!event.isPrimary || event.button !== 0 || inactive()) return;
    event.stopPropagation();
    suppressClick = false;
    drag = { pointerId: event.pointerId, start: { x: event.clientX, y: event.clientY }, origin: point, moved: false };
    character.setSuspended(true);
    behavior.setAvailable(false);
    cat.setPointerCapture(event.pointerId);
  }, options);
  cat.addEventListener('pointermove', (event) => {
    if (!drag || drag.pointerId !== event.pointerId) return;
    event.stopPropagation();
    const dx = event.clientX - drag.start.x;
    const dy = event.clientY - drag.start.y;
    if (!drag.moved && Math.hypot(dx, dy) < 4) return;
    drag.moved = true;
    companion.dataset.dragging = 'true';
    character.setSuspended(true);
    point = { x: drag.origin.x + dx, y: drag.origin.y + dy };
    renderPosition();
  }, options);
  cat.addEventListener('pointerup', (event) => {
    if (!drag || drag.pointerId !== event.pointerId) return;
    event.stopPropagation();
    suppressClick = drag.moved;
    if (drag.moved) commitPosition?.(normalizePosition(point, viewport()));
    cancelDrag();
  }, options);
  cat.addEventListener('pointercancel', () => { suppressClick = true; cancelDrag(); }, options);
  cat.addEventListener('lostpointercapture', () => {
    if (drag) { suppressClick = drag.moved; cancelDrag(); }
  }, options);
  companion.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
      event.preventDefault();
      event.stopPropagation();
      hide();
      return;
    }
    if (event.target !== cat || event.altKey || event.ctrlKey || event.metaKey) return;
    const directions: Record<string, Point> = {
      ArrowLeft: { x: -1, y: 0 }, ArrowRight: { x: 1, y: 0 },
      ArrowUp: { x: 0, y: -1 }, ArrowDown: { x: 0, y: 1 },
    };
    const direction = directions[event.key];
    if (!direction) return;
    event.preventDefault();
    event.stopPropagation();
    const step = event.shiftKey ? 24 : 8;
    point = { x: point.x + direction.x * step, y: point.y + direction.y * step };
    renderPosition();
    commitPosition?.(normalizePosition(point, viewport()));
  }, options);
  close.addEventListener('click', (event) => { event.stopPropagation(); hide(); }, options);
  window.addEventListener('resize', renderPosition, options);
  window.visualViewport?.addEventListener('resize', renderPosition, options);
  window.visualViewport?.addEventListener('scroll', renderPosition, options);
  document.addEventListener('visibilitychange', syncActivity, options);
  document.addEventListener('fullscreenchange', syncActivity, options);
  // Persisted pages may return from the back/forward cache; visibility restores activity.
  window.addEventListener('pagehide', () => { pageHidden = true; syncActivity(); }, options);
  window.addEventListener('pageshow', () => { pageHidden = false; syncActivity(); }, options);
  character.setState('sleeping');
  companion.dataset.pose = 'sleep';
  renderPosition();
  syncActivity();

  return () => {
    abort.abort();
    behavior.destroy();
    cancelDrag();
    character.destroy();
    host.remove();
  };
}
