const fs = require('fs');
const data = fs.readFileSync('js/data.js', 'utf8');
const ui = fs.readFileSync('js/ui.js', 'utf8');
const engine = fs.readFileSync('js/engine.js', 'utf8');
const fragments = [
  'ep21_tris_card_fragment','ep21_tan_borg_card_fragment','ep21_bihailin_card_fragment',
  'ep21_reinhardt_card_fragment','ep21_evan_wigner_card_fragment','ep21_lalila_card_fragment',
  'ep21_richard_card_fragment','ep21_lora_card_fragment','ep21_aurely_card_fragment',
  'ep21_ylze_card_fragment','ep21_epesto_card_fragment','ep21_mary_stella_card_fragment',
  'ep21_john_card_fragment','ep21_kunt_card_fragment','ep21_galacia_card_fragment',
  'ep21_iana_card_fragment','ep21_lee_card_fragment','ep21_nadoyou_card_fragment'
];
const assert = (ok, msg) => { if (!ok) throw new Error('FAIL ' + msg); console.log('PASS ' + msg); };
assert(data.includes("ep21_corrupted_tan: {id:'ep21_corrupted_tan'"), 'EP21 boss exists in monster database');
assert(ui.includes("if (id === 'ep21_corrupted_tan')") && ui.includes('specialRewardRows'), 'Boss codex renders special reward pool');
assert(fragments.every(id => ui.includes(id)), 'All 18 fragment rewards appear in boss codex');
assert(ui.includes("{id:'yorscalp_p_circlet', chance:1}") && ui.includes("{id:'yorscalp_m_circlet', chance:1}"), 'Both headgears appear at 1% each');
assert(engine.includes('Math.random() < 0.25') && engine.includes('試煉將持續進行，稍後自動迎戰下一隻首領'), 'Actual boss reward and continuous challenge logic retained');
assert(ui.includes('直接進入 EP21 副本') && ui.includes('enterEp21FinalTrial()'), 'Boss codex includes direct dungeon entrance');
assert(data.includes("return 'images/_placeholder_monster.png'"), 'Missing boss sprite uses existing placeholder');
console.log('v2.5.305 EP21 codex reward regression: 7/7 passed');
