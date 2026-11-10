# 150 等以上武器附加能力接線稽核 v2.5.246

## 範圍
- 以 `ITEMS` 執行期資料篩選 `type === 'weapon' && reqLevel >= 150`。
- 共 454 把；逐項盤點頂層欄位、`bonus`、`condBonus`、`perRefine`、`perRefineSquare`、`per1Refine`、`per2Refine`、`per3Refine`、`per4Refine`、`per5Refine` 等欄位。

## 本次找到的明確接線缺漏
- `ac_b44_ad`（AC-B44-OS-AD十字弓 [2]）將「遠距離物理傷害 +7%」存於頂層 `rangedDmgPct: 7`，而不是 `bonus.rangedDmgPct`。
- `equippedStatBonus()` 不讀百分比傷害欄位；`effectiveGearBonuses()` 原本也未將此頂層欄位併入總表，因此普攻與技能讀取 `getCardBonus('rangedDmgPct')` 時會漏掉這 7%。
- v2.5.246 在 `effectiveGearBonuses()` 補上頂層 `rangedDmgPct` 正規併入，普攻與技能沿用既有遠距離傷害計算入口。
- 精煉 +7 攻速 +10% 原本已存在於 `condBonus`，本次保留不變。

## 保留未宣稱完成的項目
- AC-B44 說明另列精煉 +9／+11 三角射擊傷害，但目前技能資料中未找到三角射擊技能本體；沒有憑空新增技能或將傷害加成轉接到其他技能。

## 驗證
- 454 把 150 等以上武器資料可正常載入。
- 22 個 JavaScript 檔案 `node --check` 通過。
- AC-B44 回歸測試：頂層遠距離 +7% 接線存在、遠距離傷害消費端存在、精煉 +7 ASPD +10% 條件仍存在。
- index.html 23 個快取參照為 v2.5.246；未發現 v2.5.245 舊參照。
- ZIP 完整性另行檢查。
