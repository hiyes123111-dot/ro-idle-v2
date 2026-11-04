# V2.5.5.22 QA — 被動追擊／陷阱傷害公式補齊

## 本次修正
- 單體／範圍陷阱傳入技能 metadata，並套用技能傷害加成。
- 遊俠三／四轉被動攻擊傳入技能 metadata。
- 普攻追加攻擊與物理範圍追擊按技能 ID 取回技能 metadata。
- 黑暗瞬間套用技能傷害加成；獵鷹突襲傳入技能 metadata。
- 保留原本獨立機率、獨立內部冷卻及觸發統計。

## 驗證
- `node tools/v25522_passive_weapon_bonus_regression.js`
- `node tools/v25520_proc_damage_regression.js`
- `node tools/v25521_skill_weapon_formula_regression.js`
- `node tools/v25519_fourth_job_passive_audit.js`
- `node tools/v2_regression.js`
- 所有 `js/*.js` 通過 `node --check`。

## 範圍限制
本版修正本次靜態稽核確認的被動物理追擊／陷阱漏傳與漏套加成問題；不宣稱所有職業技能倍率已完成 RO 官方逐技能平衡校準。尚有使用獨立公式的反擊與狀態技能，需依其技能定義逐項確認是否應套用武器專屬參數。
