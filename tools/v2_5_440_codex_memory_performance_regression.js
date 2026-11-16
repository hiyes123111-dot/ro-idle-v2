const fs = require('fs');
const path = require('path');
const vm = require('vm');
const assert = require('assert');
const root = path.resolve(__dirname, '..');
const ui = fs.readFileSync(path.join(root, 'js/ui.js'), 'utf8');
const engine = fs.readFileSync(path.join(root, 'js/engine.js'), 'utf8');

// Run the real search-cache helper against 20,000 distinct IDs.
const match = ui.match(/const CODEX_SEARCH_TEXT_CACHE_LIMIT = 4096;\s*const CODEX_SEARCH_TEXT_CACHE = new Map\(\);\s*function getCodexSearchText\(row\) \{[\s\S]*?\n\}/);
assert(match, 'bounded codex search cache helper exists');
const ctx = {
  Map, ITEMS: {}, CARDS: {}, MONSTERS: {}
};
for (let i = 0; i < 20000; i++) ctx.ITEMS['item_' + i] = { name: '道具' + i, searchTerms: '測試' + i };
vm.createContext(ctx);
vm.runInContext(match[0], ctx);
for (let i = 0; i < 20000; i++) {
  vm.runInContext(`getCodexSearchText({id:'item_${i}',name:'道具${i}'})`, ctx);
}
assert.strictEqual(vm.runInContext('CODEX_SEARCH_TEXT_CACHE.size', ctx), 4096, 'search cache cannot exceed 4096 entries');
const last = vm.runInContext("getCodexSearchText({id:'item_19999',name:'道具19999'})", ctx);
assert(last.includes('道具19999'), 'recent search result remains correct');
vm.runInContext("getCodexSearchText({id:'item_19998',name:'道具19998'})", ctx);
assert.strictEqual(vm.runInContext('CODEX_SEARCH_TEXT_CACHE.size', ctx), 4096, 'LRU hit does not grow cache');

// Verify ID filtering occurs before allocating row objects for the full result set.
const renderStart = ui.indexOf('function renderCodexTab()');
const renderEnd = ui.indexOf('\nfunction ', renderStart + 30);
const render = ui.slice(renderStart, renderEnd > 0 ? renderEnd : undefined);
const filterAt = render.indexOf('ids = ids.filter(id => getCodexSearchText');
const rowBuildAt = render.indexOf('let rows;');
assert(filterAt > 0 && rowBuildAt > filterAt, 'search filters IDs before row allocation');
assert(render.includes('收藏狀態、搜尋與職業限制先作用在 ID 陣列'), 'render pipeline documents ID-first filtering');

// Verify large pool signature work is rate-limited and can be invalidated by a dynamic loader.
assert(engine.includes('const CODEX_POOL_SIGNATURE_CHECK_MS = 10000;'), 'full pool signature has a 10s interval');
assert(engine.includes('function invalidateCodexPoolCache()'), 'explicit invalidation helper exists');
assert(engine.includes('now - _codexPoolSignatureCheckedAt < CODEX_POOL_SIGNATURE_CHECK_MS'), 'repeated renders skip full signature scan');
assert(engine.includes('資料載入器若在遊戲運行中追加資料，可呼叫 invalidateCodexPoolCache()'), 'runtime data loader contract documented');

// Existing bounded long-session structures remain in place.
assert(ui.includes('const MAX_LIVE_CRIT_BURSTS = 18'), 'critical visual effects remain capped');
assert(ui.includes('const MAX_LIVE_FLOATS = 48'), 'damage number DOM remains capped');
assert(engine.includes('COMBAT_LOG_TRIM_BATCH = 100'), 'combat log trim batching remains enabled');
assert(engine.includes('最多每分類 1000 筆'), 'combat log history remains bounded per category');


// Exercise the actual pool cache: throttled reuse, periodic full-signature refresh,
// and immediate invalidation for any future runtime data loader.
function extractFunction(source, signature) {
  const start = source.indexOf(signature);
  assert(start >= 0, 'function found: ' + signature);
  const open = source.indexOf('{', start);
  let depth = 0, quote = null, escaped = false, lineComment = false, blockComment = false;
  for (let i = open; i < source.length; i++) {
    const c = source[i], n = source[i + 1];
    if (lineComment) { if (c === '\n') lineComment = false; continue; }
    if (blockComment) { if (c === '*' && n === '/') { blockComment = false; i++; } continue; }
    if (quote) {
      if (escaped) escaped = false;
      else if (c === '\\') escaped = true;
      else if (c === quote) quote = null;
      continue;
    }
    if (c === '/' && n === '/') { lineComment = true; i++; continue; }
    if (c === '/' && n === '*') { blockComment = true; i++; continue; }
    if (c === '"' || c === "'" || c === '`') { quote = c; continue; }
    if (c === '{') depth++;
    else if (c === '}' && --depth === 0) return source.slice(start, i + 1);
  }
  throw new Error('unclosed function: ' + signature);
}
const getPoolFn = extractFunction(engine, 'function getCodexPool()');
const invalidateFn = extractFunction(engine, 'function invalidateCodexPoolCache()');
let fakeNow = 1000;
const poolContext = {
  Date: { now: () => fakeNow },
  MAPS: [], MONSTERS: {}, ITEMS: { first: { type: 'weapon', name: '第一件' } },
  CARDS: {}, getMonsterMaps: () => [], boxEligible: () => false,
  NPC_SHOPS: {}, MATERIAL_CRAFT_RECIPES: {}
};
vm.createContext(poolContext);
vm.runInContext(
  'let _codexPoolCache=null; let _codexPoolSignature=""; let _codexPoolSignatureCheckedAt=0; const CODEX_POOL_SIGNATURE_CHECK_MS=10000;' + invalidateFn + getPoolFn,
  poolContext
);
const firstPool = vm.runInContext('getCodexPool()', poolContext);
poolContext.ITEMS.second = { type: 'weapon', name: '第二件' };
const throttledPool = vm.runInContext('getCodexPool()', poolContext);
assert.strictEqual(throttledPool, firstPool, 'same cache reused inside signature interval');
assert(!throttledPool.items.includes('second'), 'no full rebuild inside interval');
fakeNow += 10001;
const refreshedPool = vm.runInContext('getCodexPool()', poolContext);
assert(refreshedPool.items.includes('second'), 'full signature detects data changes after interval');
poolContext.ITEMS.third = { type: 'weapon', name: '第三件' };
vm.runInContext('invalidateCodexPoolCache()', poolContext);
const invalidatedPool = vm.runInContext('getCodexPool()', poolContext);
assert(invalidatedPool.items.includes('third'), 'explicit invalidation rebuilds immediately');

console.log('PASS 20,000 unique searches keep LRU cache at 4,096');
console.log('PASS codex filters IDs before constructing display rows');
console.log('PASS large codex pool signature is rate-limited and explicitly invalidatable');
console.log('PASS combat visuals and history retain long-session caps');
console.log('5/5 passed');
