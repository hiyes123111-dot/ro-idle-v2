const fs = require('fs');
const data = fs.readFileSync('js/data.js', 'utf8');
const engine = fs.readFileSync('js/engine.js', 'utf8');
const skills = fs.readFileSync('js/skills.js', 'utf8');
const checks = [
  ['Mjolnir declares ASPD cap effect', /"mjolnir"[\s\S]*?"aspdMax":true/.test(data)],
  ['Mjolnir auto-casts Thunderstorm Lv.10 on melee attacks', /"mjolnir"[\s\S]*?"autoSpell":\[\{\"on\":\"attack\",\"skill\":\"thunderstorm\",\"lv\":10,\"chance\":10,\"melee\":true\}\]/.test(data) && /"id":"thunderstorm"[\s\S]*?"maxLv":10/.test(skills)],
  ['Mjolnir grants a 10-second timed splash buff on attack', /"mjolnir"[\s\S]*?"durSec":10[\s\S]*?"buffType":"splashAttack"/.test(data)],
  ['Timed splash buff is consumed by normal attack splash handler', /b\.type === 'splashAttack' && b\.msRemaining > 0/.test(engine) && /if \(!state\.cardSplashAttack && !timedSplash\) return/.test(engine)],
  ['Mjolnir ASPD effect reaches the current official cap while equipped', /weaponDef && weaponDef\.aspdMax\) state\.aspd = cap/.test(engine)],
  ['Equipment autoSpell and onAttackBuff are collected into the shared combat triggers', /\(def\.autoSpell \|\| \[\]\)\.forEach/.test(engine) && /\(def\.onAttackBuff \|\| \[\]\)\.forEach/.test(engine)],
];
let failed = 0;
for (const [name, ok] of checks) { console.log(`${ok ? 'PASS' : 'FAIL'} ${name}`); if (!ok) failed++; }
console.log(`\nMjolnir regression: ${checks.length - failed}/${checks.length} passed.`);
process.exitCode = failed ? 1 : 0;
