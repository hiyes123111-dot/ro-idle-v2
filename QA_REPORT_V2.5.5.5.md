# V2.5.5.5 技能增傷別名 QA

## 本次修正
- `tigercannon` → `v2_in_tiger_cannon`（審判者：猛虎砲）
- `axe_tornado` → `v2_me_tornado_swing`（機匠：迴旋重斬）
- `crimson_rock` → `v2_am_crimson_rock`（大法師：緋紅岩爆）
- 移除未註冊的舊目標 ID，並限制別名目標必須存在於 `SKILLS` 才能套用。
- 未確認的 `cannonattack`、`swing_axe` 不再套用到猜測的技能。

## 驗證
- `node --check js/engine.js`：PASS
- `node --check tools/v255_skill_alias_regression.js`：PASS
- `node tools/v255_skill_alias_regression.js`：PASS（3 個目標均存在、完整 ID 優先、未知別名隔離）
- `node tools/v2_regression.js`：PASS（13 個四轉職業、技能、裝備及存檔回歸；31 組裝備套裝，0 失敗）
- `node tools/v255_asset_regression.js`：PASS（19/19 裝備圖片、8/8 怪物圖片）

## 範圍限制
本版只修正三個可對應到目前真實技能定義的舊詞條。未確認的其他裝備技能詞條仍待逐項查證，不代表所有舊裝備技能增傷已完成。V1.17 未修改；本版尚未推送 GitHub。
