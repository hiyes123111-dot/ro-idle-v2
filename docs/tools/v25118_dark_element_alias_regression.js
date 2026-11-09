const fs=require('fs'),path=require('path');const root=path.resolve(__dirname,'..');
const e=fs.readFileSync(path.join(root,'js/engine.js'),'utf8'),d=fs.readFileSync(path.join(root,'js/data.js'),'utf8');
const checks=[
 ['暗屬性增傷鍵正規化',/prefix === 'eleDmg_' \|\| prefix === 'eleReduce_'.*key === 'dark'/.test(e)],
 ['暗屬性減傷鍵共用正規化',/key = 'shadow'/.test(e)],
 ['舊裝備暗屬性增傷資料存在',d.includes('eleDmg_dark:1')],
 ['暗屬性怪物使用 shadow 屬性',/element:'shadow'/.test(d)],
 ['暗屬性增傷消費端查 shadow 桶',/state\.cardEleDmgBonus\[ele\]/.test(e)],
 ['暗屬性減傷消費端查 shadow 桶',/state\.cardEleDmgReduce\[el\]/.test(e)]
];let f=0;for(const [n,o] of checks){console.log(`${o?'PASS':'FAIL'} ${n}`);if(!o)f++;}console.log(`${checks.length-f}/${checks.length} passed`);process.exitCode=f?1:0;