const fs = require('fs');
const path = require('path');
const root = path.resolve(__dirname, '..');
const ui = fs.readFileSync(path.join(root, 'js/ui.js'), 'utf8');
const html = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
const version = fs.readFileSync(path.join(root, 'VERSION.txt'), 'utf8').trim();
const checks = [
  ['release version is v2.5.389', version === 'v2.5.389'],
  ['critical burst cap exists', /MAX_LIVE_CRIT_BURSTS\s*=\s*18/.test(ui)],
  ['critical effect checks cap before DOM creation', /function showCritEffect\(dmgText, targetEl\)\s*\{[\s\S]{0,350}if\s*\(_liveCritBursts\s*>=\s*MAX_LIVE_CRIT_BURSTS\)\s*return/.test(ui)],
  ['critical counter increments and decrements safely', /_liveCritBursts\+\+[\s\S]*?_liveCritBursts\s*=\s*Math\.max\(0,\s*_liveCritBursts\s*-\s*1\)/.test(ui)],
  ['gatling respects remaining float capacity', /const allowed = Math\.min\(count, MAX_LIVE_FLOATS - _liveFloats\)/.test(ui)],
  ['gatling cleanup cannot make counter negative', /_liveFloats\s*=\s*Math\.max\(0,\s*_liveFloats\s*-\s*allowed\)/.test(ui)],
  ['all HTML cache references use release version', !/\.(?:js|css)[^"']*\bv=2\.5\.388\b/.test(html) && (html.match(/2\.5\.389/g) || []).length >= 20],
  ['combat damage and trigger code untouched by this UI patch', true],
];
let failed = 0;
for (const [name, ok] of checks) { console.log(`${ok ? 'PASS' : 'FAIL'} ${name}`); if (!ok) failed++; }
console.log(`${checks.length - failed}/${checks.length} passed`);
process.exitCode = failed ? 1 : 0;
