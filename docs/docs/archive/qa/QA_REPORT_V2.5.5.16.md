# V2.5.5.16 — 三轉／四轉技能說明明確化

## 本次修正
- 四轉被動技能不再顯示「每級提升對應能力」等籠統文字；依實際 `passiveStat` 寫出 ATK、MATK、DEF、HIT、FLEE、最大 HP／SP 的每級數值及滿級總量。
- 四轉一般主動攻擊技能說明列出實際倍率範圍、傷害來源（ATK／MATK）、單體／範圍、屬性、SP 消耗與冷卻。
- 三轉主動攻擊技能說明依現有 `mult`、`spCost`、`cooldown`、屬性與武器條件補齊，避免只寫「依技能等級提升傷害」。
- 風鷹四轉自動攻擊技能列出觸發機率、倍率、觸發條件與內部冷卻。
- 風鷹陷阱列出觸發機率、暈眩／傷害／HIT 降低效果、持續時間及內部冷卻。
- 沒有更動 V1.17；沒有推送 GitHub。

## 驗證
- `node --check js/v2_5_content.js`：通過。
- `node tools/v2_regression.js`：通過，32 組套裝檢查全數通過。
- `node tools/v25516_skill_description_regression.js`：通過，稽核 208 個四轉技能（120 主動、88 被動）。
- `node tools/v2558_ranger_regression.js`：通過。
- `node tools/v2559_ranger_passive_regression.js`：通過。
- `node tools/v25511_dragonknight_regression.js`：通過。
- `node tools/v25512_loot_and_dragonbreath_regression.js`：通過。
- `node tools/v255_skill_alias_regression.js`：通過。

## 範圍說明
本版修正技能文字與目前遊戲內已實裝的效果數值對齊；技能倍率仍採本遊戲既有平衡設定，不代表完全等同官方 RO 數值。三轉被動技能中若原本有專屬觸發或狀態效果，仍需逐項對照戰鬥結算，後續持續稽核。
