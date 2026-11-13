# v2.5.332 圖鑑收錄核對

## 卡片
- v2.5.330～v2.5.331 共新增 44 張卡片。
- 44 張均同時存在 ITEMS 道具本體與 CARDS 效果定義。
- 圖鑑卡片池以 `Object.keys(CARDS).filter(id => ITEMS[id] && /卡片$/.test(CARDS[id].name))` 建立，因此這 44 張會列入卡片圖鑑。
- 修正兩張 EP19 鞋子卡片的 slot：`shoes` → `footgear`，與圖鑑分類列及插卡相容性使用的部位名稱一致。

## 裝備
- 時光超越湧現鎧甲-LT [1]（temporal_armor_lt_tw）
- 時光超越者斗篷-LT [1]（temporal_cape_lt_tw）
- 時光超越者之靴-LT [1]（temporal_boots_lt_tw）
- 三件均有 ITEMS 定義，名稱有中文且未被 boxEligible 排除；現行圖鑑 item pool 會納入 boxEligible 道具，因此會出現在道具圖鑑。

## 範圍說明
- 圖鑑清單可列出與玩家「已發現」是兩回事；found 狀態要實際取得後才會亮起。
- 圖鑑有資料也不等於卡片已加入怪物掉落表；未核實的掉落來源未擅自新增。
