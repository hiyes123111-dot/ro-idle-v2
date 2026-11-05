/*
 * V2 regression smoke tests (Node.js, no external dependencies).
 * Run from the repository root: node tools/v2_regression.js
 */
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const root = path.resolve(__dirname, '..');
const jsDir = path.join(root, 'js');
const storage = Object.create(null);
const jobTreeElement = { innerHTML: '' };
const documentStub = {
  addEventListener() {}, removeEventListener() {},
  getElementById(id) { return id === 'tab-jobtree' ? jobTreeElement : null; }, querySelector() { return null; },
  querySelectorAll() { return []; }, createElement() { return {}; },
  body: { classList: { add() {}, remove() {} }, appendChild() {} },
};
const context = {
  console, Date, Math, JSON, Object, Array, Set, Map, Number, String, RegExp,
  setTimeout: () => 0, clearTimeout() {}, setInterval: () => 0, clearInterval() {},
  localStorage: {
    getItem(k) { return Object.prototype.hasOwnProperty.call(storage, k) ? storage[k] : null; },
    setItem(k, v) { storage[k] = String(v); }, removeItem(k) { delete storage[k]; },
  },
  window: { addEventListener() {}, location: {} }, document: documentStub,
  navigator: {}, performance: { now: () => 0 }, alert() {}, confirm: () => true,
  prompt: () => null, URL, Blob, FileReader: function () {}, Image: function () {},
  requestAnimationFrame: () => 0,
};
context.window.window = context.window;
context.window.document = documentStub;
vm.createContext(context);

const scripts = [
  'about.js', 'hp_sp_tables.js', 'img_alias.js', 'aspd_data.js',
  'skills.js', 'monster_skills.js', 'jobs.js', 'data.js', 'relics.js', 'v2_content.js', 'v2_4_content.js', 'v2_5_content.js', 'v2_artifacts.js',
  'achievements.js', 'engine.js', 'ui.js',
];
for (const file of scripts) {
  vm.runInContext(fs.readFileSync(path.join(jsDir, file), 'utf8'), context,
    { filename: file, timeout: 30000 });
}
// Visual and audio effects are intentionally no-op in the headless mechanics tests.
vm.runInContext(`showDamageFloatAt=()=>{}; showPlayerFloat=()=>{}; showElementFloat=()=>{};
  playSkillSound=()=>{}; showSkillCastEffect=()=>{}; playHitSound=()=>{}; playAttackSound=()=>{};`, context);

let failures = 0;
function check(ok, label, detail = '') {
  if (ok) console.log(`PASS ${label}`);
  else { failures++; console.error(`FAIL ${label}${detail ? ` — ${detail}` : ''}`); }
}

// Configure a complete, slot-compatible loadout for every set and verify activation.
const setResults = JSON.parse(vm.runInContext(`(() => {
  const out = [];
  for (const [setId, def] of Object.entries(EQUIP_SETS)) {
    state = { jobId: 'assassincross', stats: {str:1,agi:1,vit:1,int:1,dex:1,luk:1},
      equip: {}, instances: {}, relics: {} };
    const used = new Set(); let error = '';
    for (const group of def.items || []) {
      const ids = Array.isArray(group) ? group : [group]; let chosen = null;
      for (const id of ids) {
        const item = ITEMS[id]; if (!item) continue;
        let slot;
        if (item.type === 'weapon') slot = !used.has('weapon') ? 'weapon' : (!used.has('shield') ? 'shield' : null);
        else if (item.type === 'armor') {
          if (item.armorType === 'headgear') {
            const d = item.desc || '';
            if (d.includes('頭上') && !d.includes('頭中') && !d.includes('頭下')) slot = 'head_top';
            else if (d.includes('頭中') && !d.includes('頭上') && !d.includes('頭下')) slot = 'head_mid';
            else if (d.includes('頭下') && !d.includes('頭上') && !d.includes('頭中')) slot = 'head_bottom';
            else slot = ['head_top','head_mid','head_bottom'].find(s => !used.has(s));
          } else if (item.armorType === 'accessory') slot = ['accessory1','accessory2'].find(s => !used.has(s));
          else slot = ({shield:'shield',garment:'garment',footgear:'footgear'}[item.armorType] || 'armor');
        }
        if (slot && !used.has(slot)) { chosen = id; used.add(slot); state.equip[slot] = id; break; }
      }
      if (!chosen) { error = 'unable to equip'; break; }
    }
    let active = false, actual = {}, delta = {};
    if (!error) {
      actual = effectiveGearBonuses(); active = activeEquipSets().some(s => s.id === setId);
      const savedDef = EQUIP_SETS[setId]; delete EQUIP_SETS[setId];
      _gearBonusCache = null; _gearBonusKey = '';
      const baseline = effectiveGearBonuses();
      EQUIP_SETS[setId] = savedDef; _gearBonusCache = null; _gearBonusKey = '';
      for (const key of Object.keys(savedDef.bonus || {})) delta[key] = (actual[key] || 0) - (baseline[key] || 0);
    }
    out.push({setId, active, error, expected:def.bonus || {}, delta});
  }
  return JSON.stringify(out);
})()`, context));
for (const result of setResults) {
  check(result.active && !result.error, `set activates: ${result.setId}`, result.error);
  for (const [key, value] of Object.entries(result.expected)) {
    check((result.delta[key] || 0) === value, `set bonus: ${result.setId}.${key}`,
      `expected ${value}, got ${result.delta[key] || 0}`);
  }
}

// Set-only effects must not leak onto a single piece.
const singlePiece = JSON.parse(vm.runInContext(`(() => {
  const out = {};
  for (const [id, slot] of [['rider_insignia','garment'],['rider_insignia_','garment'],['linen_glove','accessory1']]) {
    state = { jobId:'assassincross', stats:{str:1,agi:1,vit:1,int:1,dex:1,luk:1},
      equip:{[slot]:id}, instances:{}, relics:{} };
    const b = effectiveGearBonuses(); out[id] = { flee:b.flee||0, perfectDodge:b.perfectDodge||0,
      sets:activeEquipSets().map(s => s.id) };
  }
  return JSON.stringify(out);
})()`, context));
check(singlePiece.rider_insignia.flee === 0 && singlePiece.rider_insignia.sets.length === 0,
  'Rider Insignia alone has no set FLEE');
check(singlePiece.rider_insignia_.flee === 0 && singlePiece.rider_insignia_.sets.length === 0,
  'Rider Insignia [1] alone has no set FLEE');
check(singlePiece.linen_glove.perfectDodge === 0 && singlePiece.linen_glove.sets.length === 0,
  'Linen Glove alone has no set Perfect Dodge');
// Both slotted and unslotted versions of the Rider Insignia / Black Leather Boots are valid set members.
const riderVariants = JSON.parse(vm.runInContext(`(() => {
  const out=[];
  for (const a of ['rider_insignia','rider_insignia_']) for (const b of ['black_leather_boots','black_leather_boots_']) {
    state={jobId:'assassincross',stats:{str:1,agi:1,vit:1,int:1,dex:1,luk:1},
      equip:{garment:a,footgear:b},instances:{},relics:{}};
    const bonus=effectiveGearBonuses(); out.push({a,b,active:activeEquipSets().some(s=>s.id==='rider_insignia_black_leather_set'),flee:bonus.flee||0});
  }
  return JSON.stringify(out);
})()`, context));
check(riderVariants.length === 4 && riderVariants.every(x => x.active && x.flee >= 10),
  'all four Rider Insignia / Black Leather Boots slot combinations activate FLEE +10');

// The legacy per-refine set bonus must scale with the actual equipped instance refine level.
const refineSet = JSON.parse(vm.runInContext(`(() => {
  state={jobId:'assassincross',stats:{str:1,agi:1,vit:1,int:1,dex:1,luk:1},
    equip:{armor:'tatenasi_armor_',head_top:'tatenasi_helmet'},instances:{},relics:{}};
  const instance=getOrCreateEquipInstance('armor'); state.instances[instance].refine=5;
  const bonus=effectiveGearBonuses(); return JSON.stringify({active:activeEquipSets().some(s=>s.id==='tatenasi_set'),def:bonus.def||0});
})()`, context));
check(refineSet.active && refineSet.def >= 75, 'Tatenasi set per-refine DEF bonus scales at +5');

// Sprint Set: casting and after-cast delay are intentionally ignored by this game's cooldown model.
const sprintSet = JSON.parse(vm.runInContext(`(() => {
  state={jobId:'assassincross',stats:{str:1,agi:1,vit:1,int:1,dex:1,luk:1},
    equip:{armor:'sprint_mail',footgear:'sprint_shoes',accessory1:'sprint_ring'},instances:{},relics:{}};
  _gearBonusCache=null; _gearBonusKey='';
  const b=effectiveGearBonuses();
  return JSON.stringify({active:activeEquipSets().some(s=>s.id==='sprint_set'),
    hpPct:b.hpPct||0,spPct:b.spPct||0,hpRegenPct:b.hpRegenPct||0,
    spRegenPct:b.spRegenPct||0,hpItemEffectBonusPct:getCardBonus('hpItemEffectBonusPct')||0});
})()`, context));
check(sprintSet.active && sprintSet.hpPct===7 && sprintSet.spPct===7,
  'Sprint Set 3-piece MHP/MSP +7% applies', JSON.stringify(sprintSet));
check(sprintSet.hpRegenPct===5 && sprintSet.spRegenPct===5,
  'Sprint Mail / Shoes HP and SP recovery +5% apply');
check(sprintSet.hpItemEffectBonusPct===3,
  'Sprint Mail healing-item effectiveness +3% routes to the actual item-heal consumer');

// V2 fourth-job expansion and progression checks.
const fourthJobs = JSON.parse(vm.runInContext(`JSON.stringify(Object.values(JOB_TREE).filter(j => j.tier === 4).map(j => ({
  id:j.id, parent:j.parent, name:j.name, skills:j.skills.map(s => s.id), genderLock:j.genderLock || null
})))`, context));
check(fourthJobs.length === 13, '13 fourth jobs registered');
const skillIds = fourthJobs.flatMap(j => j.skills);
check(skillIds.length >= 150 && new Set(skillIds).size === skillIds.length, 'complete fourth-job skill catalogs registered', `count=${skillIds.length}`);
for (const job of fourthJobs) {
  const status = JSON.parse(vm.runInContext(`(() => {
    const j = JOB_TREE[${JSON.stringify(job.id)}], p = JOB_TREE[j.parent];
    state = {jobId:j.parent, gender:${JSON.stringify(job.genderLock || 'male')}, jobLevel:p.jobLevelMax,
      baseLevel:250, rebirthCount:1, rebirthPath:[], jobSkillPoints:{[j.parent]:7}};
    return JSON.stringify({parentExists:!!p, linked:p.next.includes(j.id), can:canJobChange(j.id), reason:jobChangeBlockReason(j.id)});
  })()`, context));
  check(status.parentExists && status.linked, `fourth-job parent link: ${job.id}`);
  check(status.can && status.reason === null, `fourth-job promotion: ${job.id}`, status.reason || 'blocked');
}
// V2 equipment, drops, map, card and relic integration.
const gearIntegration = JSON.parse(vm.runInContext(`(() => {
  const weaponIds=['v2_dragon_spear','v2_imperial_lance','v2_archmage_staff','v2_element_book',
    'v2_wind_bow','v2_troubadour_harp','v2_trouvere_whip','v2_meister_axe','v2_biolo_injector',
    'v2_shadow_katar','v2_abyss_dagger','v2_cardinal_staff','v2_inquisitor_knuckle'];
  const weapons=weaponIds.map(id=>{
    const item=ITEMS[id], job=item.reqJob[0];
    state={jobId:job,gender:job==='trouvere'?'female':'male',baseLevel:250,jobLevel:1,
      stats:{str:10,agi:10,vit:10,int:10,dex:10,luk:10},equip:{},instances:{},relics:{},
      jobLevelHistory:{},rebirthCount:1,rebirthPath:[],jobSkillPoints:{}};
    return {id,exists:!!item,slot:aspdCategoryOf(id),block:equipBlockReason(id),source:getItemSources(id).length};
  });
  const cardIds=['v2_rift_sentinel_card','v2_abyss_stalker_card','v2_ember_drake_card','v2_void_sage_card',
    'v2_rift_guardian_card','v2_void_emperor_card','v2_wind_hawk_card','v2_biolo_card'];
  const cards=cardIds.map(id=>({id,exists:!!CARDS[id]&&!!ITEMS[id],source:getItemSources(id).length}));
  const relicIds=RELIC_PIECE_IDS.filter(id=>RELIC_ITEMS[id]&&RELIC_ITEMS[id].relicSet==='v2_rift');
  const maps=MAPS.filter(m=>m.id.startsWith('v2_')).map(m=>({id:m.id,monsters:m.monsters.map(x=>x.id)}));
  return JSON.stringify({weapons,cards,relicIds,maps,bosses:MVP_MAP_DATA.v2_abyss_rift_core||[]});
})()`, context));
check(gearIntegration.weapons.length === 13 && gearIntegration.weapons.every(x => x.exists && !x.block && x.source > 0),
  '13 fourth-job weapons are equippable and have drop sources', gearIntegration.weapons.filter(x => !x.exists || x.block || !x.source).map(x => `${x.id}: ${x.block || 'missing source'}`).join('; '));
const fourthWeaponImages = JSON.parse(vm.runInContext(`JSON.stringify(['v2_dragon_spear','v2_imperial_lance','v2_archmage_staff','v2_element_book','v2_wind_bow','v2_troubadour_harp','v2_trouvere_whip','v2_meister_axe','v2_biolo_injector','v2_shadow_katar','v2_abyss_dagger','v2_cardinal_staff','v2_inquisitor_knuckle'].map(id=>({id,imgId:ITEMS[id]?.imgId||0})))`, context));
check(fourthWeaponImages.length === 13 && fourthWeaponImages.every(x => x.imgId > 0), 'all 13 fourth-job weapons reuse project image assets', fourthWeaponImages.filter(x => !x.imgId).map(x => x.id).join('; '));
const fourthWeaponGates = JSON.parse(vm.runInContext(`(() => {
  const cases=[['dragon_knight','v2_dragon_spear','spear'],['arch_mage','v2_archmage_staff','rod2'],['meister','v2_meister_axe','axe2'],['troubadour','v2_troubadour_harp','instrument'],['trouvere','v2_trouvere_whip','whip'],['shadow_cross','v2_shadow_katar','katar'],['inquisitor','v2_inquisitor_knuckle','knuckle']];
  return JSON.stringify(cases.map(([job,item,req])=>{state={jobId:job,equip:{weapon:item}};return {job,item,req,ok:weaponReqMet(req)}}));
})()`, context));
check(fourthWeaponGates.every(x=>x.ok), 'fourth-job weapon gates match the corresponding equipped weapons', fourthWeaponGates.filter(x=>!x.ok).map(x=>`${x.job}:${x.req}`).join('; '));
check(gearIntegration.cards.length === 8 && gearIntegration.cards.every(x => x.exists && x.source > 0),
  '8 V2 cards are registered and obtainable', gearIntegration.cards.filter(x => !x.exists || !x.source).map(x => x.id).join('; '));
check(gearIntegration.relicIds.length === 8, 'V2 relic set generates all 8 pieces');
check(gearIntegration.maps.length === 2 && gearIntegration.maps.every(m => m.monsters.length > 0), '2 V2 dungeon maps have monster populations');
check(gearIntegration.bosses.includes('v2_rift_guardian') && gearIntegration.bosses.includes('v2_void_emperor'), 'V2 dungeon MVP roster is registered');
const relicThresholds = JSON.parse(vm.runInContext(`(() => {
  const ids=RELIC_SLOTS.map(slot=>'relic_v2_rift_'+slot.slice('relic_'.length));
  const result=[];
  for (const n of [1,2,3,5]) {
    state={jobId:'dragon_knight',stats:{str:10,agi:10,vit:10,int:10,dex:10,luk:10},
      equip:{},instances:{},relics:Object.fromEntries(RELIC_SLOTS.map((slot,i)=>[slot,i<n?ids[i]:null]))};
    const b=effectiveGearBonuses();
    result.push({n,atkPct:b.atkPct||0,matkPct:b.matkPct||0,hpPct:b.hpPct||0,spPct:b.spPct||0,
      allTargetDmgPct:b.allTargetDmgPct||0,def:b.def||0,mdef:b.mdef||0});
  }
  return JSON.stringify(result);
})()`, context));
check(relicThresholds[0].atkPct === 0 && relicThresholds[1].atkPct === 4 && relicThresholds[1].matkPct === 4,
  'V2 relic 2-piece threshold');
check(relicThresholds[2].hpPct === 8 && relicThresholds[2].spPct === 8,
  'V2 relic 3-piece threshold');
check(relicThresholds[3].allTargetDmgPct === 5 && relicThresholds[3].def === 20 && relicThresholds[3].mdef === 20,
  'V2 relic 5-piece threshold');
const bossSkills = JSON.parse(vm.runInContext(`JSON.stringify({guardian:MONSTER_SKILLS.v2_rift_guardian.length,emperor:MONSTER_SKILLS.v2_void_emperor.length,
  guardianMvp:MONSTERS.v2_rift_guardian.isMvp,emperorMvp:MONSTERS.v2_void_emperor.isMvp})`, context));
check(bossSkills.guardian >= 2 && bossSkills.emperor >= 2 && bossSkills.guardianMvp && bossSkills.emperorMvp,
  'V2 MVPs have boss skills and MVP flags');
const bossSkillTrigger = JSON.parse(vm.runInContext(`(() => {
  const old=Math.random; Math.random=()=>0;
  try {
    const a=monsterSkillFor({defId:'v2_rift_guardian',hp:100000,maxHp:100000,skCd:{}},MONSTERS.v2_rift_guardian);
    const b=monsterSkillFor({defId:'v2_void_emperor',hp:100000,maxHp:100000,skCd:{}},MONSTERS.v2_void_emperor);
    return JSON.stringify({guardian:!!a,emperor:!!b});
  } finally { Math.random=old; }
})()`, context));
check(bossSkillTrigger.guardian && bossSkillTrigger.emperor, 'V2 MVP skill triggers resolve through monster combat system');

const genderLock = JSON.parse(vm.runInContext(`(() => {
  const j=JOB_TREE.trouvere, p=JOB_TREE[j.parent];
  state={jobId:j.parent,gender:'male',jobLevel:p.jobLevelMax,baseLevel:250,
    rebirthCount:1,rebirthPath:[],jobSkillPoints:{[j.parent]:0}};
  return JSON.stringify({can:canJobChange('trouvere'),reason:jobChangeBlockReason('trouvere')});
})()`, context));
check(!genderLock.can && genderLock.reason === '這個職業只有女性角色能轉。', 'Trouvere gender restriction is enforced');

// All new active skills must reach the existing combat resolver without throwing.
const activeCastResults = JSON.parse(vm.runInContext(`(() => {
  const out=[];
  for (const j of Object.values(JOB_TREE).filter(j => j.tier === 4)) {
    for (const sk of j.skills.filter(s => s.type !== 'passive')) {
      try {
        state={name:'V2技能測試',gender:j.genderLock||'male',jobId:j.id,baseLevel:250,jobLevel:1,
          jobLevelHistory:{},rebirthCount:1,rebirthPath:[],
          stats:{str:100,agi:100,vit:100,int:100,dex:100,luk:100},equip:{},instances:{},relics:{},
          learnedSkills:{[sk.id]:5},inventory:[],gold:99999999,hp:999999,maxHp:999999,
          sp:999999,maxSp:999999,buffs:[],monsters:[{id:1,defId:'poring',hp:99999999,maxHp:99999999}],
          cooldowns:{},shields:[],attackAccumulator:0};
        out.push({job:j.id,skill:sk.id,ok:!!castSkill(sk.id,{free:true,forceLv:Math.min(5,sk.maxLv)})});
      } catch(e) { out.push({job:j.id,skill:sk.id,ok:false,error:String(e)}); }
    }
  }
  return JSON.stringify(out);
})()`, context));
check(activeCastResults.length > 100 && activeCastResults.every(x => x.ok),
  'all fourth-job active skills resolve in combat', activeCastResults.filter(x => !x.ok).map(x => `${x.skill}: ${x.error || 'cast failed'}`).join('; '));

// All new passive skills must pass through recomputeDerived without errors.
const passiveResults = JSON.parse(vm.runInContext(`(() => {
  const out=[];
  for (const j of Object.values(JOB_TREE).filter(j => j.tier === 4)) {
    const sk=j.skills.find(s => s.type === 'passive');
    try {
      createCharacter('V2被動測試',{str:10,agi:10,vit:10,int:10,dex:10,luk:10},'male');
      state.jobId=j.id; state.jobLevel=1; state.baseLevel=200; state.learnedSkills={[sk.id]:5};
      state.jobSkillPoints={}; recomputeDerived(true); out.push({job:j.id,skill:sk.id,ok:true});
    } catch(e) { out.push({job:j.id,skill:sk.id,ok:false,error:String(e)}); }
  }
  return JSON.stringify(out);
})()`, context));
check(passiveResults.length === 13 && passiveResults.every(x => x.ok),
  'all 13 fourth-job passive skills recalculate without errors', passiveResults.filter(x => !x.ok).map(x => `${x.skill}: ${x.error}`).join('; '));
const learningResults = JSON.parse(vm.runInContext(`(() => {
  const out=[];
  for (const j of Object.values(JOB_TREE).filter(j => j.tier === 4)) {
    createCharacter('V2技能學習測試',{str:10,agi:10,vit:10,int:10,dex:10,luk:10},j.genderLock||'male');
    state.jobId=j.id; state.jobLevel=1; state.baseLevel=200; state.jobSkillPoints={[j.id]:60};
    state.skillPoints=60; state.learnedSkills={}; let ok=true;
    for (const sk of j.skills.slice(0,3)) for (let n=0;n<Math.min(5,sk.maxLv);n++) if (!levelUpSkill(sk.id)) ok=false;
    out.push({job:j.id,ok,levels:j.skills.slice(0,3).map(sk=>({got:state.learnedSkills[sk.id]||0,want:Math.min(5,sk.maxLv)}))});
  }
  return JSON.stringify(out);
})()`, context));
check(learningResults.length === 13 && learningResults.every(x => x.ok && x.levels.every(n => n.got === n.want)),
  'all 13 jobs can learn their fourth-job skills through the skill-point system');

const transition = JSON.parse(vm.runInContext(`(() => {
  createCharacter('V2四轉測試', {str:10,agi:10,vit:10,int:10,dex:10,luk:10}, 'male');
  state.jobId='runeknight'; state.jobLevel=70; state.baseLevel=250;
  state.jobSkillPoints={runeknight:30}; state.skillPoints=30;
  state.jobLevelHistory={lordknight:70}; state.rebirthCount=1; state.rebirthPath=['swordsman','knight'];
  const ok=doJobChange('dragon_knight');
  return JSON.stringify({ok,jobId:state.jobId,carried:state.jobSkillPoints.runeknight,
    available:skillPointsAvailable('dragon_knight'),max:currentJob().jobLevelMax});
})()`, context));
check(transition.ok && transition.jobId === 'dragon_knight', 'fourth-job promotion executes');
check(transition.carried === 30 && transition.available === 30, 'third-job skill points carry into fourth-job pool');
vm.runInContext(`createCharacter('V2職業樹測試',{str:10,agi:10,vit:10,int:10,dex:10,luk:10},'male');
  state.jobId='runeknight'; state.jobLevel=70; state.baseLevel=250; state.jobSkillPoints={runeknight:5};
  state.skillPoints=5; state.jobLevelHistory={lordknight:70}; state.rebirthCount=1;
  state.rebirthPath=['swordsman','knight']; renderJobTree();`, context);
check(jobTreeElement.innerHTML.includes('龍騎士'), 'fourth-job node appears in the rebirth job tree');

// Legacy-save migration smoke test.
const saveResult = vm.runInContext(`(() => {
  createCharacter('V2相容測試', {str:5,agi:5,vit:5,int:5,dex:5,luk:5}, 'male');
  const key = getSlotKey(0); const old = JSON.parse(localStorage.getItem(key));
  ['relics','relicReviveUsed','relicReviveReadyAt','relicMonkReadyAt','relicShieldReadyAt',
   'encounterMode','miniMode','farmMode','autoBuyAllySpPotion','autoBuyAllyArrow','allySpPotion',
   'dpsTracker','codex','jobSkillPoints','instances','equipSkin'].forEach(k => delete old[k]);
  old.mvpMode = true; old.equip = {weapon:'knife', armor:'cotton_shirt'}; old.equippedCards = {}; old.refinement = {};
  old.skillPoints = 2; localStorage.setItem(key, JSON.stringify(old));
  const loaded = loadGame();
  return JSON.stringify({loaded, name:state.name, miniMode:state.miniMode,
    relicSlots:Object.keys(state.relics || {}).length, hasInstances:!!state.instances,
    noviceSkillPoints:state.jobSkillPoints && state.jobSkillPoints.novice});
})()`, context);
const migrated = JSON.parse(saveResult);
check(migrated.loaded && migrated.name === 'V2相容測試', 'legacy save loads');
check(migrated.miniMode === true, 'legacy MVP toggle migrates to mini mode');
check(migrated.relicSlots === 8 && migrated.hasInstances, 'legacy save receives relic and equipment-instance defaults');
check(migrated.noviceSkillPoints === 2, 'legacy skill points migrate to per-job pool');

// Artifact crafting regression: requirements, material consumption, output, and failure safety.
vm.runInContext(`
  state = { baseLevel: 200, gold: 10000000, inventory: [] };
  getItemQty = id => { const row = state.inventory.find(x => x.item === id); return row ? row.qty : 0; };
  removeItem = (id, n) => { const row = state.inventory.find(x => x.item === id); if (!row || row.qty < n) throw new Error('underflow '+id); row.qty -= n; };
  addItem = (id, n) => { const row = state.inventory.find(x => x.item === id); if (row) row.qty += n; else state.inventory.push({item:id,qty:n}); };
  saveGame = () => {}; logMsg = () => {}; renderTopBar = () => {};
  const br = [
    ['goddess_tear',5],['valkyrie_token',5],['brynhild_armor_piece',3],['hero_remains',3],
    ['andvari_ring',1],['dusk_glow',3],['dawn_essence',3],['v2_rift_core',20]
  ];
  br.forEach(([item,qty]) => addItem(item,qty));
`, context);
const brCraft = context.window.craftV2Artifact('brynhild');
check(brCraft === true, 'Brynhild artifact can be crafted with full recipe');
check(vm.runInContext(`getItemQty('brynhild') === 1 && state.gold === 8000000 &&
  ['goddess_tear','valkyrie_token','brynhild_armor_piece','hero_remains','andvari_ring','dusk_glow','dawn_essence','v2_rift_core'].every(x=>getItemQty(x)===0)`, context),
  'Brynhild crafting consumes exact materials and zeny');
vm.runInContext(`
  state.gold = 10000000;
  [['goddess_tear',5],['valkyrie_token',5],['dusk_glow',3],['dawn_essence',3],
   ['cold_moonlight',3],['hazy_starlight',3],['v2_rift_core',20],['v2_dragon_scale',15]]
    .forEach(([item,qty]) => addItem(item,qty));
`, context);
const aspCraft = context.window.craftV2Artifact('asprika');
check(aspCraft === true, 'Asprika artifact can be crafted with full recipe');
check(vm.runInContext(`getItemQty('asprika') === 1 && state.gold === 8000000 &&
  ['goddess_tear','valkyrie_token','dusk_glow','dawn_essence','cold_moonlight','hazy_starlight','v2_rift_core','v2_dragon_scale'].every(x=>getItemQty(x)===0)`, context),
  'Asprika crafting consumes exact materials and zeny');
vm.runInContext(`state.inventory = []; state.gold = 10000000;`, context);
const failedCraft = context.window.craftV2Artifact('brynhild');
check(failedCraft === false && vm.runInContext(`state.gold === 10000000 && state.inventory.length === 0`, context),
  'insufficient artifact materials do not consume zeny or items');

// V2.1 drilling regression: per-instance extra slot, cost, and equipment preservation.
const drillTest = vm.runInContext(`(() => {
  createCharacter('打洞測試',{str:5,agi:5,vit:5,int:5,dex:5,luk:5},'male');
  state.inventory = [
    {item:'cotton_shirt',qty:1,instanceId:'drill_test_item'},
    {item:'v2_dragon_scale',qty:1}, {item:'v2_rift_core',qty:1}
  ];
  state.instances = {drill_test_item:{item:'cotton_shirt',refine:4,cards:[]}};
  state.equip = {armor:'drill_test_item'}; state.gold = 10000;
  const oldRandom = Math.random; Math.random = () => 0;
  const beforeSlots = ITEMS.cotton_shirt.slots || 0;
  const ok = drillEquipment('drill_test_item');
  Math.random = oldRandom;
  return JSON.stringify({ok,extra:state.instances.drill_test_item.extraSlots,
    baseSlots:ITEMS.cotton_shirt.slots||0,equippedSlots:getEquipCardSlots('armor'),
    refine:state.instances.drill_test_item.refine,gold:state.gold,
    scale:getItemQty('v2_dragon_scale'),core:getItemQty('v2_rift_core'),beforeSlots});
})()`, context);
const drilled = JSON.parse(drillTest);
check(drilled.ok && drilled.extra === 1 && drilled.equippedSlots === 1 && drilled.baseSlots === drilled.beforeSlots,
  'drilling adds one slot to the individual item only');
check(drilled.refine === 4 && drilled.gold === 5000 && drilled.scale === 0 && drilled.core === 0,
  'drilling preserves refine and consumes exact materials and zeny');

// Skill consumable auto-supply: learned skill costs are detected and replenished in batches.
const supplyTest = vm.runInContext(`(() => {
  const entry = Object.entries(SKILLS).find(([id, sk]) => sk && Array.isArray(sk.costItems) && sk.costItems.length);
  if (!entry) return {found:false};
  const [skillId, sk] = entry;
  state.autoBuySkillItems = true;
  state.autoBuySkillItemsReadyAt = 0;
  state.learnedSkills = {[skillId]: 1};
  state.gold = 100000000;
  const purchases = [];
  const oldBuy = buyItem;
  buyItem = (id, qty) => { purchases.push({id, qty}); return true; };
  const oldWarehouse = sageWarehouseQty;
  sageWarehouseQty = () => 0;
  try { tryAutoBuySkillItems(); }
  finally { buyItem = oldBuy; sageWarehouseQty = oldWarehouse; }
  return {found:true, expected:sk.costItems, purchases};
})()`, context);
check(supplyTest.found && supplyTest.expected.every(id => supplyTest.purchases.some(p => p.id === id && p.qty === 20)),
  'skill consumable auto-supply detects learned skill catalysts and buys 20 per low-stock item');

// Syntax check every JavaScript source file.
for (const file of fs.readdirSync(jsDir).filter(f => f.endsWith('.js'))) {
  try { new vm.Script(fs.readFileSync(path.join(jsDir, file), 'utf8'), { filename:file }); check(true, `syntax: ${file}`); }
  catch (e) { check(false, `syntax: ${file}`, e.message); }
}


// V2.4 class skill conditions and equipment coverage.
const v24 = vm.runInContext(`(() => {
  const third = Object.values(JOB_TREE).filter(j => j.tier === 3);
  const thirdWeapons = third.filter(j => ITEMS['v24_' + j.id + '_weapon']);
  const thirdSkills = ['rk_sonicwave','rk_runeedge','rk_dragonbreath','ra_arrowstorm','mi_soundblend','wa_swing','me_axeboom','gx_crossimpact','sr_knuckle'];
  const allSkillsExist = thirdSkills.every(id => !!SKILLS[id]);
  const gated = thirdSkills.filter(id => SKILLS[id] && (SKILLS[id].requiresWeapon || SKILLS[id].requiresSkill)).length;
  const imageIds = Object.values(ITEMS).filter(i => i.id && i.id.startsWith('v24_')).every(i => !!i.imgId);
  return {thirdJobs:third.length,thirdWeapons:thirdWeapons.length,allSkillsExist,gated,imageIds,thirdSet:!!EQUIP_SETS.v24_third_set,fourthSet:!!EQUIP_SETS.v24_fourth_set};
})()`, context);
check(v24.thirdJobs === 13 && v24.thirdWeapons === 13, 'V2.4 adds one illustrated third-job weapon for each of 13 jobs');
check(v24.allSkillsExist && v24.gated >= 8, 'V2.4 weapon and prerequisite skill conditions are registered');
check(v24.imageIds && v24.thirdSet && v24.fourthSet, 'V2.4 equipment items have image IDs and both full-set bonuses');
const thirdArmorIcon = path.join(__dirname, '..', 'images', 'equip', 'armor', '91001.png');
check(fs.existsSync(thirdArmorIcon), 'V2.4.1 unique third-job armor icon file exists');
check(vm.runInContext(`ITEMS.v24_third_armor.imgId === 91001 && !IMG_ALIAS['equip/armor']['91001.png']`, context),
  'V2.4.1 third-job armor icon no longer resolves through a duplicate legacy alias');
// V2.5.3: every generated fourth-job active skill exposes the actual combat multiplier range.
const v253 = vm.runInContext(`(() => {
  const skills = Object.values(SKILLS).filter(s => /^v25_/.test(s.id));
  const active = skills.filter(s => s.type !== 'passive');
  const described = active.filter(s => /[0-9]+%～[0-9]+%/.test(s.desc));
  const mismatch = active.filter(s => {
    const vals = Array.isArray(s.mult) ? s.mult : [s.mult];
    const first = Math.round(vals[0] * 100), last = Math.round(vals[vals.length - 1] * 100);
    return !s.desc.includes(first + '%～' + last + '%');
  });
  return {total:skills.length, active:active.length, described:described.length, mismatch:mismatch.map(s=>s.id)};
})()`, context);
check(v253.active > 0 && v253.described === v253.active, 'V2.5.3 all fourth-job active skills show multiplier ranges');
check(v253.mismatch.length === 0, 'V2.5.3 skill descriptions match live combat multiplier arrays', v253.mismatch.join(','));
// V2 original active skills must expose the same multiplier used by combat.
const v255SkillAudit = vm.runInContext(`(() => {
  const active=Object.values(SKILLS).filter(s=>/^v2_/.test(s.id)&&['damage','damage_aoe','magic','magic_aoe','dot'].includes(s.type)&&s.mult!==undefined);
  const mismatch=active.filter(s=>{const v=Array.isArray(s.mult)?s.mult:[s.mult];return !s.desc.includes(Math.round(v[0]*100)+'%～'+Math.round(v[v.length-1]*100)+'%');});
  const dragon=SKILLS.v2_dk_dragon_breath;
  return {active:active.length,mismatch:mismatch.map(s=>s.id),dragon:dragon?dragon.mult:[]};
})()`, context);
check(v255SkillAudit.active >= 20, 'V2 added active skills are covered by multiplier audit');
check(v255SkillAudit.mismatch.length === 0, 'V2 added active skill descriptions match actual combat multipliers', v255SkillAudit.mismatch.join(','));
check(v255SkillAudit.dragon.length === 5 && v255SkillAudit.dragon[0] >= 8 && v255SkillAudit.dragon[4] >= 12,
  'Dragon Knight Dragon Breath upgraded to endgame AOE multiplier', JSON.stringify(v255SkillAudit.dragon));
const thirdSkillAudit = vm.runInContext(`(() => { const jobs=Object.values(JOB_TREE).filter(j=>j.tier===3); const rows=jobs.flatMap(j=>(j.skills||[]).map(id=>typeof id==='string'?SKILLS[id]:id).filter(Boolean)); const active=rows.filter(s=>['damage','damage_aoe','magic','magic_aoe','dot'].includes(s.type) && s.mult!==undefined); const missing=active.filter(s=>!/[0-9]+%/.test(s.desc||'')); return {jobs:jobs.length,active:active.length,missing:missing.map(s=>s.name)}; })()`, context);
check(thirdSkillAudit.jobs > 0 && thirdSkillAudit.missing.length === 0, 'V2.5.3 third-job active skills include percentage descriptions', thirdSkillAudit.missing.join(','));
const codexSpecial = vm.runInContext(`(() => { const ids=getCodexPool().items; return ['magingiorde','helm_of_mid_sol_god'].every(id=>ids.includes(id)) && !ids.includes('half_megin'); })()`, context);
check(codexSpecial, 'V2.5.3 artifact equipment appears in item codex and removed sealed belt is absent');
const artifactRecipes = vm.runInContext(`!!(window.V25_ARTIFACT_RECIPES.megingjard && window.V25_ARTIFACT_RECIPES.mid_sol_helm && ITEMS[window.V25_ARTIFACT_RECIPES.megingjard.itemId] && ITEMS[window.V25_ARTIFACT_RECIPES.mid_sol_helm.itemId])`, context);
check(artifactRecipes, 'V2.5.3 Thor belt and Sun God helm have valid artifact recipes');
const visualAssets = ['images/npc/artifact_blacksmith.svg','images/skills/skill-physical.svg','images/skills/skill-magic.svg','images/skills/skill-passive.svg'].every(f=>fs.existsSync(path.join(root,f)));
check(visualAssets, 'V2.5.3 NPC and skill illustration assets exist');

// V2.5.4 codex completeness: every registered weapon/armor must be discoverable,
// including equipment without a monster-drop or shop entry.
const codexCoverage = vm.runInContext(`(() => { const ids=getCodexPool().items; const missing=Object.entries(ITEMS).filter(([id,d])=>d&&(d.type==='weapon'||d.type==='armor')&&!ids.includes(id)).map(([id])=>id); return {equipment:Object.values(ITEMS).filter(d=>d&&(d.type==='weapon'||d.type==='armor')).length,missing}; })()`, context);
check(codexCoverage.missing.length === 0, 'V2.5.4 every registered weapon and armor appears in item codex', codexCoverage.missing.slice(0,20).join(','));
const bonusFormulaKeys = vm.runInContext(`canonicalBonusKey('patk')==='pAtk' && canonicalBonusKey('smatk')==='sMatk'`, context);
check(bonusFormulaKeys, 'V2.5.4 P.ATK / S.MATK aliases normalize to combat formula keys');
const skillBonusAlias = vm.runInContext(`(() => { state={jobId:'ranger',stats:{str:1,agi:1,vit:1,int:1,dex:1,luk:1},equip:{weapon:'w1'},instances:{w1:{item:'fourth_bh_bow',refine:2,cards:[]}},relics:{},baseLevel:200,jobLevel:60,learnedSkills:{}}; _gearBonusCache=null; _gearBonusKey=''; return !!SKILLS.ra_arrowstorm && getSkillDamageBonus(SKILLS.ra_arrowstorm) === 5; })()`, context);
check(skillBonusAlias, 'legacy skill bonus key resolves to prefixed skill ID');
const aoeNoTargetGuard = fs.readFileSync(path.join(jsDir, 'engine.js'), 'utf8').includes("'damage', 'magic', 'damage_aoe', 'magic_aoe', 'dot'");
check(aoeNoTargetGuard, 'AOE attacks require a target before SP and cooldown are consumed');


// V2.5.5.14: audit the full RWC and Fashion set effects end-to-end.
const setEffectAudit = JSON.parse(vm.runInContext(`(() => {
  const equip = (items) => {
    state = { jobId:'assassincross', stats:{str:1,agi:1,vit:1,int:1,dex:1,luk:1}, equip:{}, instances:{}, relics:{} };
    for (const [slot,id] of items) state.equip[slot]=id;
    _gearBonusCache=null; _gearBonusKey='';
    return effectiveGearBonuses();
  };
  const rwc = equip([['accessory1','rwc_2012_ring'],['accessory2','rwc_2012_pendant']]);
  const fashion = equip([['footgear','fashion_shoes'],['head_mid','blue_eyeshadow']]);
  const fashionAlt = equip([['footgear','fashion_shoes'],['head_mid','blue_eye_shadow']]);
  const rwcSlotted = equip([['accessory1','rwc_2012_ring_'],['accessory2','rwc_2012_pendant_']]);
  return JSON.stringify({rwc:{all:rwc.allTargetDmgPct||0,matkPct:rwc.matkPct||0},rwcSlotted:{all:rwcSlotted.allTargetDmgPct||0,matkPct:rwcSlotted.matkPct||0},fashion:{hp:fashion.hpPct||0,sp:fashion.spPct||0,int:fashion.int||0,matkPct:fashion.matkPct||0},fashionAlt:{hp:fashionAlt.hpPct||0,sp:fashionAlt.spPct||0,int:fashionAlt.int||0,matkPct:fashionAlt.matkPct||0}});
})()`, context));
check(setEffectAudit.rwc.all === 5 && setEffectAudit.rwc.matkPct === 4, 'RWC set gives +1% base physical damage plus +4% set damage and +4% MATK, without duplicate stacking', JSON.stringify(setEffectAudit.rwc));
check(setEffectAudit.rwcSlotted.all === 5 && setEffectAudit.rwcSlotted.matkPct === 4, 'Slotted RWC set variant has the same correct bonuses', JSON.stringify(setEffectAudit.rwcSlotted));

const otherSetAudit = JSON.parse(vm.runInContext(`(() => {
  const equip=(slots)=>{state={jobId:'assassincross',stats:{str:1,agi:1,vit:1,int:1,dex:1,luk:1},equip:slots,instances:{},relics:{}};_gearBonusCache=null;_gearBonusKey='';return effectiveGearBonuses();};
  const ice=equip({head_top:'hat_of_scrat',armor:'suit_of_sid',garment:'manteau_of_diego',accessory1:'badge_of_manny'});
  const krieger=equip({armor:'krieger_suit1',footgear:'krieger_shoes1',garment:'krieger_muffler1'});
  return JSON.stringify({ice:{hp:ice.hpPct||0,sp:ice.spPct||0,matk:ice.matkPct||0},krieger:{all:krieger.allTargetDmgPct||0,matk:krieger.matkPct||0,freeze:krieger.ailResist_freeze||0}});
})()`,context));
check(otherSetAudit.ice.hp===10 && otherSetAudit.ice.sp===10 && otherSetAudit.ice.matk===5, 'Ice Age set HP/SP and MATK bonuses apply once', JSON.stringify(otherSetAudit.ice));
check(otherSetAudit.krieger.all===5 && otherSetAudit.krieger.matk===5 && otherSetAudit.krieger.freeze===100, 'Krieger set damage/MATK bonuses and freeze immunity apply once', JSON.stringify(otherSetAudit.krieger));

for (const [label, v] of [['canonical',setEffectAudit.fashion],['alternate eye shadow',setEffectAudit.fashionAlt]]) {
  check(v.hp === 13 && v.sp === 10 && v.int === 3 && v.matkPct === 4, `Fashion set ${label} applies base + set bonuses exactly once`, JSON.stringify(v));
}

console.log(`\n${failures ? 'FAILED' : 'ALL PASSED'} — ${failures} failure(s); ${setResults.length} equipment sets checked.`);
process.exitCode = failures ? 1 : 0;
