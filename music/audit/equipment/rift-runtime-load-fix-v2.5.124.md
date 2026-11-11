# 裂隙內容未出現：執行階段載入修正（v2.5.124）

## 根因
`js/v2_content.js` 在第一段四轉職業擴充中，遇到 `jobs.js` 已經註冊的 `cardinal`（以及其他既有四轉職業）時直接 throw `V2 duplicate job id`。因整個檔案由 IIFE 執行，例外會中止後續程式，因此後半段的裂隙裝備、怪物、卡片、地圖、地區、王國與遺物全部未註冊。

## 修正
- 對已存在的四轉職業保留原職業資料，不覆蓋既有職業數值與技能。
- 將本擴充新增的 `v2_` 技能合併到既有職業技能清單；不存在的職業仍依原流程建立。
- `index.html` 所有腳本 URL 的快取版本由 `2.5.96` 更新為 `2.5.124`。
- 新增 `tools/v25124_rift_runtime_regression.js`，以 Node VM 實際執行資料腳本及引擎，驗證裂隙資料與圖鑑池。

## 驗證
- v2.5.124 runtime integration regression：9/9 passed。
- v2.5.121 static rift regression：9/9 passed。
- v2.5.123 battle detail regression：5/5 passed。
- `tools/v2_regression.js`：有一項既有技能倍率描述測試失敗（`v25_wind_hawk_1`、`v25_wind_hawk_5`），與本次裂隙載入修正無關；其餘測試通過。
- 已確認 `getCodexPool()` 實際包含八種裂隙怪物、裂隙卡片及裂隙材料。

## 限制
使用 Node VM 模擬載入，不等同於在使用者裝置的實際瀏覽器完成視覺與操作驗收。使用者端仍需重新載入最新版；若使用部署平台，需確認新版本檔案已部署。
