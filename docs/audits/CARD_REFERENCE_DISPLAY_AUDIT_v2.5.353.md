# v2.5.353 卡片引用與條件顯示稽核

## 使用者截圖中的兩張卡
1. 艾佩斯托．巴特．麥加斯卡片 (`ep21_epesto_card`)
   - ITEMS 與 CARDS 均存在。
   - 武器精煉每+1：漸進狙擊（專案技能 ID `v25_windhawk_progressive_shot`）與狂野疾行（`wh_wild_walk`）傷害+1%。
   - 搭配 A 階級耶斯卡夫執行之冠且頭冠精煉+10以上：頭冠每+1精煉，兩項技能傷害再+12%。
2. 伊爾澤．艾爾．海涅卡片 (`ep21_ylze_card`)
   - ITEMS 與 CARDS 均存在。
   - 武器精煉每+1：雷霆陣地（`v25_element_master_6`）與大地驅動（`v25_element_master_8`）傷害+1%。
   - 搭配 A 階級耶斯卡夫審判之冠且頭冠精煉+10以上：頭冠每+1精煉，兩項技能傷害再+12%。

## 卡片引用檢查
- 從所有 `withCards` 條件收集 8 個不同卡片 ID。
- 8/8 均有 CARDS 定義及 ITEMS 道具本體；沒有不存在的卡片引用。
- 因此本次沒有新增重複卡片；舊版卡片資料本身已存在，截圖暴露的是內部加成鍵顯示不友善，以及部分裝備條件說明沒有完整翻譯。

## 本版 UI 修正
- `formatCardBonus()` 新增 `perItemNRefine_*` 格式化。
- `skillDmg_*` 會顯示技能名稱與傷害百分比，不再直接顯示內部欄位鍵。
- 顯示條件裝備名稱、最低階級、最低精煉。
- `describeCondition()` 新增 `withAnyItem`、`itemGradeMin`、`itemRefineMin` 文案。

## 限制
- 兩張卡片 ITEMS 的 `imgId` 目前為 0，卡片圖像仍為通用佔位美術；本版沒有捏造官方卡片圖片。
- 本次沒有改動卡片能力數值，避免重複疊加。
