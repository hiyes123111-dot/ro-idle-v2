const fs=require('fs'),path=require('path');
const rows=fs.readFileSync(path.join(__dirname,'..','js','data.js'),'utf8').split('\n');
const cases=[['ep172_1h_book2','aspdPct:10'],['ep172_1h_hammer','aspdPct:10'],['lounge_suit','aspdPct:2'],['dragona_silver','aspdPct:20'],['modify_agi_boots_','aspdPct:3'],['temporal_agi_boots_','critRate:3']];
for(const [id,bad] of cases){const row=rows.find(x=>x.includes('"'+id+'":'));if(!row)throw Error('missing '+id);if(row.includes(bad))throw Error(id+' still contains '+bad);}
const row=rows.find(x=>x.includes('"temporal_agi_boots_":'));if(!/aspdFlat[\"']?\s*:\s*1/.test(row))throw Error('real ASPD+1 removed');
console.log('v2.5.138 delay/ASPD regression: 7 checks passed');
