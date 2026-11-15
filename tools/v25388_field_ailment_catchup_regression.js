#!/usr/bin/env node
'use strict';
const fs = require('fs');
const path = require('path');
const vm = require('vm');
const root = path.resolve(__dirname, '..');
const engine = fs.readFileSync(path.join(root, 'js/engine.js'), 'utf8');
const html = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
const version = fs.readFileSync(path.join(root, 'VERSION.txt'), 'utf8').trim().replace(/^v/, '');
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
  throw new Error('unterminated function');
}
const helper = extractFunction(engine, 'function applyFieldAilment(mon, monDef, field)');
let rolls = [], ailments = [], stuns = [];
const testMath = Object.create(Math); testMath.random = () => rolls.length ? rolls.shift() : 0.99;
const runtime = {
  Math: testMath,
  applyAilment: (mon, def, type, opts) => { ailments.push({ id: mon.id, type, opts }); return true; },
  applyStun: (mon, sec, additive) => stuns.push({ id: mon.id, sec, additive })
};
vm.runInNewContext(`${helper};`, runtime);
let failed = 0;
function check(label, ok) { console.log(`${ok ? 'PASS' : 'FAIL'} ${label}`); if (!ok) failed++; }
const def = { name: '測試怪物', element: 'fire', race: 'brute' };
check('單一 tick 仍只擲一次', runtime.applyFieldAilment({ id: 1, hp: 10 }, def, { ailment: 'freeze', ailmentChance: 60, ticksThisRound: 1 }) === false && ailments.length === 0);
rolls = [0.99, 0.99, 0.1];
check('補算三個 tick 時逐跳獨立擲骰，後續成功可冰凍', runtime.applyFieldAilment({ id: 2, hp: 10 }, def, { ailment: 'freeze', ailmentChance: 60, ticksThisRound: 3 }) === true && ailments.length === 1 && ailments[0].id === 2);
rolls = [0.1];
check('死亡目標不執行狀態擲骰', runtime.applyFieldAilment({ id: 3, hp: 0 }, def, { ailment: 'freeze', ailmentChance: 60, ticksThisRound: 5 }) === false && ailments.length === 1);
rolls = [0.1, 0.1, 0.99];
check('舊 stunChance 場域依補算 tick 逐次累加暈眩', runtime.applyFieldAilment({ id: 4, hp: 10 }, def, { stunChance: 50, stunSec: 2, ticksThisRound: 3 }) === true && stuns.length === 2 && stuns.every(x => x.additive));
check('補算次數上限為 20，避免異常狀態迴圈失控', /Math\.min\(20, Math\.floor\(Number\(field\.ticksThisRound\)/.test(engine));
const refs = [...html.matchAll(/[?&]v=(2\.5\.\d+)/g)].map(m => m[1]);
check('26 個 HTML 快取引用全部對應目前版本', refs.length === 26 && refs.every(v => v === version) && version === '2.5.388');
console.log(`\nSummary: ${6-failed}/6 passed`);
process.exitCode = failed ? 1 : 0;
