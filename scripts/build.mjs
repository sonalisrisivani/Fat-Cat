import { cp, mkdir } from 'node:fs/promises';
await mkdir('dist/assets/cat', { recursive: true });
for (const name of ['marmalade.svg', 'motions.json']) {
  await cp(`assets/cat/${name}`, `dist/assets/cat/${name}`);
}
for (const name of ['index.html', 'style.css']) {
  await cp(`preview/${name}`, `dist/${name}`);
}
console.log('Built standalone preview in dist/');
