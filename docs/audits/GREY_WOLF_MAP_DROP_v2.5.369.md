# v2.5.369 灰狼卡片掉落與地圖稽核

## 查證資料
- twRO 灰狼：怪物 ID 21304、等級 187、HP 2,399,581；灰狼卡片 ID 300220，掉率 0.01%。
- 灰狼叢林 `gw_fild01` 出沒魔物：灰燼波利 70、灰燼蝗蟲 50、灰狼 35；地圖資料來源 RagnaPlace twRO。
- 參考：RagnaPlace twRO 灰狼魔物頁、灰狼叢林地圖頁。

## 本作實作
- 沿用既有 `ep18_grey_wolf` 魔物紀錄，沒有建立重複怪物。
- `MONSTER_CARD_DROPS.ep18_grey_wolf` 指向 `grey_wolf_card`，chance=0.0001。
- `MAPS` 新增 `gw_fild01`，使用既有 `ep18_ashring`、`ep18_ashhopper`、`ep18_grey_wolf`。
- 更新卡片 ITEMS 與 CARDS 描述，顯示真實怪物來源及掉率。

## 尚未完成
- 艾佩勒蜈蚣與紫樹精的妙勒尼地下密穴地圖 `mjo_wst01` 尚未加入本作。
- 最下級／中級蠕蟲的 `jor_dun02` 地圖與怪物尚未加入本作。
- 這些卡片先前已存在於卡冊池；本版只完成灰狼卡片的真實怪物掉落與地圖，不宣稱其他卡片已可狩獵取得。

## 驗證
- `node --check js/data.js` 通過。
- 新地圖三個 monster ID 均存在於 MONSTERS。
- 灰狼卡片同時存在於 ITEMS/CARDS，怪物掉落表已接通。
