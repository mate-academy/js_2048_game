'use strict';

const fs = require('fs');
const path = require('path');

const source = path.join(process.cwd(), 'src');
const destination = path.join(process.cwd(), 'dist');

fs.rmSync(destination, { recursive: true, force: true });
fs.cpSync(source, destination, { recursive: true });

process.stdout.write('Build completed in dist/\n');
