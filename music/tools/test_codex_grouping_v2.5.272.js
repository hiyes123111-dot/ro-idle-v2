/* Regression checks for v2.5.272 monster codex grouping. Run: node tools/test_codex_grouping_v2.5.272.js */
const fs = require('fs');
const vm = require('vm');
const path = require('path');
const root = path.resolve(__dirname, '..');
const ctx = vm.createContext({});
vm.runInContext(fs.readFileSync(path.join(root, 'js/data.js'), 'utf8'), ctx);
const MAPS = vm.runInContext('MAPS', ctx);
const MONSTERS = vm.runInContext('MONSTERS', ctx);
const REGIONS = vm.runInContext('REGIONS', ctx);
const KINGDOMS = vm.runInContext('KINGDOMS', ctx);
const ui = fs.readFileSync(path.join(root, 'js/ui.js'), 'utf8');
function assert(ok, msg) { if (!ok) throw new Error(msg); }
const expected = {
  ill_kraken: '深淵海王',
  ill_abysmal_witch: '深淵女巫',
  ep18_burning_fang: '燃燒之牙',
  r001_bestia: 'R001-Bestia'
};
const map = MAPS.find(m => m.id === 'high_exp_208');
assert(map && map.monsters.length === 4, 'high-exp map must retain exactly four monster entries');
for (const [id, name] of Object.entries(expected)) {
  assert(MONSTERS[id], `missing monster definition: ${id}`);
  assert(map.monsters.some(x => x.id === id), `monster not linked to high-exp map: ${id}`);
  assert(ui.includes(`${id}: '${name}'`), `codex localized name missing: ${id}`);
}
assert(REGIONS.some(r => r.id === 'r_new_world' && r.maps.includes('high_exp_208')), 'high-exp map must remain in New World region');
assert(KINGDOMS.some(k => k.regions.includes('r_new_world')), 'New World region must remain assigned to a kingdom');
assert(ui.includes('a.kingdomIndex - b.kingdomIndex') && ui.includes('a.mapIndex - b.mapIndex') && ui.includes('a.level - b.level'), 'codex sort order missing');
assert(ui.includes('codex-monster-group') && ui.includes('未配置地圖'), 'codex group headers / unclassified fallback missing');
assert(ui.includes('getMonsterMaps(id)'), 'monster detail must retain full map list');
console.log(`PASS: ${map.monsters.length} new-map monsters, localized labels, region/map/level ordering, fallback group`);
