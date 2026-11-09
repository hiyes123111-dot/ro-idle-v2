const fs = require('fs');
const path = require('path');
const root = path.resolve(__dirname, '..');
const migration = fs.readFileSync(path.join(root, 'js/v2_6_skill_migration.js'), 'utf8');
const engine = fs.readFileSync(path.join(root, 'js/engine.js'), 'utf8');
const jobs = fs.readFileSync(path.join(root, 'js/jobs.js'), 'utf8');
const checks = [
  ['Two-handed Defense added', /dk_twohanddef/.test(migration)],
  ['Official Dragon Knight list includes Two-handed Defense', /dk\.push\(passive\('dk_twohanddef'/.test(migration)],
  ['Storm Slash alias', /storm_slash:\s*'dk_stormslash'/.test(engine)],
  ['Hack and Slash alias', /hack_and_slash:\s*'dk_hackandslasher'/.test(engine)],
  ['Madness Crusher alias', /madness_crusher:\s*'dk_madnesscrusher'/.test(engine)],
  ['Servant Weapon Phantom alias', /servant_weapon_phantom:\s*'dk_servantphantom'/.test(engine)],
  ['Servant Weapon Demolition alias', /servant_weapon_demolition:\s*'dk_servantdemolition'/.test(engine)],
  ['Dragonic Breath alias', /dragonic_breath:\s*'dk_dragonicbreath'/.test(engine)],
  ['Dragonic Aura alias', /dragonic_aura:\s*'dk_dragonicaura'/.test(engine)],
  ['Dragonic Pierce alias', /dragonic_pierce:\s*'dk_dragonicpierce'/.test(engine)],
  ['Charging Pierce alias', /charging_pierce:\s*'dk_chargingpierce'/.test(engine)],
  ['Legacy alias resolution guarded by existing skill ID', /SKILLS\[sk\.id\]/.test(engine)],
];
let failed = 0;
for (const [name, ok] of checks) { console.log(`${ok ? 'PASS' : 'FAIL'} ${name}`); if (!ok) failed++; }
console.log(`${checks.length - failed}/${checks.length} passed`);
if (failed) process.exit(1);
