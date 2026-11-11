# v2.5.116 元素／種族／體型耐性與經驗加成

## 本次接線
- `eleDmgReduce_all`：所有元素承傷減免。
- `earthDmgResistPct`：僅地屬性攻擊承傷減免。
- `raceDmgResist_all`：所有種族承傷減免。
- `sizeDmgResist_all`：所有體型承傷減免。
- `sizeResist_large`：僅大型怪物攻擊承傷減免。
- `expGainPct`：一般與職業經驗加成，線上擊殺、離線結算共用。

## 安全性
- 普通攻擊與技能攻擊都套用承傷詞條。
- 通用與指定耐性在各自類別內相加，最低傷害倍率不低於 0。
- 地屬性與大型體型詞條只在攻擊者符合條件時生效。
- `allClassDmg` 保留待處理，沒有將 BOSS 標籤冒充階級分類。
