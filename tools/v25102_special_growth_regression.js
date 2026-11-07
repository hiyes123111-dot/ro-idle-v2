#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const root = path.resolve(__dirname, '..');
const engine = fs.readFileSync(path.join(root, 'js/engine.js'), 'utf8');
const data = fs.readFileSync(path.join(root, 'js/data.js'), 'utf8');
function row(id) {
  const start = data.indexOf('"' + id + '":');
  if (start < 0) return '';
  const end = data.indexOf('\n  "', start + 1);
  return data.slice(start, end < 0 ? start + 5000 : end);
}
const checks = [
  ['perJobLv1 is recognized by key normalization', engine.includes("'perJobLv1_'")],
  ['perJobLv1 is included in gear aggregation', /JobLv1\|JobLv2/.test(engine)],
  ['perJobLv1 uses actual JobLv, not rounded half levels', engine.includes('(state.jobLevel || 0) * all[k]')],
  ['baseLevelMax condition is implemented', engine.includes('when.baseLevelMax != null')],
  ['offline EXP consumes expAllPct', engine.includes('avgRaceExp * (1 + getCardBonus(\'expAllPct\') / 100)')],
  ['Brynhild retains BaseLv x20 HP and x5 SP', row('brynhild').includes('"perBaseLv1_hp":20') && row('brynhild').includes('"perBaseLv1_sp":5')],
  ['Mjolnir belt retains its BaseLv STR scaling key', row('magingiorde').includes('"perBaseLv5_str":1')],
  ['Fox-tail ring no longer has unconditional flat MATK/HP/SP', !row('foxtail_ring').includes(',"matk":2') && !row('foxtail_ring').includes(',"hp":10') && !row('foxtail_ring').includes(',"sp":5')],
  ['Fox-tail ring grants ATK/MATK/HP/SP per 5 BaseLv', ['atk','matk','hp','sp'].every(k => row('foxtail_ring').includes('perBaseLv5_'+k))],
  ['Fox-tail ring is capped to BaseLv50', row('foxtail_ring').includes('"baseLevelMax":50')],
  ['Fox-tail ring EXP bonus is gated with its other effects', row('foxtail_ring').includes('"expAllPct":5')],
  ['Egir shoes grant BaseLv x5 HP to Mage family', row('egir_shoes').includes('"perBaseLv1_hp":5') && row('egir_shoes').includes('"jobLine":"mage"')],
  ['Egir shoes grant JobLv x2 SP to Swordsman family', row('egir_shoes').includes('"perJobLv1_sp":2') && row('egir_shoes').includes('"jobLine":"swordsman"')],
  ['Valkyrie shoes corrected to BaseLv x5 HP', row('valkyrie_shoes').includes('"perBaseLv1_hp":5') && !row('valkyrie_shoes').includes('perBaseLv5_hp')],
  ['Valkyrie shoes corrected to JobLv x2 SP', row('valkyrie_shoes').includes('"perJobLv1_sp":2') && !row('valkyrie_shoes').includes('perJobLv2_sp')],
  ['Valkyrie cloak base perfect dodge is class-gated', row('valkyrie_manteau').includes('"jobLine":"mage"') && row('valkyrie_manteau').includes('"perfectDodge":5')],
  ['Valkyrie cloak melee reflect is class-gated', row('valkyrie_manteau').includes('"jobLine":"swordsman"') && row('valkyrie_manteau').includes('"reflectPct":5')],
  ['Conditional refine scaling is consumed by gear aggregation', engine.includes('(def.condPerRefine || []).forEach')],
  ['Valkyrie cloak refine scaling caps at +10', row('valkyrie_manteau').includes('"cap":10')],
  ['Little Green Soul +2 refine grants EXP and drop', row('spirit_of_chung_e').includes('"per2Refine":{"expAllPct":1,"dropPct":1}')],
  ['Little Green Soul +4 refine grants HP/SP percent', row('spirit_of_chung_e').includes('"refineMin":4') && row('spirit_of_chung_e').includes('"hpPct":1,"spPct":1')],
  ['Little Green Soul +9 refine grants HP/SP regeneration', row('spirit_of_chung_e').includes('"refineMin":9') && row('spirit_of_chung_e').includes('"hpRegenPct":40,"spRegenPct":40')],
  ['Little Green Soul +12 refine adds another 3% HP/SP', row('spirit_of_chung_e').includes('"refineMin":12') && row('spirit_of_chung_e').includes('"hpPct":3,"spPct":3')],
  ['Little Green Soul transformation-only MATK is not unconditional', !row('spirit_of_chung_e').includes(',"matk":30') && !row('spirit_of_chung_e_').includes(',"matk":30')],
];
let failed = 0;
for (const [name, ok] of checks) {
  console.log(`${ok ? 'PASS' : 'FAIL'} ${name}`);
  if (!ok) failed++;
}
if (failed) process.exit(1);
