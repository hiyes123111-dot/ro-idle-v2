const fs = require('fs');
const skillsSrc = fs.readFileSync('js/skills.js', 'utf8');
const v2Src = fs.readFileSync('js/v2_content.js', 'utf8');
const dataSrc = fs.readFileSync('js/data.js', 'utf8');
const engineSrc = fs.readFileSync('js/engine.js', 'utf8');
const ids = new Set([
  ...[...skillsSrc.matchAll(/^\s{2}([A-Za-z0-9_]+):\s*\{/gm)].map(m => m[1]),
  ...[...v2Src.matchAll(/(?:active|passive)\('([^']+)'/g)].map(m => m[1]),
]);
const keys = [...new Set([...dataSrc.matchAll(/skillDmg_([A-Za-z0-9_]+)/g)].map(m => m[1]))];
const aliasBlock = engineSrc.match(/const legacySkillAliases = \{([\s\S]*?)\n  \};/);
if (!aliasBlock) throw new Error('legacySkillAliases table missing');
const aliases = new Map([...aliasBlock[1].matchAll(/([A-Za-z0-9_]+):\s*'([^']+)'/g)].map(m => [m[1], m[2]]));
const unresolved = keys.filter(key => ![...ids].some(id => id === key || id.replace(/^[a-z]{1,4}_/, '') === key) && !aliases.has(key));
if (keys.length !== 68) throw new Error(`expected 68 skill bonus keys, got ${keys.length}`);
if (unresolved.length !== 31) throw new Error(`expected 31 explicitly unresolved keys, got ${unresolved.length}: ${unresolved.join(', ')}`);
for (const [key, target] of aliases) {
  if (!keys.includes(key)) throw new Error(`alias has no data source: ${key}`);
  if (!ids.has(target)) throw new Error(`alias target missing: ${key} -> ${target}`);
}
for (const unsafe of ['carttornado', 'rollingcutter', 'duple_light']) {
  if (aliases.has(unsafe)) throw new Error(`unsupported official skill must not be redirected: ${unsafe}`);
}
console.log(`PASS ${keys.length} skill bonus keys; ${keys.length - unresolved.length} supported; ${unresolved.length} explicitly unresolved; alias targets valid; no unsafe redirects`);
