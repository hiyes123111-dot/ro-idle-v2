/* Regression checks for high-exp map and automatic codex inclusion in v2.5.271.
   Run: node tools/test_high_exp_codex_v2.5.271.js */
const fs = require('fs');
const vm = require('vm');
const path = require('path');
const root = path.resolve(__dirname, '..');
const ctx = vm.createContext({});
vm.runInContext(fs.readFileSync(path.join(root, 'js/data.js'), 'utf8'), ctx);
const MAPS = vm.runInContext('MAPS', ctx);
const MONSTERS = vm.runInContext('MONSTERS', ctx);
const ITEMS = vm.runInContext('ITEMS', ctx);
const CARDS = vm.runInContext('CARDS', ctx);
const REGIONS = vm.runInContext('REGIONS', ctx);
const engine = fs.readFileSync(path.join(root, 'js/engine.js'), 'utf8');
function assert(ok, msg) { if (!ok) throw new Error(msg); }
const map = MAPS.find(m => m.id === 'high_exp_208');
assert(map, 'high-exp map missing');
assert(map.expMultiplier === 2.5 && map.jobExpMultiplier === 2.5, 'map exp multipliers missing');
assert(map.monsters.length === 4, 'expected four monsters in high-exp map');
for (const entry of map.monsters) assert(MONSTERS[entry.id], `map monster missing: ${entry.id}`);
assert(REGIONS.some(r => r.id === 'r_new_world' && r.maps.includes('high_exp_208')), 'map not linked to world region');
assert(engine.includes("def.exp * expMult * farmMult('exp') * mapExpMultiplier"), 'live exp multiplier missing');
assert(engine.includes('(Number(mapObj.expMultiplier) || 1)'), 'map yield forecast multiplier missing');
assert(engine.includes('Number(map.expMultiplier) || 1'), 'offline progress multiplier missing');
assert(engine.includes('mapJobExpMultiplier'), 'offline job exp multiplier missing');
assert(engine.includes('new Set(Object.keys(MONSTERS))'), 'codex does not include every monster definition');
assert(engine.includes('new Set(Object.keys(CARDS))'), 'codex does not include every card definition');
assert(engine.includes('Object.keys(ITEMS).forEach(id => {'), 'codex does not auto-include items');
assert(Object.keys(CARDS).every(id => ITEMS[id]), 'card without item record would break codex display');
console.log(`PASS: map, ${map.monsters.length} monsters, ${Object.keys(MONSTERS).length} monster defs, ${Object.keys(CARDS).length} cards, ${Object.keys(ITEMS).length} items`);
