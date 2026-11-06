# V2.5.5.24 QA — 反制型被動技能傷害鏈補齊

## 修正範圍
- 冰凍術／石化術：使用 `skillBaseDamage(true, ...)`，補技能增傷、元素增傷、目標卡片與異常承傷。
- 魔擊術：保留 MATK 傷害源與物理防禦減傷的特例，補技能增傷、元素增傷、目標異常承傷及種族固定傷害。
- 長矛刺擊、投擲長矛、衝鋒攻擊、毒性反彈、反擊：將目標怪物實例傳入防禦與異常承傷計算。

## 驗證
- `node tools/v25524_reactive_proc_damage_regression.js`
- `node tools/v25523_proc_damage_coverage_regression.js`
- `node tools/v25522_passive_weapon_bonus_regression.js`
- `node tools/v25521_skill_weapon_formula_regression.js`
- `node tools/v25520_proc_damage_regression.js`
- `node tools/v25516_skill_description_regression.js`
- `node tools/v25517_ranger_proc_stats_regression.js`
- `node tools/v25510_lordknight_runeknight_regression.js`
- `node tools/v25511_dragonknight_regression.js`
- `node tools/v2_regression.js`
- 全部 `js/*.js` 與 `tools/*.js` 執行 `node --check`。

## 限制
- 本輪為傷害管線一致性修正，不更改技能倍率與觸發機率，也不代表所有職業已完成 DPS／生存平衡。
- 舊裝備中未能可靠對應技能 ID 的加成仍保留待核對，不依名稱猜測映射。
