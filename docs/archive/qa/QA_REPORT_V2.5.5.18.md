# QA Report — V2.5.5.18

## 本次修正
- 統計欄位「判定」改為「觸發檢查」，不再讓固定觸發陷阱看起來像有機率擲骰。
- 無 `procChance` 的陷阱顯示「固定觸發」；有機率的技能仍顯示成功觸發數 / 實際機率檢查數。
- 陷阱進入統計與冷卻流程前先驗證技能定義，避免無效技能資料被計數或讀取屬性時出錯。
- 保留每個技能獨立判定、獨立內部冷卻的原設計。

## Tests
- `node --check js/engine.js` — PASS
- `node --check js/ui.js` — PASS
- `node tools/v25517_ranger_proc_stats_regression.js` — PASS (11 checks)
- `node tools/v25516_skill_description_regression.js` — PASS (208 fourth-job skills)
- `node tools/v2559_ranger_passive_regression.js` — PASS
- `node tools/v2_regression.js` — PASS (32 equipment sets and full regression)

## Scope
- 只更新 V2.5.5.17 的工作副本；V1.17 未修改；未推送 GitHub。
