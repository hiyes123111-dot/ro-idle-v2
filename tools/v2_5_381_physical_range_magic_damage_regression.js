const fs = require('fs');
const path = require('path');
const root = path.resolve(__dirname, '..');
const engine = fs.readFileSync(path.join(root, 'js', 'engine.js'), 'utf8');
const html = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
const release = fs.readFileSync(path.join(root, 'VERSION.txt'), 'utf8').trim().replace(/^v/, '');

function sectionBetween(source, start, end) {
  const a = source.indexOf(start);
  if (a < 0) throw new Error(`missing start marker: ${start}`);
  const b = source.indexOf(end, a);
  if (b < 0) throw new Error(`missing end marker: ${end}`);
  return source.slice(a, b);
}
const magic = sectionBetween(engine, 'function skillBaseDamage(', 'function showExtraHitFloat');
const physical = sectionBetween(engine, 'function weaponChainDamage(', 'function skillBaseDamage(');

if (/getCardBonus\(['"]rangedDmgPct['"]\)/.test(magic)) {
  throw new Error('Magic skill path still reads ranged physical damage bonus');
}
if (!/getCardBonus\(['"]magicDmgPct['"]\)/.test(magic)) {
  throw new Error('Magic damage bonus path was unexpectedly removed');
}
if (!/getCardBonus\(['"]meleeDmgPct['"]\)/.test(physical)) {
  throw new Error('Physical melee damage bonus path is missing');
}
if (!/getCardBonus\(['"]rangedDmgPct['"]\)/.test(physical)) {
  throw new Error('Physical ranged damage bonus path is missing');
}
const versions = [...html.matchAll(/[?&]v=(2\.5\.\d+)/g)].map(m => m[1]);
if (versions.length !== 26 || versions.some(v => v !== release)) {
  throw new Error(`Expected 26 cache references at ${release}; found ${versions.length}`);
}
console.log('PASS: magic skills exclude ranged physical bonus');
console.log('PASS: physical melee/ranged bonuses remain connected');
console.log(`PASS: all 26 cache references use v${release}`);
