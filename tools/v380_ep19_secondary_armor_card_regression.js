#!/usr/bin/env node
const fs = require('fs');
const vm = require('vm');
const d = fs.readFileSync('js/data.js', 'utf8');
const e = fs.readFileSync('js/engine.js', 'utf8');
let bad = 0;
const check = (name, ok) => { console.log(`${ok ? 'PASS' : 'FAIL'} ${name}`); if (!ok) bad++; };

function cardLine(id) {
  const start = d.indexOf(`'${id}':`, d.indexOf('const CARDS'));
  if (start < 0) return '';
  const end = d.indexOf('\n', start);
  return d.slice(start, end);
}
function cardObject(id) {
  const line = cardLine(id);
  const brace = line.indexOf('{');
  const comma = line.lastIndexOf('},');
  if (!line || brace < 0 || comma < 0) return null;
  try { return JSON.parse(line.slice(brace, comma + 1)); } catch (_) { return null; }
}
const modified = cardObject('modified_superior_rgan_ep19_card');
const oneEye = cardObject('one_eye_dollocaris_ep19_card');

check('改造上級蠕管：Lv2防具獨立給 RES/MRES +50',
  !!modified && modified.condBonus.some(x => x.when.armorLevelMin === 2 &&
    x.bonus.res === 50 && x.bonus.mres === 50));
check('改造上級蠕管：+12以上體型承傷 -25%',
  !!modified && modified.condBonus.some(x => x.when.refineMin === 12 && x.bonus.sizeDmgReduce_all === 25));
check('改造上級蠕管：+11以下體型承傷 +25%',
  !!modified && modified.condBonus.some(x => x.when.refineMax === 11 && x.bonus.sizeDmg_all === 25));
check('獨眼袋頭蝦：Lv2防具獨立給四屬性魔法傷害 +8%',
  !!oneEye && oneEye.condBonus.some(x => x.when.armorLevelMin === 2 &&
    ['holy','shadow','ghost','none'].every(k => x.bonus[`magicEleDmg_${k}`] === 8)));
check('獨眼袋頭蝦：+12以上四屬性魔法傷害 +25%',
  !!oneEye && oneEye.condBonus.some(x => x.when.refineMin === 12 &&
    ['holy','shadow','ghost','none'].every(k => x.bonus[`magicEleDmg_${k}`] === 25)));
check('獨眼袋頭蝦：+11以下四屬性魔法傷害 -25%',
  !!oneEye && oneEye.condBonus.some(x => x.when.refineMax === 11 &&
    ['holy','shadow','ghost','none'].every(k => x.bonus[`magicEleDmg_${k}`] === -25)));

const start = e.indexOf('function condMet(when, host, lo) {');
const end = e.indexOf('\n}\n', start);
const fn = start >= 0 && end > start ? e.slice(start, end + 3) : '';
check('引擎支援 armorLevelMin 條件', fn.includes('when.armorLevelMin') && fn.includes('防具等級'));
if (fn) {
  const sandbox = {
    ITEMS: {
      armor_lv2: { desc: '系列: 盾牌 防具等級: 2 要求等級: 200' },
      armor_lv1: { desc: '系列: 披肩 防具等級: 1 要求等級: 100' },
      armor_structured: { armorLevel: 2, desc: '一般裝備' },
    },
    state: {}
  };
  vm.runInNewContext(fn + '\nglobalThis.testCond = condMet;', sandbox);
  check('Lv2裝備可通過 armorLevelMin:2',
    sandbox.testCond({ armorLevelMin: 2 }, { itemId: 'armor_lv2', refine: 12 }, {}));
  check('Lv1裝備不會誤觸發 Lv2 效果',
    !sandbox.testCond({ armorLevelMin: 2 }, { itemId: 'armor_lv1', refine: 12 }, {}));
  check('結構化 armorLevel 欄位可判斷',
    sandbox.testCond({ armorLevelMin: 2 }, { itemId: 'armor_structured', refine: 12 }, {}));
  check('+12與Lv2條件可同時成立',
    sandbox.testCond({ armorLevelMin: 2, refineMin: 12 }, { itemId: 'armor_lv2', refine: 12 }, {}));
  check('+11不會通過 refineMin:12',
    !sandbox.testCond({ armorLevelMin: 2, refineMin: 12 }, { itemId: 'armor_lv2', refine: 11 }, {}));
}
const release = fs.readFileSync('VERSION.txt','utf8').trim().replace(/^v/,'');
const html = fs.readFileSync('index.html','utf8');
const cacheVersions = [...html.matchAll(/[?&]v=(2\.5\.\d+)/g)].map(m => m[1]);
check('HTML 所有 JS 快取版本與目前版本一致', cacheVersions.length === 26 && cacheVersions.every(v => v === release));
console.log(`${13 - bad}/13 passed`);
process.exit(bad ? 1 : 0);
