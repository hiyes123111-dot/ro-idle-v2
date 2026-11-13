# v2.5.359 裝備傷害乘區稽核

## 發現與修正
此前 `cardTargetDmgMult()` 的物理端與魔法公式都讀取 `allRaceDmgPct`，因此單一裝備若只描述「全種族物理傷害」卻使用這個共用鍵，會連魔法傷害也一起增加；反之亦然。為避免新裝備資料再產生這種跨乘區誤套，本版新增：
- `allRacePhysDmgPct`：僅物理傷害讀取。
- `allRaceMagicDmgPct`：僅魔法傷害讀取。

舊 `allRaceDmgPct` 保留共用行為，確保舊卡片／裝備相容。

## 本次資料修正
- `poenetentia_p_crown`（懺悔動力冠冕）：+13 全種族物理傷害+20% 改用 `allRacePhysDmgPct`。
- `poenetentia_s_crown`（懺悔靈氣冠冕）：+13 全種族魔法傷害+20% 改用 `allRaceMagicDmgPct`。
- `md_geffen_hood4`（暴力魔法披肩）：+9 全體型物理／魔法傷害+3% 已有分開的兩個鍵，確認不需變更。
- 時光超越者斗篷-LT、時光超越湧現鎧甲-LT、英雄吊墜相關物品：抽查全體型物理／魔法效果的欄位分流，保留現有資料。

## 驗證
- `js/data.js`、`js/engine.js`、`js/skills.js`、`js/jobs.js`、`js/ui.js` Node 語法檢查通過。
- 物理乘區有讀取 `allRacePhysDmgPct`；魔法乘區有讀取 `allRaceMagicDmgPct`。
- 舊 `allRaceDmgPct` 消費路徑保留。
