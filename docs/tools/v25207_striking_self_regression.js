#!/usr/bin/env node
'use strict';
const fs = require('fs');
const path = require('path');
const root = path.resolve(__dirname, '..');
const skills = fs.readFileSync(path.join(root, 'js/skills.js'), 'utf8');
const engine = fs.readFileSync(path.join(root, 'js/engine.js'), 'utf8');
const line = skills.split(/\r?\n/).find(x => x.includes('so_striking: {')) || '';
const tick = engine.slice(engine.indexOf('function tickBuffs()'), engine.indexOf('// ASPD 計算'));
const castStart = engine.indexOf("case 'buff_atk':");
const cast = engine.slice(castStart, engine.indexOf('break;', engine.indexOf('if (sk.hitBonus)', castStart)) + 6);
const checks = [
  ['Striking explicitly declares self as its target', /target: 'self'/.test(line)],
  ['Striking description explicitly says it is cast on self', /對自身施放/.test(line)],
  ['Striking retains the 90-second duration and five SP drain levels', /duration: \[90,90,90,90,90\]/.test(line) && /spDrainPerSec: \[5,4,3,2,1\]/.test(line)],
  ['Striking buff stores its per-second SP drain value', /strikingDrain[\s\S]*spDrainPerSec: strikingDrain/.test(cast)],
  ['Buff tick accumulates elapsed time and drains SP once per second', /spDrainAccumulatorMs[\s\S]*>= 1000[\s\S]*state\.sp -= b\.spDrainPerSec/.test(tick)],
  ['Striking is removed when SP is insufficient', /state\.sp < b\.spDrainPerSec[\s\S]*filter\(x => x\.skillId !== 'so_striking'\)/.test(tick)],
  ['Insufficient SP removal produces a clear combat log', /SP 不足，打擊強化效果解除/.test(tick)],
  ['Recasting Striking replaces the previous self-buff instead of stacking', /state\.buffs = state\.buffs\.filter\(b => b\.skillId !== sk\.id\)/.test(cast)],
];
for (const [name, ok] of checks) console.log(`${ok ? 'PASS' : 'FAIL'} ${name}`);
const failed = checks.filter(x => !x[1]).length;
console.log(`v2.5.207 Striking self-cast regression: ${checks.length - failed}/${checks.length} passed`);
if (failed) process.exit(1);
