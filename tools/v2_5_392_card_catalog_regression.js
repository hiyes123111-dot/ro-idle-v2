const fs = require('fs');
const vm = require('vm');
const ctx = {
  window: {},
  document: { addEventListener(){}, getElementById(){return null}, querySelector(){return null}, querySelectorAll(){return []} },
  localStorage: { getItem(){return null}, setItem(){}, removeItem(){} },
  console, setTimeout(){return 0}, clearTimeout(){}, setInterval(){return 0}, clearInterval(){},
  requestAnimationFrame(){return 0}, performance:{now(){return 0}},
  Math, Date, Map, Set, Array, Object, Number, String, JSON, RegExp, Float64Array
};
vm.createContext(ctx);
for (const file of ['../js/data.js','../js/v2_5_392_card_catalog_repair.js','../js/engine.js']) {
  vm.runInContext(fs.readFileSync(__dirname + '/' + file, 'utf8'), ctx, { timeout: 30000 });
}
const added = [
  'ash_toad_card','ash_locust_card','windfire_eagle_card','kraboli_card','jennifer_card',
  'cave_kraboli_card','dispo_card','good_rabbit_card','small_bad_dog_card',
  'yerker_servant_card','yerker_officiant_card','summer_pope_card','soul_guide_card',
  'peska_card','summer_malan_card'
];
const codexAndAlbum = vm.runInContext(`({
  codex: getCodexPool().cards,
  album: boxPool('card').ids
})`, ctx);
if (added.some(id => !codexAndAlbum.codex.includes(id) || !codexAndAlbum.album.includes(id))) throw new Error('new cards missing from codex or card album');
let checked = 0;
for (const id of added) {
  const bonus = vm.runInContext(`CARDS['${id}'].bonus`, ctx);
  vm.runInContext(`state = {equip:{accessory1:'inst'},instances:{inst:{item:'ring',refine:0,cards:['${id}']}},stats:{str:1,agi:1,vit:1,int:1,dex:1,luk:1},baseLevel:212,jobLevel:60,jobId:'element_master',learnedSkills:{},traitAlloc:{}}`, ctx);
  for (const [key, expected] of Object.entries(bonus)) {
    const actual = vm.runInContext(`getCardBonus('${key}')`, ctx);
    if (actual !== expected) throw new Error(`${id} effect not applied: ${key} expected ${expected}, got ${actual}`);
    checked++;
  }
}
vm.runInContext("state = {equip:{accessory1:'inst'},instances:{inst:{item:'ring',refine:0,cards:['good_rabbit_card','small_bad_dog_card']}},stats:{str:1,agi:1,vit:1,int:1,dex:1,luk:1},baseLevel:212,jobLevel:60,jobId:'element_master',learnedSkills:{},traitAlloc:{}}",ctx);
if (vm.runInContext("getCardBonus('hpPct')",ctx) !== 20 || vm.runInContext("getCardBonus('spPct')",ctx) !== 20) throw new Error('Rabbit pair bonus failed');
vm.runInContext("state = {equip:{accessory1:'inst'},instances:{inst:{item:'ring',refine:0,cards:['soul_guide_card']}},stats:{str:70,agi:1,vit:1,int:1,dex:1,luk:1},baseLevel:230,jobLevel:60,jobId:'element_master',learnedSkills:{},traitAlloc:{}}",ctx);
if (vm.runInContext("getCardBonus('ignoreSizePenalty')",ctx) !== 1 || vm.runInContext("getCardBonus('meleeDmgPct')",ctx) !== 70 || vm.runInContext("getCardBonus('vit')",ctx) !== -20) throw new Error('Soul Guide conditions failed');
vm.runInContext("state = {equip:{accessory1:'inst'},instances:{inst:{item:'ring',refine:0,cards:['yerker_servant_card','yerker_officiant_card']}},stats:{str:1,agi:1,vit:1,int:1,dex:1,luk:1},baseLevel:212,jobLevel:60,jobId:'element_master',learnedSkills:{},traitAlloc:{}}",ctx);
if (vm.runInContext("getCardBonus('cRate')",ctx) !== 2 || vm.runInContext("getCardBonus('critDmgPct')",ctx) !== 12) throw new Error('Yerker pair bonus failed');
vm.runInContext("state = {equip:{accessory1:'inst'},instances:{inst:{item:'ring',refine:0,cards:['lava_toad_card']}},stats:{str:1,agi:1,vit:1,int:1,dex:1,luk:1},baseLevel:212,jobLevel:60,jobId:'element_master',learnedSkills:{},traitAlloc:{}}",ctx);
if (vm.runInContext("getCardBonus('magicEleDmg_fire')",ctx) !== 35 || vm.runInContext("getCardBonus('spCostPct')",ctx) !== 10) throw new Error('Lava Toad correction not applied');
console.log(JSON.stringify({newCards:added.length, baseEffectsApplied:checked, codexAndAlbum:added.length, pairConditions:2, refineAndLevelConditions:3, lavaCardCorrection:true},null,2));
