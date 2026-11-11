'use strict';
const fs = require('fs');
const vm = require('vm');
const src = fs.readFileSync('js/engine.js', 'utf8');
const start = src.indexOf('const MONSTER_RANGED_PHYSICAL_SKILLS = new Set([');
const end = src.indexOf('\n}\n', src.indexOf('function isMonsterRangedPhysicalSkill', start)) + 2;
if (start < 0 || end < 2) throw new Error('ranged physical helper not found');
const sandbox = {};
vm.runInNewContext(src.slice(start, end) + '\nthis.check = isMonsterRangedPhysicalSkill;', sandbox);
const check = sandbox.check;
const cases = [
  ['null is not ranged', null, false],
  ['magic skill is never physical ranged', { id: 'AC_DOUBLE', magic: true, rangeType: 'ranged' }, false],
  ['explicit bow skill ID is ranged', { id: 'AC_DOUBLE', magic: false }, true],
  ['explicit skill rangeType is ranged', { id: 'monster_arrow_volley', magic: false, rangeType: 'ranged' }, true],
  ['physical melee skill remains melee', { id: 'monster_claw', magic: false, rangeType: 'melee' }, false]
];
for (const [name, input, expected] of cases) {
  const actual = check(input);
  if (actual !== expected) throw new Error(`${name}: expected ${expected}, got ${actual}`);
  console.log('PASS', name);
}
console.log(`${cases.length}/${cases.length} passed`);
