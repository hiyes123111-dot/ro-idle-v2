#!/usr/bin/env node
"use strict";
const fs = require("fs");
const path = require("path");
const src = fs.readFileSync(path.join(__dirname, "..", "js", "engine.js"), "utf8");
const start = src.indexOf("function tryAutoSpells(trigger, mon) {");
const end = src.indexOf("/* 把「做成被動」的技能", start);
if (start < 0 || end < 0) throw new Error("tryAutoSpells section not found");
const body = src.slice(start, end);
const guards = [
  ["buff", "state.buffs && state.buffs.some(b => b.skillId === sk.id)"],
  ["shield", "state.shields && state.shields.some(sh => sh.id === sk.id)"],
  ["active field", "state.activeFieldEffects && state.activeFieldEffects.some(f => f.skillId === sk.id)"]
];
for (const [label, guard] of guards) {
  if (!body.includes(guard)) throw new Error(`missing ${label} active-effect guard`);
}
if (body.indexOf(guards[2][1]) > body.indexOf("const ok = sk.type === 'passive'"))
  throw new Error("active field guard must run before autocast dispatch");
console.log("v2.5.156 autoSpell active-field guard regression: PASS");
