# QA Report — V2.5.5.46

## 弓箭手系技能恢復
- 以 V1.17 對照弓箭手、獵人、狙擊之王、詩人、舞孃及其進階二轉技能清單。V1.17 已有的上述職業技能清單在 V2.5.5.45 均保留；唯一漏失項目為狙擊之王的「獵鷹突擊」技能註冊與職業技能清單，已補回。
- 保留 V2 現有三轉／四轉技能與內容，不以 V1.17 覆蓋。
- 「獵鷹突擊」是狙擊之王主動單體技能；「獵鷹突襲」是閃電衝擊依 LUK 機率觸發的普攻被動，兩者分開命名。
- 補回 V2 原本只有註解、未真正接入的獵鷹突擊傷害計算：依閃電衝擊當前等級倍率、獵鷹突擊技能係數、基本等級與 INT 成長，並將鋼製喙固定傷害加在防禦結算後。
- 閃電衝擊被動機率沿用 V1.17 公式：`min(30, 5 + (LUK - 1) * 25 / 119)`；使用 `passiveMult`，不混用主動技能倍率。

## 裝備精煉加成稽核
- 確認裝備 `perRefine`、`perRefineSquare`、`per2Refine`、`per2RefineExtra`、`per3Refine`、`per4Refine`、`per5Refine`、MATK 平方精煉欄位均由 `effectiveGearBonuses()` 依精煉階數合併，並由衍生屬性／戰鬥計算端讀取。
- 確認裝備 `condBonus` 的 `refineMin`／`refineMax` 條件會以該件裝備的實際精煉階數判斷。
- 修正六款變異時光戰靴的 `per3Refine` 資料誤複製：力量靴 ATK、智慧靴 MATK、敏捷靴 ASPD、體力靴 HP、靈巧靴 DEX、幸運靴暴擊傷害，並保留各自描述所列的 HP/SP 精煉成長。

## 測試
- JavaScript 語法檢查：`skills.js`、`jobs.js`、`engine.js`、`data.js` 通過。
- 全套回歸測試（含新增測試）：23/23 PASS。
