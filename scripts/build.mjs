import { build } from 'esbuild';
import { optimize } from 'svgo';
import { copyFile, mkdir, readFile, rm, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';

const root = new URL('../', import.meta.url);
const output = new URL('dist/', root);
await rm(output, { recursive: true, force: true });
await mkdir(new URL('popup/', output), { recursive: true });
await mkdir(new URL('assets/cat/', output), { recursive: true });
await build({
  absWorkingDir: fileURLToPath(root),
  entryPoints: ['src/popup/popup.ts', 'src/popup/popup.css'],
  outdir: 'dist/popup',
  bundle: true,
  minify: true,
  target: 'chrome120',
  format: 'esm',
  sourcemap: false
});
await copyFile(new URL('src/manifest.json', root), new URL('manifest.json', output));
await copyFile(new URL('src/popup/index.html', root), new URL('popup/index.html', output));
for (const pose of ['sleep', 'stretch', 'pet']) {
  const source = await readFile(new URL(`assets/cat/${pose}.svg`, root), 'utf8');
  const result = optimize(source, {
    multipass: true,
    plugins: ['preset-default']
  });
  await writeFile(new URL(`assets/cat/${pose}.svg`, output), `${result.data}\n`);
}
console.log('Built permission-free character preview in dist/.');
