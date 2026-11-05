const fs = require('fs');
const path = require('path');

const jsDir = path.join(process.cwd(), 'js');
const registryFiles = fs.readdirSync(jsDir)
  .filter(name => name === 'skills.js' || /^v2.*_content\.js$/.test(name))
  .map(name => path.join(jsDir, name));
const sources = registryFiles.map(file => [path.basename(file), fs.readFileSync(file, 'utf8')]);
const dataSrc = fs.readFileSync(path.join(jsDir, 'data.js'), 'utf8');
const engineSrc = fs.readFileSync(path.join(jsDir, 'engine.js'), 'utf8');

const ids = new Set();
for (const [, src] of sources) {
  for (const m of src.matchAll(/^\s{2}([A-Za-z0-9_]+):\s*\{/gm)) ids.add(m[1]);
  for (const m of src.matchAll(/(?:active|passive)\('([^']+)'/g)) ids.add(m[1]);
}
const keys = [...new Set([...dataSrc.matchAll(/skillDmg_([A-Za-z0-9_]+)/g)].map(m => m[1]))];
const aliasBlock = engineSrc.match(/const legacySkillAliases = \{([\s\S]*?)\n  \};/);
if (!aliasBlock) throw new Error('legacySkillAliases table missing');
const aliases = new Map([...aliasBlock[1].matchAll(/([A-Za-z0-9_]+):\s*'([^']+)'/g)].map(m => [m[1], m[2]]));
const unresolved = keys.filter(key =>
  ![...ids].some(id => id === key || id.replace(/^[a-z]{1,4}_/, '') === key) &&
  !aliases.has(key)
);
if (keys.length !== 85) throw new Error(`expected 70 skill bonus keys, got ${keys.length}`);
if (unresolved.length !== 39) throw new Error(`expected 31 explicitly unresolved keys, got ${unresolved.length}: ${unresolved.join(', ')}`);
for (const [key, target] of aliases) {
  if (!keys.includes(key)) throw new Error(`alias has no data source: ${key}`);
  if (!ids.has(target)) throw new Error(`alias target missing: ${key} -> ${target}`);
}
for (const unsafe of ['carttornado', 'rollingcutter', 'duple_light']) {
  if (aliases.has(unsafe)) throw new Error(`unsupported official skill must not be redirected: ${unsafe}`);
}
console.log(`PASS ${registryFiles.length} skill registry files scanned; ${ids.size} registered IDs; ${keys.length} skill bonus keys; ${keys.length - unresolved.length} supported; ${unresolved.length} unresolved; alias targets valid`);
