const fs=require('fs'),path=require('path');const root=path.resolve(__dirname,'..');
const e=fs.readFileSync(path.join(root,'js/engine.js'),'utf8'),d=fs.readFileSync(path.join(root,'js/data.js'),'utf8');
const checks=[
 ['遠距離物理技能有獨立判定',/isMonsterRangedPhysicalSkill\(sk\)/.test(e)],
 ['舊卡片鍵 rangedDmgTakenPct 接入',/getCardBonus\('rangedDmgTakenPct'\)/.test(e)],
 ['新舊遠距離承傷合併',/getCardBonus\('rangedDmgResist'\) - getCardBonus\('rangedDmgTakenPct'\)/.test(e)],
 ['遠距離承傷不會低於零',/Math\.max\(0, 1 - Math\.max\(0, rangedResist\) \/ 100\)/.test(e)],
 ['鱷魚人卡片舊詞條仍存在',/alligator_card:[\s\S]*?bonus\":\{\"rangedDmgTakenPct\":-5\}/.test(d)]
];let f=0;for(const [n,o] of checks){console.log(`${o?'PASS':'FAIL'} ${n}`);if(!o)f++;}console.log(`${checks.length-f}/${checks.length} passed`);process.exitCode=f?1:0;
