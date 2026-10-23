import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile, stat } from 'node:fs/promises';
import { gzipSync } from 'node:zlib';
import { parseMotions, shouldSuspend, partNames, stateNames } from '../build/preview/modules/motion.js';
import { CatRenderer } from '../build/preview/modules/renderer.js';
const json = JSON.parse(await readFile('assets/cat/motions.json', 'utf8'));
const library = parseMotions(json);

test('all six clips resolve shared tracks and target existing unique SVG parts', async () => {
  const svg = await readFile('assets/cat/marmalade.svg', 'utf8');
  assert.deepEqual(Object.keys(library), [...stateNames]);
  for (const part of partNames) assert.equal(svg.split(`data-part="${part}"`).length - 1, 1);
  assert.ok(!/<(?:script|image|foreignObject)\b/.test(svg));
  assert.ok(library.idle.tracks.some(track => track.part === 'eyes'));
  assert.equal(library.playing.pose.wool.opacity, 1);
});

test('reject malformed versions, transforms, targets, timing, offsets and infinite one-shots', () => {
  for (const mutate of [
    d => { d.version = 2; },
    d => { d.shared.breathe.part = 'unknown'; },
    d => { d.shared.breathe.duration = -1; },
    d => { d.shared.breathe.frames[0].transform = 'url(https://example.com)'; },
    d => { d.shared.blink.frames[2].offset = .1; },
    d => { d.clips.petting.tracks[0].loop = true; },
    d => { delete d.clips.sleeping; },
    d => { d.clips.idle.pose = { body: { filter: 'blur(10px)' } }; }
  ]) {
    const data = structuredClone(json); mutate(data);
    assert.throws(() => parseMotions(data));
  }
});

test('every pause/visibility reason independently suspends rendering', () => {
  for (let mask = 0; mask < 8; mask++) {
    assert.equal(shouldSuspend(Boolean(mask & 1), Boolean(mask & 2), Boolean(mask & 4)), mask !== 0);
  }
});

// A small native-animation boundary double verifies ownership and lifecycle, not browser interpolation.
function fixture() {
  const animations = [];
  const parts = new Map(partNames.map(name => [name, {
    style: {}, append() {}, prepend() {},
    animate(frames, options) {
      let resolve, reject;
      const finished = new Promise((yes, no) => { resolve = yes; reject = no; });
      finished.catch(() => {});
      const animation = {
        frames, options, finished, playState: 'running',
        pause() { this.playState = 'paused'; },
        play() { this.playState = 'running'; },
        cancel() { this.playState = 'idle'; reject(new Error('cancelled')); },
        finish() { this.playState = 'finished'; resolve(); }
      };
      animations.push(animation); return animation;
    }
  }]));
  const states = [];
  const svg = { querySelector: selector => parts.get(selector.match(/"(.+)"/)[1]) };
  return { renderer: new CatRenderer(svg, library, state => states.push(state)), animations, parts, states };
}
globalThis.getComputedStyle = element => ({ transform: element.style.transform ?? 'none', opacity: element.style.opacity ?? '1' });

test('rapid changes cancel old animations; pause survives state changes; destroy cancels all', () => {
  const f = fixture();
  f.renderer.setState('idle');
  f.renderer.setSuspended(true);
  assert.ok(f.animations.every(a => a.playState === 'paused'));
  f.renderer.setState('walking');
  assert.ok(f.animations.slice(0, 3).every(a => a.playState === 'idle'));
  assert.ok(f.animations.slice(3).every(a => a.playState === 'paused'));
  f.renderer.setSuspended(false);
  assert.ok(f.animations.slice(3).every(a => a.playState === 'running'));
  f.renderer.destroy();
  assert.ok(f.animations.every(a => a.playState === 'idle'));
  f.renderer.setState('playing');
  assert.equal(f.states.at(-1), 'walking');
});

test('one-shots finish in idle and cancellation cannot override a newer selection', async () => {
  const f = fixture();
  f.renderer.setState('petting');
  f.animations.forEach(a => a.finish());
  await new Promise(resolve => setImmediate(resolve));
  assert.equal(f.states.at(-1), 'idle');
  f.renderer.setState('stretching');
  f.renderer.setState('sleeping');
  await new Promise(resolve => setImmediate(resolve));
  assert.equal(f.states.at(-1), 'sleeping');
  f.renderer.destroy();
});

test('reduced motion cancels animation and keeps expressive static poses', () => {
  const f = fixture();
  f.renderer.setState('idle');
  f.renderer.setReducedMotion(true);
  const count = f.animations.length;
  for (const state of stateNames) f.renderer.setState(state);
  assert.equal(f.animations.length, count);
  assert.ok(f.animations.every(a => a.playState === 'idle'));
  assert.notEqual(f.parts.get('frontFoot').style.transform, 'none');
  f.renderer.destroy();
});

test('artwork, motion data, renderer and DOM remain within project budgets', async () => {
  const files = ['assets/cat/marmalade.svg', 'assets/cat/motions.json', 'build/preview/modules/motion.js', 'build/preview/modules/renderer.js'];
  const contents = await Promise.all(files.map(file => readFile(file)));
  const bytes = await Promise.all(files.map(async file => (await stat(file)).size));
  assert.ok(bytes[0] + bytes[1] < 100 * 1024);
  assert.ok(bytes[2] + bytes[3] < 75 * 1024);
  const nodes = (contents[0].toString().match(/<[a-zA-Z][^>]*>/g) ?? []).length;
  assert.ok(nodes < 150);
  console.log(JSON.stringify({ files, bytes, total: bytes.reduce((a,b) => a+b,0), gzipCombined: gzipSync(Buffer.concat(contents)).length, nodes }));
});
