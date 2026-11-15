const fs = require('fs');
const s = fs.readFileSync('js/ui.js','utf8');
const checks = [
  ['背包分批上限為80', /const INV_RENDER_PAGE_SIZE = 80/.test(s)],
  ['背包只建立可見頁面DOM', /const visibleRows = rows\.slice\(0, invRenderLimit\);\s*const items = visibleRows\.map/.test(s)],
  ['背包提供載入更多', /showMoreInventoryRows\(\)/.test(s) && /載入更多（再/.test(s)],
  ['倉庫左右清單各自分頁', /const WH_RENDER_PAGE_SIZE = 100/.test(s) && /whBagRenderLimit/.test(s) && /whStoreRenderLimit/.test(s)],
  ['倉庫提供載入更多', /showMoreWarehouseRows\(side\)/.test(s) && /showMoreWarehouseRows\('\$\{side\}'\)/.test(s)],
  ['背包圖片延遲載入', (s.match(/loading="lazy" decoding="async" src="\$\{itemImgSrc\(row\.item\)\}"/g)||[]).length >= 2],
  ['倉庫圖片延遲載入', /wh-row[\s\S]*?loading="lazy" decoding="async"/.test(s)],
  ['切換背包分類重設頁面', /function setInvCategory\(c\) \{\s*invRenderLimit = INV_RENDER_PAGE_SIZE/.test(s)],
  ['切換倉庫分類重設頁面', /function setWhCategory\(c\) \{ whBagRenderLimit = whStoreRenderLimit = WH_RENDER_PAGE_SIZE/.test(s)],
  ['未更動存檔資料結構', !/inventory\s*=\s*\[\s*\]|warehouse\s*=\s*\{\s*items:\s*\[\s*\]\s*\}/.test(s)]
];
for (const [name, ok] of checks) console.log(`${ok?'PASS':'FAIL'} ${name}`);
console.log(`${checks.filter(x=>x[1]).length}/${checks.length} passed`);
if (checks.some(x=>!x[1])) process.exit(1);
