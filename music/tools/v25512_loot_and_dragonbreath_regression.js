const fs = require('fs'), path = require('path'), vm = require('vm');
const root = path.resolve(__dirname, '..'), js = path.join(root, 'js');
const ctx = { console, Date, Math, JSON, Object, Array, Set, Map, Number, String, RegExp,
  window: { addEventListener(){}, location:{} },
  document: { addEventListener(){}, getElementById(){return null}, querySelector(){return null}, querySelectorAll(){return[]}, createElement(){return{}}, body:{classList:{add(){},remove(){}},appendChild(){}} },
  navigator:{}, performance:{now:()=>0}, localStorage:{getItem(){return null},setItem(){},removeItem(){}},
  setTimeout:()=>0, clearTimeout(){}, setInterval:()=>0, clearInterval(){}, requestAnimationFrame:()=>0,
  alert(){}, confirm:()=>true, prompt:()=>null, URL, Blob, FileReader:function(){}, Image:function(){} };
ctx.window.window = ctx.window; vm.createContext(ctx);
for (const f of ['skills.js','monster_skills.js','jobs.js','data.js','relics.js','v2_content.js','v2_4_content.js','v2_5_content.js','v2_artifacts.js','engine.js'])
  vm.runInContext(fs.readFileSync(path.join(js,f),'utf8'),ctx,{filename:f,timeout:30000});
const items = vm.runInContext('ITEMS',ctx), monsters = vm.runInContext('MONSTERS',ctx);
const getSources = vm.runInContext('getItemSources',ctx), getBoxes = vm.runInContext('getItemBoxSources',ctx);
let fails = 0;
function check(ok,msg){ if(!ok){fails++; console.error('FAIL '+msg);} else console.log('PASS '+msg); }
const gear = ['v2_dragon_spear','v2_imperial_lance','v2_archmage_staff','v2_element_book','v2_wind_bow','v2_troubadour_harp','v2_trouvere_whip','v2_meister_axe','v2_biolo_injector','v2_shadow_katar','v2_abyss_dagger','v2_cardinal_staff','v2_inquisitor_knuckle','v2_rift_plate','v2_rift_mantle','v2_rift_boots','v2_rift_ring'];
let direct = 0, violet = 0;
for (const id of gear) {
  const hasItem = !!items[id];
  const hasDrop = getSources(id).length > 0;
  const box = getBoxes(id);
  const hasViolet = box.some(x => x.boxId === 'old_violet_box' && x.chance > 0);
  if (hasDrop) direct++;
  if (hasViolet) violet++;
  check(hasItem && hasDrop, `${id}: item registered with direct monster drop source`);
  check(hasItem && hasViolet, `${id}: included in current Mystery Violet Box pool`);
}
check(direct === gear.length, `all ${gear.length} new V2 equipment pieces have direct monster drops`);
check(violet === gear.length, `all ${gear.length} new V2 equipment pieces can be opened from Mystery Violet Box`);
const engine = fs.readFileSync(path.join(js,'engine.js'),'utf8');
const ui = fs.readFileSync(path.join(js,'ui.js'),'utf8');
check(engine.includes("sk.id === 'rk_dragonbreath' || sk.id === 'v25_dragon_knight_12'"), 'Rune Knight Dragon Training bonus also scales 4th-job Dragonic Breath');
check(ui.includes('getItemBoxSources(id)') && ui.includes('${boxRows}'), 'item codex renders box-source acquisition rows');
if (fails) { console.error(`FAILED ${fails} check(s)`); process.exit(1); }
console.log(`ALL PASSED — ${gear.length} equipment drop/box pairs + Dragon Breath passive linkage`);
