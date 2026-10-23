import sleepSvg from '../../assets/cat/sleep.svg';
import petSvg from '../../assets/cat/pet.svg';

// Only bundled, project-authored SVG enters this parser; no page/user HTML is accepted.
export function createArtwork(pose: 'sleep' | 'pet'): SVGElement {
  const parsed = new DOMParser().parseFromString(pose === 'sleep' ? sleepSvg : petSvg, 'image/svg+xml');
  const artwork = document.importNode(parsed.documentElement, true);
  artwork.setAttribute('aria-hidden', 'true');
  artwork.setAttribute('focusable', 'false');
  return artwork as unknown as SVGElement;
}
