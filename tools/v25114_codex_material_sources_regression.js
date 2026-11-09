const fs = require('fs');
const path = require('path');
const root = path.resolve(__dirname, '..');
const engine = fs.readFileSync(path.join(root, 'js/engine.js'), 'utf8');
const ui = fs.readFileSync(path.join(root, 'js/ui.js'), 'utf8');
const content = fs.readFileSync(path.join(root, 'js/v2_content.js'), 'utf8');
const artifacts = fs.readFileSync(path.join(root, 'js/v2_artifacts.js'), 'utf8');
const checks = [
  ['素材掉落來源快取依資料簽章更新', engine.includes('_codexSourceSignature !== sourceSignature')],
  ['怪物地圖快取依資料簽章更新', engine.includes('_codexMapSignature !== mapSignature')],
  ['熾焰龍鱗有幼龍掉落來源', content.includes("addMonster('v2_ember_drake'") && content.includes("{item:'v2_dragon_scale',chance:0.12}")],
  ['熾焰龍鱗有裂風獵鷹掉落來源', content.includes("addMonster('v2_wind_hawk'") && content.includes("{item:'v2_dragon_scale',chance:0.06}")],
  ['裂隙核心碎片有裂隙守衛掉落來源', content.includes("addMonster('v2_rift_sentinel'") && content.includes("{item:'v2_rift_core',chance:0.08}")],
  ['裂隙核心碎片有深淵潛行者掉落來源', content.includes("addMonster('v2_abyss_stalker'") && content.includes("{item:'v2_rift_core',chance:0.1}")],
  ['神器工坊配方仍使用女神眼淚與瓦爾基里象徵', artifacts.includes('goddess_tear') && artifacts.includes('valkyrie_token')],
  ['打洞工坊顯示熾焰龍鱗來源', ui.includes("materialSourceRows('v2_dragon_scale')")],
  ['打洞工坊顯示裂隙核心來源', ui.includes("materialSourceRows('v2_rift_core')")],
  ['來源列包含地圖前往按鈕', ui.includes("codexGoToMap('${s.mapId}')")]
];
let failed = 0;
for (const [name, ok] of checks) {
  console.log(`${ok ? 'PASS' : 'FAIL'} ${name}`);
  if (!ok) failed++;
}
console.log(`${checks.length - failed}/${checks.length} passed`);
process.exitCode = failed ? 1 : 0;
