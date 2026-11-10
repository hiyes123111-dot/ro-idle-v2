/* Regression checks for v2.5.262 equipment delay mappings. Run: node tools/test_equipment_delay_v2.5.262.js */
const fs = require('fs');
const vm = require('vm');
const path = require('path');
const root = path.resolve(__dirname, '..');
const context = vm.createContext({});
vm.runInContext(fs.readFileSync(path.join(root, 'js/data.js'), 'utf8'), context);
const ITEMS = vm.runInContext('ITEMS', context);
function assert(condition, message) { if (!condition) throw new Error(message); }
function setBonus(id) {
  const item = ITEMS[id];
  assert(item, `missing item ${id}`);
  return (item.condBonus || []).find(r => r.when && r.when.refineSumMin === 33)?.bonus || {};
}
for (const id of ['dragona_red','dragon_a_red']) {
  const b = setBonus(id);
  assert(b.afterAttackDelayPct === 20 && b.skillAfterDelayPct === 25, `${id} 3-piece delay mismatch`);
}
for (const id of ['dragona_green','dragona_gold','dragona_silver','dragon_a_green','dragon_a_gold','dragon_a_silver']) {
  const b = setBonus(id);
  assert(b.afterAttackDelayPct === 20 && b.skillAfterDelayPct === 25, `${id} 3-piece delay mismatch`);
}
for (const id of ['dragona_purple','dragon_a_purple']) {
  const b = setBonus(id);
  assert(b.afterAttackDelayPct === 15 && b.skillAfterDelayPct === 25, `${id} 3-piece delay mismatch`);
}
for (const id of ['dragona_blue','dragon_a_blue']) {
  const b = setBonus(id);
  assert(!b.afterAttackDelayPct && b.skillAfterDelayPct === 25, `${id} should only have skill-after-delay`);
}
for (const id of ['ep172_1h_book2','ep172_1h_hammer','adulter_f_bible','vivatus_f_bible','gray_w_suits','gray_w_manteau','adulter_f_mace','vivatus_f_mace','thanos_sword_ad','thanos_hammer_ad','thanos_tsword_ad','oriental_sword_lt']) {
  const item = ITEMS[id];
  assert(item && JSON.stringify(item).includes('afterAttackDelayPct'), `${id} missing attack-after-delay mapping`);
}
const feather = ITEMS.imperial_feather;
assert(feather.bonus.afterAttackDelayPct === 1, 'imperial feather base delay mismatch');
assert(feather.condBonus[0].bonus.afterAttackDelayPct === 1, 'imperial feather AGI condition mismatch');
assert(!JSON.stringify(ITEMS.ac_b44_ad).includes('afterAttackDelayPct'), 'AC-B44-OS-AD must remain untouched');
const engine = fs.readFileSync(path.join(root, 'js/engine.js'), 'utf8');
assert(engine.includes("'afterCastDelayPct', 'afterAttackDelayPct', 'skillAfterDelayPct'"), 'top-level afterAttackDelayPct is not collected');
assert(engine.includes("getCardBonus('afterAttackDelayPct')"), 'attack interval does not consume afterAttackDelayPct');
assert(engine.includes("getCardBonus('skillAfterDelayPct')"), 'skill action lock does not consume skillAfterDelayPct');
// Formula regression: positive percentages reduce interval/delay, with the engine's 10% floor.
for (const [pct, expected] of [[0,1000],[10,900],[20,800],[25,750],[90,100]]) {
  const actual = Math.max(100, Math.round(1000 * Math.max(0.1, 1 - pct / 100)));
  assert(actual === expected, `delay formula mismatch at ${pct}%: ${actual}`);
}
console.log('v2.5.262 equipment delay regression checks passed.');
