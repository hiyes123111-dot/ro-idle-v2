# V2.5.5.4 — 舊裝備技能增傷別名修正 QA

## 本版修正
- 補上舊裝備技能增傷欄位與現有技能 ID 的明確對照：
  - `skillDmg_tigercannon` → `sr_rampage`（虎砲）
  - `skillDmg_cannonattack` → `gn_cartcannon`（手推車加農砲）
  - `skillDmg_axe_tornado` → `me_tornado`（龍捲風斧）
  - `skillDmg_swing_axe` → `me_axeboom`（斧頭迴旋）
  - `skillDmg_crimson_rock` → `wl_crimsonrock`（碧血隕石）
- 完整技能 ID 的加成優先於舊短名，避免同一詞條重複計算。
- 其餘無法由現有技能資料直接確認的名稱不做猜測式映射。

## 測試結果
- `node --check js/engine.js`：通過。
- `node tools/v255_skill_alias_regression.js`：5 組舊名映射及完整 ID 優先順序通過。
- `node tools/v2_regression.js`：ALL PASSED，0 failures；31 組裝備套裝檢查通過。

## 尚未完成
- 尚有部分舊裝備 `skillDmg_*` 名稱沒有對應至現有技能 ID，仍需依職業技能表補齊或確認是否為不同版本技能名。
- 本版只驗證技能增傷欄位的讀取與映射，不代表所有技能的實際傷害公式、冷卻、SP 消耗及職業平衡已完成全面實戰驗收。
