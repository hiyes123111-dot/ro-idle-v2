# BaseLv／JobLv／HP／SP 成長效果修正（v2.5.100）

基準：v2.5.99 equipment-engine-audit。此批只補齊可由現有裝備描述直接確定的成長公式，不改動裝備基礎數值、戰鬥傷害公式或其他裝備效果。

## 本批修正

| 裝備 | 描述效果 | 實裝方式 |
|---|---|---|
| 變色龍盔甲 | HP、SP 各增加 BaseLv 同等數值 | `perBaseLv1_hp: 1`、`perBaseLv1_sp: 1` |
| 瓦爾基里的長靴 | 法師／弓手／服事系 MHP + BaseLv×5；劍士／商人／盜賊系 MSP + JobLv×2 | 依 `jobLine` 分流條件加成；新增 `perJobLv2_` 消費端 |
| 時間的守護者戒指 | MHP+50；BaseLv 每+2，MHP 再+15 | 保留固定 `hp:50`，新增 `perBaseLv2_hp:15` |

## 引擎補強

- `canonicalBonusKey()` 新增 `perBaseLv2_`、`perJobLv2_` 前綴正規化。
- `getCardBonus()` 新增 BaseLv 每滿 2 級與 JobLv 每滿 2 級的通用計算。
- 成長效果仍由 `getCardBonus()` 進入既有衍生數值計算，不另造一套 HP/SP 計算流程。
- `half_brynhild` 原有 `perBaseLv1_hp:20`、`perBaseLv1_sp:5` 已存在且符合描述，本批不重複修改。

## 驗證範圍與限制

- 對全部 JavaScript 檔案執行 Node.js 語法檢查。
- 以資料斷言確認三件裝備的成長欄位及職業分流存在。
- 這是程式碼與資料層回歸，不等同瀏覽器遊戲內實戰測試；仍需在瀏覽器確認不同職業、BaseLv／JobLv 升級及換裝後的 HP/SP 面板。

### 測試結果（本次執行）

- JavaScript 語法檢查：51 個檔案，0 個語法錯誤。
- 本批專項回歸：7 項全部 PASS。
- 專案完整回歸：15/28 PASS、13 FAIL。
- 已對原始上傳的 v2.5.99 ZIP 執行相同完整回歸：14/27 PASS、13 FAIL；失敗的 13 項與本次完全相同，屬於基準版本既有失敗，並非本批新增。
- 本次新增的專項回歸為額外 1 項 PASS。

瀏覽器實戰測試尚未執行，故仍需遊戲內確認職業分流及面板數值。
