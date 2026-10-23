import assert from 'node:assert/strict';
import { test } from 'node:test';
import { QuietBehavior } from '../src/character/quiet-behavior.ts';
import type { CatState } from '../src/character/motion.ts';

function setup(random = 0) {
  let id = 0;
  const pending = new Map<number, { callback: () => void; delay: number }>();
  const states: CatState[] = [];
  const behavior = new QuietBehavior(state => states.push(state), {
    schedule(callback, delay) { pending.set(++id, { callback, delay }); return id; },
    cancel(handle) { pending.delete(handle as number); },
  }, () => random);
  function next() {
    assert.equal(pending.size, 1, 'at most one behavior deadline');
    const [key, task] = [...pending][0]!;
    pending.delete(key);
    task.callback();
    return task.delay;
  }
  return { behavior, pending, states, next };
}

test('quiet cadence favors sleep, blinks in idle, stretches every third wake, never walks/plays', () => {
  const f = setup();
  f.behavior.setAvailable(true);
  assert.equal(f.states.at(-1), 'sleeping');
  assert.equal(f.next(), 20000);
  assert.equal(f.states.at(-1), 'idle');
  assert.equal(f.next(), 12000);
  assert.equal(f.states.at(-1), 'sleeping');
  assert.equal(f.next(), 45000);
  f.next();
  f.next();
  assert.equal(f.states.at(-1), 'idle');
  f.next();
  assert.equal(f.states.at(-1), 'stretching');
  assert.equal(f.next(), 3000);
  assert.equal(f.states.at(-1), 'sleeping');
  assert.ok(f.states.every(state => ['sleeping', 'idle', 'stretching'].includes(state)));
  f.behavior.destroy();
});

test('cadence upper bounds and repeated availability notifications do not reset deadlines', () => {
  const f = setup(1);
  f.behavior.setAvailable(true);
  const task = [...f.pending.values()][0];
  f.behavior.setAvailable(true);
  assert.equal([...f.pending.values()][0], task);
  assert.equal(f.next(), 35000);
  assert.equal(f.next(), 20000);
  assert.equal(f.next(), 75000);
  f.behavior.destroy();
});

test('hidden/fullscreen/drag suspension clears deadlines and resumes without catch-up', () => {
  const f = setup();
  f.behavior.setAvailable(true);
  const stale = [...f.pending.values()][0]!;
  f.behavior.setAvailable(false);
  assert.equal(f.pending.size, 0);
  f.behavior.pet();
  assert.equal(f.states.at(-1), 'sleeping');
  f.behavior.setAvailable(true);
  stale.callback();
  assert.equal(f.states.at(-1), 'sleeping');
  assert.equal(f.pending.size, 1);
  f.behavior.setAvailable(false);
  assert.equal(f.pending.size, 0, 'stale callbacks cannot lose the live cancellation handle');
  f.behavior.destroy();
});

test('pet interrupts idle/stretch, repeated pets replace one timer, then settle to sleep', () => {
  const f = setup();
  f.behavior.setAvailable(true);
  f.next();
  f.behavior.pet();
  f.behavior.pet();
  assert.equal(f.states.at(-1), 'petting');
  assert.equal(f.next(), 1800);
  assert.equal(f.states.at(-1), 'sleeping');
  f.behavior.destroy();
  assert.equal(f.pending.size, 0);
});

test('reduced motion has no autonomous timers; explicit still pet reaction remains available', () => {
  const f = setup();
  f.behavior.setAvailable(true);
  f.behavior.setReducedMotion(true);
  assert.equal(f.pending.size, 0);
  assert.equal(f.states.at(-1), 'sleeping');
  f.behavior.pet();
  assert.equal(f.states.at(-1), 'petting');
  assert.equal(f.next(), 1800);
  assert.equal(f.pending.size, 0);
  f.behavior.setReducedMotion(false);
  assert.equal(f.pending.size, 1);
  const stale = [...f.pending.values()][0]!;
  f.behavior.destroy();
  stale.callback();
  f.behavior.pet();
  f.behavior.setAvailable(true);
  assert.equal(f.pending.size, 0);
  assert.equal(f.states.at(-1), 'sleeping');
});
