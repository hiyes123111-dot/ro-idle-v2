#!/usr/bin/env node
'use strict';
const fs = require('fs');
const path = require('path');
const root = path.resolve(__dirname, '..');
const skills = fs.readFileSync(path.join(root, 'js/skills.js'), 'utf8');
const jobs = fs.readFileSync(path.join(root, 'js/jobs.js'), 'utf8');
const engine = fs.readFileSync(path.join(root, 'js/engine.js'), 'utf8');
const ui = fs.readFileSync(path.join(root, 'js/ui.js'), 'utf8');
const ids = ['so_summon_agni','so_summon_aqua','so_summon_ventus','so_summon_tera'];
const checks = [
  ['four Sorcerer elemental summons are registered', ids.every(id => skills.includes(id + ': {'))],
  ['all four summons are listed in the Sorcerer job tree', /sorcerer:\s*\{[\s\S]*?skills:\s*\[[^\]]*so_summon_agni[^\]]*so_summon_aqua[^\]]*so_summon_ventus[^\]]*so_summon_tera/.test(jobs)],
  ['summons have element, SP, cooldown, duration, proc chance, multiplier and internal cooldown', ids.every(id => { const i=skills.indexOf(id + ': {'); const b=skills.slice(i, skills.indexOf('\n', i)); return /element:/.test(b)&&/spCost:/.test(b)&&/cooldown:/.test(b)&&/duration:/.test(b)&&/procChance:/.test(b)&&/mult:/.test(b)&&/internalCooldown:/.test(b); })],
  ['summon skills appear as auto-support toggles', /sk\.type === 'elemental_summon'/.test(engine) && /toggleAutoSupportSkill\('\$\{sk\.id\}'/.test(ui)],
  ['casting a summon creates timed active elemental state', /case 'elemental_summon':/.test(engine) && /state\.elementalSpirit = \{ skillId: sk\.id/.test(engine)],
  ['active elemental spirit triggers extra magic damage on normal attacks', /妖術師精靈協同/.test(engine) && /skillBaseDamage\(true, monDef, elemMult, spiritSkill\)/.test(engine)],
  ['active summon is not repeatedly recast before expiration', /sk\.type === 'elemental_summon' && state\.elementalSpirit/.test(engine)],
  ['summon active status is shown in auto-battle UI', /精靈召喚中/.test(ui)],
  ['only one elemental summon checkbox can remain enabled', /elementalSummons\.filter\(id => id !== skillId\)/.test(ui)],
  ['unchecking the active elemental summon dismisses it immediately', /!enabled && elementalSummons\.includes\(skillId\)[\s\S]*?state\.elementalSpirit = null/.test(ui)],
  ['Sage/Sorcerer damage skills have full descriptions and elemental labels', /MATK 210%～490%/.test(skills) && /水屬性範圍魔法/.test(skills) && /風屬性範圍魔法/.test(skills)],
];
for (const [name, ok] of checks) console.log(`${ok ? 'PASS' : 'FAIL'} ${name}`);
const failed = checks.filter(x => !x[1]).length;
console.log(`v2.5.202 Sorcerer elemental regression: ${checks.length - failed}/${checks.length} passed`);
if (failed) process.exit(1);
