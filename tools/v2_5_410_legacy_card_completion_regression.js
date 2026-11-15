const fs=require('fs'),vm=require('vm'),path=require('path'),assert=require('assert');
const root=path.resolve(__dirname,'..');
const ctx={console,window:{},document:{addEventListener(){},getElementById(){return null},querySelector(){return null},querySelectorAll(){return[]}},Image:function(){},localStorage:{getItem(){return null},setItem(){},removeItem(){}},setTimeout(){return 0},clearTimeout(){},setInterval(){return 0},clearInterval(){},requestAnimationFrame(){return 0},performance:{now(){return 0}},Math:Object.create(Math),Date,Map,Set,Array,Object,Number,String,JSON,RegExp,Float64Array};
ctx.window=ctx;vm.createContext(ctx);
for(const f of ['skills.js','monster_skills.js','jobs.js','data.js','img_alias.js','v2_5_397_card_catalog_batch.js','v2_5_398_card_catalog_batch.js','v2_5_399_card_catalog_batch.js','v2_5_400_ep21_card_completion.js','v2_5_401_card_catalog_batch.js','v2_5_402_ep21_encroached_tan_card.js','v2_5_403_ep21_missing_cards.js','v2_5_404_ep20_card_effect_completion.js','v2_5_405_ep19_album_gap_completion.js','v2_5_406_ep19_card_completion.js','v2_5_407_ep19_card_effect_and_catalog.js','v2_5_408_ep21_winter_card_runtime_fix.js','v2_5_409_legacy_card_runtime_data.js','v2_5_410_legacy_card_completion.js','engine.js'])
 vm.runInContext(fs.readFileSync(path.join(root,'js',f),'utf8'),ctx,{timeout:60000});
const setup=(slot,itemId,cards,jobId='element_master',int=50)=>{
 vm.runInContext(`ITEMS['${itemId}']={id:'${itemId}',type:'${slot==='weapon'?'weapon':'armor'}',armorType:'${slot}',weaponLv:4,armorLevel:1,desc:'系列: ${slot} 防具等級: 1'};state={equip:{${slot}:'x'},instances:{x:{item:'${itemId}',refine:0,cards:${JSON.stringify(cards)}}},stats:{str:1,agi:1,vit:1,int:${int},dex:1,luk:1},baseLevel:250,jobLevel:60,jobId:'${jobId}',learnedSkills:{},traitAlloc:{spl:0},buffs:[],shields:[],activeFieldEffects:[],monsters:[],maxSp:100,sp:100,gold:0};`,ctx);
};
const bonus=k=>vm.runInContext(`getCardBonus('${k}')`,ctx);
// Paper card: only the full thief combo gives guaranteed gemstone exemption.
setup('weapon','test_paper_weapon',['the_paper_card','wander_man_card','wild_rose_card','shinobi_card','dancing_dragon_card'],'thief');
assert.equal(bonus('gemstoneCostFree'),100);
assert.equal(bonus('spOnAttack'),1); // paper -1 + thief combo +2
setup('weapon','test_paper_non_thief',['the_paper_card','wander_man_card','wild_rose_card','shinobi_card','dancing_dragon_card'],'swordsman');
assert.equal(bonus('gemstoneCostFree'),0,'thief combo must not activate for non-thief jobs');
setup('weapon','test_paper_weapon',['the_paper_card','wander_man_card','wild_rose_card','shinobi_card','dancing_dragon_card'],'thief');
const originalGetCardBonus=ctx.getCardBonus;
ctx.getCardBonus=()=>100;
ctx.buffMult=()=>({flatBonus:0});
let removed=0;ctx.getItemQty=()=>0;ctx.sageWarehouseQty=()=>0;ctx.removeItem=()=>removed++;
assert.equal(ctx.sageCanPay(['yellow_gemstone'],1),true);
const paid=ctx.sagePay(['yellow_gemstone'],1);
assert.match(paid.label,/紙妖盜賊套卡/);
assert.equal(removed,0);
assert.equal(ctx.sageCanPay(['blue_potion'],1),false,'non-gemstone items must not be exempt');
ctx.getCardBonus=originalGetCardBonus;
// Ancient Mummy + Mummy combo must produce HIT +20 through the gear bonus path.
setup('shield','test_mummy_shield',['ancient_mummy_card','mummy_card']);
assert.equal(bonus('hit'),20); // Mummy card's own HIT+20 remains unchanged.
assert.equal(bonus('perfectHitAddRate'),20); // Combo adds 20% perfect-hit chance.
ctx.Math.random=()=>0.10;
const hitPass=vm.runInContext(`skillHits({id:'test_physical',maxLv:1},1,MONSTERS[Object.keys(MONSTERS)[0]],{})`,ctx);
assert.equal(hitPass,true,'Ancient Mummy combo perfect-hit roll should bypass normal flee check');
// Amon Ra: INT 99 threshold switches to project tuning value; below threshold remains base 3%.
setup('footgear','test_amon_boots',['amon_ra_card'],'element_master',99);
let spellCount=0;
ctx.findSkillAnywhere=()=>({id:'kyrie',name:'霸邪之陣',type:'buff_shield',maxLv:10});
ctx.castSkill=()=>{spellCount++;return true;};
ctx.Math.random=()=>0.04;
vm.runInContext(`state.cardAutoSpells={hit:[{on:'hit',skill:'kyrie',lv:10,chance:3,chanceByStat:{stat:'int',min:99,chance:6}}]};state.buffs=[];state.shields=[];state.activeFieldEffects=[];`,ctx);
vm.runInContext(`tryAutoSpells('hit',null)`,ctx);
assert.equal(spellCount,1,'INT99 6% branch should trigger at random 4%');
spellCount=0;vm.runInContext(`state.stats.int=98;state.cardAutoSpells={hit:[{on:'hit',skill:'kyrie',lv:10,chance:3,chanceByStat:{stat:'int',min:99,chance:6}}]};`,ctx);
vm.runInContext(`tryAutoSpells('hit',null)`,ctx);
assert.equal(spellCount,0,'INT98 must stay at base 3%');
assert.equal(ctx.__V25410_LEGACY_CARD_COMPLETION__.updated.length,3);
console.log(JSON.stringify({version:'v2.5.410',cards:3,checks:10,results:['paper-thief-gemstone-exemption','ancient-mummy-hit-plus-20','amon-ra-int99-proc-boost'],result:'passed'},null,2));
