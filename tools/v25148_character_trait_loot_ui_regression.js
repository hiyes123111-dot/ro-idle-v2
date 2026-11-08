const fs = require('fs');
const src = fs.readFileSync('js/ui.js', 'utf8');
const checks = [
  ['loot feed defaults collapsed', /let _lootFeedCollapsed = true/.test(src)],
  ['loot feed can still toggle', /_lootFeedCollapsed=!_lootFeedCollapsed;renderLootNotices\(\)/.test(src)],
  ['loot history detail remains available', /openLootNoticeHistory\(\)/.test(src)],
  ['six fourth-job traits rendered', /四轉六大特性[\s\S]*?POW \$\{state\.traitStats\?\.pow/.test(src)],
  ['trait panel appears before active sets', src.indexOf('四轉六大特性') < src.indexOf('${setListHtml}')],
  ['derived trait values rendered', /四轉衍生：[\s\S]*?P\.ATK \$\{state\.pAtk/.test(src)],
];
for (const [name, ok] of checks) console.log(`${ok ? 'PASS' : 'FAIL'} ${name}`);
if (checks.some(x => !x[1])) process.exit(1);
