#!/usr/bin/env node
'use strict';
const fs = require('fs');
const path = require('path');
const root = path.resolve(__dirname, '..');
const engine = fs.readFileSync(path.join(root, 'js/engine.js'), 'utf8');
const data = fs.readFileSync(path.join(root, 'js/data.js'), 'utf8');
const checks = [
  ['cooldown alias maps Rainstorm to wa_rainstorm', /rainstorm:\s*'wa_rainstorm'/.test(engine)],
  ['cooldown alias maps Holy Spear to v2_ca_holy_spear', /holyspear:\s*'v2_ca_holy_spear'/.test(engine)],
  ['cooldown alias maps Napalm Vulcan to hw_napalmvulcan', /napalmvulcan:\s*'hw_napalmvulcan'/.test(engine)],
  ['cooldown alias maps legacy Holy Spear key to v2_ca_holy_spear', /holy_spear:\s*'v2_ca_holy_spear'/.test(engine) && /skillCd_holy_spear/.test(data)],
  ['cooldown alias maps Axe Tornado key to me_tornado', /axe_tornado:\s*'me_tornado'/.test(engine) && /skillCd_axe_tornado/.test(data)],
  ['cooldown alias maps Diamond Dust to registered Sorcerer skill', /diamond_dust:\s*'so_diamonddust'/.test(engine) && /skillCd_diamond_dust/.test(data)],
  ['Thanos 1000 HP / 100 SP recovery uses temporary 5% rate', /hpAmount === 1000 && spAmount === 100 \? 5/.test(engine)],
  ['Thanos 2500 HP / 50 SP recovery uses temporary 3% rate', /hpAmount === 2500 && spAmount === 50 \? 3/.test(engine)],
  ['recovery proc schedules four ticks one second apart', /ticks: 4/.test(engine) && /nextAt: now \+ 1000/.test(engine)],
  ['physical attacks trigger equipment recovery', /tryItemRecoveryProcs\('attack'\)/.test(engine)],
  ['magic attacks trigger equipment recovery', /tryItemRecoveryProcs\('magic'\)/.test(engine)],
  ['Smoky Leaf LT D-grade Fire Ball Lv9 mapping exists', /autoSpell_fireball': \{ skill: 'fireball', lv: 9, trigger: 'magic' \}/.test(engine)],
  ['Smoky Leaf LT data retains hellfire and chain lightning conditions', /autoSpell_hellfire":5/.test(data) && /autoSpell_chainLightning":2/.test(data)],
];
for (const [name, ok] of checks) console.log(`${ok ? 'PASS' : 'FAIL'} ${name}`);
const failed = checks.filter(x => !x[1]).length;
console.log(`v2.5.199 equipment proc/cooldown regression: ${checks.length - failed}/${checks.length} passed`);
if (failed) process.exit(1);
