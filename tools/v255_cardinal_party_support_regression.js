#!/usr/bin/env node
'use strict';
const fs = require('fs');
const skills = fs.readFileSync('js/skills.js', 'utf8');
const engine = fs.readFileSync('js/engine.js', 'utf8');
const checks = [
  ['樞機主教保留聖屬性範圍攻擊', /cd_divinus_flos:[^\n]*type:'magic_aoe'[^\n]*element:'holy'/.test(skills)],
  ['樞機主教保留聖屬性單體攻擊', /cd_framen:[^\n]*type:'magic_aoe'[^\n]*element:'holy'/.test(skills)],
  ['樞機主教全隊治癒技能已接入執行流程', /cd_dilectio_heal:[^\n]*type:'cardinal_heal'[^\n]*party:true/.test(skills) && /case 'cardinal_heal':/.test(engine)],
  ['樞機主教全隊防禦與最大HP相關增益已接入複製流程', /cd_argutus_telum:[^\n]*party:true/.test(skills) && /if \(sk\.party\) \{\s*shareBuffsWithAllies\(fresh/.test(engine)],
  ['樞機主教全隊能力與命中增益已接入複製流程', /cd_benedictum:[^\n]*party:true/.test(skills) && /case 'physicalStats':/.test(engine)],
  ['全隊治癒依每位隊友自身能力獨立計算', /case 'cardinal_heal':[\s\S]*?if \(sk\.party\) forEachPartyMate\(mate => \{ if \(applyHeal\(\) > 0\)/.test(engine)],
  ['隊伍 Buff 沿用既有複製機制', /if \(sk\.party\) \{\s*shareBuffsWithAllies\(fresh/.test(engine)],
];
for (const [name, ok] of checks) console.log(`${ok ? 'PASS' : 'FAIL'} ${name}`);
if (checks.some(([, ok]) => !ok)) process.exit(1);
