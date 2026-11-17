# v2.5.459 Tamadora 手動技能介面

## 本輪完成
- 藍月羅莉露莉（`blue_moon_loli_ruri_egg`）：親密度有點親密以上，受到實際物理傷害時以 2% 機率自動施展霸邪之陣 Lv2；若角色已學會更高等級，使用已學會的較高等級。2% 依 Divine Pride 9140 item script 核對。
- 銀月魔女／羅莉露莉（`loli_ruri_egg`）：親密度有點親密時 1% 自動治癒術 Lv1，非常親密時 1% 自動治癒術 Lv2；依 Divine Pride 9042 item script 核對。只接近距離普通物理攻擊受擊，不把遠距離普攻或物理技能擴大納入。
- 月夜貓（`moonlight_egg`）：普通／有點親密／非常親密的物理攻擊觸發率分別為 1%／2%／3%，每秒 HP 恢復 300／400／500，持續 5 秒；依 Divine Pride 9112 item script 核對。因本作 SP 資源規則未接入，本輪只實裝 HP 部分，不恢復 SP。
- 受擊觸發接在 `engine.js` 的怪物物理技能與普通物理攻擊扣血節點；魔法攻擊不觸發，完全免傷／零實際傷害不觸發，玩家倒地時不觸發。
- Tamadora 親密度達到非常親密（專案門檻 910）時，寵物面板顯示「手動施放治癒術 Lv1」按鈕。
- 按鈕使用既有 `castSkill('heal', { free:true, forceLv:1 })` 技能結算，不另寫治療公式。
- 沿用治癒術 Lv1 的 4 秒冷卻；以寵物欄位 `manualSkillReadyAt` 保存冷卻時間，避免重整後可立即重複施放。
- HP 已滿時不施放；未達親密度門檻時不提供按鈕，也無法由直接呼叫繞過門檻。
- 寵物面板與特殊效果摘要同步標示手動治癒術已實裝。
- 不清除 LocalStorage、不重置角色、不改變既有寵物蛋 ID、背包數量或存檔欄位。

## 本輪未宣稱完成
- Blue Moon Loli Ruri 受物理傷害自動施展二級霸邪之陣：原始寵物資料未提供確切觸發率，暫不擅自設定。
- 月夜貓攻擊後持續恢復 HP／SP：原始資料只寫「有機率」，未提供確切觸發率，暫不擅自設定。
- 妖君 SP 吸收及其他機率型吸收／恢復：觸發率仍待官方資料核對。
- 小不點管理員指定地圖增傷：仍需補齊地圖與魔物對照。
- 寵物飾品技能、進化、野外自動捕捉：仍需獨立資料盤點與流程實裝。

## 測試
- `tests/test_pet459_pet_proc_completion.js`：驗證 Tamadora 手動技能、藍月羅莉露莉 2% 受擊霸邪、銀月魔女 1% 受擊治癒、月夜貓 1%／2%／3% HP 恢復、觸發門檻與版本摘要。
- 保留 v2.5.458 Tamadora 物理攻擊命中 1% 自動治癒測試。

## 資料核對來源
- Divine Pride Item 9042（Loli Ruri Egg）：1% 自動施展 Heal Lv1／Lv2。
- Divine Pride Item 9112（Moonlight Egg）：1%／2%／3% 觸發率及 300／400／500 HP 每秒、5 秒恢復。
- Divine Pride Item 9140（Blue Moon Loli Ruri Egg）：2% 自動施展 Kyrie Eleison Lv2，已學更高等級時套用較高等級。
