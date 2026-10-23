import { isCatState, parseMotions, shouldSuspend, type CatState } from '../src/character/motion.ts';
import { CatRenderer } from '../src/character/renderer.ts';

function required<T extends Element>(selector: string): T {
  const element = document.querySelector<T>(selector);
  if (!element) throw new Error(`Missing preview element: ${selector}`);
  return element;
}
const cat = required<HTMLButtonElement>('#cat');
const caption = required<HTMLParagraphElement>('#caption');
const pause = required<HTMLButtonElement>('#pause');
const hide = required<HTMLButtonElement>('#hide');
const reduced = required<HTMLInputElement>('#reduced');
const size = required<HTMLInputElement>('#size');
const states = required<HTMLDivElement>('#states');
const media = matchMedia('(prefers-reduced-motion: reduce)');

async function boot(): Promise<void> {
  const responses = await Promise.all(['./assets/cat/marmalade.svg', './assets/cat/motions.json'].map(url => fetch(url)));
  if (responses.some(response => !response.ok)) throw new Error('Could not load local character assets');
  const [svgText, motionText] = await Promise.all(responses.map(response => response.text()));
  if (!svgText || !motionText) throw new Error('Empty character assets');
  const library = parseMotions(JSON.parse(motionText) as unknown);
  // Only the bundled, developer-authored SVG is accepted. No user-uploaded artwork.
  const documentSvg = new DOMParser().parseFromString(svgText, 'image/svg+xml');
  const svg = documentSvg.documentElement;
  if (svg.localName !== 'svg' || documentSvg.querySelector('parsererror, script, foreignObject')) throw new Error('Invalid bundled SVG');
  const mounted = document.importNode(svg, true) as unknown as SVGSVGElement;
  mounted.setAttribute('aria-hidden', 'true');
  cat.append(mounted);
  const renderer = new CatRenderer(mounted, library, (state: CatState) => {
    caption.textContent = library[state].caption;
    cat.dataset.state = state;
    states.querySelectorAll<HTMLButtonElement>('button').forEach(button => {
      button.setAttribute('aria-pressed', String(button.dataset.state === state));
    });
  });
  let paused = false;
  let hidden = false;
  const listeners = new AbortController();
  const options = { signal: listeners.signal };
  const updateSuspension = (): void => {
    const suspended = shouldSuspend(paused, hidden, document.hidden);
    renderer.setSuspended(suspended);
    required('#activity').textContent = hidden ? 'CAT HIDDEN' : suspended ? 'PAUSED' : reduced.checked || media.matches ? 'STILL PREVIEW' : 'LIVE PREVIEW';
    required<HTMLElement>('#activity-dot').style.background = suspended ? '#b7a48c' : '#8c9b75';
  };
  const updateMotion = (): void => {
    renderer.setReducedMotion(reduced.checked || media.matches);
    required('#motion-note').textContent = media.matches ? 'Your system’s reduced-motion preference is on.' : 'Keep the poses. Skip the wiggles.';
    updateSuspension();
  };
  states.addEventListener('click', event => {
    const button = (event.target as Element).closest<HTMLButtonElement>('button[data-state]');
    const state = button?.dataset.state;
    if (state && isCatState(state)) renderer.setState(state);
  }, options);
  cat.addEventListener('click', () => renderer.setState('petting'), options);
  pause.addEventListener('click', () => {
    paused = !paused;
    pause.textContent = paused ? 'Resume' : 'Pause';
    pause.setAttribute('aria-pressed', String(paused));
    updateSuspension();
  }, options);
  hide.addEventListener('click', () => {
    hidden = !hidden;
    cat.hidden = hidden;
    required<HTMLElement>('#hidden-note').hidden = !hidden;
    hide.textContent = hidden ? 'Show cat' : 'Hide cat';
    hide.setAttribute('aria-pressed', String(hidden));
    updateSuspension();
  }, options);
  const updateSize = (): void => {
    const width = Math.min(360, Math.max(88, Number(size.value) || 320));
    cat.style.width = `${width}px`;
    required<HTMLOutputElement>('#size-value').value = `${width} px`;
  };
  size.addEventListener('input', updateSize, options);
  required('#actual-size').addEventListener('click', () => { size.value = '88'; updateSize(); }, options);
  reduced.addEventListener('change', updateMotion, options);
  media.addEventListener('change', updateMotion, options);
  document.addEventListener('visibilitychange', updateSuspension, options);
  window.addEventListener('pagehide', event => {
    if (event.persisted) renderer.setSuspended(true);
    else { renderer.destroy(); listeners.abort(); }
  }, options);
  window.addEventListener('pageshow', updateSuspension, options);
  required('#metrics').textContent = `${((new TextEncoder().encode(svgText).length + new TextEncoder().encode(motionText).length) / 1024).toFixed(1)} KB of artwork + motion · ${mounted.querySelectorAll('*').length + 1} SVG nodes`;
  renderer.setState('idle');
  updateMotion();
  updateSuspension();
  cat.disabled = false;
}
void boot().catch((error: unknown) => {
  caption.textContent = `Marmalade could not load. ${error instanceof Error ? error.message : 'Please reload.'}`;
  document.querySelectorAll<HTMLButtonElement | HTMLInputElement>('button, input').forEach(control => { control.disabled = true; });
});
