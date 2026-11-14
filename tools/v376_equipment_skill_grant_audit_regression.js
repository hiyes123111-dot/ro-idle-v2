const fs=require('node:fs'),path=require('node:path'),vm=require('node:vm'),assert=require('node:assert');
const root=path.resolve(__dirname,'..');
const storage=Object.create(null);
const documentStub={addEventListener(){},removeEventListener(){},getElementById(){return null},querySelector(){return null},querySelectorAll(){return []},createElement(){return{}},body:{classList:{add(){},remove(){}},appendChild(){}}};
const c={console,Date,Math,JSON,Object,Array,Set,Map,Number,String,RegExp,setTimeout:()=>1,clearTimeout(){},setInterval:()=>1,clearInterval(){},localStorage:{getItem(k){return storage[k]??null},setItem(k,v){storage[k]=String(v)},removeItem(k){delete storage[k]}},window:{addEventListener(){},location:{}},document:documentStub,navigator:{},performance:{now:()=>0},alert(){},confirm:()=>true,prompt:()=>null,URL,Blob,FileReader:function(){},Image:function(){},requestAnimationFrame:()=>0};
c.window.window=c.window;c.window.document=documentStub;vm.createContext(c);
for(const f of ['skills.js','monster_skills.js','jobs.js','data.js','relics.js','v2_content.js','v2_4_content.js','v2_5_content.js','v2_6_skill_migration.js','v2_7_headgear_migration.js','v2_8_headgear_round16.js','v2_9_headgear_round17.js','item_display_name_fix.js','v2_artifacts.js','achievements.js','engine.js']) vm.runInContext(fs.readFileSync(path.join(root,'js',f),'utf8'),c,{filename:f,timeout:30000});
function run(s){return vm.runInContext(s,c)}
function equip(item,slot='garment',refine=0,cards=[]){
 run(`state={name:'Audit',jobId:'novice',baseLevel:220,jobLevel:70,learnedSkills:{},cardSkills:{},equip:{},instances:{},buffs:[],inventory:[],stats:{},};`);
 run(`state.equip[${JSON.stringify(slot)}]=${JSON.stringify(item)};`);
 if(refine||cards.length) run(`state.instances[${JSON.stringify(item)}]={item:${JSON.stringify(item)},refine:${refine},cards:${JSON.stringify(cards)}};`);
 return run('cardGrantedSkills()');
}
let grants=equip('changeable_magic_cape','garment',11);
assert(!grants.thunderstorm,'auto-spell does not incorrectly appear as an active usable skill');
grants=equip('freedom_stick','weapon',11);
assert.strictEqual(grants.so_psychicwave,3,'refine +11 grants Psychic Wave Lv3');
grants=equip('up_freedom_stick','weapon',7);
assert.strictEqual(grants.so_psychicwave,5,'refine +7 grants Psychic Wave Lv5');
grants=equip('garden_of_eden_br','head_top',12);
assert.strictEqual(grants.hiding,1,'refine +12 Eden hat grants Hiding');
grants=equip('walk_of_dark_void','footgear',12);
assert.strictEqual(grants.hiding,1,'Void boots grant Hiding');
assert.strictEqual(grants.rg_raid,1,'refine +12 Void boots grant Raid');
grants=equip('nergal_shoes_tw','footgear',0,['moonlight_flower_card']);
assert.strictEqual(grants.heal,10,'Moonlight Card + Nergal boots grant Heal Lv10');
grants=equip('garnet_pendant_lt','accessory1',0);
assert.strictEqual(grants.recognizedspell,1,'Garnet pendant grants Recognized Spell outside excluded Wizard line');
grants=equip('olympus_wing_tw','garment',0);
assert.strictEqual(grants.pa_gospel,1,'Olympus wing grants Gospel');
run("state.equip.armor='ceres_armor_tw';");
grants=run('cardGrantedSkills()');
assert.strictEqual(grants.kyrie,10,'Olympus wing + supported armor set grants Kyrie Lv10');
grants=equip('garnet_pendant_lt','accessory1',0);
run("state.jobId='warlock';");
grants=run('cardGrantedSkills()');
assert.strictEqual(grants.recognizedspell,undefined,'Garnet pendant excludes Wizard/Warlock jobs');
grants=equip('blessed_knife_lt','weapon',7);
assert.strictEqual(grants.sc_fatalmenace,10,'LT Blessed Knife refine +7 grants Fatal Menace Lv10');
grants=equip('item_2020maypay_05','head_top',12);
assert.strictEqual(grants.recognizedspell,1,'Potential Adventure Hat refine +12 grants Recognized Spell');
grants=equip('janus_armor_lt','armor',0);
run("state.jobId='supernovice';");
grants=run('cardGrantedSkills()');
assert.strictEqual(grants.rk_windcutter,5,'Janus LT armor grants Windcutter to Super Novice');
grants=equip('bacchus_armor_lt','armor',0);
run("state.instances['bacchus_armor_lt']={item:'bacchus_armor_lt',refine:0,cards:[],grade:'D'};");
grants=run('cardGrantedSkills()');
assert.strictEqual(grants.sn_sight,10,'Bacchus LT armor D grade grants True Sight Lv10');
grants=equip('bacchus_armor','armor',12);
assert.strictEqual(grants.sn_sight,10,'Legacy Bacchus armor refine +12 grants True Sight Lv10');
grants=equip('orcsuccessionhelm_tw','head_top',0,['orc_hero_card','orc_load_card','orc_lady_card','orc_warrior_card','orc_archer_card']);
assert.strictEqual(grants.cr_defender,4,'Orc succession helm + five-card set grants Light Shield Lv4');
grants=equip('changeable_magic_cape','garment',13);
const items=run('ITEMS');
const cape=items.changeable_magic_cape;
const cb=cape.condBonus;
const expected=[
 [9,'autoSpell_hellinferno',5],[9,'autoSpell_diamonddust',5],
 [11,'autoSpell_thunderstorm',5],[11,'autoSpell_heavensdrive',5],
 [11,'autoSpell_earthgrave',5],[11,'autoSpell_chainlightning',5]
];
for(const [ref,key,chance] of expected){
 const row=cb.find(x=>x.when&&x.when.refineMin===ref&&x.bonus&&x.bonus[key]===chance);
 assert(row,`cape refine +${ref} ${key} ${chance}% data exists`);
}
const engine=fs.readFileSync(path.join(root,'js','engine.js'),'utf8');
for(const skill of ['hellinferno','so_diamonddust','so_earthgrave','wl_chainlightning']) assert(engine.includes(`'changeable_magic_cape:autoSpell_${skill==='so_diamonddust'?'diamonddust':skill==='so_earthgrave'?'earthgrave':skill==='wl_chainlightning'?'chainlightning':skill}'`),`cape proc mapping exists: ${skill}`);
console.log('v2.5.376 equipment skill audit: PASS (direct grants, refine grants, set/class grants, six cape procs)');
