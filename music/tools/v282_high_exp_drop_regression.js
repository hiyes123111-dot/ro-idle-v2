const fs = require('fs');
const path = require('path');
const data = fs.readFileSync(path.join(__dirname, '..', 'js', 'data.js'), 'utf8');
const targets = ['ill_kraken', 'ill_abysmal_witch', 'ep18_burning_fang', 'r001_bestia'];
let passed = 0;
for (const id of targets) {
  const re = new RegExp('\\b' + id + ':\\s*\\{[^\\n]*?drops:\\[([^\\]]*)\\]');
  const match = data.match(re);
  if (!match) throw new Error(`Missing monster/drop data: ${id}`);
  for (const item of ['old_violet_box', 'old_card_album']) {
    const entries = [...match[1].matchAll(new RegExp("\\{item:'" + item + "',chance:([0-9.]+)\\}", 'g'))];
    if (entries.length !== 1) throw new Error(`${id}: ${item} entry count=${entries.length}, expected 1`);
    const chance = Number(entries[0][1]);
    if (chance !== 0.2) throw new Error(`${id}: ${item} chance=${chance}, expected 0.2`);
    passed++;
  }
}
if (!data.includes("id: 'high_exp_208'")) throw new Error('High EXP map definition missing');
console.log(`v2.5.282 high-exp drop regression: ${passed}/8 passed`);
