import svgText from '../../assets/cat/marmalade.svg';
import motionData from '../../assets/cat/motions.json';
import { parseMotions, type CatState } from './motion.ts';
import { CatRenderer } from './renderer.ts';

/** Bundled artwork only; callers own visibility, interaction and teardown. */
export function mountCharacter(container: HTMLElement, onState: (state: CatState) => void, autoReturn = true) {
  const parsed = new DOMParser().parseFromString(svgText, 'image/svg+xml');
  const svg = document.importNode(parsed.documentElement, true) as unknown as SVGSVGElement;
  svg.setAttribute('aria-hidden', 'true');
  svg.setAttribute('focusable', 'false');
  container.replaceChildren(svg);
  const library = parseMotions(motionData);
  if (!autoReturn) {
    delete library.petting.returnTo;
    delete library.stretching.returnTo;
  }
  const renderer = new CatRenderer(svg, library, onState);
  const media = typeof matchMedia === 'function' ? matchMedia('(prefers-reduced-motion: reduce)') : undefined;
  const syncMotion = () => renderer.setReducedMotion(media?.matches === true || typeof svg.animate !== 'function');
  syncMotion();
  media?.addEventListener('change', syncMotion);
  return {
    setState: (state: CatState) => renderer.setState(state),
    setSuspended: (value: boolean) => renderer.setSuspended(value),
    destroy() { media?.removeEventListener('change', syncMotion); renderer.destroy(); }
  };
}
