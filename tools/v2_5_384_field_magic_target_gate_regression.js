const fs=require('fs'),path=require('path'),root=path.resolve(__dirname,'..');
const e=fs.readFileSync(path.join(root,'js','engine.js'),'utf8');
const s=fs.readFileSync(path.join(root,'js','skills.js'),'utf8');
const v=fs.readFileSync(path.join(root,'VERSION.txt'),'utf8').trim().replace(/^v/,'');
const h=fs.readFileSync(path.join(root,'index.html'),'utf8');
function ok(x,m){if(!x)throw Error(m);console.log('PASS',m);}
const start=e.indexOf('const needsMonster = ');
const end=e.indexOf(';',start);
const gate=e.slice(start,end+1);
ok(start>=0 && /'field_aoe_magic'/.test(gate),'field AoE magic requires a live monster target before spending resources');
ok(/field_aoe_magic/.test(s.slice(s.indexOf('meteorstorm:'),s.indexOf('meteorstorm:')+300)),'Meteor Storm uses field AoE magic type');
ok(/field_aoe_magic/.test(s.slice(s.indexOf('stormgust:'),s.indexOf('stormgust:')+300)),'Storm Gust uses field AoE magic type');
ok(/field_aoe_magic/.test(s.slice(s.indexOf('heavensdrive:'),s.indexOf('heavensdrive:')+300)),'Heaven\'s Drive uses field AoE magic type');
ok(/state\.sp -= spCost;/.test(e) && e.indexOf('if (needsMonster &&')<e.indexOf('state.sp -= spCost;'),'target gate runs before SP deduction');
const versions=[...h.matchAll(/[?&]v=(2\.5\.\d+)/g)].map(m=>m[1]);
ok(versions.length===26 && versions.every(x=>x===v),'all 26 HTML cache references match release version');
console.log('SUMMARY: v2.5.384 field magic target-gate regression passed');
