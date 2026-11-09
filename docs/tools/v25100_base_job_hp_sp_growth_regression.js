#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const root = path.resolve(__dirname, '..');
const dataText = fs.readFileSync(path.join(root, 'js/data.js'), 'utf8');
const engine = fs.readFileSync(path.join(root, 'js/engine.js'), 'utf8');
function item(id) {
  const start = dataText.indexOf('"' + id + '":');
  if (start < 0) return '';
  const end = dataText.indexOf('\\n  "', start + 1);
  return dataText.slice(start, end < 0 ? start + 3000 : end);
}
const checks = [
  ['perBaseLv2 canonical key', engine.includes("'perBaseLv2_'")],
  ['perJobLv2 canonical key', engine.includes("'perJobLv2_'")],
  ['perBaseLv2 calculation', engine.includes("Math.floor((state.baseLevel || 0) / 2) * all[k]")],
  ['perJobLv2 calculation', engine.includes("Math.floor((state.jobLevel || 0) / 2) * all[k]")],
  ['Chameleon Armor BaseLv HP/SP', item('chameleon_armor').includes('"perBaseLv1_hp":1,"perBaseLv1_sp":1')],
  ['Valkyrie Shoes BaseLv/JobLv conditions', item('valkyrie_shoes').includes('"perBaseLv1_hp":5') && item('valkyrie_shoes').includes('"perJobLv1_sp":2')],
  ['Time Keeper Ring BaseLv+2 HP', item('time_keeper_ring').includes('"perBaseLv2_hp":15')],
];
let failed = 0;
for (const [name, ok] of checks) {
  console.log(`${ok ? 'PASS' : 'FAIL'} ${name}`);
  if (!ok) failed++;
}
if (failed) process.exit(1);
