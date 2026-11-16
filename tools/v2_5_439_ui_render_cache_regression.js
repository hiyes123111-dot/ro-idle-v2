const fs = require('fs');
const vm = require('vm');
const assert = require('assert');

const ui = fs.readFileSync('js/ui.js', 'utf8');
const nameFix = fs.readFileSync('js/item_display_name_fix.js', 'utf8');

// Exercise the actual description helper extracted from ui.js.
const start = ui.indexOf('function lootEscapeHtml');
const end = ui.indexOf('function renderLootNotices', start);
assert(start >= 0 && end > start, 'description helper block exists');
const descriptionBlock = ui.slice(start, end);
const uiContext = { Map };
vm.createContext(uiContext);
vm.runInContext(descriptionBlock + `
  globalThis.__desc = itemDescriptionHtml;
  globalThis.__cache = _itemDescriptionHtmlCache;
`, uiContext);

const source = '<p>測試 &amp; 說明<br>第二行</p><script>alert(1)</script>';
const first = uiContext.__desc(source);
const second = uiContext.__desc(source);
assert.strictEqual(first, second, 'cached output remains identical');
assert(first.includes('測試 &amp; 說明<br>第二行'));
assert(!first.includes('<script>'));
assert.strictEqual(uiContext.__cache.size, 1, 'same description stored once');
for (let i = 0; i < 1100; i++) uiContext.__desc('unique description ' + i);
assert(uiContext.__cache.size <= 1024, 'description cache remains bounded');

// Exercise actual name resolver and confirm the expensive legacy scan is memoized.
let keyScans = 0;
const dbTarget = { legacyKey: { id: 'legacy-item', name: '舊版道具' } };
const db = new Proxy(dbTarget, {
  ownKeys(target) { keyScans++; return Reflect.ownKeys(target); },
  get(target, prop) { return target[prop]; }
});
const nameContext = { window: {}, ITEMS: db, CARDS: {} };
vm.createContext(nameContext);
vm.runInContext(nameFix, nameContext);
assert.strictEqual(nameContext.window.getItemDisplayName('legacy-item'), '舊版道具');
assert.strictEqual(nameContext.window.getItemDisplayName('legacy-item'), '舊版道具');
assert.strictEqual(keyScans, 1, 'same fallback ID scans database only once');
assert.strictEqual(nameContext.window.getItemDisplayName('missing-id'), 'missing-id');
assert.strictEqual(nameContext.window.getItemDisplayName('missing-id'), 'missing-id');
assert.strictEqual(keyScans, 3, 'unknown IDs are not negatively cached, allowing later data registration');

// Direct ID and card-name resolution retain priority and behavior.
nameContext.ITEMS.direct = { name: '直接查找' };
assert.strictEqual(nameContext.window.getItemDisplayName('direct'), '直接查找');
nameContext.CARDS.card_x = { name: '卡片名稱' };
assert.strictEqual(nameContext.window.getItemDisplayName('card_x'), '卡片名稱');

console.log('PASS item description output and sanitization unchanged');
console.log('PASS item description LRU bounded at 1024 entries');
console.log('PASS legacy item-name fallback scan memoized');
console.log('PASS direct item/card name resolution unchanged');
console.log('4/4 passed');
