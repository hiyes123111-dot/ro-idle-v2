# v2.5.117 舊版全體型物理增傷鍵

`sizeDmg_all` 會被舊版前綴分流表收進 `cardSizeDmgBonus.all`，但原本消費端只查怪物實際體型 small／medium／large，導致 `all` 永遠不會命中。

修正：在物理共用武器傷害鏈讀取 `getCardBonus('sizeDmg_all')`，與 `allSizeDmgPct` 相加。魔法傷害不套用此舊鍵，以免擴大效果語意。
