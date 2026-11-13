// v2.5.342：服事系列輔助技能來源標記與隊伍同步靜態回歸檢查
const fs = require('fs');
const skills = fs.readFileSync('js/skills.js', 'utf8');
const engine = fs.readFileSync('js/engine.js', 'utf8');
const required = ['blessing','increaseagi','angelusbarrier','magnificat','gloria','kyrie','sanctuary_holy','aspersio','slowpoison','impositio_manus','sanctuary','strecovery'];
for (const id of required) {
  if (!skills.includes(`"${id}"`) && !skills.includes(`${id}:`)) throw new Error(`missing skill data: ${id}`);
}
for (const token of ["case 'buff_blessing'", "case 'buff_sprate'", "case 'buff_aspd'", "case 'buff_holyweapon'", "function shareBuffsWithAllies", "fresh.forEach(b => { if (!b.skillId) b.skillId = sk.id; })"]) {
  if (!engine.includes(token)) throw new Error(`missing support handler: ${token}`);
}
for (const token of [
  "type: 'hit', mult: 1, flatBonus: hitBonus, msRemaining: dur * 1000, skillId: sk.id",
  "type: 'sprate', mult, msRemaining: dur * 1000, skillId: sk.id",
  "type: 'aspd', mult, msRemaining: dur * 1000, skillId: sk.id",
  "type: 'holyweapon', mult: 1, msRemaining: dur * 1000, skillId: sk.id"
]) if (!engine.includes(token)) throw new Error(`missing explicit source id: ${token}`);
console.log('PASS: acolyte support skill source-id and party-share regression checks');
