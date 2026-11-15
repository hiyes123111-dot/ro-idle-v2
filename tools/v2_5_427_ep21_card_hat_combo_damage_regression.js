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
 ['ske_noon_blast','ep21_john_card','yorscalp_p_circlet',5],
 ['ske_all_in_the_sky','ep21_john_card','yorscalp_p_circlet',10],
 ['nw_magazine_for_one','ep21_kunt_card','yorscalp_p_circlet',5],
 ['nw_wild_shot','ep21_kunt_card','yorscalp_p_circlet',5],
 ['ss_antenpou','ep21_galacia_card','yorscalp_m_circlet',10],
 ['ss_ankokuryuuakumu','ep21_galacia_card','yorscalp_m_circlet',1],
 ['soa_talisman_of_red_phoenix','ep21_iana_card','yorscalp_m_circlet',5],
 ['soa_talisman_of_four_bearing_god','ep21_iana_card','yorscalp_m_circlet',5],
 ['sh_hyun_rok_spirit_power','ep21_nadoyou_card','yorscalp_m_circlet',7],
 ['sh_hyun_rok_cannon','ep21_nadoyou_card','yorscalp_m_circlet',7]
];
function damage(skill,card,hat,lv){
 const weaponInst={item:'__test_weapon',refine:0,cards:card?[card]:[]};
 const instances={__weapon:weaponInst};
 const equip={weapon:'__weapon'};
 if(hat){instances.__hat={item:hat,refine:10,grade:'A',cards:[]};equip.head_top='__hat';}
 run(`state={name:'EP21頭冠套裝增傷',gender:'male',jobId:'novice',baseLevel:250,jobLevel:1,jobLevelHistory:{},rebirthCount:1,rebirthPath:[],stats:{str:100,agi:100,vit:100,int:100,dex:999,luk:0},traitStats:{pow:50,con:50,spl:50,sta:0,wis:0},equip:${JSON.stringify(equip)},instances:${JSON.stringify(instances)},relics:{},learnedSkills:{},cardSkills:{},traitAlloc:{},inventory:[],gold:99999999,hp:999999,maxHp:999999,sp:999999,maxSp:999999,buffs:[],monsters:[{id:1,defId:'__test_mon',hp:99999999,maxHp:99999999}],cooldowns:{},shields:[],attackAccumulator:0};_gearBonusCache=null;_gearBonusKey='';recomputeDerived();state._atkWeapon=1000;state._atkStatus=0;state._atkMastery=0;state._totalStr=100;`);
 const b=run('state.monsters[0].hp');
 assert.ok(run(`castSkill(${JSON.stringify(skill)},{free:true,forceLv:${lv}})`),skill+' cast');
 return b-run('state.monsters[0].hp');
}
const results=[];
for(const [skill,card,hat,lv] of cases){
 const base=damage(skill,null,hat,lv),combo=damage(skill,card,hat,lv);
 const ratio=combo/base;
 assert.ok(base>0 && Math.abs(ratio-2.2)<0.0002,`${skill} expected 2.2x with A+10 hat, got ${ratio}`);
 results.push({skill,base,combo,ratio});
}
console.log(JSON.stringify({passed:results.length,results}));
