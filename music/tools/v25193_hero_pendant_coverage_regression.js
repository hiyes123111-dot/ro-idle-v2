#!/usr/bin/env node
"use strict";
const fs = require("fs");
const path = require("path");
const root = path.join(__dirname, "..");
const data = fs.readFileSync(path.join(root, "js/data.js"), "utf8");
const engine = fs.readFileSync(path.join(root, "js/engine.js"), "utf8");
const ui = fs.readFileSync(path.join(root, "js/ui.js"), "utf8");
const expected = {
  hero_token_ag: ["iron_staff_lt","blue_crystal_staff_lt"],
  hero_token_wh: ["royal_bow_k_lt","scalet_dragon_l_bow_lt"],
  hero_token_ig: ["undine_spear_k_lt","light_blade_lt"],
  hero_token_cd: ["saint_hall_lt","demon_hunting_bible_lt"],
  hero_token_abc: ["magic_sword_lt","fatalist_lt"],
  hero_token_dk: ["dragonic_slayer_lt","oriental_sword_lt"],
  hero_token_bo: ["sword_of_bluefire_lt","slate_sword_lt"],
  hero_token_em: ["freezing_rod_lt","shadow_staff_k_lt"],
  hero_token_tr: ["narcis_bow_lt","trumpet_shell_k_lt","barb_wire_k_lt"],
  hero_token_mt: ["avenger_lt","meteor_striker_lt"],
  hero_token_iq: ["iron_nail_k_lt","ray_knuckle_lt"]
};
function check(ok, msg) { if (!ok) throw new Error(msg); console.log("PASS", msg); }
for (const [token, ids] of Object.entries(expected)) {
  const line = data.split(/\r?\n/).find(x => x.includes('"'+token+'"')) || "";
  check(!!line, token+" record exists");
  check(line.includes("itemRefineMin:10"), token+" has refine +10 conditions");
  check(line.includes("itemGradeMin:'C'") || line.includes('itemGradeMin:"C"'), token+" has C-grade conditions");
  for (const id of ids) check(line.includes('"'+id+'"'), token+" references "+id);
}
check(data.includes("sizeDmgReduce_small:10") &&
      data.includes("sizeDmgReduce_medium:10") &&
      data.includes("sizeDmgReduce_large:10"),
      "Dragon Knight Oriental Sword reduction is wired for all sizes");
check(data.includes("allSizeMagicDmgPct:15"), "magic all-size bonus has a dedicated calculation key");
check(engine.includes("getCardBonus('allSizeMagicDmgPct')"), "magic all-size bonus is consumed by magic damage formula");
check(engine.includes("cardSizeDmgReduce"), "size damage reduction is routed to incoming damage calculation");
check(ui.includes("['D','C','B','A','S'].map(g =>"), "grade selector supports D/C/B/A/S");
console.log("v2.5.193 hero pendant coverage regression: PASS");
