// v2.5.313 Windhawk Progressive Shot stack lifecycle regression
const fs=require('fs'),vm=require('vm'),assert=require('assert');
const src=fs.readFileSync('js/engine.js','utf8');
const start=src.indexOf('function nextProgressiveShotStack(');
const end=src.indexOf('\nfunction castSkillInner',start);
assert(start>=0&&end>start,'helper exists before skill cast');
const helper=src.slice(start,end);
const c={};vm.createContext(c);vm.runInContext(helper+';globalThis.next=nextProgressiveShotStack;',c);
const owner={};
assert.equal(c.next(owner,3,1000),1,'first cast is stack 1');
assert.equal(c.next(owner,3,5000),2,'second cast within 10s is stack 2');
assert.equal(c.next(owner,3,9000),3,'third cast within 10s is stack 3');
assert.equal(c.next(owner,3,12000),3,'stack capped at 3');
assert.equal(c.next(owner,3,23001),1,'more than 10s since previous cast resets to 1');
assert.equal(c.next(owner,3,24000),2,'next cast rebuilds stack');
assert(src.includes('state.windhawkProgressiveLastCastAt = 0;'),'map/death reset timestamp');
assert(src.includes('field.windhawkProgressiveLastCastAt = 0;'),'battle-end reset timestamp');
assert(src.includes('nextProgressiveShotStack(progressiveOwner, sk.progressiveShotMaxStacks)'),'cast path uses timeout helper');
console.log('v2.5.313 Progressive Shot lifecycle: PASS (stack 1→2→3, 10s timeout reset, map/death/battle reset hooks)');
