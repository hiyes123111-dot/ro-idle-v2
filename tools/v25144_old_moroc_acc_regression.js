// v2.5.144 Ancient Morocc Noble Jewelry: base-stat scaling and card-set damage paths.
const fs = require('fs');
const path = require('path');
const data = fs.readFileSync(path.join(__dirname, '..', 'js', 'data.js'), 'utf8');
const engine = fs.readFileSync(path.join(__dirname, '..', 'js', 'engine.js'), 'utf8');
const start = data.indexOf('"old_moroc_acc"');
if (start < 0) throw new Error('Ancient Morocc Noble Jewelry data row missing');
const row = data.slice(start, start + 1800);
for (const [k,v] of Object.entries({
  perStat_str_8_atk:5, perStat_agi_8_atk:3, perStat_vit_8_atk:2,
  perStat_vit_8_matk:2, perStat_int_8_matk:5, perStat_dex_8_atk:2,
  perStat_dex_8_matk:2, perStat_luk_8_matk:3
})) if (!row.includes(`\"${k}\":${v}`)) throw new Error(`Missing base stat effect ${k}:${v}`);
if (!row.includes('withCards:["marduk_card"]') || !row.includes('allPropertyDmgPct:12')) throw new Error('Marduk combo missing');
if (!row.includes('withCards:["pharaoh_card"]') || !row.includes('allPropertyDmgPct:25')) throw new Error('Pharaoh combo missing');
if (row.includes('allTargetDmgPct') || row.includes('allEleDmg')) throw new Error('Legacy double/misrouted combo keys remain');
if (!engine.includes("if (getCardBonus('allPropertyDmgPct')) bonus += getCardBonus('allPropertyDmgPct') / 100;")) throw new Error('Physical damage path missing');
if (!engine.includes("targetPct += getCardBonus('allPropertyDmgPct');")) throw new Error('Magic damage path missing');
if (!engine.includes("const base = (state.stats && state.stats[parts[1]]) || 0;")) throw new Error('Pure base-stat calculation missing');
console.log('v2.5.144 Ancient Morocc Noble Jewelry: 8 base-stat effects + 2 card combos + physical/magic damage paths passed');
