const fs = require('fs');
const data = fs.readFileSync(require('path').join(__dirname, '../js/data.js'), 'utf8');
const checks = [
  ['Masamune declares flat ASPD +2', /"masamune"[\s\S]*?"bonus":\{"aspdFlat":2\}/.test(data)],
  ['Windhawk declares ASPD +5%', /"windhawk"[\s\S]*?"bonus":\{"aspdPct":5\}/.test(data)],
  ['Thunder-P declares ASPD +20%', /"thunder_p"[\s\S]*?"bonus":\{"aspdPct":20\}/.test(data)],
  ['Thunder-P [2] declares ASPD +20%', /"thunder_p_"[\s\S]*?"bonus":\{"aspdPct":20\}/.test(data)],
  ['Kandura declares ASPD +2%', /"kandura"[\s\S]*?"bonus":\{"aspdPct":2\}/.test(data)],
  ['Lunakaligo has STR 77 ASPD +4% condition', /"lunakaligo"[\s\S]*?"statMin":\{"str":77\}[\s\S]*?"aspdPct":4/.test(data)],
  ['Spoon declares flat ASPD +10', /"spoon"[\s\S]*?"bonus":\{"aspdFlat":10\}/.test(data)],
  ['Librarian glove set declares ASPD +5%', /"librarian_glove"[\s\S]*?"aspdPct":5/.test(data)],
  ['Soheon card refine ASPD +1 at +10 and +14', /soheon_card:[\s\S]*?refineMin:10[\s\S]*?aspdFlat:1[\s\S]*?refineMin:14[\s\S]*?aspdFlat:1/.test(data)],
  ['Thanos Dagger AD merges ATK and MATK refine scaling', /"thanos_dagger_ad"[\s\S]*?"per2Refine":\{"atk":10,"matk":10\}/.test(data)],
];
let failed = 0;
for (const [name, ok] of checks) { console.log(`${ok ? 'PASS' : 'FAIL'} ${name}`); if (!ok) failed++; }
console.log(`${checks.length - failed}/${checks.length} passed`);
process.exitCode = failed ? 1 : 0;
