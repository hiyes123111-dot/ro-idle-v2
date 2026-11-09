#!/usr/bin/env node
"use strict";
const fs = require("fs");
const path = require("path");
const vm = require("vm");
const root = path.join(__dirname, "..");
const dataText = fs.readFileSync(path.join(root, "js/data.js"), "utf8");
const engine = fs.readFileSync(path.join(root, "js/engine.js"), "utf8");
const context = { console };
vm.createContext(context);
vm.runInContext(dataText + "; globalThis.__items = ITEMS;", context);
const items = context.__items;
const expected = {"smoky_transformhat_lt":[210,{"pAtk":2,"sMatk":2}],"sword_of_bluefire_lt":[210,{"pow":2,"pAtk":1}],"slate_sword_lt":[210,{"pow":2,"pAtk":1}],"undine_spear_k_lt":[210,{"pow":2,"pAtk":1}],"demon_hunting_bible_lt":[210,{"spl":2,"sMatk":1}],"oneskyonesun_lt":[210,{"pow":2,"pAtk":1}],"shadow_staff_k_lt":[210,{"spl":2,"sMatk":1}],"freezing_rod_lt":[210,{"spl":2,"sMatk":1}],"meawfoxtail_lt":[210,{"pow":2,"spl":2,"pAtk":1,"sMatk":1}],"soulweight_lt":[210,{"spl":2,"sMatk":1}],"freedom_stick_lt":[210,{"spl":2,"sMatk":1}],"barb_wire_k_lt":[210,{"spl":2,"sMatk":1}],"shiver_katar_k_lt":[210,{"pow":2,"pAtk":1}],"blade_katar_lt":[210,{"pow":2,"pAtk":1}],"iron_staff_lt":[210,{"spl":2,"sMatk":1}],"blue_crystal_staff_lt":[210,{"spl":2,"sMatk":1}],"humma_clear_lt":[210,{"pow":2,"pAtk":1}],"crimson_rose_lt":[210,{"pow":2,"pAtk":1}],"master_soul_rifle_lt":[210,{"spl":2,"sMatk":1}],"demon_s_shot_lt":[210,{"pow":2,"pAtk":1}],"the_black_gatling_lt":[210,{"pow":2,"pAtk":1}],"golden_l_launcher_lt":[210,{"pow":2,"pAtk":1}],"goldfish_hat_lt":[210,{"pAtk":2,"sMatk":2}],"smoky_transform_hat_lt":[210,{"pAtk":2,"sMatk":2}],"imp_hat_lt":[210,{"pAtk":2,"sMatk":2}],"red_baby_dragon_lt":[200,{"pow":3,"pAtk":2}],"hero_boots_lt":[210,{"pAtk":1,"sMatk":1}],"hero_favor":[200,{"sMatk":1,"res":5,"mres":5,"perBaseLv10_sMatk":1}],"hero_courage":[200,{"pAtk":1,"res":5,"mres":5,"perBaseLv10_pAtk":1}],"light_blade_lt":[210,{"spl":2,"sMatk":1}],"magic_sword_lt":[210,{"spl":2,"sMatk":1}],"fatalist_lt":[210,{"pow":2,"pAtk":1}],"fog_dew_sword_lt":[210,{"pow":2,"pAtk":1}],"blessed_knife_lt":[210,{"pow":2,"pAtk":1}],"soul_weight_lt":[210,{"spl":2,"sMatk":1}],"iron_nail_k_lt":[210,{"pow":2,"pAtk":1}],"ray_knuckle_lt":[210,{"pow":2,"pAtk":1}],"trumpet_shell_k_lt":[210,{"spl":2,"sMatk":1}],"saint_hall_lt":[210,{"spl":2,"sMatk":1}],"meteor_striker_lt":[210,{"pow":2,"pAtk":1}],"oriental_sword_lt":[210,{"pow":2,"pAtk":1}],"avenger_lt":[210,{"pow":2,"pAtk":1}],"royal_bow_k_lt":[210,{"pow":2,"pAtk":1}],"scalet_dragon_l_bow_lt":[210,{"pow":2,"pAtk":1}],"narcis_bow_lt":[210,{"pow":2,"pAtk":1}],"gold_fish_hat_lt":[210,{"pAtk":2,"sMatk":2}],"viva_adul_hat_sr1":[210,{"pow":2,"pAtk":1}],"viva_adul_hat_sr2":[210,{"pow":2,"pAtk":1}]};
function check(ok, msg) { if (!ok) throw new Error(msg); console.log("PASS", msg); }
for (const [id, spec] of Object.entries(expected)) {
  const item = items[id];
  check(!!item, id + " exists");
  const rule = (item.condBonus || []).find(x =>
    x.when && x.when.baseLevelMin === spec[0] &&
    Object.entries(spec[1]).every(([k,v]) => x.bonus && x.bonus[k] === v)
  );
  check(!!rule, id + " has exact BaseLv " + spec[0] + " trait rule");
}
check(engine.includes("when.baseLevelMin"), "engine evaluates BaseLv minimum conditions");
check(engine.includes("perBaseLv10_"), "engine evaluates per-10-BaseLv growth bonuses");
check(engine.includes("getCardBonus('pAtk')"), "P.ATK reaches physical damage multiplier");
check(engine.includes("getCardBonus('sMatk')"), "S.MATK reaches magic damage multiplier");
for (const k of ["pow","sta","wis","spl","con","crt"]) {
  check(engine.includes("getCardBonus('" + k + "')"), k.toUpperCase() + " reaches derived stats");
}
console.log("v2.5.196 bulk trait regression: PASS (" + Object.keys(expected).length + " items)");
