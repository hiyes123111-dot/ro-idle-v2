const fs=require('fs'),vm=require('vm'),assert=require('assert');
const ctx={window:{},document:{addEventListener(){},getElementById(){return null},querySelector(){return null},querySelectorAll(){return[]}},localStorage:{getItem(){return null},setItem(){},removeItem(){}},console,setTimeout(){return 0},clearTimeout(){},setInterval(){return 0},clearInterval(){},requestAnimationFrame(){return 0},performance:{now(){return 0}},Math,Date,Map,Set,Array,Object,Number,String,JSON,RegExp,Float64Array};vm.createContext(ctx);
for(const f of ['js/data.js','js/v2_5_392_card_catalog_repair.js','js/v2_5_394_card_catalog_audit.js','js/skills.js','js/jobs.js','js/engine.js']) vm.runInContext(fs.readFileSync(f,'utf8'),ctx,{timeout:30000});
const ids=['giant_kafert_card','dororian_card','crow_baron_card','crow_boss_card','evil_evil_box_card','original_rgan_card','lower_rgan_card','abandoned_original_rgan_card','abandoned_middle_rgan_card','jewel_evil_box_card'];
const pool=vm.runInContext("({codex:getCodexPool().cards,album:boxPool('card').ids})",ctx);
for(const id of ids){assert(ctx.window.__V25394_CARD_AUDIT__.added.includes(id));assert(pool.codex.includes(id),id+' missing codex');assert(pool.album.includes(id),id+' missing card album');assert(vm.runInContext(`!!CARDS['${id}'] && !!ITEMS['${id}']`,ctx),id+' missing record');}
function setState(equip,instances,baseLevel=212,jobId='element_master') {ctx.__testState={equip,instances,stats:{str:1,agi:1,vit:1,int:1,dex:1,luk:1},baseLevel,jobLevel:60,jobId,learnedSkills:{},traitAlloc:{}}; vm.runInContext('state = __testState',ctx);}
setState({accessory1:'a'}, {a:{item:'ring',refine:0,cards:['giant_kafert_card']}},212);
assert.equal(vm.runInContext("getCardBonus('raceDmg_formless')",ctx),20);
setState({accessory1:'a'}, {a:{item:'ring',refine:0,cards:['dororian_card']}},212);
assert.equal(vm.runInContext("getCardBonus('raceDmg_demon')",ctx),20);
setState({accessory1:'a'}, {a:{item:'ring',refine:0,cards:['good_rabbit_card']}},212);
assert.equal(vm.runInContext("getCardBonus('expGainPct')",ctx),10);
setState({accessory1:'a',accessory2:'b'}, {a:{item:'ring',refine:0,cards:['summer_pope_card']},b:{item:'sesrumnir_evt_ring',refine:0,cards:[]}},212);
assert.equal(vm.runInContext("getCardBonus('meleeDmgPct')",ctx),7);
setState({accessory1:'a'}, {a:{item:'ring',refine:0,cards:['summer_pope_card','summer_malan_card']}},212);
assert.equal(vm.runInContext("getCardBonus('atkPct')",ctx),7);
assert.equal(vm.runInContext("getCardBonus('matkPct')",ctx),7);
assert.equal(vm.runInContext("getCardBonus('skillAfterDelayPct')",ctx),5);
setState({accessory1:'a'}, {a:{item:'ring',refine:0,cards:['crow_baron_card','crow_boss_card']}},212,'sage');
assert.equal(vm.runInContext("getCardBonus('skillDmg_firebolt')",ctx),30);
assert.equal(vm.runInContext("getCardBonus('skillDmg_coldbolt')",ctx),30);
setState({garment:'g'}, {g:{item:'cloak',refine:10,cards:['jewel_evil_box_card','ancient_mimic_card']}},212);
assert.equal(vm.runInContext("getCardBonus('critDmgPct')",ctx),20);
setState({accessory1:'a'}, {a:{item:'ring',refine:0,cards:['evil_evil_box_card','jewel_evil_box_card']}},212);
assert.equal(vm.runInContext("getCardBonus('critDmgPct')",ctx),30);
console.log(JSON.stringify({added:ids.length,codexAndAlbum:ids.length,giantAndDorianLevelConditions:true,rabbitExp:true,summerPopeRingSet:true,summerMalanPair:true,crowSageSet:true,jewelMimicRefineSet:true,evilBoxSet:true},null,2));
