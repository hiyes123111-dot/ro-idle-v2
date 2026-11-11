const fs=require('fs'),path=require('path');const root=path.resolve(__dirname,'..');
const h=fs.readFileSync(path.join(root,'index.html'),'utf8');
const u=fs.readFileSync(path.join(root,'js/ui.js'),'utf8');
const css=fs.readFileSync(path.join(root,'css/style.css'),'utf8');
const checks=[
 ['面板放在戰鬥紀錄之後',h.indexOf('class="combat-log"')<h.indexOf('id="battle-item-detail"')],
 ['詳細資料區有獨立內容容器',h.includes('id="battle-item-detail-body"')],
 ['背包物品可點擊顯示詳細資料',u.includes("showBattleItemDetail('${row.item}'")],
 ['有物品詳細資料渲染函式',u.includes('function showBattleItemDetail(itemId')],
 ['顯示物品描述與基本數值',u.includes('def.desc')&&u.includes('def.atk')&&u.includes('def.matk')],
 ['支援顯示個體精煉與卡片',u.includes('inst.refine')&&u.includes('inst.cards')],
 ['有取得來源及地圖前往按鈕',u.includes('getItemFarmSpots(itemId)')&&u.includes('codexGoToMap')],
 ['樣式支援收合與捲動',css.includes('battle-item-detail.hidden')&&css.includes('overflow-y: auto')]
];let f=0;for(const [n,o] of checks){console.log(`${o?'PASS':'FAIL'} ${n}`);if(!o)f++;}console.log(`${checks.length-f}/${checks.length} passed`);process.exitCode=f?1:0;
