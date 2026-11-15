const fs=require('fs'),vm=require('vm'),path=require('path'),assert=require('assert');
const root=path.resolve(__dirname,'..');
const ctx={console,window:{},CARD_ART_FALLBACKS:{},document:{addEventListener(){},removeEventListener(){},getElementById(){return null},querySelector(){return null},querySelectorAll(){return[]},createElement(){return{}},body:{appendChild(){},classList:{add(){},remove(){}}}},Image:function(){},localStorage:{getItem(){return null},setItem(){},removeItem(){}},setTimeout(){return 0},clearTimeout(){},setInterval(){return 0},clearInterval(){},requestAnimationFrame(){return 0},performance:{now(){return 0}},Math,Date,Map,Set,Array,Object,Number,String,JSON,RegExp,Float64Array};ctx.window=ctx;vm.createContext(ctx);
const files=['skills.js','monster_skills.js','jobs.js','data.js','img_alias.js','v2_5_392_card_catalog_repair.js','v2_5_394_card_catalog_audit.js','relics.js','v2_content.js','v2_4_content.js','v2_5_content.js','v2_6_skill_migration.js','v2_7_headgear_migration.js','v2_8_headgear_round16.js','v2_9_headgear_round17.js','v2_5_247_weapon_batch.js','v2_5_248_thanos_size_damage_fix.js','item_display_name_fix.js','v2_artifacts.js','achievements.js','v2_5_233_balance.js','v321_ep21_drops_and_images.js','v2_5_397_card_catalog_batch.js','v2_5_398_card_catalog_batch.js','v2_5_399_card_catalog_batch.js','v2_5_400_ep21_card_completion.js','v2_5_402_ep21_encroached_tan_card.js','v2_5_403_ep21_missing_cards.js','v2_5_395_card_set_codex.js','v2_5_396_card_set_codex.js','v2_5_404_ep20_card_effect_completion.js','v2_5_405_ep19_album_gap_completion.js','v2_5_406_ep19_card_completion.js','v2_5_407_ep19_card_effect_and_catalog.js','v2_5_408_ep21_winter_card_runtime_fix.js','v2_5_409_legacy_card_runtime_data.js','v2_5_410_legacy_card_completion.js','v2_5_412_remaining_2026_card_batch.js','v2_5_413_card_catalog_repair.js','v2_5_414_whikebain_rogue_combo_fix.js','engine.js'];
for(const f of files)vm.runInContext(fs.readFileSync(path.join(root,'js',f),'utf8'),ctx,{filename:f,timeout:60000});
const run=x=>vm.runInContext(x,ctx);
const newIds=['spiding_card','jackonette_card','liamette_card','nightmare_piamette_card','medjed_card','medjay_card','ophois_card','heka_card','sirena_card','tasi_card','honon_card','tiosa_card','meat_zong_jiao_card','ant_soldier_card'];
const cards=run('Object.keys(CARDS).length'),items=run('Object.keys(ITEMS).length');
assert.equal(run("Object.keys(CARDS).filter(id=>!ITEMS[id]).length"),0,'every card definition has an item');
assert.equal(run("Object.keys(ITEMS).filter(id=>/_card$/.test(id)&&!CARDS[id]).length"),0,'no orphan *_card item');
assert.equal(run("CARDS.whikebain_card.unimplemented.length"),0,'Whikebain card effects fully implemented');
for(const id of newIds){
 assert(run(`getCodexPool().cards.includes('${id}')`),`codex ${id}`);
 assert(run(`boxPool('card').ids.includes('${id}')`) || run(`boxPool('cardFlat').ids.includes('${id}')`),`album pool ${id}`);
 const art=run(`window.CARD_ART_FALLBACKS['${id}']`);assert(art&&fs.existsSync(path.join(root,art)),`fallback ${id}`);
}
for(const id of ['nightmare_piamette_card','soul_guide_card','peska_card']){
 assert.equal(run(`bossCardKind('${id}')`),'mvp');
 assert(run(`boxPool('cardFlat').ids.includes('${id}')`));
 assert(!run(`boxPool('card').ids.includes('${id}')`));
}
assert.equal(run("CARDS['spiding_card'].slot"),'footgear');
assert.equal(run("CARDS['jackonette_card'].slot"),'headgear');
assert.equal(run("CARDS['liamette_card'].slot"),'footgear');
assert.equal(run("CARDS['tiosa_card'].slot"),'headgear');
console.log(JSON.stringify({version:'v2.5.414',cards,items,missingCardItems:0,orphanCardItems:0,newCards:newIds.length,codex:newIds.length,album:newIds.length,mvpClassification:3,artFallbacks:newIds.length,result:'passed'},null,2));
