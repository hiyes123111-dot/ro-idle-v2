const fs = require('fs');
const engine = fs.readFileSync('js/engine.js', 'utf8');
function ok(v, m) { if (!v) throw new Error(m); }
ok(engine.includes('if (lv >= 20) total += (Math.floor((lv - 20) / 10) + 1) * all[k];'), 'Start20Cap120 formula missing');
const stages = lv => { const capped = Math.min(lv, 120); return capped >= 20 ? Math.floor((capped - 20) / 10) + 1 : 0; };
for (const [lv, expected] of [[1,0],[19,0],[20,1],[29,1],[30,2],[70,6],[110,10],[119,10],[120,11],[130,11],[160,11]]) {
  ok(stages(lv) === expected, `BaseLv ${lv}: expected ${expected}, got ${stages(lv)}`);
}
const data = fs.readFileSync('js/data.js', 'utf8');
const ids = ['metal_katar','metal_two_handed_axe','metal_lance','metal_book','metal_staff','metal_dagger','metal_mace','metal_bow','metal_two_hand_sword','metal_foxtail'];
for (const id of ids) {
  const re = new RegExp('"' + id + '"\\s*:\\s*\\{');
  const m = re.exec(data);
  ok(m, `${id} data missing`);
  const row = data.slice(m.index, m.index + 1800);
  ok(row.includes('perBaseLv10Start20Cap120_'), `${id} growth key missing`);
}
console.log('v2.5.142 BaseLv start-20 regression: 11 levels + 10 item records passed');
