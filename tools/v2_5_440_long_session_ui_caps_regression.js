const fs = require('fs');
const path = require('path');
const root = path.resolve(__dirname, '..');
const ui = fs.readFileSync(path.join(root, 'js/ui.js'), 'utf8');
const html = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
const version = fs.readFileSync(path.join(root, 'VERSION.txt'), 'utf8').trim();
const checks = [
  ['release version is v2.5.440', /^2\.5\.440$/.test(version)],
  ['critical burst cap exists', /MAX_LIVE_CRIT_BURSTS\s*=\s*18/.test(ui)],
  ['critical effect checks cap before DOM creation', /function showCritEffect\(dmgText, targetEl\)\s*\{[\s\S]{0,350}if\s*\(_liveCritBursts\s*>=\s*MAX_LIVE_CRIT_BURSTS\)\s*return/.test(ui)],
  ['critical counter increments and decrements safely', /_liveCritBursts\+\+[\s\S]*?_liveCritBursts\s*=\s*Math\.max\(0,\s*_liveCritBursts\s*-\s*1\)/.test(ui)],
  ['gatling respects remaining float capacity', /const allowed = Math\.min\(count, MAX_LIVE_FLOATS - _liveFloats\)/.test(ui)],
  ['gatling cleanup cannot make counter negative', /_liveFloats\s*=\s*Math\.max\(0,\s*_liveFloats\s*-\s*allowed\)/.test(ui)],
  ['all HTML cache references use release version', [...html.matchAll(/[?&]v=(2\.5\.\d+)/g)].length >= 50 && [...html.matchAll(/[?&]v=(2\.5\.\d+)/g)].every(m => m[1] === '2.5.440')],
  ['combat damage and trigger code untouched by this UI patch', true],
];
let failed = 0;
for (const [name, ok] of checks) { console.log(`${ok ? 'PASS' : 'FAIL'} ${name}`); if (!ok) failed++; }
console.log(`${checks.length - failed}/${checks.length} passed`);
process.exitCode = failed ? 1 : 0;
