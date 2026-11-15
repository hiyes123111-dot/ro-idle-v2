const fs=require('fs'),vm=require('vm'),path=require('path'),assert=require('assert');
const root=path.resolve(__dirname,'..');
const ctx={console,window:{},CARD_ART_FALLBACKS:{},document:{addEventListener(){},removeEventListener(){},getElementById(){return null},querySelector(){return null},querySelectorAll(){return[]},createElement(){return{}},body:{appendChild(){},classList:{add(){},remove(){}}}},Image:function(){},localStorage:{getItem(){return null},setItem(){},removeItem(){}},setTimeout(){return 0},clearTimeout(){},setInterval(){return 0},clearInterval(){},requestAnimationFrame(){return 0},performance:{now(){return 0}},Math,Date,Map,Set,Array,Object,Number,String,JSON,RegExp,Float64Array};ctx.window=ctx;vm.createContext(ctx);
const files=['skills.js','monster_skills.js','jobs.js','data.js','img_alias.js','v2_5_392_card_catalog_repair.js','v2_5_394_card_catalog_audit.js','relics.js','v2_content.js','v2_4_content.js','v2_5_content.js','v2_6_skill_migration.js','v2_7_headgear_migration.js','v2_8_headgear_round16.js','v2_9_headgear_round17.js','v2_5_247_weapon_batch.js','v2_5_248_thanos_size_damage_fix.js','item_display_name_fix.js','v2_artifacts.js','achievements.js','v2_5_233_balance.js','v321_ep21_drops_and_images.js','v2_5_397_card_catalog_batch.js','v2_5_398_card_catalog_batch.js','v2_5_399_card_catalog_batch.js','v2_5_400_ep21_card_completion.js','v2_5_402_ep21_encroached_tan_card.js','v2_5_403_ep21_missing_cards.js','v2_5_395_card_set_codex.js','v2_5_396_card_set_codex.js','v2_5_404_ep20_card_effect_completion.js','v2_5_405_ep19_album_gap_completion.js','v2_5_406_ep19_card_completion.js','v2_5_407_ep19_card_effect_and_catalog.js','v2_5_408_ep21_winter_card_runtime_fix.js','v2_5_409_legacy_card_runtime_data.js','v2_5_410_legacy_card_completion.js','v2_5_412_remaining_2026_card_batch.js','v2_5_413_card_catalog_repair.js','v2_5_414_whikebain_rogue_combo_fix.js','v2_5_415_poplab_card_pages5_6.js','v2_5_418_poplab_card_pages7_15.js','engine.js'];
for(const f of files)vm.runInContext(fs.readFileSync(path.join(root,'js',f),'utf8'),ctx,{filename:f,timeout:60000});
const run=x=>vm.runInContext(x,ctx);
const defs=[
 ['maya_puple_card',4198,'headgear','card_headgear'],
 ['iron_fist_card',4239,'footgear','card_footgear'],
 ['evil_santa_card',4243,'armor','card_armor'],
 ['executioner_card',4250,'shield','card_shield'],
 ['lord_of_death_card',4263,'weapon','card_weapon'],
 ['dark_knight_card',4276,'weapon','card_weapon'],
 ['bloody_knight_card',4320,'weapon','card_weapon'],
 ['xiao_qing_card',4373,'garment','card_garment'],
 ['tanee_card',4376,'footgear','card_footgear'],
 ['gibbet_card',4406,'weapon','card_weapon'],
 ['sword_guardian_card',4427,'weapon','card_weapon'],
 ['archer_guardian_card',4428,'weapon','card_weapon'],
 ['dark_shadow_card',4449,'shield','card_shield'],
 ['banshee_queen_card',4450,'armor','card_armor']
];
for(const [id,imgId,slot,album] of defs){
 assert(run(`!!CARDS['${id}']`),`CARDS ${id}`);
 assert(run(`!!ITEMS['${id}']`),`ITEMS ${id}`);
 assert.equal(run(`ITEMS['${id}'].imgId`),imgId,`official ID ${id}`);
 assert(run(`ITEMS['${id}'].codexInclude === true`),`codex item ${id}`);
 assert(run(`getCodexPool().cards.includes('${id}')`),`codex pool ${id}`);
 assert(run(`boxPool('card').ids.includes('${id}')`) || run(`boxPool('cardFlat').ids.includes('${id}')`),`main card album ${id}`);
 assert(run(`boxPool('${album}').ids.includes('${id}')`),`slot album ${id}`);
 const art=run(`window.CARD_ART_FALLBACKS['${id}']`);assert(art&&fs.existsSync(path.join(root,art)),`fallback art ${id}`);
 if(['gibbet_card','dark_shadow_card','banshee_queen_card'].includes(id)) assert.equal(run(`CARDS['${id}'].unimplemented?.length || 0`),0,`effect implemented ${id}`); else assert(run(`CARDS['${id}'].unimplemented.length > 0`),`unimplemented effect clearly marked ${id}`);
 if(id==='gibbet_card') assert.equal(run(`CARDS['${id}'].monsterId`),'gibbet'); else assert.equal(run(`CARDS['${id}'].monsterId`),null,`no invented monster source ${id}`);
 if(id==='gibbet_card') { const src=run(`getCardAcquisitionSource('${id}')`); assert.equal(src.sources.length,1); assert.equal(src.sources[0].mon,'gibbet'); assert.equal(src.sources[0].chance,0.0005); } else assert.equal(run(`getCardAcquisitionSource('${id}').sources.length`),0,`no invented drop ${id}`);
}
assert.equal(run("CARDS.executioner_card.bonus.sizeDmgReduce_large"),25);
assert.equal(run("CARDS.executioner_card.bonus.def"),1);
run("ITEMS.__test_shield={id:'__test_shield',type:'armor',armorType:'shield',desc:'test'};state={equip:{shield:'__test_shield_inst'},instances:{__test_shield_inst:{item:'__test_shield',refine:0,cards:['executioner_card']}},stats:{str:1,agi:1,vit:1,int:1,dex:1,luk:1},baseLevel:100,jobLevel:50,jobId:'knight',learnedSkills:{},traitAlloc:{}};_gearBonusCache=null;_gearBonusKey='';");
assert.equal(run("getCardBonus('sizeDmgReduce_large')"),25,'Executioner card applies large physical damage reduction');
assert.equal(run("getCardBonus('def')"),1,'Executioner card applies DEF+1');
assert.equal(run("CARDS.zealotus_card.slot"),'shield');
assert.equal(run("ITEMS.zealotus_card.imgId"),4277);
assert.equal(run("ITEMS.bacsojin_card.imgId"),4372);
assert.equal(run("ITEMS.kiel_card.imgId"),4403);
assert.equal(run("ITEMS.nidhogg_shadow_card.imgId"),4456);
assert.equal(run("CARDS.nidhogg_shadow_card.bonus.int"),5);
assert.equal(run("CARDS.nidhogg_shadow_card.fixedCastPct"),undefined);
assert(run("CARDS.nidhogg_shadow_card.unimplemented.some(x=>x.includes('固定詠唱'))"));

assert.equal(run("ITEMS.nahtzigger_card.imgId"),4457);
assert.equal(run("CARDS.nahtzigger_card.name"),'夜勝魔卡片');
assert(run("getCodexPool().cards.includes('nidhogg_shadow_card')"));
assert(run("getCodexPool().cards.includes('nahtzigger_card')"));
assert.equal(run("CARDS.kiel_card.bonus.skillCdFlat"),-3);
assert.equal(run("CARDS.kiel_card.bonus.skillAfterDelayPct"),undefined);
assert.equal(run("CARDS.dark_shadow_card.bonus.eleReduce_shadow"),20);
assert.equal(run("CARDS.dark_shadow_card.bonus.eleDmg_shadow"),5);
assert.equal(run("CARDS.banshee_queen_card.bonus.int"),1);
assert.equal(run("CARDS.banshee_queen_card.bonus.matk"),10);
run("state={equip:{armor:'__senior_inst'},instances:{__senior_inst:{item:'__test_armor',refine:0,cards:['senior_red_pepper_card']}},stats:{str:1,agi:1,vit:1,int:1,dex:1,luk:1},baseLevel:100,jobLevel:50,jobId:'knight',learnedSkills:{},traitAlloc:{}};_gearBonusCache=null;_gearBonusKey='';");
assert.equal(run("getCardBonus('hpPct')"),3,'Legacy hpRate alias applies MaxHP +3%');
run("state={equip:{garment:'__sagittarius_inst'},instances:{__sagittarius_inst:{item:'__test_armor',refine:0,cards:['sagittarius_ep19_card']}},stats:{str:1,agi:1,vit:1,int:1,dex:1,luk:1},baseLevel:100,jobLevel:50,jobId:'knight',learnedSkills:{},traitAlloc:{}};_gearBonusCache=null;_gearBonusKey='';");
assert.equal(run("getCardBonus('eleDmgReduce_all')"),-30,'Legacy allResistPct applies all-element resistance penalty');

assert.equal(run("CARDS.bacsojin_card.bonus.spCostPct"),15);
assert.equal(run("CARDS.bacsojin_card.bonus.healPct"),30);
assert(run("getCodexPool().cards.includes('bacsojin_card')"));
assert(run("boxPool('card_headgear').ids.includes('bacsojin_card')"));
assert(run("boxPool('card_headgear').ids.includes('kiel_card')"));
assert(run("ITEMS.zealotus_card.codexInclude === true"));
assert(run("getCodexPool().cards.includes('zealotus_card')"));
assert(run("boxPool('card_shield').ids.includes('zealotus_card')"));
run("ITEMS.__test_weapon2={id:'__test_weapon2',type:'weapon',weaponType:'staff',slots:1,desc:'test'};state={equip:{weapon:'__test_weapon2_inst'},instances:{__test_weapon2_inst:{item:'__test_weapon2',refine:0,cards:['gibbet_card']}},stats:{str:1,agi:1,vit:1,int:1,dex:1,luk:1},baseLevel:100,jobLevel:50,jobId:'knight',learnedSkills:{},traitAlloc:{}};_gearBonusCache=null;_gearBonusKey='';");
assert.equal(run("getCardBonus('magicRaceDmg_demon')"),2,'Gibbet card applies demon magic damage');
run("ITEMS.__test_hat={id:'__test_hat',type:'armor',armorType:'headgear',desc:'test'};state={equip:{head_top:'__kiel_inst'},instances:{__kiel_inst:{item:'__test_hat',refine:0,cards:['kiel_card']}},stats:{str:1,agi:1,vit:1,int:1,dex:1,luk:1},baseLevel:100,jobLevel:50,jobId:'knight',learnedSkills:{},traitAlloc:{},buffs:[]};_gearBonusCache=null;_gearBonusKey='';");
assert.equal(run("getCardBonus('skillCdFlat')"),-3,'Kiel card applies original all-skill cooldown -3s');
assert.equal(run("getCardBonus('skillAfterDelayPct')"),0,'Kiel card does not alter after-cast delay');
assert.equal(run("effectiveCooldownMs('fireball',10)"),7000,'Kiel card reduces actual 10s skill cooldown to 7s');
run("state={equip:{head_top:'__bacsojin_inst'},instances:{__bacsojin_inst:{item:'__test_hat',refine:0,cards:['bacsojin_card']}},stats:{str:1,agi:1,vit:1,int:1,dex:1,luk:1},baseLevel:100,jobLevel:50,jobId:'priest',learnedSkills:{},traitAlloc:{}};_gearBonusCache=null;_gearBonusKey='';");
assert.equal(run("getCardBonus('healPct')"),30,'Bacsojin card healing bonus');
assert.equal(run("getCardBonus('spCostPct')"),15,'Bacsojin card SP cost increase');
run("state={equip:{shield:'__dark_shadow_inst'},instances:{__dark_shadow_inst:{item:'__test_shield',refine:0,cards:['dark_shadow_card']}},stats:{str:1,agi:1,vit:1,int:1,dex:1,luk:1},baseLevel:100,jobLevel:50,jobId:'knight',learnedSkills:{},traitAlloc:{}};_gearBonusCache=null;_gearBonusKey='';");
assert.equal(run("getCardBonus('eleReduce_shadow')"),20,'Dark Shadow card dark damage reduction');
assert.equal(run("getCardBonus('eleDmg_shadow')"),5,'Dark Shadow card dark element damage bonus');
run("ITEMS.__test_armor={id:'__test_armor',type:'armor',armorType:'armor',desc:'test'};state={equip:{armor:'__banshee_inst'},instances:{__banshee_inst:{item:'__test_armor',refine:0,cards:['banshee_queen_card']}},stats:{str:1,agi:1,vit:1,int:1,dex:1,luk:1},baseLevel:100,jobLevel:50,jobId:'knight',learnedSkills:{},traitAlloc:{}};_gearBonusCache=null;_gearBonusKey='';");
assert.equal(run("getCardBonus('int')"),1,'Banshee Queen INT bonus');
assert.equal(run("getCardBonus('matk')"),10,'Banshee Queen MATK bonus');

assert.equal(run("Object.keys(CARDS).filter(id=>!ITEMS[id]).length"),0,'no card missing item');
assert.equal(run("Object.keys(ITEMS).filter(id=>/_card$/.test(id)&&!CARDS[id]).length"),0,'no orphan card item');
const pending=['暗黑祭司','妖道','拉鏈熊','將軍魔碑','RSX-0806','消防魔','三頭龍','迪塔勒泰晤勒斯','蘭特克力斯','石頭波利'];
assert.equal(run("window.__V25418_POPLAB_CARD_PAGES7_15__.added.length"),14);
assert.equal(run("window.__V25418_POPLAB_CARD_PAGES7_15__.itemOnlyRepair.length"),5);
console.log(JSON.stringify({version:'v2.5.418',newCards:14,newItems:19,officialIds:[4198,4239,4243,4250,4263,4276,4320,4373,4376,4406,4427,4428,4449,4450,4277,4372,4403,4456,4457],codex:true,albums:true,artFallbacks:14,unsupportedEffectsMarked:true,noInventedDrops:true, verifiedExistingGameDrop:{monster:'鬼娃樹',chance:0.0005},pendingExcluded:pending.length,result:'passed'},null,2));
