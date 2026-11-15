const fs=require('fs'),vm=require('vm'),path=require('path'),assert=require('assert');
const root=path.resolve(__dirname,'..');
const ctx={console,window:{},document:{addEventListener(){},getElementById(){return null},querySelector(){return null},querySelectorAll(){return[]}},Image:function(){},localStorage:{getItem(){return null},setItem(){},removeItem(){}},setTimeout(){return 0},clearTimeout(){},setInterval(){return 0},clearInterval(){},requestAnimationFrame(){return 0},performance:{now(){return 0}},Math,Date,Map,Set,Array,Object,Number,String,JSON,RegExp,Float64Array};
ctx.window=ctx;vm.createContext(ctx);
for(const f of ['data.js','img_alias.js','v2_5_397_card_catalog_batch.js','v2_5_398_card_catalog_batch.js','v2_5_399_card_catalog_batch.js','v2_5_400_ep21_card_completion.js','v2_5_402_ep21_encroached_tan_card.js','v2_5_403_ep21_missing_cards.js','v2_5_395_card_set_codex.js','v2_5_396_card_set_codex.js','v2_5_404_ep20_card_effect_completion.js','engine.js'])
  vm.runInContext(fs.readFileSync(path.join(root,'js',f),'utf8'),ctx,{timeout:60000});
const setup=id=>{
  const slot=vm.runInContext(`CARDS['${id}'].slot`,ctx);
  const key=slot==='armor'?'armor':slot==='shield'?'shield':slot==='garment'?'garment':slot==='weapon'?'weapon':slot==='headgear'?'headgear':slot==='footgear'?'footgear':slot==='accessory'?'accessory1':slot;
  vm.runInContext(`ITEMS.__test={id:'__test',type:'armor',armorType:'armor'};state={equip:{${key}:'x'},instances:{x:{item:'__test',refine:12,cards:['${id}']}},stats:{str:100,agi:1,vit:100,int:100,dex:100,luk:1},baseLevel:250,jobLevel:60,jobId:'element_master',learnedSkills:{},traitAlloc:{spl:100}};`,ctx);
};
const bonus=k=>vm.runInContext(`getCardBonus('${k}')`,ctx);
setup('icebear_card');assert.equal(bonus('spCostPct'),7);
setup('jormungandr_sanctuary_guardian_card');
for(const k of ['res','eleDmg_water','eleDmg_wind','eleDmg_earth','eleDmg_fire'])assert.equal(bonus(k),k==='res'?60:25,k);
for(const k of ['magicEleDmg_holy','magicEleDmg_shadow','magicEleDmg_ghost','magicEleDmg_poison'])assert.equal(bonus(k),-25,k);
setup('ultimate_ras_gand_card');assert.equal(bonus('magicBossDmgPct'),40);
const status=ctx.__V25404_EP20_EFFECT_COMPLETION__;
assert(status && status.applied.length===3);
console.log(JSON.stringify({version:'v2.5.404',updated:status.applied.length,checks:10,result:'passed'},null,2));
