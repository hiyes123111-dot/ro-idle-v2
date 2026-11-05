const fs = require('fs');
const engine = fs.readFileSync('js/engine.js', 'utf8');
const ui = fs.readFileSync('js/ui.js', 'utf8');
const html = fs.readFileSync('index.html', 'utf8');
const checks = [
  ['engine has no passive proc-stat state or recorder', !/recordRangerProc|resetRangerProcStats|rangerProcStats\s*[:=]/.test(engine)],
  ['UI has no passive proc-stat renderer or live refresh', !/rangerProcStatsMarkup|updateRangerProcStatsLive|ranger-proc-stats/.test(ui)],
  ['HTML has no passive proc-stat panel', !/ranger-proc-stats|被動觸發統計/.test(html)],
  ['per-skill ranger passive cooldown remains', /rangerPassiveReadyAt\[id\]/.test(engine)],
  ['ranger passive trigger chance remains', /procChance/.test(engine)],
  ['trap and passive damage paths remain', /rangerTrapProc|rangerPassive/.test(engine)],
];
for (const [name, ok] of checks) console.log(`${ok ? 'PASS' : 'FAIL'} ${name}`);
if (checks.some(x => !x[1])) process.exit(1);
