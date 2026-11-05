# V2.5.5.6 技能增傷覆蓋率稽核

## 本次處理
- 新增技能增傷覆蓋率檢查，掃描裝備資料中的 `skillDmg_*` 詞條，與 `skills.js`、`v2_content.js` 的實際技能 ID 比對。
- 同時驗證 `engine.js` 中每個已設定別名都有真實技能目標，且別名確實被裝備資料使用。
- 不為缺少技能本體的詞條猜測對應，不讓錯誤別名吃掉其他技能加成。

## 稽核結果
- 技能增傷詞條種類：68
- 可直接對應或已有驗證別名：32
- 尚未對應：36

尚未對應詞條：
`banish`, `beastswing`, `burstsphere`, `cannonattack`, `carttornado`, `catnipmeteor`, `counterSlash`, `creationlight`, `crushstorm`, `destructcomet`, `dominion_brand`, `duple_light`, `dusklight`, `earthstrain`, `esma`, `evilspiritboom`, `fullmoonkick`, `great_blow`, `heavymetal`, `heavyrain`, `holyspear`, `hundredspear`, `melodystrike`, `meteorfall`, `pickypeck`, `rollingcutter`, `roundtable`, `slaughterdance`, `soulexplosion`, `swing_axe`, `triangleshot`, `venomsplash`, `vulcanarm`, `whirlaxe`, `windcutter`, `wrathofgod`。

## 驗證
- `node --check js/engine.js`：PASS
- `node --check tools/v255_skill_bonus_coverage.js`：PASS
- `node tools/v255_skill_bonus_coverage.js`：PASS（別名目標有效；36 個未對應詞條明確列出）
- `node tools/v255_skill_alias_regression.js`：PASS
- `node tools/v2_regression.js`：PASS
- `node tools/v255_asset_regression.js`：PASS

## 範圍限制
本版是覆蓋率稽核與防錯，不宣稱 36 個缺失技能已修復。下一步需逐職業補技能本體、倍率、SP、冷卻、自動戰鬥施放及實際裝備增傷驗證。V1.17 未修改，尚未推送 GitHub。
