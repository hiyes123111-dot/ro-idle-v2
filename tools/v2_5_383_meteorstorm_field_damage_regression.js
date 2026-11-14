const fs=require('fs'),path=require('path'),root=path.resolve(__dirname,'..');
const e=fs.readFileSync(path.join(root,'js','engine.js'),'utf8');
const s=fs.readFileSync(path.join(root,'js','skills.js'),'utf8');
const d=fs.readFileSync(path.join(root,'js','data.js'),'utf8');
function ok(v,m){if(!v)throw Error(m);console.log('PASS',m);}
const t=e.slice(e.indexOf('function tickFieldEffects()'),e.indexOf('function gameTick()'));
const c=e.slice(e.indexOf("case 'field_aoe_magic':"),e.indexOf("case 'multi_dot_stun':"));
ok(/skillBaseDamage\(true, monDef, elemMult, fieldSkill\)/.test(t),'field magic uses shared MATK/magic bonus calculation');
ok(/elementDmgMult\(f\.element \|\| 'none'\)/.test(t),'field magic applies elemental buffs');
ok(/cardTargetDmgMult\(monDef\)/.test(t),'field magic applies target card bonus');
ok(/ailDmgTakenMult\(mon\)/.test(t),'field magic applies target damage-taken modifiers');
ok(/nextTickAt: Date\.now\(\) - 1/.test(c),'first field tick is due immediately');
ok(/tickFieldEffects\(\);/.test(c),'field effect is processed on cast');
ok(/meteorstorm:.*"type":"field_aoe_magic".*"fieldTickIntervalSec":1/.test(s),'Meteor Storm is configured as 1-second field magic');
ok(/'magic_sword_lt:autoSpell_meteorstorm': \{ skill: 'meteorstorm', lv: 7, melee: true \}/.test(e),'Magic Sword-LT +7 maps to Meteor Storm Lv7');
ok(/"autoSpell_meteorstorm":5/.test(d),'Magic Sword-LT +7 retains 5% trigger chance');
console.log('SUMMARY: Meteor Storm field-damage regression checks passed');
