const fs=require('fs'),vm=require('vm'),assert=require('assert');
const c={console,Math,Set,Map,Float64Array};vm.createContext(c);
for(const f of ['js/data.js','js/engine.js']) vm.runInContext(fs.readFileSync(f,'utf8'),c,{timeout:30000});
const ids=['yorscalp_p_circlet','yorscalp_m_circlet','yorscalp_armor','yorscalp_robe','yorscalp_manteau','yorscalp_muffler','yorscalp_boots','yorscalp_shoes','yorscalp_ring','yorscalp_glove','yorscalp_earring','yorscalp_necklace'];
for(const id of ids) assert.equal(c.getItemBoxSources(id).length,0,id+' excluded from blue/violet random box sources');
console.log('v2.5.319 Yorscalp acquisition pool audit: PASS (12/12 excluded from random boxes)');
