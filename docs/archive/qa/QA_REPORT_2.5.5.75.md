# QA v2.5.5.75 — 緊急全域名稱解析修正

## 修正
- `item_display_name_fix.js` 改為明確掛載 `window.getItemDisplayName`。
- 支援物件、字串 ID、數字 ID、ITEMS[id] 與掃描 `def.id` 的回退查找。
- 無名稱時回退顯示 ID，避免圖鑑/裝備/背包因名稱解析中斷。
- `index.html` 保持名稱解析檔在 `engine.js`、`ui.js` 之前，並更新快取版本為 2.5.5.75。

## 驗證
- 21 個 JS 檔案 `node --check` 全數通過。
- 名稱解析單元測試 4/4 通過（數字 ID、字串 ID、物件、未知 ID 回退）。
- ZIP 完整性檢查通過。
- 尚未完成實際 GitHub Pages 手機瀏覽器測試，部署後仍需重新整理/清除舊快取確認。

## 樞機主教四轉技能
- 重新比對使用者提供的 2678 影片：來源四轉技能名稱包含 Argutus Vita、Argutus Telum、Mediale Votum、Petito、Benedictum、Divinus Flos、Arbitrium、Competentia、Religio、Fidus Animus、Praesens Acies、Reparatio、Framen、Pneumaticus Procella、Dilectio Heal、Effligo。
- 目前專案中沒有這些來源技能的既有 ID/資料；依照使用者先前「服事沒有的技能不必新增」的明確規則，本版不虛構 ID、不把不相干的現有技能硬改名，也不宣稱四轉技能已完成替換。
- 目前仍保留原有 Cardinal 技能樹，待取得明確允許新增來源中缺少的四轉技能，或提供專案內對應技能 ID 後再更新。
