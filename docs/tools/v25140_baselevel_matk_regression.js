const fs = require('fs');
const vm = require('vm');
const data = fs.readFileSync('js/data.js', 'utf8');
const engine = fs.readFileSync('js/engine.js', 'utf8');
const ctx = {};
vm.runInNewContext(data + '\nglobalThis.__items = ITEMS;', ctx);
const I = ctx.__items;
function ok(v, m) { if (!v) throw new Error(m); }
for (const id of ['scarlet_rod', 'scarlet_staff']) {
  ok(I[id] && I[id].perBaseLv10_matk === 5, `${id}: missing BaseLv +10 MATK +5 mapping`);
  ok(/BaseLv每上升10時MATK\+5/.test(I[id].desc), `${id}: source description changed unexpectedly`);
}
ok(engine.includes("if (!k.startsWith('perBaseLv10_')) continue;"), 'BaseLv +10 generic calculation missing');
ok(engine.includes("if ((state.baseLevel || 0) < 70) continue;"), 'BaseLv 70 start threshold missing');
console.log('PASS 6 BaseLv/MATK assertions');
