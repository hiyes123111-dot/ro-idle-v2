const fs = require('fs');
const path = require('path');
const root = path.resolve(__dirname, '..');
const ui = fs.readFileSync(path.join(root, 'js/ui.js'), 'utf8');
const engine = fs.readFileSync(path.join(root, 'js/engine.js'), 'utf8');
const checks = [
  ['背包有快速切換函式', ui.includes('function toggleInventoryAutoSell(itemId)')],
  ['按鈕只對可販售非遺物顯示', /!locked && def\.type !== 'relic' && def\.sell > 0/.test(ui)],
  ['已加入顯示目前狀態', /✓ 自動賣出/.test(ui)],
  ['未加入顯示加入按鈕', /加入自動賣出/.test(ui)],
  ['切換使用既有清單函式', /toggleAutoSellItem\(itemId\)/.test(ui)],
  ['既有邏輯仍阻擋鎖定道具', /isItemLocked\(itemId\)/.test(engine)],
  ['加入清單不會自行啟用自動販賣', /function toggleInventoryAutoSell[\s\S]*?toggleAutoSellItem\(itemId\)/.test(ui)]
];
let failed = 0;
for (const [name, ok] of checks) { console.log(`${ok ? 'PASS' : 'FAIL'} ${name}`); if (!ok) failed++; }
console.log(`${checks.length-failed}/${checks.length} passed`);
process.exitCode = failed ? 1 : 0;
