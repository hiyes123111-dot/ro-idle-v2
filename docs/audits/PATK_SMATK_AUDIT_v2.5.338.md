# P.ATK／S.MATK 稽核補強 v2.5.338

- `effectiveGearBonuses()` 的裝備頂層直接加成白名單補入 `pAtk`、`sMatk`、`patk`、`smatk`，避免部分資料以頂層欄位保存時未併入總表。
- `canonicalBonusKey()` 已將大小寫／點號／底線別名統一為 `pAtk`、`sMatk`。
- `condBonus` 中的階級條件仍由 `condMet()` 的 `itemGradeMin`／`allItemGradesMin` 判斷；靴子 A 階級 +7/+7 以及鎧甲、斗篷階級詞條需以實際裝備個體 grade 欄位測試。
- 本版完成程式入口補強與資料夾歸檔；尚未宣稱完成瀏覽器實際穿裝測試。
