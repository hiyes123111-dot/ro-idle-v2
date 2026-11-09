const fs = require('fs');
const data = fs.readFileSync('js/data.js', 'utf8');
const line = data.split('\n').find(x => x.includes('"fourth_1h_mace":'));
if (!line) throw new Error('missing fourth_1h_mace');
if (!line.includes('"skillDmg_cd_framen":5')) throw new Error('missing Cardinal skill damage key');
if (!line.includes('"healPct":5')) throw new Error('missing healing bonus');
if (line.includes('"allTargetDmgPct":5')) throw new Error('incorrect generic damage key remains');
console.log('v2.5.218 level-200 Cardinal mace regression: 4/4 passed');
