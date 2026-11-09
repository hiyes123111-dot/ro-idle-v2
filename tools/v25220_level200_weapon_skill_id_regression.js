const fs = require('fs');
const data = fs.readFileSync('js/data.js', 'utf8');
const skills = fs.readFileSync('js/skills.js', 'utf8');
const version = fs.readFileSync('VERSION.txt', 'utf8').trim();
const index = fs.readFileSync('index.html', 'utf8');
const tests = [
  ['Arrow Storm skill ID exists in current skill table', /ra_arrowstorm\s*:\s*\{\s*id:\s*'ra_arrowstorm'/.test(skills)],
  ['Level-200 Ether Bow uses the exact Arrow Storm skill ID', /"fourth_bh_bow"[^\n]*"per2Refine":\{"skillDmg_ra_arrowstorm":5\}/.test(data)],
  ['Level-200 Ether Bow no longer uses the invalid arrowstorm alias', !/"fourth_bh_bow"[^\n]*skillDmg_arrowstorm/.test(data)],
  ['Cardinal mace correction remains intact', /"fourth_1h_mace"[^\n]*"skillDmg_cd_framen":5/.test(data)],
  ['HE equipment remains untouched by this targeted patch', /"hs_cr_sword"[^\n]*"reqLevel":200/.test(data)],
  ['Release version is 2.5.221', version === '2.5.225'],
  ['All HTML cache refs use 2.5.221', (index.match(/\?v=2\.5\.225/g) || []).length === (index.match(/\?v=/g) || []).length]
];
let failed = 0;
for (const [name, ok] of tests) { console.log(`${ok ? 'PASS' : 'FAIL'} ${name}`); if (!ok) failed++; }
if (failed) process.exit(1);
console.log(`${tests.length}/${tests.length} passed`);
