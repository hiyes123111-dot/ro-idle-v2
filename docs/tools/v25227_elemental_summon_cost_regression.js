const fs = require('fs');
const assert = require('assert');
const content = fs.readFileSync('js/v2_5_content.js', 'utf8');
const engine = fs.readFileSync('js/engine.js', 'utf8');
const expected = {
  em_summon_elemental_ardor: 'flame_heart',
  em_summon_elemental_diluvio: 'mistic_frozen',
  em_summon_elemental_procella: 'rough_wind',
  em_summon_elemental_terremotus: 'great_nature',
  em_summon_elemental_serpens: null
};
for (const [id, item] of Object.entries(expected)) {
  assert(content.includes(`${id}: '${item === null ? '' : item}'`) || (item === null && content.includes(`${id}: null`)), `stone mapping ${id}`);
}
assert(content.includes('sk.summonStoneQty = 1'), 'one stone per summon');
assert(content.includes('sk.summonStoneGoldFallback = 3000'), '3000 zeny fallback');
assert(engine.includes('if (!free && sk.highElementalSpirit)'), 'skip free casts, require normal cast payment');
assert(engine.includes('sageWarehouseQty(itemId)'), 'warehouse material check');
assert(engine.includes('state.gold >= fallback'), 'gold fallback affordability check');
assert(engine.includes('state.gold -= summonStonePayment.gold'), 'deduct fallback money');
assert(engine.includes('removeItem(summonStonePayment.itemId, summonStonePayment.qty)'), 'deduct inventory stone');
assert(engine.includes('saveWarehouse(wh)'), 'save warehouse deduction');
assert(engine.indexOf('if (summonStonePayment)') < engine.indexOf('state.sp -= spCost;'), 'payment after validation, before SP deduction');
console.log('v2.5.227 elemental summon cost regression: 11/11 passed');
