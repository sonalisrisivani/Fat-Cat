import assert from 'node:assert/strict';
import { test } from 'node:test';
import { readFile } from 'node:fs/promises';
import { runInNewContext } from 'node:vm';

test('worker serializes writes, persists registration, rejects bad senders, and reconciles revocation', async () => {
  const data: Record<string, unknown> = {};
  let failWrite = false;
  let origins = ['https://example.com/*'];
  let scripts: chrome.scripting.RegisteredContentScript[] = [];
  let received: ((message: unknown, sender: chrome.runtime.MessageSender, respond: (value: unknown) => void) => boolean) | undefined;
  const events: Record<string, (permissions?: { origins: string[] }) => void> = {};
  const event = (key: string) => ({ addListener: (listener: (permissions?: { origins: string[] }) => void) => { events[key] = listener; } });
  const api = {
    runtime: {
      id: 'test', getURL: (path: string) => `chrome-extension://test/${path}`,
      onMessage: { addListener: (listener: typeof received) => { received = listener; } },
      onStartup: event('startup'), onInstalled: event('installed'),
    },
    tabs: { query: async () => [], sendMessage: async () => undefined },
    storage: { local: {
      get: async () => structuredClone(data),
      set: async (values: Record<string, unknown>) => { if (failWrite) { failWrite = false; throw new Error('Storage failed'); } await new Promise((resolve) => setImmediate(resolve)); Object.assign(data, values); },
    } },
    permissions: { getAll: async () => ({ origins }), onAdded: event('added'), onRemoved: event('removed') },
    scripting: {
      getRegisteredContentScripts: async () => scripts,
      registerContentScripts: async (values: typeof scripts) => { scripts = values; },
      updateContentScripts: async (values: typeof scripts) => { scripts = values; },
      unregisterContentScripts: async () => { scripts = []; },
    },
  };
  const bundle = await readFile('dist/background/worker.js', 'utf8');
  const boot = () => runInNewContext(bundle, { chrome: api, console, URL });
  const popup = { id: 'test', url: 'chrome-extension://test/popup/index.html' };
  const content = { id: 'test', url: 'https://example.com/path', frameId: 0, tab: { id: 1 } } as chrome.runtime.MessageSender;
  const send = (message: unknown, sender = popup as chrome.runtime.MessageSender) => new Promise<{ ok: boolean; value?: unknown }>((resolve) => {
    received!(message, sender, (value) => resolve(value as { ok: boolean; value?: unknown }));
  });
  boot();
  assert.equal((await send({ type: 'reconcile' })).ok, true);
  assert.equal(scripts[0]?.persistAcrossSessions, true);
  assert.equal(scripts[0]?.allFrames, false);
  assert.equal(scripts[0]?.matches?.[0], 'https://example.com/*');
  const results = await Promise.all([
    send({ type: 'hidden', site: 'https://example.com', value: true }, content),
    send({ type: 'position', site: 'https://example.com', value: { x: .2, y: .8 } }, content),
    send({ type: 'paused', value: true }),
  ]);
  assert.ok(results.every((result) => result.ok));
  const state = (await send({ type: 'state', site: 'https://example.com' })).value;
  assert.equal(JSON.stringify(state), JSON.stringify({ hidden: true, position: { x: .2, y: .8 }, paused: true, allowed: true }));
  assert.equal((await send({ type: 'paused', value: false }, content)).ok, false);
  assert.equal((await send({ type: 'hidden', site: 'https://another.com', value: true }, content)).ok, false);
  assert.equal((await send({ type: 'state', site: 'https://example.com' }, { ...content, frameId: 1 })).ok, false);
  assert.equal((await send({ type: 'paused', value: 'no' })).ok, false);
  failWrite = true;
  assert.equal((await send({ type: 'paused', value: false })).ok, false);
  assert.equal((await send({ type: 'state', site: 'https://example.com' })).ok, true, 'failed write must not poison the queue');
  boot(); // New worker, same stored data and browser-managed registrations.
  events.startup!();
  assert.equal((await send({ type: 'state', site: 'https://example.com' })).ok, true);
  assert.equal(scripts.length, 1);
  assert.equal((await send({ type: 'show', site: 'https://example.com' }, content)).ok, false, 'only popup may override legacy pause');
  assert.equal((await send({ type: 'show', site: 'https://ungranted.com' })).ok, false, 'Show requires a real site grant');
  assert.equal((await send({ type: 'show', site: 'https://example.com' })).ok, true);
  const shown = (await send({ type: 'state', site: 'https://example.com' })).value as { paused: boolean; hidden: boolean; position: unknown };
  assert.equal(shown.paused, false);
  assert.equal(shown.hidden, false);
  assert.equal(JSON.stringify(shown.position), JSON.stringify({ x: .2, y: .8 }));
  assert.equal(data.paused, true, 'Show never resumes other globally paused sites');
  const other = (await send({ type: 'state', site: 'https://other.com' })).value as { paused: boolean };
  assert.equal(other.paused, true);
  boot();
  assert.equal(((await send({ type: 'state', site: 'https://example.com' })).value as { paused: boolean }).paused, false, 'site choice survives restart');
  origins = [];
  events.removed!({ origins: ['https://example.com/*'] });
  const revoked = await send({ type: 'state', site: 'https://example.com' });
  assert.equal((revoked.value as { allowed: boolean }).allowed, false);
  assert.equal(scripts.length, 0);
});
