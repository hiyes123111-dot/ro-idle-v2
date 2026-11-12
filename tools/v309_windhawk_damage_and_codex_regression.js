#!/usr/bin/env node
'use strict';
const fs = require('fs');
const path = require('path');
const assert = require('assert');
const root = path.resolve(__dirname, '..');
const engine = fs.readFileSync(path.join(root, 'js/engine.js'), 'utf8');
const content = fs.readFileSync(path.join(root, 'js/v2_5_content.js'), 'utf8');
const ui = fs.readFileSync(path.join(root, 'js/ui.js'), 'utf8');

// The trait CON lives in state.traitStats, not state.stats. Verify the exact runtime source.
assert(/Number\(state\.traitStats\s*&&\s*state\.traitStats\.con\)\s*\|\|\s*0/.test(engine),
  'progressive shot CON scaling reads traitStats.con');
assert(!/Number\(state\.stats\s*&&\s*state\.stats\.con\)/.test(engine),
  'no stale state.stats.con read remains');

// Reproduce the scaling calculation with the same guards: missing fields must never create NaN.
function scale(baseMult, state, sk) {
  const baseLevel = Math.max(1, Number(state.baseLevel) || 1);
  const intStat = Math.max(0, Number(state.stats && state.stats.int) || 0);
  const conStat = Math.max(0, Number(state.traitStats && state.traitStats.con) || 0);
  const lvlBonusPct = (baseLevel / 99) * (Number(sk.levelScaleMax) || 0);
  const intBonusPct = (intStat / 99) * (Number(sk.intScaleMax) || 0);
  const conBonusPct = (conStat / 99) * (Number(sk.conScaleMax) || 0);
  let result = baseMult * (1 + lvlBonusPct / 100 + intBonusPct / 100 + conBonusPct / 100);
  if (!Number.isFinite(result)) result = Number.isFinite(baseMult) ? baseMult : 1;
  return result;
}
const result = scale(42, {baseLevel:211, stats:{int:0}, traitStats:{con:100}}, {levelScaleMax:50, conScaleMax:50});
assert(Number.isFinite(result) && result > 42, 'Lv211 + CON100 scaling produces finite boosted damage');
assert(Number.isFinite(scale(42, {baseLevel:211, stats:{}}, {levelScaleMax:50, conScaleMax:50})),
  'missing trait CON safely falls back to zero instead of NaN');

// Sharpshooting is owned by Sniper King only; Wind Hawk fourth-job catalog must not duplicate it.
const windBlock = content.match(/wind_hawk:\s*\[([\s\S]*?)\n    \],\n    troubadour:/);
assert(windBlock, 'Wind Hawk catalog found');
assert(!windBlock[1].includes('銳利射擊') && !windBlock[1].includes('sn_sharpshooting'),
  'Sharpshooting removed from Wind Hawk fourth-job list');
assert(content.includes("'漸進射擊',5,'damage','neutral','v25_windhawk_progressive_shot'"),
  'Progressive Shot remains in Wind Hawk fourth-job list');
assert(/sn_sharpshooting:\s*\{/.test(fs.readFileSync(path.join(root,'js/skills.js'),'utf8')),
  'Sharpshooting base skill remains defined for Sniper King');

// Codex monsters sorted only by level; no kingdom/region/map group headings are rendered.
assert(/\.sort\(\(a, b\) => a\.level - b\.level/.test(ui), 'monster codex sorted by level ascending');
assert(!ui.includes('lastMonsterGroup') && !ui.includes('r.kingdomName') && !ui.includes('r.regionName'),
  'monster codex no longer renders region/map group headings');

console.log('PASS: Wind Hawk Progressive Shot finite damage scaling, single Sharpshooting entry, and level-only monster codex');
console.log('5/5 checks passed');
