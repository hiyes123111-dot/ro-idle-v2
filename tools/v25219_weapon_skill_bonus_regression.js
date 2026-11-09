// Kept under its historical filename for compatibility with existing test runners.
// Current assertions track the follow-up v2.5.220 level-200 weapon ID correction.
const fs = require('fs');
const data = fs.readFileSync('js/data.js', 'utf8');
const skills = fs.readFileSync('js/skills.js', 'utf8');
const version = fs.readFileSync('VERSION.txt', 'utf8').trim();
const index = fs.readFileSync('index.html', 'utf8');
const tests = [
  ['Arrow Storm skill ID exists', /ra_arrowstorm\s*:\s*\{\s*id:\s*'ra_arrowstorm'/.test(skills)],
  ['Level-200 Ether Bow uses the registered skill ID', /"fourth_bh_bow"[^\n]*"per2Refine":\{"skillDmg_ra_arrowstorm":5\}/.test(data)],
  ['Cardinal mace skill bonus remains skill-specific', /"fourth_1h_mace"[^\n]*"skillDmg_cd_framen":5/.test(data)],
  ['Release version is 2.5.220', version === '2.5.220'],
  ['HTML cache references updated', !index.includes('?v=2.5.219') && index.includes('?v=2.5.220')]
];
let failed = 0;
for (const [name, ok] of tests) { console.log(`${ok ? 'PASS' : 'FAIL'} ${name}`); if (!ok) failed++; }
if (failed) process.exit(1);
console.log(`${tests.length}/${tests.length} passed`);
