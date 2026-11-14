const fs = require('fs');
const vm = require('vm');
const path = require('path');
const root = path.resolve(__dirname, '..');
const ctx = { console, window: {} };
vm.createContext(ctx);
for (const file of ['js/skills.js','js/monster_skills.js','js/jobs.js','js/data.js','js/relics.js','js/v2_content.js','js/v2_4_content.js','js/v2_5_content.js','js/v2_6_skill_migration.js']) {
  vm.runInContext(fs.readFileSync(path.join(root,file),'utf8'), ctx, {timeout:30000, filename:file});
}
vm.runInContext('globalThis.__ITEMS=ITEMS;globalThis.__SKILLS=SKILLS;',ctx);
const I=ctx.__ITEMS, S=ctx.__SKILLS;
const engine=fs.readFileSync(path.join(root,'js/engine.js'),'utf8');
const assert=(ok,msg)=>{if(!ok) throw new Error(msg); console.log('PASS',msg);};

// Extract the actual conditional auto-spell registry from engine.js.
const marker='const conditionalAutoSpellMeta = ';
const start=engine.indexOf(marker);
assert(start>=0,'conditional auto-spell registry exists');
const objStart=start+marker.length;
const end=engine.indexOf('      };',objStart);
assert(end>objStart,'conditional auto-spell registry closes correctly');
const meta=vm.runInNewContext('('+engine.slice(objStart,end+8).replace(/;\s*$/,'')+')');
let total=0, missing=[];
for(const [itemId,item] of Object.entries(I)){
  for(const cb of item.condBonus||[]){
    for(const [key,chance] of Object.entries(cb.bonus||{})){
      if(!key.startsWith('autoSpell_')) continue;
      total++;
      const m=meta[`${itemId}:${key}`];
      if(!m) missing.push(`${itemId}:${key}: missing metadata`);
      else if(!S[m.skill]) missing.push(`${itemId}:${key}: missing skill ${m.skill}`);
      else if(!(Number(chance)>0)) missing.push(`${itemId}:${key}: invalid chance`);
    }
  }
}
assert(missing.length===0,`all ${total} conditional equipment auto-spell entries map to valid skills (${missing.join('; ')})`);

// The screenshot's Magic Sword-LT data must match the visible refinement effects.
const sword=I.magic_sword_lt;
assert(!!sword,'Magic Sword-LT item exists');
const r7=(sword.condBonus||[]).find(x=>x.when?.refineMin===7);
const r11=(sword.condBonus||[]).find(x=>x.when?.refineMin===11);
assert(r7?.bonus?.autoSpell_meteorstorm===5,'Magic Sword-LT +7: 5% Meteor Storm auto-cast configured');
assert(r11?.bonus?.autoSpell_psychicwave===5,'Magic Sword-LT +11: 5% Psychic Wave auto-cast configured');
assert(meta['magic_sword_lt:autoSpell_meteorstorm']?.skill==='meteorstorm' &&
       meta['magic_sword_lt:autoSpell_meteorstorm']?.lv===7 &&
       meta['magic_sword_lt:autoSpell_meteorstorm']?.melee===true,
       'Magic Sword-LT +7 maps to Meteor Storm Lv7 on close-range normal attacks');
assert(meta['magic_sword_lt:autoSpell_psychicwave']?.skill==='so_psychicwave' &&
       meta['magic_sword_lt:autoSpell_psychicwave']?.lv===5 &&
       meta['magic_sword_lt:autoSpell_psychicwave']?.melee===true,
       'Magic Sword-LT +11 maps to Psychic Wave Lv5 on close-range normal attacks');
assert(S.meteorstorm?.maxLv>=7,'Meteor Storm Lv7 exists in skill database');
assert(S.so_psychicwave?.maxLv>=5,'Psychic Wave Lv5 exists in skill database');
assert(/tryAutoSpells\('attack', target\)/.test(engine),'normal attack event invokes auto-spell pipeline');
assert(/castSkill\(e\.skill, \{ free: true, forceLv: lv \}\)/.test(engine),
       'auto-spells execute through free forced-level skill casting');
assert(/if \(e\.melee && trigger !== 'hit' && !melee\) continue/.test(engine),
       'melee-only auto-spells reject bow attacks and accept dagger attacks');
console.log(`SUMMARY conditional equipment auto-spell entries audited=${total}`);
