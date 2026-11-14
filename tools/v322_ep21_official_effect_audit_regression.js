// v2.5.322: verifies the EP21 official-effect audit does not overstate unsupported features.
const fs=require('fs'),vm=require('vm'),assert=require('assert');
const c={};vm.createContext(c);
vm.runInContext(fs.readFileSync('js/data.js','utf8')+';globalThis.x={ITEMS};',c,{timeout:30000});
const I=c.x.ITEMS;
const gear=['yorscalp_p_circlet','yorscalp_m_circlet','yorscalp_armor','yorscalp_robe','yorscalp_manteau','yorscalp_muffler','yorscalp_boots','yorscalp_shoes','yorscalp_ring','yorscalp_glove','yorscalp_earring','yorscalp_necklace'];
for(const id of gear){assert(I[id],id+' exists');assert.equal(I[id].type,'armor',id+' wearable');}
const enchant=['str','int','smart','speed','def'].flatMap(k=>[1,2,3,4].map(n=>'yorscalp_'+k+n));
for(const id of enchant) assert(I[id],id+' enchant material exists');
const cards=Object.keys(I).filter(id=>/^ep21_.*_card$/.test(id));
assert(cards.length>=18,'at least 18 EP21 character cards recorded; newer card rows are allowed');
const eng=fs.readFileSync('js/engine.js','utf8');
assert(!eng.includes("getCardBonus('skillAfterDelayPct')"),'skillAfterDelayPct not claimed as active');
assert(!eng.includes("getCardBonus('variableCastPct')"),'variable cast not claimed as active');
assert(!eng.includes("getCardBonus('fixedCast')"),'fixed cast not claimed as active');
const data=fs.readFileSync('js/data.js','utf8');
assert(data.includes('物理抵抗力5%；本作目前沒有RES穿透計算'),'physical RES penetration clearly marked unsupported');
assert(data.includes('魔法抵抗力5%；本作目前沒有MRES穿透計算'),'magic MRES penetration clearly marked unsupported');
console.log('v2.5.322 EP21 official-effect audit: PASS (12 gear, 20 enchant materials, '+cards.length+' cards; unsupported effects explicitly identified)');
