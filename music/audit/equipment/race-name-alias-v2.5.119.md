# v2.5.119 種族名稱別名修正

## 問題
裝備詞條採用官方舊名稱 `animal`、`demihuman`，但本專案怪物資料的種族 enum 分別是 `brute`、`humanoid`。原本字串直接比對，造成相關物理增傷／承傷減傷／魔法增傷沒有命中目標。

## 修正
- `raceDmg_animal` → `raceDmg_brute`
- `raceDmg_demihuman` → `raceDmg_humanoid`
- `raceDmgReduce_animal` → `raceDmgReduce_brute`
- `raceDmgReduce_demihuman` → `raceDmgReduce_humanoid`
- 魔法種族增傷消費端額外讀取 `magicRaceDmg_demihuman`（humanoid）與 `magicRaceDmg_animal`（brute）。

## 邊界
沒有把 `animal` 映射到其他種族，也沒有改動 `formless`、`insect`、`plant` 等本來就一致的名稱。
