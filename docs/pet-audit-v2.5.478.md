# RO Idle v2.5.478 寵物兌換券交易安全修正報告

## 基底與修改範圍
- 基底：使用者提供的 v2.5.477 專案副本。
- 本次只修正 `js/v2_5_456_pet_system.js` 中 `usePetItem()` 的寵物兌換券流程。
- 不修改寵物系統第 1～8 項、不新增野外自動捕捉、不修改玩家存檔格式、不重置 LocalStorage。
- v2.5.477 原始資料夾保持不變；修正與打包在獨立 v2.5.478 副本中完成。

## 問題
舊流程在扣除兌換券時未檢查 `removeItem()` 的回傳結果，扣除失敗仍會呼叫 `addItem()` 發放寵物蛋，因此可能造成沒有兌換券卻領到寵物蛋。

## 修正
1. 確認兌換券與目標寵物蛋均已建檔。
2. 先透過 `getItemQty()` 確認至少持有 1 張兌換券。
3. 加入同步兌換鎖，阻擋重入呼叫造成重複兌換。
4. 只有 `removeItem(coupon, 1)` 明確回傳 `true` 才發放寵物蛋。
5. 發蛋操作失敗時，嘗試退回兌換券；失敗交易不呼叫存檔。
6. 成功時只扣 1 張券、增加 1 顆對應寵物蛋，並儲存。

## 七種實際兌換資料驗證
| 兌換券 | 目標寵物蛋 | ITEMS 建檔 |
|---|---|---|
| succu_pet_coupon | succubus_egg | 兩者皆存在 |
| imp_pet_coupon | imp_egg | 兩者皆存在 |
| chung_e_pet_coupon | chung_e_egg | 兩者皆存在 |
| elephant_ticket | elephant_egg | 兩者皆存在 |
| gorilla_ticket | gorilla_egg | 兩者皆存在 |
| lion_ticket | lion_egg | 兩者皆存在 |
| rhino_ticket | rhino_egg | 兩者皆存在 |

## 測試
- 新增 `tests/test_pet478_coupon_exchange.js`：8 項測試，涵蓋缺少兌換券、扣除失敗、發蛋失敗回補、成功一對一兌換、重複兌換、七種兌換券及重入呼叫。
- 全專案 21 個 `test_*.js` 測試檔案：1,235 項檢查通過，0 失敗。
- JavaScript 語法檢查：75/75 通過。
- 30 天／1,000 次循環寵物壓力測試：7 項通過；133 種寵物 × 3 階段共 399 組。
- HTML 本地資源缺失：0；重複 Script：0。
- HTML 查詢版本、Service Worker runtime cache、VERSION.txt：全部為 2.5.478。
- 專案內暫存／快取資料夾：0。
- ZIP 完整性：打包後執行檢查。

## 未宣稱完成的項目
Android Chrome 真機長時間背景掛機、省電模式與實際伺服器延遲仍需人工驗收；自動化測試不能代替真機測試。
