# v2.5.354 EP21 搭配卡搜尋與圖片稽核

## 本次修正
- `ep21_epesto_card`：新增 Epesto Walther Megas、日文名稱、物品編號 300595 等搜尋別名。
- `ep21_ylze_card`：新增 Ilse El Heine、日文名稱、物品編號 300602 等搜尋別名。
- 兩張卡片碎片同步新增英文與中文搜尋別名。

## 圖鑑收錄檢查
- 卡片圖鑑清單由 `CARDS` 與 `ITEMS` 交集組成，且要求卡片名稱以「卡片」結尾。
- 兩張卡片均存在於兩個資料表，slot 均為 weapon。
- 兩張卡片均有 `CARD_ART_FALLBACKS` 專屬 SVG 路徑：
  - `images/cards/generated/ep21_epesto_card.svg`
  - `images/cards/generated/ep21_ylze_card.svg`
- 兩張 SVG 是專案自製卡面，不是官方原始卡圖。

## 官方資料交叉參照
- twRO 官方 EP21 耶斯卡夫卡片公告列出卡片取得方式為「最終決戰－超困難試煉」BOSS 隨機取得卡片或碎片。
- Divine Pride／日文資料庫能查到兩張卡片的官方物品名稱及資料頁。
- 本版未從第三方網站抓取或直接熱連結圖片，避免來源授權、穩定性與錯圖問題。

## 本版未變更
- 卡片的 `perRefine` 與 `condBonus` 效果數值未更動。
- 耶斯卡夫 A 階級頭冠搭配與精煉+10條件未更動。
- 未新增不確定的怪物掉落來源。
