# v2.5.355 裝備搭配卡片可搜尋性稽核

## 裝備條件引用
掃描 `withCards` 條件，共 8 個不同卡片 ID：
- fenrir_card — 潘利爾卡片
- garm_card — 卡崙卡片
- gloom_under_night_card — 影魔卡片
- marc_card — 馬克卡片
- marduk_card — 馬爾杜克卡片
- observation_card — 監視者卡片
- pharaoh_card — 法老王卡片
- porcellio_card — 三葉鐵甲蟲卡片

8/8 同時存在 CARDS、ITEMS，且符合圖鑑候選條件。背包／圖鑑搜尋讀取 ITEMS.searchTerms 與 CARDS.searchTerms，因此已在 ITEMS 補上可查詢的中英文別名。

## EP21 卡片
- `ep21_epesto_card`、`ep21_ylze_card` 均有 ITEMS/CARDS、圖鑑候選資格與專屬 SVG 卡面。
- 官方原圖仍未有可驗證、可直接納入專案的原始圖檔；保留專屬 SVG，不以第三方相似圖片冒充。

## 裝備引用
- `withItems` 掃描出的 84 個不同 ID 均存在 ITEMS。
- `temporal_boots_lt_tw` 有正式 ITEMS 定義，imgId 470183；時光超越者斗篷-LT 對靴子的條件引用有對應資料。
- `withAnyItem` 另出現 `hungry_bear_power`，該字串不是 ITEMS/CARDS 道具 ID；目前未將它假造為卡片或裝備。需進一步確認它是附魔／特殊效果 ID，否則該條件可能無法由一般裝備清單觸發。

## 驗證
- `js/data.js`、`js/engine.js`、`js/ui.js` Node 語法檢查通過。
- 本版只增加搜尋別名，不修改既有卡片能力，避免重複套用。
