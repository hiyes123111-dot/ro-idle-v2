#!/usr/bin/env node
'use strict';
const fs = require('fs');
const path = require('path');
const root = path.resolve(__dirname, '..');
const skills = fs.readFileSync(path.join(root, 'js/skills.js'), 'utf8');
const engine = fs.readFileSync(path.join(root, 'js/engine.js'), 'utf8');
const start = engine.indexOf('function monsterCastSkillInner');
const end = engine.indexOf('\nfunction ', start + 10);
const monsterCast = engine.slice(start, end > start ? end : undefined);
const ids = [
  'sa_advancedbook','sa_dragonology','sa_flamelauncher','sa_frostweapon',
  'sa_lightningloader','sa_seismicweapon','sa_volcano','sa_deluge',
  'sa_violentgale','sa_landprotector','sa_castcancel','sa_freecast',
  'sa_autospell','sa_magicrod','sa_spellbreaker','sa_dispell',
  'sa_abracadabra','sa_createcon','sa_elementfire','sa_elementwater',
  'sa_elementwind','sa_elementearth'
];
const checks = [];
for (const id of ids) checks.push([`Sage skill definition: ${id}`, new RegExp(`\\b${id}:\\s*\\{[\\s\\S]*?\\bid:\\s*'${id}'`).test(skills)]);
checks.push(['Magic Rod has a live call in monster skill damage path', /if \(sk\.mult > 0 && tryMagicRod\(\)\)/.test(monsterCast)]);
checks.push(['Magic Rod executes before damage calculation', /tryMagicRod\(\)[\s\S]*?return;[\s\S]*?let dmg = 0;/.test(monsterCast)]);
checks.push(['Magic Rod still enforces its internal cooldown', /now < \(state\.magicRodReadyAt \|\| 0\)/.test(engine)]);
checks.push(['Magic Rod restores SP on successful proc', /state\.sp = Math\.min\(state\.maxSp, state\.sp \+ p\.spGain\)/.test(engine)]);
checks.push(['Auto Spell is invoked from normal-attack proc pipeline', /trySageProcs\(target, monDef\)/.test(engine)]);
checks.push(['Create Converter auto-maintenance is wired', /tickConverter\(\)/.test(engine)]);
for (const [name, ok] of checks) console.log(`${ok ? 'PASS' : 'FAIL'} ${name}`);
const failed = checks.filter(x => !x[1]).length;
console.log(`v2.5.212 Sage skill completion: ${checks.length - failed}/${checks.length} passed`);
if (failed) process.exit(1);
