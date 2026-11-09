# 技能增傷欄位與技能登錄覆蓋檢查 — v2.5.176

## 本版修正
- 修正 `v255_skill_bonus_coverage.js`：納入 `v2_6_skill_migration.js`，並解析 `put()` 建立的技能 ID。
- 修正 `v255_skill_alias_regression.js`：不再自行虛構技能 ID；改由實際技能登錄來源解析技能。
- 修正 `v255_skill_bonus_audit_regression.js`：移除過時的固定數量斷言，改為動態檢查登錄、別名目標及載入順序。
- 確認 `index.html` 中 `v2_6_skill_migration.js` 在 `engine.js` 之前載入。

## 本次檢查結果
- 技能登錄來源：5 個（`skills.js`、`v2_content.js`、`v2_4_content.js`、`v2_5_content.js`、`v2_6_skill_migration.js`）
- 可解析技能 ID：455
- 裝備資料中的技能增傷鍵：91
- 原生鍵或已驗證別名：57
- 尚未確認對應：34

尚未確認鍵：
`ab_duplex`, `backstab`, `beastswing`, `burstsphere`, `carttornado`, `catnipmeteor`, `cg_reverberation`, `creationlight`, `crushstorm`, `destructcomet`, `dominion_brand`, `duple_light`, `dusklight`, `earthstrain`, `esma`, `evilspiritboom`, `fullmoonkick`, `great_blow`, `heavyearthquake`, `heavyrain`, `in_lightning_spear`, `in_shout`, `me_hardworking`, `meteorfall`, `pickypeck`, `roundtable`, `slaughterdance`, `soulexplosion`, `swing_axe`, `triangleshot`, `venomsplash`, `vulcanarm`, `whirlaxe`, `wrathofgod`.

## 驗證原則
本版只修正稽核與回歸測試，沒有把尚未確認的技能鍵強行映射至相似名稱技能，也沒有更動戰鬥傷害計算。下一步需逐項核對原始技能定義、職業歸屬與裝備說明，再決定是否新增正式技能或別名。
