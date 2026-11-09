const fs = require('fs');
const vm = require('vm');
const src = fs.readFileSync('js/engine.js', 'utf8');
const start = src.indexOf('function canonicalBonusKey(key) {');
if (start < 0) throw new Error('canonicalBonusKey missing');
const end = src.indexOf('\nfunction ', start + 10);
if (end < 0) throw new Error('canonicalBonusKey end missing');
const fn = src.slice(start, end) + '\nthis.canonicalBonusKey = canonicalBonusKey;';
const ctx = {};
vm.runInNewContext(fn, ctx);
const cases = [
  ['perBaseLv10Cap160_p_atk', 'perBaseLv10Cap160_pAtk'],
  ['perBaseLv10Cap160_smatk', 'perBaseLv10Cap160_sMatk'],
  ['perBaseLv10Start20Cap120_p_atk', 'perBaseLv10Start20Cap120_pAtk'],
  ['perBaseLv10Start20Cap120_smatk', 'perBaseLv10Start20Cap120_sMatk'],
  ['perBaseLv10_atk', 'perBaseLv10_atk'],
  ['perJobLv5_pow', 'perJobLv5_pow']
];
for (const [input, expected] of cases) {
  const actual = ctx.canonicalBonusKey(input);
  if (actual !== expected) throw new Error(`${input}: expected ${expected}, got ${actual}`);
  console.log(`PASS ${input} -> ${actual}`);
}
console.log(`PASS ${cases.length} level-bonus alias assertions`);
