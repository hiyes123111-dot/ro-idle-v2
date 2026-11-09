#!/usr/bin/env node
'use strict';
const fs = require('fs');
const path = require('path');
const root = path.resolve(__dirname, '..');
const skills = fs.readFileSync(path.join(root, 'js/skills.js'), 'utf8');
const engine = fs.readFileSync(path.join(root, 'js/engine.js'), 'utf8');
const ui = fs.readFileSync(path.join(root, 'js/ui.js'), 'utf8');
const control = skills.split(/\r?\n/).find(x => x.includes('so_elementcontrol: {')) || '';
const action = skills.split(/\r?\n/).find(x => x.includes('so_el_action: {')) || '';
const checks = [
  ['Elemental Control is an active four-level command, not a passive placeholder', /maxLv: 4, type: 'elemental_control'/.test(control)],
  ['Elemental Control costs SP, has a cooldown and is manual-only', /spCost: \[10,10,10,10\]/.test(control) && /cooldown: \[5,5,5,5\]/.test(control) && /manualOnly: true/.test(control)],
  ['the four levels map to passive, defensive, offensive and standby modes', /const modes = \['passive', 'defensive', 'offensive', 'standby'\]/.test(engine)],
  ['repeating the same command returns the spirit to standby', /spirit\.mode = spirit\.mode === requested \? 'standby' : requested/.test(engine)],
  ['summons default to offensive mode to preserve existing auto-attacks', /mode: 'offensive'/.test(engine)],
  ['elemental follow-up attacks only happen in offensive mode', /spirit\.mode === 'offensive' && state\.monsters\.includes\(target\)/.test(engine)],
  ['Elemental Action requires offensive mode', /sk\.id === 'so_el_action' && state\.elementalSpirit\.mode !== 'offensive'/.test(engine)],
  ['auto-battle spirit status displays the current mode', /精靈召喚中・\$\{spiritModeName\}模式/.test(ui)],
  ['Elemental Action description specifies offensive mode', /需要元素精靈處於攻擊模式/.test(action)],
];
for (const [name, ok] of checks) console.log(`${ok ? 'PASS' : 'FAIL'} ${name}`);
const failed = checks.filter(x => !x[1]).length;
console.log(`v2.5.209 elemental control regression: ${checks.length - failed}/${checks.length} passed`);
if (failed) process.exit(1);
