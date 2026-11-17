# v2.5.475 寵物被動能力整合稽核

## 範圍
- 基底：v2.5.474。
- 不改動寵物官方數值、觸發機率、進化配方、飾品效果及玩家存檔格式。
- 主要驗證被動能力從資料解析到角色面板與戰鬥計算的單一路徑。

## 檢查項目
- 133 種寵物蛋 × 7 個親密度位置（100、250、500、750、909、910、950）逐一解析。
- 直接由 `getPetBonus()` 消費的能力不會重複寫入 `effectiveGearBonuses()`。
- 其他能力只併入共用加成表一次；重複讀取不會累加或污染快取。
- 只有 `state.pet` 的出門寵物提供能力；`petRecords` 中已收回個體不參與計算。
- 更換 active pet 後能力即時切換；沒有 active pet 時只保留原始裝備／卡片加成。
- 角色素質面板的寵物來源獨立顯示，不混入裝備／卡片欄。
- 孵化、指定恢復、收回、餵食、進化流程均呼叫 `recomputeDerived(false)`。

## 能力路徑說明
- STR／AGI／VIT／INT／DEX／LUK、ATK／MATK、固定 HP／SP、百分比 HP／SP、CRI、完全迴避等直接欄位，沿用引擎既有 `getPetBonus()` 入口。
- 種族／屬性增傷與減傷、抗性、P.ATK／S.MATK、治癒量、自然恢復、經驗值、攻擊後延遲等，併入 `effectiveGearBonuses()` 後由既有引擎入口消費。
- `variableCastPct`、`skillAfterDelayPct` 依既有專案限制仍未套用，不在本輪宣稱完成。

## 測試
- 新增 `tests/test_pet475_bonus_integration.js`。
- 矩陣測試：133 × 7 = 931 個寵物／親密度案例。
- 另有 8 項整合斷言：能力分流、無重複累加、收回寵物隔離、切換、無寵物、角色面板與生命週期重算、版本一致。
- 全專案測試與 JavaScript 語法檢查以打包前實際結果為準。

## 版本
- `VERSION.txt`：v2.5.475
- HTML 資源查詢版本：2.5.475
- Service Worker runtime cache：`ro-idle-runtime-v2.5.475`
- 玩家 LocalStorage／存檔結構：不變
