const fs=require('fs'),vm=require('vm'),path=require('path'),assert=require('assert');
const root=path.resolve(__dirname,'..');
const ctx={console,window:{},CARD_ART_FALLBACKS:{},document:{addEventListener(){},removeEventListener(){},getElementById(){return null},querySelector(){return null},querySelectorAll(){return[]},createElement(){return{}},body:{appendChild(){},classList:{add(){},remove(){}}}},Image:function(){},localStorage:{getItem(){return null},setItem(){},removeItem(){}},setTimeout(){return 0},clearTimeout(){},setInterval(){return 0},clearInterval(){},requestAnimationFrame(){return 0},performance:{now(){return 0}},Math,Date,Map,Set,Array,Object,Number,String,JSON,RegExp,Float64Array};ctx.window=ctx;vm.createContext(ctx);
const files=['skills.js','monster_skills.js','jobs.js','data.js','img_alias.js','v2_5_392_card_catalog_repair.js','v2_5_394_card_catalog_audit.js','relics.js','v2_content.js','v2_4_content.js','v2_5_content.js','v2_6_skill_migration.js','v2_7_headgear_migration.js','v2_8_headgear_round16.js','v2_9_headgear_round17.js','v2_5_247_weapon_batch.js','v2_5_248_thanos_size_damage_fix.js','item_display_name_fix.js','v2_artifacts.js','achievements.js','v2_5_233_balance.js','v321_ep21_drops_and_images.js','v2_5_397_card_catalog_batch.js','v2_5_398_card_catalog_batch.js','v2_5_399_card_catalog_batch.js','v2_5_400_ep21_card_completion.js','v2_5_402_ep21_encroached_tan_card.js','v2_5_403_ep21_missing_cards.js','v2_5_395_card_set_codex.js','v2_5_396_card_set_codex.js','v2_5_404_ep20_card_effect_completion.js','v2_5_405_ep19_album_gap_completion.js','v2_5_406_ep19_card_completion.js','v2_5_407_ep19_card_effect_and_catalog.js','v2_5_408_ep21_winter_card_runtime_fix.js','v2_5_409_legacy_card_runtime_data.js','v2_5_410_legacy_card_completion.js','v2_5_412_remaining_2026_card_batch.js','v2_5_413_card_catalog_repair.js','v2_5_414_whikebain_rogue_combo_fix.js','v2_5_415_poplab_card_pages5_6.js','v2_5_418_poplab_card_pages7_15.js','v2_5_419_poplab_card_page16.js','v2_5_420_poplab_card_page17.js','v2_5_421_poplab_final_remaining_cards.js','engine.js'];
for(const f of files)vm.runInContext(fs.readFileSync(path.join(root,'js',f),'utf8'),ctx,{filename:f,timeout:60000});
const run=x=>vm.runInContext(x,ctx);

const engine=fs.readFileSync(path.join(root,'js','engine.js'),'utf8');


const defs=[
 ['fireworks_card',300640,'footgear'],['big_eye_card',300641,'garment'],
 ['contaminated_silk_frog_card',300642,'headgear'],['contaminated_silk_snail_card',300643,'garment'],
 ['corroded_exploration_robot_card',300644,'garment'],['corroded_repair_robot_card',300645,'armor'],
 ['corroded_dimik_card',300646,'armor'],['meow_zhi_card',300647,'headgear'],
 ['shadow_guardian_card',300648,'headgear'],['high_tier_shadow_card',300656,'headgear'],
 ['ear_spirit_card',300657,'headgear'],['undead_legion_general_card',300658,'headgear'],
 ['high_succubus_card',300663,'headgear'],['high_nightmare_card',300664,'headgear'],
 ['abyss_knight_commander_card',300665,'armor']
];
for(const [id,imgId,slot] of defs){
 assert(run(`!!CARDS['${id}']`),`CARDS ${id}`);
 assert(run(`!!ITEMS['${id}']`),`ITEMS ${id}`);
 assert.equal(run(`ITEMS['${id}'].imgId`),imgId,`official ID ${id}`);
 assert(run(`ITEMS['${id}'].codexInclude===true`),`codex item ${id}`);
 assert(run(`getCodexPool().cards.includes('${id}')`),`codex pool ${id}`);
 assert(run(`boxPool('card').ids.includes('${id}')`),`main card album ${id}`);
 const album='card_'+slot;
 assert(run(`boxPool('${album}').ids.includes('${id}')`),`slot card album ${id}`);
 const art=run(`window.CARD_ART_FALLBACKS['${id}']`);
 assert(art&&fs.existsSync(path.join(root,art)),`fallback image ${id}`);
 assert.equal(run(`CARDS['${id}'].unimplemented?.length||0`),0,`no unresolved effect ${id}`);
 assert.equal(run(`getCardAcquisitionSource('${id}').sources.length`),0,`no invented drop source ${id}`);
}
function equipCard(id,slot,refine){
 const equipSlot=slot==='headgear'?'head_top':slot==='accessory'?'accessory1':slot;
 run(`ITEMS.__test_host={id:'__test_host',type:${JSON.stringify(slot==='weapon'?'weapon':'armor')},armorType:${JSON.stringify(slot==='armor'?'armor':slot==='headgear'?'headgear':slot==='garment'?'garment':slot==='footgear'?'footgear':'accessory')},weaponType:'staff',weaponCat:'rod',weaponLv:4,slots:4,desc:'防具等級: 2'};state={equip:{${JSON.stringify(equipSlot)}:'__test_inst'},instances:{__test_inst:{item:'__test_host',refine:${refine},cards:[${JSON.stringify(id)}]}},stats:{str:99,agi:99,vit:99,int:99,dex:99,luk:99},baseLevel:200,jobLevel:70,jobId:'knight',learnedSkills:{},traitAlloc:{},hp:10000,sp:1000,maxHp:10000,maxSp:1000,buffs:[],monsters:[],inventory:[]};_gearBonusCache=null;_gearBonusKey='';`);
}
equipCard('fireworks_card','footgear',0);
assert.equal(run("getCardBonus('atkPct')"),8);
equipCard('fireworks_card','footgear',7);
assert.equal(run("getCardBonus('raceDmg_plant')"),12);
equipCard('big_eye_card','garment',0);
assert.equal(run("getCardBonus('variableCastPct')"),-5);
equipCard('big_eye_card','garment',3);
assert.equal(run("getCardBonus('magicEleDmg_fire')"),4);
assert.equal(run("getCardBonus('magicEleDmg_ghost')"),4);
equipCard('contaminated_silk_frog_card','headgear',0);
assert.equal(run("getCardBonus('pAtk')"),7);
assert.equal(run("getCardBonus('eleDmg_fire')"),12);
equipCard('contaminated_silk_snail_card','garment',3);
assert.equal(run("getCardBonus('magicEleDmg_water')"),4);
assert.equal(run("getCardBonus('magicEleDmg_none')"),4);
equipCard('corroded_exploration_robot_card','garment',0);
assert.equal(run("getCardBonus('eleReduce_none')"),20);
assert.equal(run("getCardBonus('meleeDmgPct')"),20);
equipCard('corroded_repair_robot_card','armor',4);
assert.equal(run("getCardBonus('magicAllDmgPct')"),6);
equipCard('corroded_dimik_card','armor',4);
assert.equal(run("getCardBonus('flee')"),30);
assert.equal(run("getCardBonus('critRate')"),7);
assert.equal(run("getCardBonus('meleeDmgPct')"),6);
assert.equal(run("getCardBonus('rangedDmgPct')"),6);
equipCard('meow_zhi_card','headgear',0);
assert.equal(run("getCardBonus('sMatk')"),5);
assert.equal(run("getCardBonus('magicEleDmg_shadow')"),7);
equipCard('shadow_guardian_card','headgear',0);
assert.equal(run("getCardBonus('pAtk')"),7);
assert.equal(run("getCardBonus('eleDmg_ghost')"),12);
equipCard('high_tier_shadow_card','headgear',0);
assert.equal(run("getCardBonus('eleDmg_holy')"),12);
equipCard('ear_spirit_card','headgear',0);
assert.equal(run("getCardBonus('magicEleDmg_water')"),7);
equipCard('undead_legion_general_card','headgear',0);
assert.equal(run("getCardBonus('magicEleDmg_holy')"),7);
equipCard('high_succubus_card','headgear',0);
assert.equal(run("getCardBonus('magicEleDmg_none')"),7);
equipCard('high_nightmare_card','headgear',0);
assert.equal(run("getCardBonus('eleDmg_none')"),12);
equipCard('abyss_knight_commander_card','armor',0);
assert.equal(run("getCardBonus('hpPct')"),-25);
equipCard('abyss_knight_commander_card','armor',12);
assert.equal(run("getCardBonus('bossDmgPct')"),7);
assert.equal(run("getCardBonus('magicBossDmgPct')"),4);
const audit=run('window.__V25421_POPLAB_REMAINING_AUDIT__');
assert.equal(audit.pagesReviewed.length,28);
assert.equal(audit.pagesReviewed[0],18);
assert.equal(audit.pagesReviewed.at(-1),45);
assert.equal(audit.added.length,15);
assert(audit.skipped.length>=20);
console.log(JSON.stringify({version:'v2.5.421',sourcePages:'18-45',pagesReviewed:28,added:defs.length,skipped: audit.skipped.length,result:'passed'}));
