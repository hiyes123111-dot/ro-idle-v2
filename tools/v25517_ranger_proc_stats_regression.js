const fs = require('fs');
const engine = fs.readFileSync('js/engine.js', 'utf8');
const ui = fs.readFileSync('js/ui.js', 'utf8');
const css = fs.readFileSync('css/style.css', 'utf8');
const checks = [
  ['new characters initialize persistent Ranger trap proc stats', /rangerProcStats:\s*\{\}/.test(engine)],
  ['stats helper records per-skill trigger counters', /function recordRangerProc\(skillId, field/.test(engine)],
  ['eligible attacks are counted before cooldown checks', /recordRangerProc\(skillId, 'eligible'\)/.test(engine)],
  ['cooldown skips are counted separately from chance rolls', /recordRangerProc\(skillId, 'cooldownSkips'\)/.test(engine)],
  ['probability rolls and successful triggers are counted separately', /recordRangerProc\(skillId, 'rolls'\)/.test(engine) && /recordRangerProc\(skillId, 'procs'\)/.test(engine)],
  ['fixed triggers are not misreported as a 100% probability rate', /recordRangerProc\(skillId, 'fixedTriggers'\)/.test(engine) && ui.includes('固定觸發')],
  ['stats snapshot and reset helpers exist', /function rangerProcStatsSnapshot\(\)/.test(engine) && /function resetRangerProcStats\(\)/.test(engine)],
  ['UI displays eligible checks, rolls, procs, measured rate and cooldown skips', ['符合攻擊','觸發檢查','觸發','實測率','冷卻略過'].every(x => ui.includes(x))],
  ['stats update live while auto battle tab is open', /activeTab === 'autobattle'\) updateRangerProcStatsLive\(\)/.test(ui)],
  ['stats reset button is wired to saved reset action', /resetRangerProcStats\(\);updateRangerProcStatsLive\(\)/.test(ui)],
  ['responsive stats table styling exists', css.includes('.ab-proc-table')]
];
let failed = 0;
for (const [name, ok] of checks) { console.log(`${ok ? 'PASS' : 'FAIL'} ${name}`); if (!ok) failed++; }
if (failed) process.exit(1);
console.log(`Ranger trap proc stats regression — ${checks.length} checks passed.`);
