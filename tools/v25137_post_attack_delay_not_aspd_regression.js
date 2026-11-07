const fs=require('fs'),path=require('path');
const src=fs.readFileSync(path.join(__dirname,'..','js','data.js'),'utf8');
const ids=['dragona_red','dragona_green','dragona_gold','dragona_purple'];
for(const id of ids){
 const i=src.indexOf('"'+id+'":'); if(i<0) throw Error('missing '+id);
 const e=src.indexOf('\n  "',i+1); const row=src.slice(i,e<0?src.length:e);
 const descAt=row.indexOf('\"desc\":'); if(descAt<0 || !row.slice(descAt).includes('攻擊後延遲')) throw Error('description '+id);
 const bonusPart=row.slice(row.indexOf('perStat_')>=0?row.indexOf('perStat_'):row.indexOf('per2Refine'));
 if(/aspdPct\s*:\s*(20|15|4|3)/.test(row)) throw Error('delay mapped to ASPD '+id);
}
console.log('v2.5.138 delay/ASPD separation: 4/4 passed');
