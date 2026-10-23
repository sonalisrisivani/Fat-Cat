import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { test } from 'node:test';
import { JSDOM } from 'jsdom';

async function setup(options: { allowed?: boolean; hidden?: boolean; paused?: boolean; denied?: boolean; url?: string; fail?: boolean; injectFail?: boolean } = {}) {
  const dom = new JSDOM(await readFile('dist/popup/index.html', 'utf8'), { url: 'chrome-extension://test/popup/index.html', runScripts: 'outside-only' });
  const state = { allowed: options.allowed ?? false, hidden: options.hidden ?? false, paused: options.paused ?? false, position: null };
  let permissions = 0;
  let injections = 0;
  const messages: string[] = [];
  Object.defineProperty(dom.window, 'chrome', { value: {
    runtime: { sendMessage: async (message: { type: string; value: boolean }) => {
      if (options.fail) throw new Error('offline');
      messages.push(message.type);
      if (message.type === 'show') { state.hidden = false; state.paused = false; }
      if (message.type === 'hidden') state.hidden = message.value;
      return { ok: true, value: { ...state } };
    } },
    tabs: { query: async () => [{ id: 1, url: options.url ?? 'https://example.com/article' }] },
    permissions: { request: async (request: { origins: string[] }) => {
      permissions++;
      assert.deepEqual([...request.origins], ['https://example.com/*']);
      if (options.denied) return false;
      state.allowed = true; return true;
    } },
    scripting: { executeScript: async () => { injections++; if (options.injectFail) throw new Error('navigation'); } },
  } });
  dom.window.eval(await readFile('dist/popup/popup.js', 'utf8'));
  const flush = () => new Promise<void>(resolve => setImmediate(resolve));
  await flush();
  return { dom, state, messages, flush, button: dom.window.document.querySelector<HTMLButtonElement>('#site-toggle')!, status: () => dom.window.document.querySelector('#page-status')!.textContent!, permissions: () => permissions, injections: () => injections };
}

test('single Show/Hide button requests site access directly and remembers both choices', async () => {
  const f = await setup();
  try {
    assert.equal(f.dom.window.document.querySelectorAll('button').length, 1);
    assert.equal(f.button.textContent, 'Show cat');
    f.button.click();
    assert.equal(f.permissions(), 1, 'permission request occurs in click gesture');
    assert.equal(f.button.disabled, true);
    await f.flush();
    assert.equal(f.button.textContent, 'Hide cat');
    assert.equal(f.injections(), 1);
    f.button.click(); await f.flush();
    assert.equal(f.state.hidden, true);
    assert.equal(f.button.textContent, 'Show cat');
    f.button.click(); await f.flush();
    assert.equal(f.permissions(), 1, 'no repeated permission request for existing grant');
    assert.equal(f.state.hidden, false);
    assert.equal(f.button.textContent, 'Hide cat');
  } finally { f.dom.window.close(); }
});

test('permission denial leaves site hidden/disabled without injecting or saving Show', async () => {
  const f = await setup({ denied: true, hidden: true });
  try {
    f.button.click(); await f.flush();
    assert.equal(f.button.textContent, 'Show cat');
    assert.equal(f.button.disabled, false);
    assert.equal(f.state.hidden, true);
    assert.equal(f.injections(), 0);
    assert.ok(!f.messages.includes('show'));
    assert.match(f.status(), /wasn’t allowed/);
  } finally { f.dom.window.close(); }
});

for (const settings of [{ allowed: true }, { allowed: true, hidden: true }, { allowed: true, paused: true }]) {
  test(`saved visibility and legacy pause render correctly: ${JSON.stringify(settings)}`, async () => {
    const f = await setup(settings);
    try {
      assert.equal(f.button.textContent, settings.hidden || settings.paused ? 'Show cat' : 'Hide cat');
      if (settings.paused) {
        f.button.click(); await f.flush();
        assert.equal(f.button.textContent, 'Hide cat');
        assert.ok(f.messages.includes('show'));
        assert.ok(!f.messages.includes('paused'), 'never globally resume other sites');
      }
    } finally { f.dom.window.close(); }
  });
}
for (const options of [{ url: 'chrome://extensions' }, { fail: true }]) {
  test(`unavailable page/settings disable action with explanation: ${JSON.stringify(options)}`, async () => {
    const f = await setup(options);
    try {
      assert.equal(f.button.disabled, true);
      assert.equal(f.button.getAttribute('aria-busy'), 'false');
      assert.match(f.status(), /regular website|Couldn’t load/);
    } finally { f.dom.window.close(); }
  });
}
test('injection failure preserves choice and asks to refresh the webpage', async () => {
  const f = await setup({ injectFail: true });
  try {
    f.button.click(); await f.flush();
    assert.equal(f.button.textContent, 'Hide cat');
    assert.match(f.status(), /Refresh/);
  } finally { f.dom.window.close(); }
});
