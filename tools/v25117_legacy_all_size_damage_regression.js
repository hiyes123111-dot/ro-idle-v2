const fs=require('fs'),path=require('path');const root=path.resolve(__dirname,'..');
const e=fs.readFileSync(path.join(root,'js/engine.js'),'utf8'),d=fs.readFileSync(path.join(root,'js/data.js'),'utf8');
const checks=[
 ['舊全體型鍵接入物理傷害鏈',/getCardBonus\('allSizeDmgPct'\) \+ getCardBonus\('sizeDmg_all'\)/.test(e)],
 ['全體型加成仍位於物理武器鏈',/const physPct = 1 \+ \(\(state\.physDmgPct \|\| 0\) \+ allSizeBonus \+ masteryPct/.test(e)],
 ['舊資料詞條保留',d.includes('sizeDmg_all:5')],
 ['不將舊物理鍵加進魔法分支',!/targetPct \+= getCardBonus\('sizeDmg_all'\)/.test(e)]
];let f=0;for(const [n,o] of checks){console.log(`${o?'PASS':'FAIL'} ${n}`);if(!o)f++;}console.log(`${checks.length-f}/${checks.length} passed`);process.exitCode=f?1:0;