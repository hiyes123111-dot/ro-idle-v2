const fs = require('fs');
const d = fs.readFileSync('js/data.js', 'utf8');
const e = fs.readFileSync('js/engine.js', 'utf8');
const checks = [
  ['card item exists', /"holy_skogul_card"\s*:\s*\{"id":"holy_skogul_card"/.test(d)],
  ['card database entry exists', /holy_skogul_card:\s*\{"id":"holy_skogul_card"/.test(d)],
  ['card is footgear slot', /holy_skogul_card:[\s\S]{0,250}?"slot":"footgear"/.test(d)],
  ['base heal bonus +5%', /holy_skogul_card:[\s\S]{0,180}?"bonus":\{"healRecvPct":5\}/.test(d)],
  ['refine +7 adds 3%', /"refineMin":7\},"bonus":\{"healRecvPct":3\}/.test(d)],
  ['refine +9 adds 2%', /"refineMin":9\},"bonus":\{"healRecvPct":2\}/.test(d)],
  ['monster id 20607 and drop 0.01%', /holy_skogul: \{id:'holy_skogul',imgId:20607[\s\S]{0,900}?holy_skogul_card',chance:0\.0001/.test(d)],
  ['heal bonus consumed by heal output', /state\.healBonusPct \+= getCardBonus\('healPct'\) \+ getCardBonus\('healRecvPct'\)/.test(e) && /function healOutputMult\(\)[\s\S]{0,240}?const passive = 1 \+ \(\(state\.healBonusPct \|\| 0\) \/ 100\)/.test(e)]
];
for (const [name, ok] of checks) console.log(`${ok ? 'PASS' : 'FAIL'} ${name}`);
if (checks.some(x => !x[1])) process.exit(1);
