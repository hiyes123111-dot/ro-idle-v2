#!/usr/bin/env node
'use strict';
const fs = require('fs');
const version = fs.readFileSync('VERSION.txt', 'utf8').trim();
const html = fs.readFileSync('index.html', 'utf8');
const refs = [...html.matchAll(/\?v=([0-9.]+)/g)].map(m => m[1]);
const checks = [
  ['VERSION.txt is 2.5.230', version === '2.5.230'],
  ['all 22 HTML asset cache references use 2.5.230', refs.length === 22 && refs.every(v => v === version)],
  ['no stale 2.5.228 cache reference remains in index.html', !html.includes('2.5.228')],
];
for (const [name, ok] of checks) console.log(`${ok ? 'PASS' : 'FAIL'} ${name}`);
const failed = checks.filter(([, ok]) => !ok).length;
console.log(`v2.5.230 release: ${checks.length - failed}/${checks.length} passed`);
if (failed) process.exit(1);
