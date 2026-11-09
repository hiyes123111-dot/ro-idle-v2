const fs = require('fs');
const engine = fs.readFileSync('js/engine.js', 'utf8');
const ui = fs.readFileSync('js/ui.js', 'utf8');
const css = fs.readFileSync('css/style.css', 'utf8');
const checks = [
  ['new characters initialize per-skill ranger proc stats', /rangerProcStats:\s*\{\}/.test(engine)],
  ['stats helper records actual skill proc counters', /function recordRangerProc\(skillId, field/.test(engine)],
  ['ranger passives count eligible attacks and cooldown skips', /recordRangerProc\(id, 'eligible'\)/.test(engine) && /recordRangerProc\(id, 'cooldownSkips'\)/.test(engine)],
  ['ranger passives count actual chance rolls and successful procs', /recordRangerProc\(id, 'rolls'\)/.test(engine) && /recordRangerProc\(id, 'procs'\)/.test(engine)],
  ['traps count deterministic/probability checks and successful procs', /recordRangerProc\(skillId, 'rolls'\)/.test(engine) && /recordRangerProc\(skillId, 'procs'\)/.test(engine)],
  ['UI displays eligible checks, proc count, measured rate and cooldown skips', ['符合攻擊','觸發檢查','觸發','實測率','固定觸發','冷卻略過','剩餘CD'].every(x => ui.includes(x))],
  ['deterministic traps are labelled fixed-trigger rather than showing a misleading 100% rate', /!hasChance \? '固定觸發'/.test(ui)],
  ['trap proc lookup is validated before stats or cooldown handling', /const sk = findSkillById\(skillId\);\s*if \(!sk \|\| !sk\.rangerTrapProc/.test(engine)],
  ['UI updates live while auto battle tab is open', /activeTab === 'autobattle'\) updateRangerProcStatsLive\(\)/.test(ui)],
  ['stats can be reset and saved', /function resetRangerProcStats\(\)/.test(engine) && /onclick="resetRangerProcStats\(\)"/.test(ui)],
  ['responsive stats table styling exists', css.includes('.ab-proc-table')]
];
let failed = 0;
for (const [name, ok] of checks) { console.log(`${ok ? 'PASS' : 'FAIL'} ${name}`); if (!ok) failed++; }
if (failed) process.exit(1);
console.log(`Ranger proc stats regression — ${checks.length} checks passed.`);
