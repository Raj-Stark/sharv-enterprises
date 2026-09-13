'use strict';

const fs = require('node:fs');
const path = require('node:path');
const { createStrapi } = require('@strapi/core');

const appDir = process.cwd();
const distDir = path.join(appDir, 'dist');
const publicDir = path.resolve(appDir, process.env.PUBLIC_DIR || './public');

fs.mkdirSync(path.join(publicDir, 'uploads'), { recursive: true });

const strapi = createStrapi({ appDir, distDir });

async function start() {
  await strapi.start();

  // Hostinger launches this entry file directly. Running recovery here, after
  // Strapi has started listening, keeps missing local uploads from surviving a
  // deployment just because a lifecycle hook was skipped by the host runtime.
  try {
    const { seedStarterContent } = require('./dist/src/bootstrap/starter-content');
    await seedStarterContent(strapi);
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    strapi.log.error(`Starter content initialization failed: ${message}`);
  }
}

void start();
