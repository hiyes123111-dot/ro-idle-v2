# v2.5.118 暗屬性鍵別名修正

怪物定義使用 `element: 'shadow'`，但部分舊裝備／卡片詞條使用 `eleDmg_dark`。原本按字面分桶後，`cardTargetDmgMult()` 只查 `shadow`，導致 `dark` 桶永遠不命中。

修正 bonus 分桶時將 `eleDmg_dark` 與 `eleReduce_dark` 正規化為 `shadow`。新舊鍵同時存在時會正常相加；不改動怪物屬性定義。
