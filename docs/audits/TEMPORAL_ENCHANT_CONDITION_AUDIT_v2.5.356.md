# v2.5.356 裝備附魔條件引擎稽核

## 發現
時光超越者系列部分裝備的 `condBonus.when.withItems` / `withAnyItem` 將「餓熊威力、光速瞬移、無感肌肉、暴走魔法、犀利鷹眼、幸運之日」寫成效果 ID。這些並非獨立 ITEMS 道具 ID，而是附魔／特殊效果名稱。舊版 `buildLoadout()` 只收集實際裝備 ID 與卡片 ID，`condMet()` 的 `withItems` 只查 `lo.items`，因此這類條件無法命中。

## 修正
- `buildLoadout()` 新增 `enchants: Set`，逐件收集 `instance.enchant`。
- 新增 `hasEquippedItemOrEnchant()`，讓 `withItems` 和 `withAnyItem` 同時辨識實際裝備與附魔 ID。
- `withCards` 維持只比對卡片 ID，避免把附魔誤判成卡片。
- 不改動任何效果數值。

## 範圍限制
- 裝備實例已有 `enchant` 欄位，耶斯卡夫頭冠附魔流程會寫入此欄位。
- 目前 UI 的附魔選擇入口只支援耶斯卡夫頭冠。時光超越者戒指／斗篷附魔入口、對應材料定義與取得來源尚未完整，因此本版不能宣稱玩家已能在 UI 中實際選擇上述附魔。
- 未新增虛構材料、掉落來源或附魔成功率。

## 驗證
- `js/data.js`、`js/engine.js`、`js/ui.js` Node 語法檢查通過。
- 已確認引擎條件路徑會將裝備實例 enchant ID 納入 `withItems` / `withAnyItem` 判斷。
