const fs = require('fs');
const path = require('path');
const jsDir = path.join(process.cwd(), 'js');
const registryFiles = fs.readdirSync(jsDir).filter(name =>
  name === 'skills.js' || /^v2.*_content\.js$/.test(name) || name === 'v2_6_skill_migration.js'
);
const ids = new Set();
for (const file of registryFiles) {
  const src = fs.readFileSync(path.join(jsDir, file), 'utf8');
  for (const m of src.matchAll(/^\s{2}([A-Za-z0-9_]+):\s*\{/gm)) ids.add(m[1]);
  for (const m of src.matchAll(/(?:active|passive|put)\('([^']+)'/g)) ids.add(m[1]);
}
const data = fs.readFileSync(path.join(jsDir, 'data.js'), 'utf8');
const engine = fs.readFileSync(path.join(jsDir, 'engine.js'), 'utf8');
const keys = [...new Set([...data.matchAll(/skillDmg_([A-Za-z0-9_]+)/g)].map(m => m[1]))];
const block = engine.match(/const legacySkillAliases = \{([\s\S]*?)\n  \};/);
if (!block) throw new Error('alias table missing');
const aliases = new Map([...block[1].matchAll(/([A-Za-z0-9_]+):\s*'([^']+)'/g)].map(m => [m[1], m[2]]));
const unresolved = keys.filter(key => !ids.has(key) &&
  ![...ids].some(id => id.replace(/^[a-z]{1,4}_/, '') === key) && !aliases.has(key));
for (const [key, target] of aliases) {
  if (!keys.includes(key)) throw new Error(`alias has no data source: ${key}`);
  if (!ids.has(target)) throw new Error(`alias target missing: ${key} -> ${target}`);
}
if (!aliases.has('hundredspear') || !aliases.has('rollingcutter') || !aliases.has('windcutter'))
  throw new Error('expected verified migration aliases are missing');
const html = fs.readFileSync(path.join(process.cwd(), 'index.html'), 'utf8');
if (html.indexOf('js/v2_6_skill_migration.js') > html.indexOf('js/engine.js'))
  throw new Error('migration script loads after engine');
console.log(`PASS ${registryFiles.length} registry sources; ${ids.size} IDs; ${keys.length} skill bonus keys; ${keys.length-unresolved.length} supported; ${unresolved.length} unresolved`);
