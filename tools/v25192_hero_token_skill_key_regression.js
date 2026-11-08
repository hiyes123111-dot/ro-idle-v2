#!/usr/bin/env node
"use strict";
const fs = require("fs");
const path = require("path");
const root = path.join(__dirname, "..");
const data = fs.readFileSync(path.join(root, "js/data.js"), "utf8");
const engine = fs.readFileSync(path.join(root, "js/engine.js"), "utf8");
const migration = fs.readFileSync(path.join(root, "js/v2_6_skill_migration.js"), "utf8");
const ui = fs.readFileSync(path.join(root, "js/ui.js"), "utf8");
const hero = data.split(/\r?\n/).find(line => line.includes('"hero_token_shc"')) || "";
function check(ok, msg) { if (!ok) throw new Error(msg); console.log("PASS", msg); }
check(hero.includes("skillDmg_sc_savageimpact:10"), "SHC refine bonus uses registered Savage Impact skill ID");
check(hero.includes("skillDmg_sc_eternalslash:10"), "SHC refine bonus uses registered Eternal Slash skill ID");
check(!hero.includes("skillDmg_v25_shadow_cross_"), "obsolete unregistered SHC skill keys removed");
check(migration.includes("sc_savageimpact") && migration.includes("sc_eternalslash"), "registered SHC skill IDs exist in engine migration");
check(ui.includes("['D','C','B','A','S'].map(g =>"), "weapon grade selector includes S grade");
check(engine.includes("({D:1,C:2,B:3,A:4,S:5}[key] || 0)"), "grade rank supports D/C/B/A/S ordering");
console.log("v2.5.192 hero token skill key regression: PASS");
