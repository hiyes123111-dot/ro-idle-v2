#!/usr/bin/env node
'use strict';
const fs = require('fs');
const path = require('path');
const root = path.resolve(__dirname, '..');
const skills = fs.readFileSync(path.join(root, 'js/skills.js'), 'utf8');
const engine = fs.readFileSync(path.join(root, 'js/engine.js'), 'utf8');
const control = skills.split(/\r?\n/).find(x => x.includes('so_elementcontrol: {')) || '';
const checks = [
  ['assist mode restores HP and SP periodically', /spirit\.mode === 'passive' && now >= \(spirit\.nextSupportAt \|\| 0\)/.test(engine) && /state\.maxHp \|\| 1\) \* 0\.01/.test(engine) && /state\.maxSp \|\| 1\) \* 0\.01/.test(engine)],
  ['defensive mode reduces monster skill damage by 15%', /elementalSpirit\.mode === 'defensive'\) dmg = Math\.max\(1, Math\.round\(dmg \* 0\.85\)\)/.test(engine)],
  ['defensive mode reduces monster basic attack damage by 15%', (engine.match(/elementalSpirit\.mode === 'defensive'\) dmg = Math\.max\(1, Math\.round\(dmg \* 0\.85\)\)/g) || []).length === 2],
  ['same shield is replaced instead of stacked', /state\.shields = state\.shields\.filter\(sh => sh\.id !== sk\.id\);\s*state\.shields\.push\(\{ id: sk\.id/.test(engine)],
  ['Elemental Control documents assist and defense effects', /輔助模式（每 5 秒回復 1% 最大 HP\/SP）、Lv2 防禦模式（受到怪物普攻與技能傷害降低 15%）/.test(control)],
  ['summons remain automatic and start in offensive mode', /mode: 'offensive'/.test(engine) && /!sk\.manualOnly/.test(engine)],
];
for (const [name, ok] of checks) console.log(`${ok ? 'PASS' : 'FAIL'} ${name}`);
const failed = checks.filter(x => !x[1]).length;
console.log(`v2.5.210 elemental modes/shield regression: ${checks.length - failed}/${checks.length} passed`);
if (failed) process.exit(1);
