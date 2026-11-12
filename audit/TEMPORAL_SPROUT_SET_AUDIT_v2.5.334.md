# v2.5.334 時光超越天地樹苗套裝稽核

## 修正範圍

- 天地樹苗：`temporal_sprout_tw`
- 舊版斗篷／鎧甲／戰靴：`temporal_cape_tw`、`temporal_armor_tw`、`temporal_boots_tw`
- LT 斗篷／鎧甲／戰靴：`temporal_cape_lt_tw`、`temporal_armor_lt_tw`、`temporal_boots_lt_tw`
- LT 鎧甲相容別名：`temporal_armor_tw_lt`

## 條件驗證

1. 天地樹苗基礎技能後延遲 -3%；移除資料中錯誤的無條件 MHP +15%，MHP +15% 僅在搭配鎧甲時生效。
2. 斗篷任一版本：追加技能後延遲 -3%、攻擊後延遲 -10%。
3. 鎧甲任一版本：MHP +15%。
4. 戰靴任一版本：全階級物理／魔法傷害 +10%。
5. 斗篷＋鎧甲任一版本組合：精煉總和 18／20／26 的對應能力。
6. 斗篷＋鎧甲＋戰靴任一版本組合：近距離／遠距離物理傷害 +8%、全屬性魔法傷害 +8%；精煉總和 39 時加入全體無視物防／魔防欄位。

## 實作方式

新增 `when.withItemGroups` 條件：每個群組至少裝備其中一件。精煉總和仍只累加身上實際裝備的 ID，因此同一部位的舊版與 LT 版不會重複加總。

## 驗證

- `node --check js/data.js`：通過
- `node --check js/engine.js`：通過
- 靜態條件組合測試：涵蓋舊版全套、LT 全套、舊版／LT 混搭及缺少任一部位的情況。
- ZIP 完整性：重新打包後執行 `testzip()`。

## 注意

遊戲資料庫中同時有 `temporal_armor_lt_tw` 與 `temporal_armor_tw_lt` 兩個 LT 鎧甲識別鍵，已一併納入天地樹苗的鎧甲分組。
