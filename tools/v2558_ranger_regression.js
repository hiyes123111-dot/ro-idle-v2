const fs=require('fs');
const skills=fs.readFileSync('js/skills.js','utf8');
const engine=fs.readFileSync('js/engine.js','utf8');
function ok(label,condition){if(!condition)throw new Error('FAIL '+label);console.log('PASS '+label)}
const arrow=skills.match(/ra_arrowstorm:\s*\{([^\n]+)\}/)?.[1]||'';
const aimed=skills.match(/ra_aimedbolt:\s*\{([^\n]+)\}/)?.[1]||'';
const fear=skills.match(/ra_fearbreeze:\s*\{([^\n]+)\}/)?.[1]||'';
for(const [name,row] of [['Arrow Storm',arrow],['Aimed Bolt',aimed],['Fear Breeze',fear]]){
  ok(name+' is configured as a passive proc',row.includes("type: 'passive'")&&row.includes('rangerPassiveProc: true'));
  ok(name+' consumes no SP and has no active cooldown',row.includes('spCost: [0]')&&row.includes('cooldown: [0]'));
}
ok('Arrow Storm retains 250%-700% damage values',/mult: \[2\.5,3\.0,3\.5,4\.0,4\.5,5\.0,5\.5,6\.0,6\.5,7\.0\]/.test(arrow));
ok('Aimed Bolt retains 220%-400% damage values',/mult: \[2\.2,2\.4,2\.6,2\.8,3\.0,3\.2,3\.4,3\.6,3\.8,4\.0\]/.test(aimed));
ok('Engine triggers Ranger passive procs on normal attacks',engine.includes('function tryRangerPassiveProcs')&&engine.includes('tryRangerPassiveProcs(target, monDef)'));
ok('Passive Ranger proc applies equipment skill damage bonuses',engine.includes('1 + getSkillDamageBonus(sk)/100'));
console.log('PASS Ranger regression — all checks passed');
