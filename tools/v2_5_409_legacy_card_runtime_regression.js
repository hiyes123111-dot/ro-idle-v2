const fs=require('fs'),vm=require('vm'),path=require('path'),assert=require('assert');
const root=path.resolve(__dirname,'..');
const ctx={console,window:{},document:{addEventListener(){},getElementById(){return null},querySelector(){return null},querySelectorAll(){return[]}},Image:function(){},localStorage:{getItem(){return null},setItem(){},removeItem(){}},setTimeout(){return 0},clearTimeout(){},setInterval(){return 0},clearInterval(){},requestAnimationFrame(){return 0},performance:{now(){return 0}},Math,Date,Map,Set,Array,Object,Number,String,JSON,RegExp,Float64Array};
ctx.window=ctx;vm.createContext(ctx);
for(const f of ['skills.js','data.js','img_alias.js','v2_5_397_card_catalog_batch.js','v2_5_398_card_catalog_batch.js','v2_5_399_card_catalog_batch.js','v2_5_400_ep21_card_completion.js','v2_5_401_card_catalog_batch.js','v2_5_402_ep21_encroached_tan_card.js','v2_5_403_ep21_missing_cards.js','v2_5_404_ep20_card_effect_completion.js','v2_5_405_ep19_album_gap_completion.js','v2_5_406_ep19_card_completion.js','v2_5_407_ep19_card_effect_and_catalog.js','v2_5_408_ep21_winter_card_runtime_fix.js','v2_5_409_legacy_card_runtime_data.js','engine.js'])
  vm.runInContext(fs.readFileSync(path.join(root,'js',f),'utf8'),ctx,{timeout:60000});
const has=id=>vm.runInContext(`!!CARDS['${id}']`,ctx);
for(const id of ['wander_man_card','metaling_card','whikebain_card','randgris_card']) assert(has(id),id);
const check=vm.runInContext(`({
 wanderer:CARDS.wander_man_card.autoSpell[0],
 metaling:CARDS.metaling_card.autoSpell[0],
 wickebine:CARDS.whikebain_card.autoSpell[0],
 randgris:CARDS.randgris_card.autoSpell[0]
})`,ctx);
assert.equal(check.wanderer.chance,2);
assert.equal(check.wanderer.skill,'rg_intimidate');
assert.equal(check.metaling.skill,'rg_stripweapon');
assert.equal(check.metaling.chance,5);
assert.equal(check.wickebine.skill,'rg_striparmor');
assert.equal(check.wickebine.lv,1);
assert.equal(check.wickebine.useLearnedLv,false);
assert.equal(vm.runInContext(`CARDS.whikebain_card.autoSpell.some(e=>e.lv===5&&e.when&&e.when.skillMin.rg_striparmor===5)`,ctx),true);
assert.equal(check.randgris.skill,'sa_dispell');
assert.equal(check.randgris.chance,10);
const defId=vm.runInContext("Object.keys(MONSTERS)[0]",ctx);
const run=(skill,mon)=>{
  vm.runInContext(`state={cardAutoSpells:{attack:[{on:'attack',skill:'${skill}',lv:1,chance:100,melee:true}]},buffs:[],shields:[],activeFieldEffects:[],monsters:[],equip:{},instances:{},sp:100,maxSp:100};`,ctx);
  ctx.target=mon;
  vm.runInContext(`Math.random=()=>0;`,ctx);
  vm.runInContext(`tryAutoSpells('attack', target)`,ctx);
};
let mon={id:1,defId:defId,hp:100000,maxHp:100000};
run('rg_intimidate',mon);assert(mon.hp<100000,'Wanderer Intimidate runtime damage');
mon={id:2,defId:defId,hp:100000,maxHp:100000};
run('rg_stripweapon',mon);assert(mon.strip&&mon.strip.rg_stripweapon&&mon.strip.rg_stripweapon.mult===0.75,'Metaling strip runtime');
mon={id:3,defId:defId,hp:100000,maxHp:100000};
run('rg_striparmor',mon);assert(mon.strip&&mon.strip.rg_striparmor&&mon.strip.rg_striparmor.mult===0.9,'Wickebine strip runtime');
mon={id:4,defId:defId,hp:100000,maxHp:100000,mbuff:{atkPct:{v:10,until:Date.now()+60000}}};

run('sa_dispell',mon);assert.equal(Object.keys(mon.mbuff).length,0,'Randgris dispell runtime');
console.log(JSON.stringify({version:'v2.5.409',cards:4,checks:16,runtime:['wanderer-intimidate','metaling-stripweapon','wickebine-striparmor','randgris-dispell'],result:'passed'},null,2));
