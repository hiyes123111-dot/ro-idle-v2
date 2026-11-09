#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const root = path.resolve(__dirname, '..');
const engine = fs.readFileSync(path.join(root, 'js/engine.js'), 'utf8');
const data = fs.readFileSync(path.join(root, 'js/data.js'), 'utf8');
function row(id) {
  const start = data.indexOf('"' + id + '":');
  if (start < 0) return '';
  const end = data.indexOf('\n  "', start + 1);
  return data.slice(start, end < 0 ? start + 5000 : end);
}
const checks = [
  ['perBaseLv2 and perJobLv2 are aggregated', /per\(BaseLv1\|BaseLv2[\s\S]{0,150}JobLv2/.test(engine)],
  ['capped BaseLv5 prefix is normalized', engine.includes("'perBaseLv5Cap100_'" )],
  ['capped BaseLv10 prefix is normalized', engine.includes("'perBaseLv10Cap150_'" )],
  ['capped BaseLv5 calculation caps at 100', engine.includes('Math.min(state.baseLevel || 0, 100) / 5')],
  ['capped BaseLv10 calculation caps at 150', engine.includes('Math.min(state.baseLevel || 0, 150) / 10')],
  ['Paradise cap A gains ATK per 5 levels', row('item_1para_cap_a').includes('perBaseLv5Cap100_atk')],
  ['Paradise cap B gains MATK per 5 levels', row('item_1para_cap_b').includes('perBaseLv5Cap100_matk')],
  ['Paradise armor A gains HP per 5 levels', row('item_1para_armor_a').includes('perBaseLv5Cap100_hp')],
  ['Paradise armor B gains HP per 5 levels', row('item_1para_armor_b').includes('perBaseLv5Cap100_hp')],
  ['Paradise boots A gains CRI per 5 levels', row('item_1para_boots_a').includes('perBaseLv5Cap100_critRate')],
  ['Paradise boots B gains MATK per 5 levels', row('item_1para_boots_b').includes('perBaseLv5Cap100_matk')],
  ['Paradise boots B base all-element magic damage is implemented', row('item_1para_boots_b').includes('"magicAllDmgPct":3')],
  ['Advanced boots A HP/SP are level-scaled, not unconditional', !row('item_2para_boots_a').includes(',"hp":50') && !row('item_2para_boots_a').includes(',"sp":20')],
  ['Advanced boots B HP/SP are level-scaled, not unconditional', !row('item_2para_boots_b').includes(',"hp":40') && !row('item_2para_boots_b').includes(',"sp":30')],
  ['Advanced boots B base all-element magic damage is implemented', row('item_2para_boots_b').includes('"magicAllDmgPct":10')],
  ['No unconsumed cast-delay or variable-cast keys were added', !row('item_2para_boots_b').includes('variableCastPct') && !row('item_2para_armor_a').includes('afterCastPct')],
  ['Advanced armor A gains ATK per 10 levels', row('item_2para_armor_a').includes('perBaseLv10Cap150_atk')],
  ['Advanced armor B gains MATK per 10 levels', row('item_2para_armor_b').includes('perBaseLv10Cap150_matk')],
  ['Advanced boots A gains HP/SP per 10 levels', row('item_2para_boots_a').includes('perBaseLv10Cap150_hp') && row('item_2para_boots_a').includes('perBaseLv10Cap150_sp')],
  ['Advanced boots B gains HP/SP per 10 levels', row('item_2para_boots_b').includes('perBaseLv10Cap150_hp') && row('item_2para_boots_b').includes('perBaseLv10Cap150_sp')],
  ['Previously fixed Time Keeper and Valkyrie keys are aggregated', /per\(BaseLv1\|BaseLv2[\s\S]{0,150}JobLv2/.test(engine)],
];
let failed = 0;
for (const [name, ok] of checks) {
  console.log(`${ok ? 'PASS' : 'FAIL'} ${name}`);
  if (!ok) failed++;
}
if (failed) process.exit(1);
