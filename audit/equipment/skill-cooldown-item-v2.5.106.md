# 裝備專屬技能冷卻稽核 v2.5.106

## 發現
資料庫存在 `skillCd_<skillId>` 格式的裝備詞條，但 `effectiveCooldownMs()` 原先只讀取 `skillCdFlat` 與 `skillCdFlat_<skillId>`，因此裝備專屬冷卻效果不會生效。

## 修正
- 新增 `skillCooldownItemBonus(skillId)`，讀取 `skillCd_<skillId>`。
- 將現有舊資料 `skillCd_tigercannon` 映射到實裝技能 `v2_in_tiger_cannon`（猛虎砲）。
- 冷卻計算現在合併全技能秒數、指定技能秒數、裝備指定技能秒數，再套用技能冷卻百分比。
- 保留 500ms 最低冷卻保護。
- 以塔諾斯拳套-AD +7 的虎炮冷卻 -1 秒作為驗證案例。

## 尚待技能本體實裝的舊詞條
- `skillCd_carttornado`：資料描述手推車龍捲風，但目前技能表未找到對應技能。
- `skillCd_diamond_dust`：資料描述鑽石星塵，但目前技能表未找到對應技能。
- `skillCd_holy_spear`：資料描述聖槍刺擊，但目前技能表未找到對應技能。
以上三項保留原始資料，暫不映射到名稱相似但不同的技能，避免錯誤減少其他技能冷卻。

## 驗證
- 新增專項測試 9/9 通過。
- 仍需遊戲內裝備塔諾斯拳套-AD +7，確認猛虎砲冷卻從原始值減少 1 秒；若冷卻低於 0.5 秒，依設計保留 0.5 秒下限。
