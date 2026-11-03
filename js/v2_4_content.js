/* ============================================================
   諸神放置錄 V2.4.0 — 技能條件與三／四轉裝備擴充
   載入順序：data.js、v2_content.js 之後，engine.js 之前。
   圖示優先沿用專案內 RO 原始裝備圖檔（imgId）。
============================================================ */
(() => {
  // 三轉技能自由學習；依官方常見武器流派限制實際施放／被動生效。
  const weaponGates = {
    // 符文騎士：音速衝擊波可用長矛或雙手劍；符文刃舞偏雙手劍；龍息需騎乘龍（以矛系技能條件做遊戲內可操作限制）。
    rk_sonicwave: 'spear_sword2', rk_runeedge: 'sword2',
    // 皇家禁衛：盾牌技需盾，長矛技需長矛。
    rg_radiance: 'spear', rg_earthdrive: 'spear',
    // 咒術士／妖術師／大主教：魔法通用，不綁武器。
    // 遊俠：弓系。
    ra_arrowstorm: 'bow', ra_aimedbolt: 'bow',
    // 樂團／漂流者：樂器／鞭子。
    mi_soundblend: 'instrument', mi_echoing: 'instrument', mi_severe: 'instrument',
    wa_swing: 'whip', wa_rainstorm: 'whip', wa_siren: 'whip',
    // 機工士：斧／鈍器；基因學者可用手推車技能，不綁手持武器。
    me_axeboom: 'axemace', me_tornado: 'axemace',
    // 十字斬首者：拳刃分支；魅影追蹤者可用短劍或弓，以下弓技限定弓。
    gx_crossimpact: 'katar', gx_counter: 'katar', gx_darkclaw: 'katar',
    sc_fatalmenace: 'dagger',
    // 修羅：拳套／空手。
    sr_knuckle: 'knuckle', sr_rampage: 'knuckle',
  };
  for (const [id, req] of Object.entries(weaponGates)) {
    if (SKILLS[id]) {
      SKILLS[id].requiresWeapon = req;
      SKILLS[id].desc = `${SKILLS[id].desc || ''}（使用條件：${({spear_sword2:'長矛或雙手劍',sword2:'雙手劍',spear:'長矛',bow:'弓',instrument:'樂器',whip:'鞭子',axemace:'斧頭或鈍器',katar:'拳刃',dagger:'短劍',knuckle:'拳套'})[req] || req}）`;
    }
  }
  // 龍息需先學會騎乘術；引擎會在施放檢查中驗證前置技能。
  if (SKILLS.rk_dragonbreath) { SKILLS.rk_dragonbreath.requiresSkill = 'riding'; SKILLS.rk_dragonbreath.desc += '（使用條件：必須學會騎乘術）'; }
  // 龍息需先學會騎乘術；施放時由前置技能判定器驗證。
  if (SKILLS.rk_dragonbreath) { SKILLS.rk_dragonbreath.requiresSkill = 'riding'; SKILLS.rk_dragonbreath.desc += '（使用條件：必須學會騎乘術）'; }
  // 龍息需先學會騎乘術；施放時由前置技能判定器驗證。
  if (SKILLS.rk_dragonbreath) { SKILLS.rk_dragonbreath.requiresSkill = 'riding'; SKILLS.rk_dragonbreath.desc += '（使用條件：必須學會騎乘術）'; }
  // 龍息需先學會騎乘術；施放時由前置技能判定器驗證。
  if (SKILLS.rk_dragonbreath) { SKILLS.rk_dragonbreath.requiresSkill = 'riding'; SKILLS.rk_dragonbreath.desc += '（使用條件：必須學會騎乘術）'; }
  // 盾牌限制：使用既有 requiresEquip 判定器。
  for (const id of ['rg_sacredguard']) if (SKILLS[id]) {
    SKILLS[id].requiresEquip = 'shield';
    SKILLS[id].desc += '（使用條件：必須裝備盾牌）';
  }
  // 四轉技能保留原有設計；新增裝備可支援四轉流派配裝。

  const add = (id, def) => {
    if (ITEMS[id]) throw new Error(`V2.4 duplicate item: ${id}`);
    ITEMS[id] = {id, ...def};
  };
  const thirdJobs = Object.values(JOB_TREE).filter(j => j.tier === 3);
  const thirdWeapons = [
    ['runeknight','符文龍牙長劍','sword2',285,0,1168,'兼顧雙手劍連擊與符文爆發。'],
    ['royalguard','聖裁騎槍','spear',275,0,1463,'皇家禁衛的長矛制式武器。'],
    ['warlock','紅蓮星界法杖','rod',75,285,1664,'強化火焰與星界魔法。'],
    ['sorcerer','元素共鳴之書','book',145,210,1583,'記錄四大元素的古代秘典。'],
    ['ranger','風鷹長弓','bow',280,0,1713,'適合弓箭與遠距離狙擊。'],
    ['minstrel','深林吟遊琴','instrument',230,65,1907,'樂團專用的共鳴樂器。'],
    ['wanderer','月影銀鞭','whip',225,65,1909,'漂流者專用的靈巧長鞭。'],
    ['mechanic','重裝工匠巨斧','axe1',300,0,1360,'為機械工匠打造的重型斧。'],
    ['geneticist','煉金注魔短刃','dagger',195,145,1236,'可穩定施放生化藥劑。'],
    ['guillotinecross','闇月拳刃','katar',270,0,1245,'為拳刃爆發打造的暗殺武器。'],
    ['shadowchaser','幻影追跡短劍','dagger',245,105,1242,'適合短劍與影襲戰術。'],
    ['archbishop','聖言權杖','rod',70,270,1668,'凝聚聖屬性魔力的權杖。'],
    ['sura','羅漢破軍拳套','knuckle',275,0,1809,'將氣勁集中於拳套之中。'],
  ];
  for (const [job,name,weaponCat,atk,matk,imgId,desc] of thirdWeapons) {
    const jobDef = JOB_TREE[job];
    add(`v24_${job}_weapon`, {
      name, type:'weapon', weaponType:weaponCat, weaponCat, weaponLv:4,
      atk, ...(matk ? {matk} : {}), imgId, weight:100, slots:1,
      reqLevel:150, reqJob:[job], sell:12000,
      desc:`${desc} 三轉專屬武器。系列: 武器 攻擊: ${atk} 重量: 100 武器等級: 4 要求等級: 150 裝備: ${jobDef.name}`,
    });
  }
  // 三轉職業共用防具套裝：以真實 RO 裝備圖檔呈現，穿滿指定件數才啟動。
  const armorItems = [
    ['v24_third_armor','三轉守護鎧甲','armor',62,91001,{vit:3,hpPct:3},'厚實鎧甲提升三轉角色的承傷能力。'],
    ['v24_third_mantle','三轉疾風披肩','garment',32,2307,{agi:2,flee:6},'輕量披肩提升閃避與機動性。'],
    ['v24_third_boots','三轉戰意長靴','footgear',35,2505,{str:2,hp:250},'適合長途戰鬥的強化戰靴。'],
    ['v24_third_ring','三轉職業徽記','accessory',4,2605,{allStat:1,sp:30},'承載三轉職業力量的徽記。'],
  ];
  for (const [id,name,armorType,def,imgId,bonus,desc] of armorItems) add(id, {
    name,type:'armor',armorType,def,imgId,weight:60,slots:1,reqLevel:150,reqJob:thirdJobs.map(j=>j.id),sell:9000,
    ...bonus,desc:`${desc} 系列: ${armorType==='footgear'?'鞋子':armorType==='garment'?'披肩':armorType==='accessory'?'飾品':'鎧甲'} 防禦: ${def} 重量: 60 要求等級: 150 裝備: 三轉職業群`,
  });
  // 四轉高階套裝：與既有 13 把四轉武器互補。
  const fourthJobs = Object.values(JOB_TREE).filter(j=>j.tier===4);
  const fourthItems = [
    ['v24_fourth_armor','四轉星耀戰甲','armor',88,2116,{allStat:1,hpPct:6,def:20},'四轉專用高階戰甲。'],
    ['v24_fourth_mantle','四轉虛空披風','garment',48,2335,{flee:12,matkPct:3},'以虛空纖維編織的披風。'],
    ['v24_fourth_boots','四轉神速戰靴','footgear',52,2522,{agi:3,hpPct:3},'強化速度與續戰能力。'],
    ['v24_fourth_accessory','四轉核心徽章','accessory',8,2659,{allStat:2,atkPct:3,matkPct:3},'封存四轉職業核心力量。'],
  ];
  for (const [id,name,armorType,def,imgId,bonus,desc] of fourthItems) add(id, {
    name,type:'armor',armorType,def,imgId,weight:70,slots:1,reqLevel:200,reqJob:fourthJobs.map(j=>j.id),sell:18000,
    ...bonus,desc:`${desc} 系列: ${armorType==='footgear'?'鞋子':armorType==='garment'?'披肩':armorType==='accessory'?'飾品':'鎧甲'} 防禦: ${def} 重量: 70 要求等級: 200 裝備: 四轉職業群`,
  });
  EQUIP_SETS.v24_third_set = {name:'三轉守護者套裝',items:['v24_third_armor','v24_third_mantle','v24_third_boots','v24_third_ring'],bonus:{hpPct:8,atkPct:3,matkPct:3,vit:3}};
  EQUIP_SETS.v24_fourth_set = {name:'四轉星耀套裝',items:['v24_fourth_armor','v24_fourth_mantle','v24_fourth_boots','v24_fourth_accessory'],bonus:{hpPct:10,spPct:8,atkPct:5,matkPct:5,allStat:2}};

  // 掉落：三轉武器由裂隙下層取得；四轉防具與飾品由核心 MVP 取得。
  const lower = MONSTERS.v2_rift_sentinel;
  const stalker = MONSTERS.v2_abyss_stalker;
  const ember = MONSTERS.v2_ember_drake;
  const sage = MONSTERS.v2_void_sage;
  const guardian = MONSTERS.v2_rift_guardian;
  const emperor = MONSTERS.v2_void_emperor;
  const addDrop=(mon,id,chance)=>{if(mon && !(mon.drops||[]).some(d=>d.item===id)) mon.drops.push({item:id,chance});};
  thirdWeapons.forEach(([job])=>addDrop(lower,`v24_${job}_weapon`,0.0008));
  addDrop(stalker,'v24_third_armor',0.002); addDrop(ember,'v24_third_mantle',0.002);
  addDrop(lower,'v24_third_boots',0.002); addDrop(sage,'v24_third_ring',0.002);
  addDrop(guardian,'v24_fourth_armor',0.012); addDrop(guardian,'v24_fourth_mantle',0.012);
  addDrop(emperor,'v24_fourth_boots',0.012); addDrop(emperor,'v24_fourth_accessory',0.01);
})();
