# 裝備全能力值加成修正稽核（v2.5.255）

## 發現
裝備資料中有四件裝備直接使用頂層 `allStat` 欄位，而不是 `bonus: { allStat: ... }`。舊版 `effectiveGearBonuses()` 只合併 `def.bonus`，因此這四件裝備的全能力值加成未進入 `getCardBonus()` 的加總路徑。

## 修正
在每件裝備的加成收集階段，將非零數值型 `def.allStat` 合併至總加成表。既有 `getCardBonus()` 已負責把 `allStat` 套用到 STR、AGI、VIT、INT、DEX、LUK，因此不需重複修改六個素質計算點。

## 受影響裝備
| 裝備 ID | 名稱 | 全能力值 |
|---|---|---:|
| `v2_rift_ring` | 裂隙核心戒指 | +1 |
| `v24_third_ring` | 三轉職業徽記 | +1 |
| `v24_fourth_armor` | 四轉星耀戰甲 | +1 |
| `v24_fourth_accessory` | 四轉核心徽章 | +2 |

## 範圍
未修改 AC-B44-OS-AD；未修改卡片、技能、其他裝備資料或其餘戰鬥公式。
