'use strict';
const fs = require('fs');
const engine = fs.readFileSync('js/engine.js', 'utf8');
const ui = fs.readFileSync('js/ui.js', 'utf8');
const html = fs.readFileSync('index.html', 'utf8');
const checks = [
  ['active skills checked at each real player swing', /if \(state\.autoSkill\) tryAutoCastSkill\(\);\s*playerAttack\(\);/.test(engine)],
  ['active skills no longer depend on one-second slow tick', !/checkAchievements\(\);\s*if \(state\.autoSkill\)\s*tryAutoCastSkill\(\);/.test(engine)],
  ['diagnostic reports missing selected skills', /尚未選擇第一招或第二招/.test(engine)],
  ['diagnostic reports weapon requirement', /不符合武器需求/.test(engine)],
  ['diagnostic reports SP threshold', /未達 SP 保留門檻/.test(engine)],
  ['combat log renderer has RAF fallback', /typeof requestAnimationFrame === 'function'[\s\S]*?setTimeout/.test(ui)],
  ['runtime references use 2.5.449', /js\/engine\.js\?v=2\.5\.449/.test(html) && fs.readFileSync('VERSION.txt','utf8').trim()==='2.5.449']
];
let failed=0;
for (const [name,ok] of checks) { console.log(`${ok?'PASS':'FAIL'} ${name}`); if(!ok) failed++; }
process.exitCode=failed?1:0;
