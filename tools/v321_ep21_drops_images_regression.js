const fs=require('fs'),vm=require('vm'),assert=require('assert');
const c={console,Math,Set,Map,Float64Array};vm.createContext(c);
for(const f of ['js/img_alias.js','js/data.js','js/v321_ep21_drops_and_images.js']) vm.runInContext(fs.readFileSync(f,'utf8'),c,{timeout:60000});
vm.runInContext('globalThis.__test={ITEMS,MONSTERS,MAPS,IMG_ALIAS,CARD_ART_FALLBACKS,EP21_MONSTER_ART,ITEM_IMAGE_FALLBACKS,MONSTER_IMAGE_FALLBACKS}',c);
assert.equal(c.__test.MONSTERS.ep21_awakened_yortus_bishop.drops[0].item,'yorscalp_spirit');
assert.equal(c.__test.MONSTERS.ep21_awakened_yoscopus_shaman.drops[0].item,'yorscalp_spirit');
for(const id of ['ep21_wigner_ticket','yorscalp_serpent','yorscalp_symbol','yorscalp_spirit']) assert(c.__test.MONSTERS.ep21_corrupted_tan.drops.some(d=>d.item===id),id+' boss source');
assert(c.__test.MAPS.some(m=>m.id==='jor_sklf2' && m.monsters.some(x=>x.id==='ep21_awakened_yortus_bishop')),'Jorscalf map');
for(const id of ['ep21_wigner_ticket','yorscalp_serpent','yorscalp_symbol','yorscalp_spirit']) assert(c.__test.ITEMS[id].desc.includes('取得來源'),'material source note '+id);
for(const id of ['400723','400724','450412','450413','480495','480496']) assert(c.__test.IMG_ALIAS['equip/armor'][id+'.png'],'armor alias '+id);
assert(fs.existsSync('images/_placeholder_card.svg'));
assert(fs.existsSync('images/cards/generated/ep21_tris_card.svg'));
for(const id of Object.keys(c.__test.CARD_ART_FALLBACKS)) assert(fs.existsSync(c.__test.CARD_ART_FALLBACKS[id]),'card art '+id);
for(const img of ['470303','470304','490620','490621','490622','490623','450350','450351','480415','480416','470260','470261','490509','490508','490507','490510']) { const p=c.__test.IMG_ALIAS['equip/armor'][img+'.png']; assert(p && fs.existsSync('images/'+p),'equipment art '+img); }
assert(fs.existsSync('images/monsters/generated/ep21_corrupted_tan.svg'));
for(const [id,p] of Object.entries(c.__test.ITEM_IMAGE_FALLBACKS)) assert(fs.existsSync(p),'item fallback '+id);
for(const [id,p] of Object.entries(c.__test.MONSTER_IMAGE_FALLBACKS)) assert(fs.existsSync(p),'monster fallback '+id);
console.log('v2.5.321 EP21 drops/images: PASS');
