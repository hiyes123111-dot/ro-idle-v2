# 六大特性配點系統稽核 v2.5.345

## 實作
- 六大特性獨立欄位：`state.traitAlloc`，鍵值 pow/sta/wis/spl/con/crt。
- 剩餘點數：`state.tStatusPoints`，依四轉職業、Base Lv.、已投入點數推導。
- 發點：四轉 Base Lv.200 為 7 點；其後每級 3 點，Base Lv. 每逢 5 的倍數額外 4 點。
- 配點：每次 1 點；單項上限 100。
- UI：角色頁新增六大特性配點卡片，逐項顯示中文名稱、效果說明、投入值與加點按鈕。
- 特性投入透過既有 `getCardBonus()` 入口參與衍生能力計算，包含 POW/SPL/CON、STA/WIS、CRT。

## 基礎素質點數
原有 `state.statPoints`、`state.stats`、`allocateStat()` 完全保留；T.Status Point 不會扣除基礎素質點數。

## 驗證
- `node --check js/engine.js`：通過
- `node --check js/ui.js`：通過
- 發點公式核對：Lv.200=7、Lv.201=10、Lv.205=26、Lv.250=197（四轉職業）
- 單項上限與每點成本由 `allocateTraitStat()` 檢查。
- 尚需在瀏覽器內以四轉角色實測升級、配點、重新載入及衍生面板。
