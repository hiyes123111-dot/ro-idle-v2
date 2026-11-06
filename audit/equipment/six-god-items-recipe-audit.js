const fs = require('fs');
const data = fs.readFileSync('js/data.js', 'utf8');
const recipes = fs.readFileSync('js/v2_artifacts.js', 'utf8');
const required = [
  ['Sleipnir recipe targets existing equipment', /id: 'sleipnir'[\s\S]*?itemId: 'sleipnir'/.test(recipes) && /\"sleipnir\": \{\"id\":\"sleipnir\"/.test(data)],
  ['Brisingamen recipe targets existing equipment ID', /id: 'brisingamen'[\s\S]*?itemId: 'brysinggamen'/.test(recipes) && /\"brysinggamen\": \{\"id\":\"brysinggamen\"/.test(data)],
  ['Mjolnir recipe targets existing equipment and keeps effect data', /id: 'mjolnir'[\s\S]*?itemId: 'mjolnir'/.test(recipes) && /\"mjolnir\": \{[^}]*\"aspdMax\":true/.test(data)],
  ['All new recipes require Base Lv.200', (recipes.match(/level: 200/g) || []).length >= 7],
];
let failed = 0;
for (const [name, ok] of required) { console.log(`${ok ? 'PASS' : 'FAIL'} ${name}`); if (!ok) failed++; }
console.log(`\nSix God Items recipe audit: ${required.length - failed}/${required.length} passed.`);
process.exitCode = failed ? 1 : 0;
