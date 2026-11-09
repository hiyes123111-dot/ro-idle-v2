// v2.5.145 Lunar Eclipse Magic Robe-LT resistance routing regression.
const fs = require('fs');
const path = require('path');
const root = path.join(__dirname, '..');
const data = fs.readFileSync(path.join(root, 'js', 'data.js'), 'utf8');
const engine = fs.readFileSync(path.join(root, 'js', 'engine.js'), 'utf8');
const rowStart = data.indexOf('"lunar_e_armor_lt"');
if (rowStart < 0) throw new Error('Lunar Eclipse Magic Robe-LT data row missing');
const row = data.slice(rowStart, rowStart + 2600);
if (!row.includes('"sizeDmgReduce_medium":13') || !row.includes('"sizeDmgReduce_large":13')) {
  throw new Error('Medium/large incoming damage reduction must use sizeDmgReduce keys');
}
if (row.includes('raceDmgReduce_medium') || row.includes('raceDmgReduce_large')) {
  throw new Error('Invalid race reduction keys remain on size-based effect');
}
if (!row.includes('eleDmgReduce_all:20')) throw new Error('Refine +11 all-element resistance missing');
if (!engine.includes("'eleDmgReduce_': 'cardEleDmgReduce'")) {
  throw new Error('eleDmgReduce_* gear keys are not routed into elemental resistance bucket');
}
if (!engine.includes("getCardBonus('eleDmgReduce_all')")) {
  throw new Error('Generic all-element resistance consumer missing');
}
if (!engine.includes('state.cardSizeDmgReduce[monDef.size]')) {
  throw new Error('Size-specific incoming damage reduction consumer missing');
}
console.log('v2.5.145 Lunar Eclipse Magic Robe-LT: medium/large reduction + all-element resistance routing passed');
