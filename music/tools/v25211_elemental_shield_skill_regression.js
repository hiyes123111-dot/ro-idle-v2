#!/usr/bin/env node
'use strict';
const fs = require('fs');
const path = require('path');
const root = path.resolve(__dirname, '..');
const engine = fs.readFileSync(path.join(root, 'js/engine.js'), 'utf8');
const start = engine.indexOf('function monsterCastSkillInner');
const end = engine.indexOf('\nfunction ', start + 10);
const skillDamage = engine.slice(start, end > start ? end : undefined);
const checks = [
  ['monster skill damage passes through shield absorption', /dmg = absorbWithShields\(state, dmg\);\s*state\.hp -= dmg;/.test(skillDamage)],
  ['shield absorption occurs after complete immunity checks', /relicNegatesHit\(\)[\s\S]*?return;[\s\S]*?dmg = absorbWithShields\(state, dmg\);/.test(skillDamage)],
  ['basic attacks and monster skills share the same shield helper', (engine.match(/absorbWithShields\(state, dmg\)/g) || []).length >= 2],
  ['shield remains one-hit charge based', /sh\.remainingCharges -= 1/.test(engine) && /if \(sh\.remainingCharges <= 0 \|\| sh\.remainingHp <= 0\)/.test(engine)],
];
for (const [name, ok] of checks) console.log(`${ok ? 'PASS' : 'FAIL'} ${name}`);
const failed = checks.filter(x => !x[1]).length;
console.log(`v2.5.211 elemental shield skill regression: ${checks.length - failed}/${checks.length} passed`);
if (failed) process.exit(1);
