#!/usr/bin/env node
'use strict';
const fs = require('fs');
const path = require('path');
const root = path.resolve(__dirname, '..');
const engine = fs.readFileSync(path.join(root, 'js/engine.js'), 'utf8');
const data = fs.readFileSync(path.join(root, 'js/data.js'), 'utf8');
const checks = [];
function check(name, ok) { checks.push({name, ok: !!ok}); }
check('magic attack buff bucket exists', /cardAttackBuffs\s*=\s*\{\s*attack:\s*\[\],\s*hit:\s*\[\],\s*magic:\s*\[\]/.test(engine));
check('single-target magic hit invokes temporary equipment buffs', /if \(useMag\)\s*\{\s*tryCardAilments\('magic',\s*target\);\s*tryAttackBuffs\('magic',\s*target\);\s*\}/.test(engine));
check('AoE magic hit invokes temporary equipment buffs', /if \(useMag\)\s*\{\s*tryCardAilments\('magic',\s*mon\);\s*tryAttackBuffs\('magic',\s*mon\);\s*\}/.test(engine));
check('temporary buff supports multiple effect entries', /Array\.isArray\(e\.effects\)\s*\?\s*e\.effects/.test(engine));
check('same transformation group does not stack while active', /b\.buffGroup === group && b\.msRemaining > 0/.test(engine));
check('MATK transformation multiplier is 1.3', (data.match(/"type":"matk","mult":1\.3/g) || []).length === 4);
check('critical damage transformation bonus is +30%', (data.match(/"type":"critdmg","flatBonus":30/g) || []).length === 4);
check('physical and magical triggers are both registered on both item records', (data.match(/"on":"attack","chance":1,"durSec":5/g) || []).length === 2 && (data.match(/"on":"magic","chance":1,"durSec":5/g) || []).length === 2);
check('both Chung-E item aliases retain refine growth effects', (data.match(/"per2Refine":\{"expAllPct":1,"dropPct":1\}/g) || []).length >= 2);
const failed = checks.filter(x => !x.ok);
checks.forEach(x => console.log(`${x.ok ? 'PASS' : 'FAIL'} ${x.name}`));
console.log(`\\n${checks.length - failed.length}/${checks.length} checks passed`);
if (failed.length) process.exit(1);
