const fs=require('fs'),vm=require('vm'),path=require('path');
const root=path.resolve(__dirname,'..');
const checks=[];
const assert=(name,fn)=>{if(!fn())throw new Error('FAIL '+name);checks.push(name);};
const ITEMS={
  succu_pet_coupon:{name:'魅魔兌換券'},succubus_egg:{name:'魅魔寵物蛋',desc:'寵物蛋'},
  imp_pet_coupon:{name:'小惡魔兌換券'},imp_egg:{name:'小惡魔寵物蛋',desc:'寵物蛋'},
  chung_e_pet_coupon:{name:'月夜貓兌換券'},chung_e_egg:{name:'月夜貓寵物蛋',desc:'寵物蛋'},
  elephant_ticket:{name:'大象兌換券'},elephant_egg:{name:'大象寵物蛋',desc:'寵物蛋'},
  gorilla_ticket:{name:'猩猩兌換券'},gorilla_egg:{name:'猩猩寵物蛋',desc:'寵物蛋'},
  lion_ticket:{name:'獅子兌換券'},lion_egg:{name:'獅子寵物蛋',desc:'寵物蛋'},
  rhino_ticket:{name:'犀牛兌換券'},rhino_egg:{name:'犀牛寵物蛋',desc:'寵物蛋'}
};
const qty={};
let failRemove=false,failAdd=false,removeCalls=0,saveCalls=0,logs=[];
const ctx={console,Date,Math,ITEMS,state:{pet:null,petRecords:{},inventory:[],gold:0},
 getItemQty:id=>qty[id]||0,
 removeItem(id,n){removeCalls++;if(failRemove||!((qty[id]||0)>=n))return false;qty[id]-=n;return true;},
 addItem(id,n){if(failAdd&&id==='succubus_egg')throw new Error('simulated add failure');qty[id]=(qty[id]||0)+n;},
 logMsg:m=>logs.push(m),saveGame(){saveCalls++;return true;},recomputeDerived(){},refreshPetCenterIfOpen(){},
 window:{prompt:()=>''},document:{getElementById:()=>null}
};
vm.createContext(ctx);
vm.runInContext(fs.readFileSync(path.join(root,'js/v2_5_456_pet_system.js'),'utf8'),ctx);

const mappings={succu_pet_coupon:'succubus_egg',imp_pet_coupon:'imp_egg',chung_e_pet_coupon:'chung_e_egg',elephant_ticket:'elephant_egg',gorilla_ticket:'gorilla_egg',lion_ticket:'lion_egg',rhino_ticket:'rhino_egg'};
assert('Coupon mapping contains seven configured exchanges',()=>Object.keys(mappings).length===7);
assert('Missing coupon cannot create a pet egg',()=>{
 const before=qty.succubus_egg||0;
 return ctx.usePetItem('succu_pet_coupon')===false&&(qty.succubus_egg||0)===before&&saveCalls===0;
});
qty.succu_pet_coupon=1;failRemove=true;
assert('Failed coupon removal never grants an egg',()=>{
 const before=qty.succubus_egg||0;
 return ctx.usePetItem('succu_pet_coupon')===false&&qty.succu_pet_coupon===1&&(qty.succubus_egg||0)===before&&saveCalls===0;
});
failRemove=false;failAdd=true;
assert('Egg grant failure attempts to refund the coupon',()=>{
 const before=qty.succubus_egg||0;
 return ctx.usePetItem('succu_pet_coupon')===false&&qty.succu_pet_coupon===1&&(qty.succubus_egg||0)===before&&saveCalls===0;
});
failAdd=false;
assert('Successful exchange consumes exactly one coupon and grants one egg',()=>{
 return ctx.usePetItem('succu_pet_coupon')===true&&qty.succu_pet_coupon===0&&qty.succubus_egg===1&&saveCalls===1;
});
assert('Repeated exchange cannot grant a second egg without another coupon',()=>{
 return ctx.usePetItem('succu_pet_coupon')===false&&qty.succubus_egg===1&&saveCalls===1;
});
for(const [coupon,egg] of Object.entries(mappings)){
 qty[coupon]=1;
 const before=qty[egg]||0;
 const ok=ctx.usePetItem(coupon);
 if(!ok||qty[coupon]!==0||qty[egg]!==before+1)throw new Error('FAIL mapping '+coupon);
}
checks.push('All seven coupon types exchange one-to-one');
qty.imp_pet_coupon=1;
let nestedResult=null;
const originalRemove=ctx.removeItem;
ctx.removeItem=(id,n)=>{nestedResult=ctx.usePetItem(id);return originalRemove(id,n);};
assert('Reentrant duplicate call is blocked during exchange',()=>{
 const before=qty.imp_egg;
 const ok=ctx.usePetItem('imp_pet_coupon');
 return ok===true&&nestedResult===false&&qty.imp_pet_coupon===0&&qty.imp_egg===before+1;
});
console.log('pet coupon exchange checks passed ('+checks.length+')');
for(const c of checks)console.log('PASS '+c);
