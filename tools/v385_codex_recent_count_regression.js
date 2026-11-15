const fs = require('fs');
const path = require('path');
const root = path.resolve(__dirname, '..');
const ui = fs.readFileSync(path.join(root, 'js/ui.js'), 'utf8');
const html = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
const version = fs.readFileSync(path.join(root, 'VERSION.txt'), 'utf8').trim();
function check(ok, label) { if (!ok) throw new Error('FAIL ' + label); console.log('PASS ' + label); }
check(/^v2\.5\.\d+$/.test(version), 'release version uses semantic v2.5.x format');
check(/const recentCardCount = codexView === 'card'\s*\? allIds\.filter\(id => CARDS\[id\] && CARDS\[id\]\.addedVersion\)\.length\s*:\s*0;/.test(ui), 'recent-card count derives from full card pool and addedVersion');
check(ui.includes('近期新增 ${recentCardCount}'), 'codex button renders dynamic recent-card count');
check(!/近期新增\s*44/.test(ui), 'stale hard-coded recent-card count removed');
const refs = [...html.matchAll(/(?:src|href)="[^"]+\?v=([^"&]+)/g)].map(m => m[1]);
check(refs.length === 26, '26 HTML cache references remain present');
check(refs.every(v => v === version.replace(/^v/, '')), 'all HTML cache references match release version');
console.log('SUMMARY codex recent-count regression passed');
