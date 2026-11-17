const fs = require('fs');
const vm = require('vm');
const ctx = {
  console, Date, Math,
  state: { pet: { eggId: 'poring_egg', intimacy: 950, hunger: 80 }, inventory: [], gold: 100000, hp: 100, maxHp: 100, sp: 100, maxSp: 100 },
  effectiveGearBonuses: () => ({}), gameTick: () => {}, getItemQty: () => 0,
  removeItem: () => true, addItem: () => {}, logMsg: () => {}, saveGame: () => true,
  saveGameThrottled: () => true, recomputeDerived: () => {}, getCardBonus: () => 0
};
vm.createContext(ctx);
vm.runInContext(fs.readFileSync(__dirname + '/../js/data.js', 'utf8'), ctx);
vm.runInContext(fs.readFileSync(__dirname + '/../js/v2_5_456_pet_system.js', 'utf8'), ctx);
vm.runInContext(fs.readFileSync(__dirname + '/../js/v2_5_457_pet_effect_completion.js', 'utf8'), ctx);
const checks = [];
function check(label, fn) {
  if (!fn()) throw new Error('FAIL: ' + label);
  checks.push(label);
}
check('133 pet eggs detected, including Loli Ruri egg; taming apple excluded', () => ctx.petEggIds().length === 133 && ctx.isPetEgg('loli_ruri_egg') && !ctx.isPetEgg('unripe_apple2'));
check('multilingual and new EP pet eggs indexed', () => ['blue_unicorn_egg','orc_hero_egg','orc_lord_egg','brownie_egg','tamadora_egg','clb_ss_egg01','clb_ss_egg02','ep20_ice_egg','copo_egg','grey_icewind_egg','icewind_egg'].every(id => ctx.isPetEgg(id)));
check('all pet eggs resolve to at least one valid species or general food', () => ctx.petEggIds().every(id => { ctx.state.pet={eggId:id}; return ctx.petFoodIds().some(f=>!!vm.runInContext('ITEMS',ctx)[f]); }));
check('merchant has 60 valid feed items with prices', () => vm.runInContext('PET_MERCHANT_STOCK.length===60 && PET_MERCHANT_STOCK.every(id=>ITEMS[id] && PET_MERCHANT_PRICES[id]>0)', ctx));
check('official intimacy thresholds 250 / 750 / 910', () => ctx.petIntimacyLabel(249)==='稍微陌生' && ctx.petIntimacyLabel(250)==='普通' && ctx.petIntimacyLabel(749)==='普通' && ctx.petIntimacyLabel(750)==='有點親密' && ctx.petIntimacyLabel(909)==='有點親密' && ctx.petIntimacyLabel(910)==='非常親密');
ctx.state.pet = { eggId: 'poring_egg', intimacy: 950, hunger: 80 };
check('Poring loyal stats parse', () => ctx.getPetBonus('luk') === 3 && ctx.getPetBonus('critRate') === 1);
ctx.state.pet = { eggId: 'mastering_egg', intimacy: 950, hunger: 80 };
check('higher intimacy replaces lower tier instead of stacking', () => ctx.getPetBonus('luk') === 3 && ctx.getPetBonus('critRate') === 3);
ctx.state.pet = { eggId: 'rocker_egg', intimacy: 950, hunger: 80 };
check('HP regeneration bonus enters combat bonus pipeline', () => ctx.getPetBonus('hpRegenPct') === 8 && ctx.effectiveGearBonuses().hpRegenPct === 8);
ctx.state.pet = { eggId: 'aliot_egg', intimacy: 950, hunger: 80 };
check('Aliot loyal attack delay and HIT', () => ctx.getPetBonus('afterAttackDelayPct') === 5 && ctx.getPetBonus('hit') === 12);
ctx.state.pet = { eggId: 'stone_shooter_egg', intimacy: 950, hunger: 80 };
check('element resistance parsed', () => ctx.getPetBonus('eleReduce_fire') === 5);
ctx.state.pet = { eggId: 'leaf_cat_egg', intimacy: 950, hunger: 80 };
check('race damage reduction parsed', () => ctx.getPetBonus('raceDmgReduce_brute') === 5);
ctx.state.pet = { eggId: 'phreeoni_egg', intimacy: 950, hunger: 80 };
check('Phreeoni induced-attack chance is applied', () => ctx.getPetBonus('perfectHitAddRate') === 15);
ctx.state.pet = { eggId: 'e_duckling_egg', intimacy: 950, hunger: 80 };
check('E-duckling induced-attack chance is applied', () => ctx.getPetBonus('perfectHitAddRate') === 10);
ctx.state.pet = { eggId: 'dark_illusion_egg', intimacy: 950, hunger: 80 };
check('dark illusion food mapping', () => ctx.petFoodIds().includes('fresh_plant'));
ctx.state.pet = { eggId: 'phreeoni_egg', intimacy: 950, hunger: 80 };
check('MVP pet food mapping', () => ctx.petFoodIds().includes('high_class_pet_food'));
ctx.state.pet = { eggId: 'rubylit_egg', intimacy: 800, hunger: 80 };
check('Japanese pet stat override', () => ctx.getPetBonus('atk') === 10);
ctx.state.pet = { eggId: 'tamadora_egg', intimacy: 950, hunger: 80 };
check('Tamadora auto-heal trigger is marked pending', () => ctx.petSpecialEffectSummary('tamadora_egg', 950).some(x => x.includes('自動施法觸發')));
console.log(`v2.5.457 pet runtime checks passed (${checks.length}):\n- ` + checks.join('\n- '));
