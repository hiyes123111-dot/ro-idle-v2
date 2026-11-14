const fs=require('fs'),path=require('path');
const s=fs.readFileSync(path.join(__dirname,'../js/engine.js'),'utf8');
const checks=[
['裝備條件式精煉詞條解析',s.includes('裝備條件式精煉詞條（perNRefine_')],
['perNRefine 正規表示式',s.includes('const pm = /^per(\\d+)Refine_(.+)$/')],
['條件式精煉依宿主裝備等級計算',s.includes('bv * Math.floor((host.refine || 0) / Number(pm[1]))')],
['裝備條件式加成先檢查條件',s.includes('if (!condMet(cb.when, host, lo)) return;')]
];
let bad=0;for(const [n,ok] of checks){console.log((ok?'PASS ':'FAIL ')+n);if(!ok)bad++}
console.log(`${checks.length-bad}/${checks.length} passed`);process.exitCode=bad?1:0;
