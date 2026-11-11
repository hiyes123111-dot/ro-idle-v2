// v2.5.108 artifact material drop source regression
const fs = require('fs');
const path = require('path');
const src = fs.readFileSync(path.join(__dirname, '..', 'js', 'v2_content.js'), 'utf8');
const ui = fs.readFileSync(path.join(__dirname, '..', 'js', 'ui.js'), 'utf8');
const expected = {
  goddess_tear: ['v2_rift_guardian','v2_void_emperor'],
  valkyrie_token: ['v2_rift_guardian','v2_void_emperor'],
  brynhild_armor_piece: ['v2_rift_guardian'],
  hero_remains: ['v2_rift_guardian'],
  andvari_ring: ['v2_rift_guardian'],
  dusk_glow: ['v2_rift_guardian','v2_void_emperor'],
  dawn_essence: ['v2_rift_guardian','v2_void_emperor'],
  cold_moonlight: ['v2_void_emperor'],
  hazy_starlight: ['v2_void_emperor'],
  v2_rift_core: ['v2_rift_sentinel','v2_abyss_stalker','v2_biolo_beast','v2_void_emperor'],
  v2_dragon_scale: ['v2_ember_drake','v2_wind_hawk','v2_void_emperor']
};
let failures = [];
for (const [item, monsters] of Object.entries(expected)) {
  for (const mon of monsters) {
    const line = src.split('\\n').find(s => s.includes("addMonster('" + mon + "'"));
    if (!line || !line.includes("item:'" + item + "'")) failures.push(`${item} missing from ${mon}`);
  }
}
if (!ui.includes("const drops = (d.drops || []).slice()") ||
    !ui.includes("getItemFarmSpots(id)")) failures.push('encyclopedia drop render path missing');
if (failures.length) { console.error(failures.join('\\n')); process.exit(1); }
console.log(`PASS: ${Object.values(expected).reduce((n,a)=>n+a.length,0)} material-monster links + encyclopedia display path`);
