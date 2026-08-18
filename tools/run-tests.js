'use strict';

const path = require('path');
const { spawn } = require('child_process');
const createStaticServer = require('./server');

const isWindows = process.platform === 'win32';

function localBinary(name) {
  return path.join(
    process.cwd(),
    'node_modules',
    '.bin',
    `${name}${isWindows ? '.cmd' : ''}`,
  );
}

function run(command, args) {
  return new Promise((resolve, reject) => {
    const child = spawn(command, args, {
      cwd: process.cwd(),
      stdio: 'inherit',
      shell: isWindows,
    });

    child.on('error', reject);
    child.on('exit', code => {
      if (code === 0) {
        resolve();
      } else {
        reject(new Error(`${path.basename(command)} exited with code ${code}`));
      }
    });
  });
}

async function main() {
  await run(localBinary('jest'), [
    'tests/Game.class.test.js',
    '--runInBand',
  ]);

  const server = createStaticServer(path.join(process.cwd(), 'src'));

  await new Promise((resolve, reject) => {
    server.once('error', reject);
    server.listen(0, '127.0.0.1', resolve);
  });

  const { port } = server.address();

  try {
    await run(localBinary('cypress'), [
      'run',
      '--config',
      `baseUrl=http://127.0.0.1:${port}`,
    ]);
  } finally {
    await new Promise(resolve => server.close(resolve));
  }
}

main().catch(error => {
  process.stderr.write(`${error.stack || error.message}\n`);
  process.exitCode = 1;
});
