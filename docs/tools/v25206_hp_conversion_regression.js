#!/usr/bin/env node
'use strict';
const fs = require('fs');
const path = require('path');
const root = path.resolve(__dirname, '..');
const skills = fs.readFileSync(path.join(root, 'js/skills.js'), 'utf8');
const engine = fs.readFileSync(path.join(root, 'js/engine.js'), 'utf8');
const block = skills.slice(skills.indexOf('pf_hpconversion: {'), skills.indexOf('pf_soulchange: {'));
const checks = [
  ['HP Conversion is documented as consuming 10% MaxHP', block.includes('固定消耗最大 HP 的 10%') && block.includes('當前 HP 不足以支付')],
  ['HP Conversion description states MaxHP-based cost', block.includes('最大 HP 的 10%')],
  ['hp_convert calculates its cost from state.maxHp', /const hpCostBase = sk\.type === 'hp_convert' \? state\.maxHp : state\.hp;/.test(engine)],
  ['other hpCostPct skills retain current-HP cost basis', /const hpCostBase = sk\.type === 'hp_convert' \? state\.maxHp : state\.hp;/.test(engine)],
  ['HP insufficiency check occurs before SP and HP deduction', engine.indexOf('if (state.hp <= hpPctCost)') < engine.indexOf('state.sp -= spCost;') && engine.indexOf('if (state.hp <= hpPctCost)') > engine.indexOf('const hpCostBase = sk.type')],
  ['HP Conversion restores 10%-50% of consumed HP and caps at max SP', /Math\.floor\(hpPctCost \* mult \/ 100\)/.test(engine) && /state\.sp = Math\.min\(state\.maxSp, state\.sp \+ gain\)/.test(engine)],
];
for (const [name, ok] of checks) console.log(`${ok ? 'PASS' : 'FAIL'} ${name}`);
const failed = checks.filter(x => !x[1]).length;
console.log(`v2.5.206 HP Conversion regression: ${checks.length - failed}/${checks.length} passed`);
if (failed) process.exit(1);
