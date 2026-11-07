# 神器鑄造師 NPC 入口恢復 — v2.5.107

## 稽核結論
- 神器配方系統本身沒有被刪除：`js/v2_artifacts.js` 仍保留七件神器配方、材料檢查、鋅幣扣除與製作流程。
- 神器工坊原本仍可由「神器」分頁開啟，但安全區「城鎮 NPC」清單只列出 `NPC_SHOPS` 商店，沒有把神器鑄造師列為 NPC，因此玩家會感覺 NPC 被移除。
- 原本神器鑄造師圖示 `images/npc/artifact_blacksmith.svg` 與配方頁仍存在。

## v2.5.107 修正
- 安全區城鎮 NPC 清單新增「🏺 神器鑄造師」卡片。
- 點擊後呼叫 `talkToArtifactBlacksmith()`，切換到既有 `artifacts` 分頁並顯示 NPC 對話提示。
- 野外呼叫時拒絕開啟；神器製作仍維持 Base Lv.200 門檻。
- 不更動七件配方、材料數量、製作費用與既有材料掉落來源。

## 驗證
- `tools/v25107_artifact_npc_regression.js`：6 assertions passed。
- 全專案 58 個 JavaScript 檔案 `node --check`：0 syntax errors。
- 尚未進行瀏覽器實際點擊測試；需要在遊戲中進入安全區確認 NPC 卡片的視覺呈現。
