'use strict';

const fs = require('fs');
const http = require('http');
const path = require('path');

const MIME_TYPES = {
  '.css': 'text/css; charset=utf-8',
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.png': 'image/png',
  '.svg': 'image/svg+xml',
};

function createStaticServer(rootDirectory) {
  const root = path.resolve(rootDirectory);

  return http.createServer((request, response) => {
    const requestPath = decodeURIComponent(request.url.split('?')[0]);
    const relativePath = requestPath === '/' ? 'index.html' : requestPath.slice(1);
    const filePath = path.resolve(root, relativePath);

    if (!filePath.startsWith(`${root}${path.sep}`) && filePath !== root) {
      response.writeHead(403);
      response.end('Forbidden');
      return;
    }

    fs.readFile(filePath, (error, content) => {
      if (error) {
        response.writeHead(error.code === 'ENOENT' ? 404 : 500);
        response.end(error.code === 'ENOENT' ? 'Not found' : 'Server error');
        return;
      }

      const contentType = MIME_TYPES[path.extname(filePath)]
        || 'application/octet-stream';

      response.writeHead(200, { 'Content-Type': contentType });
      response.end(content);
    });
  });
}

if (require.main === module) {
  const server = createStaticServer(path.join(process.cwd(), 'src'));
  const port = Number(process.env.PORT) || 3000;

  server.listen(port, '127.0.0.1', () => {
    process.stdout.write(`2048 server running at http://127.0.0.1:${port}\n`);
  });
}

module.exports = createStaticServer;
