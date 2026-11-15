const fs=require('fs'),vm=require('vm'),path=require('path'),assert=require('assert');
const root=path.resolve(__dirname,'..');
const ctx={console,window:{},CARD_ART_FALLBACKS:{},document:{addEventListener(){},removeEventListener(){},getElementById(){return null},querySelector(){return null},querySelectorAll(){return[]},createElement(){return{}},body:{appendChild(){},classList:{add(){},remove(){}}}},Image:function(){},localStorage:{getItem(){return null},setItem(){},removeItem(){}},setTimeout(){return 0},clearTimeout(){},setInterval(){return 0},clearInterval(){},requestAnimationFrame(){return 0},performance:{now(){return 0}},Math,Date,Map,Set,Array,Object,Number,String,JSON,RegExp,Float64Array};ctx.window=ctx;vm.createContext(ctx);
const files=['skills.js','monster_skills.js','jobs.js','data.js','img_alias.js','v2_5_392_card_catalog_repair.js','v2_5_394_card_catalog_audit.js','relics.js','v2_content.js','v2_4_content.js','v2_5_content.js','v2_6_skill_migration.js','v2_7_headgear_migration.js','v2_8_headgear_round16.js','v2_9_headgear_round17.js','v2_5_247_weapon_batch.js','v2_5_248_thanos_size_damage_fix.js','item_display_name_fix.js','v2_artifacts.js','achievements.js','v2_5_233_balance.js','v321_ep21_drops_and_images.js','v2_5_397_card_catalog_batch.js','v2_5_398_card_catalog_batch.js','v2_5_399_card_catalog_batch.js','v2_5_400_ep21_card_completion.js','v2_5_402_ep21_encroached_tan_card.js','v2_5_403_ep21_missing_cards.js','v2_5_395_card_set_codex.js','v2_5_396_card_set_codex.js','v2_5_404_ep20_card_effect_completion.js','v2_5_405_ep19_album_gap_completion.js','v2_5_406_ep19_card_completion.js','v2_5_407_ep19_card_effect_and_catalog.js','v2_5_408_ep21_winter_card_runtime_fix.js','v2_5_409_legacy_card_runtime_data.js','v2_5_410_legacy_card_completion.js','v2_5_412_remaining_2026_card_batch.js','v2_5_413_card_catalog_repair.js','v2_5_414_whikebain_rogue_combo_fix.js','v2_5_415_poplab_card_pages5_6.js','v2_5_418_poplab_card_pages7_15.js','v2_5_419_poplab_card_page16.js','v2_5_420_poplab_card_page17.js','engine.js'];
for(const f of files)vm.runInContext(fs.readFileSync(path.join(root,'js',f),'utf8'),ctx,{filename:f,timeout:60000});
const run=x=>vm.runInContext(x,ctx);

const engine=fs.readFileSync(path.join(root,'js','engine.js'),'utf8');

const defs=[
 ['sealed_queen_bee_card',4484,'headgear'],['sealed_nightmare_card',4485,'armor'],
 ['sealed_beelzebub_card',4486,'accessory'],['sealed_pharaoh_card',4489,'headgear'],
 ['sealed_orc_hero_card',4492,'headgear'],['sealed_tao_gunka_card',4493,'armor'],
 ['beetle_card',4505,'accessory'],['golden_beetle_card',4508,'accessory'],
['devil_pecker_card',4512,'headgear'],
 ['crazy_mantis_card',4513,'headgear']
];
for(const [id,imgId,slot] of defs){
 assert(run(`!!CARDS['${id}']`),`CARDS ${id}`);
 assert(run(`!!ITEMS['${id}']`),`ITEMS ${id}`);
 assert.equal(run(`ITEMS['${id}'].imgId`),imgId,`official ID ${id}`);
 assert(run(`ITEMS['${id}'].codexInclude===true`),`codex item ${id}`);
 assert(run(`getCodexPool().cards.includes('${id}')`),`codex pool ${id}`);
 assert(run(`boxPool('card').ids.includes('${id}')`),`main card album ${id}`);
 const album=slot==='headgear'?'card_headgear':slot==='armor'?'card_armor':slot==='accessory'?'card_accessory':'card_'+slot;
 assert(run(`boxPool('${album}').ids.includes('${id}')`),`slot card album ${id}`);
 const art=run(`window.CARD_ART_FALLBACKS['${id}']`);
 assert(art&&fs.existsSync(path.join(root,art)),`fallback image ${id}`);
 assert.equal(run(`CARDS['${id}'].unimplemented?.length||0`),0,`no unresolved effect ${id}`);
 assert.equal(run(`getCardAcquisitionSource('${id}').sources.length`),0,`no invented drop source ${id}`);
}
function equipCard(id,slot,refine,jobId='knight'){
 const equipSlot=slot==='headgear'?'head_top':slot==='accessory'?'accessory1':slot;
 run(`ITEMS.__test_host={id:'__test_host',type:${JSON.stringify(slot==='weapon'?'weapon':'armor')},armorType:${JSON.stringify(slot==='armor'?'armor':slot==='headgear'?'headgear':'accessory')},weaponType:'staff',weaponCat:'rod',weaponLv:4,slots:4,desc:'防具等級: 2'};state={equip:{${JSON.stringify(equipSlot)}:'__test_inst'},instances:{__test_inst:{item:'__test_host',refine:${refine},cards:[${JSON.stringify(id)}]}},stats:{str:99,agi:99,vit:99,int:99,dex:99,luk:99},baseLevel:200,jobLevel:70,jobId:${JSON.stringify(jobId)},learnedSkills:{},traitAlloc:{},hp:10000,sp:1000,maxHp:10000,maxSp:1000,buffs:[],monsters:[],inventory:[]};_gearBonusCache=null;_gearBonusKey='';`);
}
equipCard('sealed_queen_bee_card','headgear',0);
assert.equal(run("getCardBonus('gemstoneCostFree')"),100,'Sealed Queen Bee gemstone cost free');
assert.equal(run("getCardBonus('spCostPct')"),50,'Sealed Queen Bee SP cost +50%');
equipCard('sealed_queen_bee_card','headgear',15);
assert.equal(run("getCardBonus('spCostPct')"),35,'Sealed Queen Bee refine +15 nets SP cost +35%');
equipCard('sealed_nightmare_card','armor',0);
for(const key of ['eleDmg_holy','eleDmg_shadow','raceDmg_angel','raceDmg_demon']) assert.equal(run(`getCardBonus('${key}')`),20,`Sealed Nightmare ${key}+20`);
equipCard('sealed_nightmare_card','armor',15);
for(const key of ['eleDmg_holy','eleDmg_shadow','raceDmg_angel','raceDmg_demon']) assert.equal(run(`getCardBonus('${key}')`),30,`Sealed Nightmare refine +15 ${key}+30`);
equipCard('sealed_beelzebub_card','accessory',0);
assert.equal(run("getCardBonus('variableCastPct')"),-15,'Sealed Beelzebub variable cast -15%');
equipCard('sealed_pharaoh_card','headgear',0);
assert.equal(run("getCardBonus('spCostPct')"),-15,'Sealed Pharaoh SP cost -15%');
equipCard('sealed_orc_hero_card','headgear',0);
assert.equal(run("getCardBonus('vit')"),3,'Sealed Orc Hero VIT+3');
assert.equal(run("getCardBonus('ailResist_stun')"),40,'Sealed Orc Hero stun resist +40%');
equipCard('sealed_orc_hero_card','headgear',15);
assert.equal(run("getCardBonus('ailResist_stun')"),60,'Sealed Orc Hero refine +15 stun resist +60% total');
equipCard('sealed_tao_gunka_card','armor',0);
assert.equal(run("getCardBonus('hpPct')"),50,'Sealed Tao Gunka MHP+50%');
assert.equal(run("getCardBonus('def')"),-50,'Sealed Tao Gunka DEF-50');
assert.equal(run("getCardBonus('mdef')"),-50,'Sealed Tao Gunka MDEF-50');
equipCard('sealed_tao_gunka_card','armor',15);
assert.equal(run("getCardBonus('hpPct')"),75,'Sealed Tao Gunka refine +15 MHP+75% total');
equipCard('beetle_card','accessory',0);
assert.equal(run("getCardBonus('matk')"),20,'Beetle MATK+20');
assert.equal(run("getCardBonus('spPct')"),-1,'Beetle MSP-1%');
equipCard('dolomedes_card','headgear',5,'hunter');
assert.equal(run("getCardBonus('dex')"),3,'Dolomedes archer refine +3 adds DEX+1 at +5');
equipCard('dolomedes_card','headgear',6,'hunter');
assert.equal(run("getCardBonus('dex')"),4,'Dolomedes archer refine +6 adds DEX+2');
equipCard('dolomedes_card','headgear',6,'knight');
assert.equal(run("getCardBonus('dex')"),2,'Dolomedes refinement bonus is archer-only');
equipCard('golden_beetle_card','accessory',0);
assert.equal(run("getCardBonus('atk')"),20,'Golden Beetle ATK+20');
assert.equal(run("getCardBonus('hpPct')"),-1,'Golden Beetle MHP-1%');
equipCard('devil_pecker_card','headgear',4,'priest');
assert.equal(run("getCardBonus('healPct')"),5,'Devil Pecker Acolyte refine +4 heal +5% total');
equipCard('devil_pecker_card','headgear',6,'priest');
assert.equal(run("getCardBonus('healPct')"),6,'Devil Pecker Acolyte refine +6 heal +6% total');
equipCard('devil_pecker_card','headgear',6,'knight');
assert.equal(run("getCardBonus('healPct')"),3,'Devil Pecker bonus is acolyte-only');
equipCard('crazy_mantis_card','headgear',4,'assassin');
assert.equal(run("getCardBonus('critDmgPct')"),4,'Crazy Mantis Thief refine +4 crit damage +4% total');
equipCard('crazy_mantis_card','headgear',6,'assassin');
assert.equal(run("getCardBonus('critDmgPct')"),5,'Crazy Mantis Thief refine +6 crit damage +5% total');
equipCard('crazy_mantis_card','headgear',6,'knight');
assert.equal(run("getCardBonus('critDmgPct')"),2,'Crazy Mantis bonus is thief-only');
assert.equal(run("CARDS.sealed_apocalips_h_card.bonus.bossMdefIgnorePct"),15,'existing sealed Beelzebub card remains intact');
const skipped=run("window.__V25420_POPLAB_CARD_PAGE17__.intentionallySkipped.map(x=>x.imgId)");
assert.equal(skipped.length,18,'17 page-17 problem cards are deferred');
assert.equal(run("window.__V25420_POPLAB_CARD_PAGE17__.added.length"),10);
assert.equal(run("window.__V25420_POPLAB_CARD_PAGE17__.correctedExisting.length"),0);
assert.equal(run("window.__V25420_POPLAB_CARD_PAGE17__.alreadyCorrect.length"),2);
console.log(JSON.stringify({version:'v2.5.420',newCards:defs.length,correctedExisting:0,alreadyCorrect:2,skippedProblemCards:skipped.length,result:'passed'}));
