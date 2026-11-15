const fs = require('fs');
const vm = require('vm');
const src = fs.readFileSync('js/engine.js', 'utf8');
const start = src.indexOf('const _monsterAilmentListCache = new WeakMap();');
const end = src.indexOf('function ailFold', start);
if (start < 0 || end < 0) throw new Error('ailment cache block not found');
const block = src.slice(start, end);

let now = 1000;
const sandbox = {
  MON_AILMENTS: {
    poison:{name:'中毒'}, blind:{name:'黑暗'}, sleep:{name:'睡眠',breakOnHit:true}
  },
  Date: { now: () => now }
};
vm.createContext(sandbox);
vm.runInContext(block, sandbox);

const mon = {ail:{poison:5000, blind:3000, unknown:9000}};
const first = sandbox.ailList(mon);
if (first.join(',') !== 'poison,blind') throw new Error('active list incorrect');
const second = sandbox.ailList(mon);
if (first !== second) throw new Error('active list not cached');

now = 2999;
if (sandbox.ailList(mon) !== first) throw new Error('cache should remain valid before earliest expiry');
now = 3000;
const afterExpiry = sandbox.ailList(mon);
if (afterExpiry === first || afterExpiry.join(',') !== 'poison') throw new Error('cache did not refresh at expiry');

mon.ail.sleep = 7000;
sandbox.invalidateMonsterAilmentCache(mon);
const afterApply = sandbox.ailList(mon);
if (afterApply.join(',') !== 'poison,sleep') throw new Error('explicit invalidation after apply failed');

delete mon.ail.sleep;
sandbox.invalidateMonsterAilmentCache(mon);
if (sandbox.ailList(mon).join(',') !== 'poison') throw new Error('explicit invalidation after removal failed');

if (sandbox.ailList(null).length !== 0) throw new Error('null monster should return empty list');
if (!/mon\.ail\.stun = Math\.max\([\s\S]*?invalidateMonsterAilmentCache\(mon\)/.test(src)) throw new Error('applyStun missing invalidation');
if (!/delete mon\.ail\.stun; delete mon\.ail\.freeze; \}\s*invalidateMonsterAilmentCache\(mon\)/.test(src)) throw new Error('wakeIfFrozen missing invalidation');
console.log('PASS active ailment list cached and reused');
console.log('PASS cache expires at earliest active ailment deadline');
console.log('PASS apply/remove invalidation refreshes immediately');
console.log('PASS unknown/expired ailments excluded; null safe');
console.log('PASS all direct ailment mutation paths invalidate cache');
console.log('5/5 passed');
