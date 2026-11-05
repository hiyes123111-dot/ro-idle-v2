const fs=require('fs'),vm=require('vm'),path=require('path');
const root=path.resolve(__dirname,'..');
const source=fs.readFileSync(path.join(root,'js/v2_content.js'),'utf8');
const itemIds=[...source.matchAll(/(?:weapon|armor|addItem)\('([^']+)'/g)].map(x=>x[1]);
const monsterIds=[...source.matchAll(/addMonster\('([^']+)'/g)].map(x=>x[1]);
function imageId(id,base,seed){let n=seed;for(const c of id)n=((n*31+c.charCodeAt(0))>>>0)%9000;return base+n;}
let missing=[];
for(const id of itemIds){const f=path.join(root,'images/items',imageId(id,990000,7)+'.png');if(!fs.existsSync(f))missing.push('item:'+id);}
for(const id of monsterIds){const f=path.join(root,'images/monsters',imageId(id,980000,11)+'.png');if(!fs.existsSync(f))missing.push('monster:'+id);}
console.log(`V2 item assets: ${itemIds.length-missing.filter(x=>x.startsWith('item:')).length}/${itemIds.length}`);
console.log(`V2 monster assets: ${monsterIds.length-missing.filter(x=>x.startsWith('monster:')).length}/${monsterIds.length}`);
if(missing.length){console.error(missing.join('\n'));process.exit(1)}
console.log('PASS — no missing V2 custom item/monster image files');
