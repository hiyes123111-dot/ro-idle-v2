#!/usr/bin/env node
'use strict';
const fs = require('fs');
const path = require('path');
const root = path.resolve(__dirname, '..');
const engine = fs.readFileSync(path.join(root, 'js/engine.js'), 'utf8');
const data = fs.readFileSync(path.join(root, 'js/data.js'), 'utf8');
const checks = [];
function check(name, ok) { checks.push({name, ok: !!ok}); }
const helm = data.match(/"helm_of_mid_sol_god"\s*:\s*\{[\s\S]*?\n\s*"helm_of_sun"\s*:/);
check('Sun God helm data exists', !!helm);
check('refine +7 has melee, ranged and magic +15%', !!helm && /refineMin["']?\s*:\s*7/.test(helm[0]) && /rangedDmgPct["']?\s*:\s*15/.test(helm[0]) && /meleeDmgPct["']?\s*:\s*15/.test(helm[0]) && /magicDmgPct["']?\s*:\s*15/.test(helm[0]));
check('melee damage bonus is read in shared physical weapon chain', /getCardBonus\('meleeDmgPct'\)/.test(engine) && /meleePct \+ rangedPct/.test(engine));
check('ranged damage bonus is read in shared physical weapon chain', /getCardBonus\('rangedDmgPct'\)/.test(engine) && /const isRangedAttack = sk[\s\S]{0,160}sk\.rangeType === 'ranged'[\s\S]{0,100}isBowWeapon\(wId\)/.test(engine));
check('melee and ranged bonuses are mutually exclusive by weapon category', /!isRangedAttack[\s\S]{0,120}getCardBonus\('meleeDmgPct'\)/.test(engine) && /isRangedAttack && typeof getCardBonus/.test(engine));
check('physical bonuses are applied in shared chain for normal and skill attacks', /return \(wpn \* variance[\s\S]*?meleePct \+ rangedPct/.test(engine));
check('magic damage bonus is read in shared magic skill base', /targetPct \+= getCardBonus\('magicDmgPct'\)/.test(engine));
check('ranged bonus is no longer double-applied in playerAttack', !/state\.cardRangedDmgPct && isBowWeapon\(atkWeaponId\)/.test(engine));
check('helm refine +9/+11/+13 effects remain in data', !!helm && /refineMin["']?\s*:\s*9/.test(helm[0]) && /hpPct["']?\s*:\s*30/.test(helm[0]) && /refineMin["']?\s*:\s*11/.test(helm[0]) && /patk["']?\s*:\s*20/.test(helm[0]) && /smatk["']?\s*:\s*20/.test(helm[0]) && /refineMin["']?\s*:\s*13/.test(helm[0]) && /allRaceDmgPct["']?\s*:\s*15/.test(helm[0]));
const failed = checks.filter(x => !x.ok);
checks.forEach(x => console.log(`${x.ok ? 'PASS' : 'FAIL'} ${x.name}`));
console.log(`\n${checks.length - failed.length}/${checks.length} checks passed`);
if (failed.length) process.exit(1);
