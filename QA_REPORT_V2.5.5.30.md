# V2.5.5.30 技能增傷對照稽核

## 本次處理
- 以 V2.5.5.29 為基礎，重新掃描 `data.js` 全部 `skillDmg_*` 詞條與現有技能註冊表。
- 確認官方技能資料庫中的技能 ID 與本專案技能表不是同一件事：官方有技能 ID，不代表本專案已實作該技能或已有對應傷害結算。
- 保留已確認且目標技能確實存在的 8 個舊鍵對照；不把名稱相似但不同技能的詞條硬接到現有技能。
- 補上本輪稽核說明與回歸檢查，明確列出未支援詞條，避免後續誤判為已生效。

## 數量
- `skillDmg_*` 詞條：68
- 原生 ID／已設定相容對照：37
- 尚待遊戲內技能實作或語意確認：31

## 尚未接線的 31 個詞條
`banish`, `beastswing`, `burstsphere`, `carttornado`, `catnipmeteor`, `creationlight`, `crushstorm`, `destructcomet`, `dominion_brand`, `duple_light`, `dusklight`, `earthstrain`, `esma`, `evilspiritboom`, `fullmoonkick`, `great_blow`, `heavyrain`, `hundredspear`, `meteorfall`, `pickypeck`, `rollingcutter`, `roundtable`, `slaughterdance`, `soulexplosion`, `swing_axe`, `triangleshot`, `venomsplash`, `vulcanarm`, `whirlaxe`, `windcutter`, `wrathofgod`。

## 官方資料核對例
- Cart Tornado：`GN_CART_TORNADO`（官方技能 ID 2476）；本專案目前沒有相同技能 ID／技能本體，不能把它當成其他手推車技能。
- Rolling Cutter：`GC_ROLLINGCUTTER`（官方技能 ID 2036）；本專案目前沒有相同技能 ID／技能本體，不能把它掛到反擊斬或其他刀刃技能。
- Duple Light：`AB_DUPLELIGHT`（官方技能 ID 2054）；官方資料另有近戰與魔法子技能 ID，不能在沒有本專案傷害分流前直接合併。

## 安全性結論
這版不會宣稱 31 個待處理詞條已經生效，也不會新增猜測式 alias。這 31 個要真正完成，需逐一補齊本專案技能定義、職業可用性、傷害類型／公式及戰鬥結算入口，再以裝備實測回歸確認。保留現況比把增傷錯套到其他技能安全。
