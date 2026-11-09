// v2.5.112 incoming damage resist regression
const fs=require('fs'),path=require('path');
const e=fs.readFileSync(path.join(__dirname,'..','js','engine.js'),'utf8');
const checks=[
 ['neutral resist applied to monster skill damage',/el === 'none'\) raw \*= Math\.max\(0, 1 - getCardBonus\('neutralDmgResistPct'\) \/ 100\)/.test(e)],
 ['boss resist applied to monster skill damage',/if \(monDef\.isBoss\) raw \*= Math\.max\(0, 1 - getCardBonus\('bossDmgResistPct'\) \/ 100\)/.test(e)],
 ['neutral resist applied to monster basic attack',/\(monDef\.element \|\| 'none'\) === 'none'\) raw \*= Math\.max\(0, 1 - getCardBonus\('neutralDmgResistPct'\) \/ 100\)/.test(e)],
 ['boss resist applied to monster basic attack',/if \(monDef\.isBoss\) raw \*= Math\.max\(0, 1 - getCardBonus\('bossDmgResistPct'\) \/ 100\)/.test(e)],
 ['after-cast delay still deferred',!e.includes("getCardBonus('afterCastDelayPct')")]
];
for(const [n,ok] of checks)console.log((ok?'PASS ':'FAIL ')+n);
if(checks.some(x=>!x[1]))process.exit(1);
