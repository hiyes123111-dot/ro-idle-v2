const fs = require('fs');
const path = require('path');
const root = path.resolve(__dirname, '..');
const engine = fs.readFileSync(path.join(root, 'js/engine.js'), 'utf8');
const data = fs.readFileSync(path.join(root, 'js/data.js'), 'utf8');
if (!engine.includes('|JobLv1|JobLv2|JobLv5|JobLv10|Stat|Skill')) throw new Error('flat equipment importer does not include perJobLv5_');
if (!engine.includes("if (!k.startsWith('perJobLv5_')) continue;")) throw new Error('perJobLv5 calculation dispatch missing');
if (!data.includes('"perJobLv5_pow":-1') || !data.includes('"perJobLv5_con":-1')) throw new Error('hourglass necklace JobLv5 source data missing');
console.log('PASS flat equipment importer includes perJobLv5 and calculation/data coverage remains present');
