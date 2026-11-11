// v2.5.284 EP21 card skill-link audit
const fs = require('fs');
const path = require('path');
const root = path.resolve(__dirname, '..');
const skillsText = fs.readFileSync(path.join(root, 'js/skills.js'), 'utf8');
const fourthText = fs.readFileSync(path.join(root, 'js/v2_5_content.js'), 'utf8');
const dataText = fs.readFileSync(path.join(root, 'js/data.js'), 'utf8');
const skillIds = new Set([...skillsText.matchAll(/^\s*([A-Za-z0-9_]+):\s*\{\s*id\s*:/gm)].map(m => m[1]));
// v2.5 四轉技能 ID 由職業清單索引動態產生；此清單對應實際 catalog 項目索引。
const dynamicIds = new Set(['v25_dragon_knight_6','v25_dragon_knight_7','v25_imperial_guard_12','v25_imperial_guard_13','v25_inquisitor_6','v25_inquisitor_8','v25_meister_10','v25_meister_8','v25_biolo_3','v25_biolo_4','v25_shadow_cross_3','v25_shadow_cross_4','v25_abyss_chaser_11','v25_abyss_chaser_10','v25_arch_mage_3','v25_arch_mage_6','v25_element_master_5','v25_element_master_6','v25_element_master_8','v25_arch_mage_20','v25_arch_mage_21','v25_troubadour_15','v25_troubadour_14','v25_windhawk_progressive_shot']);
const lines = dataText.split(/\r?\n/).filter(line => /^\s*'ep21_[^']+_card':/.test(line) && /perRefine:{/.test(line));
const rows = lines.map(line => {
  const id = (line.match(/'([^']+_card)'/) || [])[1];
  const keys = [...line.matchAll(/skillDmg_([A-Za-z0-9_]+)/g)].map(m => m[1]);
  const missing = [...new Set(keys.filter(k => !skillIds.has(k) && !dynamicIds.has(k)))];
  return { id, keys, missing };
});
if (rows.length !== 13) throw new Error(`Expected 13 supported EP21 cards with skill keys, found ${rows.length}`);
if (rows.some(r => !r.id || !r.keys.length)) throw new Error('EP21 card missing id or skill key');
if (!rows.some(r => r.id === 'ep21_reinhardt_card' && r.missing.length === 0)) throw new Error('Known fully-linked Reinhardt card regressed');
if (!rows.some(r => r.id === 'ep21_ylze_card' && r.keys.includes('v25_element_master_5') && r.keys.includes('v25_element_master_6') && r.keys.includes('v25_element_master_8'))) throw new Error('Ilze skill links regressed');
if (!rows.some(r => r.id === 'ep21_lee_card' && r.keys.includes('v25_arch_mage_20') && r.keys.includes('v25_arch_mage_21'))) throw new Error('Lee Arch Mage skill links regressed');
if (!rows.some(r => r.id === 'ep21_epesto_card' && r.keys.includes('v25_windhawk_progressive_shot') && r.keys.includes('sn_sharpshooting'))) throw new Error('Epesto Wind Hawk skill links regressed');
console.log(`EP21 supported cards audited: ${rows.length}; valid skill references: ${rows.reduce((n,r)=>n+r.keys.filter(k=>skillIds.has(k)||dynamicIds.has(k)).length,0)}; unresolved references: ${rows.reduce((n,r)=>n+r.missing.length,0)}`);
for (const r of rows) console.log(`${r.id}: ${r.keys.filter(k=>skillIds.has(k)||dynamicIds.has(k)).length}/${r.keys.length} valid${r.missing.length ? ' | missing: '+r.missing.join(', ') : ''}`);
