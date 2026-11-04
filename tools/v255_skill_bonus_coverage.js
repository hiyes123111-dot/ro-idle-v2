const fs = require('fs');
const skillsSrc = fs.readFileSync('js/skills.js', 'utf8');
const v2Src = fs.readFileSync('js/v2_content.js', 'utf8');
const dataSrc = fs.readFileSync('js/data.js', 'utf8');
const engineSrc = fs.readFileSync('js/engine.js', 'utf8');
const ids = new Set([
  ...[...skillsSrc.matchAll(/^\s{2}([A-Za-z0-9_]+):\s*\{/gm)].map(m => m[1]),
  ...[...v2Src.matchAll(/(?:active|passive)\('([^']+)'/g)].map(m => m[1]),
]);
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
  if (!keys.includes(key)) throw new Error(`alias ${key} has no equipment data source`);
  if (!ids.has(target)) throw new Error(`alias ${key} points to missing skill ${target}`);
}
console.log(`Skill bonus keys: ${keys.length}`);
console.log(`Registered native / verified alias keys: ${keys.length - unresolved.length}`);
console.log(`Unresolved keys (not guessed or silently redirected): ${unresolved.length}`);
console.log(unresolved.join(', '));
console.log('PASS — every configured alias has a registered skill target; unresolved bonus keys are explicitly reported');
