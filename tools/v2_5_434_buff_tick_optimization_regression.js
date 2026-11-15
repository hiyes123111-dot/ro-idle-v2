const fs = require('fs');
const vm = require('vm');
const src = fs.readFileSync('js/engine.js', 'utf8');
const start = src.indexOf('function tickBuffs() {');
const end = src.indexOf('\n}\n\n// ASPD 計算', start);
if (start < 0 || end < 0) throw new Error('tickBuffs block not found');
const fn = src.slice(start, end + 2);

function makeSandbox(initialState) {
  const calls = { recompute:0, hot:0, dk:0, logs:[] };
  const sandbox = {
    state: initialState,
    TICK_MS:100,
    Date,
    dkTickChargingPierce(){calls.dk++;},
    tickCardinalHotForCurrentState(){calls.hot++;},
    recomputeDerived(){calls.recompute++;},
    logMsg(m){calls.logs.push(m);},
    SKILLS:{}
  };
  vm.createContext(sandbox);
  vm.runInContext(fn, sandbox);
  return {sandbox,calls};
}

// No buff expiry: countdown still advances, no array replacement, no derived recalculation.
{
  const buffs=[{type:'agiflat',flatBonus:10,msRemaining:500}];
  const {sandbox,calls}=makeSandbox({buffs,sp:100});
  sandbox.tickBuffs();
  if (sandbox.state.buffs !== buffs) throw new Error('buff array identity changed without expiry');
  if (buffs[0].msRemaining !== 400) throw new Error('buff countdown changed incorrectly');
  if (calls.recompute !== 0) throw new Error('recompute ran without a buff change');
  if (calls.hot !== 1 || calls.dk !== 1) throw new Error('tick side effects were skipped');
}

// Expiry: buff is removed and derived stats are recalculated exactly once.
{
  const buffs=[{type:'agiflat',flatBonus:10,msRemaining:50}];
  const {sandbox,calls}=makeSandbox({buffs,sp:100});
  sandbox.tickBuffs();
  if (sandbox.state.buffs.length !== 0) throw new Error('expired buff not removed');
  if (calls.recompute !== 1) throw new Error('expiry did not recalculate exactly once');
}

// SP shortage removes striking before the expiry pass; this must still recalculate.
{
  const buffs=[{skillId:'so_striking',spDrainPerSec:10,spDrainAccumulatorMs:900,msRemaining:5000}];
  const {sandbox,calls}=makeSandbox({buffs,sp:0});
  sandbox.tickBuffs();
  if (sandbox.state.buffs.length !== 0) throw new Error('SP-starved striking buff not removed');
  if (calls.recompute !== 1) throw new Error('early SP removal did not recalculate');
  if (!calls.logs.some(x=>x.includes('SP 不足'))) throw new Error('SP shortage message missing');
}

// Normal SP drain keeps the buff and does not force a derived-stat rebuild.
{
  const buffs=[{skillId:'so_striking',spDrainPerSec:10,spDrainAccumulatorMs:900,msRemaining:5000}];
  const {sandbox,calls}=makeSandbox({buffs,sp:50});
  sandbox.tickBuffs();
  if (sandbox.state.sp !== 40) throw new Error('SP upkeep changed');
  if (buffs[0].spDrainAccumulatorMs !== 0) throw new Error('SP accumulator changed');
  if (calls.recompute !== 0) throw new Error('recompute ran for normal SP upkeep');
}

// Repeated stable ticks: no repeated expensive derived-stat rebuilds.
{
  const buffs=[{type:'agiflat',flatBonus:10,msRemaining:5000}];
  const {sandbox,calls}=makeSandbox({buffs,sp:100});
  for(let i=0;i<10;i++) sandbox.tickBuffs();
  if (calls.recompute !== 0) throw new Error('stable buff caused repeated recalculation across 10 ticks');
  if (buffs[0].msRemaining !== 4000) throw new Error('10-tick duration countdown incorrect');
}

// Several buffs expiring on the same tick trigger one rebuild, not one per buff.
{
  const buffs=[
    {type:'agiflat',flatBonus:10,msRemaining:50},
    {type:'lukflat',flatBonus:10,msRemaining:50},
    {type:'statpct',mult:0.1,msRemaining:50}
  ];
  const {sandbox,calls}=makeSandbox({buffs,sp:100});
  sandbox.tickBuffs();
  if (sandbox.state.buffs.length !== 0) throw new Error('simultaneously expired buffs not removed');
  if (calls.recompute !== 1) throw new Error('multiple expiries caused more than one rebuild');
}

console.log('PASS stable buff countdown avoids derived-stat recalculation');
console.log('PASS buff expiry recalculates derived stats once');
console.log('PASS SP-starved striking removal recalculates immediately');
console.log('PASS normal striking SP upkeep remains unchanged');
console.log('PASS 10 stable ticks perform zero redundant recalculations');
console.log('PASS simultaneous expiries trigger one recalculation');
console.log('6/6 passed');
