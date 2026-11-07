#!/usr/bin/env node
'use strict';
const fs = require('fs');
const path = require('path');
const root = path.resolve(__dirname, '..');
const engine = fs.readFileSync(path.join(root, 'js/engine.js'), 'utf8');
const skills = fs.readFileSync(path.join(root, 'js/skills.js'), 'utf8');
const v2 = fs.readFileSync(path.join(root, 'js/v2_content.js'), 'utf8');
const data = fs.readFileSync(path.join(root, 'js/data.js'), 'utf8');
const checks = [];
function check(name, ok) { checks.push({name, ok: !!ok}); }
check('per-skill cooldown helper exists', /function skillCooldownItemBonus\(skillId\)/.test(engine));
check('exact skillCd_<skillId> keys are consumed', /getCardBonus\('skillCd_' \+ skillId\)/.test(engine));
check('legacy Tiger Cannon item key maps to existing Inquisitor skill', /tigercannon:\s*'v2_in_tiger_cannon'/.test(engine) && /v2_in_tiger_cannon/.test(v2));
check('per-skill cooldown reduction joins global and exact-flat cooldown modifiers', /getCardBonus\('skillCdFlat'\)[\s\S]*?getCardBonus\('skillCdFlat_' \+ skillId\)[\s\S]*?skillCooldownItemBonus\(skillId\)/.test(engine));
check('cooldown reduction is converted from seconds to milliseconds', /\)\s*\* 1000;[\s\S]{0,220}Math\.max\(MIN_COOLDOWN_MS/.test(engine));
check('minimum cooldown floor remains 0.5 seconds', /const MIN_COOLDOWN_MS = 500/.test(engine));
check('Cart Tornado key remains in data pending its skill implementation', /skillCd_carttornado/.test(data));
check('Diamond Dust key remains in data pending its skill implementation', /skillCd_diamond_dust/.test(data));
check('Varetyr Spear key remains in data pending its skill implementation', /skillCd_holy_spear/.test(data));
const failed = checks.filter(x => !x.ok);
checks.forEach(x => console.log(`${x.ok ? 'PASS' : 'FAIL'} ${x.name}`));
console.log(`\n${checks.length - failed.length}/${checks.length} checks passed`);
if (failed.length) process.exit(1);
