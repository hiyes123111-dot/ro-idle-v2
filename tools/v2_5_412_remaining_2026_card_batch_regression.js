const fs=require('fs'),vm=require('vm'),path=require('path'),assert=require('assert');
const root=path.resolve(__dirname,'..');
const ctx={console,window:{},CARD_ART_FALLBACKS:{},document:{addEventListener(){},removeEventListener(){},getElementById(){return null},querySelector(){return null},querySelectorAll(){return[]},createElement(){return{}},body:{appendChild(){},classList:{add(){},remove(){}}}},Image:function(){},localStorage:{getItem(){return null},setItem(){},removeItem(){}},setTimeout(){return 0},clearTimeout(){},setInterval(){return 0},clearInterval(){},requestAnimationFrame(){return 0},performance:{now(){return 0}},navigator:{},alert(){},confirm(){return true},prompt(){return null},Math,Date,Map,Set,Array,Object,Number,String,JSON,RegExp,Float64Array};
ctx.window=ctx;vm.createContext(ctx);
const files=['skills.js','monster_skills.js','jobs.js','data.js','img_alias.js','v2_5_392_card_catalog_repair.js','v2_5_394_card_catalog_audit.js','relics.js','v2_content.js','v2_4_content.js','v2_5_content.js','v2_6_skill_migration.js','v2_7_headgear_migration.js','v2_8_headgear_round16.js','v2_9_headgear_round17.js','v2_5_247_weapon_batch.js','v2_5_248_thanos_size_damage_fix.js','item_display_name_fix.js','v2_artifacts.js','achievements.js','v2_5_233_balance.js','v321_ep21_drops_and_images.js','v2_5_397_card_catalog_batch.js','v2_5_398_card_catalog_batch.js','v2_5_399_card_catalog_batch.js','v2_5_400_ep21_card_completion.js','v2_5_402_ep21_encroached_tan_card.js','v2_5_403_ep21_missing_cards.js','v2_5_395_card_set_codex.js','v2_5_396_card_set_codex.js','v2_5_404_ep20_card_effect_completion.js','v2_5_405_ep19_album_gap_completion.js','v2_5_406_ep19_card_completion.js','v2_5_407_ep19_card_effect_and_catalog.js','v2_5_408_ep21_winter_card_runtime_fix.js','v2_5_409_legacy_card_runtime_data.js','v2_5_410_legacy_card_completion.js','v2_5_412_remaining_2026_card_batch.js','engine.js'];
for(const f of files)vm.runInContext(fs.readFileSync(path.join(root,'js',f),'utf8'),ctx,{filename:f,timeout:60000});
const ids=['spiding_card','jackonette_card','liamette_card','nightmare_piamette_card','medjed_card','medjay_card','ophois_card','heka_card','sirena_card','tasi_card','honon_card','tiosa_card','meat_zong_jiao_card'];
const run=x=>vm.runInContext(x,ctx);
for(const id of ids){
 assert(run(`!!CARDS['${id}']&&!!ITEMS['${id}']&&ITEMS['${id}'].codexInclude===true`),`catalog ${id}`);
 const art=run(`CARD_ART_FALLBACKS['${id}']`);assert(art&&fs.existsSync(path.join(root,art)),`art ${id}`);
 assert(run(`getCodexPool().cards.includes('${id}')`),`codex ${id}`);
}
function equip(id,slot,refine,armorType='armor'){
 const host='__host_'+id;
 run(`ITEMS['${host}']={id:'${host}',type:'armor',armorType:'${armorType}',armorLevel:1,desc:'測試裝備'};state={equip:{${slot}:'${host}_inst'},instances:{'${host}_inst':{item:'${host}',refine:${refine},cards:['${id}']}},stats:{str:100,agi:100,vit:100,int:100,dex:100,luk:100},baseLevel:250,jobLevel:60,jobId:'element_master',learnedSkills:{},traitAlloc:{}}`);
}
const b=k=>run(`getCardBonus('${k}')`);
equip('spiding_card','footgear',9);assert.equal(b('matkPct'),5);assert.equal(b('magicRaceDmg_plant'),17);
equip('jackonette_card','head_top',10);assert.equal(b('sMatk'),5);assert.equal(b('magicEleDmg_ghost'),15);
equip('liamette_card','footgear',9);assert.equal(b('atkPct'),8);assert.equal(b('raceDmg_fish'),20);
equip('nightmare_piamette_card','head_top',10);assert.equal(b('skillAfterDelayPct'),25);assert.equal(b('spCostPct'),10);assert.equal(b('variableCastPct'),-15);
equip('medjed_card','footgear',9);assert.equal(b('atkPct'),8);assert.equal(b('raceDmg_angel'),20);
equip('medjay_card','head_top',10);assert.equal(b('pAtk'),7);assert.equal(b('eleDmg_earth'),20);
equip('ophois_card','head_top',10);assert.equal(b('sMatk'),5);assert.equal(b('magicEleDmg_wind'),15);
equip('heka_card','head_top',10);assert.equal(b('pAtk'),7);assert.equal(b('eleDmg_water'),20);
equip('sirena_card','footgear',9);assert.equal(b('matkPct'),5);assert.equal(b('magicRaceDmg_fish'),17);
equip('tasi_card','head_top',10);assert.equal(b('sMatk'),5);assert.equal(b('magicEleDmg_fire'),15);
equip('honon_card','head_top',10);assert.equal(b('pAtk'),7);assert.equal(b('eleDmg_shadow'),20);
equip('tiosa_card','head_top',11);assert.equal(b('matk'),10);assert.equal(b('sMatk'),1);assert.equal(b('magicEleDmg_wind'),7);assert.equal(b('spCostPct'),7);assert.equal(b('variableCastPct'),-5);
equip('meat_zong_jiao_card','footgear',8);assert.equal(b('allPropertyDmgPct'),2);equip('meat_zong_jiao_card','footgear',9);assert.equal(b('allPropertyDmgPct'),3);equip('meat_zong_jiao_card','footgear',12);assert.equal(b('allPropertyDmgPct'),6);
// Existing cards receive official numeric IDs and MVP cards must never enter the normal old-card album pool.
const existing={ep21_fioren_card:300555,ep21_garlic_monster_card:300557,glerero_card:300610,soul_guide_card:300565,peska_card:300613};
for(const [id,img] of Object.entries(existing))assert.equal(run(`ITEMS['${id}'].imgId`),img,`official item ID ${id}`);
for(const id of ['nightmare_piamette_card','soul_guide_card','peska_card']){
 assert.equal(run(`bossCardKind('${id}')`),'mvp',`${id} MVP classification`);
 assert(!run(`boxPool('card').ids.includes('${id}')`),`${id} excluded from normal old album`);
 assert(run(`boxPool('cardFlat').ids.includes('${id}')`),`${id} included in MVP card book`);
}
const batch=ctx.__V25412_REMAINING_CARD_BATCH__;
assert(batch&&batch.totalNew===13,'13 new cards registered');
console.log(JSON.stringify({version:'v2.5.412',newCards:ids.length,engineEffectChecks:26,existingOfficialIds:Object.keys(existing).length,mvpCardBookChecks:3,codexAndArt:ids.length,refine9StartCard:'passed'},null,2));
