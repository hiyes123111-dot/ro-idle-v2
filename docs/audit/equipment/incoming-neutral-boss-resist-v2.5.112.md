# 無屬性與 BOSS 承傷減免 — v2.5.112

已接入 `neutralDmgResistPct` 與 `bossDmgResistPct`：
- 怪物普通攻擊：依怪物攻擊屬性是否為 none、`isBoss` 判斷。
- 怪物技能攻擊：依技能攻擊屬性（`sk.elem`，否則怪物屬性）及 `isBoss` 判斷。
- 百分比為裝備加成總和，乘算前下限為 0，避免超過 100% 造成反向傷害。

未處理 `rangedDmgResist`：目前怪物基本攻擊與技能資料尚需確認遠近距離標記，不能將玩家武器的遠距離判斷錯套在怪物攻擊上。
未處理 `allClassDmg`：怪物資料沒有清楚的階級欄位，不能把 `isBoss` 當成一般／首領階級的完整分類。
