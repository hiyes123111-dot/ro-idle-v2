# V2.5.5.21 QA — 技能武器公式參數傳遞修正

## 修正範圍
- `skillBaseDamage()` 的第四個參數 `sk` 會傳入 `weaponChainDamage()`，供技能自身的武器重量、盾牌重量／精煉、無視體型等專屬公式使用。
- 修正範圍攻擊、DOT、施毒直擊與毒傷基底、多段攻擊、體型多段攻擊、衝鋒攻擊等分支，過去呼叫 `skillBaseDamage()` 時漏傳 `sk` 的問題。
- 單體 `damage`／`magic` 分支原本已傳入 `sk`，維持不變。

## 驗證
- `node tools/v25521_skill_weapon_formula_regression.js`：8 項公式參數傳遞檢查。
- `node tools/v25520_proc_damage_regression.js`：遊俠被動／陷阱傷害路徑與獨立冷卻檢查。
- `node tools/v25519_fourth_job_passive_audit.js`：四轉被動處理器與描述稽核。
- `node tools/v2_regression.js`：完整既有回歸測試。

## 限制
本版修正的是技能專屬武器公式參數漏傳，不代表所有三／四轉技能倍率已完成官方逐項校準；倍率平衡仍需依技能資料逐一稽核。
