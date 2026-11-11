// v2.5.111 all-element magic damage regression
const fs=require('fs'),path=require('path');
const e=fs.readFileSync(path.join(__dirname,'..','js','engine.js'),'utf8');
const d=fs.readFileSync(path.join(__dirname,'..','js','data.js'),'utf8');
const checks=[
 ['magic damage pipeline consumes allEleDmg',e.includes("targetPct += getCardBonus('allEleDmg');")],
 ['consumer is inside magic-only branch',e.indexOf("targetPct += getCardBonus('allEleDmg');")>e.indexOf('if (useMag) {')],
 ['existing allEleDmg equipment records retained',d.includes('allEleDmg:5')&&d.includes('allEleDmg:7')&&d.includes('allEleDmg:15')],
 ['afterCastDelayPct remains deferred',!e.includes("getCardBonus('afterCastDelayPct')")],
 ['ordinary skill cooldown remains',e.includes("getCardBonus('skillCdFlat')")]
];
for(const [n,ok] of checks) console.log((ok?'PASS ':'FAIL ')+n);
if(checks.some(x=>!x[1]))process.exit(1);
