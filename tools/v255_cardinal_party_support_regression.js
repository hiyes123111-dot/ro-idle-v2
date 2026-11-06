const fs = require('fs');
const v2 = fs.readFileSync('js/v2_content.js', 'utf8');
const engine = fs.readFileSync('js/engine.js', 'utf8');
const cardinal = v2.slice(v2.indexOf("{ id:'cardinal'"), v2.indexOf("{ id:'inquisitor'"));
const checks = [
  ['樞機主教保留聖屬性範圍攻擊', /v2_ca_divine_judgement.*magic_aoe.*holy/.test(cardinal)],
  ['樞機主教保留聖屬性單體攻擊', /v2_ca_holy_spear.*magic.*holy/.test(cardinal)],
  ['樞機主教新增全隊治癒技能', /v2_ca_sacred_recovery[\s\S]*?type|v2_ca_sacred_recovery/.test(cardinal) && /v2_ca_sacred_recovery[\s\S]*?party:true/.test(cardinal)],
  ['樞機主教新增全隊防禦與最大HP增益', /v2_ca_divine_guard[\s\S]*?party:true/.test(cardinal)],
  ['樞機主教新增全隊能力與命中增益', /v2_ca_holy_blessing[\s\S]*?party:true/.test(cardinal)],
  ['全隊治癒依每位隊友自身能力獨立計算', /case 'heal':[\s\S]*?if \(sk\.party\)[\s\S]*?forEachPartyMate\(\(\) => \{[\s\S]*?state\.stats\.int \+ state\.baseLevel/.test(engine)],
  ['隊伍 Buff 沿用既有複製機制', /if \(sk\.party\) \{[\s\S]*?shareBuffsWithAllies\(fresh/.test(engine)],
];
for (const [name, ok] of checks) console.log(`${ok ? 'PASS' : 'FAIL'} ${name}`);
if (checks.some(([, ok]) => !ok)) process.exit(1);
