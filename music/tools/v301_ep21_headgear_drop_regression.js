const fs = require('fs');
const assert = require('assert');
const data = fs.readFileSync('js/data.js', 'utf8');
const engine = fs.readFileSync('js/engine.js', 'utf8');
for (const [id, name] of [['yorscalp_p_circlet','耶斯卡夫執行之冠'],['yorscalp_m_circlet','耶斯卡夫審判之冠']]) {
  assert(data.includes(`"${id}"`), `${name} item exists`);
  assert(engine.includes(`{ item: '${id}', chance: 0.01 }`), `${name} has 1% boss drop`);
}
assert(engine.includes('if (isEp21TrialBoss) {\n    const headgearDrops'), 'headgear drops are restricted to EP21 trial boss');
assert(engine.includes('Math.random() < d.chance * dropMult'), 'headgear drop respects drop multiplier');
assert(engine.includes('addItem(d.item, 1)'), 'headgear is added to inventory');
assert(engine.includes('試煉首領掉落'), 'headgear drop is logged');
assert(engine.includes('Math.random() < 0.25'), 'existing fragment reward remains');
console.log('v2.5.301 EP21 headgear drop regression: PASS (2 headgears, 1% each, boss-only, drop bonus, fragment reward retained)');
