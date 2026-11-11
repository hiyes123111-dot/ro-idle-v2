# V2.5.5.27 QA — 五階段技能／戰鬥稽核續修

## 基礎版本
- 直接承接 V2.5.5.26；未回退至 V2.5.5.24／V2.5.5.25。
- `VERSION.txt`、`index.html` 的 engine/ui cache-busting query 已統一為 2.5.5.27。
- V1.17 未修改；未推送 GitHub。

## 五階段驗收狀態

### 1. 三轉／四轉主動技能倍率與實際段數
- 四轉技能資料稽核：208 項（120 主動、88 被動）；既有測試確認四轉主動技能描述倍率與 `mult` 陣列首尾值一致。
- 四轉 13 職業技能目錄與技能可學習／戰鬥解析回歸通過。
- 已有多段、範圍、DOT、衝鋒等共用公式參數傳遞測試。
- 限制：倍率一致性不等於每招官方逐段倍率已核實；未取得可靠官方逐招段數資料者，不以猜測補數值。

### 2. 13 個四轉職業被動效果與戰鬥計算
- 13 職業、208 技能資料、88 被動描述與 9 種被動效果處理路徑稽核通過。
- 9 個召喚名稱被動仍明確揭露目前不會生成獨立召喚單位，避免誤標為已完成召喚 AI。
- 四轉被動重新計算及技能點學習回歸通過。

### 3. 召喚物、陷阱、持續傷害及特殊觸發機制
- 遊俠／風鷹普攻追擊、獵人／風鷹陷阱、反制觸發、毒傷與 DOT 等既有專項傷害路徑回歸通過。
- 各技能獨立觸發與冷卻保留；被動觸發統計已移除，不再執行統計計數。
- 限制：召喚名稱被動中仍有未實作獨立召喚單位者；不能宣稱所有官方召喚物／裝置機制已完整重現。

### 4. 34 個尚未可靠對應的舊裝備技能增傷名稱
- 保留 34 個未確認詞條的隔離狀態，不把它們錯誤套用到名稱相似但未證實的技能。
- 目前可確認並註冊的對照仍為 34／68。
- 未完成項目：需要逐項可靠的官方技能 ID／中文名稱／版本對照，才能安全補齊剩餘 34 個映射；本版不虛構映射。

### 5. 統一等級、裝備、怪物條件的職業 DPS 與生存比較
- 目前專案有技能／套裝／被動的回歸測試，但沒有可重現的全職業標準化 DPS 與生存模擬器。
- 未將單一技能倍率或靜態公式檢查冒充完整職業比較。
- 未完成項目：建立統一 BaseLv／JobLv、素質、裝備、精煉、卡片、怪物 DEF/MDEF/屬性/體型/種族、戰鬥時間與補給規則的模擬器，再輸出各職業 DPS、有效生命／承傷與存活時間。

## 本版自動測試
- `tools/v25516_skill_description_regression.js`
- `tools/v25519_fourth_job_passive_audit.js`
- `tools/v25520_proc_damage_regression.js`
- `tools/v25521_skill_weapon_formula_regression.js`
- `tools/v25522_passive_weapon_bonus_regression.js`
- `tools/v25523_proc_damage_coverage_regression.js`
- `tools/v25524_reactive_proc_damage_regression.js`
- `tools/v25526_remove_proc_stats_regression.js`
- `tools/v2558_ranger_regression.js`
- `tools/v2559_ranger_passive_regression.js`
- `tools/v255_skill_alias_regression.js`
- `tools/v255_skill_bonus_coverage.js`
- `tools/v255_asset_regression.js`
- `tools/v2_regression.js`

## 結論
- 本版已完成可由現有程式碼與測試可靠驗證的修正，並統一版本標記。
- 第 4 項剩餘 34 個詞條映射與第 5 項全職業標準化 DPS／生存模擬尚未完成；因此本版是稽核續修版，不冒稱五階段最終平衡完成版。
