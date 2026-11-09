const fs = require('fs');
const path = require('path');
const root = path.resolve(__dirname, '..');
const engine = fs.readFileSync(path.join(root, 'js/engine.js'), 'utf8');
const skills = fs.readFileSync(path.join(root, 'js/skills.js'), 'utf8');
const jobs = fs.readFileSync(path.join(root, 'js/jobs.js'), 'utf8');
const checks = [
  ['治癒誓言 helper 不再遞迴呼叫自身', (()=>{const b=engine.split('function tickCardinalHotForCurrentState(now)')[1]?.split('function tickBuffs()')[0]||'';return b.includes('function')===false && !b.includes('tickCardinalHotForCurrentState(now)');})()],
  ['治癒誓言依目前 HP 比例計算', /Math\.round\(\(state\.hp \|\| 0\) \* \(b\.healPct \|\| 0\) \/ 100\)/.test(engine)],
  ['玩家 tick 與隊友 tick 共用治癒誓言 helper', /tickCardinalHotForCurrentState\(now\);/.test(engine) && /withAlly\(ally, \(\) => \{[\s\S]*?tickCardinalHotForCurrentState\(Date\.now\(\)\)/.test(engine)],
  ['充能貫穿範圍技能所有指定技能均累積一層', /else dkRecordChargingSkill\(sk\.id\);/.test(engine)],
  ['充能貫穿仍只認四種指定技能', /new Set\(\['pierce','lk_spiralpierce','rk_hundredspear','dk_madnesscrusher'\]\)/.test(engine)],
  ['樞機主教技能樹包含新增的鈍器＆書籍精熟（共17項）', /cd_mace_book_m/.test(skills) && /skills: \['cd_mace_book_m'/.test(jobs) && ((jobs.match(/skills: \['cd_mace_book_m'[^\n]+/) || [''])[0].match(/'cd_[^']+'/g) || []).length === 17],
  ['鈍器＆書籍精熟按武器類型與怪物體型套用', /function cardinalMaceBookMasteryPct\(monDef\)/.test(engine) && /cardinalMaceBookMasteryPct\(monDef\)/.test(engine) && /weaponReqMet\('mace_book'\)/.test(engine)],
  ['神聖權能使用 P.ATK／S.MATK 固定增益與官方持續時間', /duration:\[180,210,240,270,300\]/.test(skills) && /push\('pAtk', 1, value\)/.test(engine) && /push\('sMatk', 1, value\)/.test(engine) && /buffMult\('pAtk'\)\.flatBonus/.test(engine) && /buffMult\('sMatk'\)\.flatBonus/.test(engine)],
  ['樞機主教技能顯示名稱已校正', /cd_petitio:[^\n]*name:'聖光打擊'/.test(skills) && /cd_arbitrium:[^\n]*name:'制裁謳歌'/.test(skills) && /cd_pneumaticus_procella:[^\n]*name:'驅魔風暴'/.test(skills)],
];
let failed = 0;
for (const [name, ok] of checks) { console.log(`${ok ? 'PASS' : 'FAIL'} ${name}`); if (!ok) failed++; }
console.log(`\n${checks.length - failed}/${checks.length} passed`);
process.exit(failed ? 1 : 0);
