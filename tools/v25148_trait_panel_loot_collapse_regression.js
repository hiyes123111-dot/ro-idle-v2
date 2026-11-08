#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const root = path.resolve(__dirname, '..');
const ui = fs.readFileSync(path.join(root, 'js/ui.js'), 'utf8');
const css = fs.readFileSync(path.join(root, 'css/style.css'), 'utf8');
const html = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
const version = fs.readFileSync(path.join(root, 'VERSION.txt'), 'utf8').trim();
const checks = [
  ['version', version === '2.5.148'],
  ['six traits adjacent to basic stats', ui.includes('class="trait-stats-panel"') &&
    ['POW','STA','WIS','SPL','CON','CRT'].every(x => ui.includes(`['${x}'`))],
  ['derived trait values', ui.includes('trait-derived-line') && ui.includes('state.traitStats?.[key]')],
  ['loot feed collapsed by default', ui.includes('let _lootFeedCollapsed = true;')],
  ['loot feed still toggleable', ui.includes('_lootFeedCollapsed=!_lootFeedCollapsed;renderLootNotices()')],
  ['trait panel styling', css.includes('.trait-stats-panel') && css.includes('.trait-stats-grid')],
  ['asset cache version', html.includes('js/ui.js?v=2.5.148') && new Set((html.match(/v2\.5\.\d+/g) || [])).size === 1]
];
let failed = 0;
for (const [name, ok] of checks) { console.log(`${ok ? 'PASS' : 'FAIL'} ${name}`); if (!ok) failed++; }
process.exit(failed ? 1 : 0);
