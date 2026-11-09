# 全屬性魔法傷害詞條 — v2.5.111

## 發現
裝備資料使用 `allEleDmg` 表示全屬性魔法傷害，例如超時空頭冠、狸貓變身樹葉-LT、自動光碟、星際咒術徽章、月之護符、天地樹的信仰、天龍藍鎧甲等。既有魔法傷害鏈讀取 `magicDmgPct`、`magicRaceDmg_*`、`magicSizeDmg_*` 等欄位，卻沒有讀取 `allEleDmg`。

## 修正
在 `skillBaseDamage(useMag, ...)` 的魔法分支，將 `getCardBonus('allEleDmg')` 加入通用魔法傷害百分比乘區。所有屬性的魔法技能均受影響；物理技能與普通攻擊不受影響。

## 邊界
`allClassDmg` 等其他語義不同的欄位不在本次修正範圍，需先釐清遊戲內「階級」定義與怪物資料映射再處理。
