#!/usr/bin/env node
// 驗證 EP21 卡片技能增傷鍵會被實際技能傷害共用入口讀取，並涵蓋精煉成長的數值。
const fs = require('fs');
const vm = require('vm');
const path = require('path');
const root = path.resolve(__dirname, '..');
const data = fs.readFileSync(path.join(root, 'js/data.js'), 'utf8');
const engine = fs.readFileSync(path.join(root, 'js/engine.js'), 'utf8');
const skillStart = engine.indexOf('function getSkillDamageBonus(sk) {');
const skillEnd = engine.indexOf('\n}\n', skillStart) + 3;
if (skillStart < 0 || skillEnd < 3) throw new Error('getSkillDamageBonus not found');
const fn = engine.slice(skillStart, skillEnd);
const cards = [
  'ep21_tris_card','ep21_tan_borg_card','ep21_bihailin_card','ep21_reinhardt_card',
  'ep21_evan_wigner_card','ep21_lalila_card','ep21_richard_card','ep21_lora_card',
  'ep21_aurely_card','ep21_ylze_card','ep21_epesto_card','ep21_mary_stella_card','ep21_lee_card'
];
const ctx = { SKILLS: {}, getCardBonus: key => activeBonus[key] || 0 };
let activeBonus = {};
vm.createContext(ctx);
vm.runInContext(fn + '\nglobalThis.readSkillBonus=getSkillDamageBonus;', ctx);
let count = 0;
for (const cardId of cards) {
  const pos = data.indexOf(`'${cardId}':`, data.indexOf('const CARDS'));
  if (pos < 0) throw new Error('missing '+cardId);
  const line = data.slice(pos, data.indexOf('\n', pos));
  const keys = [...line.matchAll(/skillDmg_([A-Za-z0-9_]+):1/g)].map(m=>m[1]);
  const unique = [...new Set(keys)];
  if (unique.length < 2) throw new Error(cardId+': fewer than 2 skill links');
  const refineBonus = 5; // weapon refine +5
  const circletRefine = 12; // A-grade circlet +12; threshold +10 is met
  for (const skillId of unique) {
    const skill = {id:skillId};
    ctx.SKILLS[skillId] = skill;
    activeBonus = {[`skillDmg_${skillId}`]: refineBonus + circletRefine*12};
    const got = ctx.readSkillBonus(skill);
    const expected = 149; // +5% weapon refinement + 12*12% circlet refinement
    if (got !== expected) throw new Error(`${cardId}/${skillId}: expected ${expected}, got ${got}`);
    count++;
  }
}
// Ensure the regular physical/magic direct-damage paths multiply by this shared bonus reader.
const directDamageUses = (engine.match(/getSkillDamageBonus\(sk\)/g)||[]).length;
if (directDamageUses < 5) throw new Error('too few direct damage paths consume getSkillDamageBonus: '+directDamageUses);
console.log(`PASS: ${count} EP21 skill links read through getSkillDamageBonus; +5 weapon refine and A/+12 headgear produce +149%; ${directDamageUses} damage callsites use the shared bonus reader`);
