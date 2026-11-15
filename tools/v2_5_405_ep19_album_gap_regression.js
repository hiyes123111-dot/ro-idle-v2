const fs=require('fs'),vm=require('vm'),path=require('path'),assert=require('assert');
const root=path.resolve(__dirname,'..');
const ctx={console,window:{},document:{addEventListener(){},getElementById(){return null},querySelector(){return null},querySelectorAll(){return[]}},Image:function(){},localStorage:{getItem(){return null},setItem(){},removeItem(){}},setTimeout(){return 0},clearTimeout(){},setInterval(){return 0},clearInterval(){},requestAnimationFrame(){return 0},performance:{now(){return 0}},Math,Date,Map,Set,Array,Object,Number,String,JSON,RegExp,Float64Array};
ctx.window=ctx;vm.createContext(ctx);
for(const f of ['data.js','img_alias.js','v2_5_397_card_catalog_batch.js','v2_5_398_card_catalog_batch.js','v2_5_399_card_catalog_batch.js','v2_5_400_ep21_card_completion.js','v2_5_401_card_catalog_batch.js','v2_5_402_ep21_encroached_tan_card.js','v2_5_403_ep21_missing_cards.js','v2_5_404_ep20_card_effect_completion.js','v2_5_395_card_set_codex.js','v2_5_396_card_set_codex.js','v2_5_405_ep19_album_gap_completion.js','engine.js'])
  vm.runInContext(fs.readFileSync(path.join(root,'js',f),'utf8'),ctx,{timeout:60000});
const ids=['ep19_entangled_intermediate_rgan_card','ep19_hallucigenia_baby_card','ep19_sieglouse_card','ep19_renovated_superior_rgan_card','ep19_extra_joker_card'];
for(const id of ids){assert(vm.runInContext(`!!CARDS['${id}']`,ctx),`CARDS ${id}`);assert(vm.runInContext(`!!ITEMS['${id}']&&ITEMS['${id}'].codexInclude===true`,ctx),`ITEMS ${id}`);assert(fs.existsSync(path.join(root,'images/cards/generated',id+'.svg')),`art ${id}`);}
const setup=(id,slot,refine=0,armorLevel=2)=>{
  vm.runInContext(`ITEMS.__test={id:'__test',type:'armor',armorType:'${slot==='shield'?'shield':'footgear'}',armorLevel:${armorLevel}};state={equip:{${slot}:'x'},instances:{x:{item:'__test',refine:${refine},cards:['${id}']}},stats:{str:100,agi:1,vit:100,int:100,dex:100,luk:1},baseLevel:250,jobLevel:60,jobId:'element_master',learnedSkills:{},traitAlloc:{spl:100}};`,ctx);
};
const b=k=>vm.runInContext(`getCardBonus('${k}')`,ctx);
setup(ids[0],'footgear',10,2);assert.equal(b('critRate'),-10);assert.equal(b('critDmgPct'),-10);assert.equal(b('cRate'),5);
setup(ids[0],'footgear',12,2);assert.equal(b('critRate'),20);assert.equal(b('critDmgPct'),10);
setup(ids[1],'shield',0,2);assert.equal(b('def'),-30);assert.equal(b('res'),15);assert.equal(b('eleDmgReduce_earth'),15);assert.equal(b('raceDmgReduce_insect'),15);assert.equal(b('sizeDmgReduce_small'),15);
setup(ids[2],'footgear',9,2);assert.equal(b('matkPct'),5);assert.equal(b('magicRaceDmg_insect'),17);
setup(ids[3],'shield',11,2);assert.equal(b('sizeDmgReduce_small'),-25);assert.equal(b('res'),50);assert.equal(b('mres'),50);
setup(ids[3],'shield',12,2);assert.equal(b('sizeDmgReduce_small'),25);
setup(ids[4],'shield',10,2);assert.equal(b('mdef'),100);
const pool=vm.runInContext('getCodexPool().cards',ctx);assert(ids.every(id=>pool.includes(id)),'codex pool');
const album=vm.runInContext("boxPool('card').ids",ctx);assert(ids.every(id=>album.includes(id)),'old card album pool');
const status=ctx.__V25405_EP19_ALBUM_GAP__;assert(status&&status.added.length===5);
console.log(JSON.stringify({version:'v2.5.405',added:status.added.length,codex:5,album:5,effects:'passed',result:'passed'},null,2));
