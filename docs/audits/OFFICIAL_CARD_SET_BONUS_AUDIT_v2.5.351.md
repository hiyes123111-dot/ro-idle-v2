# v2.5.351 官方卡片套裝補正稽核

## 修正依據
台灣 RO 官方「2026冬季狩獵祭新增卡片清單」明確記載：
- 雷根貝勒拓堤奧卡片搭配「海茉特．雷根弗賴格卡片」時，命中物理傷害+5%。
- 雷根貝勒會長雷根貝勒卡片搭配「海茉特．雷根弗賴格卡片」時，CRI+15、暴擊傷害+3%。
官方公告：https://ro.gnjoy.com.tw/Notice/Notice_View?id=218097

官方「王室狩獵兌換卡片能力說明」列出海茉特卡片本身效果：
- 使用技能時，SP消耗量+10%。
- 精煉每+3時，近／遠距離物理傷害+4%。
官方公告：https://ro.gnjoy.com.tw/notice/notice_view.aspx?id=216361

## 本次修正
- 新增 `helmut_regene_card` 到 ITEMS 與 CARDS。
- 裝備位置：鎧甲。
- 無條件效果：`spCostPct: 10`。
- 每精煉+3：`meleeDmgPct: 4`、`rangedDmgPct: 4`。
- 會長卡條件 `withCards:["helmut_regene_card"]` 成立時，增加 `critRate:15`、`critDmgPct:3`。

## 尚未實裝項目
- 拓堤奧卡片的「命中物理傷害」與其海茉特套裝加成仍未實裝。引擎目前沒有確認等價的命中物理傷害乘區；不能以近距離或遠距離物理傷害替代。
- 其他 EP21 職業專屬卡片中，部分職業技能未在本遊戲技能資料庫建立，因此維持明確未實裝註記，不把描述當成實際加成。

## 驗證
- ITEMS/CARDS 同時存在海茉特卡片。
- `withCards`、`per3Refine_*`、`spCostPct` 等欄位均有引擎處理路徑。
- `node --check`：data.js、engine.js、ui.js 均通過。
