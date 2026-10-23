import assert from 'node:assert/strict';
import { test } from 'node:test';
import { isEligiblePage } from '../src/shared/page-eligibility.ts';
import { clampPosition, initialPosition } from '../src/shared/position.ts';
import { tryOnCurrentPage } from '../src/popup/page-trial.ts';

const viewport = { width: 800, height: 600, left: 0, top: 0 };

test('positions clamp at all edges, small viewports, and visual viewport offsets', () => {
  assert.deepEqual(initialPosition(viewport), { x: 680, y: 472 });
  assert.deepEqual(clampPosition({ x: -900, y: 10000 }, viewport), { x: 16, y: 472 });
  assert.deepEqual(clampPosition({ x: NaN, y: Infinity }, viewport), { x: 680, y: 472 });
  assert.deepEqual(clampPosition({ x: 500, y: -1 }, { width: 80, height: 60, left: 0, top: 0 }), { x: 0, y: 0 });
  assert.deepEqual(clampPosition({ x: 0, y: 0 }, { ...viewport, left: 100, top: 200 }), { x: 116, y: 216 });
});

test('trial only permits normal web URLs and excludes known restricted stores', () => {
  for (const url of ['https://example.com', 'http://localhost:8080']) assert.equal(isEligiblePage(url), true);
  for (const url of [undefined, '', 'bad', 'chrome://extensions', 'file:///tmp/test.html', 'about:blank', 'https://chromewebstore.google.com/detail/foo', 'https://chrome.google.com/webstore/detail/foo']) {
    assert.equal(isEligiblePage(url), false);
  }
});

test('Chrome adapter uses top-frame isolated injection and handles restrictions/failures', async () => {
  const previous = globalThis.chrome;
  let activeTab: Partial<chrome.tabs.Tab> | undefined = { id: 7, url: 'https://example.com', incognito: false };
  let fail = false;
  let injected = 0;
  globalThis.chrome = {
    runtime: { sendMessage: async () => ({ ok: true, value: { hidden: false, paused: false, position: null, allowed: false } }) },
    tabs: { query: async () => activeTab ? [activeTab] : [] },
    scripting: { executeScript: async (options: chrome.scripting.ScriptInjection<unknown[], unknown>) => {
      injected++;
      assert.deepEqual(options.target, { tabId: 7, frameIds: [0] });
      assert.equal(options.world, 'ISOLATED');
      assert.deepEqual(options.files, ['content/trial.js']);
      if (fail) throw new Error('Access denied');
      return [{ frameId: 0 }];
    } },
  } as unknown as typeof chrome;
  try {
    assert.match(await tryOnCurrentPage(), /Your cat is on this page/);
    fail = true;
    assert.match(await tryOnCurrentPage(), /couldn’t add/);
    for (const tab of [undefined, { id: 7, url: 'chrome://extensions' }, { id: 7, url: 'https://example.com', incognito: true }]) {
      activeTab = tab;
      assert.match(await tryOnCurrentPage(), /regular website/);
    }
    assert.equal(injected, 2);
  } finally {
    globalThis.chrome = previous;
  }
});
