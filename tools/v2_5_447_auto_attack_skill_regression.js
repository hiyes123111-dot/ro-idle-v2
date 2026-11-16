#!/usr/bin/env node
'use strict';
// Regression for automatic attack skill slots: a failed first slot must not starve slot 2.
const fs = require('fs');
const path = require('path');
const vm = require('vm');
const source = fs.readFileSync(path.join(__dirname, '..', 'js', 'engine.js'), 'utf8');
function extractFunction(name) {
  const marker = `function ${name}(`;
  const start = source.indexOf(marker);
  if (start < 0) throw new Error(`Missing ${name}`);
  const brace = source.indexOf('{', start);
  let depth = 0, quote = null, escaped = false;
  for (let i = brace; i < source.length; i++) {
    const c = source[i];
    if (quote) {
      if (escaped) escaped = false;
      else if (c === '\\') escaped = true;
      else if (c === quote) quote = null;
      continue;
    }
    if (c === '"' || c === "'" || c === '`') { quote = c; continue; }
    if (c === '{') depth++;
    if (c === '}' && --depth === 0) return source.slice(start, i + 1);
  }
  throw new Error(`Unclosed ${name}`);
}
const fn = extractFunction('tryAutoCastSkill');
function harness(overrides = {}) {
  const calls = [];
  const skills = {
    first: { id: 'first', type: 'damage', spCost: 10, maxLv: 5 },
    second: { id: 'second', type: 'damage_aoe', spCost: 20, maxLv: 5 }
  };
  const ctx = {
    state: { autoSkillConfig: { skillId: 'first', skillId2: 'second', spThreshold: 30, spThreshold2: 50, monsterCount2: 2 }, sp: 90, maxSp: 100, monsters: [{hp:100},{hp:100}], learnedSkills: {} },
    findSkillForUse: id => skills[id] || null,
    skillLv: () => 5,
    skillReady: () => true,
    weaponReqMet: () => true,
    equipReqMet: () => true,
    skillNeedsMonster: sk => ['damage','damage_aoe'].includes(sk.type),
    skillSpCost: sk => sk.spCost,
    wastesResourceInTown: () => false,
    castSkill: id => { calls.push(id); return overrides.cast ? overrides.cast(id) : true; },
    Number, Math
  };
  vm.createContext(ctx);
  vm.runInContext(fn, ctx);
  return { ctx, calls, run: () => ctx.tryAutoCastSkill() };
}
let t = harness({ cast: id => id === 'first' ? false : true });
if (t.run() !== true || t.calls.join(',') !== 'first,second') throw new Error('first-slot failure did not fall through to second slot');

t = harness();
if (t.run() !== true || t.calls.join(',') !== 'first') throw new Error('successful first slot should stop before second');

t = harness();
t.ctx.state.autoSkillConfig.spThreshold = undefined;
if (t.run() !== true || t.calls[0] !== 'first') throw new Error('legacy missing first-slot SP threshold should default to 30%');

t = harness({ cast: id => id === 'first' ? false : true });
t.ctx.state.monsters = [{hp:100}];
if (t.run() !== false || t.calls.join(',') !== 'first') throw new Error('second slot must respect its monster-count threshold');

t = harness({ cast: () => false });
if (t.run() !== false || t.calls.join(',') !== 'first,second') throw new Error('both failed slots should return false without blocking the loop');
console.log('PASS v2.5.447 automatic attack skill regression (5/5)');
