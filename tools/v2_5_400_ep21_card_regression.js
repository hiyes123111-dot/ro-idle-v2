/* v2.5.400 EP21 card catalog regression — standalone Node runner */
const fs = require('fs');
const path = require('path');
const vm = require('vm');
const root = path.resolve(__dirname, '..');
const ctx = { console, window: {}, document: {}, Image: function(){}, localStorage: { getItem(){return null;}, setItem(){} } };
ctx.window = ctx;
vm.createContext(ctx);
[
  'data.js','img_alias.js','v2_5_392_card_catalog_repair.js','v2_5_394_card_catalog_audit.js',
  'v2_5_397_card_catalog_batch.js','v2_5_398_card_catalog_batch.js','v2_5_399_card_catalog_batch.js',
  'v2_5_400_ep21_card_completion.js','v2_5_395_card_set_codex.js','v2_5_396_card_set_codex.js'
].forEach(file => vm.runInContext(fs.readFileSync(path.join(root, 'js', file), 'utf8'), ctx, { timeout: 30000 }));
const result = vm.runInContext(`(() => {
  const ids = [
    'ep21_yerldos_inquisitor_card','ep21_yerldos_judge_card','ep21_yerldos_executor_card',
    'ep21_yermi_missionary_card','ep21_yermi_card','ep21_yeltus_judge_card',
    'ep21_yeltus_wizard_card','ep21_yeskopus_guard_card','ep21_yeskopus_wizard_card',
    'ep21_yest_solver_card','ep21_yest_negotiator_card','ep21_yeltus_executor_card',
    'ep21_ghost_ship_captain_card'
  ];
  const missing = ids.filter(id => !CARDS[id] || !ITEMS[id]);
  const invalidSlots = ids.filter(id => CARDS[id] && ITEMS[id] && !CARDS[id].slot);
  const brokenSets = ids.flatMap(id => (CARDS[id]?.condBonus || []).flatMap(rule =>
    (rule.when?.withCards || []).filter(other => !CARDS[other]).map(other => id + '->' + other)
  ));
  const missingCodex = ids.filter(id => ITEMS[id] && ITEMS[id].codexInclude !== true);
  const missingArt = ids.filter(id => !CARD_ART_FALLBACKS[id]);
  return { total: ids.length, added: window.__V25400_EP21_CARD_COMPLETION__.added.length,
    missing, invalidSlots, brokenSets, missingCodex, missingArt,
    indexedSetRules: window.__V25396_CARD_SET_CODEX__.indexedRules, artPaths: ids.map(id => window.CARD_ART_FALLBACKS[id]) };
})()`, ctx);
result.missingArtFiles = result.artPaths.filter(rel => !fs.existsSync(path.join(root, rel)));
console.log('[v2.5.400 EP21 card regression]', result);
if (result.missing.length || result.invalidSlots.length || result.brokenSets.length || result.missingCodex.length || result.missingArt.length || result.missingArtFiles.length) {
  process.exitCode = 1;
}
