# v2.5.310 怪物與卡片來源稽核

本次不是憑空創造怪物或卡片，而是修復 11 張已存在卡片的怪物來源與掉落／MVP 出現配置。

| 怪物 | 卡片 | 地圖 | 類型 |
|---|---|---|---|
| 巴風特 | 巴風特卡片 | gefenia01 | MVP |
| 齊爾-D-01 | 齊爾-D-01卡片 | kh_dun02 | MVP |
| 神聖皮影魔 | 神聖皮影魔卡片 | odin_tem03 | 小王 |
| 女王甲蟲 | 女王甲蟲卡片 | dic_dun03 | MVP |
| 闇●騎士領主 賽依連 | 對應卡片 | lhz_tomb_fallen | MVP |
| 闇●十字刺客 艾勒梅斯 | 對應卡片 | lhz_tomb_fallen | MVP |
| 闇●神工匠 哈沃得 | 對應卡片 | lhz_tomb_fallen | MVP |
| 闇●神官 瑪嘉雷特 | 對應卡片 | lhz_tomb_fallen | MVP |
| 闇●神射手 迪文 | 對應卡片 | lhz_tomb_fallen | MVP |
| 闇●超魔導師 凱特莉娜 | 對應卡片 | lhz_tomb_fallen | MVP |
| 魔劍士 達納托斯的記憶 | 達納托斯卡片 | tha_t12 | MVP |

- 所有怪物與卡片資料原本已存在；本次補上 MVP_MAP_DATA 與 MONSTER_CARD_DROPS。
- 掉率 0.01% 為本作採用的 MVP 卡片基準值，不宣稱是官方伺服器即時掉率。
- 這 11 張卡片原有效果未修改。
- 回歸測試：tools/v310_mvp_card_source_regression.js。
