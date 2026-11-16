#!/usr/bin/env node
'use strict';
const fs = require('fs');
const vm = require('vm');
const engine = fs.readFileSync('js/engine.js','utf8');
const ui = fs.readFileSync('js/ui.js','utf8');

// Execute the actual auto-sell implementation against a large synthetic inventory.
const start = engine.indexOf('function autoSellSelectedItems() {');
const end = engine.indexOf('\nfunction tryAutoSell()', start);
if (start < 0 || end < 0) throw new Error('autoSellSelectedItems block not found');
const code = engine.slice(start, end);
const sandbox = {
  state: { autoSellConfig:{items:[]}, inventory:[], gold:100, shopOverchargeMult:1 },
  ITEMS: {},
  isItemLocked: id => id === 'locked_item',
  safeSellUnitPrice: def => def.sell,
  ensureSafeGold: () => {},
  invalidateInventoryViewCache: () => { sandbox.invalidations++; },
  logMsg: msg => { sandbox.lastLog = msg; },
  invalidations: 0,
};
for (let i=0;i<12000;i++) {
  const id = `item_${i}`;
  sandbox.ITEMS[id] = {sell: i+1, type:'material'};
  sandbox.state.inventory.push({item:id,qty:2});
  if (i < 3000) sandbox.state.autoSellConfig.items.push(id);
}
sandbox.ITEMS.locked_item = {sell:999,type:'material'};
sandbox.state.inventory.push({item:'locked_item',qty:5});
sandbox.state.autoSellConfig.items.push('locked_item');
sandbox.state.inventory.push({item:'equipment_instance',qty:1,instanceId:'inst_1'});
sandbox.ITEMS.equipment_instance = {sell:500,type:'armor'};
vm.createContext(sandbox);
vm.runInContext(code, sandbox);
const expected = Array.from({length:3000},(_,i)=>(i+1)*2).reduce((a,b)=>a+b,0);
if (!sandbox.autoSellSelectedItems()) throw new Error('bulk autosell did not sell selected stacks');
if (sandbox.state.gold !== 100 + expected) throw new Error(`gold mismatch ${sandbox.state.gold} != ${100+expected}`);
if (sandbox.state.inventory.length !== 9002) throw new Error(`inventory rows mismatch ${sandbox.state.inventory.length}`);
if (!sandbox.state.inventory.some(r=>r.item==='locked_item')) throw new Error('locked item was sold');
if (!sandbox.state.inventory.some(r=>r.instanceId==='inst_1')) throw new Error('instance equipment was removed');
if (sandbox.invalidations !== 1) throw new Error('inventory cache should invalidate once');
console.log('PASS bulk autosell scans once, preserves locked/instance items, invalidates once');

// Verify async box opening really uses a bounded batch, and batched result updates redraw once.
if (!/opened = openAllBoxes\(itemId, BOX_OPEN_CHUNK, albumOnlySet\)/.test(engine)) throw new Error('async box opener does not pass chunk limit');
if (!/const n = Math\.min\(row\.qty, BOX_OPEN_ALL_MAX, requestedLimit\)/.test(engine)) throw new Error('box opener ignores requested batch limit');
if (!/recordLootNotice\(id, q, def\.boxOpen === 'violet' \? '紫箱' : '卡冊', true\)/.test(engine)) throw new Error('loot notice batching missing');
if (!/if \(isLootNotice && typeof renderLootNotices === 'function'\) renderLootNotices\(\)/.test(engine)) throw new Error('single final loot notice render missing');
if (!/const albumOnlySet = isCardAlbum \? new Set\(getAlbumOnlyCards\(\)\) : null/.test(engine)) throw new Error('album-only card set is not reused per batch');
console.log('PASS box/card batches are bounded and loot UI/codex checks are batched');

// Auto-sell UI renders a bounded number of rows and uses indexed inventory quantities.
if (!/const AUTO_SELL_RENDER_PAGE = 100/.test(ui)) throw new Error('autosell page size missing');
if (!/visibleLeft = filteredLeft\.slice\(0, asLeftLimit\)/.test(ui)) throw new Error('autosell left list is not paginated');
if (!/visibleRight = filteredRight\.slice\(0, asRightLimit\)/.test(ui)) throw new Error('autosell right list is not paginated');
if (!/const qtyById = new Map\(\)/.test(ui)) throw new Error('autosell quantity index missing');
if (!/const selected = new Set\(cfg.items\)/.test(ui)) throw new Error('bulk add still uses repeated array includes');
if (!/_autoSellBaseRowsCache\.delete\(rows\)/.test(ui)) throw new Error('autosell row cache invalidation missing');
console.log('PASS auto-sell UI pagination and inventory indexes');
