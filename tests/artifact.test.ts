import assert from 'node:assert/strict';
import { readdir, readFile, stat } from 'node:fs/promises';
import { join } from 'node:path';
import { test } from 'node:test';
import { poses } from '../src/shared/character.ts';

async function totalBytes(path: string): Promise<number> {
  const info = await stat(path);
  if (info.isFile()) return info.size;
  const sizes = await Promise.all((await readdir(path)).map((name) => totalBytes(join(path, name))));
  return sizes.reduce((sum, size) => sum + size, 0);
}

test('artifact is local-only MV3 with a complete popup and optional site access and local settings', async () => {
  const manifest = JSON.parse(await readFile('dist/manifest.json', 'utf8'));
  assert.equal(manifest.manifest_version, 3);
  assert.equal(manifest.version, JSON.parse(await readFile('package.json', 'utf8')).version);
  for (const key of ['host_permissions', 'content_scripts', 'web_accessible_resources']) {
    assert.equal(manifest[key], undefined, `${key} requires a future scope decision`);
  }
  assert.deepEqual(manifest.permissions, ['activeTab', 'scripting', 'storage']);
  assert.deepEqual(manifest.optional_host_permissions, ['http://*/*', 'https://*/*']);
  await stat(manifest.background.service_worker.replace(/^/, 'dist/'));
  await stat('dist/content/trial.js');
  assert.ok((await stat('dist/content/content.js')).size < 75_000);
  const html = await readFile(join('dist', manifest.action.default_popup), 'utf8');
  for (const match of html.matchAll(/(?:src|href)="([^"]+)"/g)) {
    assert.ok(match[1]);
    assert.doesNotMatch(match[1], /^(?:https?:|\/\/|data:)/);
    await stat(join('dist/popup', match[1]));
  }
  assert.doesNotMatch(html, /\son\w+=/i);
  for (const script of html.matchAll(/<script\b[^>]*>([\s\S]*?)<\/script>/gi)) {
    assert.equal(script[1]?.trim(), '', 'No inline JavaScript');
  }
});

test('optimized poses retain dimensions and stay within asset/node budgets', async () => {
  for (const pose of poses) {
    const svg = await readFile(`dist/assets/cat/${pose}.svg`, 'utf8');
    assert.match(svg, /viewBox="0 0 110 100"/);
    assert.doesNotMatch(svg, /<(?:script|foreignObject|image|animate)\b|\son\w+=/i);
    assert.ok([...svg.matchAll(/<[a-z][\w-]*\b/gi)].length < 150);
  }
  const assets = await totalBytes('dist/assets/cat');
  const all = await totalBytes('dist');
  assert.ok(assets < 100_000);
  assert.ok(all < 1_000_000);
  console.log(`Artifact: ${all} bytes unpacked; cat assets: ${assets} bytes.`);
});
