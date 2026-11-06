# V2.5.5.23 QA — 三轉／四轉被動追擊傷害覆蓋修正

## 本次修正
- 火之獵殺、火柱攻擊、霜凍之術：補技能感知 MATK 傷害鏈、技能傷害加成、元素增傷、目標卡片／異常增傷與種族固定傷害。
- 長矛刺擊、投擲長矛、衝鋒攻擊、反擊、毒性反彈、毒性感染：補各自技能 metadata、技能傷害加成及目標增傷。
- 螺旋擊刺註解與測試改為明確驗證本作 1,000%～2,000% 總倍率，不再把本作平衡值誤稱為官方逐段倍率換算。
- 修正 `VERSION.txt` 與實際交付版本不一致的問題。

## 驗證
- `node tools/v25523_proc_damage_coverage_regression.js`
- `node tools/v25510_lordknight_runeknight_regression.js`
- `node tools/v25511_dragonknight_regression.js`
- `node tools/v25516_skill_description_regression.js`
- `node tools/v25517_ranger_proc_stats_regression.js`
- `node tools/v25520_proc_damage_regression.js`
- `node tools/v25521_skill_weapon_formula_regression.js`
- `node tools/v25522_passive_weapon_bonus_regression.js`
- `node tools/v2_regression.js`
- 所有 `js/*.js` 與 `tools/*.js` 通過 `node --check`。

## 尚未宣告最終平衡的原因
- 舊裝備資料仍有 34 個未能可靠對應到現有技能 ID 的 skill-damage key；未根據名稱猜測映射。
- 本次為已確認傷害路徑漏套加成的修正，尚未完成所有 13 個四轉職業與所有三轉技能的長時間 DPS／生存模擬與實戰數據校準。
- 未實作的官方特殊機制仍需明確列為本作改編或待實作，不能只靠倍率測試宣稱完全等同官方。
