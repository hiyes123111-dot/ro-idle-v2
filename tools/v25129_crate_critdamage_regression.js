const fs=require('fs'),path=require('path');
const s=fs.readFileSync(path.join(__dirname,'../js/engine.js'),'utf8');
const checks=[
['C.RATE 加入共用暴擊傷害欄位',/state\.cardCritDmgPct = getCardBonus\('critDmgPct'\) \+ buffMult\('critdmg'\)\.flatBonus \+ \(state\.critDmgPct \|\| 0\)/],
['普攻暴擊讀取共用暴擊傷害欄位',/raw \*= 1\.5 \* \(1 \+ \(state\.cardCritDmgPct \|\| 0\) \/ 100\)/],
['單體技能暴擊讀取共用暴擊傷害欄位',/critFactor = 1 \+ \(0\.5 \+ \(state\.cardCritDmgPct \|\| 0\) \/ 100\) \* cdm/],
['範圍技能暴擊讀取共用暴擊傷害欄位',/aoeMult \*= 1 \+ \(0\.5 \+ \(state\.cardCritDmgPct \|\| 0\) \/ 100\) \* cdm/],
['暴擊估算讀取共用暴擊傷害欄位',/const critRaw = base \* 1\.5 \* \(1 \+ \(state\.cardCritDmgPct \|\| 0\) \/ 100\)/]
];
let bad=0;for(const [n,r] of checks){const ok=r.test(s);console.log((ok?'PASS ':'FAIL ')+n);if(!ok)bad++}
console.log(`${checks.length-bad}/${checks.length} passed`);process.exitCode=bad?1:0;
