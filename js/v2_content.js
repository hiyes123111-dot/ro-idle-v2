/* ============================================================
   諸神放置錄 V2 — 第四職業擴充
   本檔在 skills.js / jobs.js / data.js / relics.js 之後、engine.js 之前載入。
   以既有技能結算類型實作新技能，避免另開一套傷害流程。
============================================================ */
(() => {
  const skill = (id, name, type, element, mult, spCost, cooldown, desc, extra = {}) => ({
    id, name, maxLv: 5, type, element, mult, spCost, cooldown, desc, ...extra,
  });
  const active = (id, name, type, element, desc, extra = {}) => skill(
    id, name, type, element,
    type.endsWith('_aoe') ? [2.6, 3.1, 3.6, 4.1, 4.6] : [4.2, 5.2, 6.2, 7.2, 8.2],
    type.endsWith('_aoe') ? [45, 50, 55, 60, 65] : [35, 40, 45, 50, 55],
    type.endsWith('_aoe') ? [8, 8, 8, 8, 8] : [7, 7, 7, 7, 7],
    desc, extra,
  );
  const passive = (id, name, passiveStat, values, desc, extra = {}) => ({
    id, name, maxLv: 5, type: 'passive', passiveStat, element: 'neutral',
    spCost: [0], cooldown: [0], mult: values, desc, ...extra,
  });

  const classes = [
    { id:'dragon_knight', parent:'runeknight', name:'龍騎士', icon:'🐉', atk:1.22, matk:0.9,
      bonusLevels:{str:[5,15,25,35,45],vit:[10,30],agi:[20,40]},
      skills:[
        active('v2_dk_dragon_breath','龍息爆發','magic_aoe','fire','噴吐龍焰，對全體敵人造成火屬性魔法傷害。'),
        active('v2_dk_raging_spear','狂龍長矛','damage','neutral','以龍騎士之力刺穿目標，造成高倍率物理傷害。'),
        passive('v2_dk_dragon_core','龍之核心','atkFlat',[5,10,15,20,25],'龍之力量強化自身，固定 ATK 提升。'),
      ] },
    { id:'imperial_guard', parent:'royalguard', name:'帝國衛士', icon:'🛡️', atk:1.18, matk:0.92,
      bonusLevels:{vit:[5,15,25,35,45],str:[10,30],agi:[20,40]},
      skills:[
        active('v2_ig_shield_burst','帝國盾爆','damage_aoe','holy','以盾牌引爆聖光，對全體敵人造成物理傷害。'),
        active('v2_ig_judgement','王權裁決','magic','holy','凝聚聖光裁決單一目標，造成聖屬性魔法傷害。'),
        passive('v2_ig_aegis_mastery','帝國壁壘','defFlat',[10,20,30,40,50],'強化防禦姿態，固定 DEF 提升。'),
      ] },
    { id:'arch_mage', parent:'warlock', name:'大法師', icon:'🔮', atk:0.9, matk:1.3,
      bonusLevels:{int:[5,15,25,35,45],dex:[10,30],vit:[20,40]},
      skills:[
        active('v2_am_crimson_rock','緋紅岩爆','magic_aoe','fire','召喚灼熱岩塊轟擊全體敵人。'),
        active('v2_am_frost_nova','冰霜新星','magic_aoe','water','釋放極寒新星，對全體敵人造成水屬性魔法傷害。'),
        passive('v2_am_arcane_focus','奧術專注','matkFlat',[5,10,15,20,25],'凝聚奧術能量，固定 MATK 提升。'),
      ] },
    { id:'element_master', parent:'sorcerer', name:'元素支配者', icon:'🌪️', atk:0.92, matk:1.28,
      bonusLevels:{int:[5,15,25,35,45],dex:[10,30],agi:[20,40]},
      skills:[
        active('v2_em_terra_wave','大地脈衝','magic_aoe','earth','引發大地脈動，對全體敵人造成地屬性魔法傷害。'),
        active('v2_em_storm_surge','元素風暴','magic','wind','聚合風元素形成風暴，重創單一目標。'),
        passive('v2_em_spirit_link','精靈共鳴','matkFlat',[5,10,15,20,25],'與元素精靈共鳴，固定 MATK 提升。'),
      ] },
    { id:'wind_hawk', parent:'ranger', name:'風鷹', icon:'🦅', atk:1.2, matk:0.88,
      bonusLevels:{dex:[5,15,25,35,45],agi:[10,30],luk:[20,40]},
      skills:[
        active('v2_wh_gale_arrow','疾風箭雨','damage_aoe','wind','射出疾風箭雨，對全體敵人造成物理傷害。'),
        active('v2_wh_hawk_pierce','獵鷹穿刺','damage','neutral','指揮獵鷹貫穿目標，造成高倍率物理傷害。'),
        passive('v2_wh_keen_sight','銳目獵手','hitFlat',[5,10,15,20,25],'提升遠距瞄準能力，固定 HIT 提升。'),
      ] },
    { id:'troubadour', parent:'minstrel', name:'奏者', icon:'🎼', genderLock:'male', atk:1.08, matk:1.08,
      bonusLevels:{dex:[5,15,25,35,45],int:[10,30],agi:[20,40]},
      skills:[
        active('v2_tb_resonance_blast','共鳴爆音','magic_aoe','wind','以共鳴音波震擊全體敵人，造成風屬性魔法傷害。'),
        active('v2_tb_sonic_lance','音速長鳴','damage','neutral','將樂聲凝成音刃，對單一目標造成物理傷害。'),
        passive('v2_tb_stage_presence','舞台掌控','atkFlat',[4,8,12,16,20],'精準掌控節奏，固定 ATK 提升。'),
      ] },
    { id:'trouvere', parent:'wanderer', name:'舞者', icon:'💃', genderLock:'female', atk:1.08, matk:1.08,
      bonusLevels:{agi:[5,15,25,35,45],dex:[10,30],luk:[20,40]},
      skills:[
        active('v2_tv_rhythm_slash','節奏斬擊','damage_aoe','neutral','以舞步帶動連斬，對全體敵人造成物理傷害。'),
        active('v2_tv_luminous_dance','光耀舞曲','magic','holy','以光之舞曲擊中目標，造成聖屬性魔法傷害。'),
        passive('v2_tv_graceful_step','優雅步伐','fleeFlat',[5,10,15,20,25],'舞步靈巧，固定 FLEE 提升。'),
      ] },
    { id:'meister', parent:'mechanic', name:'機匠', icon:'⚙️', atk:1.25, matk:0.82,
      bonusLevels:{str:[5,15,25,35,45],vit:[10,30],dex:[20,40]},
      skills:[
        active('v2_me_tornado_swing','迴旋重斬','damage_aoe','neutral','操縱重型機械武器旋斬，對全體敵人造成物理傷害。'),
        active('v2_me_overdrive','極限超載','damage','fire','讓機甲短暫超載，對目標造成強力火屬性攻擊。'),
        passive('v2_me_precision_drive','精密傳動','atkFlat',[5,10,15,20,25],'改良機械傳動，固定 ATK 提升。'),
      ] },
    { id:'biolo', parent:'geneticist', name:'生化學者', icon:'🧪', atk:0.98, matk:1.22,
      bonusLevels:{int:[5,15,25,35,45],vit:[10,30],dex:[20,40]},
      skills:[
        active('v2_bio_acid_rain','強酸暴雨','magic_aoe','poison','投擲強酸藥劑，對全體敵人造成毒屬性魔法傷害。'),
        active('v2_bio_mutation_blast','突變爆裂','magic','earth','引爆突變藥劑，對單一目標造成地屬性魔法傷害。'),
        passive('v2_bio_lab_mastery','實驗室精通','matkFlat',[5,10,15,20,25],'精進藥劑與生化技術，固定 MATK 提升。'),
      ] },
    { id:'shadow_cross', parent:'guillotinecross', name:'暗影十字', icon:'🗡️', atk:1.28, matk:0.86,
      bonusLevels:{agi:[5,15,25,35,45],str:[10,30],luk:[20,40]},
      skills:[
        active('v2_sc_shadow_explosion','暗影爆裂','damage_aoe','shadow','引爆影之能量，對全體敵人造成物理傷害。'),
        active('v2_sc_fatal_edge','致命暗刃','damage','poison','以淬毒暗刃斬擊目標，造成高倍率物理傷害。'),
        passive('v2_sc_killing_instinct','殺意本能','atkFlat',[5,10,15,20,25],'磨練暗殺本能，固定 ATK 提升。'),
      ] },
    { id:'abyss_chaser', parent:'shadowchaser', name:'深淵追跡者', icon:'🕳️', atk:1.08, matk:1.18,
      bonusLevels:{dex:[5,15,25,35,45],int:[10,30],agi:[20,40]},
      skills:[
        active('v2_ac_abyss_flame','深淵業火','magic_aoe','shadow','召喚深淵業火吞噬全體敵人。'),
        active('v2_ac_void_spear','虛空穿刺','magic','ghost','凝聚虛空魔力穿透單一目標。'),
        passive('v2_ac_void_attunement','虛空調和','matkFlat',[5,10,15,20,25],'與深淵力量調和，固定 MATK 提升。'),
      ] },
    { id:'cardinal', parent:'archbishop', name:'樞機主教', icon:'✝️', atk:0.92, matk:1.25,
      bonusLevels:{int:[5,15,25,35,45],vit:[10,30],dex:[20,40]},
      skills:[
        active('v2_ca_divine_judgement','神聖裁決','magic_aoe','holy','降下神聖裁決，對全體敵人造成聖屬性魔法傷害。'),
        active('v2_ca_holy_spear','聖光之槍','magic','holy','凝聚聖光貫穿單一目標。'),
        passive('v2_ca_sacred_wisdom','神聖智慧','matkFlat',[5,10,15,20,25],'深化神聖知識，固定 MATK 提升。'),
      ] },
    { id:'inquisitor', parent:'sura', name:'審判者', icon:'👊', atk:1.28, matk:0.9,
      bonusLevels:{str:[5,15,25,35,45],agi:[10,30],vit:[20,40]},
      skills:[
        active('v2_in_tiger_cannon','猛虎砲','damage_aoe','neutral','凝聚氣勁轟出猛虎砲，對全體敵人造成物理傷害。'),
        active('v2_in_explosive_palm','爆裂掌','damage','fire','將氣勁灌入掌中引爆，對單一目標造成火屬性物理傷害。'),
        passive('v2_in_martial_focus','武道專注','atkFlat',[5,10,15,20,25],'精煉武道技巧，固定 ATK 提升。'),
      ] },
  ];

  for (const c of classes) {
    if (JOB_TREE[c.id]) throw new Error(`V2 duplicate job id: ${c.id}`);
    if (!JOB_TREE[c.parent]) throw new Error(`V2 missing parent job: ${c.parent}`);
    for (const sk of c.skills) {
      if (SKILLS[sk.id]) throw new Error(`V2 duplicate skill id: ${sk.id}`);
      SKILLS[sk.id] = sk;
    }
    JOB_TREE[c.id] = {
      id: c.id, name: c.name, tier: 4, icon: c.icon, parent: c.parent,
      baseLevelReq: 200, jobLevelReq: 70, jobLevelMax: 50,
      atkMod: c.atk, matkMod: c.matk,
      hpSpFrom: c.parent, aspdFrom: c.parent,
      next: [], bonusLevels: c.bonusLevels, skills: c.skills,
      desc: `承接${JOB_TREE[c.parent].name}的力量，踏入第四職業階段。`,
      ...(c.genderLock ? { genderLock: c.genderLock } : {}),
    };
    JOB_TREE[c.parent].next = JOB_TREE[c.parent].next || [];
    if (!JOB_TREE[c.parent].next.includes(c.id)) JOB_TREE[c.parent].next.push(c.id);
  }
})();

/* ---------------- V2 新裝備、卡片、魔物與副本 ---------------- */
(() => {
  const fourthJobIds = Object.values(JOB_TREE).filter(j => j.tier === 4).map(j => j.id);
  /* 修正 V1.17 既有弒神者卡片來源：卡片表指向不存在的 mysteltainn，
     實際魔物資料是 mysteltainn_r，並補入鐘塔 04 的刷新池。 */
  if (CARDS.mysteltainn_card && MONSTERS.mysteltainn_r) {
    CARDS.mysteltainn_card.monsterId = 'mysteltainn_r';
    delete MONSTER_CARD_DROPS.mysteltainn;
    MONSTER_CARD_DROPS.mysteltainn_r = {card:'mysteltainn_card',chance:0.0005};
    const clockTower = MAPS.find(m => m.id === 'c_tower4');
    if (clockTower && !(clockTower.monsters || []).some(m => m.id === 'mysteltainn_r')) {
      clockTower.monsters.push({id:'mysteltainn_r',weight:3});
    }
  }
  const addItem = (id, def) => {
    if (ITEMS[id]) throw new Error(`V2 duplicate item id: ${id}`);
    ITEMS[id] = { id, ...def };
  };
  const addCard = (id, def) => {
    if (CARDS[id] || ITEMS[id]) throw new Error(`V2 duplicate card id: ${id}`);
    CARDS[id] = { id, ...def };
    ITEMS[id] = {id,name:def.name,type:'material',icon:'📦',weight:1,sell:10,buyPrice:20,desc:`${def.desc} 系列: 卡片 裝備: ${def.slot} 重量: 1`};
  };
  const fourthWeaponImages = { dragon_knight:1168, imperial_guard:1463, arch_mage:1664, element_master:1583,
    wind_hawk:1713, troubadour:1907, trouvere:1909, meister:1360, biolo:1236,
    shadow_cross:1245, abyss_chaser:1242, cardinal:1668, inquisitor:1809 };
  const weapon = (id, name, jobId, weaponCat, atk, matk, icon, desc) => addItem(id, {
    name, type:'weapon', icon, imgId:fourthWeaponImages[jobId], weaponType:(weaponCat === 'instrument' || weaponCat === 'whip') ? 'bow' : weaponCat, weaponCat, weaponLv:4, atk, ...(matk ? {matk} : {}),
    weight:120, slots:1, reqLevel:200, reqJob:[jobId],
    desc: `${desc} 系列: ${weaponCat === 'rod' || weaponCat === 'book' ? '武器' : '武器'} 攻擊: ${atk} 重量: 120 武器等級: 4 要求等級: 200 裝備: ${JOB_TREE[jobId].name}`,
  });

  weapon('v2_dragon_spear','龍魂長槍','dragon_knight','spear',330,0,'🔱','雙手長槍，封存古龍力量，揮動時會留下赤色龍焰。');
  weapon('v2_imperial_lance','帝國裁決槍','imperial_guard','spear',310,0,'🛡️','帝國衛士專用的制式長槍，槍尖刻有聖印。');
  weapon('v2_archmage_staff','星界法杖','arch_mage','rod',95,360,'✨','雙手法杖，以星界晶核製成，能大幅放大魔力。');
  weapon('v2_element_book','元素秘典','element_master','book',175,245,'📘','記載四大元素循環的古老秘典。');
  weapon('v2_wind_bow','蒼穹之弓','wind_hawk','bow',325,0,'🏹','以風鷹羽骨製成的長弓，箭矢破空無聲。');
  weapon('v2_troubadour_harp','天籟豎琴','troubadour','instrument',265,85,'🎻','奏者傳承的共鳴樂器，能將音波化為利刃。');
  weapon('v2_trouvere_whip','月影之鞭','trouvere','whip',260,95,'🎀','舞者專用的月影長鞭，揮舞時散出銀色光弧。');
  weapon('v2_meister_axe','重型機械斧','meister','axe2',355,0,'🪓','雙手機械斧，斧刃內藏增壓裝置。');
  weapon('v2_biolo_injector','生化注射器','biolo','dagger',230,190,'🧪','生化學者專用的注射型短刃，可導入高濃度藥劑。');
  weapon('v2_shadow_katar','夜影拳刃','shadow_cross','katar',315,0,'🗡️','吸收暗影的拳刃，專為瞬間處決而設計。');
  weapon('v2_abyss_dagger','深淵短劍','abyss_chaser','dagger',285,140,'🌑','從深淵裂縫帶回的短劍，刃面映不出光線。');
  weapon('v2_cardinal_staff','聖典權杖','cardinal','rod',90,345,'✝️','刻有古代聖典的權杖，能穩定神聖魔力。');
  weapon('v2_inquisitor_knuckle','審判拳套','inquisitor','knuckle',320,0,'👊','以聖鐵打造的拳套，專為近身審判而生。');
  addItem('v2_rift_core',{name:'裂隙核心碎片',type:'material',icon:'🌀',weight:5,sell:500,desc:'深淵裂縫中凝結的能量碎片，可作為高階製作材料。'});
  addItem('v2_dragon_scale',{name:'熾焰龍鱗',type:'material',icon:'🐉',weight:8,sell:800,desc:'熾焰幼龍脫落的鱗片，仍殘留灼熱魔力。'});

  const armor = (id, name, armorType, def, icon, desc, bonus = {}) => addItem(id, {
    name, type:'armor', armorType, def, icon, weight:80, slots:1,
    reqLevel:200, reqJob:fourthJobIds, desc:`${desc} 系列: ${armorType === 'footgear' ? '鞋子' : armorType === 'garment' ? '披肩' : armorType === 'accessory' ? '飾品' : '鎧甲'} 防禦: ${def} 重量: 80 要求等級: 200 裝備: 第四職業群`,
    ...bonus,
  });
  armor('v2_rift_plate','裂隙守衛鎧甲','armor',72,'🛡️','以深淵礦鋼鍛造的重鎧，能承受裂隙魔物的衝擊。',{vit:3,hpPct:4});
  armor('v2_rift_mantle','裂隙守衛披肩','garment',38,'🧣','以裂隙纖維編織的披肩，能穩定持有者的氣息。',{flee:8});
  armor('v2_rift_boots','裂隙守衛戰靴','footgear',42,'👢','以堅韌黑鋼打造的戰靴，適合長時間探索裂隙。',{agi:2});
  armor('v2_rift_ring','裂隙核心戒指','accessory',5,'💍','封存微量裂隙能量的戒指。',{allStat:1});

  EQUIP_SETS.v2_rift_guard_set = {
    name:'裂隙守衛套裝', items:['v2_rift_plate','v2_rift_mantle','v2_rift_boots'],
    bonus:{hpPct:8,def:25,vit:3},
  };
  EQUIP_SETS.v2_rift_core_set = {
    name:'裂隙核心套裝', items:['v2_rift_ring','v2_abyss_dagger'],
    bonus:{atkPct:4,matkPct:4,allTargetDmgPct:3},
  };

  addCard('v2_rift_sentinel_card',{monsterId:'v2_rift_sentinel',name:'裂隙守衛卡片',icon:'🛡️',slot:'armor',bonus:{hpPct:6,def:5},desc:'MaxHP +6%、DEF +5'});
  addCard('v2_abyss_stalker_card',{monsterId:'v2_abyss_stalker',name:'深淵潛行者卡片',icon:'🗡️',slot:'weapon',bonus:{critRate:3,critDmgPct:5},desc:'暴擊率 +3、暴擊傷害 +5%'});
  addCard('v2_ember_drake_card',{monsterId:'v2_ember_drake',name:'熾焰龍卡片',icon:'🔥',slot:'weapon',bonus:{eleDmg_fire:12},desc:'對火屬性魔物傷害 +12%'});
  addCard('v2_void_sage_card',{monsterId:'v2_void_sage',name:'虛空賢者卡片',icon:'🔮',slot:'headgear',bonus:{matkPct:5,spPct:4},desc:'MATK +5%、MaxSP +4%'});
  addCard('v2_rift_guardian_card',{monsterId:'v2_rift_guardian',name:'裂隙守門者卡片',icon:'👑',slot:'accessory',bonus:{atkPct:4,matkPct:4},desc:'ATK +4%、MATK +4%'});
  addCard('v2_void_emperor_card',{monsterId:'v2_void_emperor',name:'虛空帝王卡片',icon:'🌑',slot:'armor',bonus:{hpPct:8,spPct:8,allTargetDmgPct:3},desc:'MaxHP +8%、MaxSP +8%、全體傷害 +3%'});
  addCard('v2_wind_hawk_card',{monsterId:'v2_wind_hawk',name:'風鷹卡片',icon:'🦅',slot:'garment',bonus:{rangedDmgPct:8,hit:5},desc:'遠距離傷害 +8%、HIT +5'});
  addCard('v2_biolo_card',{monsterId:'v2_biolo_beast',name:'生化獸卡片',icon:'🧪',slot:'accessory',bonus:{skillDmg_v2_bio_acid_rain:12,sp:40},desc:'強酸暴雨傷害 +12%、MaxSP +40'});

  const resistance = {none:100,water:100,earth:100,fire:100,wind:100,poison:100,holy:100,shadow:100,ghost:100,undead:100};
  const addMonster = (id, def) => {
    if (MONSTERS[id]) throw new Error(`V2 duplicate monster id: ${id}`);
    MONSTERS[id] = {id, imgId:0, icon:'👿', element:'none', elementResistance:{...resistance},
      race:'formless', size:'medium', isBoss:false, ...def};
  };
  addMonster('v2_rift_sentinel',{name:'裂隙守衛',level:205,hp:820000,atk:2800,def:185,defSoft:160,mdef:120,mdefSoft:130,element:'earth',race:'formless',size:'large',exp:180000,jobExp:160000,hit:510,flee:410,atkInterval:1.4,drops:[{item:'v2_rift_plate',chance:0.002},{item:'v2_rift_core',chance:0.08},{item:'v2_imperial_lance',chance:0.0015}]});
  addMonster('v2_abyss_stalker',{name:'深淵潛行者',level:210,hp:940000,atk:3200,def:165,defSoft:175,mdef:100,mdefSoft:120,element:'shadow',race:'demon',size:'medium',exp:195000,jobExp:175000,hit:530,flee:440,atkInterval:1.1,drops:[{item:'v2_rift_mantle',chance:0.002},{item:'v2_rift_core',chance:0.1},{item:'v2_shadow_katar',chance:0.0015},{item:'v2_abyss_dagger',chance:0.001}]});
  addMonster('v2_ember_drake',{name:'熾焰幼龍',level:215,hp:1100000,atk:3600,def:190,defSoft:185,mdef:130,mdefSoft:140,element:'fire',race:'dragon',size:'large',exp:220000,jobExp:195000,hit:545,flee:455,atkInterval:1.3,drops:[{item:'v2_dragon_scale',chance:0.12},{item:'v2_rift_boots',chance:0.0015},{item:'v2_dragon_spear',chance:0.0015}]});
  addMonster('v2_void_sage',{name:'虛空賢者',level:218,hp:1250000,atk:3400,def:155,defSoft:195,mdef:220,mdefSoft:190,element:'ghost',race:'demon',size:'medium',exp:235000,jobExp:210000,hit:560,flee:470,atkInterval:1.6,drops:[{item:'v2_rift_ring',chance:0.002},{item:'v2_archmage_staff',chance:0.0015},{item:'v2_element_book',chance:0.0015},{item:'v2_cardinal_staff',chance:0.0015}]});
  addMonster('v2_wind_hawk',{name:'裂風獵鷹',level:212,hp:990000,atk:3300,def:170,defSoft:180,mdef:90,mdefSoft:110,element:'wind',race:'brute',size:'medium',exp:205000,jobExp:185000,hit:550,flee:495,atkInterval:0.95,drops:[{item:'v2_dragon_scale',chance:0.06},{item:'v2_wind_bow',chance:0.0015},{item:'v2_troubadour_harp',chance:0.0015},{item:'v2_trouvere_whip',chance:0.0015}]});
  addMonster('v2_biolo_beast',{name:'失控生化獸',level:220,hp:1380000,atk:3900,def:205,defSoft:190,mdef:155,mdefSoft:160,element:'poison',race:'brute',size:'large',exp:250000,jobExp:225000,hit:575,flee:465,atkInterval:1.25,drops:[{item:'v2_rift_core',chance:0.12},{item:'v2_biolo_injector',chance:0.0015},{item:'v2_meister_axe',chance:0.0015},{item:'v2_inquisitor_knuckle',chance:0.0015}]});
  addMonster('v2_rift_guardian',{name:'裂隙守門者',level:230,hp:26000000,atk:6800,def:260,defSoft:240,mdef:210,mdefSoft:220,element:'shadow',race:'demon',size:'large',isBoss:true,isMvp:true,exp:2500000,jobExp:2100000,hit:650,flee:540,atkInterval:1.15,drops:[{item:'v2_rift_ring',chance:0.015},{item:'v2_rift_plate',chance:0.01},{item:'goddess_tear',chance:0.35},{item:'valkyrie_token',chance:0.25},{item:'brynhild_armor_piece',chance:0.20},{item:'hero_remains',chance:0.18},{item:'andvari_ring',chance:0.12},{item:'dusk_glow',chance:0.20},{item:'dawn_essence',chance:0.20}]});
  addMonster('v2_void_emperor',{name:'虛空帝王',level:240,hp:52000000,atk:8500,def:310,defSoft:280,mdef:280,mdefSoft:250,element:'ghost',race:'demon',size:'large',isBoss:true,isMvp:true,exp:5200000,jobExp:4600000,hit:710,flee:590,atkInterval:1.05,drops:[{item:'v2_abyss_dagger',chance:0.01},{item:'v2_rift_core',chance:0.25},{item:'goddess_tear',chance:0.35},{item:'valkyrie_token',chance:0.25},{item:'dusk_glow',chance:0.20},{item:'dawn_essence',chance:0.20},{item:'cold_moonlight',chance:0.18},{item:'hazy_starlight',chance:0.18},{item:'v2_dragon_scale',chance:0.30}]});

  /* V2 頭目技能沿用既有 MONSTER_SKILLS 結算器，不另造傷害流程。 */
  MONSTER_SKILLS.v2_rift_guardian = [
    {s:'V2_RIFT_CRITICAL',lv:10,rate:18,cd:7,mult:2.0},
    {s:'NPC_STUNATTACK',lv:10,rate:12,cd:10,ail:'stun',mult:1.25},
    {s:'NPC_DARKBREATH',lv:5,rate:10,cd:12,elem:'shadow',magic:1,mult:2.0},
  ];
  MONSTER_SKILLS.v2_void_emperor = [
    {s:'V2_VOID_NOVA',lv:10,rate:20,cd:9,elem:'ghost',magic:1,mult:2.5},
    {s:'NPC_CURSEATTACK',lv:10,rate:12,cd:10,ail:'curse',mult:1.0},
    {s:'MG_SOULSTRIKE',lv:10,rate:15,cd:8,elem:'ghost',magic:1,mult:2.2},
  ];
  MONSTER_SKILLS.v2_void_sage = [
    {s:'MG_THUNDERSTORM',lv:10,rate:12,cd:8,elem:'wind',magic:1,mult:1.8},
    {s:'MG_SOULSTRIKE',lv:10,rate:10,cd:9,elem:'ghost',magic:1,mult:1.8},
  ];

  Object.assign(MONSTER_CARD_DROPS, {
    v2_rift_sentinel:{card:'v2_rift_sentinel_card',chance:0.0005},
    v2_abyss_stalker:{card:'v2_abyss_stalker_card',chance:0.0005},
    v2_ember_drake:{card:'v2_ember_drake_card',chance:0.0005},
    v2_void_sage:{card:'v2_void_sage_card',chance:0.0005},
    v2_rift_guardian:{card:'v2_rift_guardian_card',chance:0.0005},
    v2_void_emperor:{card:'v2_void_emperor_card',chance:0.0005},
    v2_wind_hawk:{card:'v2_wind_hawk_card',chance:0.0005},
    v2_biolo_beast:{card:'v2_biolo_card',chance:0.0005},
  });

  MAPS.push(
    {id:'v2_abyss_rift_lower',imgId:5500,name:'深淵裂縫・下層',bg:'map-cave',desc:'裂隙能量滲出的危險地帶，聚集了守衛與潛行者。',monsters:[
      {id:'v2_rift_sentinel',weight:30},{id:'v2_abyss_stalker',weight:25},{id:'v2_ember_drake',weight:15},{id:'v2_wind_hawk',weight:15},{id:'v2_biolo_beast',weight:15},
    ]},
    {id:'v2_abyss_rift_core',imgId:5501,name:'深淵裂縫・核心',bg:'map-cave',desc:'裂縫核心深處，虛空賢者與帝王守護著裂隙源頭。',monsters:[
      {id:'v2_void_sage',weight:65},{id:'v2_rift_guardian',weight:25},{id:'v2_void_emperor',weight:10},
    ]},
  );
  MVP_MAP_DATA.v2_abyss_rift_lower = ['v2_rift_guardian'];
  MVP_MAP_DATA.v2_abyss_rift_core = ['v2_rift_guardian','v2_void_emperor'];

  /* V2 第七套遺物：只提供數值型效果，沿用既有三段套裝計件，不新增戰鬥旗標。 */
  if (!RELIC_SETS.v2_rift) {
    RELIC_SETS.v2_rift = {
      id:'v2_rift', name:'裂隙探索者的遺物', icon:'🌀', desc:'從深淵裂縫核心回收的古代遺物。',
      pieceNames:{relic_head:'裂隙面罩',relic_armor:'裂隙護甲',relic_garment:'裂隙披風',relic_weapon:'裂隙核心',relic_shield:'裂隙壁障',relic_footgear:'裂隙戰靴',relic_acc1:'裂隙戒指',relic_acc2:'裂隙護符'},
      tiers:[
        {need:2,bonus:{atkPct:4,matkPct:4},text:'ATK +4%、MATK +4%'},
        {need:3,bonus:{hpPct:8,spPct:8},text:'MaxHP +8%、MaxSP +8%'},
        {need:5,bonus:{allTargetDmgPct:5,def:20,mdef:20},text:'全體傷害 +5%、DEF +20、MDEF +20'},
      ],
    };
    const set = RELIC_SETS.v2_rift;
    RELIC_SLOTS.forEach(slot => {
      const id = 'relic_v2_rift_' + slot.slice('relic_'.length);
      const item = {id,name:set.name+'・'+set.pieceNames[slot],type:'relic',icon:set.icon,relicSet:set.id,relicSlot:slot,weight:0,sell:0,buyPrice:0,desc:set.desc+'（'+RELIC_SLOT_NAMES[slot]+'）'};
      RELIC_ITEMS[id]=item; ITEMS[id]=item; RELIC_PIECE_IDS.push(id);
    });
  }
})();
