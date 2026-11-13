# 六大特性衍生能力稽核 v2.5.344

## 官方對照
- POW：每點 Status ATK +5；每3點 P.ATK +1。
- STA：每點 RES +1；每3點再 RES +5。
- WIS：每點 MRES +1；每3點再 MRES +5。
- SPL：每點 Status MATK +5；每3點 S.MATK +1。
- CON：每點 HIT +2、FLEE +2；每5點 P.ATK +1、S.MATK +1。
- CRT：每點 H.PLUS +1；每3點 C.RATE +1（C.RATE 是暴擊傷害比例，不是 CRI 發生率）。

## 本版修正
先前 `state.pAtk` 只計算 CON/5 與裝備固定值，漏掉 POW/3；`state.sMatk` 只計算 CON/5 與裝備固定值，漏掉 SPL/3。已補入兩項衍生值。

## 目前限制
`traitStats` 的來源是 `effectiveGearBonuses()` 中的 POW／STA／WIS／SPL／CON／CRT bonus。新角色 state 尚無獨立六大特性投資欄位，也沒有 T.Status Point 配點 UI；本次沒有假裝已完成角色配點系統。

## 回歸公式
- POW=30、CON=10：P.ATK 衍生 = 10 + 2 = 12。
- SPL=30、CON=10：S.MATK 衍生 = 10 + 2 = 12。
- STA=30：RES = 30 + 10*5 = 80。
- WIS=30：MRES = 30 + 10*5 = 80。
- CRT=30：H.PLUS=30、C.RATE=10。
