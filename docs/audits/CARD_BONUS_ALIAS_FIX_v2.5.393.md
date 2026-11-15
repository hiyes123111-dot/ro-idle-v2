# v2.5.393 卡片效果共用入口修正稽核

## 修正原因
- v2.5.392 新增卡片使用 `crit` 表示 CRI 點數，但引擎戰鬥計算讀取 `critRate`；原本 `mergeBonus()` 將資料存為 `crit`，而戰鬥端查詢 `critRate`，造成 CRI 沒有套用。
- 耶爾克使役者／教役者套裝的條件加成使用 `cRate`，資料可被 `getCardBonus('cRate')` 讀到，但角色衍生值 `state.cRate` 原本只計算四轉 CRT / 3，沒有納入卡片／裝備 C.RATE。

## 修正
- `canonicalBonusKey('crit')` 統一轉為 `critRate`。
- `getCardBonus()` 查詢參數也經過 `canonicalBonusKey()`，確保舊資料以 `crit` 查詢時仍能讀到正規化數值。
- `state.cRate` 改為 `floor(CRT / 3) + getCardBonus('cRate')`；`state.critDmgPct` 沿用此衍生值，避免 C.RATE 漏算或重複計算。
- 不修改 CRI / C.RATE 的來源卡片數值，不調整任何傷害倍率、掉率、技能後延遲或存檔格式。

## 驗證
- v2.5.392 卡片回歸：15 張新卡、34 個基礎效果欄位、圖鑑與卡冊收錄、2 組套裝條件、STR/BaseLv 條件、熔岩蟾蜍修正全部通過。
- v2.5.393 bonus alias 測試：6/6 通過。
- 26 個 JavaScript 檔案 `node --check` 全部通過。
- 入口 HTML 引用的本地 JS 檔案存在；快取版本更新為 v2.5.393。

## 已知限制（不宣稱已套用）
- 本遊戲目前沒有施法時間模擬；`variableCastPct` / `fixedCast` 仍屬資料記錄，不能讓目前的即時施法流程變快。這次不擅自加入施法等待，以免改變戰鬥節奏。
- 本輪只修正已能由目前戰鬥引擎消費的 CRI / C.RATE 共用鍵，未宣稱已完整比對仙境全書所有卡片頁面。
