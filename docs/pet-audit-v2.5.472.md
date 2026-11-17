# v2.5.472 寵物戰鬥效果整合稽核

## 本版基底與範圍
- 基底：v2.5.471。
- 完成傀儡娃娃、惡魔侍者、惡魔女僕、遺棄玩偶熊四項戰鬥觸發效果。
- 修正廢柴寵物蛋（9183）TWRO 親密度能力資料，並本地化太子（9184）、古代冰風、藍獨角獸蛋說明。
- 修正寵物親密度標籤與能力分階門檻：非常親密統一為 910。
- 修正低親密度圖鑑錯誤顯示高親密度觸發能力待處理的問題。
- 不修改玩家 LocalStorage、角色存檔或寵物個體培養紀錄。

## 已接入戰鬥的能力

### 傀儡娃娃（Marionette Egg）
- 受到物理攻擊時 1% 觸發。
- 觸發後 3 秒內，無屬性物理傷害 -20%。
- 每秒恢復 HP 100，共 3 次（立即一次，之後每秒一次）。
- 普通攻擊與怪物物理技能受擊流程均已接入；魔法攻擊不觸發。

### 惡魔侍者（Incubus Egg）
- 物理攻擊時，將本次傷害的 1% 轉為 SP。
- 親密度普通／有點親密使用 2%，非常親密使用 3% 觸發率。
- TWRO 道具描述只寫「較低機率」未提供數字；2%／3% 採 Divine Pride VNRO 分階資料與 DP item scripts 作跨服參考，不宣稱是 TWRO 公告機率。
- MSP +3%（常駐），非常親密 MSP +5%。

### 惡魔女僕（Succubus Egg）
- 親密度達有點親密後，物理攻擊時 2% 機率將本次傷害的 5% 轉為 HP。
- 非常親密另有 MHP +1%。
- TWRO 描述沒有精確機率；2% 採 Divine Pride iRO／LATAM 參考資料，不宣稱是 TWRO 公告機率。

### 遺棄玩偶熊（Abandoned Teddy Bear Egg）
- 親密度達有點親密後，魔法攻擊時 1% 機率觸發。
- 持續 5 秒，每秒恢復 SP 30；非常親密每秒恢復 SP 40。
- 使用既有 `activeItemRecoveryProcs`／`tickItemRecoveryProcs` 恢復佇列，不新增另一個心跳計時器。

## 其他資料修正
- 廢柴寵物蛋（9183）：依 TWRO 資料，低階 CRI+3、普通 CRI+5／近距離物理傷害+1%、有點親密 CRI+7／+2%、非常親密 CRI+9／+3%。
- 太子寵物蛋（9184）：本版不把飼養戒指附魔效果誤當成寵物本身能力。
- 古代冰風蛋：本地化資料，未杜撰能力加成。
- 藍獨角獸：活動期間移動速度仍不套用，因本作沒有活動期間開關；不把活動限定能力常駐化。
- 皮里恩、月夜貓、彷徨的小鴨玩具：修正低親密度圖鑑摘要誤顯示尚未開放的高階觸發效果。
- 已解析的外文寵物數值不再顯示重複的「外文效果待核對」提示。

## 仍需保留待處理的項目
1. 小不點管理員 β：指定「失落的山谷飼養場／汙水處理廠」地圖增傷。
2. 小不點管理員 α：指定「魔力發電廠／塔爾塔羅斯儲藏室」地圖增傷。
原因：目前專案 `MAPS` 沒有這些地圖與對應怪物資料，無法安全建立地圖／魔物對照。未新增虛構地圖或錯誤套用到其他地圖。
3. 藍獨角獸活動期間移動速度：缺少活動期間控制與移動速度模型，未改成永久加成。
4. 變動詠唱與技能後延遲：依先前範圍維持不處理。

## 來源核對
- Marionette Egg：Divine Pride item 9043，1% 受物理攻擊觸發、3 秒、無屬性減傷 20%、每秒 HP 100。
  https://www.divine-pride.net/database/item/9043/marionette-egg
- Incubus Egg：Divine Pride item 9052，TWRO 只寫低機率；VNRO 分階資料與 item scripts 列出 2%／3%。
  https://www.divine-pride.net/database/item/9052/incubus-egg
- Succubus Egg：Divine Pride item 9055，TWRO 只寫有機率；iRO／LATAM 資料列出 2%。
  https://www.divine-pride.net/database/item/9055
- Abandoned Teddy Bear Egg：Divine Pride item 9108，1% 魔法攻擊觸發，Cordial 每秒 SP 30、Loyal 每秒 SP 40。
  https://www.divine-pride.net/database/item/9108
- Fei-Chai Egg 9183 TWRO：CRI 與近距離物理傷害分階。
  https://ragnaplace.com/zh-t/twro/item/9183
- Tai-Zi Egg 9184 TWRO：飼養戒指附魔與寵物本體效果分開。
  https://ragnaplace.com/zh-t/roztw/item/9184

## 測試與版本
- 本版專項測試：26 項。
- 全套 16 個測試檔案共 252 項檢查通過；73 個 JavaScript 檔案語法檢查通過。
- 寵物資料庫共 132 種；逐一檢查 4 個親密度階段，共 528 組摘要。
- 目前仍需地圖資料才能接入的指定地圖效果為 2 隻管理員寵物；藍獨角獸活動效果亦維持未套用。
- HTML、Service Worker cache、`VERSION.txt` 全部同步為 2.5.472。
