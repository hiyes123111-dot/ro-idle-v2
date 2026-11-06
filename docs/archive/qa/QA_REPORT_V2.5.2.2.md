# V2.5.2.2 QA 報告

## 修正內容
- POW：每 1 點轉換為 Status ATK +5。
- SPL：每 1 點轉換為 Status MATK +5。
- P.ATK：作為最終物理傷害百分比乘區，納入 playerAtkMult，作用於一般物理攻擊及共用物理技能鏈。
- S.MATK：作為最終魔法傷害百分比乘區，納入 skillBaseDamage 的魔法分支。

## 驗證
- `node --check js/engine.js`：通過。
- `node tools/v2_regression.js`：ALL PASSED，0 failures；31 equipment sets checked。

## 限制
- 此次補齊的是本遊戲目前已存在的 POW、SPL、P.ATK、S.MATK 裝備加成鍵的消費端，不代表完整重建 RO 官方六項 Trait Status（POW/STA/WIS/SPL/CON/CRT）配點系統。
- 特殊技能若自行繞過共用 `skillBaseDamage` 而直接計算 MATK，仍需獨立核對；本次不宣稱所有職業技能公式已逐招與官方逐項校準。
