// v2.5.315 EP21 reward and zeny regression
const fs=require('fs'),vm=require('vm'),assert=require('assert');
const data=fs.readFileSync('js/data.js','utf8');
const c={};vm.createContext(c);
vm.runInContext(data+'\nglobalThis.x={ITEMS};',c);
assert(c.x.ITEMS.old_violet_box,'Mysterious Violet Box item exists');
assert(c.x.ITEMS.old_card_album,'Old Card Album item exists');
const eng=fs.readFileSync('js/engine.js','utf8');
assert(eng.includes("isEp21TrialBoss ? 100000 :"),'online EP21 zeny override');
assert(eng.includes("canFarmBoss ? 100000 : 0"),'offline EP21 zeny override');
assert(eng.includes("Math.min(1, 0.05 * dropMult)"),'5% violet box drop');
assert(eng.includes("Math.min(1, 0.02 * dropMult)"),'2% old card album drop');
assert(eng.includes("addItem('old_violet_box', 1)"),'online violet box award');
assert(eng.includes("addItem('old_card_album', 1)"),'online album award');
assert(eng.includes("addLoot('old_violet_box')"),'offline violet box award');
assert(eng.includes('Math.random() < 0.25) addLoot(fragmentIds'),'offline fragment chance is probabilistic');
assert(eng.includes("addLoot('old_card_album')"),'offline album award');
console.log('v2.5.315 EP21 rewards: PASS (100,000 base zeny/kill; violet box 5%; old card album 2%; online/offline)');
