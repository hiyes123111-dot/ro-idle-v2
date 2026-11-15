#!/usr/bin/env node
'use strict';
const fs = require('fs');
const path = require('path');
const vm = require('vm');
const root = path.resolve(__dirname, '..');
const engine = fs.readFileSync(path.join(root, 'js/engine.js'), 'utf8');
const skills = fs.readFileSync(path.join(root, 'js/skills.js'), 'utf8');
const data = fs.readFileSync(path.join(root, 'js/data.js'), 'utf8');
const html = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
const version = fs.readFileSync(path.join(root, 'VERSION.txt'), 'utf8').trim().replace(/^v/, '');
let failed = 0;
function check(name, ok) { console.log(`${ok ? 'PASS' : 'FAIL'} ${name}`); if (!ok) failed++; }
function extractFunction(source, signature) {
  const start = source.indexOf(signature);
  if (start < 0) throw new Error(`function not found: ${signature}`);
  const brace = source.indexOf('{', start);
  let depth = 0, quote = null, escape = false;
  for (let i = brace; i < source.length; i++) {
    const c = source[i];
    if (quote) { if (escape) escape = false; else if (c === '\\') escape = true; else if (c === quote) quote = null; continue; }
    if (c === '"' || c === "'" || c === '`') { quote = c; continue; }
    if (c === '{') depth++;
    if (c === '}' && --depth === 0) return source.slice(start, i + 1);
  }
  throw new Error(`unterminated function: ${signature}`);
}
const storm = skills.match(/stormgust:\s*(\{[^\n]+\})/);
check('暴風雪場域附加效果改為冰凍而非暈眩', !!storm && /"ailment":"freeze"/.test(storm[1]) && !/"stunChance"/.test(storm[1]));
check('暴風雪保留每次命中60%冰凍機率與4秒基礎時間', !!storm && /"ailmentChance":\[60,60,60,60,60,60,60,60,60,60\]/.test(storm[1]) && /"ailmentSec":\[4,4,4,4,4,4,4,4,4,4\]/.test(storm[1]));
check('暴風雪仍為水屬性範圍場域', !!storm && /"type":"field_aoe_magic"/.test(storm[1]) && /"element":"water"/.test(storm[1]));
check('冰暴騎士卡片20%冰凍維持單體目標，不擴散至全場', /knight_windstorm_card:[\s\S]{0,600}?"ailment":\[\{"on":"attack","type":"freeze","chance":20\}\]/.test(data));
check('場域建立時保存異常狀態、機率與持續時間', /ailmentChance, ailmentSec/.test(engine));
check('場域每個存活目標每跳都呼叫狀態判定', /liveMonsters\.forEach\(mon => \{[\s\S]{0,2200}?applyFieldAilment\(mon, monDef, f\)/.test(engine));
check('異常狀態統一走既有免疫與BOSS時間縮短管線', /function applyFieldAilment\([\s\S]{0,600}?return applyAilment\(mon, monDef, field\.ailment/.test(engine));
const helper = extractFunction(engine, 'function applyFieldAilment(mon, monDef, field)');
const applied = [];
const testMath = Object.create(Math); testMath.random = () => 0;
const runtime = {
  Math: testMath,
  applyAilment: (mon, def, type, opts) => { applied.push({ id: mon.id, type, opts }); return def.element !== 'water' && def.race !== 'undead'; },
  applyStun: (mon, sec, additive) => { applied.push({ id: mon.id, type: 'stun', sec, additive }); }
};
vm.runInNewContext(`${helper};`, runtime);
const field = { ailment: 'freeze', ailmentChance: 60, ailmentSec: 4 };
[{id:1,hp:100},{id:2,hp:100},{id:3,hp:100}].forEach(m => runtime.applyFieldAilment(m, {element:'fire',race:'brute'}, field));
check('動態測試：暴風雪可逐隻判定前、中、後排三隻存活怪物', applied.length === 3 && applied.every(x => x.type === 'freeze'));
const immune = runtime.applyFieldAilment({id:4,hp:100},{element:'water',race:'fish'},field);
check('動態測試：水屬性免疫目標不會成功冰凍', immune === false);
const dead = runtime.applyFieldAilment({id:5,hp:0},{element:'fire',race:'brute'},field);
check('動態測試：死亡目標不會被施加冰凍', dead === false);
const oldStun = runtime.applyFieldAilment({id:6,hp:100},{element:'fire',race:'brute'},{stunChance:100,stunSec:1});
check('動態測試：其他舊場域技能的暈眩相容性保留', oldStun === true && applied[applied.length-1].type === 'stun');
check(`所有HTML快取引用統一更新至v${version}`, [...html.matchAll(/[?&]v=(2\.5\.\d+)/g)].length === 26 && [...html.matchAll(/[?&]v=(2\.5\.\d+)/g)].every(m => m[1] === version));
console.log(`\n${failed ? `FAILED: ${12-failed}/12 checks passed` : 'SUMMARY: 12/12 checks passed'}`);
process.exitCode = failed ? 1 : 0;
