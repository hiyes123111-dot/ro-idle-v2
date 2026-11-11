#!/usr/bin/env node
'use strict';
const fs = require('fs');
const path = require('path');
const root = path.resolve(__dirname, '..');
const skills = fs.readFileSync(path.join(root, 'js/skills.js'), 'utf8');
const jobs = fs.readFileSync(path.join(root, 'js/jobs.js'), 'utf8');
const engine = fs.readFileSync(path.join(root, 'js/engine.js'), 'utf8');
const data = fs.readFileSync(path.join(root, 'js/data.js'), 'utf8');
const checks = [
  ['Diamond Dust is registered under project ID so_diamonddust', /so_diamonddust:\s*\{\s*id:\s*'so_diamonddust'/.test(skills)],
  ['Diamond Dust name, max level, type and water element are correct', /name:\s*'鑽石星塵',\s*maxLv:\s*5,\s*type:\s*'magic_aoe',\s*element:\s*'water'/.test(skills)],
  ['Diamond Dust SP costs match twRO values', /spCost:\s*\[50,\s*56,\s*62,\s*68,\s*74\]/.test(skills)],
  ['Diamond Dust skill cooldown is 5 seconds at all levels', /cooldown:\s*\[5,\s*5,\s*5,\s*5,\s*5\]/.test(skills)],
  ['Diamond Dust damage curve uses this game AoE progression', /mult:\s*\[1\.6,\s*2\.05,\s*2\.5,\s*2\.95,\s*3\.4\]/.test(skills)],
  ['Sorcerer job tree grants Diamond Dust', /sorcerer:\s*\{[\s\S]*?skills:\s*\[[^\]]*'so_diamonddust'/.test(jobs)],
  ['equipment cooldown key maps to live Diamond Dust skill', /diamond_dust:\s*'so_diamonddust'/.test(engine) && /skillCd_diamond_dust/.test(data)],
  ['equipment skill damage key maps to live Diamond Dust skill', engine.includes("diamond_dust: 'so_diamonddust'") && engine.includes("getCardBonus('skillDmg_' + key)")],
  ['skill remains discoverable by the standard skill registry', /so_diamonddust/.test(skills)],
];
for (const [name, ok] of checks) console.log(`${ok ? 'PASS' : 'FAIL'} ${name}`);
const failed = checks.filter(x => !x[1]).length;
console.log(`v2.5.201 Diamond Dust regression: ${checks.length - failed}/${checks.length} passed`);
if (failed) process.exit(1);
