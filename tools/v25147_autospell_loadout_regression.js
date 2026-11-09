const fs = require('fs');
const path = require('path');
const engine = fs.readFileSync(path.join(__dirname, '../js/engine.js'), 'utf8');
const data = fs.readFileSync(path.join(__dirname, '../js/data.js'), 'utf8');
if (!/Object\.entries\(lo\.cardHosts\)\.forEach\(\(\[cardId, hosts\]\)/.test(engine)) {
  throw new Error('Card proc loading must inspect every installed copy/host of the same card');
}
if (!/conditionalAutoSpellMeta/.test(engine) || !/sourceItemId: d\.itemId/.test(engine)) {
  throw new Error('Conditional equipment autoSpell entries are not wired into the proc pipeline');
}
for (const [itemId, skillKey] of [
  ['smoky_transformhat_lt', 'autoSpell_chainLightning'],
  ['changeable_magic_cape', 'autoSpell_thunderstorm'],
  ['changeable_magic_cape', 'autoSpell_heavensdrive'],
  ['magic_sword_lt', 'autoSpell_meteorstorm'],
  ['magic_sword_lt', 'autoSpell_psychicwave'],
  ['oriental_sword_lt', 'autoSpell_sonicwave'],
  ['cd_in_mouthk', 'autoSpell_gravitation']
]) {
  if (!data.includes(itemId) || !data.includes(skillKey)) throw new Error(`Missing source data: ${itemId}/${skillKey}`);
}
console.log('PASS: duplicate card hosts and 7 conditional equipment autocast mappings are wired');
