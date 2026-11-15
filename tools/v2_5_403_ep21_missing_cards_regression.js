const fs=require('fs'),vm=require('vm'),path=require('path'),assert=require('assert');
const root=path.resolve(__dirname,'..');
const ctx={console,window:{},document:{addEventListener(){},getElementById(){return null},querySelector(){return null},querySelectorAll(){return[]}},Image:function(){},localStorage:{getItem(){return null},setItem(){},removeItem(){}},setTimeout(){return 0},clearTimeout(){},setInterval(){return 0},clearInterval(){},requestAnimationFrame(){return 0},performance:{now(){return 0}},Math,Date,Map,Set,Array,Object,Number,String,JSON,RegExp,Float64Array};ctx.window=ctx;vm.createContext(ctx);
for(const f of ['data.js','img_alias.js','v321_ep21_drops_and_images.js','v2_5_397_card_catalog_batch.js','v2_5_398_card_catalog_batch.js','v2_5_399_card_catalog_batch.js','v2_5_400_ep21_card_completion.js','v2_5_402_ep21_encroached_tan_card.js','v2_5_403_ep21_missing_cards.js','v2_5_395_card_set_codex.js','v2_5_396_card_set_codex.js','engine.js'])vm.runInContext(fs.readFileSync(path.join(root,'js',f),'utf8'),ctx,{timeout:60000});
const ids=['ep21_jiaobeibei_card','ep21_duduyu_card','ep21_rockworm_card','ep21_letter_monster_card','ep21_sea_wind_bird_card','ep21_velelling_card'];
for(const id of ids){assert(vm.runInContext(`!!CARDS['${id}']`,ctx),`CARDS ${id}`);assert(vm.runInContext(`!!ITEMS['${id}']&&ITEMS['${id}'].codexInclude===true`,ctx),`ITEMS/codex ${id}`);const art=ctx.window.CARD_ART_FALLBACKS[id];assert(art&&fs.existsSync(path.join(root,art)),`art ${id}`);}
assert.equal(vm.runInContext(`CARDS.ep21_jiaobeibei_card.slot`,ctx),'weapon');assert.equal(vm.runInContext(`CARDS.ep21_duduyu_card.slot`,ctx),'footgear');
const codex=vm.runInContext('getCodexPool().cards',ctx);assert(ids.every(id=>codex.includes(id)),'codex pool');
const album=vm.runInContext("boxPool('card').ids",ctx);assert(ids.every(id=>album.includes(id)),'card album');
const setup=(id,refine=0,weaponLv=5)=>{const slot=vm.runInContext(`CARDS['${id}'].slot`,ctx);const key=slot==='weapon'?'weapon':'footgear';const type=slot==='weapon'?'weapon':'armor';vm.runInContext(`ITEMS.__test={id:'__test',type:'${type}',weaponLv:${weaponLv}};state={equip:{${key}:'x'},instances:{x:{item:'__test',refine:${refine},cards:['${id}']}},stats:{str:100,agi:1,vit:1,int:100,dex:100,luk:1},baseLevel:250,jobLevel:60,jobId:'element_master',learnedSkills:{},traitAlloc:{spl:100}};`,ctx);};
const bonus=k=>vm.runInContext(`getCardBonus('${k}')`,ctx);
setup('ep21_jiaobeibei_card');assert.equal(bonus('sizeDmg_small'),20);
setup('ep21_velelling_card');assert.equal(bonus('magicSizeDmg_small'),20);
setup('ep21_duduyu_card',7);assert.equal(bonus('matkPct'),5);assert.equal(bonus('magicRaceDmg_undead'),10);
setup('ep21_rockworm_card',9);assert.equal(bonus('atkPct'),8);assert.equal(bonus('raceDmg_undead'),20);
setup('ep21_letter_monster_card',9);assert.equal(bonus('raceDmg_insect'),20);
setup('ep21_sea_wind_bird_card',9);assert.equal(bonus('raceDmg_animal'),20);

console.log(JSON.stringify({version:'v2.5.403',added:ids.length,codex:ids.length,album:ids.length,art:ids.length,tests:'passed'},null,2));
