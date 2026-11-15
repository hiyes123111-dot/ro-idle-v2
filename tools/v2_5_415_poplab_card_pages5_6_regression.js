const fs=require('fs'),vm=require('vm'),path=require('path'),assert=require('assert');
const root=path.resolve(__dirname,'..');
const ctx={console,window:{},CARD_ART_FALLBACKS:{},document:{addEventListener(){},removeEventListener(){},getElementById(){return null},querySelector(){return null},querySelectorAll(){return[]},createElement(){return{}},body:{appendChild(){},classList:{add(){},remove(){}}}},Image:function(){},localStorage:{getItem(){return null},setItem(){},removeItem(){}},setTimeout(){return 0},clearTimeout(){},setInterval(){return 0},clearInterval(){},requestAnimationFrame(){return 0},performance:{now(){return 0}},Math,Date,Map,Set,Array,Object,Number,String,JSON,RegExp,Float64Array};ctx.window=ctx;vm.createContext(ctx);
const files=['skills.js','monster_skills.js','jobs.js','data.js','img_alias.js','v2_5_392_card_catalog_repair.js','v2_5_394_card_catalog_audit.js','relics.js','v2_content.js','v2_4_content.js','v2_5_content.js','v2_6_skill_migration.js','v2_7_headgear_migration.js','v2_8_headgear_round16.js','v2_9_headgear_round17.js','v2_5_247_weapon_batch.js','v2_5_248_thanos_size_damage_fix.js','item_display_name_fix.js','v2_artifacts.js','achievements.js','v2_5_233_balance.js','v321_ep21_drops_and_images.js','v2_5_397_card_catalog_batch.js','v2_5_398_card_catalog_batch.js','v2_5_399_card_catalog_batch.js','v2_5_400_ep21_card_completion.js','v2_5_402_ep21_encroached_tan_card.js','v2_5_403_ep21_missing_cards.js','v2_5_395_card_set_codex.js','v2_5_396_card_set_codex.js','v2_5_404_ep20_card_effect_completion.js','v2_5_405_ep19_album_gap_completion.js','v2_5_406_ep19_card_completion.js','v2_5_407_ep19_card_effect_and_catalog.js','v2_5_408_ep21_winter_card_runtime_fix.js','v2_5_409_legacy_card_runtime_data.js','v2_5_410_legacy_card_completion.js','v2_5_412_remaining_2026_card_batch.js','v2_5_413_card_catalog_repair.js','v2_5_414_whikebain_rogue_combo_fix.js','v2_5_415_poplab_card_pages5_6.js','engine.js'];
for(const f of files)vm.runInContext(fs.readFileSync(path.join(root,'js',f),'utf8'),ctx,{filename:f,timeout:60000});
const run=x=>vm.runInContext(x,ctx);
const ids=['scorpion_king_card','beelzebub_card','burning_savage_bear_card','deviling_card'];
assert.equal(run("Object.keys(CARDS).filter(id=>!ITEMS[id]).length"),0,'every card definition has an item');
assert.equal(run("Object.keys(ITEMS).filter(id=>/_card$/.test(id)&&!CARDS[id]).length"),0,'no orphan card item');
const slotAlbums={scorpion_king_card:'card_weapon',beelzebub_card:'card_accessory',burning_savage_bear_card:'card_armor',deviling_card:'card_garment'};
for(const id of ids){
 assert(run(`CARDS['${id}']`),`card ${id}`);
 assert(run(`ITEMS['${id}']`),`item ${id}`);
 assert(run(`ITEMS['${id}'].codexInclude === true`),`codex item ${id}`);
 assert(run(`getCodexPool().cards.includes('${id}')`),`codex pool ${id}`);
 assert(run(`boxPool('card').ids.includes('${id}')`) || run(`boxPool('cardFlat').ids.includes('${id}')`),`card album ${id}`);
 assert(run(`boxPool('${slotAlbums[id]}').ids.includes('${id}')`),`slot album ${id}`);
 const art=run(`window.CARD_ART_FALLBACKS['${id}']`);assert(art&&fs.existsSync(path.join(root,art)),`art fallback ${id}`);
}
assert.equal(run("CARDS['scorpion_king_card'].slot"),'weapon');
assert.equal(run("CARDS['scorpion_king_card'].bonus.raceDmg_undead"),20);
assert.equal(run("CARDS['beelzebub_card'].slot"),'accessory');
assert.equal(run("CARDS['beelzebub_card'].bonus.variableCastPct"),-30);
assert.equal(run("CARDS['deviling_card'].slot"),'garment');
assert.equal(run("CARDS['deviling_card'].bonus.eleReduce_none"),50);
assert.equal(run("CARDS['deviling_card'].bonus.eleReduce_water"),-50);
assert.equal(run("CARDS['burning_savage_bear_card'].unimplemented.length"),1);
assert.equal(run("CARDS['scorpion_king_card'].monsterId"),null,'no invented monster drop');
assert.equal(run("CARDS['beelzebub_card'].monsterId"),null,'no invented monster drop');
assert.equal(run("getCardAcquisitionSource('scorpion_king_card').sources.length"),0,'no fabricated drop');
assert.equal(run("getCardAcquisitionSource('beelzebub_card').sources.length"),0,'no fabricated drop');
assert.equal(run("getCardAcquisitionSource('burning_savage_bear_card').sources.length"),0,'no fabricated drop');
assert.equal(run("getCardAcquisitionSource('deviling_card').sources.length"),0,'no fabricated drop');
function equip(slot,item,card){
 run(`ITEMS['${item}']={id:'${item}',type:'weapon',weaponType:'sword',armorType:'accessory',slots:1,desc:'test'};`);
 run(`state={equip:{'${slot}':'test_inst'},instances:{test_inst:{item:'${item}',refine:0,cards:['${card}']}},stats:{str:1,agi:1,vit:1,int:1,dex:1,luk:1},baseLevel:100,jobLevel:50,jobId:'knight',learnedSkills:{},traitAlloc:{}};_gearBonusCache=null;_gearBonusKey='';`);
}
equip('weapon','__test_weapon','scorpion_king_card');
assert.equal(run("getCardBonus('raceDmg_undead')"),20,'Scorpion King applies real undead damage bonus');
equip('accessory1','__test_accessory','beelzebub_card');
assert.equal(run("getCardBonus('variableCastPct')"),-30,'Beelzebub applies variable cast reduction');
equip('garment','__test_garment','deviling_card');
assert.equal(run("getCardBonus('eleReduce_none')"),50,'Deviling neutral resistance');
assert.equal(run("getCardBonus('eleReduce_water')"),-50,'Deviling water resistance penalty');
const pending=['暗黑祭司','妖道','拉鏈熊','將軍魔碑','RSX-0806','消防魔','三頭龍','迪塔勒泰晤勒斯','蘭特克力斯','石頭波利'];
const added=run("window.__V25415_POPLAB_CARD_PAGE5__.added");
assert.equal(added.length,4);
console.log(JSON.stringify({version:'v2.5.415',added:ids.length,cards:run('Object.keys(CARDS).length'),items:run('Object.keys(ITEMS).length'),codex:ids.length,album:ids.length,artFallbacks:ids.length,battleEffectsVerified:3,unimplementedEffectMarked:1,pendingExcluded:pending.length,result:'passed'},null,2));
