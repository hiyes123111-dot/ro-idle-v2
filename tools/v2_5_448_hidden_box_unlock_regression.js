/* Focused regression for v2.5.448 mystery-box challenge unlock and persistent collection history. */
const fs = require('node:fs');
const path = require('node:path');
const root = path.resolve(__dirname, '..');
const ui = fs.readFileSync(path.join(root, 'js/ui.js'), 'utf8');
const engine = fs.readFileSync(path.join(root, 'js/engine.js'), 'utf8');
const html = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
let failed = 0;
function check(ok, label) {
  console.log(`${ok ? 'PASS' : 'FAIL'} ${label}`);
  if (!ok) failed++;
}
check(/const boxUnlocked\s*=\s*true\s*;/.test(ui), '神秘箱挑戰不再受三大圖鑑完成度限制');
check(!/if\s*\(codexView\s*===\s*'hidden'\s*&&\s*!boxUnlocked\)/.test(ui), '已選擇隱藏圖鑑時不會被強制踢回道具頁');
check(/codexRecordBox\(itemId\)/.test(engine) && /ensureCodex\(\)\.box\[itemId\]\s*=\s*1/.test(engine), '神秘箱開出紀錄寫入獨立永久圖鑑欄位');
const sellStart = engine.indexOf('function sellItem(itemId, qty)');
const sellEnd = engine.indexOf('function sellItemAll(itemId)', sellStart);
const sellBody = engine.slice(sellStart, sellEnd);
check(sellStart >= 0 && sellEnd > sellStart && !/state\.codex|delete\s+.*codex/.test(sellBody), '一般道具賣出不會刪除圖鑑歷史紀錄');
const instanceStart = engine.indexOf('function sellItemInstance(instanceId)');
const instanceEnd = engine.indexOf('/* ---------------- 自動販賣', instanceStart);
const instanceBody = engine.slice(instanceStart, instanceEnd);
check(instanceStart >= 0 && instanceEnd > instanceStart && !/state\.codex|delete\s+.*codex/.test(instanceBody), '裝備賣出不會刪除圖鑑歷史紀錄');
check(/賣掉、使用或存倉不會扣除已完成項目/.test(ui), '介面清楚說明挑戰採歷史取得紀錄');
check((html.match(/v=2\.5\.448/g) || []).length === 59 && !html.includes('v=2.5.447'), '59 個 HTML 與 Service Worker 資源快取全部更新至 v2.5.448');
console.log(`${7 - failed}/7 passed`);
process.exitCode = failed ? 1 : 0;
