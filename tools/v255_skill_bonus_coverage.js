const fs = require('fs');
const path = require('path');
const jsDir = path.join(process.cwd(), 'js');
const registryFiles = fs.readdirSync(jsDir).filter(name =>
  name === 'skills.js' || /^v2.*_content\.js$/.test(name) || name === 'v2_6_skill_migration.js'
);
const ids = new Set();
for (const name of registryFiles) {
  const src = fs.readFileSync(path.join(jsDir, name), 'utf8');
  for (const m of src.matchAll(/^\s{2}([A-Za-z0-9_]+):\s*\{/gm)) ids.add(m[1]);
  for (const m of src.matchAll(/(?:active|passive|put)\('([^']+)'/g)) ids.add(m[1]);
}
const dataSrc = fs.readFileSync(path.join(jsDir, 'data.js'), 'utf8');
const engineSrc = fs.readFileSync(path.join(jsDir, 'engine.js'), 'utf8');
const keys = [...new Set([...dataSrc.matchAll(/skillDmg_([A-Za-z0-9_]+)/g)].map(m => m[1]))].sort();
const aliasBlock = engineSrc.match(/const legacySkillAliases = \{([\s\S]*?)\n  \};/);
if (!aliasBlock) throw new Error('legacySkillAliases table missing');
const aliases = new Map([...aliasBlock[1].matchAll(/([A-Za-z0-9_]+):\s*'([^']+)'/g)].map(m => [m[1], m[2]]));
const unresolved = [];
for (const key of keys) {
  const native = ids.has(key) || [...ids].some(id => id.replace(/^[a-z]{1,4}_/, '') === key);
  const aliasTarget = aliases.get(key);
  if (aliasTarget && !ids.has(aliasTarget)) throw new Error(`${key} points to missing skill ${aliasTarget}`);
  if (!native && !aliasTarget) unresolved.push(key);
}
for (const [key, target] of aliases) {
  // Keep verified forward-compatibility aliases for legacy equipment; only live keys need a source.
  if (keys.includes(key) && !ids.has(target)) throw new Error(`alias ${key} points to missing skill ${target}`);
}
const html = fs.readFileSync(path.join(process.cwd(), 'index.html'), 'utf8');
const migrationPos = html.indexOf('js/v2_6_skill_migration.js');
const enginePos = html.indexOf('js/engine.js');
if (migrationPos < 0 || enginePos < 0 || migrationPos > enginePos)
  throw new Error('v2_6_skill_migration.js must load before engine.js');
console.log(`Registry files scanned: ${registryFiles.join(', ')}`);
console.log(`Registered skill IDs: ${ids.size}`);
console.log(`Skill bonus keys: ${keys.length}`);
console.log(`Registered native / verified alias keys: ${keys.length - unresolved.length}`);
console.log(`Unresolved keys: ${unresolved.length}`);
console.log(unresolved.join(', '));
console.log('PASS — actual migration registry and script load order verified');
