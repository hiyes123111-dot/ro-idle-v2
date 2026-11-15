const fs=require('fs'),vm=require('vm'),path=require('path'),assert=require('assert');
const root=path.resolve(__dirname,'..');
const ctx={console,window:{},CARD_ART_FALLBACKS:{},document:{addEventListener(){},removeEventListener(){},getElementById(){return null},querySelector(){return null},querySelectorAll(){return[]},createElement(){return{}},body:{appendChild(){},classList:{add(){},remove(){}}}},Image:function(){},localStorage:{getItem(){return null},setItem(){},removeItem(){}},setTimeout(){return 0},clearTimeout(){},setInterval(){return 0},clearInterval(){},requestAnimationFrame(){return 0},performance:{now(){return 0}},Math,Date,Map,Set,Array,Object,Number,String,JSON,RegExp,Float64Array};ctx.window=ctx;vm.createContext(ctx);
const files=['skills.js','monster_skills.js','jobs.js','data.js','img_alias.js','v2_5_392_card_catalog_repair.js','v2_5_394_card_catalog_audit.js','relics.js','v2_content.js','v2_4_content.js','v2_5_content.js','v2_6_skill_migration.js','v2_7_headgear_migration.js','v2_8_headgear_round16.js','v2_9_headgear_round17.js','v2_5_247_weapon_batch.js','v2_5_248_thanos_size_damage_fix.js','item_display_name_fix.js','v2_artifacts.js','achievements.js','v2_5_233_balance.js','v321_ep21_drops_and_images.js','v2_5_397_card_catalog_batch.js','v2_5_398_card_catalog_batch.js','v2_5_399_card_catalog_batch.js','v2_5_400_ep21_card_completion.js','v2_5_402_ep21_encroached_tan_card.js','v2_5_403_ep21_missing_cards.js','v2_5_395_card_set_codex.js','v2_5_396_card_set_codex.js','v2_5_404_ep20_card_effect_completion.js','v2_5_405_ep19_album_gap_completion.js','v2_5_406_ep19_card_completion.js','v2_5_407_ep19_card_effect_and_catalog.js','v2_5_408_ep21_winter_card_runtime_fix.js','v2_5_409_legacy_card_runtime_data.js','v2_5_410_legacy_card_completion.js','v2_5_412_remaining_2026_card_batch.js','v2_5_413_card_catalog_repair.js','v2_5_414_whikebain_rogue_combo_fix.js','v2_5_415_poplab_card_pages5_6.js','v2_5_418_poplab_card_pages7_15.js','v2_5_419_poplab_card_page16.js','engine.js'];
for(const f of files)vm.runInContext(fs.readFileSync(path.join(root,'js',f),'utf8'),ctx,{filename:f,timeout:60000});
const run=x=>vm.runInContext(x,ctx);

const engine=fs.readFileSync(path.join(root,'js','engine.js'),'utf8');

const cardDefs=[
 ['skelion_card',4451,'armor'],['light_up_card1',4454,'weapon'],['light_up_card2',4455,'weapon'],
 ['ling_ke_card',4460,'headgear'],['hilsrion_queen_card',4463,'weapon'],['aunoe_card',4464,'weapon'],
 ['fanat_card',4465,'weapon'],['evil_eye_lord_card',4466,'weapon'],['dragon_egg_angry_card',4471,'weapon'],
 ['wooden_golem_mutant_card',4473,'weapon'],['zakudam_card',4474,'weapon'],['evil_spirit_mineral_card',4475,'weapon'],
 ['hell_ashura_mech_card',4477,'weapon'],['sealed_kiel_card',4480,'headgear']
];
for(const [id,imgId,slot] of cardDefs){
 assert(run(`!!CARDS['${id}']`),`CARDS ${id}`);
 assert(run(`!!ITEMS['${id}']`),`ITEMS ${id}`);
 assert.equal(run(`ITEMS['${id}'].imgId`),imgId,`official ID ${id}`);
 assert(run(`ITEMS['${id}'].codexInclude === true`),`codex ${id}`);
 assert(run(`getCodexPool().cards.includes('${id}')`),`codex pool ${id}`);
 const album=slot==='headgear'?'card_headgear':slot==='armor'?'card_armor':slot==='weapon'?'card_weapon':'card_'+slot;
 assert(run(`boxPool('card').ids.includes('${id}')`)||run(`boxPool('cardFlat').ids.includes('${id}')`),`main card album ${id}`);
 assert(run(`boxPool('${album}').ids.includes('${id}')`),`slot card album ${id}`);
 const art=run(`window.CARD_ART_FALLBACKS['${id}']`);
 assert(art&&fs.existsSync(path.join(root,art)),`fallback image ${id}`);
 assert.equal(run(`CARDS['${id}'].unimplemented?.length||0`),0,`no unresolved effects on added supported cards ${id}`);
 assert.equal(run(`getCardAcquisitionSource('${id}').sources.length`),0,`no invented drop source ${id}`);
}
function equipCard(id,slot,refine,hostProps={}){
 const equipSlot=slot==='headgear'?'head_top':slot==='footgear'?'footgear':slot;
 run(`ITEMS.__test_host={id:'__test_host',type:${JSON.stringify(slot==='weapon'?'weapon':'armor')},armorType:${JSON.stringify(slot==='armor'?'armor':slot==='headgear'?'headgear':'footgear')},weaponType:${JSON.stringify(hostProps.weaponType||'staff')},weaponCat:${JSON.stringify(hostProps.weaponCat||hostProps.weaponType||'rod')},weaponLv:4,slots:4,desc:'防具等級: 2'};state={equip:{${JSON.stringify(equipSlot)}:'__test_inst'},instances:{__test_inst:{item:'__test_host',refine:${refine},cards:[${JSON.stringify(id)}]}},stats:{str:99,agi:99,vit:99,int:99,dex:99,luk:99},baseLevel:200,jobLevel:70,jobId:'knight',learnedSkills:{},traitAlloc:{},hp:10000,sp:1000,maxHp:10000,maxSp:1000,buffs:[],monsters:[],inventory:[]};_gearBonusCache=null;_gearBonusKey='';`);
}
equipCard('skelion_card','armor',0);
assert.equal(run("getCardBonus('matk')"),100,'Skelion card MATK+100');
equipCard('ling_ke_card','headgear',0);
assert.equal(run("getCardBonus('healPct')"),4,'Ling Ke healing +4%');
assert.equal(run("getCardBonus('spCost_heal')"),15,'Ling Ke Heal SP +15');
assert.equal(run("skillSpCost(SKILLS.heal,1)"),27,'Heal base 12 + card flat 15 SP');
equipCard('hilsrion_queen_card','weapon',11);
assert.equal(run("getCardBonus('critRate')"),5,'Hilsrion queen base CRI+5');
assert.equal(run("getCardBonus('atk')"),0,'refine +11 does not gain ATK');
equipCard('hilsrion_queen_card','weapon',12);
assert.equal(run("getCardBonus('atk')"),35,'refine +12 gains ATK+35');
equipCard('hilsrion_queen_card','weapon',14);
assert.equal(run("getCardBonus('critRate')"),15,'refine +14 gains CRI+10 on top of base +5');
equipCard('aunoe_card','weapon',0);
assert.equal(run("getCardBonus('critDmgPct')"),20,'Aunoe critical damage +20%');
equipCard('fanat_card','weapon',10,{weaponCat:'tsword',weaponType:'tsword'});
assert.equal(run("getCardBonus('atk')"),10,'Fanat ATK+10');
assert.equal(run("getCardBonus('aspdFlat')"),1,'Fanat two-handed sword refine +10 ASPD+1');
equipCard('fanat_card','weapon',14,{weaponCat:'tsword',weaponType:'tsword'});
assert.equal(run("getCardBonus('aspdFlat')"),2,'Fanat two-handed sword refine +14 ASPD+2 total');
equipCard('fanat_card','weapon',14,{weaponCat:'sword',weaponType:'sword'});
assert.equal(run("getCardBonus('aspdFlat')"),0,'Fanat does not apply ASPD to one-handed sword');
equipCard('evil_eye_lord_card','weapon',10,{weaponCat:'bow',weaponType:'bow'});
assert.equal(run("getCardBonus('rangedDmgPct')"),3,'Evil Eye Lord ranged damage +3%');
assert.equal(run("getCardBonus('aspdFlat')"),1,'Evil Eye Lord bow refine +10 ASPD+1');
equipCard('evil_eye_lord_card','weapon',14,{weaponCat:'bow',weaponType:'bow'});
assert.equal(run("getCardBonus('aspdFlat')"),2,'Evil Eye Lord bow refine +14 ASPD+2 total');
equipCard('dragon_egg_angry_card','weapon',0);
assert.equal(run("getCardBonus('magicRaceDmg_dragon')"),10,'Dragon Egg magic dragon damage +10%');
equipCard('wooden_golem_mutant_card','weapon',0);
assert.equal(run("getCardBonus('magicRaceDmg_undead')"),10,'Mutant Wooden Golem magic undead damage +10%');
equipCard('zakudam_card','weapon',0);
assert.equal(run("getCardBonus('magicRaceDmg_demihuman')"),10,'Zakudam magic demihuman damage +10%');
equipCard('evil_spirit_mineral_card','weapon',0);
assert.equal(run("getCardBonus('magicRaceDmg_formless')"),10,'Evil Spirit Mineral magic formless damage +10%');
equipCard('hell_ashura_mech_card','weapon',0);
assert.equal(run("getCardBonus('magicRaceDmg_demon')"),10,'Hell Ashura Mech magic demon damage +10%');
equipCard('sealed_kiel_card','headgear',14);
assert.equal(run("getCardBonus('skillAfterDelayPct')"),-15,'Sealed Kiel base after-cast delay -15%');
equipCard('sealed_kiel_card','headgear',15);
assert.equal(run("getCardBonus('skillAfterDelayPct')"),-20,'Sealed Kiel refine +15 adds -5%');
equipCard('hardrock_mommos_card','armor',11);
assert.equal(run("getCardBonus('def')"),5,'Hardrock Mammoth base DEF+5');
assert.equal(run("getCardBonus('hpPct')"),0,'Hardrock Mammoth no refine HP bonus below +12');
equipCard('hardrock_mommos_card','armor',12);
assert.equal(run("getCardBonus('def')"),25,'Hardrock Mammoth refine +12 DEF+20 in addition to base');
assert.equal(run("getCardBonus('hpPct')"),10,'Hardrock Mammoth refine +12 MHP+10%');
equipCard('hardrock_mommos_card','armor',14);
assert.equal(run("getCardBonus('hpPct')"),13,'Hardrock Mammoth refine +14 MHP total +13%');

assert.equal(run("CARDS.light_up_card1.bonus && Object.keys(CARDS.light_up_card1.bonus).length"),0,'Business card 1 is zero-effect');
assert.equal(run("CARDS.light_up_card2.bonus && Object.keys(CARDS.light_up_card2.bonus).length"),0,'Business card 2 is zero-effect');
const skipped=run("window.__V25419_POPLAB_CARD_PAGE16__.intentionallySkipped.map(x=>x.imgId)");
for(const id of [4456,4458,4459,4461,4467,4472,4476,4481,4482]) assert(skipped.includes(id),`problem card ${id} intentionally skipped`);
assert(run("window.__V25419_POPLAB_CARD_PAGE16__.excludedProblemCards.length===23"),'all 22 pending/problem cards excluded from this page patch');
console.log(JSON.stringify({version:'v2.5.419',newCards:cardDefs.length,correctedExisting:1,skippedProblemCards:skipped.length,checks:'passed'}));
