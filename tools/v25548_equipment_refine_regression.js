const fs = require('fs');
const vm = require('vm');
const data = fs.readFileSync('js/data.js', 'utf8');
const engine = fs.readFileSync('js/engine.js', 'utf8');
const ctx = {};
vm.runInNewContext(data + '\nglobalThis.__items = ITEMS;', ctx);
const I = ctx.__items;
function ok(v, m) { if (!v) throw new Error(m); }
const expected = {
  tatenasi_armor_: ['perRefine', 'vit', 1],
  black_wing_suits: ['perRefine', 'atk', 3],
  doram_ele_suit: ['perRefine', 'dex', 1],
  pilebuncker_p: ['perRefine', 'atk', 5],
  upg_katar: ['perRefine', 'critDmgPct', 2],
  bangungot_boots: ['perRefine', 'mdef', 1],
  ep172_1h_book2: ['per3Refine', 'matk', 6],
  ep172_1h_foxtail: ['per3Refine', 'matk', 6],
  doram_only_suit: ['per3Refine', 'dex', 1],
  doram_only_cape: ['per3Refine', 'perfectDodge', 1],
  doram_high_cape: ['per3Refine', 'luk', 1],
  doram_high_suit: ['per2Refine', 'dex', 1],
  doram_ele_cape: ['per2Refine', 'int', 1],
  doram_ele_shoes: ['per2Refine', 'hp', 100],
  magical_foxtail: ['per2Refine', 'matkPct', 2],
  ex_model_foxtail: ['per2Refine', 'dex', 3],
  sinister_fist: ['perRefineSquare', 'atk', 1],
  sinister_viollin: ['perRefineSquare', 'atk', 1]
};
for (const [id, [field, key, value]] of Object.entries(expected)) {
  ok(I[id] && I[id][field] && I[id][field][key] === value, `${id}.${field}.${key} should be ${value}`);
}
ok(I.luna_bow.condBonus.some(x => x.when.refineMin === 6 && x.bonus.def === 3), 'Luna Bow +6 DEF threshold missing');
ok(I.luna_bow.condBonus.some(x => x.when.refineMin === 9 && x.bonus.def === 5), 'Luna Bow +9 DEF threshold missing');
ok(I.ep172_1h_book2.condBonus.some(x => x.when.refineMin === 7 && x.bonus.skillDmg_firebolt === 25), 'EP172 book +7 skill bonus missing');
ok(I.ep172_1h_book2.condBonus.some(x => x.when.refineMin === 11 && x.bonus.skillDmg_lightningbolt === 30), 'EP172 book +11 skill bonus missing');
ok(engine.includes('if (def.perRefine)') && engine.includes('Math.floor(r / 2)') && engine.includes('Math.floor(r / 3)') && engine.includes('r * r'), 'Generic refine calculation handlers missing');
console.log(`PASS ${Object.keys(expected).length + 4} equipment refine data assertions`);
