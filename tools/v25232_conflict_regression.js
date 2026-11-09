#!/usr/bin/env node
'use strict';
const fs = require('fs');
const ui = fs.readFileSync('js/ui.js', 'utf8');
const engine = fs.readFileSync('js/engine.js', 'utf8');
const html = fs.readFileSync('index.html', 'utf8');
const version = fs.readFileSync('VERSION.txt', 'utf8').trim();
const refs = [...html.matchAll(/\?v=([0-9.]+)/g)].map(m => m[1]);
const checks = [
  ['release version is 2.5.232', version === '2.5.232'],
  ['all 22 HTML cache references match release version', refs.length === 22 && refs.every(v => v === version)],
  ['incorrect warehouse condition removed from backpack renderer', !/if \(whCategory === 'armor'\).*inCat\(bagAll\)/.test(ui)],
  ['warehouse defines all three headgear filters when headgear exists', /whCategory === 'armor'[\s\S]*?\['head_top', 'head_mid', 'head_bottom'\]\.forEach/.test(ui)],
  ['backpack retains all three headgear filters', /invCategory === 'armor'[\s\S]*?\['head_top', 'head_mid', 'head_bottom'\]\.forEach/.test(ui)],
  ['head-top priority is preserved for compound headgear', /if \(pos\.includes\('頭上'\)\) return 'head_top';[\s\S]*?if \(pos\.includes\('頭中'\)\) return 'head_mid';[\s\S]*?if \(pos\.includes\('頭下'\)\) return 'head_bottom';/.test(ui)],
  ['cardinal heal is included in automatic heal classification', /const isHeal = sk\.type === 'heal' \|\| sk\.type === 'heal_over_time' \|\| sk\.type === 'cardinal_heal'/.test(engine)],
  ['Competentia P.ATK and S.MATK use party-aware buff helper', /pushParty\('pAtk', 1, value\);[\s\S]*?pushParty\('sMatk', 1, value\);/.test(engine)],
  ['SP cost definitions remain present', /spCost/.test(fs.readFileSync('js/v2_5_content.js', 'utf8'))],
];
for (const [name, ok] of checks) console.log(`${ok ? 'PASS' : 'FAIL'} ${name}`);
const failed = checks.filter(([, ok]) => !ok).length;
console.log(`v2.5.232 conflict regression: ${checks.length - failed}/${checks.length} passed`);
if (failed) process.exit(1);
