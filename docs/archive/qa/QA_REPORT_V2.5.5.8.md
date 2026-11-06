# V2.5.5.8 遊俠技能修正 QA

## 修正
- 箭雨風暴：`damage_aoe`、弓限制、消耗 10 箭、倍率 250%～700%。
- 瞄準標靶：倍率 220%～400%，目標體型倍率 small/medium/large = 1/2/3。
- 恐懼風息：由錯誤傷害主動技改為被動追擊，機率 4/4/7/9/10%，追加箭數 1/1/2/3/4。
- 被動追擊讀取技能增傷詞條。

## 測試
- `node --check js/skills.js`：PASS
- `node --check js/engine.js`：PASS
- `node tools/v2558_ranger_regression.js`：PASS
- `node tools/v2_regression.js`：PASS，31 組裝備套裝、0 failures
- `node tools/v255_asset_regression.js`：PASS，裝備 19/19、怪物 8/8
- `node tools/v255_skill_alias_regression.js`：PASS
- `node tools/v255_skill_bonus_coverage.js`：PASS；仍有 34 種未確認詞條，未猜測映射

## 已知簡化
- 本作戰鬥場景未提供怪物地圖座標，箭雨風暴暫用現有全體敵人 AOE，非官方 5×5 格精準範圍。
- 恐懼風息暫以常駐被動追擊呈現，尚未實作官方主動施放後 60～180 秒的狀態時間。
