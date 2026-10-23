import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';

const files = new Map([
  ['/popup/index.html', 'text/html'],
  ['/popup/popup.js', 'text/javascript'],
  ['/popup/popup.css', 'text/css'],
  ...['sleep', 'stretch', 'pet'].map((pose) => [`/assets/cat/${pose}.svg`, 'image/svg+xml'])
]);
const server = createServer(async (request, response) => {
  if (request.url === '/') {
    response.writeHead(302, { Location: '/popup/index.html' }).end();
    return;
  }
  const path = request.url;
  if (!files.has(path)) {
    response.writeHead(404).end('Not found');
    return;
  }
  try {
    const content = await readFile(new URL(`../dist${path}`, import.meta.url));
    response.writeHead(200, {
      'Content-Type': files.get(path),
      'Content-Security-Policy': "default-src 'self'; object-src 'none'",
      'Cache-Control': 'no-store'
    }).end(content);
  } catch {
    response.writeHead(503).end('Build first with npm run build.');
  }
});
server.listen(4173, '127.0.0.1', () => console.log('Preview: http://127.0.0.1:4173'));
