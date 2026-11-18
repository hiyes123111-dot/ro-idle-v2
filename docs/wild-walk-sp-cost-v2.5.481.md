# RO Idle v2.5.481 狂野疾行 SP 消耗修正報告

## 問題原因
v2.5.480 在 `js/v2_5_content.js` 將 `wh_wild_walk.spCost` 覆寫為 `[0,0,0,0,0]`。因此每次施放狂野疾行都不會扣除 SP，與 twRO 每級技能資料不符。

## 修正
- Lv1：63 SP
- Lv2：66 SP
- Lv3：69 SP
- Lv4：72 SP
- Lv5：75 SP
- AP：官方另有 AP 5 消耗；本作沒有 AP 系統，因此不模擬 AP，不把 AP 轉換成 SP。
- 共用 `skillSpCost()` 同時供自動／手動施放判斷與實際扣款使用，因此修正後會按技能等級扣除一次正確 SP。

## 保留項目
- 狂野疾行倍率：每段 700%～2,100%（v2.5.480 已調整）。
- 三段攻擊、FLEE +100～300、持續 6～18 秒、20 秒冷卻。
- 前置技能條件與艾佩斯托卡片效果不變。
- 不修改玩家存檔格式，不重置 LocalStorage，不修改寵物系統。

## 驗證
- 新增 `tests/test_wild_walk_sp_cost_481.js`：10 項檢查通過，驗證逐級 SP 資料及 `skillSpCost()` 計算。
- 全專案 23 個測試檔案：1,257 項檢查通過，0 失敗。
- JavaScript 語法檢查：75/75 通過。

## 版本一致性
- `VERSION.txt`：v2.5.481
- HTML 資源查詢版本：2.5.481
- Service Worker runtime cache：ro-idle-runtime-v2.5.481
