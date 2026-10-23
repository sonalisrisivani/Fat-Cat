import type { CatState } from './motion.ts';

export interface BehaviorClock {
  schedule(callback: () => void, delay: number): unknown;
  cancel(handle: unknown): void;
}

/** One deadline at a time. Suspended time never accrues or produces catch-up actions. */
export class QuietBehavior {
  private timer: unknown;
  private available = false;
  private reduced = false;
  private disposed = false;
  private firstWake = true;
  private awakeCount = 0;
  private revision = 0;

  private render: (state: CatState) => void;
  private clock: BehaviorClock;
  private random: () => number;

  constructor(render: (state: CatState) => void, clock: BehaviorClock, random: () => number = Math.random) {
    this.render = render;
    this.clock = clock;
    this.random = random;
  }

  private clear(): void {
    this.revision++;
    if (this.timer !== undefined) this.clock.cancel(this.timer);
    this.timer = undefined;
  }

  private after(delay: number, callback: () => void): void {
    this.clear();
    const revision = this.revision;
    this.timer = this.clock.schedule(() => {
      if (this.disposed || !this.available || revision !== this.revision) return;
      this.timer = undefined;
      callback();
    }, delay);
  }

  private between(min: number, max: number): number {
    return min + Math.max(0, Math.min(1, this.random())) * (max - min);
  }

  private sleep(): void {
    this.clear();
    this.render('sleeping');
    if (!this.available || this.reduced || this.disposed) return;
    const delay = this.firstWake ? this.between(20000, 35000) : this.between(45000, 75000);
    this.after(delay, () => this.wake());
  }

  private wake(): void {
    this.firstWake = false;
    this.awakeCount++;
    this.render('idle');
    this.after(this.between(12000, 20000), () => {
      if (this.awakeCount % 3 === 0) {
        this.render('stretching');
        this.after(3000, () => this.sleep());
      } else this.sleep();
    });
  }

  setAvailable(value: boolean): void {
    if (this.disposed || value === this.available) return;
    this.available = value;
    this.sleep();
  }

  setReducedMotion(value: boolean): void {
    if (this.disposed || value === this.reduced) return;
    this.reduced = value;
    this.sleep();
  }

  pet(): void {
    if (this.disposed || !this.available) return;
    this.clear();
    this.render('petting');
    // Explicit interaction may show a still reaction even with reduced motion.
    this.after(1800, () => this.sleep());
  }

  destroy(): void {
    this.disposed = true;
    this.available = false;
    this.clear();
  }
}
