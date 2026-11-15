# v2.5.408 Release QA

## 本輪範圍
- EP21 七張普通卡：核對既有資料、官方道具編號、武器 Lv.5／精煉條件、SP 消耗、圖鑑及卡冊。
- 2026 冬季狩獵祭四張卡：補齊官方道具編號及圖鑑 fallback；修正雷根貝勒拓堤奧卡片「命中物理傷害」的缺漏消費端。
- 命中物理傷害依 2026/01/20 官方規則，接入未暴擊普通物理攻擊及支援的物理技能；魔法、固定傷害、暴擊及官方列出的排除技能不重複套用。
- EP19 二級防具與精煉條件回歸測試沿用並更新至本版快取版本。

## 測試
- `tools/v2_5_408_card_runtime_regression.js`：EP21 7 張、冬季 4 張、武器等級、精煉門檻、SP 消耗、卡片組合、命中物理傷害、圖鑑、卡冊及 11 張 fallback 圖片均通過。
- `tools/v2_5_408_ep19_secondary_armor_regression.js`：13/13 通過；Lv.2 與 +12 門檻分開判斷。
- `tools/v2_5_407_ep19_card_effect_regression.js`、`tools/v2_5_406_ep19_card_regression.js`、`tools/v2_5_405_ep19_album_gap_regression.js`、`tools/v2_5_404_ep20_card_effect_regression.js`、`tools/v2_5_403_ep21_missing_cards_regression.js`、`tools/v2_5_402_ep21_tan_card_regression.js`、`tools/v2_5_401_card_catalog_regression.js`：全部通過。
- `tools/v274_ep21_card_data_regression.js`：4/4 通過。
- `tools/v274_ep21_card_effect_regression.js`：13/13 通過。
- 41 個 JS 檔案 `node --check`：41/41 通過。
- `index.html` 41 個靜態資源快取參數全部為 `2.5.408`；`VERSION.txt` 同步為 `2.5.408`。

## 取得來源限制
- 外部 twRO 資料庫列出的怪物與掉率不等於本專案已建立怪物或地圖刷新。未確認的 EP21 怪物地圖／掉落連動不宣稱完成。
- 新增 SVG 為辨識用 fallback，不冒充官方卡片原圖。
- 玩家存檔不清除、不覆蓋。
