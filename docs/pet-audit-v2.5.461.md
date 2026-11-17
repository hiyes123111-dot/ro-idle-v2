# v2.5.461 狂暴月夜貓 HP 恢復效果

## 實裝內容
- 寵物：狂暴月夜貓（`cat_o_nine_tail_egg`，道具 ID 9096）。
- 親密度達有點親密（750）時，近距離物理攻擊命中（普通攻擊、單體或範圍近距離物理技能）有 1% 機率觸發恢復效果，每秒恢復 HP 300，持續 5 秒。
- 親密度達非常親密（910）時，同為 1% 機率，每秒恢復 HP 400，持續 5 秒。
- 接在玩家近距離物理普通攻擊與近距離物理技能命中後；遠距離弓攻擊、遠距離物理技能、未命中、零傷害及魔法攻擊不觸發。
- 恢復沿用既有 `activeItemRecoveryProcs` / `applyItemRecoveryTick`，不另建計時器；立即恢復第 1 次，後續每秒恢復，總計 5 次。
- 不消耗 SP，不加自訂冷卻，不影響月夜貓（`moonlight_egg`）原有的觸發機制。
- 寵物效果摘要只在親密度達門檻時標示已實裝。

## 資料核對
- Divine Pride Item 9096：Scripts 明確列出 1% 觸發率。
- Divine Pride 9096 道具說明列出 Cordial 300 HP／秒、Loyal 400 HP／秒，持續 5 秒，且限定 melee physical damage。
- 來源頁面：https://www.divine-pride.net/database/item/9096/

## 測試
- `tests/test_pet461_cat_nine_tail_recovery.js`：12 項測試，涵蓋 1% 機率、兩階段恢復量、遠距離排除、親密度門檻、其他寵物隔離、倒地排除、圖鑑摘要與戰鬥掛接位置。
- 保留 v2.5.457、458、459、460 寵物回歸測試。
