#!/usr/bin/env node
"use strict";
const fs = require("fs");
const path = require("path");
const vm = require("vm");
const root = path.join(__dirname, "..");
const data = fs.readFileSync(path.join(root, "js/data.js"), "utf8");
const engine = fs.readFileSync(path.join(root, "js/engine.js"), "utf8");
const ui = fs.readFileSync(path.join(root, "js/ui.js"), "utf8");
const heroLine = data.split(/\r?\n/).find(line => line.includes('"hero_token_shc"')) || "";
function check(ok, msg) { if (!ok) throw new Error(msg); console.log("PASS", msg); }
check(heroLine.includes('itemRefineMin:10'), "hero pendant uses target weapon refine +10 condition");
check(heroLine.includes('itemGradeMin:"C"'), "hero pendant uses target weapon C-grade condition");
check(heroLine.includes('skillDmg_sc_savageimpact:10'), "Shiver Katar LT enables Savage Impact skill bonus");
check(heroLine.includes('skillDmg_sc_eternalslash:10'), "Blade Katar LT enables Eternal Slash skill bonus");
check(engine.includes('grade: (inst && (inst.grade || inst.itemGrade)) || null'), "loadout reads grade from equipped item instance");
check(engine.includes('when.itemGradeMin != null'), "condition evaluator supports minimum item grade");
check(engine.includes('gradeRank(slot.grade) >= required'), "grade condition compares C and higher ranks");
check(engine.includes("${d.itemId}+${d.refine}@${d.grade || '-'}"), "grade participates in equipment bonus cache key");
check(ui.includes("function setEquipGrade(slotKey, grade)"), "equipment UI persists selected weapon grade");
check(ui.includes("武器階級（依實際裝備記錄）"), "grade control is clearly labeled as manual metadata");

// Execute the real condition evaluator against synthetic loadout slots.
const start = engine.indexOf("function condMet(");
const end = engine.indexOf("\n/* 統一裝備／卡片 bonus key", start);
if (start < 0 || end < 0) throw new Error("could not isolate condMet");
const context = { state: { baseLevel: 230, jobId: "shadow_cross", stats: {} },
  weaponReqMet: () => true, skillLv: () => 0 };
vm.runInNewContext(engine.slice(start, end) + "\nthis.__condMet = condMet;", context);
const lo = { items: new Set(["shiver_katar_k_lt"]), cards: new Set(), jobLine: new Set(),
  slots: { weapon: { itemId: "shiver_katar_k_lt", refine: 10, grade: "C", cards: [] } } };
const pair = { withAnyItem: ["shiver_katar_k_lt"] };
check(context.__condMet({ ...pair, itemRefineMin: 10 }, null, lo), "refine +10 target condition activates");
check(context.__condMet({ ...pair, itemGradeMin: "C" }, null, lo), "C-grade target condition activates");
lo.slots.weapon.grade = "D";
check(!context.__condMet({ ...pair, itemGradeMin: "C" }, null, lo), "D-grade weapon does not activate C-grade condition");
lo.slots.weapon.grade = "B";
check(context.__condMet({ ...pair, itemGradeMin: "C" }, null, lo), "B-grade weapon also activates C-grade condition");

// Verify the live skill-bonus consumer reads these exact data keys.
const bonusContext = {
  SKILLS: {
    sc_savageimpact: {id:"sc_savageimpact"},
    sc_eternalslash: {id:"sc_eternalslash"}
  },
  getCardBonus: key => ({
    skillDmg_sc_savageimpact: 20,
    skillDmg_sc_eternalslash: 20
  }[key] || 0)
};
const fnStart = engine.indexOf("function getSkillDamageBonus(sk)");
const fnEnd = engine.indexOf("\nfunction canonicalBonusKey", fnStart);
if (fnStart < 0 || fnEnd < 0) throw new Error("could not isolate getSkillDamageBonus");
vm.runInNewContext(engine.slice(fnStart, fnEnd) + "\nthis.__getSkillDamageBonus = getSkillDamageBonus;", bonusContext);
check(bonusContext.__getSkillDamageBonus(bonusContext.SKILLS.sc_savageimpact) === 20,
  "live bonus consumer returns Savage Impact equipment bonus");
check(bonusContext.__getSkillDamageBonus(bonusContext.SKILLS.sc_eternalslash) === 20,
  "live bonus consumer returns Eternal Slash equipment bonus");

console.log("v2.5.191 hero pendant grade regression: PASS");
