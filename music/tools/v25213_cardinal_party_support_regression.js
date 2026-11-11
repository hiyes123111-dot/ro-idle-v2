#!/usr/bin/env node
'use strict';
const fs = require('fs');
const skills = fs.readFileSync('js/skills.js', 'utf8');
const engine = fs.readFileSync('js/engine.js', 'utf8');
const checks = [
  ['樞機主教全隊輔助技能均標記 party', (skills.match(/type:'cardinal_support'[^\n]*party:true/g) || []).length >= 7],
  ['樞機主教全隊治療技能均標記 party', /cd_reparatio:[^\n]*type:'cardinal_heal'[^\n]*party:true/.test(skills) && /cd_dilectio_heal:[^\n]*type:'cardinal_heal'[^\n]*party:true/.test(skills)],
  ['全隊增益確實複製到隊友', /if \(sk\.party\) \{\s*shareBuffsWithAllies\(fresh/.test(engine)],
  ['治癒誓言由共用函式處理每位角色的持續治療', /function tickCardinalHotForCurrentState\(now\)/.test(engine) && /withAlly\(ally, \(\) => \{[\s\S]*?tickCardinalHotForCurrentState\(Date\.now\(\)\)/.test(engine)],
  ['神聖權能逐一恢復每位隊員自己的 HP／SP', /case 'competentia':[\s\S]*?const recoverSelf = \(\) => \{[\s\S]*?if \(sk\.party\) forEachPartyMate\(mate => \{[\s\S]*?recoverSelf\(\)/.test(engine)],
  ['全隊治療自動施放會檢查隊友血量', /const partyNeedsHeal = sk\.party && allyList\(\)\.some/.test(engine)],
  ['聖光治癒與博愛治癒逐位套用治療', /case 'cardinal_heal':[\s\S]*?if \(sk\.party\) forEachPartyMate\(mate => \{ if \(applyHeal\(\) > 0\)/.test(engine)],
  ['Buff 到期仍會重算隊友衍生能力', /if \(state\.buffs\.length !== before\) recomputeDerived\(false\)/.test(engine)],
];
for (const [name, ok] of checks) console.log(`${ok ? 'PASS' : 'FAIL'} ${name}`);
const failed = checks.filter(([, ok]) => !ok).length;
console.log(`v2.5.213 Cardinal party support: ${checks.length - failed}/${checks.length} passed`);
if (failed) process.exit(1);
