// v2.5.153 chain auto-spell fallback regression
const fs = require('fs');
const vm = require('vm');
const source = fs.readFileSync('js/engine.js', 'utf8');
function assert(ok, msg) { if (!ok) throw new Error(msg); }
const start = source.indexOf('function tryChainSpells(afterSkillId, afterLv) {');
const end = source.indexOf('\n}\n', start);
assert(start >= 0 && end > start, 'tryChainSpells function not found');
const fnSource = source.slice(start, end + 2);
function run(castResults) {
  const calls = [];
  const logs = [];
  const sandbox = {
    state: { cardAutoSpells: { chain: [
      { after: 'starter', skill: 'first', lv: 1, chance: 100 },
      { after: 'starter', skill: 'second', lv: 2, chance: 100 },
      { after: 'other', skill: 'ignored', lv: 1, chance: 100 }
    ] }, monsters: [{ id: 'target' }] },
    isBowWeapon: () => false,
    getEquipBaseItemId: () => 'sword',
    findSkillAnywhere: id => ({ id, name: id.toUpperCase(), type: 'active' }),
    castSkill: (id, opts) => { calls.push([id, opts.forceLv]); return castResults[id]; },
    applyPassiveSkillOnce: () => false,
    logMsg: msg => logs.push(msg),
    Math: { random: () => 0, min: Math.min, max: Math.max }
  };
  vm.runInNewContext(fnSource, sandbox);
  sandbox.tryChainSpells('starter', 1);
  return { calls, logs };
}
const failedFirst = run({ first: false, second: true });
assert(failedFirst.calls.map(x => x[0]).join(',') === 'first,second', 'failed first chain must fall through to second');
assert(failedFirst.logs.length === 1 && failedFirst.logs[0].includes('SECOND'), 'only successful fallback should log');
const successfulFirst = run({ first: true, second: true });
assert(successfulFirst.calls.map(x => x[0]).join(',') === 'first', 'successful first chain must stop this chain tier');
assert(successfulFirst.logs.length === 1 && successfulFirst.logs[0].includes('FIRST'), 'successful first chain should log once');
console.log('v2.5.153 chain auto-spell fallback regression: PASS');
