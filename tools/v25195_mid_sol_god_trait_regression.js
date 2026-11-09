#!/usr/bin/env node
"use strict";
const fs = require("fs");
const path = require("path");
const root = path.join(__dirname, "..");
const data = fs.readFileSync(path.join(root, "js/data.js"), "utf8");
const engine = fs.readFileSync(path.join(root, "js/engine.js"), "utf8");
function check(ok, msg) { if (!ok) throw new Error(msg); console.log("PASS", msg); }
const line = data.split(/\r?\n/).find(x => x.trimStart().startsWith('"helm_of_mid_sol_god"')) || "";
check(!!line, "Midgard Sun God Helm record exists");
check(line.includes('"per3Refine":{"pow":2,"sta":2,"wis":2,"spl":2,"con":2,"crt":2}'),
  "every +3 refine grants all six fourth-job traits +2");
check(!line.includes('"per3Refine":{"str":2,"agi":2,"vit":2,"int":2,"dex":2,"luk":2}'),
  "classic six stats are no longer incorrectly used for the trait bonus");
check(line.includes('"refineMin":11') && line.includes('"patk":20') && line.includes('"smatk":20'),
  "refine +11 P.ATK +20 and S.MATK +20 retained");
check(line.includes('"refineMin":7') && line.includes('"refineMin":9') && line.includes('"refineMin":13'),
  "refine +7/+9/+13 effects retained");
for (const key of ["pow","sta","wis","spl","con","crt"]) {
  check(engine.includes("getCardBonus('"+key+"')"), key.toUpperCase()+" is consumed by derived-stat calculation");
}
check(engine.includes("getCardBonus('pAtk')"), "P.ATK bonus enters physical damage multiplier");
check(engine.includes("getCardBonus('sMatk')"), "S.MATK bonus enters magic damage multiplier");
check(engine.includes("Math.floor(r / 3)"), "per3Refine applies once per three refine levels");
console.log("v2.5.195 Midgard Sun God Helm trait regression: PASS");
