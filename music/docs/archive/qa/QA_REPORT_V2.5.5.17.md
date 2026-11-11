# QA Report — V2.5.5.17

## 弓箭手被動觸發統計
- 將統計掛在 `tryTrapProcs()` 與 `tryRangerPassiveProcs()` 真正判定流程，不額外抽樣。
- 每技能獨立記錄：符合攻擊次數、實際判定次數、成功觸發次數、實測觸發率、冷卻略過次數、目前剩餘內部冷卻。
- 固定觸發陷阱也計入判定次數，因此顯示實測率 100%。
- 統計資料存於角色 state，沿用既有存檔機制；提供手動重置。
- 自動戰鬥分頁開啟時每秒更新統計畫面。

## Tests
- `node --check js/engine.js` — PASS
- `node --check js/ui.js` — PASS
- `node tools/v2_regression.js` — PASS (32 equipment sets and existing full regression)
- `node tools/v2559_ranger_passive_regression.js` — PASS
- `node tools/v25516_skill_description_regression.js` — PASS
- `node tools/v25517_ranger_proc_stats_regression.js` — PASS

## Notes
- 實測率為「成功觸發 ÷ 實際判定」，不等同於設定機率的短期保證值；樣本越多越接近期望值。
- 冷卻中的普攻不會進入機率判定，另計入冷卻略過。
