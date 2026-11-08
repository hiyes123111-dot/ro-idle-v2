#!/usr/bin/env node
"use strict";
const fs = require("fs");
const path = require("path");
const root = path.join(__dirname, "..");
const data = fs.readFileSync(path.join(root, "js/data.js"), "utf8");
const engine = fs.readFileSync(path.join(root, "js/engine.js"), "utf8");
function check(ok, msg) { if (!ok) throw new Error(msg); console.log("PASS", msg); }
const line = data.split(/\r?\n/).find(x => x.trimStart().startsWith('"thanos_dagger_ad"')) || "";
check(!!line, "Thanos Dagger-AD item exists");
check(line.includes('"per2Refine":{"matk":10}'), "refine +2 grants MATK +10 only");
check(!line.includes('"per2Refine":{"atk":10,"matk":10}'), "refine +2 no longer incorrectly grants ATK +10");
check(line.includes('"itemGradeMin":"D"') && line.includes('"matkPct":2'), "D grade grants MATK +2%");
check(line.includes('"itemGradeMin":"C"') && line.includes('"matkPct":3') && line.includes('"sMatk":1'), "C grade grants MATK +3% and S.MATK +1");
check(line.includes('"refineMin":7') && line.includes('"refineMin":11'), "refine +7 and +11 effects retained");
check(engine.includes("itemGradeMin"), "equipment condition engine supports item grade checks");
check(engine.includes("sMatk"), "S.MATK stat is supported by engine");
console.log("v2.5.194 Thanos Dagger-AD regression: PASS");
