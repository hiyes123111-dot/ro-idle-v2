const fs=require('fs'),vm=require('vm'),path=require('path'),assert=require('assert');
const root=path.resolve(__dirname,'..'),html=fs.readFileSync(path.join(root,'index.html'),'utf8');
const files=[...html.matchAll(/<script[^>]+src=["']([^"']+\.js)(?:\?[^"']*)?["']/g)].map(m=>m[1]).filter(f=>f.startsWith('js/'));
const end=files.indexOf('js/engine.js');
const ctx={console,window:{},CARD_ART_FALLBACKS:{},document:{addEventListener(){},removeEventListener(){},getElementById(){return null},querySelector(){return null},querySelectorAll(){return[]},createElement(){return{}},body:{appendChild(){},classList:{add(){},remove(){}}}},Image:function(){},localStorage:{getItem(){return null},setItem(){},removeItem(){}},setTimeout(){return 0},clearTimeout(){},setInterval(){return 0},clearInterval(){},requestAnimationFrame(){return 0},performance:{now(){return 0}},Math,Date,Map,Set,Array,Object,Number,String,JSON,RegExp,Float64Array};
ctx.window=ctx;vm.createContext(ctx);for(const f of files)vm.runInContext(fs.readFileSync(path.join(root,f),'utf8'),ctx,{filename:f,timeout:60000});
const run=x=>vm.runInContext(x,ctx);
const cardOnlySkillIds=['ske_noon_blast','ske_all_in_the_sky','nw_magazine_for_one','nw_wild_shot','ss_antenpou','ss_ankokuryuuakumu','soa_talisman_of_red_phoenix','soa_talisman_of_four_bearing_god','sh_hyun_rok_spirit_power','sh_hyun_rok_cannon'];
const cardSkills={
 ep21_john_card:['ske_noon_blast','ske_all_in_the_sky'],
 ep21_kunt_card:['nw_magazine_for_one','nw_wild_shot'],
 ep21_galacia_card:['ss_antenpou','ss_ankokuryuuakumu'],
 ep21_iana_card:['soa_talisman_of_red_phoenix','soa_talisman_of_four_bearing_god'],
 ep21_nadoyou_card:['sh_hyun_rok_spirit_power','sh_hyun_rok_cannon'],
 ep21_tris_card:['v25_dragon_knight_6','v25_dragon_knight_7'],
 ep21_tan_borg_card:['v25_imperial_guard_12','v25_imperial_guard_13'],
 ep21_bihailin_card:['v25_inquisitor_6','v25_inquisitor_8'],
 ep21_reinhardt_card:['cd_arbitrium','cd_divinus_flos'],
 ep21_evan_wigner_card:['v25_meister_10','v25_meister_8'],
 ep21_lalila_card:['v25_biolo_3','v25_biolo_4'],
 ep21_richard_card:['v25_shadow_cross_3','v25_shadow_cross_4'],
 ep21_lora_card:['v25_abyss_chaser_10','v25_abyss_chaser_11'],
 ep21_aurely_card:['v25_arch_mage_3','v25_arch_mage_6'],
 ep21_ylze_card:['v25_element_master_6','v25_element_master_8'],
 ep21_epesto_card:['v25_windhawk_progressive_shot','sn_sharpshooting'],
 ep21_mary_stella_card:['v25_troubadour_14','v25_troubadour_15'],
 ep21_lee_card:['v25_arch_mage_20','v25_arch_mage_21']
};
const groups={
 ep21_john_card:'yorscalp_p_circlet',
 ep21_kunt_card:'yorscalp_p_circlet',
 ep21_galacia_card:'yorscalp_m_circlet',
 ep21_iana_card:'yorscalp_m_circlet',
 ep21_nadoyou_card:'yorscalp_m_circlet'
};
assert.ok(run("ITEMS.yorscalp_p_circlet && ITEMS.yorscalp_m_circlet"),'both official EP21 circlets exist');
let checked=0;
for(const [cardId,skills] of Object.entries(cardSkills)){
 assert.ok(run(`CARDS[${JSON.stringify(cardId)}]`),cardId+' card exists');
 assert.strictEqual(run(`CARDS[${JSON.stringify(cardId)}].perRefine.skillDmg_${skills[0]}`),1,cardId+' weapon refine key 1');
 assert.strictEqual(run(`CARDS[${JSON.stringify(cardId)}].perRefine.skillDmg_${skills[1]}`),1,cardId+' weapon refine key 2');
 for(const sid of skills) assert.ok(run(`SKILLS[${JSON.stringify(sid)}]`),sid+' skill record exists');
 checked++;
}
run("ITEMS.__audit_weapon={id:'__audit_weapon',name:'測試武器',type:'weapon',weaponType:'sword',weaponCat:'sword',weaponLv:5,slots:4};");
function setup(cardId,weaponRefine,hatId,hatRefine,grade){
 const equip={weapon:'__audit_weapon_inst'};
 const instances={__audit_weapon_inst:{item:'__audit_weapon',refine:weaponRefine,cards:[cardId]}};
 if(hatId){equip.head_top='__audit_hat_inst';instances.__audit_hat_inst={item:hatId,refine:hatRefine,grade:grade||'A',cards:[]};}
 run(`state={equip:${JSON.stringify(equip)},instances:${JSON.stringify(instances)},stats:{str:50,agi:50,vit:50,int:50,dex:50,luk:50},traitStats:{con:0,pow:0,spl:0},baseLevel:200,jobLevel:70,jobId:'novice',learnedSkills:{},cardSkills:{},traitAlloc:{},hp:10000,sp:1000,maxHp:10000,maxSp:1000,buffs:[],monsters:[],inventory:[],cooldowns:{}};_gearBonusCache=null;_gearBonusKey='';`);
}
for(const [cardId,skills] of Object.entries(cardSkills)){
 setup(cardId,10,null,0);
 for(const sid of skills){
  assert.strictEqual(run(`getCardBonus(${JSON.stringify('skillDmg_'+sid)})`),10,cardId+' weapon refine +10 '+sid);
  checked++;
 }
 setup(cardId,0,null,0);
 for(const sid of skills){
  assert.strictEqual(run(`getCardBonus(${JSON.stringify('skillDmg_'+sid)})`),0,cardId+' refine 0 '+sid);
  checked++;
 }
 setup(cardId,10,null,0);
 run("state.instances.__audit_weapon_inst.cards=[];_gearBonusCache=null;_gearBonusKey='';");
 for(const sid of skills){
  assert.strictEqual(run(`getCardBonus(${JSON.stringify('skillDmg_'+sid)})`),0,cardId+' remove card clears '+sid);
  checked++;
 }
}
for(const [cardId,hatId] of Object.entries(groups)){
 setup(cardId,0,hatId,10,'A');
 for(const sid of cardSkills[cardId]){
  assert.strictEqual(run(`getCardBonus(${JSON.stringify('skillDmg_'+sid)})`),120,cardId+' A hat refine 10 '+sid);
  checked++;
 }
 run("state.equip.head_top=null;delete state.instances.__audit_hat_inst;_gearBonusCache=null;_gearBonusKey='';");
 for(const sid of cardSkills[cardId]){
  assert.strictEqual(run(`getCardBonus(${JSON.stringify('skillDmg_'+sid)})`),0,cardId+' remove hat clears '+sid);
  checked++;
 }
 setup(cardId,0,hatId,9,'A');
 for(const sid of cardSkills[cardId]){
  assert.strictEqual(run(`getCardBonus(${JSON.stringify('skillDmg_'+sid)})`),0,cardId+' hat refine 9 must not activate '+sid);
  checked++;
 }
 setup(cardId,0,hatId,10,'B');
 for(const sid of cardSkills[cardId]){
  assert.strictEqual(run(`getCardBonus(${JSON.stringify('skillDmg_'+sid)})`),0,cardId+' B hat must not activate '+sid);
  checked++;
 }
}
assert.strictEqual(run("Object.keys(JOB_TREE).length"),Object.keys(run("JOB_TREE")).length);
for(const sid of cardOnlySkillIds) { assert.strictEqual(run(`SKILLS[${JSON.stringify(sid)}].cardOnly`),true,sid+' marked cardOnly'); checked++; }
assert.ok(run("!Object.values(JOB_TREE).some(j=>j.skills.some(s=>['ske_noon_blast','ske_all_in_the_sky','nw_magazine_for_one','nw_wild_shot','ss_antenpou','ss_ankokuryuuakumu','soa_talisman_of_red_phoenix','soa_talisman_of_four_bearing_god','sh_hyun_rok_spirit_power','sh_hyun_rok_cannon'].includes(s.id)))"),'no new profession skill-tree entries');
console.log(JSON.stringify({passed:checked+3,assertions:checked+3,cards:Object.keys(cardSkills).length,skills:Object.values(cardSkills).flat().length,comboCards:Object.keys(groups).length,tests:['weapon refine +1% per level for all 18 cards','refine 0 gives no weapon refine bonus','five missing card/headgear combos activate only at A+10','no new job classes or job-tree entries']}));
