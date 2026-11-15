const fs=require('fs'),vm=require('vm'),path=require('path');
const root=path.resolve(__dirname,'..');
const ctx={window:{},CARD_ART_FALLBACKS:{},document:{addEventListener(){},getElementById(){return null},querySelector(){return null},querySelectorAll(){return[]}},localStorage:{getItem(){return null},setItem(){},removeItem(){}},console,setTimeout(){return 0},clearTimeout(){},setInterval(){return 0},clearInterval(){},requestAnimationFrame(){return 0},performance:{now(){return 0}},Math,Date,Map,Set,Array,Object,Number,String,JSON,RegExp,Float64Array};
vm.createContext(ctx);
for(const f of ['../js/data.js','../js/v2_5_392_card_catalog_repair.js','../js/v2_5_394_card_catalog_audit.js','../js/v321_ep21_drops_and_images.js','../js/v2_5_397_card_catalog_batch.js','../js/v2_5_398_card_catalog_batch.js','../js/v2_5_399_card_catalog_batch.js','../js/v2_5_395_card_set_codex.js','../js/v2_5_396_card_set_codex.js','../js/engine.js']) vm.runInContext(fs.readFileSync(path.join(__dirname,f),'utf8'),ctx,{timeout:30000});
const defs=[['flygarian_card','none'],['dedre_card','holy'],['benedi_card','poison'],['mutant_litus_chimera_card','wind'],['mutant_filia_chimera_card','fire'],['mutant_water_spirit_chimera_card','water'],['mutant_lava_chimera_card','shadow'],['mutant_unicorn_glory_chimera_card','earth']];
const run=expr=>vm.runInContext(expr,ctx),assert=(v,m)=>{if(!v)throw new Error(m)};
assert(ctx.window.__V25399_CARD_BATCH__.total===8,'eight cards registered');
for(const [id,ele] of defs){
 assert(run(`!!CARDS['${id}'] && !!ITEMS['${id}'] && ITEMS['${id}'].codexInclude`),`catalog/codex missing ${id}`);
 assert(run(`!!CARD_ART_FALLBACKS['${id}']`),`fallback missing ${id}`);
 assert(fs.existsSync(path.join(root,run(`CARD_ART_FALLBACKS['${id}']`))),`art fallback file missing ${id}`);
 run(`ITEMS.test_headgear={id:'test_headgear',type:'armor',armorType:'headgear'}; state={equip:{head_top:'hg'},instances:{hg:{item:'test_headgear',refine:0,cards:['${id}']}},stats:{str:1,agi:1,vit:1,int:1,dex:1,luk:1},baseLevel:230,jobLevel:60,jobId:'element_master',learnedSkills:{},traitAlloc:{}}`);
 assert(run(`getCardBonus('matk')`)===15,`${id} MATK +15 not applied`);
 assert(run(`getCardBonus('magicEleDmg_${ele}')`)===7,`${id} elemental magic bonus not applied`);
 assert(run(`getCardBonus('spCostPct')`)===5,`${id} SP cost +5 not applied`);
}
const codex=run(`getCodexPool().cards`),album=run(`boxPool('card').ids`);
assert(defs.every(([id])=>codex.includes(id)),'new cards missing from codex pool');
assert(defs.every(([id])=>album.includes(id)),'new cards missing from card album');
console.log(JSON.stringify({version:'v2.5.399',newCards:defs.length,matkTests:8,elementMagicTests:8,spCostTests:8,codex:8,cardAlbum:8,artFallbacks:8},null,2));
