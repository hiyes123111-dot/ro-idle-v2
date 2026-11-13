# 樞機主教輔助技能稽核 v2.5.343

## 本次確認與修正

1. `cd_presens_acies`（爆裂聖光）描述為暴擊傷害提升，但舊版錯誤推入 `crit`（暴擊率）buff。已改為 `critdmg`，由 `recomputeDerived()` 合併至 `state.cardCritDmgPct`，供普攻及支援暴擊的技能共用。
2. `cardinal_support` 共用 `push()` 現在依 `skillId + type` 刷新同類子效果。相同技能重施會刷新該子效果，不同技能的相同類型 buff 仍可並存；同一技能包含多個不同子效果時，不會互相刪除。
3. `physicalStats`、`magicStats`、`competentia`、`mresIgnore`、`resIgnore`、`medialeHot` 的效果入口已檢查；`competentia` 的 P.ATK／S.MATK 透過 `pAtk`／`sMatk` flatBonus 供傷害公式讀取。
4. `forEachPartyMate()` 會在玩家與隊友狀態間切換後執行回復／buff，存活隊友才列入；`competentia` 的回復使用當前切換後的 state，因此各自依自身 maxHP 計算。

## 尚未宣稱完成的部分

- 目前四轉六大特性 POW／CRT／CON／SPL／WIS／STA 並非完整獨立的角色面板欄位；現有技能資料採用 ATK、暴擊率、HIT、MATK、MDEF、DEF 對應呈現。此對應不是官方六大特性原生面板的完整模擬。
- 仍需瀏覽器內實際測試：爆裂聖光施放前後暴擊傷害、同技能重施刷新、不同技能 buff 共存、玩家與隊友分別施放、持續時間到期。
- 本次未擅自填入未核實的四轉技能 SP 消耗數值；技能資料既有 `spCost` 保持原樣。遊戲設定為有 SP／MSP、沒有 AP。

## 靜態回歸檢查

- `cd_presens_acies` 必須呼叫 `pushParty('critdmg', 1, value)`。
- 不可呼叫 `pushParty('crit', 1, value)` 作為爆裂聖光效果。
- buff 去重條件必須同時比對 `skillId` 與 `type`，避免多子效果技能只留下最後一個 buff。
- `node --check js/engine.js` 與 `node --check js/skills.js` 通過。
