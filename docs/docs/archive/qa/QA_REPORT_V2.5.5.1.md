# V2.5.5.1 — 裝備與怪物圖片修復 QA

## 修正內容
- V2 新增武器、防具、材料不再依賴空白或不存在的圖片 ID；每件新增物品均有獨立圖示資產。
- V2 新增裂隙怪物及 MVP 不再使用 `imgId: 0`，改為獨立怪物圖像。
- 圖像依既有 `itemImgSrc()` / `monsterImgSrc()` 路徑規則載入，原有圖鑑與戰鬥畫面共用。
- 保留既有物品與怪物圖片、V1.17 資料不變。

## 驗證
- `node --check js/v2_content.js`：通過。
- `node tools/v2_regression.js`：ALL PASSED，0 failures，31 equipment sets。
- `node tools/v255_asset_regression.js`：19/19 V2 item assets、8/8 V2 monster assets，無缺漏。

## 限制
新增圖示為本地生成的辨識圖樣，並非官方 RO 原始美術素材；此修正消除破圖與通用空白佔位問題，不宣稱是官方原圖。
