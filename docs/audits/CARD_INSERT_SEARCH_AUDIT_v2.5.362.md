# v2.5.362 插卡搜尋與六大特性點數稽核

## 插卡搜尋
- `showCardSelect(slotKey)` 仍先以 `cardFitsSlot()` 篩選當前部位可插入的卡片，且只列背包內非裝備個體、數量大於 0 的卡片。
- 新增搜尋欄位，依卡片名稱、描述效果、卡片 ID 即時篩選。
- `filterCardSelectList()` 只切換既有結果列顯示狀態，不重建 DOM，避免手機輸入時焦點跳失。
- 插卡仍呼叫原本 `insertCard()`，完成後重繪插卡面板；插槽規則與插卡消耗邏輯未更動。

## 六大特性重置後點數
- `resetTraitStats()` 將六項 `traitAlloc` 歸零後呼叫 `recomputeDerived(false)`。
- `recomputeDerived()` 以目前四轉職業、BaseLv 計算應得點數，再扣除六項已分配點數，重置後餘額等於全部應得點數。
- 不採用手動在現有餘額上再加返還值，避免重複計算。
