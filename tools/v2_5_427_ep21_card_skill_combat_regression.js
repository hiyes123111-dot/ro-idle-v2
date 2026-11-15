const fs=require('fs'),vm=require('vm'),path=require('path'),assert=require('assert');
const root=path.resolve(__dirname,'..'),html=fs.readFileSync(path.join(root,'index.html'),'utf8');
const files=[...html.matchAll(/<script[^>]+src=["']([^"']+\.js)(?:\?[^"']*)?["']/g)].map(m=>m[1]).filter(f=>f.startsWith('js/'));
const end=files.indexOf('js/engine.js');
const ctx={console,window:{},CARD_ART_FALLBACKS:{},document:{addEventListener(){},removeEventListener(){},getElementById(){return null},querySelector(){return null},querySelectorAll(){return[]},createElement(){return{}},body:{appendChild(){},classList:{add(){},remove(){}}}},Image:function(){},localStorage:{getItem(){return null},setItem(){},removeItem(){}},setTimeout(){return 0},clearTimeout(){},setInterval(){return 0},clearInterval(){},requestAnimationFrame(){return 0},performance:{now(){return 0}},Math,Date,Map,Set,Array,Object,Number,String,JSON,RegExp,Float64Array};
ctx.window=ctx;vm.createContext(ctx);for(const f of files.slice(0,end+1))vm.runInContext(fs.readFileSync(path.join(root,f),'utf8'),ctx,{filename:f,timeout:60000});
const run=x=>vm.runInContext(x,ctx);
const skills=['ske_noon_blast','ske_all_in_the_sky','nw_magazine_for_one','nw_wild_shot','ss_antenpou','ss_ankokuryuuakumu','soa_talisman_of_red_phoenix','soa_talisman_of_four_bearing_god','sh_hyun_rok_spirit_power','sh_hyun_rok_cannon'];
run("ITEMS.__test_gatling={id:'__test_gatling',name:'測試格林機關槍',type:'weapon',weaponType:'gun',weaponCat:'gatling',weaponLv:5,slots:4};");
run("ITEMS.__test_pistol={id:'__test_pistol',name:'測試左輪手槍',type:'weapon',weaponType:'gun',weaponCat:'pistol',weaponLv:5,slots:4};");
const results=[];
for(const id of skills){
  for(const w of (id==='nw_magazine_for_one'?['__test_gatling','__test_pistol']:['__test_gatling'])){
    run(`state={name:'EP21測試',gender:'male',jobId:'novice',baseLevel:250,jobLevel:1,jobLevelHistory:{},rebirthCount:1,rebirthPath:[],stats:{str:100,agi:100,vit:100,int:100,dex:100,luk:100},traitStats:{pow:50,con:50,spl:50,sta:0,wis:0},equip:{weapon:'__test_inst'},instances:{__test_inst:{item:${JSON.stringify(w)},refine:10,cards:[]}},relics:{},learnedSkills:{},cardSkills:{},traitAlloc:{},inventory:[],gold:99999999,hp:999999,maxHp:999999,sp:999999,maxSp:999999,buffs:[],monsters:[{id:1,defId:'poring',hp:99999999,maxHp:99999999}],cooldowns:{},shields:[],attackAccumulator:0};_gearBonusCache=null;_gearBonusKey='';`);
    let ok=false,err='';
    try{ok=!!run(`castSkill(${JSON.stringify(id)},{free:true,forceLv:${id==='ske_all_in_the_sky'?10:(id==='ss_antenpou'?10:(id==='sh_hyun_rok_spirit_power'||id==='sh_hyun_rok_cannon'?7:5))}})`);}catch(e){err=String(e);}
    results.push({skill:id,weapon:w,ok,error:err});
  }
}
assert.ok(results.every(x=>x.ok),JSON.stringify(results.filter(x=>!x.ok)));
console.log(JSON.stringify({passed:results.length,results}));
