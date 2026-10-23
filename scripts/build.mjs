import { cp, mkdir, readFile, rm, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { build } from 'esbuild';
import { optimize } from 'svgo';

const root = fileURLToPath(new URL('../', import.meta.url));
process.chdir(root);
await rm('dist', { recursive: true, force: true });
await mkdir('dist/popup', { recursive: true });
await mkdir('dist/assets/cat', { recursive: true });
await build({
  entryPoints: ['src/popup/popup.ts'],
  outdir: 'dist/popup',
  bundle: true,
  minify: true,
  format: 'esm',
  target: ['chrome120'],
  legalComments: 'none',
  loader: { '.svg': 'text' },
});
await cp('src/manifest.json', 'dist/manifest.json');
await cp('src/popup/index.html', 'dist/popup/index.html');
await build({
  entryPoints: ['src/popup/popup.css'],
  outdir: 'dist/popup',
  minify: true,
  target: ['chrome120'],
});
for (const pose of ['sleep', 'stretch', 'pet']) {
  const path = `assets/cat/${pose}.svg`;
  const result = optimize(await readFile(path, 'utf8'), {
    path,
    multipass: true,
    plugins: [{ name: 'preset-default' }],
  });
  await writeFile(`dist/${path}`, result.data + '\n');
}
await build({
  entryPoints: ['src/content/content.ts', 'src/content/trial.ts'],
  outdir: 'dist/content',
  bundle: true,
  minify: true,
  format: 'iife',
  target: ['chrome120'],
  legalComments: 'none',
  loader: { '.css': 'text' },
  plugins: [{
    name: 'optimized-svg-text',
    setup(builder) {
      builder.onLoad({ filter: /\.svg$/ }, async ({ path }) => ({
        // Preserve invisible rig parts: native animations reveal them at runtime.
        contents: path.endsWith('/marmalade.svg') ? await readFile(path, 'utf8') : optimize(await readFile(path, 'utf8'), { multipass: true }).data,
        loader: 'text',
      }));
    },
  }],
});
console.log('Built Fat Cat popup and page trial in dist/.');

await build({ entryPoints: ['src/background/worker.ts'], outdir: 'dist/background', bundle: true, minify: true, format: 'esm', target: ['chrome120'] });
