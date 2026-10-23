import { cp, mkdir } from 'node:fs/promises';
import { build } from 'esbuild';
import { fileURLToPath } from 'node:url';
process.chdir(fileURLToPath(new URL('../', import.meta.url)));
await mkdir('build/preview/assets/cat', { recursive: true });
await build({ entryPoints: ['preview/main.ts'], outfile: 'build/preview/main.js', bundle: true, format: 'esm', target: ['chrome120'] });
// Standalone modules keep the original renderer/schema regression tests reusable.
await build({ entryPoints: ['src/character/motion.ts', 'src/character/renderer.ts'], outdir: 'build/preview/modules', bundle: true, format: 'esm', target: ['chrome120'] });
for (const name of ['index.html', 'style.css']) await cp(`preview/${name}`, `build/preview/${name}`);
for (const name of ['marmalade.svg', 'motions.json']) await cp(`assets/cat/${name}`, `build/preview/assets/cat/${name}`);
console.log('Built standalone studio in build/preview/');
