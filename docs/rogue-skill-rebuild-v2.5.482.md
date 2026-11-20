# RO Idle v2.5.482 流氓系三轉／四轉技能重建報告

## 基底與修改範圍
- 修改基底：完整 v2.5.481 專案。
- 三轉：魅影追蹤者（Shadow Chaser）。
- 四轉：深淵追跡者（Abyss Chaser）。
- 不重置玩家 LocalStorage／角色存檔；保留流氓、神行太保前職技能資料與繼承關係。
- 新增的技能 runtime 檔案放在 `js/`；測試放在 `tests/`；本報告放在 `docs/`。

## 影片與官方比對
- 使用者影片技能圖鑑顯示深淵追跡者篩選共 46 個技能項目，包含前職技能與三、四轉技能。
- 官方 TWRO 資料庫：魅影追蹤者本職技能 23 招；深淵追跡者本職技能 16 招。
- 本次三轉實裝 23 招官方技能，另加影片列出的本服額外被動「影之修練」1 招。
- 本次四轉重建 16 招。
- 前職流氓／神行太保技能不重複複製；沿用原有借用技能機制。

## 三轉：魅影追蹤者
| 技能 ID | 名稱 | Lv | 本作處理 |
|---|---|---:|---|
| sc_reproduce | 繁殖 | 10 | 技能欄位；複製技能槽待實作 |
| sc_shadowform | 魅影形態 | 5 | 技能欄位；玩家傷害轉嫁待實作 |
| sc_fatalmenace | 致命威脅 | 10 | 範圍物理；影片倍率 300%～930% |
| sc_bodypainting | 人體彩繪 | 5 | 技能欄位；黑暗／攻速異常待實作 |
| sc_triangleshot | 三角射擊 | 10 | 弓專用單體物理；影片倍率 300%～840% |
| sc_manhole | 人孔 | 3 | 技能欄位；地面拘束待實作 |
| sc_divestaccessory | 卸除配件 | 5 | 技能欄位；怪物裝備欄位不存在 |
| sc_autoshadowspell | 自動魅影念咒 | 10 | 技能欄位；複製技能觸發槽待實作 |
| sc_masquerade_enervation | 面具：無力 | 3 | 技能欄位；異常效果待實作 |
| sc_masquerade_gloomy | 面具：憂鬱 | 3 | 技能欄位；異常效果待實作 |
| sc_masquerade_ignorance | 面具：無知 | 3 | 技能欄位；異常效果待實作 |
| sc_chaos_panic | 混沌恐慌 | 3 | 技能欄位；地面混亂待實作 |
| sc_dimensionaldoor | 異次元之門 | 3 | 技能欄位；地圖傳送待實作 |
| sc_deadlyinfection | 致命感染 | 5 | 技能欄位；異常反射待實作 |
| sc_masquerade_laziness | 面具：懶散 | 3 | 技能欄位；異常效果待實作 |
| sc_masquerade_weakness | 面具：衰弱 | 3 | 技能欄位；異常效果待實作 |
| sc_emergencyescape | 緊急脫身 | 5 | 技能欄位；位移待實作 |
| sc_feintbomb | 虛擊炸彈 | 3 | 範圍物理；影片 Lv3、500%～800% |
| sc_bloodylust | 血腥欲望 | 3 | 技能欄位；地面狂暴待實作 |
| sc_masquerade_unlucky | 面具：不幸 | 3 | 技能欄位；異常效果待實作 |
| sc_invisibility | 透明術 | 5 | FLEE +50%～90%，持續 10～26 秒 |
| sc_maelstrom | 漩渦 | 3 | 技能欄位；地面魔法攔截待實作 |
| sc_fullthrottle | 烈火戰車 | 5 | ATK +10%～50%，持續 30～70 秒 |
| sc_shadowtraining | 影之修練 | 5 | 影片額外技能；常駐 FLEE +6～30 |

## 四轉：深淵追跡者
| ID | 技能 | Lv | SP | 冷卻 | 本作倍率／效果 |
|---|---|---:|---:|---:|---|
| v25_abyss_chaser_1 | 短劍&弓弩精熟 | 10 | 0 | 0 | ATK +3／級 |
| v25_abyss_chaser_2 | 突擊滑行 | 5 | 40～56 | 4s | ATK 700%～1300% |
| v25_abyss_chaser_3 | 追擊突斷 | 5 | 40～56 | 4s | 全體 ATK 700%～1300% |
| v25_abyss_chaser_4 | 深淵匕首 | 5 | 28～40 | 2s | 暗屬 ATK 700%～1500% |
| v25_abyss_chaser_5 | 不幸衝擊 | 5 | 40～56 | 4s | ATK 700%～1300% |
| v25_abyss_chaser_6 | 靈巧刺擊 | 10 | 26～53 | 2s | ATK 600%～1550% |
| v25_abyss_chaser_7 | 深淵殺手 | 10 | 80 | 60s | ATK +10%～60%，40～90s |
| v25_abyss_chaser_8 | 魔劍精熟 | 10 | 0 | 0 | ATK +3／級 |
| v25_abyss_chaser_9 | 萬丈深淵 | 5 | — | — | AP／深淵武器狀態待實作 |
| v25_abyss_chaser_10 | 深淵墳場 | 5 | 50～74 | 3s | 暗屬 MATK 700%～1300% |
| v25_abyss_chaser_11 | 深淵之焰 | 5 | — | — | 官方雙區域多段效果待實作 |
| v25_abyss_chaser_12 | 終結深淵攻擊 | 10 | 50～95 | 2s | 暗屬 MATK 900%～2300% |
| v25_abyss_chaser_13 | 卸除影子 | 5 | — | — | 怪物裝備欄位不存在，待實作 |
| v25_abyss_chaser_14 | 追襲射擊 | 5 | 40～56 | 4s | 弓專用 ATK 700%～1300% |
| v25_abyss_chaser_15 | 連鎖射擊 | 5 | 40～56 | 4s | 弓專用全體 ATK 700%～1300% |
| v25_abyss_chaser_16 | 狂暴射擊 | 10 | 30～57 | 2s | 弓專用 2 段，每段 ATK 700%～1650%；暴擊傷害加成減半 |

## 重複技能與卡片相容性
- 舊版三轉只有 3 個簡化技能；以正式三轉技能清單覆寫同 ID 的致命威脅、魅影形態、漩渦，避免同名重複。
- `v2_content.js` 原先建立的 3 個示範四轉技能 `v2_ac_abyss_flame`、`v2_ac_void_spear`、`v2_ac_void_attunement` 已移除，避免圖鑑搜尋出現假技能。
- 四轉技能仍使用 `v25_abyss_chaser_10`（深淵墳場）與 `v25_abyss_chaser_11`（深淵之焰），維持 EP21 蘿拉卡片既有武器／頭冠精煉加成鍵。
- 流氓／神行太保前職技能沿用 `borrowSkillsFrom`，不另建重複 ID。

## 尚未模擬的官方機制
- AP、地面座標、角色位移、玩家間傷害轉嫁、怪物裝備剝除、複製技能槽、面具異常、異常反射及地面魔法攔截等，本作目前沒有完整對應系統。
- 上述技能仍列入技能樹與技能資料庫，但明確標記待實作；沒有用虛構的效果代替官方機制。
- 狂暴射擊以本作 2 段連射結算；官方機率追加第 3 段尚未接入。

## 驗證
- 新增 `tests/test_rogue_skill_rebuild_482.js`：24 項檢查，涵蓋技能 ID、技能樹、重複、倍率、技能等級、前職繼承與 EP21 卡片連結。
- 全專案 24 個測試檔案：1,281 項檢查通過，0 失敗。
- JavaScript 語法檢查：76/76 通過。
- 另行通過四轉被動技能稽核。
- HTML 資源查詢版本、Service Worker runtime cache、VERSION.txt 同步為 2.5.482。
