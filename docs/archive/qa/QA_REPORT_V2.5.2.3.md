# V2.5.2.3 QA

## 修正
- bonus key canonicalization：patk / p.atk / p_atk -> pAtk；smatk / s.matk / s_matk -> sMatk。
- 正規化套用於裝備、卡片、套裝、遺物加成合併，以及 perBaseLv / perJobLv / perStat / perSkill 條件目標。
- 統一版本資料夾及 VERSION.txt 為 2.5.2.3。

## 驗證
- `node --check js/engine.js`：通過。
- `node tools/v2523_bonus_regression.js`：通過，涵蓋大小寫別名、條件式鍵名、混合鍵合併及傷害消費端。
- `node tools/v2_regression.js`：ALL PASSED，0 failures；31 equipment sets checked。

## 未宣稱完成
- POW／SPL 保留現有遊戲簡化換算；不是官方完整六項 Trait Status。
- STA／WIS／CON／CRT 尚未建立完整特性素質與傷害／防禦消費鏈。
- 尚未逐招校準全部職業技能對官方公式。
