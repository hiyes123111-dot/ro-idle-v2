const fs=require('fs'),vm=require('vm'),path=require('path'),assert=require('assert');
const root=path.resolve(__dirname,'..');
const ctx={console,window:{},document:{addEventListener(){},getElementById(){return null},querySelector(){return null},querySelectorAll(){return[]}},Image:function(){},localStorage:{getItem(){return null},setItem(){},removeItem(){}},setTimeout(){return 0},clearTimeout(){},setInterval(){return 0},clearInterval(){},requestAnimationFrame(){return 0},performance:{now(){return 0}},Math,Date,Map,Set,Array,Object,Number,String,JSON,RegExp,Float64Array};
ctx.window=ctx;vm.createContext(ctx);
const files=['data.js','img_alias.js','v2_5_397_card_catalog_batch.js','v2_5_398_card_catalog_batch.js','v2_5_399_card_catalog_batch.js','v2_5_400_ep21_card_completion.js','v2_5_401_card_catalog_batch.js','v2_5_402_ep21_encroached_tan_card.js','v2_5_403_ep21_missing_cards.js','v2_5_404_ep20_card_effect_completion.js','v2_5_405_ep19_album_gap_completion.js','v2_5_406_ep19_card_completion.js','v2_5_395_card_set_codex.js','v2_5_396_card_set_codex.js','engine.js'];
for(const f of files) vm.runInContext(fs.readFileSync(path.join(root,'js',f),'utf8'),ctx,{timeout:60000});
const ids=['ep19_junior_rgan_card','ep19_limacina_card','ep19_discarded_intermediate_rgan_card','ep19_cave_calmaring_card','ep19_jeniffer_card'];
for(const id of ids){
 assert(vm.runInContext(`!!CARDS['${id}']`,ctx),`CARDS ${id}`);
 assert(vm.runInContext(`!!ITEMS['${id}']&&ITEMS['${id}'].codexInclude===true`,ctx),`ITEMS ${id}`);
 assert(fs.existsSync(path.join(root,'images/cards/generated',id+'.svg')),`art ${id}`);
}
const setup=(slots)=>{
 let eq={},inst={};
 for(const [slot,itemId,cardId,refine=0,armorLevel=1,type='armor'] of slots){
  const instance='x_'+slot;
  eq[slot]=instance;
  inst[instance]={item:itemId+'_lv'+armorLevel,refine,cards:[cardId]};
  vm.runInContext(`ITEMS['${itemId}_lv${armorLevel}']={id:'${itemId}_lv${armorLevel}',type:'${type}',armorType:'${type}',armorLevel:${armorLevel},desc:'防具等級: ${armorLevel}'};`,ctx);
 }
 const stateText=`state={equip:${JSON.stringify(eq)},instances:${JSON.stringify(inst)},stats:{str:100,agi:1,vit:100,int:100,dex:100,luk:1},baseLevel:250,jobLevel:60,jobId:'element_master',learnedSkills:{},traitAlloc:{spl:100}};`;
 vm.runInContext(stateText,ctx);
};
const b=k=>vm.runInContext(`getCardBonus('${k}')`,ctx);
setup([['accessory1','test_acc_a','ep19_junior_rgan_card',0,1,'accessory'],['accessory2','test_acc_b','primitive_rgan_ep19_card',0,1,'accessory']]);
assert.equal(b('meleeDmgPct'),16);assert.equal(b('variableCastPct'),-8);
setup([['head_top','test_head','ep19_limacina_card',9,1,'headgear']]);
assert.equal(b('rangedDmgPct'),5);assert.equal(b('spCostPct'),7);
setup([['head_top','test_head','ep19_limacina_card',11,1,'headgear']]);
assert.equal(b('variableCastPct'),-5);
setup([['accessory1','test_acc','ep19_discarded_intermediate_rgan_card',0,1,'accessory']]);
assert.equal(b('magicEleDmg_ghost'),35);assert.equal(b('spCostPct'),10);
setup([['accessory1','test_acc','ep19_cave_calmaring_card',0,1,'accessory']]);
assert.equal(b('magicEleDmg_poison'),35);assert.equal(b('spCostPct'),10);
setup([['accessory1','test_acc','ep19_jeniffer_card',0,1,'accessory']]);
assert.equal(b('magicEleDmg_poison'),20);assert.equal(b('magicEleDmg_undead'),20);
// Verify refine +12 is independent of armor level 2; only armorLevel-gated stats require level 2.
setup([['shield','test_shield','ep19_renovated_superior_rgan_card',12,1,'shield']]);
assert.equal(b('sizeDmgReduce_small'),25);assert.equal(b('res'),0);assert.equal(b('mres'),0);
setup([['shield','test_shield','ep19_renovated_superior_rgan_card',12,2,'shield']]);
assert.equal(b('sizeDmgReduce_small'),25);assert.equal(b('res'),50);assert.equal(b('mres'),50);
setup([['armor','test_armor','double_eyed_dororo_shrimp_ep19_card',12,1,'armor']]);
assert.equal(b('hpPct'),30);assert.equal(b('atkPct'),10);assert.equal(b('res'),50);
setup([['armor','test_armor','double_eyed_dororo_shrimp_ep19_card',12,2,'armor']]);
assert.equal(b('hpPct'),30);assert.equal(b('atkPct'),10);assert.equal(b('res'),100);
setup([['footgear','test_shoes','ep19_entangled_intermediate_rgan_card',12,1,'footgear']]);
assert.equal(b('critRate'),20);assert.equal(b('critDmgPct'),10);assert.equal(b('cRate'),0);
setup([['footgear','test_shoes','ep19_entangled_intermediate_rgan_card',12,2,'footgear']]);
assert.equal(b('critRate'),20);assert.equal(b('critDmgPct'),10);assert.equal(b('cRate'),5);
const codex=vm.runInContext("getCodexPool().cards",ctx);assert(ids.every(id=>codex.includes(id)),'codex pool');
const album=vm.runInContext("boxPool('card').ids",ctx);
assert(ids.every(id=>album.includes(id)),'old card album pool');
const status=ctx.__V25406_EP19_CARD_COMPLETION__;
assert(status&&status.added.length===5);
console.log(JSON.stringify({version:'v2.5.406',added:status.added.length,album:ids.length,actualEffectTests:'passed',refine12IndependentOfArmorLv2:'passed',armorLv2OnlyBonuses:'passed'},null,2));
