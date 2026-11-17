# v2.5.460 Tamadora 自動戰鬥治癒

## 實裝內容
- Tamadora（`tamadora_egg`）親密度達非常親密（專案門檻 910）時，提供治癒術 Lv1 自動戰鬥技能。
- 預設啟用；戰鬥中場上至少有一隻存活怪物，且角色 HP 百分比小於或等於 70% 時施放。
- 寵物面板提供自動治癒開關與 HP 門檻設定（1%–99%）。
- 手動施放按鈕保留；手動與自動共用 `state.pet.manualSkillReadyAt` 的 4 秒冷卻。
- 沿用 `castSkill('heal', { free:true, forceLv:1 })`，不重複實作治療量，不消耗 SP。
- HP 已滿、HP 為 0、親密度不足、冷卻中、無存活怪物或自動治癒關閉時不施放。
- 設定寫入既有 `state.pet` 欄位，不重置角色或 LocalStorage；舊存檔缺少新欄位時使用預設值。

## 重要實作細節
- 自動施放掛在既有 `gameTick`，每次慢 tick 檢查一次。
- 僅對目前玩家攜帶的 Tamadora 生效；不會套用到隊友或其他寵物。
- 不會加入 `autoSupportSkills`，避免和角色原本的自動輔助技能設定混用。
- 自動治癒只在戰鬥中觸發，避免安全區或空場施法。

## 測試
- `tests/test_pet460_tamadora_auto_heal.js` 覆蓋預設啟用、70% 門檻、可調門檻、開關、手動／自動共用冷卻、戰鬥狀態、倒地、滿 HP、親密度及寵物種類限制。
