# QA Report — v2.5.5.74

## 緊急修正
- 修正瀏覽器錯誤：`getItemDisplayName is not defined`。
- 新增 `js/item_display_name_fix.js`，在資料表載入後、`engine.js` 與 `ui.js` 前定義全域名稱解析函式。
- 支援物品 ID、物品資料物件、`displayName` / `display_name` / `name_zh` / `name` / `title` 欄位，找不到時回退顯示 ID，避免圖鑑渲染因未定義函式而中斷。

## 驗證
- JavaScript 語法檢查：執行全專案 JS 檔案檢查。
- 確認 index.html 載入順序：data/content → item_display_name_fix → engine → ui。
- 尚未進行實際瀏覽器端點擊與完整遊戲流程測試。
