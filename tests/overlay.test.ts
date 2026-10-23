import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { test } from 'node:test';
import { JSDOM } from 'jsdom';

// Execute the built content bundle in a DOM simulation, not a real browser.
// Shadow roots and pointer capture are observed/mocked only by this test harness.
test('page trial is singleton, movable, hideable, and stops reactions when inactive', async () => {
  const dom = new JSDOM('<!doctype html><html><body><button>Page button</button></body></html>', {
    url: 'https://example.com', runScripts: 'outside-only', pretendToBeVisual: true,
  });
  const { window } = dom;
  const animations: { playState: string }[] = [];
  // Native animation boundary double: verify suspension and cleanup, not interpolation.
  window.Element.prototype.animate = (() => {
    const handle = {
      playState: 'running', finished: new Promise(() => {}),
      pause() { this.playState = 'paused'; },
      play() { this.playState = 'running'; },
      cancel() { this.playState = 'idle'; },
    };
    animations.push(handle);
    return handle;
  }) as unknown as typeof window.Element.prototype.animate;
  const roots: ShadowRoot[] = [];
  const originalAttach = window.Element.prototype.attachShadow;
  window.Element.prototype.attachShadow = function (options: ShadowRootInit) {
    const root = originalAttach.call(this, options);
    roots.push(root);
    return root;
  };
  const captured = new Set<number>();
  window.HTMLElement.prototype.setPointerCapture = (id: number) => { captured.add(id); };
  window.HTMLElement.prototype.hasPointerCapture = (id: number) => captured.has(id);
  window.HTMLElement.prototype.releasePointerCapture = (id: number) => { captured.delete(id); };
  const bundle = await readFile('dist/content/trial.js', 'utf8');
  const settings = { hidden: false, paused: false, position: null as { x: number; y: number } | null, allowed: false };
  let notify: ((message: unknown, sender: { id: string }) => void) | undefined;
  Object.defineProperty(window, 'chrome', { value: {
    runtime: {
      id: 'test',
      onMessage: { addListener: (listener: typeof notify) => { notify = listener; } },
      sendMessage: async (message: { type: string; value: never }) => {
        if (message.type === 'hidden') settings.hidden = message.value;
        if (message.type === 'position') settings.position = message.value;
        return { ok: true, value: { ...settings } };
      },
    },
  } });
  const flush = () => new Promise<void>((resolve) => setImmediate(resolve));
  let hidden = false;
  let fullscreen: Element | null = null;
  Object.defineProperty(window.document, 'hidden', { get: () => hidden });
  Object.defineProperty(window.document, 'fullscreenElement', { get: () => fullscreen });
  function current() {
    const root = roots.at(-1)!;
    return {
      cat: root.querySelector<HTMLButtonElement>('.cat')!,
      companion: root.querySelector<HTMLElement>('.companion')!,
      close: root.querySelector<HTMLButtonElement>('.hide')!,
    };
  }
  function pointer(target: HTMLElement, type: string, x: number, y: number) {
    const event = new window.MouseEvent(type, { bubbles: true, clientX: x, clientY: y, button: 0 });
    Object.defineProperties(event, { pointerId: { value: 1 }, isPrimary: { value: true } });
    target.dispatchEvent(event);
  }
  try {
    window.eval(bundle);
    await flush();
    let { cat, companion, close } = current();
    assert.equal(companion.dataset.pose, 'sleep');
    assert.equal(cat.querySelectorAll('[data-part]').length, 14, 'bundling preserves hidden animation rig parts');
    assert.ok(cat.querySelector('[data-part=closedEyes]'));
    assert.equal(window.document.documentElement.children.length, 3); // head, body, overlay
    cat.click();
    assert.equal(companion.dataset.pose, 'pet');
    hidden = true;
    window.document.dispatchEvent(new window.Event('visibilitychange'));
    assert.equal(companion.dataset.inactive, 'true');
    assert.ok(animations.every(animation => animation.playState !== 'running'), 'hidden/fullscreen cats suspend all native animations');
    assert.equal(companion.dataset.pose, 'sleep');
    hidden = false;
    window.document.dispatchEvent(new window.Event('visibilitychange'));
    assert.equal(companion.dataset.inactive, 'false');
    fullscreen = window.document.body;
    window.document.dispatchEvent(new window.Event('fullscreenchange'));
    assert.equal(companion.dataset.inactive, 'true');
    assert.ok(animations.every(animation => animation.playState !== 'running'), 'hidden/fullscreen cats suspend all native animations');
    fullscreen = null;
    window.document.dispatchEvent(new window.Event('fullscreenchange'));
    const oldX = Number.parseFloat(companion.style.left);
    cat.dispatchEvent(new window.KeyboardEvent('keydown', { key: 'ArrowLeft', bubbles: true, cancelable: true }));
    assert.equal(Number.parseFloat(companion.style.left), oldX - 8);
    pointer(cat, 'pointerdown', 100, 100);
    pointer(cat, 'pointermove', -2000, -2000);
    pointer(cat, 'pointerup', -2000, -2000);
    assert.equal(companion.style.left, '16px');
    assert.equal(companion.style.top, '16px');
    assert.equal(captured.size, 0);
    cat.dispatchEvent(new window.MouseEvent('click', { detail: 1 }));
    assert.equal(companion.dataset.pose, 'sleep', 'drag must not trigger pet reaction');
    window.eval(bundle);
    await flush();
    assert.equal(window.document.documentElement.children.length, 3, 'reinjection replaces rather than duplicates');
    assert.equal(cat.isConnected, true, 'reinjection keeps existing overlay');
    ({ cat, companion, close } = current());
    assert.equal(companion.style.left, '16px');
    cat.dispatchEvent(new window.KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
    assert.equal(window.document.documentElement.children.length, 2);
    settings.hidden = false;
    window.eval(bundle);
    await flush();
    ({ cat, companion, close } = current());
    assert.equal(companion.style.left, '16px', 'hide/restore remembers document position');
    settings.paused = true;
    notify?.({ type: 'settings-changed' }, { id: 'test' });
    await flush();
    assert.equal(cat.isConnected, false, 'pause removes overlay');
    settings.paused = false;
    notify?.({ type: 'settings-changed' }, { id: 'test' });
    await flush();
    ({ cat, companion, close } = current());
    assert.equal(cat.isConnected, true, 'resume restores overlay');
    Object.defineProperty(window, 'innerWidth', { value: 120, configurable: true });
    Object.defineProperty(window, 'innerHeight', { value: 128, configurable: true });
    window.dispatchEvent(new window.Event('resize'));
    assert.equal(companion.style.left, '8px');
    assert.equal(companion.style.top, '8px');
    close.click();
    assert.equal(cat.isConnected, false);
    const poseAfterClose = companion.dataset.pose;
    cat.click();
    assert.equal(companion.dataset.pose, poseAfterClose, 'teardown removes handlers');
    settings.hidden = false;
    window.eval(bundle);
    await flush();
    ({ cat } = current());
    notify?.({ type: 'settings-changed', revokedOrigins: ['https://example.com/*'] }, { id: 'test' });
    await flush();
    assert.equal(cat.isConnected, false, 'permission revocation ends the temporary trial too');
    assert.ok(animations.every(animation => animation.playState === 'idle'), 'teardown cancels all native animations');
  } finally {
    window.close();
  }
});
