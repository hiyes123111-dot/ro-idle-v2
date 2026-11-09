const fs = require('fs');
const vm = require('vm');
const content = fs.readFileSync('js/v2_5_content.js','utf8');
const engine = fs.readFileSync('js/engine.js','utf8');
const skills = fs.readFileSync('js/skills.js','utf8');
const requiredIds = [
  'em_summon_elemental_ardor','em_summon_elemental_diluvio','em_summon_elemental_procella',
  'em_summon_elemental_terremotus','em_summon_elemental_serpens'
];
const rows = content.match(/\['召喚元素：[\s\S]*?\],\['元素天幕'/);
if (!rows) throw new Error('Element Master summon rows missing');
for (const id of requiredIds) if (!content.includes(id)) throw new Error(`Missing skill ID ${id}`);
if (!content.includes("type === 'elemental_summon'")) throw new Error('High spirit summon configuration missing');
if (!engine.includes('highElementalSpirit: !!sk.highElementalSpirit')) throw new Error('High spirit summon execution missing');
if (!engine.includes('sk.highElementalSpirit ? 0')) throw new Error('High spirit upkeep handling missing');
for (const label of ['聖光打擊','制裁謳歌','驅魔風暴','聖靈鎮魂','神聖花雨']) {
  if (!skills.includes(`name:'${label}'`) && !content.includes(label)) throw new Error(`Cardinal label missing: ${label}`);
}
console.log('PASS: 5 fourth-job high spirit summon IDs, summon execution and Cardinal current labels');
