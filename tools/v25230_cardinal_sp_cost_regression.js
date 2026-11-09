'use strict';
const fs = require('fs');
const content = fs.readFileSync('js/v2_5_content.js', 'utf8');
const skills = fs.readFileSync('js/skills.js', 'utf8');
const checks = [
  ['樞機主教既有主動技能恢復依技能類型計算的 SP 消耗', /existing\.spCost = type === 'passive' \? \[0\] :\s*Array\.from\(\{length:maxLv\},\s*\(_,i\)=>Math\.round\(\(isMagic\.has\(type\) \? 32 : 25\) \+ i\*2\)\)/.test(content)],
  ['樞機主教新增主動技能不再被強制設為 0 SP', /if \(jobId === 'cardinal' && type === 'passive'\) \{\s*sk\.spCost = \[0\];\s*\}/.test(content)],
  ['樞機主教技能樹不再把全部技能 SP 消耗歸零', /if \(skill\.type === 'passive'\) skill\.spCost = \[0\];/.test(content) && !/skill\.spCost = 0/.test(content)],
  ['樞機主教 3 個治癒技能仍為主動技能', ['cd_dilectio_heal','cd_mediale_votum','cd_reparatio'].every(id => new RegExp(id + ':').test(skills))],
  ['樞機主教被動技能保留零 SP 設定', /cd_fidus_animus:[^\n]*type:'passive'/.test(skills) && /cd_mace_book_m:[^\n]*type:'passive'/.test(skills)],
];
for (const [name, ok] of checks) console.log(`${ok ? 'PASS' : 'FAIL'} ${name}`);
if (checks.some(([, ok]) => !ok)) process.exit(1);
