const fs=require('fs'),vm=require('vm'),path=require('path'),assert=require('assert');
const root=path.resolve(__dirname,'..'),html=fs.readFileSync(path.join(root,'index.html'),'utf8');
const files=[...html.matchAll(/<script[^>]+src=["']([^"']+\.js)(?:\?[^"']*)?["']/g)].map(m=>m[1]).filter(f=>f.startsWith('js/'));
const end=files.indexOf('js/engine.js');
const ctx={console,window:{},CARD_ART_FALLBACKS:{},document:{addEventListener(){},removeEventListener(){},getElementById(){return null},querySelector(){return null},querySelectorAll(){return[]},createElement(){return{}},body:{appendChild(){},classList:{add(){},remove(){}}}},Image:function(){},localStorage:{getItem(){return null},setItem(){},removeItem(){}},setTimeout(){return 0},clearTimeout(){},setInterval(){return 0},clearInterval(){},requestAnimationFrame(){return 0},performance:{now(){return 0}},Math:Object.create(Math),Date,Map,Set,Array,Object,Number,String,JSON,RegExp,Float64Array};
ctx.Math.random=()=>0.99;ctx.window=ctx;vm.createContext(ctx);for(const f of files.slice(0,end+1))vm.runInContext(fs.readFileSync(path.join(root,f),'utf8'),ctx,{filename:f,timeout:60000});
const run=x=>vm.runInContext(x,ctx);
const map={
 ske_noon_blast:['ep21_john_card','sword'],
 ske_all_in_the_sky:['ep21_john_card','sword'],
 nw_magazine_for_one:['ep21_kunt_card','__test_gatling'],
 nw_wild_shot:['ep21_kunt_card','sword'],
 ss_antenpou:['ep21_galacia_card','sword'],
 ss_ankokuryuuakumu:['ep21_galacia_card','sword'],
 soa_talisman_of_red_phoenix:['ep21_iana_card','sword'],
 soa_talisman_of_four_bearing_god:['ep21_iana_card','sword'],
 sh_hyun_rok_spirit_power:['ep21_nadoyou_card','sword'],
 sh_hyun_rok_cannon:['ep21_nadoyou_card','sword']
};
run("ITEMS.__test_gatling={id:'__test_gatling',name:'測試格林機關槍',type:'weapon',weaponType:'gun',weaponCat:'gatling',weaponLv:5,atk:1000,attack:1000,slots:4};");
run("MONSTERS.__test_mon={...MONSTERS.poring,id:'__test_mon',name:'測試木樁',hp:99999999,maxHp:99999999,def:0,defSoft:0,flee:0,element:'neutral',race:'formless',size:'medium',isBoss:false};");
run("ITEMS.__test_sword={id:'__test_sword',name:'測試武器',type:'weapon',weaponType:'sword',weaponCat:'sword',weaponLv:5,atk:1000,attack:1000,slots:4};");
function castDamage(skillId,cardId,refine,weaponId,lv){
 run(`state={name:'EP21增傷測試',gender:'male',jobId:'novice',baseLevel:250,jobLevel:1,jobLevelHistory:{},rebirthCount:1,rebirthPath:[],stats:{str:100,agi:100,vit:100,int:100,dex:999,luk:0},traitStats:{pow:50,con:50,spl:50,sta:0,wis:0},equip:{weapon:'__test_inst'},instances:{__test_inst:{item:${JSON.stringify(weaponId)},refine:${refine},cards:[${JSON.stringify(cardId)}]}},relics:{},learnedSkills:{},cardSkills:{},traitAlloc:{},inventory:[],gold:99999999,hp:999999,maxHp:999999,sp:999999,maxSp:999999,buffs:[],monsters:[{id:1,defId:'__test_mon',hp:99999999,maxHp:99999999}],cooldowns:{},shields:[],attackAccumulator:0};_gearBonusCache=null;_gearBonusKey='';recomputeDerived();state._atkWeapon=1000;state._atkStatus=0;state._atkMastery=0;state._totalStr=100;`);
 const before=run('state.monsters[0].hp');
 const ok=run(`castSkill(${JSON.stringify(skillId)},{free:true,forceLv:${lv}})`);
 assert.ok(ok,skillId+' cast');
 return before-run('state.monsters[0].hp');
}
const results=[];
for(const [skillId,[cardId,weaponChoice]] of Object.entries(map)){
 const weaponId=weaponChoice==='__test_gatling'?'__test_gatling':'__test_sword';
 const lv=skillId==='ske_all_in_the_sky'?10:(skillId==='ss_antenpou'?10:(skillId.startsWith('sh_hyun_rok_')?7:(skillId==='ss_ankokuryuuakumu'?1:5)));
 const base=castDamage(skillId,cardId,0,weaponId,lv);
 const boosted=castDamage(skillId,cardId,10,weaponId,lv);
 const ratio=boosted/base;
 assert.ok(base>0 && Math.abs(ratio-1.1)<0.0001,`${skillId}: expected +10%, base=${base}, boosted=${boosted}, ratio=${ratio}`);
 results.push({skill:skillId,base,refine10:boosted,ratio});
}

const gatling=castDamage('nw_magazine_for_one','ep21_kunt_card',0,'__test_gatling',5);
const pistol=castDamage('nw_magazine_for_one','ep21_kunt_card',0,'__test_pistol',5);
assert.ok(gatling>0 && pistol>0 && gatling!==pistol,'Magazine for One must select its Gatling/Pistol multiplier and hit count');
results.push({skill:'nw_magazine_for_one_weapon_variants',gatling,pistol});
console.log(JSON.stringify({passed:results.length,results}));
