import { partNames, type Part, type CatState, type MotionLibrary } from './motion.ts';

const origins: Record<Part, string> = {
  shadow: '175px 267px', cat: '175px 250px', tail: '264px 222px',
  backFoot: '230px 240px', frontFoot: '120px 240px', body: '175px 252px',
  leftArm: '108px 185px', rightArm: '240px 183px', head: '176px 149px',
  eyes: '176px 119px', closedEyes: '176px 122px', wool: '294px 244px',
  heart: '266px 59px', sleep: '287px 80px'
};
/** Owns only SVG parts and native animation handles. No timers or page scanning. */
export class CatRenderer {
  private parts = new Map<Part, SVGElement>();
  private animations: Animation[] = [];
  private state: CatState = 'idle';
  private suspended = false;
  private reducedMotion = false;
  private generation = 0;
  private disposed = false;

  constructor(svg: SVGSVGElement, private library: MotionLibrary, private onState: (state: CatState) => void) {
    for (const name of partNames) {
      const element = svg.querySelector<SVGElement>(`[data-part="${name}"]`);
      if (!element) throw new Error(`Missing rig part: ${name}`);
      element.style.transformBox = 'view-box';
      element.style.transformOrigin = origins[name];
      this.parts.set(name, element);
    }
  }

  setState(state: CatState): void {
    if (this.disposed) return;
    const previous = new Map([...this.parts].map(([name, element]) => [name, {
      transform: getComputedStyle(element).transform,
      opacity: getComputedStyle(element).opacity
    }]));
    this.cancel();
    this.state = state;
    const generation = this.generation;
    const clip = this.library[state];
    const cat = this.parts.get('cat')!;
    const tail = this.parts.get('tail')!;
    // Reuse the same tail in front when curled, behind the silhouette otherwise.
    if (state === 'sleeping') cat.append(tail); else cat.prepend(tail);
    for (const [name, element] of this.parts) {
      const pose = clip.pose[name];
      element.style.transform = pose?.transform ?? 'none';
      element.style.opacity = String(pose?.opacity ?? (['closedEyes', 'wool', 'heart', 'sleep'].includes(name) ? 0 : name === 'shadow' ? 0.1 : 1));
    }
    // Reduced motion retains meaningful static poses, including the stretch.
    if (this.reducedMotion) {
      if (state === 'stretching') {
        for (const track of clip.tracks) {
          const frame = track.frames[1];
          if (frame?.transform) this.parts.get(track.part)!.style.transform = frame.transform;
        }
      }
      this.onState(state);
      return;
    }
    const enteringSleep = state === 'sleeping';
    // Smoothly tuck the same head, body, feet and tail into the sleeping pose.
    if (enteringSleep) {
      for (const [name, pose] of Object.entries(clip.pose)) {
        if (!pose.transform) continue;
        const element = this.parts.get(name as Part)!;
        this.animations.push(element.animate([
          { transform: previous.get(name as Part)!.transform },
          { transform: pose.transform }
        ], { duration: 650, easing: 'ease-in-out' }));
      }
    }
    const tracks: Animation[] = [];
    for (const track of clip.tracks) {
      const animation = this.parts.get(track.part)!.animate(track.frames, {
        duration: track.duration, iterations: track.loop ? Infinity : 1,
        delay: track.delay + (enteringSleep ? 650 : 0), easing: 'ease-in-out', fill: 'none'
      });
      this.animations.push(animation);
      tracks.push(animation);
    }
    if (this.suspended) this.animations.forEach(animation => animation.pause());
    if (clip.returnTo) {
      void Promise.all(tracks.map(animation => animation.finished)).then(() => {
        if (generation === this.generation && !this.disposed) this.setState(clip.returnTo!);
      }).catch(() => { /* Cancellation on state changes is expected. */ });
    }
    this.onState(state);
  }

  setSuspended(value: boolean): void {
    this.suspended = value;
    this.animations.forEach(animation => {
      if (animation.playState === 'finished') return;
      if (value) animation.pause(); else animation.play();
    });
  }

  setReducedMotion(value: boolean): void {
    if (value === this.reducedMotion) return;
    this.reducedMotion = value;
    this.setState(this.state);
  }

  private cancel(): void {
    this.generation++;
    this.animations.forEach(animation => animation.cancel());
    this.animations = [];
  }

  destroy(): void {
    this.cancel();
    this.parts.clear();
    this.disposed = true;
  }
}
