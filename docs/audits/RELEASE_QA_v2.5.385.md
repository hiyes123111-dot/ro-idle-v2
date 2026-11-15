# v2.5.385 發版驗證

## 本輪範圍
僅修正圖鑑卡片分頁「近期新增」按鈕固定顯示舊數字 44 的問題。依目前卡片圖鑑完整資料池中具有 `addedVersion` 標記的卡片動態計數。計數在搜尋、分類及分頁篩選前計算，避免結果數量隨搜尋字串變動而改變按鈕標示。

## 保留項目
- 不修改裝備、卡片、道具與怪物資料及其取得來源。
- 不修改戰鬥傷害公式、技能倍率、技能觸發機率。
- 不修改 SP／MSP 系統。
- 不處理技能後延遲。
- 不新增任何需要雲端伺服器的功能。

## 驗證
- `v385_codex_recent_count_regression.js`：6/6 通過。
- `test_codex_grouping_v2.5.272.js`：通過；更新舊測試，使名稱與排序預期符合目前圖鑑實際顯示。
- `test_windhawk_sharpshooting_v2.5.270.js`：通過；修正測試 fixture 路徑，改讀取專案內 `tools/config/`。
- `v380_ep19_secondary_armor_card_regression.js`：13/13 通過。
- `v2_5_381_physical_range_magic_damage_regression.js`：通過。
- `v2_5_382_conditional_autospell_audit.js`：通過。
- `v2_5_383_meteorstorm_field_damage_regression.js`：通過。
- `v2_5_384_field_magic_target_gate_regression.js`：通過。
- `v373_codex_search_and_image_regression.js`：通過。
- `v285_codex_obtainable_regression.js`：7/7 通過（706 怪物、12,578 道具、611 卡片；武器／防具及新增道具均可搜尋）。
- `v286_codex_acquisition_sources_regression.js`：4/4 通過。
- `v300_card_database_integrity_regression.js`：通過（711 張卡片）。
- `v321_ep21_drops_images_regression.js`：通過。
- `v321_image_path_completeness_regression.js`：通過（圖片路徑完整性）。
- JavaScript 全檔語法檢查及 HTML 快取版本檢查另行執行。

## 已知歷史測試狀態
完整歷史測試集中仍有舊版固定預期、歷史 fixture 路徑及已變更功能預期等失敗項目；本輪不以批次改寫舊測試預期的方式掩蓋問題。詳情以 `v2.5.384` 歷史回歸紀錄為準。
