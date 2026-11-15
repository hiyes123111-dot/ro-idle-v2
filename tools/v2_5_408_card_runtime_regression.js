const fs=require('fs'),vm=require('vm'),path=require('path'),assert=require('assert');
const root=path.resolve(__dirname,'..');
const ctx={console,window:{},document:{addEventListener(){},getElementById(){return null},querySelector(){return null},querySelectorAll(){return[]}},Image:function(){},localStorage:{getItem(){return null},setItem(){},removeItem(){}},setTimeout(){return 0},clearTimeout(){},setInterval(){return 0},clearInterval(){},requestAnimationFrame(){return 0},performance:{now(){return 0}},Math,Date,Map,Set,Array,Object,Number,String,JSON,RegExp,Float64Array};
ctx.window=ctx;vm.createContext(ctx);
for(const f of ['data.js','img_alias.js','v2_5_397_card_catalog_batch.js','v2_5_398_card_catalog_batch.js','v2_5_399_card_catalog_batch.js','v2_5_400_ep21_card_completion.js','v2_5_401_card_catalog_batch.js','v2_5_402_ep21_encroached_tan_card.js','v2_5_403_ep21_missing_cards.js','v2_5_404_ep20_card_effect_completion.js','v2_5_405_ep19_album_gap_completion.js','v2_5_406_ep19_card_completion.js','v2_5_407_ep19_card_effect_and_catalog.js','v2_5_408_ep21_winter_card_runtime_fix.js','engine.js'])
  vm.runInContext(fs.readFileSync(path.join(root,'js',f),'utf8'),ctx,{timeout:60000});
const ep21=['ep21_jiaobeibei_card','ep21_dudu_fish_card','ep21_rockworm_card','ep21_letter_monster_card','ep21_seabreeze_bird_card','ep21_velelling_card','ep21_icehorn_card'];
const winter=['winter_regenbeile_as_card','winter_regenbeile_kaiatos_card','winter_regenbeile_totio_card','winter_regenbeile_chairman_card'];
for(const id of [...ep21,...winter]){
 assert(vm.runInContext(`!!CARDS['${id}']`,ctx),`CARDS ${id}`);assert(vm.runInContext(`!!ITEMS['${id}']&&ITEMS['${id}'].codexInclude===true`,ctx),`ITEMS ${id}`);
 assert(vm.runInContext(`ITEMS['${id}'].officialItemId>0`,ctx),`item id ${id}`);
 assert(vm.runInContext(`CARD_ART_FALLBACKS['${id}']==='images/cards/generated/${id}.svg'`,ctx),`fallback map ${id}`);
 assert(fs.existsSync(path.join(root,'images/cards/generated',id+'.svg')),`art ${id}`);
}
const setup=(slot,itemId,cardIds,refine=0,extra={})=>{
 const inst='x_'+slot;
 vm.runInContext(`ITEMS['${itemId}']={id:'${itemId}',type:'${slot==='weapon'?'weapon':'armor'}',armorType:'${slot}',weaponLv:${extra.weaponLv||1},armorLevel:1,desc:'防具等級: 1'};state={equip:{${slot}:'${inst}'},instances:{'${inst}':{item:'${itemId}',refine:${refine},cards:${JSON.stringify(cardIds)}}},stats:{str:100,agi:1,vit:100,int:100,dex:100,luk:1},baseLevel:250,jobLevel:60,jobId:'element_master',learnedSkills:{},traitAlloc:{spl:100},buffs:[],maxSp:1000,sp:1000};`,ctx);
};
const b=k=>vm.runInContext(`getCardBonus('${k}')`,ctx);
// EP21 weapon level gates.
setup('weapon','test_weapon_lv4',['ep21_jiaobeibei_card'],0,{weaponLv:4});assert.equal(b('sizeDmg_small'),10);
setup('weapon','test_weapon_lv5',['ep21_jiaobeibei_card'],0,{weaponLv:5});assert.equal(b('sizeDmg_small'),20);
setup('weapon','test_weapon_lv5_magic',['ep21_velelling_card'],0,{weaponLv:5});assert.equal(b('magicSizeDmg_small'),20);
// EP21 refine thresholds and SP cost.
setup('footgear','test_boot',['ep21_dudu_fish_card'],6);assert.equal(b('matkPct'),5);assert.equal(b('magicRaceDmg_undead'),0);
setup('footgear','test_boot',['ep21_dudu_fish_card'],9);assert.equal(b('magicRaceDmg_undead'),17);
setup('footgear','test_boot',['ep21_rockworm_card'],9);assert.equal(b('raceDmg_undead'),20);
setup('footgear','test_boot',['ep21_letter_monster_card'],9);assert.equal(b('raceDmg_insect'),20);
setup('footgear','test_boot',['ep21_seabreeze_bird_card'],9);assert.equal(b('raceDmg_brute'),20);
setup('footgear','test_boot',['ep21_icehorn_card'],5);assert.equal(b('spCostPct'),10);assert.equal(b('magicEleDmg_water'),15);vm.runInContext('state.cardSpCostPct=getCardBonus(\"spCostPct\")',ctx);assert.equal(vm.runInContext('skillSpCost({spCost:100},1)',ctx),110);
// Winter As + Kaiatos combo and weapon Lv.5 thresholds.
setup('weapon','winter_test_weapon_lv5',['winter_regenbeile_as_card','winter_regenbeile_kaiatos_card'],0,{weaponLv:5});
assert.equal(b('raceDmg_demon'),37);assert.equal(b('raceDmg_humanoid'),37);assert.equal(b('sizeDmg_medium'),35);assert.equal(b('magicSizeDmg_medium'),35);
// Tatio base +5, every +2 refine +4, Helmut combo +5.
setup('garment','test_cape',['winter_regenbeile_totio_card'],4);
assert.equal(b('hitDmgPct'),13);
vm.runInContext(`ITEMS.test_armor={id:'test_armor',type:'armor',armorType:'armor',armorLevel:1};state.equip.armor='a';state.instances.a={item:'test_armor',refine:0,cards:['helmut_regene_card']};`,ctx);
assert.equal(b('hitDmgPct'),18);
assert.equal(vm.runInContext("cardHitPhysicalDamageMult(null,false)",ctx),1.18);
assert.equal(vm.runInContext("cardHitPhysicalDamageMult(null,true)",ctx),1);
assert.equal(vm.runInContext("cardHitPhysicalDamageMult({name:'地雷陷阱'},false)",ctx),1);
assert.equal(vm.runInContext("cardHitPhysicalDamageMult({name:'風暴斬擊'},false)",ctx),1.18);
assert.equal(vm.runInContext("cardHitPhysicalDamageMult({name:'地雷陷阱'},false)",ctx),1);
// Skill base damage uses the same multiplier only for non-critical supported physical skills.
vm.runInContext(`ITEMS.hit_test_weapon={id:'hit_test_weapon',type:'weapon',weaponLv:5,atk:100,weight:100};state.equip.weapon='hit_test_weapon';state._atkWeapon=100;state._atkStatus=20;state._atkMastery=0;state.physDmgPct=0;`,ctx);
vm.runInContext('Math.random=()=>0.5',ctx);
const hitSkill=vm.runInContext("skillBaseDamage(false,{size:'medium',race:'humanoid',element:'none'},1,{name:'風暴斬擊',rangeType:'melee'},false)",ctx);
const critSkill=vm.runInContext("skillBaseDamage(false,{size:'medium',race:'humanoid',element:'none'},1,{name:'風暴斬擊',rangeType:'melee'},true)",ctx);
assert(Math.abs(hitSkill/critSkill-1.18)<1e-9,'skill hit damage multiplier');
// Chairman card refinement and Helmut set.
setup('garment','test_cape',['winter_regenbeile_chairman_card'],4);
assert.equal(b('critRate'),5);assert.equal(b('critDmgPct'),12);
vm.runInContext(`state.instances.x_garment.cards.push('helmut_regene_card');`,ctx);
// Recompute cache key changes with cards.
assert.equal(b('critRate'),20);assert.equal(b('critDmgPct'),15);
const codex=vm.runInContext('getCodexPool().cards',ctx);assert([...ep21,...winter].every(id=>codex.includes(id)),'all 11 in codex');
const album=vm.runInContext("boxPool('card').ids",ctx);assert([...ep21,...winter].every(id=>album.includes(id)),'all 11 in old card album');
const status=ctx.__V25408_CARD_RUNTIME_FIX__;assert(status&&status.records===11);
console.log(JSON.stringify({version:'v2.5.408',ep21Cards:7,winterCards:4,weaponLevelGates:'passed',refineGates:'passed',spCost:'passed',hitPhysicalDamage:'passed',cardCombos:'passed',images:11,result:'passed'},null,2));
