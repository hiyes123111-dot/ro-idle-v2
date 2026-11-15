/* Regression checks for Wind Hawk Sharp Shooting equipment effects in v2.5.270.
   Run: node tools/test_windhawk_sharpshooting_v2.5.270.js */
const fs = require('fs');
const vm = require('vm');
const path = require('path');
const root = path.resolve(__dirname, '..');
const ctx = vm.createContext({});
vm.runInContext(fs.readFileSync(path.join(root, 'js/data.js'), 'utf8'), ctx);
const ITEMS = vm.runInContext('ITEMS', ctx);
const CARDS = vm.runInContext('CARDS', ctx);
const engine = fs.readFileSync(path.join(root, 'js/engine.js'), 'utf8');
function assert(ok, msg) { if (!ok) throw new Error(msg); }
function conditional(itemId, predicate) {
  const item = ITEMS[itemId];
  assert(item, `missing item ${itemId}`);
  const row = (item.condBonus || []).find(predicate);
  assert(row, `${itemId} missing expected conditional bonus`);
  return row;
}

// Sharp Star Bow: per-refine critical damage, +9 ranged damage, +11 skill damage.
const bow = ITEMS.sharp_star_bow;
assert(bow.per1Refine && bow.per1Refine.critDmgPct === 1, 'bow per-refine crit damage missing');
assert(conditional('sharp_star_bow', x => x.when.refineMin === 9).bonus.rangedDmgPct === 7, 'bow +9 ranged damage missing');
assert(conditional('sharp_star_bow', x => x.when.refineMin === 11).bonus.skillDmg_sn_sharpshooting === 10, 'bow +11 Sharp Shooting damage missing');

// Bio Weapon Helm: refine thresholds and weapon-refine-driven skill damage.
const helm = ITEMS.bioweapon_helm_ra;
assert(helm.per2Refine.atk === 20, 'helm per-2 refine ATK missing');
assert(conditional('bioweapon_helm_ra', x => x.when.refineMin === 7).bonus.afterAttackDelayPct === 10, 'helm +7 attack delay missing');
assert(conditional('bioweapon_helm_ra', x => x.when.refineMin === 9).bonus.rangedDmgPct === 15, 'helm +9 ranged damage missing');
assert(conditional('bioweapon_helm_ra', x => x.when.refineMin === 11).bonus.sizeDmg_large === 10, 'helm +11 size damage missing');
const helmBow = conditional('bioweapon_helm_ra', x => (x.when.withAnyItem || []).includes('sharp_star_bow'));
assert(helmBow.bonus.critDmgPct === 20 && helmBow.bonus.perItem1Refine_skillDmg_sn_sharpshooting === 10, 'helm + Sharp Star Bow synergy missing');
// The engine must read the paired weapon's refine, not the helm host's refine.
assert(engine.includes('const itemPm = /^perItem(\\d+)Refine_(.+)$/'), 'engine paired-item refine parser missing');
assert(engine.includes('targetRefine / step'), 'engine paired-item refine multiplier missing');
assert(helmBow.bonus.perItem1Refine_skillDmg_sn_sharpshooting * Math.floor(20 / 1) === 200, 'expected +200% Sharp Shooting from a +20 bow');

// Grace Sharp Suit: base ATK and both set thresholds.
const suit = ITEMS.grace_sharp_suit;
assert(suit.bonus.atk === 100, 'Grace Sharp Suit flat ATK should match its +100 description');
const graceFullSet = conditional('grace_sharp_suit', x => (x.when.withItems || []).includes('grace_attack_ring'));
assert(graceFullSet.bonus.skillDmg_sn_sharpshooting === 15, 'Grace full-set Sharp Shooting damage missing');
const graceRefineSet = conditional('grace_sharp_suit', x => x.when.refineSumMin === 27);
assert(graceRefineSet.bonus.skillDmg_sn_sharpshooting === 15, 'Grace 27-refine-sum Sharp Shooting damage missing');
assert(graceRefineSet.when.refineSumOf.join(',') === 'grace_sharp_suit,grace_attack_manteau,grace_attack_boots', 'Grace refine-sum members incorrect');

// Correct refine descriptions for Grace boots and mantle; ring's unconditional effects.
assert(conditional('grace_attack_boots', x => x.when.refineMin === 7).bonus.fixedCast === -0.5, 'Grace boots +7 fixed cast missing');
assert(conditional('grace_attack_manteau', x => x.when.refineMin === 7).bonus.skillAfterDelayPct === 5, 'Grace mantle +7 skill after-delay missing');
assert(ITEMS.windhawk_snip_ring.bonus.skillAfterDelayPct === 5 && ITEMS.windhawk_snip_ring.bonus.rangedDmgPct === 6, 'Wind Hawk Sniper Ring base effects missing');

// Generated build must only reference cards that exist in this version's database.
const save = JSON.parse(fs.readFileSync(path.join(root, 'windhawk_sharp_build.json'), 'utf8'));
for (const [instanceId, inst] of Object.entries(save.instances || {})) {
  if (!Object.values(save.equip || {}).includes(instanceId)) continue;
  for (const cardId of (inst.cards || [])) assert(CARDS[cardId], `${instanceId} references missing card ${cardId}`);
}
const mantleInstance = save.instances['grace_attack_manteau#whmax20261111_garment'];
assert(mantleInstance.cards.length === 1 && mantleInstance.cards[0] === 'baphomet_card', 'invalid garment card not replaced');
console.log('v2.5.270 Wind Hawk Sharp Shooting equipment regression checks passed.');
