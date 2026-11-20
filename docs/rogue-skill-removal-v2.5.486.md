# v2.5.486 深淵追跡者與技能移除稽核

## 烈火戰車移除
- 使用者明確要求移除「烈火戰車 Full Throttle」。
- 已從 `js/v2_7_rogue_skill_rebuild.js` 的魅影追蹤者技能陣列移除，故不會建立 `SKILLS.sc_fullthrottle`，也不會進入技能樹、圖鑑及搜尋來源。
- 舊存檔若有 `learnedSkills.sc_fullthrottle`，`loadGame()` 會刪除此欄位並將已投入等級退還至 `jobSkillPoints.shadowchaser`；同時清除自動技能欄位、自動輔助設定、冷卻與殘留增益。隊友快照同步清理。舊存檔其他技能、寵物、背包與 LocalStorage 不受影響。

## 深淵追跡者熟練被動實際效果
- 影片在 00:60 附近明確顯示「短劍與弓熟練 Dagger & Bow Mastery」：被動、最高 Lv10、ATK +3／級。
- 影片在 00:65 附近明確顯示「魔劍熟練 Magic Sword Mastery」：被動、最高 Lv10、ATK +3／級。
- 兩者均使用 `passiveStat:'atkFlat'`，由 `passiveSourceSkills()` 及 `recomputeDerived()` 實際加入 `state.atk` 與 `_atkMastery`，不是只有說明文字。
- 短劍與弓熟練有 `requiresWeapon:'dagger_bow'`，使用既有 `weaponReqMet()`；影片描述對應短劍／弓類武器。
- 魔劍熟練依影片沒有標示額外武器限制，故不額外增加武器 gate。

## 測試
- 技能資料庫不再存在 `sc_fullthrottle`。
- 魅影追蹤者技能樹不再包含 `sc_fullthrottle`，其餘技能 ID 保持不變。
- 深淵追跡者兩項熟練 Lv10 的 runtime ATK 加成經測試：無武器時只有魔劍熟練 +30；裝備弓時兩項合計 +60（不含弓本身 ATK）。
- 深淵殺手 Lv10 經正常 castSkill 流程測試，實際套用 ATK ×1.6，持續 90 秒。
- 舊存檔遷移測試確認移除 LvN 烈火戰車時返還 N 點至 shadowchaser 點數池，並清除自動施放欄位、冷卻與殘留增益。
- 不修改深淵追跡者 16 招影片倍率及 SP／冷卻設定。

## 版本
- `VERSION.txt`、HTML 資源查詢版本、Service Worker runtime cache：v2.5.486。
