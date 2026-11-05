const fs = require('fs');
const path = require('path');
const jsDir = path.join(process.cwd(), 'js');
const registryFiles = fs.readdirSync(jsDir)
  .filter(name => name === 'skills.js' || /^v2.*_content\.js$/.test(name));
const ids = new Set();
for (const name of registryFiles) {
  const src = fs.readFileSync(path.join(jsDir, name), 'utf8');
  for (const m of src.matchAll(/^\s{2}([A-Za-z0-9_]+):\s*\{/gm)) ids.add(m[1]);
  for (const m of src.matchAll(/(?:active|passive)\('([^']+)'/g)) ids.add(m[1]);
}
const dataSrc = fs.readFileSync(path.join(jsDir, 'data.js'), 'utf8');
const engineSrc = fs.readFileSync(path.join(jsDir, 'engine.js'), 'utf8');
const keys = [...new Set([...dataSrc.matchAll(/skillDmg_([A-Za-z0-9_]+)/g)].map(m => m[1]))].sort();
const aliasBlock = engineSrc.match(/const legacySkillAliases = \{([\s\S]*?)\n  \};/);
if (!aliasBlock) throw new Error('legacySkillAliases table missing');
const aliases = new Map([...aliasBlock[1].matchAll(/([A-Za-z0-9_]+):\s*'([^']+)'/g)].map(m => [m[1], m[2]]));
const unresolved = [];
for (const key of keys) {
  const native = [...ids].some(id => id === key || id.replace(/^[a-z]{1,4}_/, '') === key);
  const aliasTarget = aliases.get(key);
  if (aliasTarget && !ids.has(aliasTarget)) throw new Error(`${key} points to missing skill ${aliasTarget}`);
  if (!native && !aliasTarget) unresolved.push(key);
}
for (const [key, target] of aliases) {
  if (!keys.includes(key)) throw new Error(`alias ${key} has no data source`);
  if (!ids.has(target)) throw new Error(`alias ${key} points to missing skill ${target}`);
}
console.log(`Registry files scanned: ${registryFiles.join(', ')}`);
console.log(`Registered skill IDs: ${ids.size}`);
console.log(`Skill bonus keys: ${keys.length}`);
console.log(`Registered native / verified alias keys: ${keys.length - unresolved.length}`);
console.log(`Unresolved keys: ${unresolved.length}`);
console.log(unresolved.join(', '));
console.log('PASS — all registry sources scanned; every configured alias has a registered skill target');
