/* Focused regression for hidden box codex accuracy. Run: node tools/test_hidden_box_codex_v2.5.390.js */
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const root = path.resolve(__dirname, '..');
const jsDir = path.join(root, 'js');
const storage = Object.create(null);
const documentStub = {
  addEventListener() {}, removeEventListener() {},
  getElementById() { return null; }, querySelector() { return null; },
  querySelectorAll() { return []; }, createElement() { return {}; },
  body: { classList: { add() {}, remove() {} }, appendChild() {} },
};
const ctx = {
  console, Date, Math, JSON, Object, Array, Set, Map, Number, String, RegExp,
  setTimeout: () => 0, clearTimeout() {}, setInterval: () => 0, clearInterval() {},
  localStorage: { getItem(k) { return storage[k] ?? null; }, setItem(k,v) { storage[k] = String(v); }, removeItem(k) { delete storage[k]; } },
  window: { addEventListener() {}, location: {} }, document: documentStub, navigator: {},
  performance: { now: () => 0 }, alert() {}, confirm: () => true, prompt: () => null,
  URL, Blob, FileReader: function(){}, Image: function(){}, requestAnimationFrame: () => 0,
};
ctx.window.window = ctx.window; ctx.window.document = documentStub;
vm.createContext(ctx);
const scripts = [
  'about.js','hp_sp_tables.js','img_alias.js','aspd_data.js','skills.js','monster_skills.js','jobs.js',
  'data.js','relics.js','v2_content.js','v2_4_content.js','v2_5_content.js','v2_6_skill_migration.js',
  'v2_7_headgear_migration.js','v2_8_headgear_round16.js','v2_9_headgear_round17.js',
  'v2_5_247_weapon_batch.js','v2_5_248_thanos_size_damage_fix.js','item_display_name_fix.js',
  'v2_artifacts.js','achievements.js','v2_5_233_balance.js','v321_ep21_drops_and_images.js','engine.js','ui.js'
];
for (const f of scripts) {
  const p = path.join(jsDir, f);
  if (fs.existsSync(p)) vm.runInContext(fs.readFileSync(p,'utf8'), ctx, {filename:f, timeout:30000});
}
function check(ok, label) { console.log(`${ok ? 'PASS' : 'FAIL'} ${label}`); if (!ok) failures++; }
let failures = 0;
const result = vm.runInContext(`(() => {
  const violet = BOX_POOLS.violet.build().slice().sort();
  const codex = getBoxCodexPool().slice().sort();
  const albumKinds = ['card','cardFlat','card_headgear','card_armor','card_shield','card_garment','card_footgear','card_accessory','card_weapon'];
  const actualAlbum = new Set();
  albumKinds.forEach(k => BOX_POOLS[k].build().forEach(id => actualAlbum.add(id)));
  const farmable = new Set();
  Object.entries(MONSTER_CARD_DROPS || {}).forEach(([m,d]) => { if (MONSTERS[m] && ITEMS[d.card]) farmable.add(d.card); });
  Object.values(MONSTERS).forEach(m => (m.drops || []).forEach(d => { if (d && d.item && CARDS[d.item] && ITEMS[d.item]) farmable.add(d.item); }));
  const albumOnly = getAlbumOnlyCards();
  const albumValid = albumOnly.every(id => actualAlbum.has(id) && !farmable.has(id) && ITEMS[id] && CARDS[id]);
  const albumSourceValid = albumOnly.every(id => getCardAcquisitionSource(id).albums.length > 0);
  const boxValid = JSON.stringify(violet) === JSON.stringify(codex);
  // Dynamic cache invalidation: adding/removing a Chinese-named valid item must update the pool.
  ITEMS.__codex_test_box_item = {id:'__codex_test_box_item',name:'測試箱池道具',type:'material',desc:'測試'};
  const dynamicBoxAdded = getBoxCodexPool().includes('__codex_test_box_item');
  delete ITEMS.__codex_test_box_item;
  const dynamicBoxRemoved = !getBoxCodexPool().includes('__codex_test_box_item');
  // A card becomes album-only only when it is actually present in an album pool and has no monster drop.
  ITEMS.__codex_test_album_card = {id:'__codex_test_album_card',name:'測試卡片',type:'material',desc:'測試'};
  CARDS.__codex_test_album_card = {id:'__codex_test_album_card',name:'測試卡片',slot:'accessory'};
  const dynamicAlbumAdded = getAlbumOnlyCards().includes('__codex_test_album_card');
  delete ITEMS.__codex_test_album_card; delete CARDS.__codex_test_album_card;
  const dynamicAlbumRemoved = !getAlbumOnlyCards().includes('__codex_test_album_card');
  return {boxValid,albumValid,albumSourceValid,albumOnlyCount:albumOnly.length,boxCount:codex.length,dynamicBoxAdded,dynamicBoxRemoved,dynamicAlbumAdded,dynamicAlbumRemoved};
})()`, ctx);
check(result.boxValid, '隱藏圖鑑箱池與神秘紫箱實際抽選池完全一致');
check(result.albumValid, '卡冊限定卡全部存在於實際卡冊池且沒有正式怪物掉落');
check(result.albumSourceValid, '每張卡冊限定卡的圖鑑取得來源都能正確顯示卡冊');
check(result.dynamicBoxAdded && result.dynamicBoxRemoved, '新增／移除箱池道具會更新挑戰快取');
check(result.dynamicAlbumAdded && result.dynamicAlbumRemoved, '新增／移除卡冊限定卡會更新挑戰快取');
check(result.boxCount > 0 && result.albumOnlyCount > 0, '挑戰兩種收集池均有有效項目');
const ui = fs.readFileSync(path.join(jsDir,'ui.js'),'utf8');
check(ui.includes('神秘箱／紫箱道具') && ui.includes('卡冊限定卡'), '介面分開顯示箱池與卡冊限定卡進度');
check(ui.includes('目前全收集後沒有額外屬性或裝備獎勵'), '介面明確說明目前沒有額外通關獎勵');
console.log(`Pool counts: ${result.boxCount} box items; ${result.albumOnlyCount} album-only cards`);
console.log(`${8-failures}/8 passed`);
process.exitCode = failures ? 1 : 0;
