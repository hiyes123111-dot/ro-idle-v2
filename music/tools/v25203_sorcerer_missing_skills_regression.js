#!/usr/bin/env node
'use strict';
const fs = require('fs');
const path = require('path');
const root = path.resolve(__dirname, '..');
const skills = fs.readFileSync(path.join(root, 'js/skills.js'), 'utf8');
const jobs = fs.readFileSync(path.join(root, 'js/jobs.js'), 'utf8');
const engine = fs.readFileSync(path.join(root, 'js/engine.js'), 'utf8');
const ids = ['so_firewalk','so_electricwalk','so_el_cure','so_el_action','so_elemental_shield'];
const checks = [
  ...ids.map(id => [`${id} is registered`, new RegExp(`${id}:\\s*\\{\\s*id:\\s*'${id}'`).test(skills)]),
  ['all five skills are included in Sorcerer job tree', /sorcerer:\s*\{[\s\S]*?skills:\s*\[[^\]]*'so_firewalk'[^\]]*'so_electricwalk'[^\]]*'so_el_cure'[^\]]*'so_el_action'[^\]]*'so_elemental_shield'/.test(jobs)],
  ['Fire Walk is fire magic AoE and includes levelled SP/multiplier data', /so_firewalk:[\s\S]*?type:\s*'magic_aoe',[\s\S]*?element:\s*'fire',[\s\S]*?spCost:\s*\[30,34,38,42,46\],[\s\S]*?mult:\s*\[0\.6,1\.2,1\.8,2\.4,3\.0\]/.test(skills)],
  ['Electric Walk is wind magic AoE', /so_electricwalk:[\s\S]*?type:\s*'magic_aoe',[\s\S]*?element:\s*'wind'/.test(skills)],
  ['Elemental Action checks for a summoned spirit', /sk\.requiresSpirit && \(!state\.elementalSpirit/.test(engine)],
  ['Elemental Shield consumes summoned spirit after shield creation', /sk\.consumeElementalSpirit[\s\S]*?state\.elementalSpirit = null/.test(engine)],
  ['skill descriptions disclose simplified field and spirit-HP mechanics', /本作以全體範圍攻擊簡化場地判定/.test(skills) && /本作無獨立精靈 HP/.test(skills)],
];
for (const [name, ok] of checks) console.log(`${ok ? 'PASS' : 'FAIL'} ${name}`);
const failed = checks.filter(x => !x[1]).length;
console.log(`v2.5.203 Sorcerer skill regression: ${checks.length - failed}/${checks.length} passed`);
if (failed) process.exit(1);
