import assert from 'node:assert/strict';
import { readFile, readdir, stat } from 'node:fs/promises';
import test from 'node:test';
import { fileURLToPath } from 'node:url';
import { build } from 'esbuild';

const output = new URL('../dist/', import.meta.url);
const read = (path) => readFile(new URL(path, output), 'utf8');

test('MV3 popup packages only local assets and requests no access', async () => {
  const manifest = JSON.parse(await read('manifest.json'));
  assert.equal(manifest.manifest_version, 3);
  for (const key of ['permissions', 'host_permissions', 'optional_permissions', 'optional_host_permissions', 'content_scripts', 'background', 'web_accessible_resources']) {
    assert.equal(manifest[key], undefined, `Unexpected capability: ${key}`);
  }
  const html = await read(manifest.action.default_popup);
  const references = [...html.matchAll(/(?:src|href)="([^"]+)"/g)].map((match) => match[1]);
  assert.ok(references.length >= 3);
  for (const reference of references) {
    assert.doesNotMatch(reference, /^(?:https?:|\/\/|data:)/);
    const asset = new URL(reference, new URL(manifest.action.default_popup, output));
    assert.ok(asset.href.startsWith(output.href));
    assert.ok((await stat(asset)).size > 0);
  }
});

test('optimized artwork keeps viewBox, safe vector content and budgets', async () => {
  let bytes = 0;
  for (const pose of ['sleep', 'stretch', 'pet']) {
    const svg = await read(`assets/cat/${pose}.svg`);
    assert.match(svg, /viewBox="0 0 100 100"/);
    assert.doesNotMatch(svg, /<(?:script|foreignObject|image)\b|\bon\w+=|(?:href|url\()/i);
    const nodes = [...svg.matchAll(/<[a-z][\w:-]*\b/g)].length;
    assert.ok(nodes <= 150, `${pose}: ${nodes} nodes`);
    bytes += Buffer.byteLength(svg);
    console.log(`${pose}: ${Buffer.byteLength(svg)} bytes, ${nodes} SVG elements`);
  }
  assert.ok(bytes < 100_000, `Artwork: ${bytes} bytes`);
  async function size(directory) {
    let total = 0;
    for (const entry of await readdir(directory, { withFileTypes: true })) {
      const child = new URL(entry.name + (entry.isDirectory() ? '/' : ''), directory);
      total += entry.isDirectory() ? await size(child) : (await stat(child)).size;
    }
    return total;
  }
  const total = await size(output);
  assert.ok(total < 1_000_000, `Unpacked: ${total} bytes`);
  console.log(`Unpacked extension: ${total} bytes`);
});

test('pose validation rejects malformed and inherited values', async () => {
  const result = await build({
    entryPoints: [fileURLToPath(new URL('../src/shared/cat-poses.ts', import.meta.url))],
    bundle: true, write: false, format: 'esm', platform: 'node'
  });
  const module = await import(`data:text/javascript;base64,${Buffer.from(result.outputFiles[0].text).toString('base64')}`);
  for (const pose of ['sleep', 'stretch', 'pet']) assert.equal(module.isCatPose(pose), true);
  for (const value of [null, undefined, {}, 0, '', 'walk', '__proto__', 'constructor', 'toString']) {
    assert.equal(module.isCatPose(value), false);
  }
});
