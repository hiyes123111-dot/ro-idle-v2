const fs = require('fs');
const path = require('path');
const root = path.resolve(__dirname, '..');
const engine = fs.readFileSync(path.join(root, 'js/engine.js'), 'utf8');
const data = fs.readFileSync(path.join(root, 'js/data.js'), 'utf8');
const checks = [
 ['技能攻擊接通通用元素耐性', /skillElemResist = getCardBonus\('eleDmgReduce_all'\)/.test(engine)],
 ['普通攻擊接通通用元素耐性', /basicElemResist = getCardBonus\('eleDmgReduce_all'\)/.test(engine)],
 ['地屬性耐性有元素條件', /el === 'earth' \? getCardBonus\('earthDmgResistPct'\)/.test(engine)],
 ['大型體型耐性有體型條件', /monDef\.size === 'large' \? getCardBonus\('sizeResist_large'\)/.test(engine)],
 ['通用種族耐性接入技能與普攻', (engine.match(/getCardBonus\('raceDmgResist_all'\)/g)||[]).length >= 2],
 ['通用體型耐性接入技能與普攻', (engine.match(/getCardBonus\('sizeDmgResist_all'\)/g)||[]).length >= 2],
 ['expGainPct接入線上經驗', /getCardBonus\('expAllPct'\) \+ getCardBonus\('expGainPct'\)/.test(engine)],
 ['expGainPct資料存在', /expGainPct:1/.test(data)],
 ['階級增傷未誤用BOSS標記', !/getCardBonus\('allClassDmg'\)/.test(engine)]
];
let failed=0;
for(const [n,ok] of checks){console.log(`${ok?'PASS':'FAIL'} ${n}`);if(!ok)failed++;}
console.log(`${checks.length-failed}/${checks.length} passed`);
process.exitCode=failed?1:0;
