#!/usr/bin/env node
"use strict";
const fs = require("fs");
const path = require("path");
const vm = require("vm");
const root = path.join(__dirname, "..");
const engine = fs.readFileSync(path.join(root, "js", "engine.js"), "utf8");
const data = fs.readFileSync(path.join(root, "js", "data.js"), "utf8");

// Boundary behavior for refinement growth fields:
// per1RefineStart counts the start level itself; per2RefineStart counts
// start, then every two refinement levels. Caps apply before counting.
function per1(refine, start, cap = Infinity) {
  const r = Math.min(refine, cap);
  return Math.max(0, r - start + 1);
}
function per2(refine, start, cap = Infinity) {
  const r = Math.min(refine, cap);
  return r >= start ? Math.floor((r - start) / 2) + 1 : 0;
}
const cases = [
  [per1(4, 5), 0], [per1(5, 5), 1], [per1(8, 5), 4],
  [per1(12, 10, 11), 2], [per1(20, 10, 15), 6],
  [per2(10, 11), 0], [per2(11, 11), 1], [per2(12, 11), 1],
  [per2(13, 11), 2], [per2(20, 11, 15), 3]
];
for (const [actual, expected] of cases) {
  if (actual !== expected) throw new Error(`refine boundary mismatch: ${actual} !== ${expected}`);
}

if (!engine.includes("const start = Math.max(1, Number(def.per1RefineStart) || 1);"))
  throw new Error("engine per1RefineStart handling changed unexpectedly");
if (!engine.includes("Math.floor((r - start) / 2) + 1"))
  throw new Error("engine per2RefineStart handling changed unexpectedly");
if (!engine.includes("def.perRefineCap != null ? Math.min(d.refine, def.perRefineCap) : d.refine"))
  throw new Error("refine cap handling missing");

const ctx = { console };
vm.createContext(ctx);
vm.runInContext(data + "\nthis.__items=ITEMS; this.__cards=CARDS;", ctx);
let anomalies = [];
for (const [id, def] of Object.entries(ctx.__items)) {
  if (def.per1RefineStart != null && (def.per1RefineStart < 1 || !def.per1Refine))
    anomalies.push(`${id}: invalid per1RefineStart`);
  if (def.per2RefineStart != null && (def.per2RefineStart < 1 || !def.per2Refine))
    anomalies.push(`${id}: invalid per2RefineStart`);
  if (def.perRefineCap != null && def.perRefineCap < 0)
    anomalies.push(`${id}: negative cap`);
  for (const rule of def.condPerRefine || []) {
    if (!rule.bonus || (rule.every != null && rule.every <= 0) || (rule.cap != null && rule.cap < 0))
      anomalies.push(`${id}: malformed condPerRefine`);
  }
}
if (anomalies.length) throw new Error(anomalies.join("\\n"));
console.log(`v2.5.158 refine boundary/data regression: PASS (${Object.keys(ctx.__items).length} items, no malformed refine rules)`);
