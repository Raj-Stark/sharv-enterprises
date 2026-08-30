'use strict';

const fs = require('node:fs');
const path = require('node:path');
const { createStrapi } = require('@strapi/core');

const appDir = process.cwd();
const distDir = path.join(appDir, 'dist');
const publicDir = path.resolve(appDir, process.env.PUBLIC_DIR || './public');

fs.mkdirSync(path.join(publicDir, 'uploads'), { recursive: true });

createStrapi({ appDir, distDir }).start();
