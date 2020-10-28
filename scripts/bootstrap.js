'use strict';

const path = require('path');
const util = require('util');
const exec = util.promisify(require('child_process').exec);

const rootDir = path.join(__dirname, '..');
const serverDir = path.join(rootDir, 'server');
const websocketDir = path.join(rootDir, 'websocket');

async function installDependencies(dir) {
  await exec('npm install', {
    cwd: dir,
  });
}

/* eslint-disable no-console*/
async function bootstrap() {
  console.log('Start install dependencies...\n');
  console.log('Start install server dependencies...\n');
  await installDependencies(serverDir);
  console.log('Api dependencies installed success.');
  console.log('Start install websocket dependencies...\n');
  await installDependencies(websocketDir);
  console.log('Frontend dependencies installed success.');
  console.log('All dependencies installed.');
}

bootstrap();

process.on('unhandledRejection', (e) => {
  throw e;
});
