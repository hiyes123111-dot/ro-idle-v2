/* v2.5.397 — 仙境全書卡片資料補齊（鞋子／披肩）
 * Reference pages: https://ro.ntome.com/item/card/shoes and /item/card/cloak
 * Only source-listed effects are imported. No monster drop IDs/rates are fabricated.
 */
(() => {
  if (typeof CARDS === 'undefined' || typeof ITEMS === 'undefined') return;
  const sourceShoes = 'https://ro.ntome.com/item/card/shoes';
  const sourceCloak = 'https://ro.ntome.com/item/card/cloak';
  const added = [];
  const defs = [
    // 鞋子卡片
    { id:'ep21_sea_angel_card', name:'海天使卡片', slot:'footgear', source:sourceShoes,
      bonus:{ atkPct:8 }, condBonus:[
        { when:{ refineMin:7 }, bonus:{ raceDmg_demon:12 } },
        { when:{ refineMin:9 }, bonus:{ raceDmg_demon:8 } }
      ], desc:'ATK+8%；精煉+7時，對惡魔型魔物的物理傷害+12%；精煉+9時再+8%。' },
    { id:'ep21_ice_seahorse_card', name:'冰海馬卡片', slot:'footgear', source:sourceShoes,
      bonus:{ matkPct:5 }, condBonus:[
        { when:{ refineMin:7 }, bonus:{ magicRaceDmg_formless:10 } },
        { when:{ refineMin:9 }, bonus:{ magicRaceDmg_formless:7 } }
      ], desc:'MATK+5%；精煉+7時，對無型魔物的魔法傷害+10%；精煉+9時再+7%。' },
    { id:'ep21_yester_cleaner_card', name:'耶斯特清潔工卡片', slot:'footgear', source:sourceShoes,
      bonus:{ atkPct:8 }, condBonus:[
        { when:{ refineMin:7 }, bonus:{ raceDmg_dragon:12 } },
        { when:{ refineMin:9 }, bonus:{ raceDmg_dragon:8 } }
      ], desc:'ATK+8%；精煉+7時，對龍族魔物的物理傷害+12%；精煉+9時再+8%。' },
    { id:'ep21_yester_collector_card', name:'耶斯特徵收員卡片', slot:'footgear', source:sourceShoes,
      bonus:{ atkPct:8 }, condBonus:[
        { when:{ refineMin:7 }, bonus:{ raceDmg_formless:12 } },
        { when:{ refineMin:9 }, bonus:{ raceDmg_formless:8 } }
      ], desc:'ATK+8%；精煉+7時，對無型魔物的物理傷害+12%；精煉+9時再+8%。' },
    { id:'ep21_yester_chef_card', name:'耶斯特廚師卡片', slot:'footgear', source:sourceShoes,
      bonus:{ matkPct:5 }, condBonus:[
        { when:{ refineMin:7 }, bonus:{ magicRaceDmg_dragon:10 } },
        { when:{ refineMin:9 }, bonus:{ magicRaceDmg_dragon:7 } }
      ], desc:'MATK+5%；精煉+7時，對龍族魔物的魔法傷害+10%；精煉+9時再+7%。' },
    { id:'ep21_yeltus_executor_card', name:'耶爾圖斯執行官卡片', slot:'footgear', source:sourceShoes,
      bonus:{ spCostPct:10 }, perRefine:{ magicEleDmg_ghost:3 },
      desc:'使用技能時SP消耗量+10%；鞋子每精煉+1，念屬性魔法傷害+3%。' },
    { id:'ep21_fioren_card', name:'菲歐蓮卡片', slot:'footgear', source:sourceShoes,
      bonus:{ matkPct:5 }, condBonus:[
        { when:{ refineMin:7 }, bonus:{ magicRaceDmg_humanoid:10 } },
        { when:{ refineMin:9 }, bonus:{ magicRaceDmg_humanoid:7 } }
      ], desc:'MATK+5%；精煉+7時，對人類型魔物的魔法傷害+10%；精煉+9時再+7%。' },
    { id:'ep21_garlic_monster_card', name:'大蒜怪卡片', slot:'footgear', source:sourceShoes,
      bonus:{ critDmgPct:7, cRate:3 }, condBonus:[
        { when:{}, bonus:{ per2Refine_critRate:3, per2Refine_critDmgPct:1 } }
      ], desc:'暴擊傷害+7%、C.RATE+3；鞋子每精煉+2，CRI+3、暴擊傷害再+1%。' },
    // 披肩卡片
    { id:'ep21_elizabeth_card', name:'伊莉莎白卡片', slot:'garment', source:sourceCloak,
      bonus:{ neutralResistPct:15 }, perRefine:{ magicEleDmg_poison:3 },
      desc:'對無屬性攻擊的抗性+15%；披肩每精煉+1，毒屬性魔法傷害+3%。' },
    { id:'ep21_cave_lantern_fish_card', name:'洞穴燈籠魚卡片', slot:'garment', source:sourceCloak,
      bonus:{ neutralResistPct:15 }, perRefine:{ magicEleDmg_ghost:3 },
      condBonus:[{ when:{ withCards:['abandoned_original_rgan_card'] }, bonus:{ neutralResistPct:5 } }],
      desc:'對無屬性攻擊的抗性+15%；披肩每精煉+1，念屬性魔法傷害+3%；搭配廢棄的原始蠕蟲卡片時，對無屬性攻擊的抗性再+5%。' },
    { id:'ep21_one_eyed_dororo_shrimp_card', name:'獨眼多洛蝦卡片', slot:'garment', source:sourceCloak,
      bonus:{ neutralResistPct:20 }, condBonus:[
        { when:{ refineMax:11 }, bonus:{ magicEleDmg_shadow:-25, magicEleDmg_holy:-25, magicEleDmg_ghost:-25, magicEleDmg_none:-25 } },
        { when:{ refineMin:12 }, bonus:{ magicEleDmg_shadow:25, magicEleDmg_holy:25, magicEleDmg_ghost:25, magicEleDmg_none:25 } },
        { when:{ armorLevelMin:2 }, bonus:{ magicEleDmg_shadow:8, magicEleDmg_holy:8, magicEleDmg_ghost:8, magicEleDmg_none:8 } }
      ], desc:'對無屬性攻擊的抗性+20%；披肩精煉+11以下時，暗／聖／念／無屬性魔法傷害-25%；精煉+12以上時改為+25%；若裝備防具等級Lv.2披肩，上述四種魔法傷害再+8%。' },
  ];

  defs.forEach(def => {
    if (!CARDS[def.id]) {
      CARDS[def.id] = {
        id:def.id, name:def.name, icon:'🃏', slot:def.slot,
        bonus:def.bonus || {}, ...(def.perRefine ? { perRefine:def.perRefine } : {}),
        ...(def.condBonus ? { condBonus:def.condBonus } : {}),
        desc:def.desc, source:def.source, addedVersion:'v2.5.397'
      };
      added.push(def.id);
    }
    if (!ITEMS[def.id]) {
      ITEMS[def.id] = {
        id:def.id, imgId:0, name:def.name, type:'material', icon:'🃏',
        weight:1, sell:10, buyPrice:20, codexInclude:true, addedVersion:'v2.5.397',
        desc:`${CARDS[def.id].desc} 系列：卡片；裝備：${def.slot === 'footgear' ? '鞋子' : '披肩'}；資料來源：仙境全書；怪物掉落來源待核實。`
      };
    } else {
      ITEMS[def.id].codexInclude = true;
      ITEMS[def.id].addedVersion = ITEMS[def.id].addedVersion || 'v2.5.397';
      ITEMS[def.id].desc = `${CARDS[def.id].desc} 系列：卡片；裝備：${def.slot === 'footgear' ? '鞋子' : '披肩'}；資料來源：仙境全書；怪物掉落來源待核實。`;
    }
    if (typeof CARD_ART_FALLBACKS !== 'undefined') CARD_ART_FALLBACKS[def.id] = `images/cards/generated/${def.id}.svg`;
  });

  window.__V25397_CARD_BATCH__ = {
    version:'v2.5.397', added,
    sourcePages:[sourceShoes,sourceCloak],
    total:defs.length,
    missingItems:defs.filter(x => !ITEMS[x.id]).map(x => x.id),
    missingCards:defs.filter(x => !CARDS[x.id]).map(x => x.id)
  };
})();
