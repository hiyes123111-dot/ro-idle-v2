'use strict';
const fs = require('fs');
const vm = require('vm');
const assert = require('assert');
const source = fs.readFileSync(require('path').join(__dirname, '../js/ui.js'), 'utf8');
const start = source.indexOf('function renderWarehouseInner() {');
const end = source.indexOf('/* ---------------- 自動販賣 UI', start);
assert(start >= 0 && end > start, 'warehouse renderer exists');
const renderer = source.slice(start, end);
assert(!renderer.includes('whAll'), 'renderer must not reference the undefined whAll variable');
assert(renderer.includes('whIndex.known.length'), 'warehouse count uses the validated warehouse index');

const body = { innerHTML: '' };
const item = { id: 'red_potion', name: '紅色藥水', type: 'consumable', icon: '🧪' };
const rows = [{ item: 'red_potion', qty: 3 }];
const context = {
  document: { getElementById(id) { return id === 'warehouse-body' ? body : null; } },
  state: { inventory: [], gold: 0 },
  ITEMS: { red_potion: item },
  INV_CATEGORIES: [{ key: 'consumable', name: '消耗品', icon: '🧪' }],
  whCategory: 'consumable', whSub: 'all', whSearch: '', whQty: '',
  whBagRenderLimit: 100, whStoreRenderLimit: 100,
  whIndexRows: rows,
  loadWarehouse() { return { items: rows, gold: 0 }; },
  getInventoryViewIndex(input) { return { known: input.filter(r => r && this.ITEMS[r.item]), categoryCounts: { consumable: input.length }, subCounts: { consumable: {} }, hasHeadgear: false }; },
  getInventoryCachedRows(input) { return input.filter(r => r && this.ITEMS[r.item]); },
  sortRowsWithRecent(input) { return input; },
  invCategoryOf() { return 'consumable'; }, invSubOf() { return 'all'; }, invSubLabel() { return '全部'; },
  itemImgSrc() { return 'item.png'; }, placeholderImgSrc() { return 'placeholder.png'; }, itemPlaceholderKind() { return 'item'; },
  isItemLocked() { return false; }, window: { getItemDisplayName(id) { return id === 'red_potion' ? '紅色藥水' : id; } },
  whBagRenderLimit: 100, whStoreRenderLimit: 100
};
context.getInventoryViewIndex = function(input) {
  return { known: input.filter(r => r && context.ITEMS[r.item]), categoryCounts: { consumable: input.length }, subCounts: { consumable: {} }, hasHeadgear: false };
};
context.getInventoryCachedRows = function(input) { return input.filter(r => r && context.ITEMS[r.item]); };
vm.createContext(context);
vm.runInContext(renderer, context);
context.renderWarehouseInner();
assert(body.innerHTML.includes('倉庫（點擊取出 ◀）　1 種'), 'warehouse renders item count without throwing');
assert(body.innerHTML.includes('紅色藥水'), 'warehouse item row is rendered');
console.log('PASS warehouse renderer displays stored items and count');
