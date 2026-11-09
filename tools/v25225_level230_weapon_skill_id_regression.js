const fs = require('fs');
const vm = require('vm');
const data = fs.readFileSync('js/data.js', 'utf8');
const skillsSrc = fs.readFileSync('js/skills.js', 'utf8');
const version = fs.readFileSync('VERSION.txt', 'utf8').trim();
const index = fs.readFileSync('index.html', 'utf8');
const ctx = {};
vm.createContext(ctx);
vm.runInContext(data + '\nglobalThis.ITEMS = ITEMS;', ctx);
vm.runInContext(skillsSrc + '\nglobalThis.SKILLS = SKILLS;', ctx);
const level230Weapons = Object.values(ctx.ITEMS).filter(x => x && x.type === 'weapon' && x.reqLevel === 230);
const invalidSkillKeys = [];
for (const item of level230Weapons) {
  const walk = (obj) => {
    if (!obj || typeof obj !== 'object') return;
    for (const [key, value] of Object.entries(obj)) {
      if (key.startsWith('skillDmg_') && !ctx.SKILLS[key.slice('skillDmg_'.length)]) invalidSkillKeys.push(`${item.id}:${key}`);
      walk(value);
    }
  };
  walk(item);
}
const bow = ctx.ITEMS.poenetentia_attendo;
const checks = [
  ['46 level-230 weapons are included in this audit', level230Weapons.length === 46],
  ['the current Arrow Storm skill ID exists', !!ctx.SKILLS.ra_arrowstorm],
  ['the Poenitentia precision bow uses the current Arrow Storm ID', !!bow && !!bow.per2Refine && bow.per2Refine.skillDmg_ra_arrowstorm === 3],
  ['the invalid legacy Arrow Storm alias is absent from the bow', !!bow && !('skillDmg_arrowstorm' in (bow.per2Refine || {}))],
  ['all skillDmg keys on level-230 weapons resolve to current skill IDs', invalidSkillKeys.length === 0],
  ['release version is 2.5.225', version === '2.5.225'],
  ['all HTML cache refs use 2.5.225', (index.match(/\?v=2\.5\.225/g) || []).length === (index.match(/\?v=/g) || []).length]
];
let failed = 0;
for (const [name, ok] of checks) { console.log(`${ok ? 'PASS' : 'FAIL'} ${name}`); if (!ok) failed++; }
if (invalidSkillKeys.length) console.log('Invalid skill keys:', invalidSkillKeys.join(', '));
if (failed) process.exit(1);
console.log(`${checks.length}/${checks.length} passed`);
