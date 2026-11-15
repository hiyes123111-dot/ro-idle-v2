const fs = require('fs');
const vm = require('vm');
const ctx = { window:{}, document:{addEventListener(){},getElementById(){return null},querySelector(){return null},querySelectorAll(){return []}}, localStorage:{getItem(){return null},setItem(){},removeItem(){}}, console, setTimeout(){return 0},clearTimeout(){},setInterval(){return 0},clearInterval(){},requestAnimationFrame(){return 0},performance:{now(){return 0}}, Math,Date,Map,Set,Array,Object,Number,String,JSON,RegExp,Float64Array };
vm.createContext(ctx);
for (const f of ['../js/data.js','../js/v2_5_392_card_catalog_repair.js','../js/v2_5_394_card_catalog_audit.js','../js/v2_5_395_card_set_codex.js']) vm.runInContext(fs.readFileSync(__dirname+'/'+f,'utf8'),ctx,{timeout:30000});
const result = vm.runInContext(`(() => { let total=0, indexed=0, missing=[]; for (const [id,c] of Object.entries(CARDS)) for (const [i,r] of (c.condBonus||[]).entries()) if (r.when && Array.isArray(r.when.withCards) && r.when.withCards.length) { total++; if (r.setName && r.setId) indexed++; else missing.push(id+':'+i); } return {total,indexed,missing, added:(window.__V25395_CARD_SET_CODEX__||{}).indexedRules||0}; })()`,ctx);
if (result.total !== result.indexed || result.missing.length) throw new Error('card set metadata incomplete: '+JSON.stringify(result));
if (result.total < 20) throw new Error('unexpectedly low card set coverage: '+JSON.stringify(result));
console.log(JSON.stringify(result,null,2));
