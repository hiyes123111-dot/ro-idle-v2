# P.ATK／S.MATK 稽核 v2.5.337

## 找到的根本問題

`recomputeDerived()` 原本只把 `floor(CON / 5)` 寫入 `state.pAtk` 與 `state.sMatk`，沒有把裝備、卡片、階級、附魔及套裝的固定加成併入角色面板。另一方面，`playerAtkMult()` 與魔法傷害計算雖有讀取裝備總表，卻同樣漏掉 CON 衍生值。造成畫面與實際傷害的 P.ATK／S.MATK 可能不完整。

## 修正

- `state.pAtk = floor(CON / 5) + getCardBonus('pAtk')`
- `state.sMatk = floor(CON / 5) + getCardBonus('sMatk')`
- 物理最終傷害改讀取 `state.pAtk` 加限時 P.ATK buff。
- 魔法最終傷害改讀取 `state.sMatk` 加限時 S.MATK buff。
- `canonicalBonusKey()` 已支援 `patk`／`pAtk`、`smatk`／`sMatk` 正規化，既有升階詞條可共用同一計算管線。

## 時光超越者之靴-LT A 階級

資料本身已設有 `itemGradeMin: "A"`，條件成立時給予 `patk: 7`、`smatk: 7`。本次修正的是引擎未把這些固定值合併到衍生面板／最終傷害的共通問題，不是把 A 階級效果改成無條件。

## 同類型範圍

本次共通修正涵蓋所有透過 `effectiveGearBonuses()` 合併的裝備本體、卡片、條件式加成、精煉成長、附魔與套裝 P.ATK／S.MATK 欄位。

## 驗證限制

`node --check js/engine.js` 通過。尚未在瀏覽器執行完整裝備互動測試；請以角色面板與實際傷害作最後驗證。
