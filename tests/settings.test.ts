import assert from 'node:assert/strict';
import { test } from 'node:test';
import { hasSiteAccess, isRequest, isState, readSite, siteFromUrl } from '../src/shared/settings.ts';
import { normalizePosition, restorePosition } from '../src/shared/position.ts';

test('settings validate corruption, messages, and normalized coordinates', () => {
  assert.deepEqual(readSite({ version: 8, hidden: true }), { hidden: false, position: null });
  assert.deepEqual(readSite({ version: 1, hidden: 'yes', position: { x: NaN, y: 0 } }), { hidden: false, position: null });
  for (const value of [null, [], { type: 'paused', value: 'false' }, { type: 'position', site: 'https://example.com', value: { x: 2, y: 1 } }, { type: 'hidden', site: 'file:///foo', value: true }]) {
    assert.equal(isRequest(value), false);
  }
  assert.equal(isRequest({ type: 'hidden', site: 'https://example.com', value: true }), true);
  assert.equal(isState({ paused: false, hidden: false, allowed: true, position: null }), true);
  assert.equal(isState({ paused: false, hidden: false, allowed: true, position: { x: Infinity, y: 0 } }), false);
});

test('site scope includes ports, excludes subdomains and other schemes', () => {
  assert.equal(siteFromUrl('https://example.com:8443/path?q=private'), 'https://example.com');
  assert.equal(siteFromUrl('chrome://settings'), null);
  assert.equal(hasSiteAccess('https://example.com', ['https://example.com/*']), true);
  assert.equal(hasSiteAccess('https://other.example.com', ['https://example.com/*']), false);
  assert.equal(hasSiteAccess('http://example.com', ['https://example.com/*']), false);
  assert.equal(hasSiteAccess('https://child.example.com', ['https://*.example.com/*']), true);
  assert.equal(hasSiteAccess('https://fakeexample.com', ['https://*.example.com/*']), false);
});

test('normalized positions survive viewport changes and stay inside bounds', () => {
  const large = { width: 1200, height: 800, left: 0, top: 0 };
  const small = { width: 320, height: 240, left: 0, top: 0 };
  for (const position of [{ x: 0, y: 0 }, { x: .5, y: .8 }, { x: 1, y: 1 }]) {
    const point = restorePosition(position, large);
    const normalized = normalizePosition(point, large);
    assert.ok(Math.abs(normalized.x - position.x) < 1e-10);
    assert.ok(Math.abs(normalized.y - position.y) < 1e-10);
    const restored = restorePosition(position, small);
    assert.ok(restored.x >= 16 && restored.x <= 200);
    assert.ok(restored.y >= 16 && restored.y <= 112);
  }
});
