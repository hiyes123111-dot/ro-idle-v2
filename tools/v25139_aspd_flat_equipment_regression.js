const fs = require('fs');
const vm = require('vm');
const data = fs.readFileSync('js/data.js', 'utf8');
const engine = fs.readFileSync('js/engine.js', 'utf8');
const ctx = {};
vm.runInNewContext(data + '\nglobalThis.__items = ITEMS; globalThis.__cards = CARDS;', ctx);
const I = ctx.__items, C = ctx.__cards;
function ok(v, m) { if (!v) throw new Error(m); }
const flat = {
  hippie_guitar:1, big_cross_bow:1, royalguard_necklace:1, fashion_shoes:2,
  yummy_lollipop:1, s_stardust_shield:1, s_booster_armor:1,
  s_timeoverload_armor:1, rwc13_crownofglory_1st:1,
  rwc13_crownofglory_2nd:1, rwc13_crownofglory_3rd:1,
  rwc13_crownofglory_aw:1, samambaia:1, glory_fb_hat:1,
  bunny_egg_shell:1, pink_angeling_bubble:1, panda_balloon:1,
  heroinsignia_agi:2, lucis_flail:1, sachet:1
};
for (const [id, n] of Object.entries(flat)) ok(I[id] && I[id].aspdFlat === n, `${id} should provide ASPD flat ${n}`);
ok(I.r_hunting_boots.condBonus.some(x => x.bonus.aspdFlat === 1 && x.when.withAnyItem.includes('r_hunting_mail')), 'Hunting boots pair ASPD+1 missing');
ok(I.heart_card_in_mouth.condBonus.filter(x => x.bonus.aspdFlat).length === 3, 'Heart card ASPD pair/LUK thresholds missing');
ok(I.manteau_of_fallen.condBonus.some(x => x.when.statMin.agi === 90 && x.when.refineMin === 10 && x.bonus.aspdFlat === 1), 'Fallen Manteau ASPD+1 threshold missing');
for (const id of ['old_rune_circlet','old_driver_band_r','old_driver_band_y','old_protect_of_crown']) ok(I[id].per5Refine.aspdFlat === 1, `${id} refine ASPD growth missing`);
for (const id of ['s_blitz_earring','s_blitz_pendent','s_blitz_shoes','s_blitz_shield','s_blitz_weapon','s_blitz_armor']) ok(I[id].condBonus.some(x => x.when.refineMin === 7 && x.bonus.aspdFlat === 1), `${id} +7 ASPD missing`);
for (const id of ['s_blitz_shoes','s_blitz_shield']) ok(I[id].condBonus.some(x => x.when.refineMin === 9 && x.bonus.aspdFlat === 1), `${id} +9 ASPD missing`);
ok(C.soheon_card.condBonus.some(x => x.when.refineMin === 10 && x.bonus.aspdFlat === 1) && C.soheon_card.condBonus.some(x => x.when.refineMin === 14 && x.bonus.aspdFlat === 1), 'Soheon card refine ASPD thresholds missing');
ok(engine.includes('aspdFlatBonus += item.aspdFlat') && engine.includes("getCardBonus('aspdFlat')"), 'ASPD flat values not consumed by computeAspd');
ok(engine.includes('if (def.per5Refine)') && engine.includes('mergeBonus(total, def.per5Refine'), 'per5Refine handler missing');
console.log(`PASS ${Object.keys(flat).length + 18} ASPD flat equipment/card assertions`);
