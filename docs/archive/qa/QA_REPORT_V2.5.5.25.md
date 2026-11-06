# V2.5.5.25 QA 報告

## 修改
- 套裝圖鑑切換狀態修正，切換至套裝頁時清除道具頁篩選殘留。
- 前端 `engine.js`、`ui.js` 加入版本查詢字串，避免行動瀏覽器沿用舊版 JS 快取。
- 無正式怪物掉落來源的裝備（weapon/armor/ammo）從神秘箱子（藍箱）池排除，保留在神秘紫箱池。
- `getItemBoxSources()` 使用實際箱池計算單件機率，圖鑑顯示與抽選池一致。

## 檢查
- JavaScript 語法檢查：通過（`node --check js/engine.js`、`node --check js/ui.js`）。
- 專案回歸測試：通過（`tools/v2_regression.js` 與 V2.5.5.24 反制型被動傷害回歸，0 失敗）。
- ZIP 完整性：打包後執行 `unzip -t`。
