const fs=require('fs'),vm=require('vm'),path=require('path'),assert=require('assert');
const root=path.resolve(__dirname,'..');
const ctx={console,window:{},document:{addEventListener(){},getElementById(){return null},querySelector(){return null},querySelectorAll(){return[]}},Image:function(){},localStorage:{getItem(){return null},setItem(){},removeItem(){}},setTimeout(){return 0},clearTimeout(){},setInterval(){return 0},clearInterval(){},requestAnimationFrame(){return 0},performance:{now(){return 0}},Math,Date,Map,Set,Array,Object,Number,String,JSON,RegExp,Float64Array};
ctx.window=ctx;vm.createContext(ctx);
for(const f of ['skills.js','monster_skills.js','jobs.js','data.js','img_alias.js','v2_5_397_card_catalog_batch.js','v2_5_398_card_catalog_batch.js','v2_5_399_card_catalog_batch.js','v2_5_400_ep21_card_completion.js','v2_5_401_card_catalog_batch.js','v2_5_402_ep21_encroached_tan_card.js','v2_5_403_ep21_missing_cards.js','v2_5_404_ep20_card_effect_completion.js','v2_5_405_ep19_album_gap_completion.js','v2_5_406_ep19_card_completion.js','v2_5_407_ep19_card_effect_and_catalog.js','v2_5_408_ep21_winter_card_runtime_fix.js','v2_5_409_legacy_card_runtime_data.js','v2_5_410_legacy_card_completion.js','v2_5_412_remaining_2026_card_batch.js','v2_5_413_card_catalog_repair.js','v2_5_414_whikebain_rogue_combo_fix.js','engine.js'])
 vm.runInContext(fs.readFileSync(path.join(root,'js',f),'utf8'),ctx,{timeout:60000});
const setup=(jobId,cards=['whikebain_card','stainer_card','wander_man_card','wild_rose_card','shinobi_card'])=>vm.runInContext(`state={equip:{accessory1:'x'},instances:{x:{item:'test_accessory',refine:0,cards:${JSON.stringify(cards)}}},stats:{str:1,agi:1,vit:1,int:1,dex:1,luk:1},baseLevel:250,jobLevel:60,jobId:'${jobId}',learnedSkills:{},traitAlloc:{spl:0},buffs:[],shields:[],activeFieldEffects:[],monsters:[],maxSp:100,sp:100,gold:0};ITEMS.test_accessory={id:'test_accessory',type:'armor',armorType:'accessory',armorLevel:1,desc:'系列: 飾品 防具等級: 1'};`,ctx);
const bonus=k=>vm.runInContext(`getCardBonus('${k}')`,ctx);
const spCost=()=>vm.runInContext(`state.cardSpCostPct=getCardBonus('spCostPct');skillSpCost({id:'test_skill',spCost:100},1)`,ctx);
// Common combo bonuses must work for any job.
setup('assassin',['whikebain_card']);
const baseStr=bonus('str'),baseAgi=bonus('agi'),baseBackstab=bonus('skillDmg_rg_backstap');
setup('assassin');
assert.equal(bonus('str')-baseStr,6,'common combo STR +6');
assert(bonus('agi')-baseAgi>=4,'common combo AGI +4 (other existing card combos may add more)');
assert.equal(bonus('skillDmg_rg_backstap')-baseBackstab,10,'common combo Back Stab +10%');
assert.equal(bonus('spCostPct'),0,'Assassin must not receive Rogue-only SP reduction');
assert.equal(bonus('blockSnatch'),0,'Assassin must not receive Rogue-only Snatch block');
assert.equal(spCost(),100,'Assassin skill SP cost remains unchanged');
// Rogue branch receives the 20% SP reduction and Snatch auto-spell block.
for (const job of ['rogue','stalker','shadowchaser','abyss_chaser']) {
 setup(job);
 assert.equal(bonus('spCostPct'),-20,job+' receives -20% SP cost');
 assert.equal(bonus('blockSnatch'),1,job+' blocks auto Snatch');
 assert.equal(spCost(),80,job+' skill SP cost is reduced by 20%');
 assert.equal(bonus('str'),6,job+' keeps common combo bonuses');
}
// Other Thief-line classes do not receive Rogue-only effects.
for (const job of ['thief','assassin_cross','guillotine_cross']) {
 setup(job);
 assert.equal(bonus('spCostPct'),0,job+' must not receive Rogue-only SP reduction');
 assert.equal(bonus('blockSnatch'),0,job+' must not receive Rogue-only Snatch block');
}
assert.equal(vm.runInContext("CARDS.whikebain_card.unimplemented.length",ctx),0,'all Whikebain combo effects are implemented and no stale pending markers remain');
const remainingNames=JSON.parse(vm.runInContext("JSON.stringify(Object.values(CARDS).filter(c=>c.unimplemented&&c.unimplemented.length).map(c=>c.name).sort())",ctx));
assert.deepEqual(remainingNames,['RSX-0806卡片','三頭龍卡片','妖道卡片','暗黑祭司卡片','消防魔卡片','瓦爾基里 蘭特克力斯卡片','石頭波利卡片','拉鏈熊卡片','將軍魔碑卡片','迪塔勒泰晤勒斯卡片'].sort(),'only the ten previously excluded cards remain marked for later review');
console.log(JSON.stringify({version:'v2.5.414',card:'闇●盜賊卡片',commonCombo:'STR+6 / AGI+4 / 背刺+10%',rogueBranch:['rogue','stalker','shadowchaser','abyss_chaser'],spCostReduction:20,otherThiefClassesUnaffected:true,checks:25,result:'passed'},null,2));
