// v2.5.110: after-cast delay intentionally deferred
const fs = require('fs'), path = require('path');
const e = fs.readFileSync(path.join(__dirname,'..','js','engine.js'),'utf8');
const checks = [
  ['afterCastDelayPct is not consumed', !e.includes("getCardBonus('afterCastDelayPct')")],
  ['normal skill cooldown modifier retained', e.includes("getCardBonus('skillCdFlat')")],
  ['per-skill cooldown modifier retained', e.includes("getCardBonus('skillCdFlat_' + skillId)")],
  ['skillcd buff multiplier retained', e.includes("buffMult('skillcd').flatBonus")],
  ['minimum cooldown retained', e.includes('Math.max(MIN_COOLDOWN_MS')]
];
for (const [n,ok] of checks) console.log((ok?'PASS':'FAIL')+' '+n);
if (checks.some(x=>!x[1])) process.exit(1);
