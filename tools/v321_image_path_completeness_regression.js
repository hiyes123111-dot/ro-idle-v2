const fs=require('fs'),vm=require('vm'),assert=require('assert');
const c={console,Math,Set,Map,Float64Array,window:{getItemDisplayName:(x)=>x}};vm.createContext(c);
const files=['js/img_alias.js','js/skills.js','js/monster_skills.js','js/jobs.js','js/data.js','js/relics.js','js/v2_content.js','js/v2_4_content.js','js/v2_5_content.js','js/v2_6_skill_migration.js','js/v2_7_headgear_migration.js','js/v2_8_headgear_round16.js','js/v2_9_headgear_round17.js','js/v2_5_247_weapon_batch.js','js/v2_5_248_thanos_size_damage_fix.js','js/item_display_name_fix.js','js/v2_artifacts.js','js/achievements.js','js/v2_5_233_balance.js','js/v321_ep21_drops_and_images.js'];
for(const f of files)vm.runInContext(fs.readFileSync(f,'utf8'),c,{timeout:60000});
const audit=vm.runInContext(`({items:Object.keys(ITEMS).map(id=>[id,itemImgSrc(id)]),monsters:Object.keys(MONSTERS).map(id=>[id,monsterImgSrc(id)]),cards:Object.keys(CARDS).map(id=>[id,(CARD_ART_FALLBACKS[id]||(ITEMS[id]&&ITEMS[id].imgId>0?resolveImgPath('cards/'+ITEMS[id].imgId+'.jpg'):'images/_placeholder_card.svg'))])})`,c);
const missing=[];for(const [id,p] of [...audit.items,...audit.monsters,...audit.cards])if(!fs.existsSync(p))missing.push([id,p]);
assert.equal(missing.length,0,JSON.stringify(missing.slice(0,20)));
console.log(`v2.5.321 image path completeness: PASS (${audit.items.length} items, ${audit.monsters.length} monsters, ${audit.cards.length} cards)`);
