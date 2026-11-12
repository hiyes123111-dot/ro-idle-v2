# SP／MSP 系統稽核 v2.5.336

## 正確規則
- 本作有 SP／MSP 系統。
- 本作沒有 AP 系統。

## 程式消費路徑核對
- 固定最大 SP：`state.maxSp += getCardBonus('sp') + equippedStatBonus('sp')`。
- 百分比最大 SP：`getCardBonus('spPct')`，而 `getCardBonus()` 讀取 `effectiveGearBonuses()`；該函式會把裝備頂層 `spPct` 合併到總加成。
- LT 戰靴 `temporal_boots_lt_tw` 的 `spPct: 5` 因此會套用，不只是描述文字。
- SP 自然恢復：`spRegenPct` 由卡片／裝備加成表分流至 `state.cardSpRegenPct`，並進入自然恢復計算。
- 技能消耗：施放前檢查 `state.sp < spCost`，施放成功後執行 `state.sp -= spCost`；成本由 `skillSpCost()` 計算。
- `spCostPct` 有獨立加成路徑；不應改成 AP。

## 搜尋結果
- 在 `js/` 目錄搜尋 `AP消耗`、`AP+`、`MaxAP`、`apPct`、`maxAp`、`state.ap`，未找到命中。
- 此次未將只在說明文字中提及 SP、但無法確認條件或數值的舊道具擅自補成效果。

## 驗證
- `node --check js/data.js` 與 `node --check js/engine.js` 通過。
- 這是程式路徑靜態稽核，尚未等同瀏覽器內穿裝與施放技能的實機測試。
