const fs = require('fs');
const vm = require('vm');
const path = require('path');
const root = path.resolve(__dirname, '..');
const ctx = {
  window:{}, CARD_ART_FALLBACKS:{},
  document:{addEventListener(){},getElementById(){return null},querySelector(){return null},querySelectorAll(){return[]}},
  localStorage:{getItem(){return null},setItem(){},removeItem(){}},
  console, setTimeout(){return 0},clearTimeout(){},setInterval(){return 0},clearInterval(){},
  requestAnimationFrame(){return 0},performance:{now(){return 0}},
  Math,Date,Map,Set,Array,Object,Number,String,JSON,RegExp,Float64Array
};
vm.createContext(ctx);
for (const f of ['../js/data.js','../js/v2_5_392_card_catalog_repair.js','../js/v2_5_394_card_catalog_audit.js','../js/v321_ep21_drops_and_images.js','../js/v2_5_397_card_catalog_batch.js','../js/engine.js']) {
  vm.runInContext(fs.readFileSync(path.join(__dirname, f), 'utf8'), ctx, {timeout:30000});
}
const ids = [
  'ep21_sea_angel_card','ep21_ice_seahorse_card','ep21_yester_cleaner_card',
  'ep21_yester_collector_card','ep21_yester_chef_card','ep21_yeltus_executor_card',
  'ep21_fioren_card','ep21_garlic_monster_card','ep21_elizabeth_card',
  'ep21_cave_lantern_fish_card','ep21_one_eyed_dororo_shrimp_card'
];
const assert = (ok,msg) => { if (!ok) throw new Error(msg); };
const run = expr => vm.runInContext(expr,ctx);
const audit = ctx.window.__V25397_CARD_BATCH__;
assert(audit && audit.total===11 && audit.added.length===11, '11 new cards registered');
for (const id of ids) {
  assert(run(`!!CARDS['${id}']`), `CARDS missing ${id}`);
  assert(run(`!!ITEMS['${id}'] && ITEMS['${id}'].codexInclude`), `ITEMS/codex missing ${id}`);
  assert(run(`!!CARDS['${id}'].source && CARDS['${id}'].addedVersion==='v2.5.397'`), `source/version missing ${id}`);
  assert(run(`!!CARD_ART_FALLBACKS['${id}']`), `art fallback missing ${id}`);
  assert(fs.existsSync(path.join(root,run(`CARD_ART_FALLBACKS['${id}']`))), `art file missing ${id}`);
}
// Verify through the real engine getCardBonus() path, not only the catalog metadata.
function equip(slot,id,refine,host='test_host') {
  run(`state={equip:{${slot}:'${host}'},instances:{${host}:{item:'${host}_item',refine:${refine},cards:['${id}']}},stats:{str:70,agi:1,vit:1,int:1,dex:1,luk:1},baseLevel:230,jobLevel:60,jobId:'element_master',learnedSkills:{},traitAlloc:{}}`);
  run(`ITEMS['${host}_item']={id:'${host}_item',type:'armor',armorLevel:2,desc:'防具等級: 2'}`);
}
equip('footgear','ep21_sea_angel_card',9); assert(run(`getCardBonus('raceDmg_demon')`)===20,'Sea Angel +7/+9 actual engine bonus');
equip('footgear','ep21_ice_seahorse_card',9); assert(run(`getCardBonus('magicRaceDmg_formless')`)===17,'Ice Seahorse +7/+9 actual engine bonus');
equip('footgear','ep21_yester_cleaner_card',9); assert(run(`getCardBonus('raceDmg_dragon')`)===20,'Yester Cleaner actual engine bonus');
equip('footgear','ep21_yester_collector_card',9); assert(run(`getCardBonus('raceDmg_formless')`)===20,'Yester Collector actual engine bonus');
equip('footgear','ep21_yester_chef_card',9); assert(run(`getCardBonus('magicRaceDmg_dragon')`)===17,'Yester Chef actual engine bonus');
equip('footgear','ep21_yeltus_executor_card',10); assert(run(`getCardBonus('magicEleDmg_ghost')`)===30 && run(`getCardBonus('spCostPct')`)===10,'Yortus Executor refine/SP effect');
equip('footgear','ep21_fioren_card',9); assert(run(`getCardBonus('magicRaceDmg_humanoid')`)===17,'Fioren actual engine bonus');
equip('footgear','ep21_garlic_monster_card',8); assert(run(`getCardBonus('critDmgPct')`)===11 && run(`getCardBonus('critRate')`)===12 && run(`getCardBonus('cRate')`)===3,'Garlic Monster actual engine bonus');
equip('garment','ep21_elizabeth_card',10); assert(run(`getCardBonus('neutralResistPct')`)===15 && run(`getCardBonus('magicEleDmg_poison')`)===30,'Elizabeth actual engine bonus');
// Cave Lantern Fish combo requires the specified companion card on another equipped item.
run(`state={equip:{garment:'cape_inst',accessory1:'ring_inst'},instances:{cape_inst:{item:'cape_item',refine:10,cards:['ep21_cave_lantern_fish_card']},ring_inst:{item:'ring_item',refine:0,cards:['abandoned_original_rgan_card']}},stats:{str:70,agi:1,vit:1,int:1,dex:1,luk:1},baseLevel:230,jobLevel:60,jobId:'element_master',learnedSkills:{},traitAlloc:{}}`);
assert(run(`getCardBonus('neutralResistPct')`)===20 && run(`getCardBonus('magicEleDmg_ghost')`)===30,'Cave Lantern Fish combo/refine actual engine bonus');
equip('garment','ep21_one_eyed_dororo_shrimp_card',11); assert(run(`getCardBonus('magicEleDmg_shadow')`)===-17,'One-Eyed Dororo +11 penalty plus Lv2 bonus');
equip('garment','ep21_one_eyed_dororo_shrimp_card',12); assert(run(`getCardBonus('magicEleDmg_shadow')`)===33,'One-Eyed Dororo +12 and armor Lv2 bonus');
// Codex pool must contain every newly added card.
const codex = run(`getCodexPool().cards`);
const album = run(`boxPool('card').ids`);
assert(ids.every(id=>codex.includes(id)),'new cards missing from codex');
assert(ids.every(id=>album.includes(id)),'new cards missing from card album');
console.log(JSON.stringify({newCards:ids.length,realEngineEffects:11,codex:ids.length,art:ids.length,refineComboConditions:'PASS'},null,2));
