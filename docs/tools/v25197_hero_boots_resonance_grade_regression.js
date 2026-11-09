#!/usr/bin/env node
"use strict";
const fs = require("fs");
const path = require("path");
const root = path.join(__dirname, "..");
const data = fs.readFileSync(path.join(root, "js/data.js"), "utf8");
const engine = fs.readFileSync(path.join(root, "js/engine.js"), "utf8");
function check(ok, msg) { if (!ok) throw new Error(msg); console.log("PASS", msg); }
const pairIds = ["sword_of_bluefire_lt", "slate_sword_lt", "undine_spear_k_lt", "demon_hunting_bible_lt", "oneskyonesun_lt", "shadow_staff_k_lt", "freezing_rod_lt", "meawfoxtail_lt", "soulweight_lt", "freedom_stick_lt", "barb_wire_k_lt", "shiver_katar_k_lt", "blade_katar_lt", "iron_staff_lt", "blue_crystal_staff_lt", "crimson_rose_lt", "master_soul_rifle_lt", "demon_s_shot_lt", "the_black_gatling_lt", "golden_l_launcher_lt", "light_blade_lt", "magic_sword_lt", "fatalist_lt", "blessed_knife_lt", "soul_weight_lt", "iron_nail_k_lt", "ray_knuckle_lt", "trumpet_shell_k_lt", "saint_hall_lt", "meteor_striker_lt", "oriental_sword_lt", "dragonic_slayer_lt", "avenger_lt", "royal_bow_k_lt", "scalet_dragon_l_bow_lt", "narcis_bow_lt","dragonic_slayer_lt"];
const gradeIds = ["sword_of_bluefire_lt", "slate_sword_lt", "undine_spear_k_lt", "demon_hunting_bible_lt", "oneskyonesun_lt", "shadow_staff_k_lt", "freezing_rod_lt", "meawfoxtail_lt", "soulweight_lt", "freedom_stick_lt", "barb_wire_k_lt", "shiver_katar_k_lt", "blade_katar_lt", "iron_staff_lt", "blue_crystal_staff_lt", "crimson_rose_lt", "master_soul_rifle_lt", "demon_s_shot_lt", "the_black_gatling_lt", "golden_l_launcher_lt", "light_blade_lt", "magic_sword_lt", "fatalist_lt", "blessed_knife_lt", "soul_weight_lt", "iron_nail_k_lt", "ray_knuckle_lt", "trumpet_shell_k_lt", "saint_hall_lt", "meteor_striker_lt", "avenger_lt", "royal_bow_k_lt", "scalet_dragon_l_bow_lt", "narcis_bow_lt","dragonic_slayer_lt"];
for (const id of pairIds) {
  const line = data.split(/\r?\n/).find(x => x.trimStart().startsWith('"'+id+'"')) || "";
  check(!!line, id+" item exists");
  const pairCount = (line.match(/"hero_boots_lt"/g) || []).length;
  check(pairCount === 1 && line.includes("withAnyItem"),
    id+" has exactly one hero boots resonance condition");
  const pairClause = line.match(/withAnyItem":\["hero_boots_lt"\]\},"bonus":\{([^}]*)\}/);
  if (pairClause) check(!/(^|,)\s*(atk|matk)\s*:/.test(pairClause[1]),
    id+" paired percentage stats do not accidentally add flat ATK/MATK");
}
for (const id of gradeIds) {
  const line = data.split(/\r?\n/).find(x => x.trimStart().startsWith('"'+id+'"')) || "";
  for (const g of ['D','C','B']) {
    if (line.includes('"itemGradeMin":"'+g+'"')) check(true, id+" "+g+" grade condition is wired");
  }
}
const boot = data.split(/\r?\n/).find(x => x.trimStart().startsWith('"hero_boots_lt"')) || "";
for (const g of ['D','C','B','A']) check(boot.includes('"itemGradeMin":"'+g+'"'), "Hero Boots-LT "+g+" grade effect is wired");
check(boot.includes('"allPropertyDmgPct":10') && boot.includes('"allEleDmg":10'), "Hero Boots-LT C grade physical/magic all-element damage is wired");
const dragon = data.split(/\r?\n/).find(x => x.trimStart().startsWith('"dragonic_slayer_lt"')) || "";
for (const g of ['D','C','B']) check(dragon.includes('"itemGradeMin":"'+g+'"'), "Dragonic Slayer "+g+" grade effect is wired");
check(dragon.includes('"hpPct":3') && dragon.includes('"spPct":3'), "Dragonic Slayer D grade grants MHP/MSP +3%");
check(dragon.includes('"rangedDmgPct":15') && dragon.includes('"res":30') && dragon.includes('"mres":30'), "Dragonic Slayer C grade grants ranged damage, RES and MRES");
check(dragon.includes('"eleDmgReduce_all":15'), "Dragonic Slayer B grade grants all-element damage reduction");
check(engine.includes("itemGradeMin") && engine.includes("withAnyItem"), "engine evaluates item grade and equipment synergy conditions");
check(engine.includes("getCardBonus('pAtk')") && engine.includes("getCardBonus('sMatk')"),
  "P.ATK and S.MATK reach damage calculations");
console.log("v2.5.197 hero boots resonance and grade regression: PASS");
