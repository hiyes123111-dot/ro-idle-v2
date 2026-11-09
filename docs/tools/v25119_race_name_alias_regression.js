const fs=require('fs'),path=require('path');const root=path.resolve(__dirname,'..');
const e=fs.readFileSync(path.join(root,'js/engine.js'),'utf8'),d=fs.readFileSync(path.join(root,'js/v2_9_headgear_round17.js'),'utf8');
const checks=[
 ['物理種族增傷 animal→brute',/prefix === 'raceDmg_' \|\| prefix === 'raceDmgReduce_'.*key === 'animal'[\s\S]*?key = 'brute'/.test(e)],
 ['物理種族增傷 demihuman→humanoid',/key === 'demihuman'[\s\S]*?key = 'humanoid'/.test(e)],
 ['種族減傷共用 animal 別名',/prefix === 'raceDmg_' \|\| prefix === 'raceDmgReduce_'.*key === 'animal'/.test(e)],
 ['種族減傷共用 demihuman 別名',/prefix === 'raceDmg_' \|\| prefix === 'raceDmgReduce_'.*key === 'demihuman'/.test(e)],
 ['魔法人形種族增傷讀舊鍵',/magicRaceDmg_demihuman/.test(e)],
 ['魔法動物種族增傷讀舊鍵',/magicRaceDmg_animal/.test(e)],
 ['舊資料含動物系增傷',/raceDmg_animal:10/.test(d)],
 ['舊資料含人形系魔法增傷',/magicRaceDmg_demihuman:10/.test(d)],
 ['無形種族減傷保留原鍵',/raceDmgReduce_formless:10/.test(d)]
];let f=0;for(const [n,o] of checks){console.log(`${o?'PASS':'FAIL'} ${n}`);if(!o)f++;}console.log(`${checks.length-f}/${checks.length} passed`);process.exitCode=f?1:0;
