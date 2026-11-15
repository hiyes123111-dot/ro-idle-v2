const fs=require('fs'),vm=require('vm'),path=require('path'),assert=require('assert');
const root=path.resolve(__dirname,'..');
const ctx={console,window:{},document:{addEventListener(){},getElementById(){return null},querySelector(){return null},querySelectorAll(){return[]}},Image:function(){},localStorage:{getItem(){return null},setItem(){},removeItem(){}},setTimeout(){return 0},clearTimeout(){},setInterval(){return 0},clearInterval(){},requestAnimationFrame(){return 0},performance:{now(){return 0}},Math,Date,Map,Set,Array,Object,Number,String,JSON,RegExp,Float64Array};
ctx.window=ctx;vm.createContext(ctx);
const files=['data.js','img_alias.js','v2_5_397_card_catalog_batch.js','v2_5_398_card_catalog_batch.js','v2_5_399_card_catalog_batch.js','v2_5_400_ep21_card_completion.js','v2_5_401_card_catalog_batch.js','v2_5_402_ep21_encroached_tan_card.js','v2_5_403_ep21_missing_cards.js','v2_5_404_ep20_card_effect_completion.js','v2_5_405_ep19_album_gap_completion.js','v2_5_406_ep19_card_completion.js','v2_5_407_ep19_card_effect_and_catalog.js','v2_5_395_card_set_codex.js','v2_5_396_card_set_codex.js','engine.js'];
for(const f of files) vm.runInContext(fs.readFileSync(path.join(root,'js',f),'utf8'),ctx,{timeout:60000});
const ids=['unfrost_flower_ep19_card','discarded_primitive_rgan_ep19_card','cave_flower_ep19_card','one_eye_dollocaris_ep19_card','two_eyes_dollocaris_ep19_card'];
for(const id of ids){assert(vm.runInContext(`!!CARDS['${id}']`,ctx),`CARDS ${id}`);assert(vm.runInContext(`!!ITEMS['${id}']&&ITEMS['${id}'].codexInclude===true`,ctx),`ITEMS ${id}`);}
const setup=(slot,itemId,cardId,refine=0,armorLevel=1)=>{
 const instance='x_'+slot;
 vm.runInContext(`ITEMS['${itemId}_lv${armorLevel}']={id:'${itemId}_lv${armorLevel}',type:'armor',armorType:'armor',armorLevel:${armorLevel},desc:'防具等級: ${armorLevel}'};state={equip:{${slot}:'${instance}'},instances:{'${instance}':{item:'${itemId}_lv${armorLevel}',refine:${refine},cards:['${cardId}']}},stats:{str:100,agi:1,vit:100,int:100,dex:100,luk:1},baseLevel:250,jobLevel:60,jobId:'element_master',learnedSkills:{},traitAlloc:{spl:100}};`,ctx);
};
const b=k=>vm.runInContext(`getCardBonus('${k}')`,ctx);
// Unfrost flower: refine +3 increments; SP cost and P.ATK.
setup('armor','test_armor','unfrost_flower_ep19_card',6,1);assert.equal(b('pAtk'),1);assert.equal(b('spCostPct'),7);assert.equal(b('meleeDmgPct'),8);
// Discarded primitive + cave lantern combo; per-refine ghost magic damage.
setup('accessory1','test_acc','discarded_primitive_rgan_ep19_card',0,1);assert.equal(b('magicEleDmg_shadow'),35);assert.equal(b('spCostPct'),10);
vm.runInContext(`ITEMS.test_garment={id:'test_garment',type:'armor',armorType:'garment',armorLevel:1,desc:'防具等級: 1'};state.equip.garment='g';state.instances.g={item:'test_garment',refine:5,cards:['cave_flower_ep19_card']};`,ctx);
console.log('dbg',b('neutralDmgResistPct'),vm.runInContext("CARDS.cave_flower_ep19_card.bonus",ctx),vm.runInContext("CARDS.discarded_primitive_rgan_ep19_card.bonus",ctx),vm.runInContext("buildLoadout().cards",ctx));
assert.equal(b('neutralDmgResistPct'),20);assert.equal(b('magicEleDmg_ghost'),15);
// One-eye: refine +12 works on Lv.1; extra +8 only on Lv.2.
setup('garment','test_garment','one_eye_dollocaris_ep19_card',12,1);assert.equal(b('magicEleDmg_holy'),25);assert.equal(b('magicEleDmg_none'),25);assert.equal(b('neutralDmgResistPct'),20);
setup('garment','test_garment','one_eye_dollocaris_ep19_card',12,2);assert.equal(b('magicEleDmg_holy'),33);assert.equal(b('magicEleDmg_none'),33);
// Double-eye: refine +12 is independent; extra RES +50 is Lv.2 only.
setup('armor','test_armor','two_eyes_dollocaris_ep19_card',12,1);assert.equal(b('hpPct'),30);assert.equal(b('atkPct'),10);assert.equal(b('matkPct'),10);assert.equal(b('res'),50);
setup('armor','test_armor','two_eyes_dollocaris_ep19_card',12,2);assert.equal(b('hpPct'),30);assert.equal(b('atkPct'),10);assert.equal(b('res'),100);
const codex=vm.runInContext('getCodexPool().cards',ctx);assert(ids.every(id=>codex.includes(id)),'codex');
const album=vm.runInContext("boxPool('card').ids",ctx);assert(ids.every(id=>album.includes(id)),'old album');
for(const id of ids.slice(0,4))assert(fs.existsSync(path.join(root,'images/cards/generated',id+'.svg')),'art '+id);
const status=ctx.__V25407_EP19_CARD_EFFECTS__;assert(status&&status.updated.length===4&&status.doubleEyeCorrected);
console.log(JSON.stringify({version:'v2.5.407',updated:status.updated.length,verifiedCardEffects:5,codex:5,oldCardAlbum:5,refineAndArmorLv2Independent:'passed',result:'passed'},null,2));
