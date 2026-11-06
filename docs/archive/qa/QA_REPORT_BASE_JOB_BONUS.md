# BaseLv / BaseJob 裝備加成修正報告

## 修正
- `effectiveGearBonuses()` 快取簽章加入 BaseLv、BaseJob、已學技能等級。升級或提升技能後，不再沿用舊的條件加成快取。
- `getCardBonus()` 統一支援 `perJobLv10_<bonusKey>`，不再只在衍生數值階段硬編碼 ATK/HIT/CRI；避免重複計算並讓所有已存在的 bonus consumer 可讀取 JOB 等級加成。
- 移除舊的 perJobLv10 ATK/HIT/CRI 特殊加算區塊，改由統一入口處理。

## 資料掃描
掃描 `js/data.js` 的條件式等級鍵，找到 19 種不同鍵：
- perBaseLv10：ATK 與 Heavy Rain 技能傷害
- perBaseLv5：STR（雷神腰帶）
- perBaseLv15：MATK（成長型權杖）
- perBaseLv1：ATK、HP、MATK、SP、箭雨與二連矢技能傷害
- perBaseLv210：ATK、MATK、P.ATK、POW、S.MATK、SPL
- perJobLv10：ATK、CRI、HIT（伊夫利特卡片）

## 已知限制
目前引擎尚未找到 P.ATK、POW、S.MATK、SPL 的正式角色衍生數值欄位與傷害公式消費端。因此 `perBaseLv210_pAtk/pow/sMatk/spl` 雖能被統一加成查詢層讀取，但目前遊戲戰鬥系統尚未完整實作這些四轉新素質的計算鏈，不能宣稱這四項已在戰鬥中生效。需另行補齊四轉素質欄位及物理/魔法技能公式。

## 測試
- `node --check js/engine.js` 通過。
- `node tools/v2_regression.js` 通過：31 組裝備套裝、四轉職業與技能、存檔遷移等測試全部通過，0 failures。
- 此回歸測試未涵蓋瀏覽器內實際角色升級前後的畫面驗證；也未證明上述四轉新素質已有完整戰鬥消費端。
