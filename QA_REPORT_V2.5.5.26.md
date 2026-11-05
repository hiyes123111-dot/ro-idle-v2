# QA Report — V2.5.5.26

## 修改範圍
- 移除自動戰鬥分頁的弓箭手被動觸發統計 UI。
- 移除統計資料計數函式、戰鬥流程中的統計呼叫及角色狀態初始化欄位。
- 保留被動技能觸發機率、冷卻、傷害與陷阱效果。

## 靜態檢查
- 確認 `rangerProcStats`、`recordRangerProc`、`resetRangerProcStats`、`rangerProcStatsMarkup`、`updateRangerProcStatsLive` 不再出現在執行程式碼。
- 確認自動戰鬥頁面不再產生統計區塊。
- 確認被動觸發判定及冷卻設定仍保留。
