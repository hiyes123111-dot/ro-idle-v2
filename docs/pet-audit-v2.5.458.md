# v2.5.458 寵物特殊觸發技能更新

## 本輪完成

- 接入 Tamadora（たまドラ）寵物的物理攻擊命中自動治癒術 Lv1。
- 觸發門檻：親密度 750（有點親密）以上。
- 觸發率：1%。採 Divine Pride 9080 Tamadora Egg item script 資料；道具說明本身只寫「一定機率」，未標出百分比。
- 沿用既有 `tryAutoSpells('attack')` 命中後節點及 `castSkill('heal', { free:true, forceLv:1 })`，不改普攻傷害鏈、不在 MISS／魔法攻擊時觸發。
- HP 已滿時略過治癒，避免無效施法訊息。
- 寵物面板將此效果由「待接入」更新為「已實裝」。
- 修正 v2.5.457 Tamadora 10% 的覆寫值；本版依可核實 item script 改為 1%。

## 尚未完成

- Tamadora 非常親密時額外開放治癒術 Lv1 的手動技能介面尚未接入。
- Hyegun 吸收 SP、Cat O' Nine Tails／Moonlight Flower／Teddy Bear 等機率型恢復效果，原始資料未能核實觸發率，仍不猜測機率。
- Blue Moon Loli Ruri 受擊霸邪、Loli Ruri 自動治癒等觸發仍待逐項核對來源與戰鬥節點。
- 其他特殊寵物主動技能、寵物飾品、進化、野外自動捕捉尚未實裝。

## 測試

`tests/test_pet458_trigger_skills.js`：7 項測試，涵蓋 1% 觸發、親密度門檻、HP 滿時略過、技能欄訊息、魔法攻擊不觸發與面板提示。
