const fs=require('fs'),path=require('path');const root=path.resolve(__dirname,'..');
const u=fs.readFileSync(path.join(root,'js/ui.js'),'utf8');
const checks=[
 ['圖鑑詳情有同步到戰場面板按鈕',u.includes('showBattleItemDetail(\'${id}\')')],
 ['圖鑑按鈕阻止外層點擊事件',u.includes('event.stopPropagation();showBattleItemDetail')],
 ['戰場面板會讀取卡片實際效果',u.includes('describeCardBonus(CARDS[itemId])')],
 ['卡片效果摘要加入面板內容',u.includes('lines.push(...cardBits)')],
 ['原有怪物來源前往仍保留',u.includes('codexGoToMap(\'${s.mapId}\')')]
];let f=0;for(const [n,o] of checks){console.log(`${o?'PASS':'FAIL'} ${n}`);if(!o)f++;}console.log(`${checks.length-f}/${checks.length} passed`);process.exitCode=f?1:0;
