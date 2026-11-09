#!/usr/bin/env node
"use strict";
const fs = require("fs");
const path = require("path");
const src = fs.readFileSync(path.join(__dirname, "..", "js", "engine.js"), "utf8");
function section(start, end) {
  const a = src.indexOf(start);
  if (a < 0) throw new Error(`missing section start: ${start}`);
  const b = src.indexOf(end, a);
  if (b < 0) throw new Error(`missing section end: ${end}`);
  return src.slice(a, b);
}
const auto = section("function tryAutoSpells(trigger, mon) {", "/* 把「做成被動」的技能");
if (!auto.includes("lv = Math.max(1, Math.min(Number(sk.maxLv) || lv || 1, Number(lv) || 1));")) throw new Error("autoSpell path does not clamp level before dispatch");
if (auto.indexOf("lv = Math.max(1") > auto.indexOf("applyPassiveSkillOnce(sk, lv")) throw new Error("passive spell dispatched before clamp");
const chain = section("function tryChainSpells(afterSkillId, afterLv) {", "// 在城鎮安全區休息時");
if (!chain.includes("const lv = Math.max(1, Math.min(Number(sk.maxLv) || Number(e.lv) || 1, Number(e.lv) || 1));")) throw new Error("chain path does not clamp level");
if (!chain.includes("applyPassiveSkillOnce(sk, lv, 'chain'")) throw new Error("chain passive dispatch does not use clamped level");
console.log("v2.5.155 passive autoSpell level clamp regression: PASS");
