const fs=require('fs'),path=require('path'),vm=require('vm'),assert=require('assert');
const root=path.resolve(__dirname,'..');
const c={console,Date,Math,JSON,Object,Array,Set,Map,Number,String,RegExp,
  window:{addEventListener(){},location:{}},
  document:{addEventListener(){},removeEventListener(){},getElementById(){return null},querySelector(){return null},querySelectorAll(){return[]},createElement(){return{}},body:{classList:{add(){},remove(){}},appendChild(){}}},
  navigator:{},performance:{now:()=>0},alert(){},confirm(){return true},prompt(){return null},URL,Blob,FileReader:function(){},Image:function(){},requestAnimationFrame(){},
  setTimeout(){return 0},clearTimeout(){},setInterval(){return 0},clearInterval(){},localStorage:{getItem(){return null},setItem(){},removeItem(){}}};
c.window.window=c.window;c.window.document=c.document;vm.createContext(c);
for(const f of ['skills.js','monster_skills.js','jobs.js','hp_sp_tables.js','aspd_data.js','data.js','relics.js','v2_content.js','v2_4_content.js','v2_5_content.js','v2_6_skill_migration.js','v2_7_headgear_migration.js','v2_8_headgear_round16.js','v2_9_headgear_round17.js','item_display_name_fix.js','v2_artifacts.js','achievements.js','engine.js']) vm.runInContext(fs.readFileSync(path.join(root,'js',f),'utf8'),c,{filename:f,timeout:30000});
const run=x=>vm.runInContext(x,c);
run(`createCharacter('Trait Audit',{str:99,agi:99,vit:99,int:99,dex:99,luk:99},'male'); state.jobId='wind_hawk'; state.baseLevel=250; state.jobLevel=70; state.traitAlloc={pow:30,sta:0,wis:0,spl:30,con:25,crt:30}; ITEMS.audit_trait_gear={id:'audit_trait_gear',name:'Trait Audit Gear',type:'armor',slot:'accessory',bonus:{pAtk:7,sMatk:9,cRate:4}}; state.equip.accessory1='audit_trait_gear'; recomputeDerived(true);`);
assert.strictEqual(run('state.pAtk'),22,'P.ATK includes POW/CON derivation and gear +7 exactly once');
assert.strictEqual(run('state.sMatk'),24,'S.MATK includes SPL/CON derivation and gear +9 exactly once');
assert.strictEqual(run('state.hPlus'),30,'H.PLUS reads CRT');
assert.strictEqual(run('state.cRate'),14,'C.RATE includes CRT derivation and gear +4 exactly once');
assert.strictEqual(run("getCardBonus('pAtk')"),7,'gear P.ATK bonus read once');
assert.strictEqual(run("getCardBonus('sMatk')"),9,'gear S.MATK bonus read once');
assert.strictEqual(run("getCardBonus('cRate')"),4,'gear C.RATE bonus read once');
// Recomputing without changing equipment must not stack the same gear bonuses again.
run('recomputeDerived(true)');
assert.strictEqual(run('state.pAtk'),22,'recompute does not stack P.ATK');
assert.strictEqual(run('state.sMatk'),24,'recompute does not stack S.MATK');
assert.strictEqual(run('state.cRate'),14,'recompute does not stack C.RATE');
console.log('v2.5.429 trait combat formula: PASS (POW/SPL/CON/CRT plus gear bonuses, no duplicate accumulation)');
