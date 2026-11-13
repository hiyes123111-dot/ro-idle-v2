# 目標增傷乘區稽核 v2.5.341

## 公式欄位對照

| 效果 | 資料鍵 | 計算路徑 |
|---|---|---|
| 全種族物理／魔法 | `allRaceDmgPct` | `cardTargetDmgMult()` 與 `skillBaseDamage()` |
| 指定種族物理 | `raceDmg_<race>` | `cardRaceDmgBonus` → `cardTargetDmgMult()` |
| 指定種族魔法 | `magicRaceDmg_<race>` | `skillBaseDamage(useMag)`，支援 `demihuman`→`humanoid`、`animal`→`brute` |
| 全體型物理 | `allSizeDmgPct`、舊鍵 `sizeDmg_all` | `weaponChainDamage()`，物理技能共用 |
| 指定體型物理 | `sizeDmg_<size>` | `cardSizeDmgBonus` → `cardTargetDmgMult()` |
| 全體型魔法 | `allSizeMagicDmgPct`、舊鍵 `magicSizeDmg_all` | `skillBaseDamage(useMag)` |
| 指定體型魔法 | `magicSizeDmg_<size>` | `skillBaseDamage(useMag)` |
| 所有階級通用物理／魔法 | `allTargetDmgPct` | 物理 `cardTargetDmgMult()`、魔法 `skillBaseDamage()` |
| 全階級物理 | `allClassDmg`、`allClassDmgPct` | 物理 `cardTargetDmgMult()` |
| 全階級魔法 | `allClassMagicDmg`、`allClassDmgMagic`、`magicAllClassDmgPct` | 魔法 `skillBaseDamage()` |
| BOSS 物理／魔法 | `bossDmgPct` | 依 `monDef.isBoss` 分別進入物理與魔法乘區 |

## 防止重複套用

- `allSizeMagicDmgPct` 不再於魔法公式中重複讀取；統一讀取位置只有一處。
- `allClassDmg` 明確維持物理專用，不會套用到魔法。
- `allTargetDmgPct` 是跨物魔的通用目標乘區；不應再把同一效果重複寫入 `allClass*`。
- 一般 `raceDmg_*`／`sizeDmg_*` 不會自動影響魔法，魔法需使用 `magicRaceDmg_*`／`magicSizeDmg_*`。

## 驗證限制

本稽核確認資料鍵到公式的靜態連線與語法，不代表所有資料庫道具描述均已逐項核對正確，也不替代遊戲內固定攻擊條件的傷害實測。特別是「全階級」與「所有階級」若描述實際指不同敵人分類，仍需有怪物分類欄位才能做精確區分；目前通用詞條按所有目標處理，BOSS 詞條按 `isBoss` 處理。
