const fs = require('fs');
const vm = require('vm');
const ctx = { window:{}, document:{addEventListener(){},getElementById(){return null},querySelector(){return null},querySelectorAll(){return[]}}, localStorage:{getItem(){return null},setItem(){},removeItem(){}}, console, setTimeout(){return 0},clearTimeout(){},setInterval(){return 0},clearInterval(){},requestAnimationFrame(){return 0},performance:{now(){return 0}}, Math,Date,Map,Set,Array,Object,Number,String,JSON,RegExp,Float64Array };
vm.createContext(ctx);
for (const f of ['../js/data.js','../js/v2_5_392_card_catalog_repair.js','../js/v2_5_394_card_catalog_audit.js','../js/v2_5_395_card_set_codex.js','../js/v2_5_396_card_set_codex.js']) vm.runInContext(fs.readFileSync(__dirname+'/'+f,'utf8'),ctx,{timeout:30000});
const result = vm.runInContext(`(() => {
 let total=0, indexed=0, missing=[], kinds={};
 for (const [id,c] of Object.entries(CARDS)) for (const [i,r] of (c.condBonus||[]).entries()) {
   const w=r.when||{}; const has= ['withCards','withItems','withAnyItem','withItemGroups'].some(k=>Array.isArray(w[k]) && w[k].length);
   if (!has) continue; total++; if (r.setName && r.setId) indexed++;
   for (const k of ['withCards','withItems','withAnyItem']) for (const x of (w[k]||[])) if (!(CARDS[x]||ITEMS[x])) missing.push(id+':'+k+':'+x);
   for (const g of (w.withItemGroups||[])) for (const x of g) if (!(CARDS[x]||ITEMS[x])) missing.push(id+':withItemGroups:'+x);
 }
 return {total,indexed,missing,meta:window.__V25396_CARD_SET_CODEX__};
})()`,ctx);
if (result.total !== result.indexed) throw new Error('combo rules not fully indexed: '+JSON.stringify(result));
if (result.missing.length) throw new Error('missing set member definitions: '+JSON.stringify(result.missing));
if (!result.meta || result.meta.cardItemRules < 14) throw new Error('item/card combo rules were not indexed: '+JSON.stringify(result.meta));
console.log(JSON.stringify(result,null,2));
