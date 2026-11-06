# QA Report — V2.5.5.19

## 四轉職業被動技能稽核
- 掃描 208 個四轉技能：120 個主動、88 個被動。
- 88 個被動技能均有明確的本作效果描述；通用數值型被動標示每級數值與滿級總值。
- 確認 9 種被動效果類型均有對應的引擎處理路徑（含風鷹普攻追擊／陷阱的專用觸發器）。
- 針對 9 個名稱含「召喚」的四轉被動，揭露目前不生成獨立召喚單位、而是以能力加成實裝的限制。

## Tests
- `node --check js/v2_5_content.js` — PASS
- `node --check tools/v25519_fourth_job_passive_audit.js` — PASS
- `node tools/v25519_fourth_job_passive_audit.js` — PASS
- `node tools/v2_regression.js` — PASS
- `node tools/v2558_ranger_regression.js` — PASS
- `node tools/v2559_ranger_passive_regression.js` — PASS
- `node tools/v25511_dragonknight_regression.js` — PASS
- `node tools/v25516_skill_description_regression.js` — PASS
- `node tools/v25517_ranger_proc_stats_regression.js` — PASS

## Scope and limitations
- 本版重點是四轉被動技能描述與效果路徑稽核，不宣稱已完成所有職業的召喚物／裝置／演奏特殊機制。
- 未變更 V1.17，未推送 GitHub。
