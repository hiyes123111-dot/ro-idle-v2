#!/usr/bin/env node
'use strict';
const fs = require('fs');
const path = require('path');
const root = path.resolve(__dirname, '..');
const skills = fs.readFileSync(path.join(root, 'js/skills.js'), 'utf8');
const jobs = fs.readFileSync(path.join(root, 'js/jobs.js'), 'utf8');
const engine = fs.readFileSync(path.join(root, 'js/engine.js'), 'utf8');
const line = id => skills.split(/\r?\n/).find(x => x.includes(id + ': {')) || '';
const checks = [
  ['Spell Fist registered with max Lv10 and Auto Spell Lv4 prerequisite', /so_spellfist:\s*\{[^\n]*maxLv:\s*10/.test(skills) && line('so_spellfist').includes("skillId: 'sa_autospell', level: 4")],
  ['Spell Fist is listed in Sorcerer skill tree', jobs.includes("'so_spellfist'")],
  ['Spell Fist has bolt element, duration, hit count and SP upkeep data', ['buff_spellfist','spCost:','duration:','hitCount:','spDrainPerHit: 20'].every(x => line('so_spellfist').includes(x))],
  ['Spell Fist runtime selects a learned bolt and activates a timed state', engine.includes("case 'buff_spellfist':") && engine.includes('state.spellFist = {') && engine.includes("id: 'firebolt'")],
  ['Spell Fist adds elemental MATK damage on normal attacks and spends SP', engine.includes('const fist = state.spellFist;') && engine.includes('state.sp -= 20') && engine.includes('魔力拳追加')],
  ['Psychic Wave corrected to 5-level neutral AoE with official hit counts', /so_psychicwave:[^\n]*name: '超自然波 Psychic Wave', maxLv: 5, type: 'magic_aoe'/.test(skills) && line('so_psychicwave').includes('hitCount: [3,4,5,6,7]')],
  ['Earth Grave no longer duplicates the old so_vacuum ID in job tree', !jobs.match(/sorcerer:\s*\{[\s\S]*?skills:\s*\[[^\]]*'so_vacuum'/)],
  ['Extreme Vacuum has the correct land protector prerequisite and immobilizes monsters', line('so_extremevacuum').includes("skillId: 'sa_landprotector', level: 2") && engine.includes('mon.vacuumUntil')],
  ['Striking is correctly named and applies flat weapon ATK and hit buffs', line('so_striking').includes('打擊強化 Striking') && line('so_striking').includes('weaponAtkFlat:') && engine.includes('weaponAtkBuff.flatBonus')],
];
for (const [name, ok] of checks) console.log(`${ok ? 'PASS' : 'FAIL'} ${name}`);
const failed = checks.filter(x => !x[1]).length;
console.log(`v2.5.205 Sage/Sorcerer correction regression: ${checks.length - failed}/${checks.length} passed`);
if (failed) process.exit(1);
