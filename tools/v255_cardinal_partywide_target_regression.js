#!/usr/bin/env node
'use strict';
const fs = require('fs');
const skills = fs.readFileSync('js/skills.js', 'utf8');
const engine = fs.readFileSync('js/engine.js', 'utf8');
const checks = [
  ['博愛治癒為主動全隊治療', /cd_dilectio_heal:[^\n]*type:'cardinal_heal'[^\n]*party:true/.test(skills)],
  ['治癒誓言為全隊持續治療', /cd_mediale_votum:[^\n]*effect:'medialeHot'[^\n]*party:true/.test(skills) && /function tickCardinalHotForCurrentState\(now\)/.test(engine)],
  ['聖光治癒為全隊完全治療', /cd_reparatio:[^\n]*effect:'fullHeal'[^\n]*party:true/.test(skills)],
  ['神聖防護為全隊增益', /cd_argutus_telum:[^\n]*party:true/.test(skills)],
  ['光耀天命為全隊增益', /cd_argutus_vita:[^\n]*party:true/.test(skills)],
  ['爆裂聖光為全隊暴擊增益', /cd_presens_acies:[^\n]*party:true/.test(skills)],
  ['全心奉獻與祝福讚歌為全隊增益', /cd_religio:[^\n]*party:true/.test(skills) && /cd_benedictum:[^\n]*party:true/.test(skills)],
  ['全隊 Buff 使用既有複製管線', /if \(sk\.party\) \{\s*shareBuffsWithAllies\(fresh/.test(engine)],
  ['持續治療會在玩家與隊友身上逐跳結算', /function tickCardinalHotForCurrentState\(now\)/.test(engine) && /withAlly\(ally, \(\) => \{[\s\S]*?tickCardinalHotForCurrentState\(Date\.now\(\)\)/.test(engine)],
  ['神聖權能恢復全隊 HP/SP', /case 'competentia':[\s\S]*?if \(sk\.party\) forEachPartyMate\(mate => \{[\s\S]*?recoverSelf\(\)/.test(engine)],
  ['完全治療列入自動治療技能判斷', /sk\.type === 'heal' \|\| sk\.type === 'cardinal_heal'/.test(engine)],
];
for (const [name, ok] of checks) console.log(`${ok ? 'PASS' : 'FAIL'} ${name}`);
if (checks.some(([, ok]) => !ok)) process.exit(1);
