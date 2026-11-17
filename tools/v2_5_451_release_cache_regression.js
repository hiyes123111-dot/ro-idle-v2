#!/usr/bin/env node
'use strict';
const fs = require('fs');
const path = require('path');
const root = path.resolve(__dirname, '..');
const version = fs.readFileSync(path.join(root, 'VERSION.txt'), 'utf8').trim();
if (version !== '2.5.451') throw new Error(`VERSION.txt mismatch: ${version}`);
const html = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
const refs = [...html.matchAll(/(?:src|href)="[^"]+\?v=([^"&]+)"/g)].map(m => m[1]);
if (refs.length < 50 || refs.some(v => v !== version)) throw new Error(`index.html resource versions mismatch: ${[...new Set(refs)].join(', ')}`);
const sw = fs.readFileSync(path.join(root, 'sw.js'), 'utf8');
if (!sw.includes(`ro-idle-runtime-v${version}`) || !html.includes(`./sw.js?v=${version}`)) throw new Error('Service Worker cache/version mismatch');
console.log(`PASS v2.5.451 release/cache regression (${refs.length} resource refs, version ${version})`);
