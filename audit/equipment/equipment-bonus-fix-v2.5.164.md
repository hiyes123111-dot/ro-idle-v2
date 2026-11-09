# 裝備附加能力修正 v2.5.164

- `magicIgnoreDef`：變幻莫測魔術斗篷的通用魔法防禦無視，正規化至 `mdefIgnorePct`，由既有 `defOf(..., magic=true)` 入口處理；適用一般與 BOSS 目標。
- `allClassDmg`：天秤座寶冠「對所有階級敵人的物理傷害」由 `cardTargetDmgMult()` 獨立讀取。刻意不映射到 `allTargetDmgPct`，避免錯誤增加魔法傷害。
- `autoSpellWindcutter`：保留待確認。v2.5.163 的 SKILLS/engine 中沒有可確認的風壓飛刃技能定義或 ID，不猜測對應技能，因此不加入錯誤觸發。
- 詠唱欄位不列入待修復；本作法術皆為順發。技能後延遲仍依使用者決定排除。
