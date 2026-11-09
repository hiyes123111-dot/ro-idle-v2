#!/usr/bin/env node
'use strict';
const fs = require('fs');
const path = require('path');
const root = path.resolve(__dirname, '..');
const skills = fs.readFileSync(path.join(root, 'js/skills.js'), 'utf8');
const jobs = fs.readFileSync(path.join(root, 'js/jobs.js'), 'utf8');
const engine = fs.readFileSync(path.join(root, 'js/engine.js'), 'utf8');
const ids = ['so_earthgrave','so_fire_insignia','so_water_insignia','so_wind_insignia','so_earth_insignia'];
const lineFor = id => skills.split(/\r?\n/).find(line => line.includes(id + ': {')) || '';
const checks = [
  ...ids.map(id => [`${id} registered`, lineFor(id).includes(`id: '${id}'`)]),
  ['all five additions appear in Sorcerer skill tree', ids.every(id => jobs.includes(`'${id}'`))],
  ['Earth Grave has earth element, SP, cooldown, AoE and bleed chance', ['element: \'earth\'','spCost:','cooldown:','inflict: { type: \'bleed\'','area: [7,7,7,9,9]'].every(x => lineFor('so_earthgrave').includes(x))],
  ['all insignias have matching elemental attributes and 60s duration', ['fire','water','wind','earth'].every(e => lineFor(`so_${e}_insignia`).includes(`element: '${e}'`) && lineFor(`so_${e}_insignia`).includes('duration: [60,60,60]'))],
  ['insignia effects are handled by battle engine', engine.includes("case 'buff_elemental_insignia':")],
  ['insignias replace each other and apply element weapon / damage buffs', engine.includes('elementalInsigniaTag') && engine.includes("type: 'eleweapon'") && engine.includes("'eledmg_' + ele")],
  ['matching elemental spirit receives insignia attack bonus', engine.includes('insigniaMult') && engine.includes('spiritAtkPct')],
];
for (const [name, ok] of checks) console.log(`${ok ? 'PASS' : 'FAIL'} ${name}`);
const failed = checks.filter(x => !x[1]).length;
console.log(`v2.5.204 Sorcerer skills regression: ${checks.length - failed}/${checks.length} passed`);
if (failed) process.exit(1);
