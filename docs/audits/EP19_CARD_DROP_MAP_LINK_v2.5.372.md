# v2.5.372 EP19 卡片掉落與地圖連動稽核

## 已接通
| 卡片 | 掉落魔物 | 魔物 ID | 掉率 | 地圖 |
|---|---|---:|---:|---|
| 艾佩勒蜈蚣卡片 | 艾佩勒蜈蚣 | 21952 | 0.01% | mjo_wst01 |
| 紫樹精卡片 | 紫樹精 | 21954 | 0.01% | mjo_wst01 |
| 最下級蠕蟲卡片 | 最下級蠕蟲 | 21527 | 0.01% | jor_dun02 |
| 中級蠕蟲卡片 | 中級蠕蟲 | 21529 | 0.01% | jor_dun02 |

## 資料欄位
- Monster definitions include verified twRO level, HP, base attack, DEF, MDEF, hit, flee, race, size, and element.
- Base/job EXP are set to 0 because the twRO source pages show no published EXP values; no foreign-server EXP values are copied.
- Verified normal drops are included where the local item registry already has matching item keys.
- Monster card drops are connected through `MONSTER_CARD_DROPS`; card records now point to the corresponding monster IDs.

## 地圖範圍限制
- mjo_wst01 currently includes the two card-source monsters (Aferde, Timbers); Punch Bug, Dispol, and Renire remain pending.
- jor_dun02 currently includes the two card-source monsters (Lowest Rgan, Middle Rgan); Lower Rgan and Heart Hunter AT remain pending.
- The map descriptions explicitly disclose these omissions. This is not represented as a complete spawn roster.

## References
- https://ragnaplace.com/zh-t/twro/mob/21952/21952
- https://ragnaplace.com/zh-t/twro/mob/21954/21954
- https://ragnaplace.com/zh-t/twro/mob/21527/21527
- https://ragnaplace.com/zh-t/twro/mob/21529/21529
- https://ragnaplace.com/zh-t/twro/map/mjo_wst01
- https://ragnaplace.com/zh-t/twro/map/jor_dun02

## Validation
- All new map monster references resolve.
- All four card references resolve in ITEMS and CARDS.
- All four `MONSTER_CARD_DROPS` entries resolve and use 0.0001.
- No duplicate monster IDs or map IDs introduced.
