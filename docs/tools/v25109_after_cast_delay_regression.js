// v2.5.109 after-cast-delay consumer regression
const fs = require('fs'), path = require('path');
const e = fs.readFileSync(path.join(__dirname,'..','js','engine.js'),'utf8');
const d = fs.readFileSync(path.join(__dirname,'..','js','data.js'),'utf8');
const checks = [
  ['consumer reads afterCastDelayPct', e.includes("getCardBonus('afterCastDelayPct')")],
  ['after-cast delay multiplier applied', e.includes('(base + delta) * skillCdPct * afterCastDelayPct')],
  ['minimum cooldown retained', e.includes('Math.max(MIN_COOLDOWN_MS')],
  ['real equipment data exists', d.includes('afterCastDelayPct:20') && d.includes('afterCastDelayPct:10')]
];
for (const [n,ok] of checks) console.log((ok?'PASS':'FAIL')+' '+n);
if (checks.some(x=>!x[1])) process.exit(1);
