# V2.5.5.7 技能增傷對照補強

## 本次修正
- `skillDmg_cannonattack` → `gn_cartcannon`（手推車加農砲）。
- `skillDmg_heavymetal` → `mi_soundblend`（重金屬音浪）。
- 對照目標均已存在於 `SKILLS`，且詞條名稱與技能中文名稱可直接確認。
- 未對其餘未確認詞條建立猜測性別名。

## 覆蓋率
- 裝備技能增傷詞條：68 種
- 已註冊／已驗證對照：34 種
- 尚未對應：34 種

## 驗證
- `node --check js/engine.js`：PASS
- `node --check tools/v255_skill_alias_regression.js`：PASS
- `node tools/v255_skill_alias_regression.js`：PASS（5 組別名）
- `node tools/v255_skill_bonus_coverage.js`：PASS（所有已設定別名目標存在）
- `node tools/v2_regression.js`：PASS，31 組裝備套裝，0 failures
- `node tools/v255_asset_regression.js`：PASS（19/19 裝備圖、8/8 怪物圖）

## 限制
本版補的是既有技能本體的裝備增傷對照，並未宣稱其餘 34 個缺失技能已完成。V1.17 未修改；尚未推送 GitHub。
