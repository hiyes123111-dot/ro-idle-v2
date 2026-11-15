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
for (const f of ['../js/data.js','../js/v2_5_392_card_catalog_repair.js','../js/v2_5_394_card_catalog_audit.js','../js/v321_ep21_drops_and_images.js','../js/v2_5_397_card_catalog_batch.js','../js/v2_5_398_card_catalog_batch.js','../js/engine.js']) {
  vm.runInContext(fs.readFileSync(path.join(__dirname, f), 'utf8'), ctx, {timeout:30000});
}
const ids = ['glerero_card','23rd_angel_poring_card','vt_vienne_dina_card','vt_zhoumo_card','vt_moonlight_fragrance_card','vt_qishi_card'];
const assert = (ok,msg) => { if (!ok) throw new Error(msg); };
const run = expr => vm.runInContext(expr,ctx);
assert(ctx.window.__V25398_CARD_BATCH__.total===6,'six cards batch registered');
for (const id of ids) {
  assert(run(`!!CARDS['${id}'] && !!ITEMS['${id}'] && ITEMS['${id}'].codexInclude`),`catalog/codex missing ${id}`);
  assert(run(`!!CARD_ART_FALLBACKS['${id}']`),`art fallback missing ${id}`);
  assert(fs.existsSync(path.join(root,run(`CARD_ART_FALLBACKS['${id}']`))),`art file missing ${id}`);
}
// Glerero: weapon category, weapon level, grade and per-three-refine all use the live engine path.
run(`ITEMS.test_glerero_weapon={id:'test_glerero_weapon',type:'weapon',weaponLv:5,weaponCat:'tsword'}; state={equip:{weapon:'wg'},instances:{wg:{item:'test_glerero_weapon',refine:6,grade:'A',cards:['glerero_card']}},stats:{str:1,agi:1,vit:1,int:1,dex:1,luk:1},baseLevel:230,jobLevel:60,jobId:'element_master',learnedSkills:{},traitAlloc:{}}`);
assert(run(`getCardBonus('critRate')`)===11,'Glerero CRI +7 and refine +6 gives +4');
assert(run(`getCardBonus('allSizeDmgPct')`)===10,'Glerero A-grade size physical bonus');
assert(run(`getCardBonus('allElePhysDmgPct')`)===15,'Glerero weapon type/level property physical bonus');
assert(run(`getCardBonus('eleDmgReduce_all')`)===5,'Glerero all-element damage reduction');
run(`ITEMS.test_glerero_dagger={id:'test_glerero_dagger',type:'weapon',weaponLv:5,weaponCat:'dagger'}; state={equip:{weapon:'wg'},instances:{wg:{item:'test_glerero_dagger',refine:6,grade:'A',cards:['glerero_card']}},stats:{str:1,agi:1,vit:1,int:1,dex:1,luk:1},baseLevel:230,jobLevel:60,jobId:'element_master',learnedSkills:{},traitAlloc:{}}`);
assert(run(`getCardBonus('allElePhysDmgPct')`)===0,'Glerero restricted weapon category does not leak');
// Stat / refine conditions for newly indexed headgear cards.
run(`ITEMS.test_headgear={id:'test_headgear',type:'armor',armorType:'headgear'}; state={equip:{head_top:'hg'},instances:{hg:{item:'test_headgear',refine:12,cards:['23rd_angel_poring_card','vt_vienne_dina_card','vt_zhoumo_card','vt_moonlight_fragrance_card','vt_qishi_card']}},stats:{str:99,agi:1,vit:99,int:99,dex:1,luk:99},baseLevel:230,jobLevel:60,jobId:'element_master',learnedSkills:{},traitAlloc:{}}`);
assert(run(`getCardBonus('allPropertyDmgPct')`)===8,'23rd Angel Poring all-property physical/magic effect');
assert(run(`getCardBonus('allEleDmg')`)===10,'Vienne magic-only element effect with +12 refine');
assert(run(`getCardBonus('allElePhysDmgPct')`)===10,'Moonlight physical-only all-element effect with +12 refine');
assert(run(`getCardBonus('critRate')`)===6 && run(`getCardBonus('critDmgPct')`)===10,'Zhoumo stat/refine conditions');
assert(run(`getCardBonus('skillAfterDelayPct')`)===7,'Qishi stat/refine conditions');
const codex=run(`getCodexPool().cards`);
assert(ids.every(id=>codex.includes(id)),'all new cards are in codex');
const album=run(`boxPool('card').ids`);
assert(ids.every(id=>album.includes(id)),'all new cards are in card album');
console.log(JSON.stringify({newCards:ids.length,engineConditions:'PASS',weaponCategoryGate:'PASS',codex:ids.length,cardAlbum:ids.length,images:ids.length},null,2));
