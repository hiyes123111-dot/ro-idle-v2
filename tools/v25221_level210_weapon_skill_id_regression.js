const fs = require('fs');
const data = fs.readFileSync('js/data.js', 'utf8');
const skills = fs.readFileSync('js/skills.js', 'utf8');
const version = fs.readFileSync('VERSION.txt', 'utf8').trim();
const index = fs.readFileSync('index.html', 'utf8');
const checks = [
  ['Cart Cannon maps to current Geneticist skill ID', /gn_cartcannon\s*:\s*\{\s*id:\s*'gn_cartcannon'/.test(skills) && /"vivatus_f_lapier"[^\n]*skillDmg_gn_cartcannon/.test(data)],
  ['Psychic Wave maps to current Sorcerer skill ID', /so_psychicwave\s*:\s*\{\s*id:\s*'so_psychicwave'/.test(skills) && /"vivatus_f_m_book"[^\n]*skillDmg_so_psychicwave/.test(data)],
  ['Adoramus maps to current Archbishop skill ID', /ab_adoramus\s*:\s*\{\s*id:\s*'ab_adoramus'/.test(skills) && /"vivatus_f_wand"[^\n]*skillDmg_ab_adoramus/.test(data)],
  ['Fatal Menace maps to current Shadow Chaser skill ID', /sc_fatalmenace\s*:\s*\{\s*id:\s*'sc_fatalmenace'/.test(skills) && /"vivatus_f_dagger"[^\n]*skillDmg_sc_fatalmenace/.test(data)],
  ['Arrow Storm maps to current Ranger skill ID', /ra_arrowstorm\s*:\s*\{\s*id:\s*'ra_arrowstorm'/.test(skills) && /"vivatus_f_ballista"[^\n]*skillDmg_ra_arrowstorm/.test(data)],
  ['Aimed Bolt maps to current Ranger skill ID', /ra_aimedbolt\s*:\s*\{\s*id:\s*'ra_aimedbolt'/.test(skills) && /"vivatus_f_a_bow"[^\n]*skillDmg_ra_aimedbolt/.test(data)],
  ['Invalid legacy aliases removed from corrected weapons', !/"vivatus_f_(lapier|m_book|wand|dagger|ballista|a_bow)"[^\n]*skillDmg_(cartcannon|psychicwave|adoramus|fatalmenace|arrowstorm|aimedbolt)/.test(data)],
  ['Version is 2.5.221', version === '2.5.221'],
  ['All HTML cache refs use 2.5.221', (index.match(/\?v=2\.5\.221/g) || []).length === (index.match(/\?v=/g) || []).length]
];
let failed = 0;
for (const [name, ok] of checks) { console.log(`${ok ? 'PASS' : 'FAIL'} ${name}`); if (!ok) failed++; }
if (failed) process.exit(1);
console.log(`${checks.length}/${checks.length} passed`);
