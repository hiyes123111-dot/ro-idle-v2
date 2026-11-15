const fs=require('fs'),vm=require('vm'),path=require('path'),assert=require('assert');
const root=path.resolve(__dirname,'..'),html=fs.readFileSync(path.join(root,'index.html'),'utf8');
const files=[...html.matchAll(/<script[^>]+src=["']([^"']+\.js)(?:\?[^"']*)?["']/g)].map(m=>m[1]).filter(f=>f.startsWith('js/'));
const end=files.indexOf('js/engine.js');
const ctx={console,window:{},CARD_ART_FALLBACKS:{},document:{addEventListener(){},removeEventListener(){},getElementById(){return null},querySelector(){return null},querySelectorAll(){return[]},createElement(){return{}},body:{appendChild(){},classList:{add(){},remove(){}}}},Image:function(){},localStorage:{getItem(){return null},setItem(){},removeItem(){}},setTimeout(){return 0},clearTimeout(){},setInterval(){return 0},clearInterval(){},requestAnimationFrame(){return 0},performance:{now(){return 0}},Math:Object.create(Math),Date,Map,Set,Array,Object,Number,String,JSON,RegExp,Float64Array};
ctx.Math.random=()=>0.99;ctx.window=ctx;vm.createContext(ctx);for(const f of files.slice(0,end+1))vm.runInContext(fs.readFileSync(path.join(root,f),'utf8'),ctx,{filename:f,timeout:60000});
const run=x=>vm.runInContext(x,ctx);
run("ITEMS.__test_weapon={id:'__test_weapon',name:'測試武器',type:'weapon',weaponType:'sword',weaponCat:'sword',weaponLv:5,atk:1000,attack:1000,slots:4};");
run("MONSTERS.__test_mon={...MONSTERS.poring,id:'__test_mon',name:'測試木樁',hp:99999999,maxHp:99999999,def:0,defSoft:0,flee:0,element:'neutral',race:'formless',size:'medium',isBoss:false};");
const cases=[
 ['ske_noon_blast','ep21_john_card',5],
 ['nw_wild_shot','ep21_kunt_card',5],
 ['ss_antenpou','ep21_galacia_card',10],
 ['soa_talisman_of_red_phoenix','ep21_iana_card',5],
 ['sh_hyun_rok_spirit_power','ep21_nadoyou_card',7]
];
const results=[];
for(const [skill,card,lv] of cases){
 run(`state={name:'EP21範圍測試',gender:'male',jobId:'novice',baseLevel:250,jobLevel:1,jobLevelHistory:{},rebirthCount:1,rebirthPath:[],stats:{str:100,agi:100,vit:100,int:100,dex:999,luk:0},traitStats:{pow:50,con:50,spl:50,sta:0,wis:0},equip:{weapon:'__inst'},instances:{__inst:{item:'__test_weapon',refine:0,cards:[${JSON.stringify(card)}]}},relics:{},learnedSkills:{},cardSkills:{},traitAlloc:{},inventory:[],gold:99999999,hp:999999,maxHp:999999,sp:999999,maxSp:999999,buffs:[],monsters:[{id:1,defId:'__test_mon',hp:99999999,maxHp:99999999},{id:2,defId:'__test_mon',hp:99999999,maxHp:99999999}],cooldowns:{},shields:[],attackAccumulator:0};_gearBonusCache=null;_gearBonusKey='';recomputeDerived();state._atkWeapon=1000;state._atkStatus=0;state._atkMastery=0;state._totalStr=100;`);
 const before=run('state.monsters.map(m=>m.hp)');
 assert.ok(run(`castSkill(${JSON.stringify(skill)},{free:true,forceLv:${lv}})`),skill+' casts');
 const after=run('state.monsters.map(m=>m.hp)');
 assert.strictEqual(after.length,2,skill+' should leave both test monsters alive');
 assert.ok(after.every((hp,i)=>hp<before[i]),skill+' should hit both monsters');
 results.push({skill,damage:before.map((hp,i)=>hp-after[i])});
}
console.log(JSON.stringify({passed:results.length,results}));
