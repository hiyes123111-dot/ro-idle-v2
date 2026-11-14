#!/usr/bin/env node
'use strict';
const fs = require('fs');
const path = require('path');
const root = path.resolve(__dirname, '..');
const skills = fs.readFileSync(path.join(root, 'js/skills.js'), 'utf8');
const engine = fs.readFileSync(path.join(root, 'js/engine.js'), 'utf8');
const ids = ['so_summon_agni','so_summon_aqua','so_summon_ventus','so_summon_tera'];
const lines = Object.fromEntries(ids.map(id => [id, skills.split(/\r?\n/).find(x => x.includes(id + ': {')) || '']));
const checks = [
  ['all four elemental summons define upkeep costs 5/8/11 SP per 10 seconds', ids.every(id => /spDrainPer10Sec:\s*\[5,8,11\]/.test(lines[id]))],
  ['all four summon descriptions disclose the upkeep cost', ids.every(id => /每 10 秒消耗 5／8／11 SP/.test(lines[id]))],
  ['summoning stores the selected level upkeep cost and next drain time', /const spiritDrain = sk\.highElementalSpirit \? 0 : \(Array\.isArray\(sk\.spDrainPer10Sec\) \? sk\.spDrainPer10Sec\[lv - 1\] : \(sk\.spDrainPer10Sec \|\| 0\)\)[\s\S]*?spDrainPer10Sec: spiritDrain, nextSpDrainAt: summonNow \+ 10000/.test(engine)],
  ['tickBuffs processes elemental spirit upkeep every 10 seconds', /元素精靈維持費[\s\S]*?spirit\.nextSpDrainAt = now \+ 10000/.test(engine)],
  ['insufficient SP dismisses the elemental spirit', /if \(state\.sp < spirit\.spDrainPer10Sec\) \{[\s\S]*?state\.elementalSpirit = null;[\s\S]*?元素精靈離開了/.test(engine)],
  ['sufficient SP is deducted and logged', /state\.sp -= spirit\.spDrainPer10Sec;[\s\S]*?元素精靈維持消耗/.test(engine)],
  ['Tera prerequisite uses the current Earth Grave skill ID', /so_summon_tera:[^\n]*requires: \[\{ skillId: 'so_earthgrave', level: 3 \}/.test(skills)],
  ['legacy hidden so_vacuum is no longer required by new summons', !/so_summon_tera:[^\n]*skillId: 'so_vacuum'/.test(skills)],
];
for (const [name, ok] of checks) console.log(`${ok ? 'PASS' : 'FAIL'} ${name}`);
const failed = checks.filter(x => !x[1]).length;
console.log(`v2.5.208 elemental SP upkeep regression: ${checks.length - failed}/${checks.length} passed`);
if (failed) process.exit(1);
