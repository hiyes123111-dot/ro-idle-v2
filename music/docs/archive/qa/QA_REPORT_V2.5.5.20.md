# V2.5.5.20 QA — 三／四轉觸發傷害公式補正

## 修改範圍
- 遊俠三轉／四轉普攻觸發攻擊技能。
- 三轉／四轉陷阱被動：單體傷害與範圍傷害。

## 修正
- 觸發傷害補上技能屬性傷害 buff、目標卡片傷害倍率、目標承傷狀態倍率。
- 防禦計算後套用種族固定傷害，與主動攻擊傷害的處理順序一致。
- 保留每個被動技能獨立機率、獨立內部冷卻、原有觸發統計。

## 測試
- `node --check js/engine.js`：通過。
- `node tools/v25520_proc_damage_regression.js`：6 項通過。
- `node tools/v25516_skill_description_regression.js`：通過。
- `node tools/v25517_ranger_proc_stats_regression.js`：11 項通過。
- `node tools/v25519_fourth_job_passive_audit.js`：通過。
- `node tools/v2_regression.js`：全部通過，0 failure。

## 尚未宣稱完成
- 本版沒有重新平衡 13 個四轉職業及所有三轉主動技能的倍率。
- 三／四轉通用倍率仍需依逐技能效果、武器限制、段數、範圍、元素、冷卻與本作輸出目標逐項審核。
- 本版不改 V1.17，也未推送 GitHub。
