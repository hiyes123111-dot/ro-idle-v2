#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const root = path.resolve(__dirname, '..');
const data = fs.readFileSync(path.join(root, 'js/data.js'), 'utf8');
const engine = fs.readFileSync(path.join(root, 'js/engine.js'), 'utf8');
function item(id) {
  const start = data.indexOf('"' + id + '":');
  if (start < 0) return '';
  const end = data.indexOf('\n  "', start + 1);
  return data.slice(start, end < 0 ? start + 3000 : end);
}
const ids = ['4th_q_necklace', 'item_4th_q_necklace'];
for (const id of ids) {
  const row = item(id);
  for (const stat of ['pow', 'spl', 'sta', 'wis', 'crt', 'con']) {
    if (!row.includes(`"${stat}":6`) || !row.includes(`"perJobLv5_${stat}":-1`)) {
      throw new Error(`${id} missing +6 / JobLv -1 per 5 levels for ${stat}`);
    }
  }
}
if (!engine.includes("'perJobLv5_'")) throw new Error('perJobLv5 canonical bonus key missing');
if (!engine.includes("Math.floor((state.jobLevel || 0) / 5) * all[k]")) throw new Error('perJobLv5 calculation missing');
if (!engine.includes("if (!k.startsWith('perJobLv5_')) continue;")) throw new Error('perJobLv5 target dispatch missing');
console.log('PASS both Hourglass Necklace IDs declare all six +6 trait bonuses');
console.log('PASS all six traits decay by -1 for every 5 JobLv');
console.log('PASS engine canonicalizes and calculates perJobLv5 bonuses');
