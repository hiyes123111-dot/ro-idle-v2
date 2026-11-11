const fs = require('fs');
const path = require('path');
const engine = fs.readFileSync(path.join(__dirname, '../js/engine.js'), 'utf8');
const start = engine.indexOf('function tryAutoSpells(trigger, mon) {');
const end = engine.indexOf('\n/* 把「做成被動」', start);
if (start < 0 || end < 0) throw new Error('tryAutoSpells function not found');
const body = engine.slice(start, end);
if (!body.includes("if (e.melee && trigger !== 'hit' && !melee) continue;")) {
  throw new Error('On-hit autocast must not use the player weapon to decide enemy melee range');
}
if (!body.includes("const melee = !isBowWeapon(getEquipBaseItemId('weapon'))")) {
  throw new Error('Player melee weapon check must remain for attack/chain autocasts');
}
console.log('PASS: hit autocasts are not incorrectly blocked by the player bow; attack/chain melee checks remain');
