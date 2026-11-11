/* V2.5.124 Rift runtime integration regression. Run: node tools/v25124_rift_runtime_regression.js */
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const root = path.resolve(__dirname, '..');
const storage = Object.create(null);
const documentStub = {
  addEventListener() {}, removeEventListener() {}, getElementById() { return null; },
  querySelector() { return null; }, querySelectorAll() { return []; }, createElement() { return {}; },
  body: { classList: { add() {}, remove() {} }, appendChild() {} },
};
const context = {
  console, Date, Math, JSON, Object, Array, Set, Map, Number, String, RegExp,
  setTimeout: () => 0, clearTimeout() {}, setInterval: () => 0, clearInterval() {},
  localStorage: { getItem(k) { return storage[k] ?? null; }, setItem(k,v) { storage[k] = String(v); }, removeItem(k) { delete storage[k]; } },
  window: { addEventListener() {}, location: {} }, document: documentStub, navigator: {},
  performance: { now: () => 0 }, alert() {}, confirm: () => true, prompt: () => null,
  URL, Blob, FileReader: function () {}, Image: function () {}, requestAnimationFrame: () => 0,
};
context.window.window = context.window;
context.window.document = documentStub;
vm.createContext(context);
const scripts = [
  'skills.js','monster_skills.js','jobs.js','data.js','relics.js','v2_content.js',
  'v2_4_content.js','v2_5_content.js','v2_6_skill_migration.js','v2_7_headgear_migration.js',
  'v2_8_headgear_round16.js','v2_9_headgear_round17.js','item_display_name_fix.js',
  'v2_artifacts.js','achievements.js','engine.js'
];
for (const file of scripts) {
  try { vm.runInContext(fs.readFileSync(path.join(root, 'js', file), 'utf8'), context, { filename: file, timeout: 30000 }); }
  catch (error) { console.error(`FAIL script execution: ${file}\n${error.stack}`); process.exit(1); }
}
const result = vm.runInContext(`(() => {
  const ids = ['v2_rift_sentinel','v2_abyss_stalker','v2_ember_drake','v2_wind_hawk','v2_biolo_beast','v2_void_sage','v2_rift_guardian','v2_void_emperor'];
  const pool = getCodexPool();
  return {
    maps: MAPS.filter(m => m.id.startsWith('v2_abyss_rift_')).map(m => m.id),
    allMonstersRegistered: ids.every(id => !!MONSTERS[id]),
    allMonstersInCodex: ids.every(id => pool.monsters.includes(id)),
    regionRegistered: REGIONS.some(r => r.id === 'r_v2_abyss'),
    kingdomRegistered: KINGDOMS.some(k => k.id === 'k_v2_abyss'),
    cardsInCodex: ['v2_rift_sentinel_card','v2_abyss_stalker_card','v2_rift_guardian_card'].every(id => pool.cards.includes(id)),
    riftRelicsRegistered: Object.keys(RELIC_ITEMS).filter(id => id.startsWith('relic_v2_rift_')).length === 8,
    coreMaterialInCodex: pool.items.includes('v2_rift_core')
  };
})()`, context);
const checks = [
  ['兩張裂隙地圖已在執行階段註冊', result.maps.length === 2],
  ['八種裂隙怪物均已註冊', result.allMonstersRegistered],
  ['八種裂隙怪物均進入圖鑑怪物池', result.allMonstersInCodex],
  ['裂隙地區已註冊', result.regionRegistered],
  ['裂隙王國已註冊', result.kingdomRegistered],
  ['裂隙卡片進入圖鑑卡片池', result.cardsInCodex],
  ['八件裂隙遺物均已註冊', result.riftRelicsRegistered],
  ['裂隙核心材料進入圖鑑道具池', result.coreMaterialInCodex],
  ['HTML 腳本快取版本已更新', /\?v=2\.5\.124/.test(fs.readFileSync(path.join(root, 'index.html'), 'utf8')) && !/\?v=2\.5\.96/.test(fs.readFileSync(path.join(root, 'index.html'), 'utf8'))],
];
let failed = 0;
for (const [name, pass] of checks) { console.log(`${pass ? 'PASS' : 'FAIL'} ${name}`); if (!pass) failed++; }
console.log(`${checks.length - failed}/${checks.length} passed`);
if (failed) { console.error(JSON.stringify(result, null, 2)); process.exitCode = 1; }
