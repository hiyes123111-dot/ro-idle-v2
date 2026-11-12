// v2.5.314 Windhawk Progressive Shot damage stack regression
const fs=require('fs'),vm=require('vm'),assert=require('assert');
const src=fs.readFileSync('js/engine.js','utf8');
const start=src.indexOf('function nextProgressiveShotStack(');
const end=src.indexOf('\nfunction castSkillInner',start);
assert(start>=0&&end>start,'stack helper exists');
const c={};vm.createContext(c);vm.runInContext(src.slice(start,end)+';globalThis.next=nextProgressiveShotStack;',c);
const owner={};
const stacks=[c.next(owner,3,1000),c.next(owner,3,2000),c.next(owner,3,3000)];
assert.deepStrictEqual(stacks,[1,2,3]);
const multipliers=stacks.map(n=>1+n*0.10);
assert.deepStrictEqual(multipliers,[1.1,1.2,1.3]);
const base=42; // Lv5 4200%
assert.deepStrictEqual(multipliers.map(m=>Math.round(base*m*100)),[4620,5040,5460]);
assert.equal(c.next(owner,3,14001),1,'10s idle resets to stack one');
assert(src.includes('skillMult *= (1 + progressiveStacks * 0.10);'),'damage uses additive 10% per stack');
assert(!src.includes('skillMult *= progressiveStacks;'),'old x1/x2/x3 multiplier removed');
console.log('v2.5.314 Progressive Shot damage: PASS (4200% -> 4620% / 5040% / 5460%)');
