const fs=require('fs'),path=require('path');
const s=fs.readFileSync(path.join(__dirname,'../js/engine.js'),'utf8');
const tests=[
['RES/MRES公式',/\(2000 \+ resistance\) \/ \(2000 \+ 5 \* resistance\)/],
['技能承傷接RES/MRES',/applyTraitResistance\(Math\.max\(1, Math\.round\(mitigatePlayerIncoming\(raw, hardDef, softDef\) \* playerDmgTakenMult\(\)\)\), !!sk\.magic\)/],
['普攻承傷接RES',/applyTraitResistance\(Math\.max\(1, Math\.round\(mitigatePlayerIncoming\(raw, hardDef, softDef\) \* playerDmgTakenMult\(\)\)\), false\)/],
['H.PLUS最終治癒倍率',/buffMult\('healrecv'\)\.mult \* \(1 \+ Math\.max\(0, state\.hPlus \|\| 0\) \/ 100\)/],
['C.RATE獨立欄位',/state\.critDmgPct = state\.cRate/],
['C.RATE不加暴擊率',/state\.critRate = Math\.min\(50, 4 \+ Math\.floor\(cLuk \/ 3\)\);/]
];
let bad=0;for(const [n,r] of tests){const ok=r.test(s);console.log((ok?'PASS ':'FAIL ')+n);if(!ok)bad++}
console.log(`${tests.length-bad}/${tests.length} passed`);process.exitCode=bad?1:0;
